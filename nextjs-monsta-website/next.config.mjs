/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/category/:category/:subCategory/:subSubCategory',
        destination: '/categories/:subSubCategory',
        permanent: true,
      },
      {
        source: '/category/:slug',
        destination: '/categories/:slug',
        permanent: true,
      },
      {
        source: '/onlinestore',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/online-store',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/onlineStore',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/privacypolicy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/TermOfUse',
        destination: '/terms-of-use',
        permanent: true,
      },
      {
        source: '/termofuse',
        destination: '/terms-of-use',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
