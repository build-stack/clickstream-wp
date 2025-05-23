import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/admin',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      // Make sure to generate outputs as IIFE format (not ES modules)
      output: {
        format: 'iife',
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
      }
    },
    // Generate sourcemaps for easier debugging
    sourcemap: true,
    // Ensure proper bundling for older browsers
    target: 'es2015',
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      // API Proxy - rewrite to WordPress REST API format
      '/wp-json/clickstream-wp/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        rewrite: (path) => path.replace('/wp-json', '/index.php?rest_route=')
      },
      // For WordPress core API endpoints
      '/index.php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}); 