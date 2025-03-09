import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/", // Ensures correct base path
  build: {
    outDir: "dist", // Ensures Vercel knows where the build output is
  },
  server: {
    historyApiFallback: true, // Ensures client-side routing works
  }
})
