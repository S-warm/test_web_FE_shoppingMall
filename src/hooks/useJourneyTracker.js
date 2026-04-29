// src/hooks/useJourneyTracker.js
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { getStandardByAge } from '../utils/getStandardByAge';

export const useJourneyTracker = () => {
  const location = useLocation();
  const { sessionLog, sharedTrackData, logIssue } = useContext(GlobalLogContext);

  useEffect(() => {
    const currentUrl = location.pathname;
    if (currentUrl === '/') return;

    // 세션 메타데이터 초기화 (최초 1회)
    if (!sessionLog.current.session_id) {
      sessionLog.current.session_id = sessionStorage.getItem('session_id');
    }

    const age = sessionLog.current.persona_age;
    const std = getStandardByAge(age);

    const now = Date.now();
    const timeSpentOnPrevPage = now - sharedTrackData.current.pageEntryTime;

    const isSkipNavigation = sessionStorage.getItem('isSkipNavigation') === 'true';
    sessionStorage.removeItem('isSkipNavigation');
    // 핑퐁 이동 감지
    if (
  !isSkipNavigation &&
  sessionLog.current.pages.length > 0 &&
timeSpentOnPrevPage < std.INTERACTION.POGO_STICKING_TIME_MS &&
  sharedTrackData.current.clickCountOnCurrentPage <= 1
) {
  logIssue('pogo_sticking', {
    target_html: null
  });
}

    // ── 핵심: 같은 URL이면 기존 페이지 재사용, 처음 방문이면 새로 추가 ──
    const fullUrl = window.location.origin + currentUrl;
    const existingPage = sessionLog.current.pages.find(p => p.url === fullUrl);

 if (!existingPage) {
  sessionLog.current.pages.push({
    step_order: sessionLog.current.pages.length + 1,
    url: fullUrl,
    status: 'success',
    issues: []
  });
}
    // 상태 초기화 (페이지 바뀔 때마다 리셋)
    sharedTrackData.current.pageEntryTime = now;
    sharedTrackData.current.clickCountOnCurrentPage = 0;
    sharedTrackData.current.idleCount = 0;
    sharedTrackData.current.idleLogged = false;          // IDLE_TIME 플래그 리셋
    sharedTrackData.current.scrollHijackLogged = false;  // SCROLL_HIJACKING 플래그 리셋

  }, [location.pathname, sessionLog, sharedTrackData, logIssue]);
};