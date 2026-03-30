// src/hooks/useSearchTracker.js
// ============================================================
// 역할: 검색 관련 UX 이상 행동을 전역으로 감지하는 Hook
// 감지 항목:
//   1. 깡통 검색어 이탈 (Empty Search Frustration)
//      - 결과 없음 상태에서 검색어를 수정하다가 결국 이탈
// 특이사항:
//   - 페르소나 나이 기반 기준값(getStandardByAge) 적용
//   - React Router 이동은 beforeunload로 잡히지 않으므로
//     popstate와 beforeunload 둘 다 등록
//   - 결과 없음 감지는 DOM 텍스트와 CSS 클래스 두 가지 방법 사용
// ============================================================

import { useEffect, useContext, useRef } from 'react';
import { GlobalLogContext } from '../context/GlobalLogProvider';
import { getStandardByAge } from '../utils/getStandardByAge';

export const useSearchTracker = () => {
  const { logIssue, sessionLog } = useContext(GlobalLogContext);

  const searchData = useRef({
    // 마지막으로 검색어를 제출한 시각
    lastSearchTime: null,

    // 결과 없음 상태에서 검색어를 수정한 횟수
    emptyResultRetryCount: 0,

    // 마지막으로 검색한 검색어 (수정 여부 판단용)
    lastSearchQuery: '',

    // 현재 검색 결과가 없는 상태인지 여부
    isEmptyResult: false,
  });

  useEffect(() => {
    const currentSearchData = searchData.current;

    // ── 페르소나 나이 기반 기준값 로드 ──────────────────────────────
    const age = sessionLog.current.persona_age;
    const std = getStandardByAge(age);

    // ================================================================
    // 검색 결과가 없는 상태인지 DOM에서 확인하는 함수
    // ⚠️ 테스트 페이지의 "결과 없음" 표시 방식에 따라 조건 수정 필요
    //    현재 감지 방법:
    //    1. body 텍스트에 "결과 없음" 관련 키워드 포함 여부
    //    2. .no-results / .empty-result / [data-empty="true"] 요소 존재 여부
    // ================================================================
    const checkIsEmptyResult = () => {
      const bodyText = document.body.innerText;
      const emptyKeywords = [
        '검색 결과가 없습니다',
        '결과가 없습니다',
        '상품이 없습니다',
        'No results',
        '검색된 상품이 없습니다'
      ];
      const hasEmptyText = emptyKeywords.some((keyword) => bodyText.includes(keyword));
      const hasEmptyClass = !!document.querySelector('.no-results, .empty-result, [data-empty="true"]');
      return hasEmptyText || hasEmptyClass;
    };

    // ================================================================
    // 검색 제출 감지
    // Enter 키 또는 검색 버튼 클릭으로 검색이 실행될 때 감지
    // ================================================================
    const handleSearchSubmit = (e) => {
      // Enter 키 이벤트일 때만 처리 (keydown 핸들러용)
      if (e.type === 'keydown' && e.key !== 'Enter') return;

      const target = e.target;

      // 검색창 input인지 확인
      // ⚠️ 테스트 페이지의 검색창 구조에 따라 조건 수정 필요
      const isSearchInput = (
        target.type === 'search' ||
        target.closest('form[role="search"]') ||
        target.id?.includes('search') ||
        target.name?.includes('search') ||
        target.placeholder?.includes('검색')
      );
      if (!isSearchInput) return;

      const query = target.value?.trim();
      if (!query) return; // 빈 검색어는 무시

      const now = Date.now();
      const isModified = query !== currentSearchData.lastSearchQuery;

      // 결과 없음 상태에서 검색어를 수정해서 재검색한 경우 카운트
      if (currentSearchData.isEmptyResult && isModified) {
        const timeSinceLastSearch = now - (currentSearchData.lastSearchTime || 0);

        if (timeSinceLastSearch < std.SEARCH.EMPTY_RESULT_WINDOW_MS) {
          // 같은 세션 내 재검색으로 간주 → 카운트 증가
          currentSearchData.emptyResultRetryCount += 1;
        } else {
          // 시간 초과 → 새로운 검색 세션으로 간주
          currentSearchData.emptyResultRetryCount = 1;
        }
      } else if (!currentSearchData.isEmptyResult) {
        // 결과가 있는 상태에서 새 검색 → 카운트 리셋
        currentSearchData.emptyResultRetryCount = 0;
      }

      currentSearchData.lastSearchTime = now;
      currentSearchData.lastSearchQuery = query;

      // 검색 후 결과 확인은 500ms 딜레이 후 (DOM 업데이트 기다림)
      setTimeout(() => {
        currentSearchData.isEmptyResult = checkIsEmptyResult();
      }, 500);
    };

    // ================================================================
    // 페이지 이탈 감지
    // 결과 없음 상태에서 EMPTY_RESULT_RETRY_COUNT 이상 재검색 후
    // 다른 페이지로 이동하면 "포기하고 이탈"한 것으로 판단
    // ================================================================
    const handleNavigation = () => {
      if (
        currentSearchData.isEmptyResult &&
        currentSearchData.emptyResultRetryCount >= std.SEARCH.EMPTY_RESULT_RETRY_COUNT
      ) {
        logIssue('EMPTY_SEARCH_FRUSTRATION', '사용성', '검색 및 탐색 실패', 'MEDIUM', {
          target_html: null,
          coord_x: null,
          coord_y: null,
          standard: 'Nielsen #9 (오류 인식, 진단, 복구) / Search UX Guidelines',
          detail: `검색 결과 없음 상태에서 "${currentSearchData.lastSearchQuery}" 등 ${currentSearchData.emptyResultRetryCount}회 검색어 수정 후 이탈 (${std.tier} 기준: ${std.SEARCH.EMPTY_RESULT_RETRY_COUNT}회). 오타 보정/자동완성 미지원으로 원하는 결과를 찾지 못한 것으로 판단`
        });

        // 이슈 기록 후 리셋
        currentSearchData.emptyResultRetryCount = 0;
        currentSearchData.isEmptyResult = false;
        currentSearchData.lastSearchQuery = '';
      }
    };

    // ── 이벤트 리스너 등록 ──────────────────────────────────────────
    // 검색 제출: Enter 키 + 버튼 클릭 둘 다 잡기 위해 keydown + click 모두 등록
    window.addEventListener('keydown', handleSearchSubmit, true);
    window.addEventListener('click', handleSearchSubmit, true);
    // 페이지 이탈: React Router 이동은 beforeunload가 아닌 popstate로 잡힘
    window.addEventListener('beforeunload', handleNavigation);
    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('keydown', handleSearchSubmit, true);
      window.removeEventListener('click', handleSearchSubmit, true);
      window.removeEventListener('beforeunload', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [logIssue, sessionLog]);
};