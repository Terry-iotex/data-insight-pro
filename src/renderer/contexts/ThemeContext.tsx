/**
 * Theme Context - 主题管理
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeMode, getTokens } from '../constants/design-tokens'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  tokens: ReturnType<typeof getTokens>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme') as ThemeMode
    return saved || 'dark'
  })

  useEffect(() => {
    // 保存到 localStorage
    localStorage.setItem('theme', mode)

    // 更新 HTML class
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.style.backgroundColor = '#0B1220'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.backgroundColor = '#F8FAFC'
    }
  }, [mode])

  const toggleTheme = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const tokens = getTokens(mode)

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, tokens }}>
      {children}
    </ThemeContext.Provider>
  )
}
