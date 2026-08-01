/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // allows any hosted product photo URL (Cloudinary, imgbb, etc.)
    ],
  },
};

module.exports = nextConfig;
