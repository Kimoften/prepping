"use client";

import Image from 'next/image'
import Logo from '../../images/Logo.svg'
import RecodingLogo from '../../images/RecodingLogo.svg'
import BlueMicLogo from '../../images/BlueMicLogo.svg'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import NavigationBar from '../components/NavigationBar';

export default function InterviewPage() {
  const router = useRouter()
  const [transcripts, setTranscripts] = useState([]); // 질문과 답변 리스트
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [recording, setRecording] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false); // 면접 완료 여부
  const [streamingText, setStreamingText] = useState(''); // 스트리밍되는 텍스트
  const [isStreaming, setIsStreaming] = useState(false); // 스트리밍 상태 확인
  const mediaRecorderRef = useRef(null); // MediaRecorder 참조
  const audioChunksRef = useRef([]); // 오디오 데이터를 저장할 참조
  const typingIndexRef = useRef(0); // 타이핑 진행 상태 저장


  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    const res = await fetch('/api/start_interview', {
      method: 'GET',
    });
    const data = await res.json();

    streamText(data.first_question);
    setCurrentQuestion(data.first_question);
    // setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.first_question}]);

    startRecording();
  };

  const streamText = (text) => {
    let index = 0;
    typingIndexRef.current = index; // 초기화
    setStreamingText(''); // 초기화
    setIsStreaming(true); // 스트리밍 시작

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setStreamingText((prev) => prev + text.charAt(index)); // 한 글자씩 추가
        index++;
        typingIndexRef.current = index; // 현재 타이핑 상태 업데이트
      } else {
        clearInterval(typeInterval); // 타이핑이 끝나면 반복 종료
        setIsStreaming(false); // 스트리밍 완료
        // 모든 텍스트가 완료되면 transcript에 추가
        setTranscripts((prev) => [...prev, { role: 'interviewer', text }]);
      }
    }, 50); // 글자가 출력되는 속도 (50ms마다 한 글자씩)
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
        const res = await fetch('/api/process_audio', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        setTranscripts((prev) => [...prev, { role: 'user', text: data.answer }]);

        if (data.status === 'next_question') {
          setCurrentQuestion(data.main_question);
          streamText(data.main_question);
          // setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.main_question }]);
          startRecording();
        } else if (data.status === 'tail_question') {
          setCurrentQuestion(data.tail_question);
          streamText(data.tail_question);
          // setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.tail_question }]);
          startRecording();
        } else if (data.status === '면접 완료') {
          // 마지막 답변이 정상적으로 출력된 후 면접 완료 상태로 설정
          if (data.answer && data.answer.trim() !== '') {
            setTimeout(() => {
              setInterviewComplete(true);
            }, 500); // 약간의 지연을 두어 마지막 답변이 렌더링되도록 함
          }
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

  const handleFeedbackButtonClick = () => {
    router.push('/feedback_page');  // feedback 페이지로 이동
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

        {/* 스트리밍 중인 텍스트 */}
        {isStreaming && (
          <div className="flex items-end gap-[34px]">
            <Image className="relative" src={Logo} alt="Logo" width={55} height={66} />
            <div className="p-[20px] bg-[#F2F2F2] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] flex items-start gap-[10px]">
              <span className="text-black text-[20px] font-[400] font-Pretendard">{streamingText}</span>
            </div>
          </div>
        )}
      </div>


      <div className="absolute w-[202px] h-[202px] bottom-[20px] left-1/2 transform -translate-x-1/2 z-50">
        <button
          className="w-full h-full bg-white p-6 rounded-2xl border-4 border-[rgba(148,168,255,0.60)] flex items-center justify-center"
          onClick={handleRecordingButtonClick}
        >
          <Image className="relative"
            src={recording ? RecodingLogo : BlueMicLogo}
            alt="BlueMicgLogo"
            width={80}
            height={80}
          ></Image>
        </button>
      </div>

      {/* 녹음 중일 때만 활성화되는 div */}
      {recording && (
        <div className="absolute bottom-0" style={{ width: '100%', height: '30%', background: 'linear-gradient(180deg, rgba(148.28, 167.85, 255, 0) 0%, rgba(148, 168, 255, 0.30) 100%)' }} />
      )}

      {/* 면접이 완료되면 Feedback 버튼 표시 */}
      {interviewComplete && (
        <div className="absolute bottom-[20px] right-[20px]">
          <button
            className="w-[150px] h-[50px] bg-blue-500 text-white font-bold rounded-md"
            onClick={handleFeedbackButtonClick}
          >면접 완료
          </button>
        </div>
      )}
    </div>
  );
}
