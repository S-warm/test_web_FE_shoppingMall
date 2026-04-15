const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // 프론트에서 '/api'로 시작하는 요청을 보낼 때만 낚아챕니다.
    createProxyMiddleware({
      target: 'invigorating-analysis-production-6785.up.railway.app', // 수종님의 Spring Boot 서버로 전달
      changeOrigin: true,
    })
  );
};