/**
 * InsightBlock - AI洞察块组件（支持双模式）
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

interface InsightBlockProps {
  insights: Array<{
    icon: string
    text: string
  }>
}

export const InsightBlock: React.FC<InsightBlockProps> = ({ insights }) => {
  const { mode } = useTheme()
  const isDark = mode === 'dark'

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`
            flex items-start gap-3 p-4 rounded-xl border transition-all
            ${isDark
              ? 'bg-background-secondary hover:bg-background-tertiary border-white/[0.08]'
              : 'bg-white hover:bg-gray-50 border-gray-200 hover:shadow-md'
            }
          `}
        >
          <span className="text-xl">{insight.icon}</span>
          <p className="text-sm text-text-primary flex-1">{insight.text}</p>
        </motion.div>
      ))}
    </div>
  )
}
