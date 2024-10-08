"use client";
import React from 'react';
import { useRouter } from 'next/navigation';


function NavigationBar() {
  const router = useRouter();

  const handleMy = () => {
    router.push('/main_page');
    // 여기서 API 호출을 통해 백엔드로 데이터를 전송할 수 있습니다.
  };

  const handleLogOut = () => {
    router.push('/');
  };

  return (
    <nav className="w-full flex flex-col items-center p-8 gap-2 absolute top-0 left-0 bg-white">
      <div className="w-[1038px] h-[38px] flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <div className="text-[30px] font-bold text-[#6884FF]">프레핑</div>
          <div className="text-[20px] font-bold text-gray-400/70">Prepping</div>
        </div>
        <div className="flex flex-row items-center gap-3 w-[180px]">
          <div className="flex justify-center items-center w-[91px] h-[38px]">
            <div className="text-[16px] font-bold text-[#A2A2A2] cursor-pointer" onClick={handleMy}>마이페이지</div>
          </div>
          <div className="flex justify-center items-center w-[77px] h-[38px] cursor-pointer">
            <div className="text-[16px] font-bold text-[#A2A2A2]" onClick={handleLogOut}>로그아웃</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
