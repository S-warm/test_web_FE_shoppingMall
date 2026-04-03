// src/utils/getStandardByAge.js
// ============================================================
// 역할: 페르소나 나이를 받아서 해당 연령대의 기준값을 반환하는 헬퍼 함수
// 사용 예시:
//   const std = getStandardByAge(70);
//   std.INTERACTION.IDLE_TIME_MS → 4000 (senior 기준)
// ============================================================

import { UX_STANDARDS } from '../constants/evaluationStandards';

export const getStandardByAge = (age) => {
  const safeAge = typeof age === 'number' && age > 0 ? age : 20;

  const tier =
    safeAge >= UX_STANDARDS.age_threshold.senior ? 'senior' :
    safeAge >= UX_STANDARDS.age_threshold.middle ? 'middle' :
    'general';

  return {
    tier,

    INTERACTION: {
      IDLE_TIME_MS:            UX_STANDARDS.interaction.idle_time_ms[tier],
      POGO_STICKING_TIME_MS:   UX_STANDARDS.interaction.pogo_sticking_time_ms[tier],
      ACCORDION_FATIGUE_COUNT: UX_STANDARDS.interaction.accordion_fatigue_count[tier],
      ACCORDION_FATIGUE_MS:    UX_STANDARDS.interaction.accordion_fatigue_ms[tier],
      RAGE_CLICK_MS:           UX_STANDARDS.interaction.rage_click_ms[tier],
      RAGE_CLICK_COUNT:        UX_STANDARDS.interaction.rage_click_count[tier],
      RAGE_CLICK_RADIUS_PX:    UX_STANDARDS.interaction.rage_click_radius_px[tier],
      DEAD_CLICK_TIME_MS:      UX_STANDARDS.interaction.dead_click_time_ms[tier],
      FORM_CLEAR_LIMIT:        UX_STANDARDS.interaction.form_clear_limit[tier],
      PASSWORD_CLEAR_LIMIT:    UX_STANDARDS.interaction.password_clear_limit[tier],
      FORCED_MOUSE_MS:         UX_STANDARDS.interaction.forced_mouse_ms[tier],
      FLASH_FEEDBACK_MIN_MS:   UX_STANDARDS.interaction.flash_feedback_min_ms[tier],
      ONBOARDING_STEP_MIN_MS:  UX_STANDARDS.interaction.onboarding_step_min_ms[tier],
      ONBOARDING_SKIP_COUNT:   UX_STANDARDS.interaction.onboarding_skip_count[tier],
    },

    TEXT_CONTROL: {
      UNSELECTABLE_DBLCLICK_LIMIT: UX_STANDARDS.text_control.unselectable_dblclick_limit[tier],
      UNSELECTABLE_WINDOW_MS:      UX_STANDARDS.text_control.unselectable_window_ms[tier],
    },

    SEARCH: {
      EMPTY_RESULT_WINDOW_MS:   UX_STANDARDS.search.empty_result_window_ms[tier],
      EMPTY_RESULT_RETRY_COUNT: UX_STANDARDS.search.empty_result_retry_count[tier],
    },

    BUTTON: {
      MIN_SIZE_PX:
        tier === 'senior' ? UX_STANDARDS.button.senior_min_size_px :
        tier === 'middle' ? UX_STANDARDS.button.middle_min_size_px :
        UX_STANDARDS.button.general_min_size_px,
    },

    ATTENTION: {
      MAX_ELEMENTS:
        tier === 'senior' ? UX_STANDARDS.attention.senior_max_elements :
        tier === 'middle' ? UX_STANDARDS.attention.middle_max_elements :
        UX_STANDARDS.attention.general_max_elements,
    },

    LOADING: {
      MAX_WAIT_MS:
        tier === 'senior' ? UX_STANDARDS.loading.senior_max_wait_ms :
        tier === 'middle' ? UX_STANDARDS.loading.middle_max_wait_ms :
        UX_STANDARDS.loading.general_max_wait_ms,
    },
  };
};