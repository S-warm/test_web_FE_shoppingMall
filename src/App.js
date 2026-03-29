// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CSDummyPage from './pages/CSDummyPage';
import StartPage from './pages/StartPage';

import { TimerProvider } from './context/TimerContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext'; 
import { GlobalLogProvider } from './context/GlobalLogProvider'; 

// AutoLogger 임포트 삭제됨
import { LogTrackers } from './components/LogTrackers'; 
import GlobalSkipBtn from './components/GlobalSkipBtn';    
import GlobalRestartBtn from './components/GlobalRestartBtn'; 

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TermsPage from './pages/TermsPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <GlobalLogProvider>
      <TimerProvider>
        <UserProvider> 
          <CartProvider>
            <BrowserRouter>
              
              <GlobalRestartBtn />
              <GlobalSkipBtn />
              <LogTrackers />
              
              {/* AutoLogger 태그가 완전히 제거되고 Routes만 남음 */}
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
              
            </BrowserRouter>
          </CartProvider>
        </UserProvider>
      </TimerProvider>
    </GlobalLogProvider>
  );
}

export default App;