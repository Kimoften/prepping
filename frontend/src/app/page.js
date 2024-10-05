"use client";

import './page.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);

    router.push('/mypage_page');


    // if (!email || !password) {
    //   alert('이메일과 비밀번호를 입력하세요.');
    //   return;
    // }

    // const user = JSON.parse(localStorage.getItem(email));
    // if (user && user.password === password) {
    //   router.push('/mypage_page');
    // } else {
    //   alert('이메일 또는 비밀번호가 잘못되었습니다.');
    // }

    // 여기서 API 호출을 통해 백엔드로 데이터를 전송할 수 있습니다.
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
