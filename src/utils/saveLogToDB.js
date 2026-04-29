import axios from 'axios';

export const saveLogToDB = async (logData) => {
  if (!logData.session_id) return;

  const startTime =
    parseInt(sessionStorage.getItem('session_start_time'), 10) ||
    (localStorage.getItem('testStartTime')
      ? new Date(localStorage.getItem('testStartTime')).getTime()
      : Date.now());

  logData.duration_ms = Date.now() - startTime;

  // 스킵 한 번이라도 있으면 is_success false
  const hasSkipped = logData.pages.some(page =>
    page.issues.some(issue => issue.issue_type === 'page_skipped')
  );
  if (hasSkipped) {
    logData.is_success = false;
  }

  const orderedLog = {
    session_id: logData.session_id,
    is_success: logData.is_success,
    duration_ms: logData.duration_ms,
    pages: logData.pages.map(page => ({
      step_order: page.step_order,
      url: page.url,
      status: page.status,
      issues: page.issues.map(issue => ({
        issue_type: issue.issue_type,
        target_html: issue.target_html,
        timestamp: issue.timestamp
      }))
    }))
  };

  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/ux-logs/session`, {
      session_id: logData.session_id,
      log_json: JSON.stringify(orderedLog)
    });
    console.log('✅ UX 로그 DB 저장 완료');
  } catch (e) {
    console.error('❌ UX 로그 저장 실패:', e);
  }
};