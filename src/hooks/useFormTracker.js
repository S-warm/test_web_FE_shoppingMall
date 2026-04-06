// src/hooks/useFormTracker.js
// ============================================================
// 역할: 폼(Form) 입력과 관련된 UX 이상 행동을 전역으로 감지하는 Hook
// 감지 항목:
//   1. 폼 입력 지옥 (Form Input Hell)       - 같은 필드를 반복해서 지웠다 다시 씀
//   2. 비밀번호 눈가림 (Blind Password)     - 비밀번호 필드를 반복 전체 삭제
//   3. 탭-마우스 강제 전환                  - Tab 후 마우스로 클릭 (포커스 미이동)
//   4. 찰나의 피드백 (Flash Feedback)       - 에러 메시지가 너무 빨리 사라짐
//   5. 초기화 분노 (State-Loss Re-entry)    - 뒤로가기 후 폼 데이터 날아감
// 특이사항:
//   - 페르소나 나이 기반 기준값(getStandardByAge) 적용
//   - 항목 4는 MutationObserver로 DOM 변화를 감시
//   - 항목 5는 pageshow 이벤트의 persisted 속성으로 BFCache 복원 감지
// ============================================================

import { useEffect, useContext, useRef } from 'react';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { getStandardByAge } from '../utils/getStandardByAge';

