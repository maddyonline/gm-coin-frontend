/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
    '@blocto/sdk',
    '@project-serum/sol-wallet-adapter',
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-wallets',
    '@solana/wallet-adapter-material-ui',
    '@solana/wallet-adapter-phantom',
    '@project-serum/anchor',
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
    reactStrictMode: true,
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false, crypto: false };

        return config;
    },
});