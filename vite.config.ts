import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', { target: '18' }],
        ]
      }
    }),
    nodePolyfills(),
    
  ],
})