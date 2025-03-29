import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
      input: resolve(__dirname, 'index.html'),
      output: {
        // Keep the directory structure consistent
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name].[hash][extname]'
          }
          // Put images in the img directory
          if (assetInfo.name?.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
            return 'img/[name].[hash][extname]'
          }
          return '[name].[hash][extname]'
        }
      }
    }
  },
  server: {
    // Configure for local development
    port: 5173, // Default Vite port
    strictPort: false, // Allow fallback to next available port
    cors: true
  }
}) 