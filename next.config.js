/** @type {import('next').NextConfig} */
const { withPlausibleProxy } = require('next-plausible');

const nextConfig = {
  reactStrictMode: true,
  // `next dev` otherwise writes an AGENTS.md and a CLAUDE.md into the repo on every run.
  agentRules: false,
};

const plausibleConfig = {
  customDomain: 'https://analytics.serubin.net',
  selfHosted: true,
  trackOutboundLinks: true,
  taggedEvents: true,
};

module.exports = withPlausibleProxy(plausibleConfig)(nextConfig);
