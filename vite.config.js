import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/ for all options

export default defineConfig(({ command, mode }) => {
  // Build for standalone static hosting when running on Render, Vercel, or static mode.
  const staticDeploy =
    process.env.RENDER === 'true' ||
    process.env.VERCEL === '1' ||
    process.env.VITE_STATIC_DEPLOY === 'true' ||
    mode === 'static'

  return {
    plugins: [react()],

    base:
      command === 'serve' || staticDeploy
        ? '/'
        : '/static/react/',

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
})
