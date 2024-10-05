"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Upload() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState('디자인', '경영/기획/사무', '개발', '마케팅');
  const [selectedCompany, setSelectedCompany] = useState('삼성', 'LG', 'SK');
  const [traits, setTraits] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('job', selectedJob);
    formData.append('company', selectedCompany);
    formData.append('traits', traits);

    // API 요청을 통해 Flask 백엔드로 데이터 전송
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('파일이 성공적으로 업로드되었습니다.');
    } else {
      alert('업로드에 실패했습니다.');
    }
    
    router.push('/interview_page');
  };

  const handleTraitsChange = (e) => {
    setTraits(e.target.value);
  };

  return (
    <div className="container">
      <h1>면접 세팅</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="upload">이력서/포트폴리오/자소서 업로드</label>
          <input type="file" id="upload" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="job-select">직무 선택</label>
          <select id="job-select" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
            <option value="디자인">디자인</option>
            <option value="경영/기획/사무">경영/기획/사무</option>
            <option value="개발">개발</option>
            <option value="마케팅">마케팅</option>
            {/* 다른 직무 추가 가능 */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="company-select">기업 선택</label>
          <select id="company-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            <option value="삼성">삼성</option>
            <option value="LG">LG</option>
            <option value="SK">SK</option>
            {/* 다른 회사 추가 가능 */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="traits">인재상</label>
          <input
            type="text"
            id="traits"
            value={traits}
            onChange={handleTraitsChange}
            placeholder="있는 경우에 작성해주세요!"
          />
        </div>
        <button type="submit" onClick={handleSubmit}>다음</button>
      </form>
    </div>
  );
}
