import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleVoteSubmit, handleVoteStatus } from './api/_lib/voteHandler.js';

// Local Vite middleware plugin for handling /api/vote & /api/vote/status during npm run dev
function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/vote/status' && req.method === 'GET') {
          return await handleVoteStatus(req, res);
        }

        if (req.url === '/api/vote' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            let parsedBody = {};
            try { parsedBody = JSON.parse(body); } catch (e) {}
            return await handleVoteSubmit(req, res, parsedBody);
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
