/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // DuckDB-WASM requires WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // DuckDB-WASM files need to be treated as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Enable CORS headers for WASM files and CSP for DuckDB
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          // DuckDB-WASM requires unsafe-eval for WebAssembly compilation and CDN access
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; worker-src 'self' blob:;"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
