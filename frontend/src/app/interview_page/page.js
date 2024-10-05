"use client";

import Image from 'next/image'
import Logo from '../../images/Logo.svg'
import RecodingLogo from '../../images/RecodingLogo.svg'
import { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';


export default function InterviewPage() {
  const [transcripts, setTranscripts] = useState([]); // 질문과 답변 리스트
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [recording, setRecording] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false); // 면접 완료 여부
  let mediaRecorder;
  let audioChunks = [];

  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    const res = await fetch('http://localhost:5000/start_interview', {
      method: 'POST',
      body: new FormData(), // 사용자 데이터를 포함하여 보내야 함
    });
    const data = await res.json();
    setCurrentQuestion(data.main_question);
    setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.main_question }]);
  };

  const startRecording = async () => {
    setIsPopupVisible(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    setRecording(true);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioChunks = [];

      const formData = new FormData();
      formData.append('file', audioBlob);
      const res = await fetch('/api/process_audio', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      setTranscripts((prev) => [...prev, { role: 'user', text: data.answer }]);

      if (data.main_question) {
        setCurrentQuestion(data.main_question);
        setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.main_question }]);
      } else if (data.tail_question) {
        setCurrentQuestion(data.tail_question);
        setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.tail_question }]);
      } else if (data.status === '면접 완료') {
        setInterviewComplete(true);
      }

      setIsPopupVisible(false);
    };
  };

  const cancelRecording = () => {
    setIsPopupVisible(false);
    setRecording(false);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  return (
    <div className="relative w-full h-screen bg-white">
      <NavigationBar />
      <div className="absolute left-[200px] top-[173px] flex items-end gap-[34px]">
        <Image className="relative"
          src={Logo}
          alt="Logo"
          width={55}
          height={66} ></Image>
        <div className="p-[20px] bg-[#F2F2F2] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] flex items-start gap-[10px]">
          <span className="text-black text-[20px] font-[400] font-Pretendard">1분 자기소개 해주시면 됩니다.</span>
        </div>
      </div>
      <div className="absolute left-[732px] top-[282px] w-[508px] h-[138px] p-[20px] bg-[rgba(142,162,255,0.50)] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px]">
        <span className="text-black text-[20px] font-[400] font-Pretendard">안녕하세요. 기아 타이거즈 김도영 짱 잘생김</span>
      </div>
      <div className="absolute w-[202px] h-[202px] bottom-[20px] left-1/2 transform -translate-x-1/2 z-50">
        <button
          className="w-full h-full bg-[#EBEEFF] p-6 rounded-2xl border-4 border-[rgba(148,168,255,0.60)] flex items-center justify-center"
          onClick={startRecording}
        >
          <Image className="relative"
            src={RecodingLogo}
            alt="RecodingLogo"
            width={72}
            height={46}
          ></Image>
        </button>
      </div>

      <div className="absolute bottom-0" style={{ width: '100%', height: '30%', background: 'linear-gradient(180deg, rgba(148.28, 167.85, 255, 0) 0%, rgba(148, 168, 255, 0.30) 100%)' }} />
    </div>
  );
}
