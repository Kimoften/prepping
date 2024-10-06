/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,  // Strict Mode 비활성화
    async rewrites() {
        return [
            {
                source: '/api/:path*',  // 프론트엔드의 API 요청
                destination: 'http://10.88.3.151:5000/:path*',  // Flask 백엔드로 프록시
            }
        ];
    }
};

export default nextConfig;
