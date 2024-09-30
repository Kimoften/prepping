"use client"

import './page.css'
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter();

    const handleUploadClick = () => {
        router.push('/upload_page');
    };

    return (
        <div className="container">
            <h1>마이페이지</h1>
            <button className="upload-button" onClick={handleUploadClick}>
                면접 시작하기
            </button>
        </div>
    );
}
