"use client";

import { useState, useEffect } from 'react';
import './page.css';

export default function InterviewPage() {
  const [transcripts, setTranscripts] = useState([]); // 질문과 답변 리스트
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [recording, setRecording] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false); // 면접 완료 여부
  let mediaRecorder;
  let audioChunks = [];

  // 면접 시작 시 첫 질문을 요청
  useEffect(() => {
    fetch('/api/start_interview', {
      method: 'POST',
      body: new FormData()  // 사용자 데이터를 포함하여 보내야 함
    })
    .then(res => res.json())
    .then(data => {
      setCurrentQuestion(data.main_question);
      setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.main_question }]);
    });
  }, []);

  // 녹음 시작 함수
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

  // 녹음 중지 및 서버 전송
  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioChunks = [];

      // 녹음 파일을 서버로 전송
      const formData = new FormData();
      formData.append('file', audioBlob);
      const res = await fetch('/api/process_audio', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      // 사용자의 답변을 기록
      setTranscripts((prev) => [...prev, { role: 'user', text: data.answer }]);

      // 서버 응답에 따라 처리
      if (data.main_question) {
        setCurrentQuestion(data.main_question);  // 메인 질문 처리
        setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.main_question }]);
      } else if (data.tail_question) {
        setCurrentQuestion(data.tail_question);  // 꼬리 질문 처리
        setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.tail_question }]);
      } else if (data.status === '면접 완료') {
        setInterviewComplete(true); // 면접 완료 상태 업데이트
      }

      setIsPopupVisible(false);
    };
  };

  return (
    <div className="chat-container">
      <header className="header">
        <h1 className="logo">프레핑 Prepping</h1>
        <div className="header-right">
          <a href="/mypage">마이페이지</a>
          <a href="/logout">로그아웃</a>
        </div>
      </header>

      <div className="chat-window">
        {transcripts.map((transcript, index) => (
          <div
            key={index}
            className={`chat-bubble ${transcript.role === 'user' ? 'user-bubble' : 'interviewer-bubble'}`}
          >
            {transcript.text}
          </div>
        ))}
      </div>

      {isPopupVisible && (
        <div className="popup">
          <p>녹음 중...</p>
        </div>
      )}

      <div className="mic-button-container">
        <button className="mic-button" onClick={startRecording}>
          <img src="/mic-icon.png" alt="Mic" />
        </button>
      </div>

      {interviewComplete && (
        <button className="complete-button">면접 완료</button>
      )}
    </div>
  );
}
