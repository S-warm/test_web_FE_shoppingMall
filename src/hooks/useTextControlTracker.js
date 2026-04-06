// src/hooks/useTextControlTracker.js
// ============================================================
// 역할: 텍스트 선택/복사 관련 UX 이상 행동을 전역으로 감지하는 Hook
// 감지 항목:
//   1. 드래그 돋보기 (Reading Struggle)   - 글씨가 안 보여서 드래그로 확인 시도
//   2. 복사 금지 (Unselectable Text)      - 필수 정보가 선택/복사가 안 됨
// 특이사항:
//   - 페르소나 나이 기반 기준값(getStandardByAge) 적용
//   - 드래그 돋보기: mouseup 이벤트에서 선택된 텍스트의 스타일 분석
//   - 복사 금지: dblclick 횟수 누적으로 감지
// ============================================================

import { useEffect, useContext } from 'react';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { getStandardByAge } from '../utils/getStandardByAge';

// ================================================================
// 순수 연산 함수 (Hook 바깥에 위치)
// Hook 안에 넣으면 렌더링마다 재생성되어 useEffect 의존성 배열 경고 발생
// ================================================================


export const useTextControlTracker = () => {
  const { sessionLog, logIssue } = useContext(GlobalLogContext);

  useEffect(() => {
    // ── 페르소나 나이 기반 기준값 로드 ──────────────────────────────
    const age = sessionLog.current.persona_age;
    const std = getStandardByAge(age);

    // ================================================================
    // [항목 1] 드래그 돋보기 감지 (Reading Struggle)
    // 일반 텍스트를 드래그했을 때 해당 텍스트의 대비/폰트 크기가
    // 페르소나 기준치 미달이면 "안 보여서 드래그한 것"으로 판단
    // ================================================================
  const handleMouseUp = (e) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  const target = e.target;

  if (selectedText.length <= 3) return;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

  logIssue('reading_struggle', {
    target_html: target.outerHTML || null
  });
};

    // ================================================================
    // [항목 2] 복사 금지 감지 (Unselectable Text)
    // 더블클릭을 UNSELECTABLE_WINDOW_MS 이내에
    // UNSELECTABLE_DBLCLICK_LIMIT회 이상 시도했는데
    // CSS user-select:none 이거나 선택이 안 되면 이슈 기록
    // ================================================================

    // 클로저 변수로 관리 (이 effect 안에서만 쓰이기 때문)
    let doubleClickCount = 0;
    let lastDoubleClickTime = 0;

    const handleDoubleClick = (e) => {
      const target = e.target;

      // 더블클릭이 자연스러운 요소는 무시
      if (target.closest('input, textarea, button, a, select')) return;

      const now = Date.now();
      const styles = window.getComputedStyle(target);

      // CSS로 선택 자체가 막힌 경우
      const isUnselectableByCSS = styles.userSelect === 'none';

      // UNSELECTABLE_WINDOW_MS 이내 더블클릭만 카운트
      if (now - lastDoubleClickTime < std.TEXT_CONTROL.UNSELECTABLE_WINDOW_MS) {
        doubleClickCount += 1;
      } else {
        // 시간 초과 → 새로운 시도로 리셋
        doubleClickCount = 1;
      }
      lastDoubleClickTime = now;

      if (isUnselectableByCSS || doubleClickCount >= std.TEXT_CONTROL.UNSELECTABLE_DBLCLICK_LIMIT) {
       logIssue('unselectable_text', {
  target_html: target.outerHTML || null
});
        doubleClickCount = 0; // 이슈 기록 후 리셋
      }
    };

    // ── 이벤트 리스너 등록 ──────────────────────────────────────────
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [logIssue, sessionLog]);
};