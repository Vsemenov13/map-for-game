module.exports = {
  '/api/places': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/api/v*/**': {
    target: '',
    changeOrigin: true,
  },
};
