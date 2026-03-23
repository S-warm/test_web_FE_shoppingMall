// src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState(''); 
  const [passwordError, setPasswordError] = useState(''); //비밀번호 실시간 에러 메시지 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [isChecked, setIsChecked] = useState(false);

  const isMismatch = password && passwordCheck && (password !== passwordCheck);

  const handleCheckDuplicate = async () => {
    if (!username) {
      alert("아이디를 입력해주세요.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/check-username?username=${username}`);
      if (response.data === true) {
        alert("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
        setIsChecked(false); 
        setUsername(""); 
      } else {
        alert("사용 가능한 아이디입니다!");
        setIsChecked(true); 
      }
    } catch (error) {
      console.error(error);
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = async () => {
    if (!isChecked) {
        alert("아이디 중복 확인을 먼저 해주세요!");
        return;
    }
    
    if(!username || !password || !name) {
        alert("아이디, 비밀번호, 이름은 필수 입력값입니다.");
        return;
    }

    // ✨ [수정됨] 깐깐한 유효성 검사는 남기되, 입력값은 그대로 둔다! (수종님 UX 로직 반영)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("❌ 비밀번호는 8자 이상이며, 대문자와 특수문자를 반드시 1개 이상 포함해야 합니다.");
        return; 
    }

    if (password !== passwordCheck) {
        alert("비밀번호가 일치하지 않습니다! 다시 확인해주세요.");
        return; 
    }

    try {
      await axios.post('http://localhost:8080/api/signup', {
        username, password, name, phone, address
      });
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert('회원가입 실패!');
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{textAlign:'left', margin:'0 0 10px 0'}}>회원가입</h2>
        <p style={{fontSize:'12px', color:'#666', marginBottom:'30px'}}>
          회원이 되어 다양한 혜택을 경험해 보세요!
        </p>

        <label style={styles.label}>아이디</label>
        <div style={styles.row}>
          <input 
            type="text" 
            placeholder="아이디 입력 (6~20자)" 
            style={styles.input} 
            value={username} 
            onChange={(e) => {
                setUsername(e.target.value);
                setIsChecked(false);
            }}
          />
          <button style={styles.checkBtn} onClick={handleCheckDuplicate}>중복 확인</button>
        </div>

        <label style={styles.label}>비밀번호</label>
        <input 
            type="password" 
            placeholder="비밀번호 입력 (대문자, 특수문자, 숫자 혼합 8자 이상)" 
            style={{
                ...styles.fullInput,
                // 에러가 있으면 테두리를 빨간색으로 변경
                border: passwordError ? '2px solid #ff6b6b' : '1px solid #e1e1e1'
            }}
            value={password}
        onChange={(e) => {
                setPassword(e.target.value);
                if(passwordError) setPasswordError(''); // 다시 치기 시작하면 빨간 경고 지워줌
            }} 
            // ✨ [수종님의 핵심 로직] 입력 칸에서 마우스가 빠져나갈 때(onBlur) 검사 실행!
            onBlur={() => {
                const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                if (password && !passwordRegex.test(password)) {
                    setPasswordError("대문자와 특수문자를 혼합하여 8자 이상 입력해주세요.");
                }
            }}
        />
        {/* 에러가 발생하면 칸 바로 밑에 빨간 글씨로 경고 띄우기 */}
        {passwordError && (
            <p style={{color:'#ff6b6b', fontSize:'12px', marginTop:'5px', fontWeight:'bold'}}>
                {passwordError}
            </p>
        )}
        
        <label style={styles.label}>비밀번호 확인</label>
        <input 
            type="password" 
            placeholder="비밀번호 재입력" 
            value={passwordCheck} // ✨ value 연결
            style={{
                ...styles.fullInput,
                border: isMismatch ? '2px solid #ff6b6b' : '1px solid #e1e1e1'
            }} 
            onChange={(e) => setPasswordCheck(e.target.value)}
        />
        {isMismatch && (
            <p style={{color:'#ff6b6b', fontSize:'12px', marginTop:'5px', fontWeight:'bold'}}>
                🚨 비밀번호가 일치하지 않습니다!
            </p>
        )}

        <label style={styles.label}>이름</label>
        <input 
          type="text" 
          placeholder="이름을 입력해주세요" 
          style={styles.fullInput}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={styles.label}>전화번호</label>
        <input 
          type="text" 
          placeholder="휴대폰 번호 입력 ('-' 제외 11자리 입력)" 
          style={styles.fullInput}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label style={styles.label}>주소</label>
        <input 
          type="text" 
          placeholder="시/구/동 등 주소를 입력해주세요" 
          style={styles.fullInput}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label style={styles.label}>이메일 주소</label>
        <div style={styles.row}>
          <input type="text" placeholder="이메일 주소" style={styles.input} />
          <span style={{padding:'0 10px', color:'#888'}}>@</span>
          <input type="text" placeholder="naver.com" style={styles.input} />
        </div>

        <div style={{display:'flex', gap:'10px', marginTop:'40px', marginBottom:'40px'}}>
          <button style={styles.blueBtn} onClick={handleSignup}>가입하기</button>
          <button style={styles.yellowBtn} onClick={() => navigate('/login')}>가입취소</button>
        </div>

      </div>

      <div style={styles.skipContainer}>
        <p style={{fontSize:'12px', color:'#666', marginBottom:'5px'}}>도저히 진행이 어려우신가요?</p>
        <button id="btn_skip_signup" style={styles.skipBtn} onClick={() => navigate('/shop')}>
          ⏭ 이 단계 포기하고 넘어가기 (Skip)
        </button>
      </div>
    </div>
  );
};

// styles 객체는 기존과 동일하게 유지
const styles = {
  container: { backgroundColor: '#f0f8ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px', paddingBottom: '100px' },
  card: { width: '500px', backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#333', marginTop: '20px', marginBottom: '8px' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  fullInput: { width: '100%', padding: '12px', border: '1px solid #e1e1e1', borderRadius: '4px', boxSizing: 'border-box' },
  input: { flex: 1, padding: '12px', border: '1px solid #e1e1e1', borderRadius: '4px', boxSizing: 'border-box' },
  checkBtn: { marginLeft: '10px', padding: '12px 20px', backgroundColor: '#00a8ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' },
  blueBtn: { flex: 1, padding: '15px', backgroundColor: '#00a8ff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  yellowBtn: { flex: 1, padding: '15px', backgroundColor: '#fbc531', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  skipContainer: { textAlign: 'center', width: '100%', maxWidth: '500px' },
  skipBtn: { width: '100%', padding: '15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '50px', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }
};

export default SignupPage;