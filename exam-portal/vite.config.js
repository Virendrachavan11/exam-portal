import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const VITE_BACKEND_URL = "https://exam-portal-backend-hvq6.onrender.com"

const BACKEND_URL =
  import.meta.env.PROD && VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3000";

export default BACKEND_URL;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
