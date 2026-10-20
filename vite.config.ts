import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'womens-day-html-entry',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const incoming = request as { url?: string };
          if (/^\/20-10(?:\?|$)/.test(incoming.url ?? '')) {
            incoming.url = incoming.url!.replace('/20-10', '/20-10/index.html');
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const incoming = request as { url?: string };
          if (/^\/20-10(?:\?|$)/.test(incoming.url ?? '')) {
            incoming.url = incoming.url!.replace('/20-10', '/20-10/index.html');
          }
          next();
        });
      },
    },
  ],
  build: { rollupOptions: { input: { main: 'index.html', womensDay: '20-10/index.html' } } },
});
