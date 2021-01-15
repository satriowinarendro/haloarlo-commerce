const withPlugins = require('next-compose-plugins')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: !!process.env.BUNDLE_ANALYZE,
})({
  images: {
    domains: ['cdn11.bigcommerce.com'],
  },
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      {
        source: '/checkout',
        destination: '/api/bigcommerce/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      {
        source: '/logout',
        destination: '/api/bigcommerce/customers/logout?redirect_to=/',
      },
      // Rewrites for /search
      {
        source: '/search/designers/:name',
        destination: '/search',
      },
      {
        source: '/search/designers/:name/:category',
        destination: '/search',
      },
      {
        // This rewrite will also handle `/search/designers`
        source: '/search/:category',
        destination: '/search',
      },
    ]
  },
})

const rehypePrism = require("@mapbox/rehype-prism");

const withMdxEnhanced = require("next-mdx-enhanced")({
  layoutPath: "pages/product/layout",
  defaultLayout: true,
  usesSrc: false,
  rehypePlugins: [rehypePrism],
})({
  pageExtensions: ["mdx", "tsx"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fixes packages that depend on fs/module module
    if (!isServer) {
      config.node = { fs: 'empty', module: 'empty' }
    }
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          type: "json",
          use: "yaml-loader",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
        },
      ]
    );
    return config;
  },
});

module.exports = withPlugins([
  [withBundleAnalyzer],
  [withMdxEnhanced]
])
