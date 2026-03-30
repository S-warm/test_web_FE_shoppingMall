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

// WCAG 명도 대비 공식 - 상대 휘도(Relative Luminance) 계산
const getLuminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// 두 색상 간 명도 대비 비율 계산
// 반환값 예시: 4.5 → "4.5:1 대비"를 의미
const getContrastRatio = (color1, color2) => {
  const rgb1 = color1.match(/\d+/g).map(Number);
  const rgb2 = color2.match(/\d+/g).map(Number);
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

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

      // 3글자 이하 선택은 실수로 드래그한 것으로 간주, 무시
      if (selectedText.length <= 3) return;

      // input/textarea 안에서의 드래그는 일반적인 편집 행위이므로 무시
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const styles = window.getComputedStyle(target);
      const color = styles.color;
      let backgroundColor = styles.backgroundColor;

      // 배경색이 투명이면 부모 요소를 타고 올라가서 실제 배경색 탐색
      let parent = target.parentElement;
      while (backgroundColor === 'rgba(0, 0, 0, 0)' && parent) {
        backgroundColor = window.getComputedStyle(parent).backgroundColor;
        parent = parent.parentElement;
      }

      const fontSize = parseFloat(styles.fontSize);
      let contrastRatio = null;

      try {
        if (backgroundColor !== 'rgba(0, 0, 0, 0)') {
          contrastRatio = getContrastRatio(color, backgroundColor);
        }
      } catch (error) {
        // rgb() 형식이 아닌 색상값이 들어오면 계산 포기
        contrastRatio = null;
      }

      // getStandardByAge가 이미 나이별 기준값을 반환하므로
      // 별도 isSenior 분기 없이 바로 std 값 사용
      const targetContrast = std.VISUAL.MIN_CONTRAST_RATIO;
      const targetFontSize = std.VISUAL.MIN_FONT_SIZE_PX;

      const isLowContrast = contrastRatio !== null && contrastRatio < targetContrast;
      const isSmallFont = fontSize < targetFontSize;

      if (isLowContrast || isSmallFont) {
        const determinedSubCategory = isLowContrast ? '색상 대비 미흡' : '텍스트 크기 미달';
        const determinedStandard = isLowContrast
          ? `WCAG 1.4.3: Contrast (${std.tier} 기준: ${targetContrast}:1)`
          : `WCAG 1.4.4: Resize Text (${std.tier} 기준: ${targetFontSize}px)`;
        const determinedDetail = isLowContrast
          ? `텍스트 대비 ${contrastRatio.toFixed(2)}:1 로 기준치 ${targetContrast}:1 미달 (${std.tier} 기준). 글씨가 안 보여 드래그로 확인 시도`
          : `텍스트 크기 ${fontSize}px 로 기준치 ${targetFontSize}px 미달 (${std.tier} 기준). 글씨가 안 보여 드래그로 확인 시도`;

        logIssue('READING_STRUGGLE', '시각요소', determinedSubCategory, 'LOW', {
          target_html: target.outerHTML?.substring(0, 100) || null,
          coord_x: e.clientX,
          coord_y: e.clientY,
          standard: determinedStandard,
          detail: determinedDetail
        });
      }
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
        logIssue('UNSELECTABLE_TEXT', '사용성', '사용자 제어권 침해', 'MEDIUM', {
          target_html: target.outerHTML?.substring(0, 100) || null,
          coord_x: e.clientX,
          coord_y: e.clientY,
          standard: 'Nielsen #3 (사용자 통제권) / WCAG 1.3.1',
          detail: isUnselectableByCSS
            ? `CSS user-select:none 으로 텍스트 선택이 차단됨 (${std.tier} 기준). 계좌번호/주문번호 등 복사 필수 정보에 적용 시 심각한 UX 문제`
            : `동일 텍스트 영역에서 ${doubleClickCount}회 더블클릭 시도 (${std.tier} 기준: ${std.TEXT_CONTROL.UNSELECTABLE_DBLCLICK_LIMIT}회). 선택이 안 돼서 반복 시도한 것으로 판단`
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