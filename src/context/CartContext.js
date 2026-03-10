import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✨ 1. 시작할 때: 로컬 스토리지에서 저장된 장바구니가 있는지 확인하고 가져옴
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : []; // 있으면 가져오고, 없으면 빈 배열
  });

  // ✨ 2. 장바구니가 바뀔 때마다: 로컬 스토리지에 자동 저장 (문자열로 변환)
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 장바구니에 담기
  const addToCart = (product, quantity, options) => {
    setCartItems(prev => {
      // 이미 같은 상품(옵션까지 동일)이 있는지 확인
      const existing = prev.find(item => item.id === product.id && item.options === options);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.options === options)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, options }];
    });
  };

  // 장바구니에서 삭제
  const removeFromCart = (id, options) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.options === options)));
  };

  // 수량 변경
  const updateQuantity = (id, options, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.options === options) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  // 장바구니 비우기 (결제 완료 시 사용)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems'); // 저장소에서도 삭제
  };

  // 총 가격 계산
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};