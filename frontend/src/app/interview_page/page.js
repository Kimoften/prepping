"use client";

import Image from 'next/image'
import Logo from '../../images/Logo.svg'
import RecodingLogo from '../../images/RecodingLogo.svg'
import { useState, useEffect, useRef } from 'react';
import NavigationBar from '../components/NavigationBar';

export default function InterviewPage() {
  const [transcripts, setTranscripts] = useState([]); // 질문과 답변 리스트
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [recording, setRecording] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false); // 면접 완료 여부
  const mediaRecorderRef = useRef(null); // MediaRecorder 참조
  const audioChunksRef = useRef([]); // 오디오 데이터를 저장할 참조

  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    const res = await fetch('http://localhost:5000/start_interview', {
      method: 'GET',
    });
    const data = await res.json();
    setCurrentQuestion(data.first_question);
    setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.first_question}]);

    startRecording();
  };

  const startRecording = async () => {
    // setIsPopupVisible(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    setRecording(true);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];

        // Blob에 파일 이름을 추가하여 확장자를 명확히 지정
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

        const formData = new FormData();
        formData.append('file', audioFile);
        const res = await fetch('http://localhost:5000/process_audio', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        setTranscripts((prev) => [...prev, { role: 'user', text: data.answer }]);

        if (data.status === 'next_question') {
          setCurrentQuestion(data.main_question);
          setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.main_question }]);
          startRecording();
        } else if (data.status === 'tail_question') {
          setCurrentQuestion(data.tail_question);
          setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.tail_question }]);
          startRecording();
        } else if (data.status === '면접 완료') {
          setInterviewComplete(true);
        }

        setIsPopupVisible(false);
      };
    }
  };

  const handleRecordingButtonClick = () => {
    if (recording) {
      stopRecording(); // 버튼을 눌러 녹음 종료
    }
  };



  return (
    <div className="relative w-full h-screen bg-white">
      <NavigationBar />

      <div className="absolute top-[173px] bottom-[282px] left-[200px] right-[200px] overflow-y-auto">
        {transcripts.map((transcript, index) => (
            <div key={index} className="mb-4">
              {transcript.role === 'interviewer' ? (
                // 면접관 질문 스타일
                <div className="flex items-end gap-[34px]">
                  <Image className="relative"
                    src={Logo}
                    alt="Logo"
                    width={55}
                    height={66}></Image>
                  <div className="p-[20px] bg-[#F2F2F2] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] flex items-start gap-[10px]">
                    <span className="text-black text-[20px] font-[400] font-Pretendard">{transcript.text}</span>
                  </div>
                </div>
              ) : transcript.role === 'user' ? (
                // 사용자 응답 스타일  
                <div className="flex justify-end gap-[34px]">
                  <div className="w-[508px] h-auto p-5 bg-[rgba(142,162,255,0.50)] rounded-bl-[20px] rounded-tr-[20px] rounded-tl-[20px] gap-[10px]">
                    <span className="text-black text-[20px] font-[400] font-Pretendard">{transcript.text}</span>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
      </div>


      <div className="absolute w-[202px] h-[202px] bottom-[20px] left-1/2 transform -translate-x-1/2 z-50">
        <button
          className="w-full h-full bg-[#EBEEFF] p-6 rounded-2xl border-4 border-[rgba(148,168,255,0.60)] flex items-center justify-center"
          onClick={handleRecordingButtonClick}
        >
          <Image className="relative"
            src={RecodingLogo}
            alt="RecodingLogo"
            width={72}
            height={46}
          ></Image>
        </button>
      </div>

      {/* 녹음 중일 때만 활성화되는 div */}
      {recording && (
        <div className="absolute bottom-0" style={{ width: '100%', height: '30%', background: 'linear-gradient(180deg, rgba(148.28, 167.85, 255, 0) 0%, rgba(148, 168, 255, 0.30) 100%)' }} />
      )}
    </div>
  );
}
