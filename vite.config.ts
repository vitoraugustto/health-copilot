import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@common': path.resolve(__dirname, './src/common/'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@lib': path.resolve(__dirname, './src/lib/'),
    },
  },
  plugins: [react()],
});
