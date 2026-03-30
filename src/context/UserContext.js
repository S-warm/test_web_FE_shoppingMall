// src/context/UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 초기 상태: 로그인 안 된 상태 (빈 값)
  const [user, setUser] = useState({
    username: '',
    name: '',
    phone: '',
    address: ''
  });

  // 로그인 성공 시 정보 저장
  const saveUserInfo = (userData) => {
    setUser(userData);
    // (선택사항) 새로고침해도 유지되게 하려면 localStorage 사용
    // localStorage.setItem('user', JSON.stringify(userData));
  };

  // ✨ 로그아웃 기능 (정보 초기화)
  const logout = () => {
    setUser({
      username: '',
      name: '',
      phone: '',
      address: ''
    });
    // localStorage.removeItem('user'); // 로컬스토리지 썼다면 여기서 삭제
  };

  return (
    <UserContext.Provider value={{ user, saveUserInfo, logout }}>
      {children}
    </UserContext.Provider>
  );
};