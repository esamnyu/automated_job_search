import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 5173,
    host: true, // Needed for network access
    open: true, // Opens the browser automatically
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
        }
      }
    }
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics'
    ],
  },
  
  define: {
    // This ensures proper Firebase initialization with environment variables
    'process.env': {}
  }
});