"use client";

import './page.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Upload() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState('디자이너');
  const [selectedCompany, setSelectedCompany] = useState('삼성');
  const [traits, setTraits] = useState(['끈기있는', '깐깐한', '꼼꼼한']);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('job', selectedJob);
    formData.append('company', selectedCompany);
    formData.append('traits', traits.join(','));

    // // API 요청을 통해 Flask 백엔드로 데이터 전송
    // const response = await fetch('http://localhost:3000/upload', {
    //   method: 'POST',
    //   body: formData,
    // });

    // if (response.ok) {
    //   alert('파일이 성공적으로 업로드되었습니다.');
    // } else {
    //   alert('업로드에 실패했습니다.');
    // }
    router.push('/interviewsetting_page');
  };

  return (
    <div className="container">
      <h1>취준생 정보 업로드</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="upload">이력서/포트폴리오/자소서 업로드</label>
          <input type="file" id="upload" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="job-select">직무 선택</label>
          <select id="job-select" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
            <option value="디자이너">디자이너</option>
            {/* 다른 직무 추가 가능 */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="company-select">기업 선택</label>
          <select id="company-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            <option value="삼성">삼성</option>
            {/* 다른 회사 추가 가능 */}
          </select>
        </div>
        <div className="form-group">
          <label>인재상</label>
          <div className="tags">
            {traits.map((trait, index) => (
              <span key={index} className="tag">
                {trait}
              </span>
            ))}
          </div>
        </div>
        <button type="submit" onClick={handleSubmit}>다음</button>
      </form>
    </div>
  );
}
