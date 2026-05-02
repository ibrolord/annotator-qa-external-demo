import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Connect } from 'vite';

const checkoutFixed = true;

function checkoutSessionMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const requestUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (requestUrl.pathname !== '/api/checkout/session') {
      next();
      return;
    }
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'method_not_allowed' }));
      return;
    }
    if (!checkoutFixed) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'stripe_modal_failed' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, checkout_url: 'https://checkout.example.test/session' }));
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'checkout-session-middleware',
      configureServer(server) {
        server.middlewares.use(checkoutSessionMiddleware());
      },
      configurePreviewServer(server) {
        server.middlewares.use(checkoutSessionMiddleware());
      },
    },
  ],
});
