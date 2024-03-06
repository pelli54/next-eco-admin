/** @type {import('next').NextConfig} */
import {PrismaPlugin} from '@prisma/nextjs-monorepo-workaround-plugin'

const nextConfig = {
    transpilePackages: ['lucide-react'], // add this
    webpack: (config, { isServer }) => {
        if (isServer) {
          config.plugins = [...config.plugins, new PrismaPlugin()]
        }
    
        return config
      },
}

export default nextConfig
