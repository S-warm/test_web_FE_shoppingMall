// src/components/LogTrackers.js
// ============================================================
// 역할: 모든 전역 감지기(Hook)를 한 곳에서 실행하는 컴포넌트
// 특이사항:
//   - 화면에 렌더링할 UI가 없으므로 null 반환
//   - App.js 최상단에 한 번만 마운트하면 전체 페이지에서 감지 동작
// ============================================================

import { useJourneyTracker } from '../hooks/useJourneyTracker';
import { useMouseTracker } from '../hooks/useMouseTracker';
import { useFormTracker } from '../hooks/useFormTracker';
import { useTextControlTracker } from '../hooks/useTextControlTracker';
import { useSearchTracker } from '../hooks/useSearchTracker';

export const LogTrackers = () => {
  useJourneyTracker();
  useMouseTracker();
  useFormTracker();
  useTextControlTracker();
  useSearchTracker();
  return null;
};