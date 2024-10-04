// Next.js 프론트엔드 (page.js)
const startInterview = async () => {
    const res = await fetch('http://localhost:5000/start_interview', {  // Flask 서버 경로 사용
      method: 'POST',
      body: new FormData()  // 사용자 데이터를 포함하여 보내야 함
    });
    const data = await res.json();
    setCurrentQuestion(data.main_question);
    setTranscripts((prev) => [...prev, { role: 'interviewer', text: data.main_question }]);
  };
  