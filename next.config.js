/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'cdn3d.iconscout.com',
            'intaadvising.gatech.edu',
            'dienmaycongthanh.vn',
            'motiongility.com',
            'www.ninjatropic.com',
            'dienbientv.vn',
            'cdn2.hoc247.vn',
            'res.cloudinary.com',
            'images.unsplash.com',
            'hoc247.vn',
            'lh3.googleusercontent.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            }
        ]
    }
};

module.exports = nextConfig;
