/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,  // Strict Mode 비활성화
    async rewrites() {
        return [
            {
                source: '/api/:path*',  // 프론트엔드의 API 요청
                destination: 'https://port-0-prepping-m1xavyvwd17dd5c1.sel4.cloudtype.app/:path*',  // Flask 백엔드로 프록시
            }
        ];
    }
};

export default nextConfig;
