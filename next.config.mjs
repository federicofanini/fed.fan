/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "randomuser.me" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "fuchsia-eldest-koi-370.mypinata.cloud" },
      { hostname: "www.uneed.best" },
    ],
  },
  transpilePackages: ["geist"],
};

export default nextConfig;
