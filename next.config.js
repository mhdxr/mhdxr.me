/** @type {import('next').NextConfig} */

// Whitelist of image hosts actually used by the app. Add a new entry here
// (rather than using a wildcard) when introducing a new external image source.
const remoteImageHosts = [
  // Spotify album art
  'i.scdn.co',
  // GitHub avatars / OG images
  'avatars.githubusercontent.com',
  'raw.githubusercontent.com',
  // Google profile pictures (next-auth Google provider)
  'lh3.googleusercontent.com',
  // DEV.to articles & user images
  'media.dev.to',
  'dev.to',
  'res.cloudinary.com',
  'secure.gravatar.com',
  // Personal CDN / WordPress blog assets
  'cloud.aulianza.com',
  'cms.aulianza.com',
  'wp.aulianza.com',
];

// Allow any subdomain under mhdxr.me (e.g. cms.mhdxr.me, cdn.mhdxr.me).
const remoteImagePatterns = [
  ...remoteImageHosts.map((hostname) => ({
    protocol: 'https',
    hostname,
  })),
  {
    protocol: 'https',
    hostname: '**.mhdxr.me',
  },
];

// Conservative security headers. Note: a strict Content-Security-Policy is
// intentionally NOT enabled here because the app loads many third-party
// resources (Spotify CDN, GitHub avatars, DEV.to, Firebase, etc.) and a
// misconfigured CSP would silently break those integrations. Add CSP later
// in report-only mode first.
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Note: `swcMinify` was removed; SWC minification is the default in Next.js 15.
  images: {
    remotePatterns: remoteImagePatterns,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
