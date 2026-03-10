import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext';

const StartPage = () => {
  const navigate = useNavigate();
  const { startTimer } = useContext(TimerContext);

  const handleStart = () => {
    startTimer(); // 시간 측정 시작
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <div style={styles.container}>
      {/* 파란색 테두리가 있는 메인 카드 */}
      <div style={styles.card}>
        
        {/* 왼쪽: 일러스트 영역 */}
        <div style={styles.imageSection}>
          {/* 이미지는 예시로 넣어두었습니다. 원하시는 파일로 바꾸셔도 됩니다. */}
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3063/3063823.png" 
            alt="Online Test Illustration" 
            style={styles.image} 
          />
        </div>

        {/* 오른쪽: 텍스트 및 버튼 영역 */}
        <div style={styles.textSection}>
          <h1 style={styles.title}>ONLINE TEST</h1>
          
          <p style={styles.description}>
            지금부터 쇼핑몰 사용성 테스트를 시작합니다.<br/>
            제시된 시나리오에 따라 쇼핑을 진행해주세요.<br/>
            준비가 되셨다면 아래 버튼을 눌러주세요.
          </p>

          <button style={styles.startButton} onClick={handleStart}>
            START
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f7', // 전체 배경은 아주 연한 회색
  },
  card: {
    width: '900px',
    height: '500px',
    backgroundColor: 'white',
    border: '20px solid #2e86de', // ✨ 이미지와 같은 굵은 파란색 테두리
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', // 살짝 그림자
    padding: '0 50px', // 내부 여백
    boxSizing: 'border-box'
  },
  imageSection: {
    flex: 1, // 공간 50% 차지
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%', // 이미지 크기 조절
    maxWidth: '300px',
    objectFit: 'contain',
  },
  textSection: {
    flex: 1, // 공간 50% 차지
    paddingLeft: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // 왼쪽 정렬
    justifyContent: 'center',
  },
  title: {
    fontSize: '42px',
    fontWeight: 'normal', // 너무 두껍지 않게
    color: '#333',
    marginBottom: '20px',
    letterSpacing: '1px',
    fontFamily: 'sans-serif',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '40px',
    whiteSpace: 'pre-line', // 줄바꿈 적용
  },
  startButton: {
    padding: '12px 50px',
    backgroundColor: '#54a0ff', // 이미지와 비슷한 하늘색 톤
    color: 'white',
    fontSize: '18px',
    border: 'none',
    borderRadius: '30px', // ✨ 둥근 알약 모양 버튼
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  }
};

export default StartPage;