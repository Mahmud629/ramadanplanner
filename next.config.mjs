/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` writes the site to ./out, which Firebase Hosting serves.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
