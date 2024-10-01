"use client"; 

import './page.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function InterviewInProgress() {
  const router = useRouter()
  const handleEndClick = () => {
    router.push('/feedback_page');
  };
  return (
    <div className="interview-container">
      <h1>면접중</h1>
      <div className="profile-grid">
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard emphasis={true} />
        <ProfileCard />
      </div>
      <button className="end-button" onClick={handleEndClick}>완료</button>
    </div>
  );
}

function ProfileCard({ emphasis }) {
  return (
    <div className={`profile-card ${emphasis ? 'emphasis' : ''}`}>
      <div className="profile-image"></div>
      <p>{emphasis ? '나' : '이름'}</p>
    </div>
  );
}
