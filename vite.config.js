import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 5174,
    proxy: {
      '/proxy-lando': {
        target: 'https://lando.itsoffbrand.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-lando/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://landonorris.com/');
            proxyReq.setHeader('Origin', 'https://landonorris.com');
          });
        }
      },
      '/proxy-assets': {
        target: 'https://assets.itsoffbrand.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-assets/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://landonorris.com/');
            proxyReq.setHeader('Origin', 'https://landonorris.com');
          });
        }
      },
      '/proxy-website-files': {
        target: 'https://cdn.prod.website-files.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-website-files/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://landonorris.com/');
            proxyReq.setHeader('Origin', 'https://landonorris.com');
          });
        }
      }
    }
  }
});
