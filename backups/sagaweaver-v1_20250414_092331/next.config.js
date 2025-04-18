/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuración para permitir importar CSS directamente en componentes
  webpack(config) {
    return config;
  },
  // Añadir rutas de redirección si son necesarias
  async redirects() {
    return [
      {
        source: '/',
        destination: '/components-demo',
        permanent: false,
      },
      {
        source: '/advanced',
        destination: '/advanced-elements-demo',
        permanent: false,
      },
      {
        source: '/analytics',
        destination: '/panel-analytics',
        permanent: false,
      },
      {
        source: '/editor',
        destination: '/panel-editor',
        permanent: false,
      },
      {
        source: '/themes',
        destination: '/theme-creator',
        permanent: false,
      },
      {
        source: '/icons',
        destination: '/icon-library',
        permanent: false,
      },
      {
        source: '/components',
        destination: '/components-demo',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 