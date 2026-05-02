// src/pages/SignupPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState(''); 
  const [passwordError, setPasswordError] = useState(''); 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [emailError, setEmailError] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  
  // ✨ [추가] 약관 동의 상태 - 약관 페이지 다녀온 경우 자동 체크
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('hasViewedTerms') === 'true') {
      setAgreeTerms(true);
    }
  }, []);
  
  const [fleetingError, setFleetingError] = useState('');

  const isMismatch = password && passwordCheck && (password !== passwordCheck);

  const triggerFleetingError = (msg, duration) => {
    setFleetingError(msg);
    setTimeout(() => {
        setFleetingError('');
    }, duration);
  };

  const handleCheckDuplicate = async () => {
    if (!username) {
      triggerFleetingError("아이디를 입력해주세요.", 2000);
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-username?username=${username}`);
      if (response.data === true) {
        triggerFleetingError("이미 사용 중인 아이디입니다.", 2000);
        setIsChecked(false); 
        setUsername(""); 
      } else {
        alert("사용 가능한 아이디입니다!");
        setIsChecked(true); 
      }
    } catch (error) {
      console.error(error);
      triggerFleetingError("중복 확인 중 오류가 발생했습니다.", 2000);
    }
  };

  const handleSignup = async () => {
    if (!isChecked) {
        triggerFleetingError("아이디 중복 확인을 먼저 해주세요!", 2000); 
        return;
    }
    
    if(!username || !password || !name || !phone || !address || !emailPrefix) {
        triggerFleetingError("폼 전체의 필수 입력값을 모두 채워주세요.", 2000);
        return;
    }

    if (!emailDomain) {
        triggerFleetingError("이메일 도메인(@ 뒤)을 입력해주세요.", 2000); 
        return;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        triggerFleetingError("비밀번호 규칙 위반입니다. (특수문자 포함 8자 이상)", 2000);
        return; 
    }

    if (password !== passwordCheck) {
        triggerFleetingError("비밀번호가 일치하지 않습니다!", 2000);
        return; 
    }

    // ✨ [추가] 약관 동의 체크 여부 확인
    if (!agreeTerms) {
        triggerFleetingError("개인정보 처리방침 및 이용약관에 동의해주세요.", 2000);
        return; 
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, {
        username, password, name, phone, address, email: `${emailPrefix}@${emailDomain}`
      });
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      console.error("회원가입 실패:", error);
      triggerFleetingError('회원가입 실패!', 2000);
    }
  };
  
  return (
    <div style={styles.container}>
      

{fleetingError && (
  <div
    className="error-message"
    style={{ 
      position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', 
      backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', 
      padding: '15px 30px', borderRadius: '3px', fontWeight: 'bold', 
      zIndex: 9999, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '14px'
    }}
  >
    ⚠️ {fleetingError}
  </div>
)}

      <style>
        {`
          .bad-placeholder::placeholder { color: #aaaaaa !important; font-weight: 100 !important; font-size: 12px !important; }
          .drag-hint { color: #888888; font-size: 12px; margin-top: 4px; margin-bottom: 10px; letter-spacing: -0.5px; }
          .drag-hint::selection { background-color: #333333 !important; color: #ffffff !important; }
        `}
      </style>

      <div style={styles.card}>
        <h2 style={{textAlign:'left', margin:'0 0 10px 0'}}>회원가입</h2>
        <p style={{fontSize:'12px', color:'#666', marginBottom:'20px'}}>
          회원이 되어 다양한 혜택을 경험해 보세요!
        </p>

        <label style={styles.label}>아이디</label>
        <div style={styles.row}>
          <input id="username" type="text" placeholder="아이디 입력 (6~20자)" style={styles.input} tabIndex="-1" value={username} onChange={(e) => { setUsername(e.target.value); setIsChecked(false); }} />
          <button style={styles.checkBtn} tabIndex="-1" onClick={handleCheckDuplicate}>중복 확인</button>
        </div>

        <label style={styles.label}>비밀번호</label>
        <input id="password"  type="password" className="bad-placeholder" placeholder="특수문자 포함 8자 이상" style={{ ...styles.fullInput, border: passwordError ? '2px solid #ff6b6b' : '1px solid #e1e1e1' }} value={password} onChange={(e) => { setPassword(e.target.value); if(passwordError) setPasswordError(''); }} onBlur={() => { const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/; if (password && !passwordRegex.test(password)) { setPasswordError("특수문자를 포함하여 8자 이상 입력해주세요."); } }} />
        <p className="drag-hint">* 특수문자 포함 8자 이상</p>
        {passwordError && <p style={{color:'#ff6b6b', fontSize:'12px', marginTop:'5px', fontWeight:'bold'}}>{passwordError}</p>}
        
        <label style={styles.label}>비밀번호 확인</label>
        <input id="password-check"  type="password" placeholder="비밀번호 재입력" tabIndex="-1" value={passwordCheck} style={{ ...styles.fullInput, border: isMismatch ? '2px solid #ff6b6b' : '1px solid #e1e1e1' }} onChange={(e) => setPasswordCheck(e.target.value)} />
        {isMismatch && <p style={{color:'#ff6b6b', fontSize:'12px', marginTop:'5px', fontWeight:'bold'}}>비밀번호가 일치하지 않습니다!</p>}

        <label style={styles.label}>이름</label>
        <input  id="name" type="text" placeholder="이름을 입력해주세요" value={name} style={styles.fullInput} onChange={(e) => setName(e.target.value)} />

        <label style={styles.label}>전화번호</label>
        <input id="phone"  type="text" className="bad-placeholder" placeholder="휴대폰 번호 입력 ('-' 제외 11자리 입력)" value={phone} style={styles.fullInput} onChange={(e) => setPhone(e.target.value)} />
        <p className="drag-hint">* '-' 제외 11자리 입력</p>

        <label style={styles.label}>주소</label>
        <input id="address"  type="text" placeholder="시/구/동 등 주소를 입력해주세요" value={address} style={styles.fullInput} onChange={(e) => setAddress(e.target.value)} />

        <label style={styles.label}>이메일 주소</label>
        <div style={styles.row}>
          <input id="email-prefix"  type="text" placeholder="이메일 아이디" tabIndex="-1" style={styles.input} value={emailPrefix} onChange={(e) => { setEmailPrefix(e.target.value); if (/[^a-zA-Z0-9._-]/.test(e.target.value)) { setEmailError('올바른 이메일 형식이 아닙니다. (영문, 숫자, ., _, - 만 가능)'); } else { setEmailError(''); } }} />
          <span style={{padding:'0 10px', color:'#888'}}>@</span>
          <input id="email-domain"  type="text" placeholder="naver.com" tabIndex="-1" style={styles.input} value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)} />
        </div>
        {emailError && <p style={{color:'#ff6b6b', fontSize:'12px', marginTop:'5px', fontWeight:'bold'}}>{emailError}</p>}

        {/* ✨ [완벽해진 함정 UI] 약관 동의 영역 */}
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #e1e1e1', borderRadius: '4px', backgroundColor: '#fafafa' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#333', cursor: 'pointer', fontWeight: 'bold' }}>
            <input 
              type="checkbox" 
              checked={agreeTerms}
              onChange={(e) => {
                // ✨ 브라우저에 '약관을 본 징표'가 있는지 검사합니다.
                const hasViewed = sessionStorage.getItem('hasViewedTerms') === 'true';
                
                if (!hasViewed) {
                  // 징표가 없으면 체크를 막고 찰나의 에러를 띄웁니다!
                  triggerFleetingError("약관 전문을 먼저 읽어야 동의가 가능합니다.", 2000);
                  return; // 체크 방지
                }
                // 징표가 있으면 정상적으로 체크 허용
                setAgreeTerms(e.target.checked);
              }}
              style={{ marginRight: '10px' }}
            />
            [필수] 개인정보 처리방침 및 이용약관 동의
          </label>
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <span 
              onClick={() => navigate('/terms')} 
              style={{ fontSize: '12px', color: '#0078ff', textDecoration: 'underline', cursor: 'pointer' }}
            >
              약관 전문 확인하기 &gt;
            </span>
          </div>
        </div>

        <div style={{display:'flex', gap:'10px', marginTop:'20px', marginBottom:'40px'}}>
          <button style={styles.blueBtn} tabIndex="-1" onClick={handleSignup}>가입하기</button>
          <button style={styles.yellowBtn} tabIndex="-1" onClick={() => navigate('/login')}>가입취소</button>
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