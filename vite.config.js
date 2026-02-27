import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})

  return {
    plugins: [react()],
    base: command === 'serve' || staticDeploy ? '/' : '/static/react/',
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: staticDeploy ? 'dist' : '../../../static/react',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'app-[hash].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  }

