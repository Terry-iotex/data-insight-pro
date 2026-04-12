/**
 * 本地缓存管理器
 * 管理数据库查询结果的本地缓存，支持自动清理
 */

import { app } from 'electron'
import path from 'path'
import fs from 'fs/promises'

export interface CacheEntry {
  key: string
  data: any
  timestamp: number
  size: number
  query: string
  database: string
}

export interface CacheStats {
  totalEntries: number
  totalSize: number
  databases: Record<string, { entries: number; size: number }>
  oldestEntry?: number
  newestEntry?: number
}

/**
 * 缓存配置
 */
interface CacheConfig {
  maxEntries: number
  maxSize: number // MB
  ttl: number // 毫秒
  autoClear: boolean
  clearOnDisconnect: boolean
}

/**
 * 缓存管理器
 */
export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map()
  private config: CacheConfig = {
    maxEntries: 1000,
    maxSize: 100, // 100MB
    ttl: 30 * 60 * 1000, // 30分钟
    autoClear: true,
    clearOnDisconnect: false // 默认不自动清除，用户可选择
  }
  private cacheFilePath: string
  private cleanupTimer?: NodeJS.Timeout

  constructor() {
    const userDataPath = app.getPath('userData')
    this.cacheFilePath = path.join(userDataPath, 'cache', 'data-cache.json')
    this.loadCacheFromFile()

    // 定期清理过期缓存
    if (this.config.autoClear) {
      this.startCleanupTimer()
    }
  }

  /**
   * 生成缓存键
   */
  private generateKey(database: string, query: string): string {
    return `${database}:${query}`
  }

  /**
   * 添加缓存
   */
  async set(database: string, query: string, data: any): Promise<void> {
    const key = this.generateKey(database, query)
    const now = Date.now()
    const size = this.calculateSize(data)

    // 检查是否超过最大缓存数
    if (this.cache.size >= this.config.maxEntries) {
      await this.evictOldest()
    }

    // 检查是否超过最大缓存大小
    const currentSize = this.getTotalSize()
    if (currentSize + size > this.config.maxSize * 1024 * 1024) {
      await this.evictBySize(size)
    }

    this.cache.set(key, {
      key,
      data,
      timestamp: now,
      size,
      query,
      database
    })

    // 持久化到文件
    await this.saveCacheToFile()
  }

  /**
   * 获取缓存
   */
  async get(database: string, query: string): Promise<any | null> {
    const key = this.generateKey(database, query)
    const entry = this.cache.get(key)

    if (!entry) return null

    // 检查是否过期
    const now = Date.now()
    if (now - entry.timestamp > this.config.ttl) {
      this.cache.delete(key)
      await this.saveCacheToFile()
      return null
    }

    return entry.data
  }

  /**
   * 清除指定数据库的所有缓存
   */
  async clearDatabase(database: string): Promise<void> {
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (entry.database === database) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key)
    }

    await this.saveCacheToFile()
  }

  /**
   * 清除所有缓存
   */
  async clearAll(): Promise<void> {
    this.cache.clear()
    await this.saveCacheToFile()
  }

  /**
   * 获取缓存统计
   */
  getStats(): CacheStats {
    const stats: CacheStats = {
      totalEntries: this.cache.size,
      totalSize: 0,
      databases: {}
    }

    let oldest = Infinity
    let newest = -Infinity

    for (const entry of this.cache.values()) {
      stats.totalSize += entry.size

      // 按数据库统计
      if (!stats.databases[entry.database]) {
        stats.databases[entry.database] = { entries: 0, size: 0 }
      }
      stats.databases[entry.database].entries++
      stats.databases[entry.database].size += entry.size

      // 最老和最新条目
      if (entry.timestamp < oldest) oldest = entry.timestamp
      if (entry.timestamp > newest) newest = entry.timestamp
    }

    if (oldest !== Infinity) stats.oldestEntry = oldest
    if (newest !== -Infinity) stats.newestEntry = newest

    return stats
  }

  /**
   * 设置配置
   */
  setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config }

    if (config.autoClear !== undefined && config.autoClear) {
      this.startCleanupTimer()
    } else if (config.autoClear === false) {
      this.stopCleanupTimer()
    }
  }

  /**
   * 获取配置
   */
  getConfig(): CacheConfig {
    return { ...this.config }
  }

  /**
   * 清理过期缓存
   */
  async cleanupExpired(): Promise<number> {
    const now = Date.now()
    const expiredKeys: string[] = []
    let cleanedSize = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        expiredKeys.push(key)
        cleanedSize += entry.size
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key)
    }

    if (expiredKeys.length > 0) {
      await this.saveCacheToFile()
    }

    return cleanedSize
  }

  /**
   * 淘汰最老的缓存
   */
  private async evictOldest(): Promise<void> {
    let oldestKey: string | null = null
    let oldestTimestamp = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * 按大小淘汰缓存
   */
  private async evictBySize(requiredSize: number): Promise<void> {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)

    let freedSize = 0
    for (const [key, entry] of entries) {
      this.cache.delete(key)
      freedSize += entry.size
      if (freedSize >= requiredSize) break
    }
  }

  /**
   * 计算数据大小（字节）
   */
  private calculateSize(data: any): number {
    return JSON.stringify(data).length * 2 // 粗略估算，UTF-16 编码
  }

  /**
   * 获取总缓存大小
   */
  private getTotalSize(): number {
    let total = 0
    for (const entry of this.cache.values()) {
      total += entry.size
    }
    return total
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    this.stopCleanupTimer()
    this.cleanupTimer = setInterval(async () => {
      await this.cleanupExpired()
    }, 5 * 60 * 1000) // 每5分钟清理一次
  }

  /**
   * 停止清理定时器
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = undefined
    }
  }

  /**
   * 保存缓存到文件
   */
  private async saveCacheToFile(): Promise<void> {
    try {
      const cacheDir = path.dirname(this.cacheFilePath)
      await fs.mkdir(cacheDir, { recursive: true })

      const cacheData = Array.from(this.cache.entries())
      await fs.writeFile(
        this.cacheFilePath,
        JSON.stringify(cacheData),
        'utf-8'
      )
    } catch (error) {
      console.error('Failed to save cache to file:', error)
    }
  }

  /**
   * 从文件加载缓存
   */
  private async loadCacheFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(this.cacheFilePath, 'utf-8')
      const cacheData = JSON.parse(data)

      for (const [key, entry] of cacheData) {
        // 检查是否过期
        const now = Date.now()
        if (now - entry.timestamp <= this.config.ttl) {
          this.cache.set(key, entry)
        }
      }
    } catch (error) {
      // 文件不存在或读取失败，忽略
      console.debug('No cache file found or failed to load')
    }
  }

  /**
   * 销毁缓存管理器
   */
  async destroy(): Promise<void> {
    this.stopCleanupTimer()
    await this.saveCacheToFile()
  }
}

// 导出单例
export const cacheManager = new CacheManager()
