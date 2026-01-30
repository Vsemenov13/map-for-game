// При npm start: webpack на 3000, vercel dev на 3001; /api/places проксируется на API.
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
