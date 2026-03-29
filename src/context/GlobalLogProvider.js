// src/context/GlobalLogProvider.js
import React, { createContext, useRef, useEffect, useCallback } from 'react';

export const GlobalLogContext = createContext();

export const GlobalLogProvider = ({ children }) => {

  const sessionLog = useRef({
    session_id: '',
    persona_age: null,
    is_success: false,
    duration_ms: 0,
    total_issues_count: 0,
    pages: []
  });

  const sharedTrackData = useRef({
    pageEntryTime: Date.now(),
    clickCountOnCurrentPage: 0,
    idleCount: 0, // 페이지별 IDLE_TIME 발생 횟수 (useJourneyTracker에서 페이지 바뀔 때 리셋)
  });

  // ================================================================
  // skipCurrentPage: 스킵 버튼 클릭 시 현재 페이지를 SKIPPED로 마킹
  // GlobalSkipBtn.js에서 navigate 하기 전에 호출
  // ================================================================
  const skipCurrentPage = useCallback(() => {
    const pages = sessionLog.current.pages;
    const currentPage = pages[pages.length - 1];
    if (currentPage) {
      currentPage.status = 'SKIPPED';
      currentPage.issues.push({
        issue_type: 'PAGE_SKIPPED',
        category: '여정',
        sub_category: '단계 건너뜀',
        detail: '사용자가 이 단계를 포기하고 건너뜀. 해당 페이지 UX 평가 불가',
        severity: 'HIGH',
        target_html: null,
        coord_x: null,
        coord_y: null,
        scroll_y: window.scrollY,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  // ================================================================
  // logIssue: 전역 이슈 기록 함수
  // useCallback으로 감싸는 이유: 각 Hook의 useEffect 의존성 배열에
  // logIssue가 들어가는데, 일반 함수로 선언하면 렌더링마다 새로운
  // 함수가 생성되어 useEffect가 무한 재실행되는 문제가 발생함
  // ================================================================
  const logIssue = useCallback((issueType, category, subCategory, severity, detailData) => {
    const pages = sessionLog.current.pages;
    const currentPage = pages[pages.length - 1];

    if (currentPage) {

      // ── 중복 이슈 체크 ────────────────────────────────────────
      // IDLE_TIME은 횟수 자체가 의미있는 데이터라 중복 허용
      // 나머지는 같은 issue_type + 같은 target_html 조합이
      // 30초 이내에 이미 찍혔으면 중복으로 간주하고 스킵
      const DUPLICATE_EXEMPT = ['IDLE_TIME'];

      if (!DUPLICATE_EXEMPT.includes(issueType)) {
        const now = Date.now();
        const isDuplicate = currentPage.issues.some((issue) => {
          const timeDiff = now - new Date(issue.timestamp).getTime();
          return (
            issue.issue_type === issueType &&                         // 같은 이슈 타입
            issue.target_html === (detailData.target_html || null) && // 같은 요소
            timeDiff < 30000                                          // 30초 이내
          );
        });

        // 중복이면 기록하지 않고 종료
        if (isDuplicate) return;
      }
      // ──────────────────────────────────────────────────────────

      currentPage.status = 'HAS_ISSUES';
      currentPage.page_issues_count += 1;
      sessionLog.current.total_issues_count += 1;

      // 접근성(WCAG) 관련 이슈일 경우 관련 카운트 증가
      if (category === '접근성' || (detailData.standard && detailData.standard.includes('WCAG'))) {
        if (currentPage.wcag_related_count === undefined) {
          currentPage.wcag_related_count = 0;
        }
        currentPage.wcag_related_count += 1;
      }

      currentPage.issues.push({
        issue_type: issueType,
        category: category,
        sub_category: subCategory,
        detail: detailData.detail || null,
        severity: severity,
        target_html: detailData.target_html || null,
        coord_x: detailData.coord_x !== undefined ? detailData.coord_x : null,
        coord_y: detailData.coord_y !== undefined ? detailData.coord_y : null,
        scroll_y: detailData.scroll_y !== undefined ? detailData.scroll_y : window.scrollY,
        timestamp: new Date().toISOString()
      });
    }
  }, []); // sessionLog는 useRef라 렌더링과 무관하므로 의존성 배열에 불필요

  // ================================================================
  // 세션 종료 로직
  // 컴포넌트 언마운트 시 duration_ms 계산 후 콘솔에 최종 로그 출력
  // 나중에 Spring 연동 시 console.log를 axios.post로 교체
  // ================================================================
 // GlobalLogProvider.js - useEffect 수정
useEffect(() => {
  window.__log = sessionLog;
  const handleSuccessEvent = () => {
    sessionLog.current.is_success = true;
  };

  // ── 세션 종료: 브라우저 탭 닫거나 새로고침할 때 로그 출력 ──────
  // 기존 클린업 방식은 컴포넌트 언마운트 시점에 실행되는데
  // 개발 환경에서 타이밍이 꼬여서 빈 로그가 찍히는 문제 발생
  // beforeunload로 변경하면 실제로 브라우저를 닫을 때만 실행됨
  const handleBeforeUnload = () => {
    const startTime =
      parseInt(sessionStorage.getItem('session_start_time'), 10) ||
      (localStorage.getItem('testStartTime')
        ? new Date(localStorage.getItem('testStartTime')).getTime()
        : Date.now());

    sessionLog.current.duration_ms = Date.now() - startTime;

    console.warn('===== [세션 종료] 최종 산출된 JSON 로그 =====');
    console.log(JSON.stringify(sessionLog.current, null, 2));
  };

  window.addEventListener('test_success', handleSuccessEvent);
  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('test_success', handleSuccessEvent);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);

  return (
    <GlobalLogContext.Provider value={{ sessionLog, sharedTrackData, logIssue, skipCurrentPage }}>
      {children}
    </GlobalLogContext.Provider>
  );
};