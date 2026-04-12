/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // 启用 class 策略的暗色模式
  theme: {
    extend: {
      colors: {
        // 文字色 - 浅色模式（默认）
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',

        // 浅色模式 - Light Mode
        background: {
          primary: '#F8FAFC',    // 整体背景（微灰）
          secondary: '#FFFFFF',  // 卡片背景（纯白）
          tertiary: '#F1F5F9',   // 次级背景
          elevated: '#FFFFFF',   // 悬浮卡片
          hover: '#F1F5F9',      // 悬停状态
        },

        // 主色 - 克制的 AI 感
        primary: '#6366F1',      // Indigo
        'primary-hover': '#4F46E5', // Indigo Darker
        secondary: '#8B5CF6',    // Purple
        accent: '#06B6D4',       // Cyan

        // 状态色
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',

        // 文字色 - 深灰层级
        text: {
          primary: '#0F172A',    // 主标题（深灰）
          secondary: '#334155',  // 正文
          tertiary: '#64748B',   // 说明
          muted: '#94A3B8',      // 禁用
        },

        // 边框色
        border: {
          DEFAULT: '#E2E8F0',
          hover: '#CBD5E1',
        },
      },

      // 暗色模式颜色
      dark: {
        background: {
          primary: '#0B1220',
          secondary: '#111827',
          tertiary: '#1F2937',
          elevated: '#1F2937',
          hover: '#374151',
        },

        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#A78BFA',

        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',

        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
          muted: '#4B5563',
        },

        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },

    // 间距
    spacing: {
      '0': '0px',
      px: '1px',
      '0.5': '2px',
      '1': '4px',
      '1.5': '6px',
      '2': '8px',
      '2.5': '10px',
      '3': '12px',
      '3.5': '14px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '40px',
      '5xl': '48px',
      '6xl': '64px',
      section: '24px',
      block: '16px',
      compact: '8px',
    },

    // 圆角
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },

    // 阴影
    boxShadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
      md: '0 4px 12px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 24px rgba(0, 0, 0, 0.08)',
    },

    // 动画
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      'slide-up': {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      'slide-in-right': {
        '0%': { transform: 'translateX(20px)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      'scale-in': {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
    },
    animation: {
      'fade-in': 'fade-in 200ms ease-out',
      'slide-up': 'slide-up 200ms ease-out',
      'slide-in-right': 'slide-in-right 300ms ease-out',
      'scale-in': 'scale-in 200ms ease-out',
    },
  },
  plugins: [],
}
