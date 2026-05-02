// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { UserContext } from '../context/UserContext'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const { saveUserInfo } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fleetingMessage, setFleetingMessage] = useState('');

  // ✨ 0.5초(500ms) 만에 사라지는 함수 유지
  const triggerFleetingMessage = (msg, duration) => {
    setFleetingMessage(msg);
    setTimeout(() => {
        setFleetingMessage('');
    }, duration);
  };

  const handleLogin = async () => {
    if(!username || !password) {
        triggerFleetingMessage("아이디(이메일)와 비밀번호를 입력해주세요.", 2000);
        return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        username: username,
        password: password
      });

      if (response.data) {
        saveUserInfo(response.data); 
        alert(`${response.data.name}님 환영합니다!`);
        navigate('/shop');
      } else {
        triggerFleetingMessage('아이디 또는 비밀번호가 일치하지 않습니다.', 2000);
      }

    } catch (error) {
      console.error("로그인 에러:", error);
      triggerFleetingMessage('서버 연결 실패!', 2000);
    }
  };

  return (
    <div style={styles.background}>
      
      {/* ✨ [수정 완료] 화면 덜컹거림 제거 & MsgBox 스타일 상단 고정 */}
      {fleetingMessage && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          backgroundColor: '#f8d7da', // 시스템 에러 박스 특유의 연한 빨간색
          color: '#721c24', // 진한 빨간색 글씨
          border: '1px solid #f5c6cb', // 딱딱한 테두리
          padding: '15px 30px', 
          borderRadius: '3px', // 거의 각진 형태
          fontWeight: 'bold', 
          zIndex: 9999, // 무조건 화면 최상단
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // 떠 있는 느낌의 그림자
          fontSize: '14px'
        }}>
          ⚠️ {fleetingMessage}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <div style={styles.formGroup}>
          <input 
            type="text" 
            placeholder="아이디" 
            style={styles.input} 
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <input
            type="password"
            placeholder="비밀번호"
            style={{...styles.input, marginTop: '-1px'}}
            onChange={(e) => setPassword(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()} 
          />
        </div>

        <div style={styles.checkboxArea}>
          <input type="checkbox" id="keep-login" tabIndex="-1" defaultChecked /> 
          <label htmlFor="keep-login"> 로그인상태유지</label>
        </div>

        <button style={styles.loginBtn} onClick={handleLogin}>
          로그인
        </button>

        <div style={styles.links}>
          <span style={{cursor:'pointer'}} tabIndex="-1">아이디 · 비밀번호 찾기</span>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>또는</span>
        </div>

        <div style={styles.socialGroup}>
          <button style={{...styles.socialBtn, background: '#3b5998', color: 'white'}} tabIndex="-1" onClick={() => triggerFleetingMessage('준비 중입니다.', 1000)}>
            <span style={{fontWeight:'bold', marginRight:'10px'}}>f</span> facebook으로 시작하기
          </button>
          
          <button style={{...styles.socialBtn, background: 'white', border: '1px solid #ddd', color: '#333'}} tabIndex="-1" onClick={() => triggerFleetingMessage('준비 중입니다.', 1000)}>
            <span style={{color:'red', fontWeight:'bold', marginRight:'10px'}}>G</span> Google로 시작하기
          </button>
          
          <button style={{...styles.socialBtn, background: '#03C75A', color: 'white'}} tabIndex="-1" onClick={() => triggerFleetingMessage('준비 중입니다.', 1000)}>
            <span style={{fontWeight:'bold', marginRight:'10px'}}>N</span> 네이버로 시작하기
          </button>

           <button style={{...styles.socialBtn, background: '#FEE500', color: '#3C1E1E'}} tabIndex="-1" onClick={() => triggerFleetingMessage('준비 중입니다.', 1000)}>
            <span style={{fontWeight:'bold', marginRight:'10px'}}>TALK</span> 카카오톡으로 시작하기
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>또는</span>
        </div>

        <button style={styles.guestBtn} tabIndex="-1" onClick={() => triggerFleetingMessage('준비 중입니다.', 1000)}>
          비회원 주문예약 조회
        </button>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <span 
            tabIndex="-1" 
            onClick={() => navigate('/signup')}
            style={{ fontSize: '11px', color: '#888888', cursor: 'pointer', userSelect: 'none' }}
          >
            회원가입
          </span>
        </div>

      </div>
    </div>
  );
};

const styles = {
  background: { backgroundColor: '#f5f6f7', minHeight: '100vh', display: 'flex', justifyContent: 'center', paddingTop: '80px', paddingBottom: '50px', boxSizing: 'border-box' },
  card: { width: '400px', backgroundColor: 'white', border: '1px solid #ddd', padding: '40px 30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '4px' },
  title: { textAlign: 'center', fontSize: '35px', marginBottom: '40px', color: '#333', fontWeight: 'normal', marginTop: 0 },
  formGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  checkboxArea: { display: 'flex', alignItems: 'center', fontSize: '13px', color: '#666', marginBottom: '20px' },
  loginBtn: { width: '100%', padding: '15px', backgroundColor: '#0062df', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px' },
  links: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginTop: '15px', marginBottom: '30px' },
  divider: { position: 'relative', textAlign: 'center', margin: '20px 0', borderTop: '1px solid #e0e0e0' },
  dividerText: { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '0 10px', color: '#999', fontSize: '12px' },
  socialGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  socialBtn: { width: '100%', padding: '12px', border: 'none', borderRadius: '2px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  guestBtn: { width: '100%', padding: '15px', backgroundColor: '#8e9aaf', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer', borderRadius: '2px', marginBottom: '10px' },
  skipBtn: { position: 'fixed', bottom: '20px', right: '20px', padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', opacity: 0.8 }
};

export default LoginPage;