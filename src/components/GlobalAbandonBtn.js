// src/components/GlobalAbandonBtn.js
// ============================================================
// 역할: 테스트 중 포기 버튼
// 동작: 지금까지 진행한 로그를 찍고 실험 종료
//       is_success는 false 유지 (성공 아니니까)
// 위치: 화면 왼쪽 하단 고정
// ============================================================

import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { TimerContext } from '../context/TimerContext';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { saveLogToDB } from '../utils/saveLogToDB';

const GlobalAbandonBtn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(UserContext);
  const { clearCart } = useContext(CartContext);
  const { endTimer } = useContext(TimerContext);
  const { resetLog } = useContext(GlobalLogContext);

  // 시작 페이지와 결제 완료 후에는 버튼 숨김
  if (location.pathname === '/') return null;

  const handleAbandon = async () => {
    if (!window.confirm("테스트를 포기하시겠습니까?\n지금까지의 기록은 저장됩니다.")) return;

    if (window.__log) {
  window.__log.current.is_success = false;
  await saveLogToDB(window.__log.current);
}
    // ── 2. 소요 시간 계산 ─────────────────────────────────────
    const timeResult = endTimer();
    const timeLogStr = timeResult
      ? `${timeResult.formatted} (${timeResult.durationSeconds}초)`
      : "시간 측정 불가";

    // ── 3. DB에 포기 로그 저장 ───────────────────────────────
    try {
      await axios.post('http://localhost:8080/api/log', {
        username: user?.username || user?.name || 'guest',
        action: 'TEST_ABANDON',
        detail: `[포기] 포기 페이지: ${location.pathname} | 소요시간: ${timeLogStr}`
      });
    } catch (e) {
      console.error("로그 저장 실패:", e);
    }

    // ── 4. 정리 후 처음으로 ───────────────────────────────────
    clearCart();
    localStorage.removeItem('testStartTime');
    resetLog(); // 다음 테스터를 위해 로그 초기화
    navigate('/');
  };

  return (
    <button style={styles.abandonBtn} onClick={handleAbandon}>
      테스트 포기
    </button>
  );
};

const styles = {
  abandonBtn: {
    position: 'fixed',
    bottom: '30px',  // 화면 아래쪽
    left: '30px',    // 화면 왼쪽 (스킵 버튼 반대편)
    padding: '12px 20px',
    backgroundColor: '#ff4757', // 포기 느낌의 붉은색
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 2000,
    boxShadow: '0 4px 10px rgba(255, 71, 87, 0.4)',
    transition: 'background 0.3s'
  }
};

export default GlobalAbandonBtn;