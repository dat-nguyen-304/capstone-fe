/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [
            "cdn3d.iconscout.com"
        ]
    }
}

module.exports = nextConfig
