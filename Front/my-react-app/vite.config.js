import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@axios': path.resolve(__dirname, './src/axiosInstance.js'),
    },
  },
   
  server: {
    
    proxy: {  

      '/api': {
        target: 'http://localhost:2450',  // Only for development proxy
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
