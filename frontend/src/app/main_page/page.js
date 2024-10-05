"use client";

import { useRouter } from 'next/navigation';
import NavigationBar from '../components/NavigationBar';
import Image from 'next/image';
import Mic from '../../images/MainMic.svg';
import MainLogo from '../../images/MainLogo.svg';
import ClipboardLogo from '../../images/ClipboardLogo.svg';

export default function MainPage() {
    const router = useRouter();

    const handleUploadClick = () => {
        router.push('/interview_setting_page');
    };
    return (
        <div className="w-full flex flex-col h-screen bg-white overflow-hidden justify-between">
            {/* Navigation Bar */}
            <NavigationBar />
            {/* Main Content */}
            <div className="relative flex flex-col items-start px-20 mt-24 space-y-5">
                <div className="flex flex-col items-start mt-12 mb-10 width-[380px] height-[170px]">
                    <div className="relative w-full h-[60px] items-start">
                        <Image className="absolute left-8"
                            src={Mic}
                            alt="Mic"
                            width={35}
                            height={43}></Image>
                    </div>
                    <div className="text-6xl font-bold text-black">모의면접 바로 시작!</div>
                    <div className="text-gray-500 text-lg">
                        내 자소서 기반 맞춤형 면접 후 개꿀 피드백까지 받아보세요
                    </div>
                </div>

                {/* Interview Card */}
                <div className="flex flex-row w-[1040px] h-[401px] gap-6">
                    {/* Main Interview Card */}
                    <div className="flex flex-col justify-between p-12 bg-gradient-to-br from-[#6884FF] to-[#5171FF] rounded-lg w-[685px] space-y-6">
                        <div className="flex flex-col gap-[10px] items-start">
                            <div className="text-white text-lg font-medium opacity-70">임원면접</div>
                            <div className="text-white text-4xl font-semibold">면접 파이팅 아자작</div>
                        </div>
                        <div className="flex items-end space-x-5 justify-between">
                            <div className="flex flel-row gap-[11px]">
                                <button className="flex items-center justify-center h-16 px-6 py-4 space-x-2 bg-white/50 rounded-lg" onClick={handleUploadClick}>
                                    <span className="text-lg font-bold text-white">면접 시작</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                                <button className="flex items-center justify-center w-16 h-16 bg-white/30 rounded-lg">
                                    <Image className="relative"
                                        src={ClipboardLogo}
                                        alt="ClipboardLogo"
                                        width={24}
                                        height={24}></Image>
                                </button>
                            </div>
                            <Image className="relative"
                                src={MainLogo}
                                alt="MainLogo"
                                width={45}
                                height={54}>
                            </Image>
                        </div>
                    </div>

                    {/* Interview Practice Cards */}
                    <div className="flex flex-col space-y-5">
                        <div className="flex items-center justify-between w-[331px] p-6 bg-gray-200 rounded-lg h-1/3">
                            <div>
                                <div className="text-sm font-medium text-gray-500">임원면접</div>
                                <div className="text-2xl font-semibold text-gray-800">면접연습 2</div>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between w-[331px] p-6 bg-gray-200 rounded-lg h-1/3">
                            <div>
                                <div className="text-sm font-medium text-gray-500">임원면접</div>
                                <div className="text-2xl font-semibold text-gray-800">면접연습 3</div>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between w-[331px] p-6 bg-gray-100 border border-gray-300 rounded-lg h-1/3">
                            <div className="text-2xl font-medium text-blue-500">모의면접 추가</div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[120px] lg:h-[179px] bg-[#E9E9E9] mt-10 lg:mt-16"></div>
        </div>
    );
}
