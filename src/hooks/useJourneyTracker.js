// src/hooks/useJourneyTracker.js
// ============================================================
// 역할: 페이지 이동과 관련된 UX 이상 행동을 감지하는 Hook
// 감지 항목:
//   1. 핑퐁 이동 (Pogo-Sticking) - 새 페이지 진입 후 너무 빨리 이탈
// 특이사항:
//   - useLocation()으로 React Router의 URL 변화를 감지
//   - 페이지가 바뀔 때마다 sessionLog에 새 페이지 정보를 추가
//   - 페르소나 나이 기반 기준값(getStandardByAge) 적용
// ============================================================

import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { getStandardByAge } from '../utils/getStandardByAge';

export const useJourneyTracker = () => {
  const location = useLocation();
  const { sessionLog, sharedTrackData, logIssue } = useContext(GlobalLogContext);

  useEffect(() => {
    const currentUrl = location.pathname;

    // '/' (루트) 페이지는 추적 제외
    // 시작 페이지는 실험 대상이 아니므로 로그에 포함하지 않음
    if (currentUrl === '/') return;

    // ── 세션 메타데이터 초기화 (최초 1회) ──────────────────────────
    // sessionLog에 session_id가 없으면 아직 초기화 안 된 것
    // sessionStorage에서 StartPage가 저장해둔 값을 읽어서 채움
    if (!sessionLog.current.session_id) {
      sessionLog.current.session_id = sessionStorage.getItem('session_id');
      sessionLog.current.persona_age = parseInt(sessionStorage.getItem('persona_age'), 10);
    }

    // ── 페르소나 나이 기반 기준값 로드 ──────────────────────────────
    // 나이가 아직 없으면 GENERAL(20대) 기준으로 fallback
    const age = sessionLog.current.persona_age;
    const std = getStandardByAge(age);

    const now = Date.now();

    // 이전 페이지에서 머문 시간 계산
    // pageEntryTime: 이전 페이지에 진입했을 때 기록해둔 타임스탬프
    const timeSpentOnPrevPage = now - sharedTrackData.current.pageEntryTime;

    // ── [핑퐁 이동 감지] ──────────────────────────────────────────
    // 조건 1: 이전 페이지가 존재해야 함 (첫 페이지 진입은 제외)
    // 조건 2: 이전 페이지 체류 시간이 POGO_STICKING_TIME_MS 미만
    // 조건 3: 이전 페이지에서 클릭이 1회 이하 (스크롤만 하다가 나간 경우)
    //         클릭이 2회 이상이면 의도적으로 탐색한 것으로 간주
    if (
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

    // ── 새 페이지 정보를 sessionLog에 추가 ───────────────────────────
    // 페이지가 바뀔 때마다 pages 배열에 새 항목 추가
    // 이후 이 페이지에서 발생하는 이슈들은 이 항목의 issues 배열에 쌓임
    sessionLog.current.pages.push({
      step_order: sessionLog.current.pages.length + 1,  // 몇 번째 페이지인지
      url: window.location.origin + currentUrl,          // 전체 URL
      status: 'PASSED',                                  // 이슈 없으면 PASSED, 있으면 HAS_ISSUES로 변경됨
      wcag_grade: 'WCAG 2.1 LEVEL AAA',
      total_elements_scanned: document.querySelectorAll('*').length, // total_elements_scanned: 페이지 진입 시점의 전체 DOM 요소 개수
      page_issues_count: 0,
      wcag_related_count: 0,
      issues: []
    });

    // ── 페이지 진입 상태 초기화 ──────────────────────────────────────
    // 새 페이지로 넘어왔으니 타이머와 클릭 카운트 리셋
    sharedTrackData.current.pageEntryTime = now;
    sharedTrackData.current.clickCountOnCurrentPage = 0;
    sharedTrackData.current.idleCount = 0;
  
    // location.pathname이 바뀔 때마다 이 effect 재실행
  }, [location.pathname, sessionLog, sharedTrackData, logIssue]);
};