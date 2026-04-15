// src/hooks/useMouseTracker.js
// ============================================================
// 역할: 마우스/클릭/스크롤과 관련된 UX 이상 행동을 전역으로 감지하는 Hook
// 감지 항목:
//   1. 광클 (Rage Click)             - 좁은 범위에서 빠르게 연속 클릭
//   2. 헛발질 (Dead Click)           - 비상호작용 요소를 연속 클릭
//   3. 뇌정지 (Idle Time)            - 일정 시간 동안 아무 조작 없음
//   4. 숨바꼭질 피로도                - '더보기/펼치기'를 빠르게 연속 클릭
//   5. 스크롤 납치 (Scroll Hijack)   - 스크롤 타겟이 내부 요소로 변경
//   6. 튜토리얼 스킵 광클             - 팝업/온보딩을 읽지 않고 빠르게 닫음
// 특이사항:
//   - 페르소나 나이 기반 기준값(getStandardByAge) 적용
//   - 모든 클릭 이벤트를 캡처 단계에서 먼저 잡음 (capture: true)
// ============================================================

import { useEffect, useContext, useRef } from 'react';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { getStandardByAge } from '../utils/getStandardByAge';

export const useMouseTracker = () => {
  const { logIssue, sharedTrackData, sessionLog } = useContext(GlobalLogContext);

  // ── 이 Hook 안에서만 쓰는 실시간 상태값들 ──────────────────────────
  // useRef 사용 이유: 값이 바뀌어도 리렌더링이 일어나면 안 되기 때문
  const mouseData = useRef({
    // [광클/헛발질용] 최근 클릭 이력 (최대 5개 유지)
    // 구조: [{ time, x, y, target }, ...]
    clickHistory: [],

    // [뇌정지용] setTimeout 타이머 ID
    // 마우스/스크롤 조작 시마다 리셋됨
    idleTimer: null,

    //현재 페이지 IDEL_Time 발생 횟수
    idleCount: 0,

    // [숨바꼭질 피로도용] '더보기/펼치기' 클릭 횟수
    accordionClickCount: 0,

    // [숨바꼭질 피로도용] 카운트 리셋용 타이머 ID
    accordionTimer: null,

    // [스크롤 납치용] 직전 스크롤 타겟 ('window' 또는 DOM 요소)
    // window 스크롤이었다가 내부 요소로 바뀌면 납치로 판단
    lastScrollTarget: null,

    // [튜토리얼 스킵 광클용] 현재 온보딩 단계 진입 시각
    onboardingStepTime: null,

    // [튜토리얼 스킵 광클용] 연속 스킵 횟수
    onboardingSkipCount: 0,
  });


  useEffect(() => {
    const currentMouseData = mouseData.current;

    // ── 페르소나 나이 기반 기준값 로드 ──────────────────────────────
    // useEffect 실행 시점(마운트 시)에 나이를 읽어서 기준값 결정
    // 나이가 없으면 GENERAL(20대) 기준으로 fallback
    const age = sessionLog.current.persona_age;
    const std = getStandardByAge(age);

    // ================================================================
    // [공통] 뇌정지 타이머 리셋 함수
    // 마우스 이동/스크롤/클릭이 발생할 때마다 호출해서 타이머 초기화
    // IDLE_TIME_MS 동안 아무 조작이 없으면 IDLE_TIME 이슈 기록
    // ================================================================
    const resetIdleTimer = () => {
  if (currentMouseData.idleTimer) clearTimeout(currentMouseData.idleTimer);
  currentMouseData.idleTimer = setTimeout(() => {

    // 페이지당 1회만 찍히게 제한
    if (sharedTrackData.current.idleLogged) return;
    sharedTrackData.current.idleLogged = true;

    sharedTrackData.current.idleCount += 1;
    logIssue('idle_time', {
  target_html: null
});
  }, std.INTERACTION.IDLE_TIME_MS);
};

    // ================================================================
    // [항목 1, 2, 4, 6] 전역 클릭 이벤트 핸들러
    // 모든 클릭을 캡처 단계에서 먼저 받아 각 감지 로직으로 분기
    // ================================================================
    const handleGlobalClick = (e) => {
      resetIdleTimer();
      sharedTrackData.current.clickCountOnCurrentPage += 1;

      const now = Date.now();
      const { clientX: x, clientY: y, target } = e;
      const history = currentMouseData.clickHistory;

      // 클릭 이력에 현재 클릭 추가 (최대 5개 유지)
      history.push({ time: now, x, y, target });
      if (history.length > 5) history.shift();

      // ── [항목 1] 광클 감지 ──────────────────────────────────────
      // 조건: RAGE_CLICK_COUNT회 클릭이 RAGE_CLICK_MS 이내에
      //       RAGE_CLICK_RADIUS_PX 반경 안에서 발생
      if (history.length >= std.INTERACTION.RAGE_CLICK_COUNT) {
        const first = history[history.length - std.INTERACTION.RAGE_CLICK_COUNT];
        const last = history[history.length - 1];

        if (
          last.time - first.time <= std.INTERACTION.RAGE_CLICK_MS &&
          Math.hypot(last.x - first.x, last.y - first.y) < std.INTERACTION.RAGE_CLICK_RADIUS_PX
        ) {
          logIssue('rage_click', {
  target_html: target.outerHTML
});
          // 광클 감지 후 이력 초기화 (중복 로그 방지)
          currentMouseData.clickHistory = [];
          return;
        }
      }

      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');

      // ── [항목 2] 헛발질 감지 ────────────────────────────────────
      // 조건: 상호작용 요소가 아닌 곳을 DEAD_CLICK_TIME_MS 이내에
      //       동일 요소를 2회 연속 클릭
      if (!isInteractive) {
        if (history.length >= 2) {
          const prev = history[history.length - 2];
          const curr = history[history.length - 1];

          if (
            curr.time - prev.time <= std.INTERACTION.DEAD_CLICK_TIME_MS &&
            curr.target === prev.target
          ) {
            logIssue('dead_click', {
  target_html: target.outerHTML
});
          }
        }
      } else {

        // ── [항목 4] 숨바꼭질 피로도 감지 ──────────────────────────
        // 조건: '더보기/펼치기/다음' 텍스트 버튼을
        //       ACCORDION_FATIGUE_MS 내 ACCORDION_FATIGUE_COUNT회 이상 클릭
        const text = target.innerText || '';
        if (text.includes('더보기') || text.includes('펼치기') || text.includes('다음')) {
          currentMouseData.accordionClickCount += 1;

          if (currentMouseData.accordionClickCount >= std.INTERACTION.ACCORDION_FATIGUE_COUNT) {
            logIssue('accordion_fatigue', {
  target_html: text
});
            // 이슈 기록 후 카운트/타이머 리셋
            currentMouseData.accordionClickCount = 0;
            if (currentMouseData.accordionTimer) clearTimeout(currentMouseData.accordionTimer);
          } else {
            // 카운트가 쌓이다가 ACCORDION_FATIGUE_MS 초과 시 리셋
            // (느리게 클릭한 건 피로도로 보지 않음)
            if (currentMouseData.accordionTimer) clearTimeout(currentMouseData.accordionTimer);
            currentMouseData.accordionTimer = setTimeout(() => {
              currentMouseData.accordionClickCount = 0;
            }, std.INTERACTION.ACCORDION_FATIGUE_MS);
          }
        }

        // ── [항목 6] 튜토리얼 스킵 광클 감지 ───────────────────────
        // 조건: 팝업/모달 내부 버튼을 ONBOARDING_STEP_MIN_MS 미만으로 연타
        // ⚠️ 테스트 페이지의 팝업 클래스명이 다르면 아래 조건 수정 필요
        const isOnboardingBtn = (
          target.closest('[role="dialog"]') ||  // ARIA 모달
          target.closest('.modal') ||           // 일반 모달 클래스
          target.closest('.popup')              // 팝업 클래스
        );

        if (isOnboardingBtn) {
          const now2 = Date.now();

          if (!currentMouseData.onboardingStepTime) {
            // 첫 클릭 → 시각 기록만 하고 아직 이슈 아님
            currentMouseData.onboardingStepTime = now2;
          } else {
            const stepDuration = now2 - currentMouseData.onboardingStepTime;

            if (stepDuration < std.INTERACTION.ONBOARDING_STEP_MIN_MS) {
              // ONBOARDING_STEP_MIN_MS 미만으로 다음 단계 이동 → 읽지 않고 스킵
              currentMouseData.onboardingSkipCount += 1;

              if (currentMouseData.onboardingSkipCount >= std.INTERACTION.ONBOARDING_SKIP_COUNT) {
                logIssue('onboarding_skip_rage', {
  target_html: target.outerHTML
});
                // 로그 찍힌 후 리셋
                currentMouseData.onboardingSkipCount = 0;
                currentMouseData.onboardingStepTime = null;
              } else {
                // 아직 임계값 미달 → 다음 클릭 비교를 위해 시각 갱신
                currentMouseData.onboardingStepTime = now2;
              }
            } else {
              // 충분히 읽고 넘긴 것으로 판단 → 카운트 리셋
              currentMouseData.onboardingStepTime = now2;
              currentMouseData.onboardingSkipCount = 0;
            }
          }
        }
      }
    };

    // ================================================================
    // [항목 5] 스크롤 납치 감지
    // 감지 원리: window 스크롤이 정상적으로 일어나다가
    //           클릭 없이 스크롤 타겟이 내부 iframe/div로 바뀌면 납치로 판단
    // capture:true 필수: 내부 요소 스크롤은 window까지 버블링 안 되므로
    //                    캡처 단계에서 잡아야 함
    // ================================================================
    const handleScroll = (e) => {
      resetIdleTimer();

      const scrollTarget = e.target;

      // window(document/body) 스크롤은 정상 상태로 기록
      if (scrollTarget === document || scrollTarget === document.body) {
        currentMouseData.lastScrollTarget = 'window';
        return;
      }

      // 이전에 window 스크롤이었는데 갑자기 내부 요소로 바뀐 경우 → 납치
      if (currentMouseData.lastScrollTarget === 'window') {
        const styles = window.getComputedStyle(scrollTarget);
        const isHijackable = (
          scrollTarget.tagName === 'IFRAME' ||
          scrollTarget.closest('iframe') ||
          // overflow가 scroll/auto인 내부 div (약관 동의 창 등)
          styles.overflow === 'scroll' ||
          styles.overflow === 'auto' ||
          styles.overflowY === 'scroll' ||
          styles.overflowY === 'auto'
        );

        if (isHijackable) {
          if (sharedTrackData.current.scrollHijackLogged) return;
          sharedTrackData.current.scrollHijackLogged = true;

          logIssue('scroll_hijacking', {
  target_html: scrollTarget.outerHTML || null
});
        }
      }

      // 현재 스크롤 타겟 업데이트
      currentMouseData.lastScrollTarget = scrollTarget;
    };

    // ── 이벤트 리스너 등록 ──────────────────────────────────────────
    window.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('scroll', handleScroll, true); // capture:true 필수
    resetIdleTimer(); // 마운트 시 즉시 타이머 시작

    // ── 클린업 ────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('scroll', handleScroll, true);
      if (currentMouseData.idleTimer) clearTimeout(currentMouseData.idleTimer);
      if (currentMouseData.accordionTimer) clearTimeout(currentMouseData.accordionTimer);
    };
  }, [logIssue, sharedTrackData, sessionLog]);
};