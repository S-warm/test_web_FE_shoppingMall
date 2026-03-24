// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CSDummyPage from './pages/CSDummyPage';

// Context들
import { TimerProvider } from './context/TimerContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext'; 

// 컴포넌트들
import AutoLogger from './components/AutoLogger';
import GlobalLogger from './components/GlobalLogger';
import GlobalSkipBtn from './components/GlobalSkipBtn';    // 👉 오른쪽 하단 (건너뛰기)
import GlobalRestartBtn from './components/GlobalRestartBtn'; // ✨ 왼쪽 상단 (초기화) 추가!

// 페이지들
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TermsPage from './pages/TermsPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <TimerProvider>
      <UserProvider> 
        <CartProvider>
          <BrowserRouter>
            
            {/* ✨ 1. 왼쪽 상단: 처음부터 다시하기 */}
            <GlobalRestartBtn />

            {/* ✨ 2. 오른쪽 하단: 단계 건너뛰기 */}
            <GlobalSkipBtn />
            
            {/* 3. 자동 로그 수집기 (클릭/키보드) */}
            <GlobalLogger />
            
            {/* 4. 페이지 라우팅 */}
            <AutoLogger>
              <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/cs/:type" element={<CSDummyPage />} />
              </Routes>
            </AutoLogger>
            
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </TimerProvider>
  );
}

export default App;