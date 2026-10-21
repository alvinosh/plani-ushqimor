import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works at https://<user>.github.io/<repo>/ without
// hard-coding the repository name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
