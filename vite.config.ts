import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base must match the GitHub Pages repo name exactly (case-sensitive).
// Repo: valeLib/VLZ_Portfolio -> https://valelib.github.io/VLZ_Portfolio/
export default defineConfig({
  base: '/VLZ_Portfolio/',
  plugins: [react()],
})
