"use client";

import './page.css';
import Image from "next/image"
import TradeLogo from "../../images/TradeLogo.svg"
import Logo from "../../images/Logo.svg"
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import NavigationBar from '../components/NavigationBar';

export default function Feedback() {
  const router = useRouter()
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const feedbackData = [
    { id: 1, question: "1분 자기소개", answer: "저는 ... 입니다. 저의 장점은 ...", suggestion: "이렇게 해보세요" },
    { id: 2, question: "지원동기에 대한 질문", answer: "이 회사에 지원한 이유는 ...", suggestion: "이렇게 해보세요" },
    { id: 3, question: "인턴경험 대한 질문", answer: "저는 이전에 ... 회사에서 인턴 경험을 했습니다.", suggestion: "이렇게 해보세요" },
  ];
  const handleQuestionClick = (id) => {
    setSelectedQuestion(id);
  };

  // const [feedbackData, setFeedbackData] = useState({
  //   1: { answer: '내 답변 1', suggestion: '수정안 1' },
  //   2: { answer: '내 답변 2', suggestion: '수정안 2' },
  // });

  const handleSave = () => {
    // 데이터를 로컬 스토리지에 저장하는 예시입니다. 실제 백엔드와 연동할 때는 API 호출을 사용할 수 있습니다.
    localStorage.setItem('mypageLibrary', JSON.stringify(feedbackData));
    alert('마이페이지 라이브러리에 저장되었습니다.');
  };

  return (
    <div className="feedback-container w-full overflow-y-auto items-center bg-white">
      <NavigationBar />
      <div className="font-bold text-3xl text-black mt-[126px] items-start w-[1040px] font-['Pretendard'] mb-[40px]">
        <span>OO 면접 레포트</span>
      </div>

      <div className="w-[1040px] flex flex-col justify-start items-start gap-[18px] mb-16">
        <div className="relative h-[52px] justify-start items-start gap-1.5 inline-flex">
          {feedbackData.map((fdb) => (
            <div
              key={fdb.id}
              onClick={() => handleQuestionClick(fdb.id)}
              className={`px-5 py-3.5 bg-white rounded-[10px] border-2 flex-col justify-start items-start gap-2.5 inline-flex cursor-pointer ${selectedQuestion === fdb.id
                ? "border-[#6783ff]/50 text-[#6783ff] font-normal text-xl"
                : "border-white text-[#949494] font-normal text-xl"
                }`}
            >
              <div className="self-stretch justify-start items-center gap-[9px] inline-flex">
                <div className="text-xl font-normal font-['Pretendard']">
                  {fdb.question}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Answer Display */}
        {selectedQuestion && (
          <div className="relative w-full flex flex-col gap-[18px]">
            <div className="relative w-full h-[126px] p-[30px] bg-[#f7f7f7] rounded-2xl flex-col justify-start items-start">
              <div className="self-stretch h-[66px] flex-col justify-start items-start gap-[116px] flex">
                <div className="flex-col justify-start items-start gap-4 flex">
                  <div className="text-[#a2a2a2] text-lg font-normal font-['Pretendard']">내 답변</div>
                  <div><span className="text-black text-2xl font-normal font-['Pretendard']">{feedbackData.find((q) => q.id === selectedQuestion)?.answer}</span></div>
                </div>
              </div>
            </div>

            <div className="relative w-full h-[149px] p-[30px] bg-[#f2f5ff] rounded-2xl border border-[#8ea2ff]/50 flex-col justify-center items-start gap-4 inline-flex">
              <div className="p-2.5 bg-white rounded-[10px] border border-[#94a7ff]/60 justify-start items-center gap-2.5 inline-flex">
                <Image className="relative"
                  src={TradeLogo}
                  alt="TradeLogo"
                  width={24}
                  height={24}></Image>
                <div className="text-[#718bff] text-lg font-medium font-['Pretendard']">이렇게 답해보는 건 어때요?</div>
              </div>
              <span className="text-black text-2xl font-normal font-['Pretendard']">{feedbackData.find((q) => q.id === selectedQuestion)?.suggestion}</span>
            </div>
          </div>
        )}
      </div>

      {/*면접 코칭 박스*/}
      <div className="w-full px-[200px] py-[30px] bg-gradient-to-r from-[#eaedff] to-[#acbbff] flex flex-col justify-start items-center gap-11">
        <div className="relative w-[1040px] h-11 justify-start items-center gap-3 inline-flex">
          <Image className="relative"
            src={Logo}
            alt="Logo"
            width={30}
            height={36}></Image>
          <div className="text-[#6783ff] text-2xl font-extrabold font-['NanumSquareRoundOTF']">프레핑 면접 코칭</div>
        </div>
        <div className="flex flex-row gap-6 h-[366px]">
          <div className="relative flex flex-col gap-[22px]">
            {/*기준적합성*/}
            <div className="relative flex flex-col gap-5">
              <div className="w-[331px] h-[172px] p-6 bg-white/50 rounded-[20px] border border-[#bcc8ff]/30 flex-col justify-start items-start gap-5 inline-flex">
                <div className="self-stretch text-[#718bff] text-2xl font-medium font-['Pretendard']">기준 적합성</div>
                <div className="self-stretch h-[75px] p-4 bg-[#f7f7f7] rounded-xl flex-col justify-start items-end gap-2.5 flex">
                  <div className="justify-start items-end gap-1 inline-flex">
                    <div className="w-[51px] h-[43px] text-[#6783ff] text-[40px] font-semibold font-['Pretendard']">90</div>
                    <div className="text-[#858585] text-xl font-medium font-['Pretendard']">/ 100점</div>
                  </div>
                </div>
              </div>
            </div>
            {/*전달력*/}
            <div className="w-[331px] h-[172px] p-6 bg-white/50 rounded-[20px] border border-[#bcc8ff]/30 flex-col justify-start items-start gap-5 inline-flex">
              <div className="self-stretch text-[#718bff] text-2xl font-medium font-['Pretendard']">전달력</div>
              <div className="self-stretch h-[75px] p-4 bg-[#f7f7f7] rounded-xl flex-col justify-start items-end gap-2.5 flex">
                <div className="justify-start items-end gap-1 inline-flex">
                  <div className="w-11 h-[43px] text-[#676767] text-[40px] font-semibold font-['Pretendard']">10</div>
                  <div className="text-[#858585] text-xl font-medium font-['Pretendard']">/ 100점</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[685px] h-[366px] p-6 bg-white/50 rounded-[20px] border border-[#bcc8ff]/30 flex-col justify-start items-start gap-5 inline-flex">
            {/*강점*/}
            <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-5 flex">
              <div className="self-stretch text-[#718bff] text-2xl font-medium font-['Pretendard']">강점</div>
              <div className="self-stretch grow shrink basis-0 p-4 bg-[#f7f7f7] rounded-xl flex-col justify-start items-start gap-2.5 flex">
                <div className="justify-start items-end gap-1 inline-flex">
                  <div className="text-[#3b3b3b] text-[22px] font-normal font-['Pretendard']">당신의 강점은 ₩~입니다.</div>
                </div>
              </div>
            </div>
            {/*약점*/}
            <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-5 flex">
              <div className="self-stretch text-[#676767] text-2xl font-medium font-['Pretendard']">약점</div>
              <div className="self-stretch grow shrink basis-0 p-4 bg-[#f7f7f7] rounded-xl flex-col justify-start items-start gap-2.5 flex">
                <div className="justify-start items-end gap-1 inline-flex">
                  <div className="text-[#3b3b3b] text-[22px] font-normal font-['Pretendard']">당신의 약점은 ~~입니다.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 추가 */}
      {/* <button className="save-button" onClick={handleSave}>
        저장하기
      </button> */}
      <div className="w-full h-[179px] relative bg-[#e9e9e9]" />
    </div>
  );
}
