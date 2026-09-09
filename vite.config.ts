/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: base = '/<repo>/' (워크플로에서 VITE_BASE 주입)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  server: { port: 5174 },
  test: { include: ['tests/**/*.test.ts'] },
})
