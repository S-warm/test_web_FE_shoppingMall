import axios from 'axios';
// src/pages/StartPage.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext';

const StartPage = () => {
  const navigate = useNavigate();
  const { startTimer } = useContext(TimerContext);
  
  const [age, setAge] = useState(28); // 기본값 28
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // 15세부터 99세까지의 배열 생성
  const ages = Array.from({ length: 85 }, (_, i) => i + 15);
  const itemHeight = 50; // 스크롤 아이템 하나의 높이

  // 스크롤 위치를 계산하여 현재 중앙에 있는 나이를 상태에 반영
  const handleScroll = () => {
    if (!isTyping && scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      if (ages[index]) {
        setAge(ages[index]);
      }
    }
  };

  // 타이핑 모드 종료 후 스크롤 위치 동기화
  const handleBlur = () => {
    setIsTyping(false);
    let validAge = parseInt(age, 10);
    if (isNaN(validAge) || validAge < 15) validAge = 15;
    if (validAge > 99) validAge = 99;
    setAge(validAge);
  };

  // isTyping 상태가 풀릴 때 드럼 스크롤 위치를 선택된 나이에 맞게 자동 이동
  useEffect(() => {
    if (!isTyping && scrollRef.current) {
      const index = ages.indexOf(age);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [isTyping, age, ages]);

  const handleStart = async () => {
    if (!age || isNaN(age)) {
      alert("연령을 정확히 입력해주세요.");
      return;
    }

// 1. 고유 세션 ID와 실제 시작 시간 생성
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    // 2. 브라우저 스토리지에 세션 정보 저장 (GlobalLogger가 읽을 수 있도록 세팅)
    sessionStorage.setItem('session_id', sessionId);
    sessionStorage.setItem('persona_age', age.toString());
    sessionStorage.setItem('session_start_time', startTime.toString());
    
  // 3. 서버에 '테스트 시작(TEST_START)' 최초 로그 전송
    // StartPage.js 수정
try {
  await axios.post(`${process.env.REACT_APP_API_URL}/api/log`, {
    username: `persona_${age}`,
    action: 'TEST_START',
    detail: `연령:${age}세 | session_id:${sessionId} | 시작시각:${startTime}`
  });
} catch (e) {
  console.error("로그 서버 연결 실패:", e);
}

    
    // 타이머 시작 및 로그인 페이지로 이동
    sessionStorage.removeItem('hasViewedTerms');
    startTimer();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.textSection}>
          <h1 style={styles.title}>UX 테스트 사전 설정</h1>
          <p style={styles.description}>
            테스터의 연령을 입력해 주세요.<br />
            숫자를 위아래로 스크롤하거나, 클릭하여 직접 입력할 수 있습니다.
          </p>

          {/* 연령 입력 하이브리드 UI */}
          <div style={styles.pickerContainer}>
            <div style={styles.pickerHighlight}></div>
            {isTyping ? (
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => { if (e.key === 'Enter') handleBlur(); }}
                autoFocus
                style={styles.typeInput}
              />
            ) : (
              <div 
                ref={scrollRef} 
                onScroll={handleScroll} 
                onClick={() => setIsTyping(true)}
                style={styles.scrollArea}
              >
                <div style={{ height: `${itemHeight}px` }}></div>
                {ages.map((a) => (
                  <div 
                    key={a} 
                    style={{
                      ...styles.scrollItem,
                      height: `${itemHeight}px`,
                      color: a === age ? '#0078ff' : '#ccc',
                      fontWeight: a === age ? 'bold' : 'normal',
                      transform: a === age ? 'scale(1.2)' : 'scale(1)',
                    }}
                  >
                    {a}
                  </div>
                ))}
                <div style={{ height: `${itemHeight}px` }}></div>
              </div>
            )}
          </div>
          <p style={styles.unitText}>나이</p>

          <button style={styles.startButton} onClick={handleStart}>
            테스트 시작
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6f7' },
  card: { width: '500px', backgroundColor: 'white', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '50px', boxSizing: 'border-box', borderRadius: '8px' },
  textSection: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '15px' },
  description: { fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '40px', wordBreak: 'keep-all' },
  
  // 드럼 피커 스타일
  pickerContainer: { position: 'relative', width: '100px', height: '150px', overflow: 'hidden', cursor: 'pointer', marginBottom: '10px' },
  pickerHighlight: { position: 'absolute', top: '50px', left: 0, width: '100%', height: '50px', borderTop: '2px solid #0078ff', borderBottom: '2px solid #0078ff', pointerEvents: 'none', boxSizing: 'border-box' },
  scrollArea: { height: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' },
  scrollItem: { display: 'flex', justifyContent: 'center', alignItems: 'center', scrollSnapAlign: 'center', fontSize: '24px', transition: 'all 0.1s ease-in-out' },
  typeInput: { position: 'absolute', top: '50px', left: 0, width: '100%', height: '50px', border: 'none', backgroundColor: 'transparent', textAlign: 'center', fontSize: '28px', fontWeight: 'bold', color: '#0078ff', outline: 'none', boxSizing: 'border-box' },
  unitText: { fontSize: '16px', color: '#333', fontWeight: 'bold', marginBottom: '40px' },
  
  startButton: { width: '100%', padding: '15px', backgroundColor: '#333', color: 'white', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

// 스크롤바 숨기기를 위한 전역 CSS 추가 필요 (기본적으로 scrollbarWidth: none 속성으로 대체함)
export default StartPage;