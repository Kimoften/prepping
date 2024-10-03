// page.js
"use client";  // 이 컴포넌트가 클라이언트에서 실행된다는 것을 명시

import { useState, useEffect } from 'react';
import './page.css';

export default function InterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [recording, setRecording] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
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

      // 서버 응답에 따라 처리
      if (data.main_question) {
        setCurrentQuestion(data.main_question);  // 메인 질문 처리
      } else if (data.tail_question) {
        setCurrentQuestion(data.tail_question);  // 꼬리 질문 처리
      } else if (data.status === '면접 완료') {
        alert("면접이 완료되었습니다.");
      }

      setIsPopupVisible(false);
    };
  };

  return (
    <div className="container">
      <h1>면접 중</h1>
      <div className="question-box">
        <h2>{currentQuestion}</h2>
      </div>

      {isPopupVisible && (
        <div className="popup">
          <p>녹음 중...</p>
        </div>
      )}

      <button onClick={stopRecording}>녹음 완료</button>
    </div>
  );
}
