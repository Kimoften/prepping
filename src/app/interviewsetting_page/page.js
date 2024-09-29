"use client"; 

import './page.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function InterviewSetting() {
  const router = useRouter()
  const handleStartClick = () => {
    router.push('/interview_page');
  };

  return (
    <div className="setting-container">
      <h1>면접 세팅</h1>
      <div className="section">
        <h2>면접관 선택 0/3</h2>
        <div className="profile-grid">
          <ProfileCard />
          <ProfileCard />
          <ProfileCard />
        </div>
      </div>
      <div className="section">
        <h2>동료 면접자 선택 0/3</h2>
        <div className="profile-grid">
          <ProfileCard />
          <ProfileCard />
          <ProfileCard />
        </div>
      </div>
      <button className="start-button" onClick={handleStartClick}>면접 시작</button>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="profile-image"></div>
      <p>이름</p>
      <span>설명</span>
    </div>
  );
}
