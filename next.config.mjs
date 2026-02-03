/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  allowedDevOrigins: [
    'http://localhost:3002',
    'http://172.17.98.73:3002',
  ],
};

export default nextConfig;
