// src/context/GlobalLogProvider.js
import React, { createContext, useRef, useEffect, useCallback } from 'react';
import { saveLogToDB } from '../utils/saveLogToDB';

export const GlobalLogContext = createContext();

export const GlobalLogProvider = ({ children }) => {

  const sessionLog = useRef({
    session_id: '',
    persona_age: null,
    is_success: false,
    duration_ms: 0,
    total_issues_count: 0,
    pages: []
  });

  const sharedTrackData = useRef({
    pageEntryTime: Date.now(),
    clickCountOnCurrentPage: 0,
    idleCount: 0,
    idleLogged: false,           // IDLE_TIME 페이지당 1회 제한용
    scrollHijackLogged: false,   // SCROLL_HIJACKING 페이지당 1회 제한용
    hasSkipped: false,
  });

  const skipCurrentPage = useCallback(() => {
    const pages = sessionLog.current.pages;
    const currentPage = pages[pages.length - 1];
    if (currentPage) {
      currentPage.status = 'SKIPPED';
      currentPage.issues.push({
        issue_type: 'PAGE_SKIPPED',
        category: '여정',
        sub_category: '단계 건너뜀',
        detail: '사용자가 이 단계를 포기하고 건너뜀. 해당 페이지 UX 평가 불가',
        severity: 'HIGH',
        target_html: null,
        coord_x: null,
        coord_y: null,
        scroll_y: window.scrollY,
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
      total_issues_count: 0,
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

  const logIssue = useCallback((issueType, category, subCategory, severity, detailData) => {
    const pages = sessionLog.current.pages;
    const currentPage = pages[pages.length - 1];

    if (currentPage) {
      const DUPLICATE_EXEMPT = ['IDLE_TIME'];

      if (!DUPLICATE_EXEMPT.includes(issueType)) {
        const now = Date.now();
        const isDuplicate = currentPage.issues.some((issue) => {
          const timeDiff = now - new Date(issue.timestamp).getTime();

          // target_html이 null인 이슈는 issue_type만으로 중복 판단
          // (POGO_STICKING, FLASH_FEEDBACK, STATE_LOSS_REENTRY 등)
          if (!detailData.target_html) {
            return (
              issue.issue_type === issueType &&
              issue.target_html === null &&
              timeDiff < 30000
            );
          }

          // target_html이 있는 이슈는 기존 로직대로
          return (
            issue.issue_type === issueType &&
            issue.target_html === detailData.target_html &&
            timeDiff < 30000
          );
        });

        if (isDuplicate) return;
      }

      currentPage.status = 'HAS_ISSUES';
      currentPage.page_issues_count += 1;
      sessionLog.current.total_issues_count += 1;

      if (category === '접근성' || (detailData.standard && detailData.standard.includes('WCAG'))) {
        if (currentPage.wcag_related_count === undefined) {
          currentPage.wcag_related_count = 0;
        }
        currentPage.wcag_related_count += 1;

        if (currentPage.wcag_related_count >= 5) {
          currentPage.wcag_grade = 'WCAG 2.1 FAIL';
        } else if (currentPage.wcag_related_count >= 3) {
          currentPage.wcag_grade = 'WCAG 2.1 LEVEL A';
        } else if (currentPage.wcag_related_count >= 1) {
          currentPage.wcag_grade = 'WCAG 2.1 LEVEL AA';
        }
      }

      currentPage.issues.push({
        issue_type: issueType,
        category: category,
        sub_category: subCategory,
        detail: detailData.detail || null,
        severity: severity,
        target_html: detailData.target_html || null,
        coord_x: detailData.coord_x !== undefined ? detailData.coord_x : null,
        coord_y: detailData.coord_y !== undefined ? detailData.coord_y : null,
        scroll_y: detailData.scroll_y !== undefined ? detailData.scroll_y : window.scrollY,
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
      saveLogToDB(sessionLog.current);
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