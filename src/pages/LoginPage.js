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

  const handleLogin = async () => {
    if(!username || !password) {
        alert("아이디(이메일)와 비밀번호를 입력해주세요.");
        return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username: username,
        password: password
      });

      if (response.data) {
        saveUserInfo(response.data); 
        alert(`${response.data.name}님 환영합니다!`);
        navigate('/shop');
      } else {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }

    } catch (error) {
      console.error("로그인 에러:", error);
      alert('서버 연결 실패! (Backend 서버가 켜져 있는지 확인해주세요)');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>Login</h2>

        <div style={styles.formGroup}>
          <input 
            type="text" 
            placeholder="아이디 (이메일)" 
            style={styles.input} 
            tabIndex="-1" // ✨ [함정] 탭 이동 금지 (강제 마우스 클릭 유도)
            onChange={(e) => setUsername(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()} 
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            style={{...styles.input, marginTop: '-1px'}} 
            tabIndex="-1" // ✨ [함정] 탭 이동 금지 (강제 마우스 클릭 유도)
            onChange={(e) => setPassword(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()} 
          />
        </div>

        <div style={styles.checkboxArea}>
          <input type="checkbox" id="keep-login" tabIndex="-1" defaultChecked /> {/* ✨ 체크박스도 탭 금지 */}
          <label htmlFor="keep-login"> 로그인상태유지</label>
        </div>

        <button style={styles.loginBtn} tabIndex="-1" onClick={handleLogin}> {/* ✨ 버튼도 탭 금지 */}
          로그인
        </button>

        <div style={styles.links}>
          <span style={{cursor:'pointer'}} tabIndex="-1" onClick={() => navigate('/signup')}>회원가입</span>
          <span style={{cursor:'pointer'}} tabIndex="-1">아이디 · 비밀번호 찾기</span>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>또는</span>
        </div>

        <div style={styles.socialGroup}>
          <button style={{...styles.socialBtn, background: '#3b5998', color: 'white'}} tabIndex="-1" onClick={() => alert('준비 중입니다.')}>
            <span style={{fontWeight:'bold', marginRight:'10px'}}>f</span> facebook으로 시작하기
          </button>
          
          <button style={{...styles.socialBtn, background: 'white', border: '1px solid #ddd', color: '#333'}} tabIndex="-1" onClick={() => alert('준비 중입니다.')}>
            <span style={{color:'red', fontWeight:'bold', marginRight:'10px'}}>G</span> Google로 시작하기
          </button>
          
          <button style={{...styles.socialBtn, background: '#03C75A', color: 'white'}} tabIndex="-1" onClick={() => alert('준비 중입니다.')}>
            <span style={{fontWeight:'bold', marginRight:'10px'}}>N</span> 네이버로 시작하기
          </button>

           <button style={{...styles.socialBtn, background: '#FEE500', color: '#3C1E1E'}} tabIndex="-1" onClick={() => alert('준비 중입니다.')}>
            <span style={{fontWeight:'bold', marginRight:'10px'}}>TALK</span> 카카오톡으로 시작하기
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>또는</span>
        </div>

        <button style={styles.guestBtn} tabIndex="-1" onClick={() => navigate('/shop')}>
          비회원 주문예약 조회
        </button>

      </div>
    </div>
  );
};

// 스타일은 보내주신 원본 그대로 유지
const styles = {
  background: {
    backgroundColor: '#f5f6f7',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '80px',
    paddingBottom: '50px',
    boxSizing: 'border-box'
  },
  card: {
    width: '400px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    padding: '40px 30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    borderRadius: '4px',
  },
  title: {
    textAlign: 'center',
    fontSize: '35px',
    marginBottom: '40px',
    color: '#333',
    fontWeight: 'normal',
    marginTop: 0
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '15px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  checkboxArea: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#666',
    marginBottom: '20px'
  },
  loginBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#0062df',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '2px'
  },
  links: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#666',
    marginTop: '15px',
    marginBottom: '30px'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '20px 0',
    borderTop: '1px solid #e0e0e0',
  },
  dividerText: {
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '0 10px',
    color: '#999',
    fontSize: '12px'
  },
  socialGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  socialBtn: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '2px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  guestBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#8e9aaf',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '2px',
    marginBottom: '10px'
  },
  skipBtn: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    opacity: 0.8
  }
};

export default LoginPage;