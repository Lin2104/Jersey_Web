import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),
    react()],
    server: {
    // This tells the Vite development server to forward any request 
    // starting with '/api' to the backend running on port 5000.
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 🚨 CRITICAL: Must match your backend port
        changeOrigin: true, // Necessary for virtual hosted sites
        secure: false,      // Use false for local development
      },
    },
  },
  
})
