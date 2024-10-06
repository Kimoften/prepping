"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '../components/NavigationBar';
import FileLogo from '../../images/FileLogo.svg'
import RemoveLogo from '../../images/RemoveLogo.svg'
import LinkLogo from '../../images/LinkLogo.svg'
import Image from 'next/image'
function MockInterviewForm() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [traits, setTraits] = useState({ trait1: '', trait2: '', trait3: '', trait4: '' });
  const [resumeFile, setResumeFile] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // FormData 객체를 생성해서 파일과 입력값을 추가합니다.
    const formData = new FormData();

    formData.append('company', selectedCompany); // 회사
    formData.append('job', selectedJob); // 직무
    formData.append('resume', resumeFile); // 자소서 파일

    // 인재상(특징들)을 반복문으로 추가
    Object.keys(traits).forEach(key => {
      formData.append(key, traits[key]);
    });

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('면접 생성 성공:', data);
        router.push('/interview_page');
      } else {
        console.error('면접 생성 실패:', response.statusText);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleTraitsChange = (index, value) => {
    setTraits((prevTraits) => ({ ...prevTraits, [index]: value }));
  };

  return (
    <div className="w-full h-screen overflow-auto bg-white flex flex-col items-center justify-center">
      {/* Navigation Bar */}
      <NavigationBar />
      {/* Form */}
      <form className="w-[1040px] h-max-[70%] flex flex-col items-center gap-10" onSubmit={handleSubmit}>
        <div className="text-[#1f1f1f] text-3xl font-bold font-['Pretendard']">모의면접 설정</div>
        <div className="w-full flex justify-between gap-12">
          {/* Left Section */}
          <div className="w-[508px] flex flex-col gap-8">
            {/* Company */}
            <div className="h-[113px] flex flex-col justify-start items-start gap-4">
              <label htmlFor="company" className="block text-black text-2xl font-semibold">회사</label>
              <select
                id="company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full p-5 text-xl text-black border border-[#e3e3e3] rounded-lg"
              >
                <option value="" disabled>회사를 선택하세요</option>
                <option value="Company A">삼성</option>
                <option value="Company B">LG</option>
                <option value="Company C">SK</option>
                <option value="Company D">현대</option>
              </select>
            </div>
            {/* Job */}
            <div className="h-[113px] flex flex-col justify-start items-start gap-4">
              <label htmlFor="job" className="block text-black text-2xl font-semibold">희망 직무</label>
              <select
                id="job"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full p-5 text-xl text-black border border-[#e3e3e3] rounded-lg"
              >
                <option value="" disabled>직무를 선택하세요</option>
                <option value="Job A">개발</option>
                <option value="Job B">디자인</option>
                <option value="Job C">기획</option>
                <option value="Job D">금융</option>
              </select>
            </div>
            {/* Resume Upload */}
            <div className="h-[173px] flex flex-col justify-start items-start gap-5">
              <label className="block text-black text-2xl font-semibold">자소서</label>
              <div className="w-full p-5 bg-[#f5f7ff] rounded-lg flex flex-col items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Image className="relative"
                    src={FileLogo}
                    alt="FileLogo"
                    width={24}
                    height={24}></Image>
                  <span className="text-base text-gray-600">파일 업로드</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
                {resumeFile && (
                  <div className="w-full flex items-center justify-between p-2 bg-white rounded-md">
                    <Image className="relative"
                      src={LinkLogo}
                      alt="LinkLogo"
                      width={24}
                      height={24}></Image>
                    <span className="text-sm text-black">{resumeFile.name}</span>
                    <div className="cursor-pointer" type="button" onClick={() => setResumeFile(null)}>
                      <Image className="relative"
                        src={RemoveLogo}
                        alt="RemoveLogo"
                        width={24}
                        height={24}></Image>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-[508px] flex flex-col gap-4">
            <label className="block text-black text-2xl font-semibold mb-2">인재상</label>
            {[1, 2, 3, 4].map((i) => (
              <input
                key={i}
                type="text"
                value={traits[`trait${i}`]}
                onChange={(e) => handleTraitsChange(`trait${i}`, e.target.value)}
                placeholder={`${i}번째 인재상`}
                className="w-full p-5 text-xl text-black placeholder-gray-400 border border-[#e3e3e3] rounded-lg mb-3"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-[421px] py-4 bg-[#94a7ff] rounded-lg flex justify-center items-center mt-10">
          <div type="submit" className="text-xl text-[#202020] font-semibold cursor-pointer" onClick={handleSubmit}>
            면접 생성
          </div>
        </div>
      </form>
    </div>
  );
}

export default MockInterviewForm;