export const useFormTracker = () => {
  const { logIssue, sessionLog } = useContext(GlobalLogContext);

  const formData = useRef({
    // [항목 1, 2용] 필드별 전체삭제 횟수
    // 구조 예시: { "password": 2, "phone": 1 }
    // 키: input의 id → name → placeholder 순으로 대체
    clearCountMap: {},

    // [항목 3용] Tab 키를 마지막으로 누른 시각
    // null이면 Tab을 누른 적 없는 상태
    lastTabTime: null,

    // [항목 5용] 페이지를 떠나기 직전 폼 입력값 스냅샷
    // 구조 예시: { "email-prefix": "test", "phone": "010" }
    prevPageFormSnapshot: null,
  });

  useEffect(() => {
    const currentFormData = formData.current;

    // ── 페르소나 나이 기반 기준값 로드 ──────────────────────────────
    const age = sessionLog.current.persona_age;
    const std = getStandardByAge(age);

    // ================================================================
    // [항목 4용] MutationObserver 설정
    // 에러 메시지 요소가 DOM에 추가/제거되는 순간을 감시
    // 추가 시각과 제거 시각의 차이가 FLASH_FEEDBACK_MIN_MS 미만이면 이슈 기록
    // ================================================================

    // 에러 메시지별 나타난 시각 저장소
    // 구조 예시: { "error error-message": 1711540000000 }
    const errorTimerMap = {};

    // ⚠️ 중요: SignupPage의 에러 div에 className="error-message"가 붙어있어야 감지됨
    // 다른 페이지에도 에러 메시지가 있으면 동일하게 className 추가 필요
    const isErrorNode = (node) => {
      if (node.nodeType !== 1) return false; // Element 노드만 처리
      return (
        node.classList?.contains('error-message') ||
        node.classList?.contains('error') ||
        node.getAttribute?.('role') === 'alert'
      );
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {

        // 에러 메시지 DOM에 추가됨 → 나타난 시각 기록
        mutation.addedNodes.forEach((node) => {
          if (!isErrorNode(node)) return;
          const id = node.id || node.className;
          errorTimerMap[id] = Date.now();
        });

        // 에러 메시지 DOM에서 제거됨 → 노출 시간 계산
        mutation.removedNodes.forEach((node) => {
          if (!isErrorNode(node)) return;
          const id = node.id || node.className;
          const appearedAt = errorTimerMap[id];
          if (!appearedAt) return;

          const visibleDuration = Date.now() - appearedAt;
          delete errorTimerMap[id];

          // FLASH_FEEDBACK_MIN_MS 미만으로 노출됐으면 이슈 기록
          if (visibleDuration < std.INTERACTION.FLASH_FEEDBACK_MIN_MS) {
            logIssue('flash_feedback', {
  target_html: node.outerHTML || null
});
          }
        });
      });
    });

    // document.body 전체를 감시 (subtree: true → 모든 자손 요소 포함)
    observer.observe(document.body, { childList: true, subtree: true });

    // ================================================================
    // [항목 1, 2] 폼 입력 지옥 + 비밀번호 눈가림
    // value가 0글자가 될 때마다 카운트
    // 일반 필드: FORM_CLEAR_LIMIT 이상 → 폼 입력 지옥
    // 비밀번호 필드: PASSWORD_CLEAR_LIMIT 이상 → 비밀번호 눈가림
    // ================================================================
    const handleInput = (e) => {
      const target = e.target;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;

      const isPassword = target.type === 'password';

      // 필드 식별 키 (id → name → placeholder 순)
      // ⚠️ id가 없으면 placeholder로 식별하므로 input에 id 속성 권장
      const fieldKey = target.id || target.name || target.placeholder || 'unknown';

      // 값이 완전히 빈 상태가 됐을 때만 카운트
      if (target.value.length === 0) {
        if (!currentFormData.clearCountMap[fieldKey]) {
          currentFormData.clearCountMap[fieldKey] = 0;
        }
        currentFormData.clearCountMap[fieldKey] += 1;

        const clearCount = currentFormData.clearCountMap[fieldKey];
        const limit = isPassword
          ? std.INTERACTION.PASSWORD_CLEAR_LIMIT  // 비밀번호: 더 엄격한 기준
          : std.INTERACTION.FORM_CLEAR_LIMIT;     // 일반 필드

        if (clearCount >= limit) {
          if (isPassword) {
           logIssue('blind_password', {
  target_html: target.outerHTML
});
          } else {
            logIssue('form_input_hell', {
  target_html: target.outerHTML
});
          }
          // 임계값 도달 후 리셋 (이후 추가 삭제 시 중복 로그 방지)
          currentFormData.clearCountMap[fieldKey] = 0;
        }
      }
    };

    // ================================================================
    // [항목 3] 탭-마우스 강제 전환
    // Step 1) Tab 키 누른 시각 기록
    // Step 2) FORCED_MOUSE_MS 이내에 폼 요소 마우스 클릭 → 이슈 기록
    // ================================================================
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        currentFormData.lastTabTime = Date.now();
      }
    };

    const handleMouseClickForTab = (e) => {
      if (!currentFormData.lastTabTime) return;

      const timeSinceTab = Date.now() - currentFormData.lastTabTime;

      // FORCED_MOUSE_MS 초과 → 일반적인 마우스 사용으로 간주
      if (timeSinceTab > std.INTERACTION.FORCED_MOUSE_MS) {
        currentFormData.lastTabTime = null;
        return;
      }

      // 폼 관련 요소(input, select, button, textarea) 클릭인지 확인
      // 빈 공간 클릭은 포커스 이동 실패와 무관하므로 제외
      const isFormElement = e.target.closest('input, select, button, textarea');
      if (!isFormElement) return;

     logIssue('forced_mouse_fallback', {
  target_html: e.target.outerHTML
});

      currentFormData.lastTabTime = null; // 중복 로그 방지
    };

    // ================================================================
    // [항목 5] 초기화 분노 (State-Loss Re-entry)
    // 페이지를 떠나기 전 폼 값을 스냅샷으로 저장
    // 뒤로가기로 돌아왔을 때 현재 폼 값과 비교해서 날아간 필드 찾기
    // ================================================================

    // 현재 페이지의 모든 input/textarea/select 값을 객체로 저장
    const snapshotFormValues = () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      const snapshot = {};
      inputs.forEach((el) => {
        const key = el.id || el.name || el.placeholder;
        if (key) snapshot[key] = el.value;
      });
      return snapshot;
    };

    const handlePageShow = (e) => {
      // e.persisted: true → BFCache(뒤로-앞으로 캐시)에서 복원 = 뒤로가기로 돌아온 경우
      // e.persisted: false → 새로 로드된 경우 (첫 방문, 새로고침)
      if (e.persisted) {
        const currentSnapshot = snapshotFormValues();
        const prev = currentFormData.prevPageFormSnapshot;

        if (prev) {
          // 이전에 값이 있었는데 지금 비어있는 필드 찾기
          const lostFields = Object.keys(prev).filter(
            (key) =>
              prev[key] && prev[key].length > 0 &&
              (!currentSnapshot[key] || currentSnapshot[key].length === 0)
          );

          if (lostFields.length > 0) {
            logIssue('state_loss_reentry', {
  target_html: null
});
          }
        }
      }

      // 뒤로가기 여부와 관계없이 현재 폼 상태를 다음 비교를 위해 저장
      currentFormData.prevPageFormSnapshot = snapshotFormValues();
    };

    // 페이지를 떠나기 직전 폼 상태 저장
    const handleBeforeUnload = () => {
      currentFormData.prevPageFormSnapshot = snapshotFormValues();
    };

    // ── 이벤트 리스너 등록 ──────────────────────────────────────────
    window.addEventListener('input', handleInput, true);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('click', handleMouseClickForTab, true);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // ── 클린업 ────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('input', handleInput, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('click', handleMouseClickForTab, true);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      observer.disconnect(); // MutationObserver 감시 중단
    };
  }, [logIssue, sessionLog]);
};