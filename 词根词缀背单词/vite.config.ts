import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      __DEEPSEEK_FALLBACK_KEY__: JSON.stringify(env['codex-project-using-deepseek'] ?? ''),
    },
  };
});
