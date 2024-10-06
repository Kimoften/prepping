"use client";

import './page.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import NavigationBar from '../components/NavigationBar';

export default function Feedback() {
  const router = useRouter()
  const [feedbackData, setFeedbackData] = useState({
    1: { answer: '내 답변 1', suggestion: '수정안 1' },
    2: { answer: '내 답변 2', suggestion: '수정안 2' },
  });

  const handleSave = () => {
    // 데이터를 로컬 스토리지에 저장하는 예시입니다. 실제 백엔드와 연동할 때는 API 호출을 사용할 수 있습니다.
    localStorage.setItem('mypageLibrary', JSON.stringify(feedbackData));
    alert('마이페이지 라이브러리에 저장되었습니다.');
  };

  return (
    <div className="feedback-container w-full overflow-y-auto items-center bg-white">
      <NavigationBar />
      <div className="font-bold text-3xl text-black mt-[126px] items-start w-[1040px] font-['Pretendard']">
        <span>OO 면접 레포트</span>
      </div>
      <div className="w-[1040px] flex flex-col justify-start items-start gap-[18px]">
        <div className="feedback-number">1</div>
        <div className="feedback-content">
          <div className="feedback-section">
            <label>내 답변</label>
            <div className="feedback-box">{feedbackData[1].answer}</div>
          </div>
          <div className="feedback-section">
            <label>수정안</label>
            <div className="feedback-box large">{feedbackData[1].suggestion}</div>
          </div>
        </div>
      </div>
      <div className="w-full px-[200px] py-[30px] bg-gradient-to-r from-[#eaedff] to-[#acbbff] flex flex-col justify-start items-start gap-[18px]">
        <div className="feedback-number">2</div>
        <div className="feedback-content">
          <div className="feedback-section">
            <label>내 답변</label>
            <div className="feedback-box">{feedbackData[2].answer}</div>
          </div>
          <div className="feedback-section">
            <label>수정안</label>
            <div className="feedback-box large">{feedbackData[2].suggestion}</div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 추가 */}
      <button className="save-button" onClick={handleSave}>
        저장하기
      </button>
      <div className="w-[1440px] h-[179px] relative bg-[#e9e9e9]" />
    </div>
  );
}
