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
        destination: '/floating-elements-demo',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 