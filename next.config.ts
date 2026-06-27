import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': `${process.cwd()}/app/src/components`,
      '@lib': `${process.cwd()}/app/src/lib`,
      '@hooks': `${process.cwd()}/app/src/hooks`,
      '@src': `${process.cwd()}/app/src`,
    };
    return config;
  },
};

export default withMDX(nextConfig);
