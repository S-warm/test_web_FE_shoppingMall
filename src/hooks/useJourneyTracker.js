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
      sessionLog.current.persona_age = parseInt(sessionStorage.getItem('persona_age'), 10);
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
      logIssue('POGO_STICKING', '사용성', 'IA 및 네비게이션 혼란', 'MEDIUM', {
        scroll_y: window.scrollY,
        standard: 'Nielsen #6 (인식보다 기억 최소화) / Morville & Rosenfeld IA 연구',
        detail: `이전 페이지 체류 ${timeSpentOnPrevPage}ms 후 즉시 이탈 (${std.tier} 기준: ${std.INTERACTION.POGO_STICKING_TIME_MS}ms). 메뉴 레이블이 직관적이지 않아 잘못된 페이지로 진입한 것으로 판단`
      });
    }

    // ── 핵심: 같은 URL이면 기존 페이지 재사용, 처음 방문이면 새로 추가 ──
    const fullUrl = window.location.origin + currentUrl;
    const existingPage = sessionLog.current.pages.find(p => p.url === fullUrl);

    if (existingPage) {
      // 이미 방문한 페이지 → visit_count만 증가
      // 이후 발생하는 이슈는 이 페이지 객체에 계속 추가됨
      existingPage.visit_count = (existingPage.visit_count || 1) + 1;
    } else {
      // 처음 방문하는 페이지 → 새로 추가
      sessionLog.current.pages.push({
        step_order: sessionLog.current.pages.length + 1,  // 처음 방문 순서
        url: fullUrl,
        status: 'PASSED',
        visit_count: 1,                                    // 방문 횟수
        total_elements_scanned: document.querySelectorAll('*').length, // DOM 요소 개수
        wcag_grade: 'WCAG 2.1 LEVEL AAA',                 // 초기값 AAA, 이슈 쌓일수록 하향
        page_issues_count: 0,
        wcag_related_count: 0,
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