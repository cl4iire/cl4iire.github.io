import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {photoOrderPlugin} from './photo-order-plugin';
import {siteSettingsPlugin} from './site-settings-plugin';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    // Repo "cl4iire.github.io" = GitHub user site, served at the domain root
    base: '/',
    
    plugins: [react(), tailwindcss(), photoOrderPlugin(), siteSettingsPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});