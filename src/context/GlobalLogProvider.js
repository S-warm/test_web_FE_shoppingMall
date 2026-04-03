import React, { createContext, useRef, useEffect, useCallback } from 'react';
import { saveLogToDB } from '../utils/saveLogToDB';

export const GlobalLogContext = createContext();

export const GlobalLogProvider = ({ children }) => {

  const sessionLog = useRef({
    session_id: '',
    persona_age: null,
    is_success: false,
    duration_ms: 0,
    pages: []
  });

  const sharedTrackData = useRef({
    pageEntryTime: Date.now(),
    clickCountOnCurrentPage: 0,
    idleCount: 0,
    idleLogged: false,
    scrollHijackLogged: false,
    hasSkipped: false,
  });

  const skipCurrentPage = useCallback(() => {
    const pages = sessionLog.current.pages;
    const currentPage = pages[pages.length - 1];
    if (currentPage) {
      currentPage.status = 'skipped';
      currentPage.issues.push({
        issue_type: 'page_skipped',
        target_html: null,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  const resetLog = useCallback(() => {
    sessionLog.current = {
      session_id: '',
      persona_age: null,
      is_success: false,
      duration_ms: 0,
      pages: []
    };
    sharedTrackData.current = {
      pageEntryTime: Date.now(),
      clickCountOnCurrentPage: 0,
      idleCount: 0,
      idleLogged: false,
      scrollHijackLogged: false,
    };
  }, []);

  const logIssue = useCallback((issueType, detailData = {}) => {
    const pages = sessionLog.current.pages;
    const currentPage = pages[pages.length - 1];

    if (currentPage) {
      const DUPLICATE_EXEMPT = ['idle_time'];

      if (!DUPLICATE_EXEMPT.includes(issueType)) {
        const now = Date.now();
        const isDuplicate = currentPage.issues.some((issue) => {
          const timeDiff = now - new Date(issue.timestamp).getTime();
          if (!detailData.target_html) {
            return (
              issue.issue_type === issueType &&
              issue.target_html === null &&
              timeDiff < 30000
            );
          }
          return (
            issue.issue_type === issueType &&
            issue.target_html === detailData.target_html &&
            timeDiff < 30000
          );
        });
        if (isDuplicate) return;
      }

      currentPage.status = 'problem';
      currentPage.issues.push({
        issue_type: issueType,
        target_html: detailData.target_html || null,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  useEffect(() => {
    window.__log = sessionLog;

    const handleSuccessEvent = () => {
      sessionLog.current.is_success = true;
    };

   const handleBeforeUnload = () => {
  // 세션이 시작된 경우에만 저장 (session_id 있을 때만)
  if (sessionLog.current.session_id) {
    saveLogToDB(sessionLog.current);
  }
};

    window.addEventListener('test_success', handleSuccessEvent);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('test_success', handleSuccessEvent);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <GlobalLogContext.Provider value={{ sessionLog, sharedTrackData, logIssue, skipCurrentPage, resetLog }}>
      {children}
    </GlobalLogContext.Provider>
  );
};