// src/components/AutoLogger.js
import React, { useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const AutoLogger = ({ children }) => {
  const location = useLocation();
  const lastPath = useRef(location.pathname);
  const { user } = useContext(UserContext); // 현재 로그인한 사람 정보 가져오기

  // ✨ 로그 서버 전송 함수
  const sendLog = async (action, details = {}) => {
    try {
      await axios.post('http://localhost:8080/api/log', {
        username: user.username || user.name || 'guest', // 로그인 ID 없으면 guest
        action: action,
        detail: JSON.stringify(details) // 객체를 문자열로 변환해서 저장
      });
      // console.log(`[LOG SENT] ${action}`); // 확인용 (필요하면 주석 해제)
    } catch (error) {
      // 서버 꺼짐 등으로 전송 실패해도 사용자에게는 티 안 나게 조용히 넘어감
      console.warn("로그 전송 실패:", error);
    }
  };

  // 1. 페이지 이동 감지
  useEffect(() => {
    if (lastPath.current !== location.pathname) {
      sendLog('PAGE_VIEW', { from: lastPath.current, to: location.pathname });
      lastPath.current = location.pathname;
    }
  }, [location]);

  // 2. 클릭 이벤트 감지
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('button, a, input, select, div.product-card');
      if (target) {
        sendLog('CLICK', {
          tagName: target.tagName,
          text: target.innerText || target.value || 'No Text',
          id: target.id || 'No ID'
        });
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [location, user]); // user가 바뀌면 갱신

  return <>{children}</>;
};

export default AutoLogger;