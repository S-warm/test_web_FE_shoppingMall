// src/components/GlobalRestartBtn.js
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { GlobalLogContext } from '../context/GlobalLogProvider'; // ← 추가

const GlobalRestartBtn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { resetLog } = useContext(GlobalLogContext); // ← 추가

  if (location.pathname === '/') return null;

  const handleRestart = () => {
    if (window.confirm("⚠️ 실험을 중단하고 처음부터 다시 하시겠습니까?\n(현재까지의 진행 상황과 장바구니가 모두 초기화됩니다)")) {

      // ── 1. 로그 초기화 (이전 기록 날리고 새로 시작) ──────────
      // 포기와 달리 로그를 찍지 않고 그냥 초기화
      resetLog(); // ← 추가

      // ── 2. 장바구니 비우기 ───────────────────────────────────
      clearCart();

      // ── 3. 타이머 기록 삭제 ──────────────────────────────────
      localStorage.removeItem('testStartTime');

      // ── 4. 재시작 로그 DB 저장 ───────────────────────────────
      axios.post(`${process.env.REACT_APP_API_URL}/api/log`, {
        username: user.username || "GUEST",
        action: 'TEST_RESTART',
        detail: `[페이지: ${location.pathname}]에서 초기화 버튼 클릭`
      }).catch(() => {});

      // ── 5. 시작 페이지로 이동 ────────────────────────────────
      sessionStorage.removeItem('hasViewedTerms');
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
    top: '100px',
    left: '30px',
    padding: '10px 15px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 2000,
    opacity: 0.9
  }
};

export default GlobalRestartBtn;