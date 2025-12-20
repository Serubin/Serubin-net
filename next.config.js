/** @type {import('next').NextConfig} */
const path = require('path');
const { withPlausibleProxy } = require('next-plausible')

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

const plausibleConfig = {
  customDomain: 'https://analytics.serubin.net',
  selfHosted: true,
  trackOutboundLinks: true,
  taggedEvents: true,
}

module.exports = withPlausibleProxy(plausibleConfig)(nextConfig);
