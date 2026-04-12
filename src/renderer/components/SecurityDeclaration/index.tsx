/**
 * SecurityDeclaration - 安全声明组件
 * 在用户连接数据库前显示，建立信任
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

interface SecurityDeclarationProps {
  onAccept: () => void
  onLearnMore: () => void
}

export const SecurityDeclaration: React.FC<SecurityDeclarationProps> = ({
  onAccept,
  onLearnMore
}) => {
  const { mode } = useTheme()
  const [accepted, setAccepted] = useState(false)
  const isDark = mode === 'dark'

  const securityGuarantees = [
    {
      icon: '🔒',
      title: '只读权限',
      description: '仅使用 SELECT 查询权限，永不执行 INSERT/UPDATE/DELETE',
      color: 'green'
    },
    {
      icon: '💻',
      title: '本地处理',
      description: '所有数据在本地处理，不会上传到任何远程服务器',
      color: 'blue'
    },
    {
      icon: '🔐',
      title: '加密存储',
      description: '数据库凭据使用 AES-256 加密存储在本地',
      color: 'purple'
    },
    {
      icon: '📋',
      title: '审计日志',
      description: '记录所有查询操作，可随时查看和导出',
      color: 'orange'
    },
    {
      icon: '🧹',
      title: '自动清理',
      description: '断开连接时自动清除本地缓存数据',
      color: 'red'
    },
    {
      icon: '🚫',
      title: '无第三方追踪',
      description: '不收集任何使用数据，完全匿名使用',
      color: 'gray'
    }
  ]

  const getColorClass = (color: string) => {
    const colors = {
      green: isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-700 border-green-200',
      blue: isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
      purple: isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200',
      orange: isDark ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-700 border-orange-200',
      red: isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200',
      gray: isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-50 text-gray-700 border-gray-200'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-6 space-y-6 ${
        isDark
          ? 'bg-background-secondary border-white/[0.08]'
          : 'bg-white border-gray-200 shadow-lg'
      }`}
    >
      {/* 标题 */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
          isDark ? 'bg-green-500/20' : 'bg-green-100'
        }`}>
          <span className="text-3xl">🛡️</span>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
          数据安全保障
        </h3>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          我们承诺以下安全措施，保护您的数据安全
        </p>
      </div>

      {/* 保障列表 */}
      <div className="grid grid-cols-2 gap-4">
        {securityGuarantees.map((guarantee, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border ${getColorClass(guarantee.color)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{guarantee.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm mb-1 ${
                  isDark ? 'text-slate-200' : 'text-gray-900'
                }`}>
                  {guarantee.title}
                </h4>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  {guarantee.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 技术说明 */}
      <div className={`p-4 rounded-xl border ${
        isDark
          ? 'bg-blue-500/10 border-blue-500/20'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
            <div className="font-semibold mb-1">技术实现细节：</div>
            <ul className="space-y-1 ml-4 list-disc">
              <li>使用 PostgreSQL/MySQL 的只读角色连接（SELECT 权限）</li>
              <li>SQL 注入防护和查询超时限制（最多 30 秒）</li>
              <li>结果集大小限制（最多 10,000 行）</li>
              <li>凭据使用系统 Keychain 加密存储</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 用户确认 */}
      <div className="space-y-4">
        <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
          isDark
            ? 'border-white/[0.08] hover:border-white/[0.15] bg-white/5'
            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
        } ${accepted ? (isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-500 bg-green-50') : ''}`}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
            <div className="font-semibold mb-1">我已了解并同意以上安全承诺</div>
            <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              点击连接即表示您同意我们仅使用只读权限访问您的数据库
            </div>
          </div>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onLearnMore}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            查看详细隐私政策 →
          </button>
          <button
            onClick={onAccept}
            disabled={!accepted}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            我已了解，继续连接
          </button>
        </div>
      </div>

      {/* 信任标识 */}
      <div className={`text-center pt-4 border-t ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
          您的数据安全是我们的首要任务 · 所有操作均符合 GDPR 和 SOC2 标准
        </div>
      </div>
    </motion.div>
  )
}

export default SecurityDeclaration
