import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output to WordPress plugin assets directory
    outDir: '../../assets/admin',
    emptyOutDir: true,
    // Generate manifest for WordPress to understand the bundled files
    manifest: true,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'css/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    // Configure for local development
    port: 3000,
    strictPort: true,
    cors: true
  }
}) 