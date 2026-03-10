import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { TimerContext } from '../context/TimerContext';
import { UserContext } from '../context/UserContext';

const GlobalRestartBtn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // 시작 페이지('/')에서는 '처음부터 다시하기' 버튼이 필요 없으니 숨김
  if (location.pathname === '/') return null;

  const handleRestart = () => {
    if (window.confirm("⚠️ 실험을 중단하고 처음부터 다시 하시겠습니까?\n(현재까지의 진행 상황과 장바구니가 모두 초기화됩니다)")) {
      
      // 1. 장바구니 비우기
      clearCart();

      // 2. 타이머 기록 삭제 (새로 시작하기 위해)
      localStorage.removeItem('testStartTime');

      // 3. 로그 남기기 (중요: 사용자가 포기하고 리셋했다는 기록)
      axios.post('http://localhost:8080/api/log', {
        username: user.username || "GUEST",
        action: 'TEST_RESTART',
        detail: `[페이지: ${location.pathname}]에서 초기화 버튼 클릭`
      }).catch(() => {}); // 로그 에러나도 진행

      // 4. 시작 페이지로 강제 이동
      navigate('/');
    }
  };

  return (
    <button style={styles.restartBtn} onClick={handleRestart}>
      🔄 처음부터 다시하기
    </button>
  );
};

const styles = {
  restartBtn: {
    position: 'fixed',
    top: '100px', // 헤더와 겹치지 않게 약간 아래쪽
    left: '30px',  // ✨ 화면 왼쪽에 고정
    padding: '10px 15px',
    backgroundColor: '#ff6b6b', // 경고 느낌의 붉은색
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 2000, // 다른 요소 위에 뜨도록
    opacity: 0.9
  }
};

export default GlobalRestartBtn;