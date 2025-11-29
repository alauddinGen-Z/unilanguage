/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // ✅ TASK 3: Security Headers
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY', // Prevents clickjacking attacks
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff', // Prevents MIME type sniffing
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin', // Controls referrer information
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block', // Enables XSS filtering
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()', // Restricts browser features
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
