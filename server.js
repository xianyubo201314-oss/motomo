import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 配置代理规则，突破防盗链
const proxyOptions = {
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Referer', 'https://landonorris.com/');
      proxyReq.setHeader('Origin', 'https://landonorris.com');
    },
    proxyRes: (proxyRes, req, res) => {
      proxyRes.headers['access-control-allow-origin'] = '*';
    }
  }
};

// Lando 专属 JS 代理
app.use('/proxy-lando', createProxyMiddleware({
  target: 'https://lando.itsoffbrand.io',
  pathRewrite: { '^/proxy-lando': '' },
  ...proxyOptions
}));

// Rive 动画资源代理
app.use('/proxy-assets', createProxyMiddleware({
  target: 'https://assets.itsoffbrand.io',
  pathRewrite: { '^/proxy-assets': '' },
  ...proxyOptions
}));

// Webflow 静态图片与字体资源代理
app.use('/proxy-website-files', createProxyMiddleware({
  target: 'https://cdn.prod.website-files.com',
  pathRewrite: { '^/proxy-website-files': '' },
  ...proxyOptions
}));

// Root level assets loaded by lando JS
app.use(['/models', '/textures', '/hdri', '/fonts', '/dev-js'], createProxyMiddleware({
  target: 'https://lando.itsoffbrand.io',
  pathRewrite: function (path, req) {
    return '/gl' + path;
  },
  ...proxyOptions
}));

// 托管静态文件 (针对构建后的 dist 目录或直接托管 public)
const staticDir = path.join(__dirname, 'public'); // 或者用 'dist' 如果有构建步骤
app.use(express.static(staticDir));

app.use((req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
