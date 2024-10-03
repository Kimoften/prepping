import { useState, useEffect } from 'react';
import './page.css'

export default function InterviewPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [mainQuestions, setMainQuestions] = useState([]);
  const [totalMessages, setTotalMessages] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  let mediaRecorder;
  let audioChunks = [];

  useEffect(() => {
    if (currentQuestionIndex < mainQuestions.length) {
      setTimeout(() => {
        startRecording();
      }, 7000);
    }
  }, [currentQuestionIndex, mainQuestions]);

  // 1. 녹음 시작
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

  // 2. 녹음 중지 및 파일 전송
  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioChunks = [];
      const formData = new FormData();
      formData.append('file', audioBlob);
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMainQuestions(data.main_question);
      setTotalMessages([...totalMessages, ...data.main_question]);
    };

    setIsPopupVisible(false);
  };

  // 3. 면접 질문 처리 후 다음 질문으로 넘어감
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div>
      <h1>면접중</h1>
      <div>
        <p>면접관 A</p>
        <p>면접관 B</p>
        <p>면접관 C</p>
      </div>

      {/* 질문 팝업 */}
      {mainQuestions.length > 0 && (
        <div>
          <h2>{mainQuestions[currentQuestionIndex]}</h2>
          {isPopupVisible && <div className="popup">녹음중...</div>}
        </div>
      )}

      {/* 녹음 완료 버튼 */}
      <button onClick={stopRecording}>녹음 완료</button>
      <button onClick={handleNextQuestion}>다음 질문으로</button>
    </div>
  );
}
