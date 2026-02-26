/** @type {import('vite').UserConfig} */

export default ({
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
      interval: 300,
    },
    proxy: {
      '/products': 'http://localhost:3000',
      '/cart': 'http://localhost:3000',
      '/reset': 'http://localhost:3000',
    },
  },
  cacheDir: '/var/tmp/.vite',
});
