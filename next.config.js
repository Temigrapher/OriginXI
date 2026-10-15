/** @type {import('next').NextConfig} */
// Product photos are plain <img> tags (Supabase Storage or any pasted URL), so Next's image optimizer is not used.
// Do not re-add a wildcard `images.remotePatterns`: it lets anyone use this site's /_next/image to fetch and serve
// images from any website, and it is the exact setup the Next.js image-optimizer security advisories describe.
const nextConfig = {};

module.exports = nextConfig;
