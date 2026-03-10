import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';

const Timer = () => {
  const { elapsedTime } = useContext(TimerContext);

  const formatTime = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '60px', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', zIndex: 1000 }}>
      ⏳ 경과 시간: {formatTime(elapsedTime)}
    </div>
  );
};

export default Timer;