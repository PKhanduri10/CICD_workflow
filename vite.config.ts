import { defineConfig } from 'vite';

export default defineConfig({
  // Exact repository name aage aur piche slashes ke saath
  base: '/CICD_workflow/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});