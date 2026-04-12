import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@main': path.resolve(__dirname, './src/main'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  root: 'src/renderer',
  build: {
    outDir: '../../dist-renderer',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // 确保从正确的位置解析
    fs: {
      strict: false,
    },
  },
})
