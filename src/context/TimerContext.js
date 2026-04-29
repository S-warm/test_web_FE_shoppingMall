// src/context/TimerContext.js
import React, { createContext, useState } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  // 시작 시간 (새로고침 해도 기억하도록 로컬스토리지 사용)
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('testStartTime');
    if (saved) return new Date(saved);
    const now = new Date();
    localStorage.setItem('testStartTime', now.toString());
    return now;
  });

  // 1. 테스트 시작 (StartPage에서 호출)
  const startTimer = () => {
    const now = new Date();
    setStartTime(now);
    localStorage.setItem('testStartTime', now.toString()); // 저장
    console.log("⏱️ 실험 타이머 시작:", now.toLocaleString());
  };

  // 2. 테스트 종료 및 시간 계산 (PaymentPage에서 호출)
  // 반환값: { start, end, durationSeconds, formatted }
  const endTimer = () => {
    if (!startTime) return null;

    const endTime = new Date();
    const durationMs = endTime - startTime; // 밀리초 단위 차이 (예: 15000ms)
    const durationSeconds = Math.floor(durationMs / 1000); // 초 단위 변환 (예: 15초)

    // 보기 좋게 포맷팅 (분:초)
    const min = Math.floor(durationSeconds / 60);
    const sec = durationSeconds % 60;
    const formatted = `${min}분 ${sec}초`;

    // 다 썼으니 초기화
    localStorage.removeItem('testStartTime');
    setStartTime(null);

    return {
      startTime: startTime.toLocaleString(),
      endTime: endTime.toLocaleString(),
      durationSeconds: durationSeconds,
      formatted: formatted
    };
  };

  return (
    <TimerContext.Provider value={{ startTimer, endTimer }}>
      {children}
    </TimerContext.Provider>
  );
};