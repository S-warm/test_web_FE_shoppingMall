// src/components/GlobalLogger.js
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useLocation } from 'react-router-dom';

const GlobalLogger = () => {
  const { user } = useContext(UserContext); // 로그인 정보 가져오기
  const location = useLocation(); // 현재 어느 페이지인지 확인

  useEffect(() => {
    // 🖱️ 1. 클릭 감지 CCTV
    const handleClick = (e) => {
      // 사용자가 무엇을 클릭했는지 분석
      const target = e.target;
      const clickedText = target.innerText || target.value || "텍스트 없음";
      const tagName = target.tagName;
      const elementId = target.id || "ID 없음";

      // 서버로 전송할 내용 정리
      const logData = {
        username: user.username || "GUEST",
        action: "CLICK",
        detail: `[페이지: ${location.pathname}] <${tagName} id="${elementId}"> 클릭함 - 내용: "${clickedText.substring(0, 30)}..."`
      };

      // 서버로 전송 (콘솔에 에러 안 뜨게 조용히 보냄)
      sendLog(logData);
    };

    // ⌨️ 2. 키보드 입력 감지 CCTV (Enter 칠 때나 입력 끝났을 때)
    const handleChange = (e) => {
      const target = e.target;
      
      // 비밀번호는 절대 로그로 남기면 안 됨! (보안 문제)
      if (target.type === 'password') return;

      const logData = {
        username: user.username || "GUEST",
        action: "INPUT_CHANGE",
        detail: `[페이지: ${location.pathname}] 입력창(${target.placeholder || target.name}) 변경 - 값: "${target.value}"`
      };

      sendLog(logData);
    };

    // 📡 로그 전송 함수
    const sendLog = async (data) => {
      try {
        await axios.post('http://localhost:8080/api/log', data);
        // console.log("자동 로그 전송:", data.detail); // 개발 중에만 켜두세요
      } catch (err) {
        // 로그 전송 실패는 사용자에게 알리지 않음 (방해되니까)
      }
    };

    // 🎯 화면 전체(window)에 CCTV 설치
    window.addEventListener('click', handleClick);
    window.addEventListener('change', handleChange); // 입력 후 포커스 잃을 때 기록

    // 컴포넌트 사라질 때 CCTV 철거 (청소)
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('change', handleChange);
    };
  }, [user, location]); // 페이지나 유저가 바뀔 때마다 갱신

  return null; // 화면엔 아무것도 안 보여줌
};

export default GlobalLogger;