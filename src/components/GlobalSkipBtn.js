import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { TimerContext } from '../context/TimerContext';

const GlobalSkipBtn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 결제 완료 처리를 위해 필요한 Context들
  const { user } = useContext(UserContext);
  const { clearCart } = useContext(CartContext);
  const { endTimer } = useContext(TimerContext);

  // 시작 페이지('/')에서는 버튼을 보여주지 않음 (시작 버튼을 눌러야 하니까)
  if (location.pathname === '/') return null;

  const handleSkip = async () => {
    const currentPath = location.pathname;

    // 1️⃣ 로그인 페이지 -> 회원가입으로
    if (currentPath === '/login') {
      alert("⏭ 단계 건너뛰기: 회원가입 페이지로 이동합니다.");
      navigate('/signup');
    } 
    // 2️⃣ 회원가입 페이지 -> 쇼핑몰 홈으로
    else if (currentPath === '/signup') {
      alert("⏭ 단계 건너뛰기: 쇼핑몰 메인으로 이동합니다.");
      navigate('/shop');
    }
    // 3️⃣ 쇼핑몰 홈 -> 장바구니로
    else if (currentPath === '/shop' || currentPath.includes('/product')) {
      alert("⏭ 단계 건너뛰기: 장바구니 페이지로 이동합니다.");
      navigate('/cart');
    }
    // 4️⃣ 장바구니 -> 결제 페이지로
    else if (currentPath === '/cart') {
      alert("⏭ 단계 건너뛰기: 결제 페이지로 이동합니다.");
      navigate('/payment');
    }
    // 5️⃣ ✨ 결제 페이지 -> 실험 종료 (결제하기 버튼과 동일한 기능)
    else if (currentPath === '/payment') {
        if (window.confirm("⏭ 이 단계를 건너뛰고 실험을 종료하시겠습니까?\n(가상으로 결제 완료 처리됩니다)")) {
            await finishTestForcefully();
        }
    }
  };

  // ✨ 강제 실험 종료 함수 (결제 페이지 로직과 동일)
  const finishTestForcefully = async () => {
    // 시간 측정 종료
    const timeResult = endTimer(); 
    let timeLogStr = "시간 측정 불가";
    if (timeResult) {
        timeLogStr = `${timeResult.formatted} (${timeResult.durationSeconds}초)`;
    }

    try {
        // 서버로 로그 전송 (SKIP_COMPLETE로 구분)
        await axios.post('http://localhost:8080/api/log', {
            username: user.username || user.name || 'guest',
            action: 'TEST_END', // DB에는 TEST_END로 기록 (분석용)
            detail: `[건너뛰기로 종료] 수단:SKIP | 소요시간: ${timeLogStr}`
        });

        alert(`[실험 종료]\n건너뛰기를 통해 가상 결제가 완료되었습니다.\n소요시간: ${timeResult ? timeResult.formatted : '측정불가'}`);
        
        // 정리하고 처음으로
        clearCart();
        navigate('/');

    } catch (e) {
        console.error("로그 전송 실패", e);
        clearCart();
        navigate('/');
    }
  };

  return (
    <button style={styles.skipBtn} onClick={handleSkip}>
      ⏭ 이 단계 건너뛰기 (SKIP)
    </button>
  );
};

const styles = {
  skipBtn: {
    position: 'fixed',
    bottom: '30px', // 화면 아래쪽
    right: '30px',  // 화면 오른쪽
    padding: '12px 20px',
    backgroundColor: '#333', // 검은색 배경
    color: '#fff',
    border: '2px solid #555',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 2000, // 다른 요소들보다 무조건 위에 뜨게
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'background 0.3s'
  }
};

export default GlobalSkipBtn;