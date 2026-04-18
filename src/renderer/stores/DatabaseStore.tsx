/**
 * 数据库类型状态管理
 * 支持在 PostgreSQL/MySQL/MongoDB 之间切换
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DatabaseType } from '../types/database'
import { notificationManager } from '../components/NotificationCenter'

interface DatabaseContextType {
  currentDatabase: DatabaseType
  setDatabaseType: (type: DatabaseType) => void
  databases: DatabaseConfig[]
  addDatabase: (config: DatabaseConfig | DatabaseConfig[]) => void
  removeDatabase: (id: string) => void
  updateDatabase: (id: string, config: Partial<DatabaseConfig>) => void
  getDatabaseById: (id: string) => DatabaseConfig | undefined
}

export interface TableSchemaInfo {
  tableType: string
  confidence: number
  suggestedTemplateIds: string[]
  needsConfirmation: boolean
  analysisSource: 'ai' | 'heuristic'
  columns: Array<{
    name: string
    sampleValues: string[]
    inferredType: string
  }>
}

export interface DatabaseConfig {
  id: string
  name: string
  type: DatabaseType | string
  host: string
  port: number
  database: string
  username: string
  password?: string
  connected: boolean
  // 所属项目 id，默认为 'default'
  projectId?: string
  // 文件类型数据源的 schema 分析结果
  schemaInfo?: TableSchemaInfo
  // 用户已在数据字典中确认过该表的字段含义
  schemaConfirmed?: boolean
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

const defaultDatabases: DatabaseConfig[] = []

const DATABASE_STORE_KEY = 'data_insight_databases'
const CURRENT_DB_KEY = 'data_insight_current_database'

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDatabase, setCurrentDatabase] = useState<DatabaseType>(DatabaseType.PostgreSQL)
  const [databases, setDatabases] = useState<DatabaseConfig[]>([])

  // 初始化：从 localStorage 加载配置
  useEffect(() => {
    loadDatabases()
    loadCurrentDatabase()
  }, [])

  const loadDatabases = () => {
    try {
      const saved = localStorage.getItem(DATABASE_STORE_KEY)
      if (saved) {
        setDatabases(JSON.parse(saved))
      } else {
        // 首次使用，保存默认配置
        setDatabases(defaultDatabases)
        saveDatabases(defaultDatabases)
      }
    } catch (error) {
      console.error('加载数据库配置失败:', error)
      setDatabases(defaultDatabases)
    }
  }

  const loadCurrentDatabase = () => {
    try {
      const saved = localStorage.getItem(CURRENT_DB_KEY)
      if (saved) {
        setCurrentDatabase(saved as DatabaseType)
      }
    } catch (error) {
      console.error('加载当前数据库失败:', error)
    }
  }

  const saveDatabases = (dbs: DatabaseConfig[]) => {
    localStorage.setItem(DATABASE_STORE_KEY, JSON.stringify(dbs))
  }

  const setDatabaseType = (type: DatabaseType) => {
    setCurrentDatabase(type)
    localStorage.setItem(CURRENT_DB_KEY, type)
    notificationManager.success('数据库已切换', `当前使用 ${type}`)
  }

  const addDatabase = (config: DatabaseConfig | DatabaseConfig[]) => {
    const configs = Array.isArray(config) ? config : [config]
    setDatabases(prev => {
      const newDatabases = [...prev, ...configs]
      saveDatabases(newDatabases)
      return newDatabases
    })
    notificationManager.success('添加成功', `${configs.length} 个数据源已添加`)
  }

  const removeDatabase = (id: string) => {
    const newDatabases = databases.filter(db => db.id !== id)
    setDatabases(newDatabases)
    saveDatabases(newDatabases)

    // 如果删除的是当前数据库，切换到默认
    const removedDb = databases.find(db => db.id === id)
    if (removedDb && removedDb.type === currentDatabase) {
      setDatabaseType(DatabaseType.PostgreSQL)
    }

    notificationManager.success('删除成功', '数据库配置已删除')
  }

  const updateDatabase = (id: string, updates: Partial<DatabaseConfig>) => {
    const newDatabases = databases.map(db =>
      db.id === id ? { ...db, ...updates } : db
    )
    setDatabases(newDatabases)
    saveDatabases(newDatabases)
    notificationManager.success('更新成功', '数据库配置已更新')
  }

  const getDatabaseById = (id: string) => {
    return databases.find(db => db.id === id)
  }

  return (
    <DatabaseContext.Provider
      value={{
        currentDatabase,
        setDatabaseType,
        databases,
        addDatabase,
        removeDatabase,
        updateDatabase,
        getDatabaseById
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider')
  }
  return context
}

export default DatabaseProvider
