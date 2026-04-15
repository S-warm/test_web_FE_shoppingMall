export const UX_STANDARDS = {

  age_threshold: {
    middle: 50,
    senior: 65,
  },

  button: {
    general_min_size_px: 32,
    middle_min_size_px: 40,
    senior_min_size_px: 48,
  },

  attention: {
    general_max_elements: 8,
    middle_max_elements: 5,
    senior_max_elements: 3,
  },

  loading: {
    general_max_wait_ms: 10000,
    middle_max_wait_ms: 6000,
    senior_max_wait_ms: 4000,
  },

  interaction: {
    idle_time_ms:            { general: 8000,  middle: 6000,  senior: 4000  },
    pogo_sticking_time_ms:   { general: 3000,  middle: 4000,  senior: 5000  },
    accordion_fatigue_count: { general: 4,     middle: 3,     senior: 2     },
    accordion_fatigue_ms:    { general: 4000,  middle: 4000,  senior: 5000  },
    rage_click_ms:           { general: 1500,  middle: 2000,  senior: 2500  },
    rage_click_count:        { general: 3,     middle: 3,     senior: 2     },
    rage_click_radius_px:    { general: 50,    middle: 60,    senior: 80    },
    dead_click_time_ms:      { general: 2000,  middle: 3000,  senior: 4000  },
    form_clear_limit:        { general: 4,     middle: 3,     senior: 2     },
    password_clear_limit:    { general: 3,     middle: 2,     senior: 1     },
    forced_mouse_ms:         { general: 1500,  middle: 2000,  senior: 2500  },
    flash_feedback_min_ms:   { general: 2000,  middle: 3000,  senior: 4000  },
    onboarding_step_min_ms:  { general: 300,   middle: 500,   senior: 800   },
    onboarding_skip_count:   { general: 3,     middle: 3,     senior: 2     },
  },

  text_control: {
    unselectable_dblclick_limit: { general: 3,    middle: 3,    senior: 2    },
    unselectable_window_ms:      { general: 3000, middle: 4000, senior: 5000 },
  },

  search: {
    empty_result_window_ms:   { general: 10000, middle: 12000, senior: 15000 },
    empty_result_retry_count: { general: 3,     middle: 2,     senior: 1     },
  },
};