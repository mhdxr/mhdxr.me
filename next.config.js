const imageHostnames = [
  'mhdxr.me',
  'aulianza.id',
  'avatars.githubusercontent.com',
  'lh3.googleusercontent.com',
  'i.scdn.co',
  'secure.gravatar.com',
  'images.unsplash.com',
].filter(Boolean);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: imageHostnames.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
  },
};

module.exports = nextConfig;
