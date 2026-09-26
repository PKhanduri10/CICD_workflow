import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // Ab 'npm run dev' 5173 ki jagah 3000 par chalega
    open: true,  // Dev server start hote hi browser auto-open ho jayega
  },
  build: {
    outDir: 'dist', // Production build files ko dist folder mein rakhega
  },
});