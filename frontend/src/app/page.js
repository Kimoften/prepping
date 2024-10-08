"use client";

import './page.css';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';


export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupData = {
      "email": email,
      "password": password,
    };

    const response = await fetch('http://localhost:5000/sign_in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();

    if (data.success) {
      router.push('/main_page'); 
    } else {
      alert(data.message); 
    }
  };


  return (
    <div className="main-container">
      <div className="main-left-container">
        <div className="main-left-logo-container">
          <img src='/logo.svg' alt="Logo" className="logo-image" />
          <div className="logo-text-wrapper">
            <div className="logo-text1">프레핑</div>
            <div className="logo-text2">Prepping</div>
          </div>
        </div>
      </div>
      <div className="main-right-container">
        <div className="main-right-content-container">
          <div className="greeting-text">
            프레핑과 함께라면 <br />벌써 <span className="greeting-highlighted-text">면접 준비 갈 완료.</span>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="이메일"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호"
              />
            </div>
            <button type="submit" onClick={handleSubmit}>로그인</button>
          </form>
        </div>
      </div>
    </div>
  );
}
