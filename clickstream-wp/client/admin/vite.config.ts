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
        // Keep the directory structure consistent
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/chunks/[name].[hash].js',
        assetFileNames: ({name}) => {
          if (/\.css$/.test(name ?? '')) {
            return 'css/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
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