import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { TimerContext } from '../context/TimerContext';
import { saveLogToDB } from '../utils/saveLogToDB';

const GlobalSkipBtn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user } = useContext(UserContext);
  const { clearCart } = useContext(CartContext);
  const { endTimer } = useContext(TimerContext);
  const { skipCurrentPage, resetLog } = useContext(GlobalLogContext);

  if (location.pathname === '/') return null;

  const handleSkip = async () => {
    const currentPath = location.pathname;
    
    if (currentPath !== '/payment') {
      skipCurrentPage();
    }

    sessionStorage.setItem('isSkipNavigation', 'true');

    if (currentPath === '/login') {
      alert("⏭ 단계 건너뛰기: 회원가입 페이지로 이동합니다.");
      navigate('/signup');
    } else if (currentPath === '/signup') {
      alert("⏭ 단계 건너뛰기: 쇼핑몰 메인으로 이동합니다.");
      navigate('/shop');
    } else if (currentPath === '/shop' || currentPath.includes('/product')) {
      alert("⏭ 단계 건너뛰기: 장바구니 페이지로 이동합니다.");
      navigate('/cart');
    } else if (currentPath === '/cart') {
      alert("⏭ 단계 건너뛰기: 결제 페이지로 이동합니다.");
      navigate('/payment');
    } else if (currentPath === '/payment') {
      if (window.confirm("⏭ 이 단계를 건너뛰고 실험을 종료하시겠습니까?\n(가상으로 결제 완료 처리됩니다)")) {
        await finishTestForcefully();
      }
    }
  };

  const finishTestForcefully = async () => {
    const timeResult = endTimer(); 
    let timeLogStr = "시간 측정 불가";
    if (timeResult) {
      timeLogStr = `${timeResult.formatted} (${timeResult.durationSeconds}초)`;
    }

    if (window.__log) {
      // payment 페이지 status skipped로 변경
      const pages = window.__log.current.pages;
      const currentPage = pages[pages.length - 1];
      if (currentPage) {
        currentPage.status = 'skipped';
        currentPage.issues.push({
          issue_type: 'page_skipped',
          target_html: null,
          timestamp: new Date().toISOString()
        });
      }
      window.__log.current.is_success = false;
      await saveLogToDB(window.__log.current);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/log`, {
        username: user.username || user.name || 'guest',
        action: 'TEST_END',
        detail: `[건너뛰기로 종료] 수단:SKIP | 소요시간: ${timeLogStr}`
      });

      alert(`[실험 종료]\n건너뛰기를 통해 가상 결제가 완료되었습니다.\n소요시간: ${timeResult ? timeResult.formatted : '측정불가'}`);
      
      sessionStorage.removeItem('hasViewedTerms');
      resetLog();
      clearCart();
      navigate('/');

    } catch (e) {
      console.error("로그 전송 실패", e);
      sessionStorage.removeItem('hasViewedTerms');
      resetLog();
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
    bottom: '30px',
    right: '30px',
    padding: '12px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid #555',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 2000,
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'background 0.3s'
  }
};

export default GlobalSkipBtn;