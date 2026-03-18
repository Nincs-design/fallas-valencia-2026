import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/fallas-valencia-2026/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
