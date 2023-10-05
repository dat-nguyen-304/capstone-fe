/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [
            "cdn3d.iconscout.com",
            "intaadvising.gatech.edu"
        ]
    }
}

module.exports = nextConfig
