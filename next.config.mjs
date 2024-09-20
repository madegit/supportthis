/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'files.edgestore.dev',
          port: '',
          pathname: '/**', // This will match any path on the domain
        },
      ],
    },
  reactStrictMode: true,
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },

          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

export default nextConfig