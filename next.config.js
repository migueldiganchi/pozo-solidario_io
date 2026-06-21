/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:1369'],
    },
  },
}

module.exports = nextConfig
