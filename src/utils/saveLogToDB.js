// src/utils/saveLogToDB.js
import axios from 'axios';

export const saveLogToDB = async (logData) => {
  const startTime =
    parseInt(sessionStorage.getItem('session_start_time'), 10) ||
    (localStorage.getItem('testStartTime')
      ? new Date(localStorage.getItem('testStartTime')).getTime()
      : Date.now());

  logData.duration_ms = Date.now() - startTime;

  try {
    await axios.post('http://localhost:8080/api/ux-logs/session', {
      session_id: logData.session_id,
      persona_age: logData.persona_age,
      is_success: logData.is_success,
      duration_ms: logData.duration_ms,
      pages_json: JSON.stringify(logData.pages)
    });
    console.log('✅ UX 로그 DB 저장 완료');
  } catch (e) {
    console.error('❌ UX 로그 저장 실패:', e);
  }
};