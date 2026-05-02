import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // A 함정: 체크박스 선택 상태 (기본값 전부 unchecked)
  const [checkedItems, setCheckedItems] = useState({});
  const [fleetingError, setFleetingError] = useState('');

  const triggerFleetingError = (msg, duration) => {
    setFleetingError(msg);
    setTimeout(() => setFleetingError(''), duration);
  };

  const toggleCheck = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasChecked = Object.values(checkedItems).some(v => v === true);

  // 1. 장바구니 비었을 때
  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2 style={{color:'#ccc', marginBottom:'20px'}}>장바구니가 비어있습니다 텅! 🗑️</h2>
        <button style={styles.shopBtn} onClick={() => navigate('/shop')}>
          상품 구경하러 가기
        </button>
      </div>
    );
  }

  const sendDeleteLog = async (itemName) => {
    try {
        const username = user.username || "GUEST";
        await axios.post(`${process.env.REACT_APP_API_URL}/api/log`, {
            username: username,
            action: "CART_REMOVE",
            detail: `장바구니에서 [${itemName}] 상품을 삭제함`
        });
    } catch (e) {
        console.error("로그 전송 실패(서버 꺼짐?):", e);
    }
  };

  return (
    <div style={styles.container}>

      {fleetingError && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb',
          padding: '15px 30px', borderRadius: '3px', fontWeight: 'bold',
          zIndex: 9999, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '14px'
        }}>
          ⚠️ {fleetingError}
        </div>
      )}

      {/* A 함정: 설명 없는 체크박스 안내 - 흐린 텍스트로 */}
      <h2 style={styles.title}>SHOPPING CART ({cartItems.length})</h2>
      <p style={{ fontSize: '11px', color: '#ccc', textAlign: 'right', marginBottom: '8px' }}>
        * 구매할 상품을 선택해주세요
      </p>

      <div style={styles.cartList}>
        {cartItems.map((item, index) => {
          const key = `${item.id}-${index}`;
          return (
            <div key={key} style={styles.itemCard}>

              {/* A 함정: 체크박스 - 작고 흐리고 이미지에 살짝 겹침 */}
              <input
                type="checkbox"
                checked={!!checkedItems[key]}
                onChange={() => toggleCheck(key)}
                style={{
                  width: '13px', height: '13px',
                  marginRight: '-6px', marginTop: '30px',
                  accentColor: '#ccc',
                  cursor: 'pointer',
                  position: 'relative', zIndex: 1,
                  opacity: 0.5
                }}
              />

              <img src={item.img} alt={item.name} style={styles.img} />

              <div style={styles.infoSection}>
                <div style={styles.itemName}>{item.name}</div>
                <div style={styles.itemOption}>{item.options}</div>
                <div style={styles.itemPrice}>{item.price.toLocaleString()}원</div>
              </div>

              <div style={styles.qtySection}>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.options, -1)}>-</button>
                <span style={styles.qtyNum}>{item.quantity}</span>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.options, 1)}>+</button>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => {
                  if (window.confirm("정말 이 상품을 삭제하시겠습니까?")) {
                    removeFromCart(item.id, item.options);
                    sendDeleteLog(item.name);
                  }
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <div style={styles.summaryBox}>
        <div style={styles.row}>
            <span>총 상품금액</span>
            <span>{getTotalPrice().toLocaleString()}원</span>
        </div>
        <div style={styles.row}>
            <span>배송비</span>
            <span>0원</span>
        </div>
        <div style={styles.totalRow}>
            <span>결제 예정 금액</span>
            <span style={{color:'#bbb'}}>{getTotalPrice().toLocaleString()}원</span>
        </div>

        {/* A 함정: "선택한 상품 구매하기" - 미선택 시 에러 1초 */}
        <button
          style={styles.checkoutBtn}
          onClick={() => {
            if (!hasChecked) {
              triggerFleetingError('구매할 상품을 선택해주세요.', 1000);
              return;
            }
            navigate('/payment');
          }}
        >
          선택한 상품 구매하기
        </button>

        <button style={styles.continueBtn} onClick={() => navigate('/shop')}>
          쇼핑 계속하기
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '50px 20px', maxWidth: '800px', margin: '0 auto', fontFamily:'sans-serif' },
  title: { textAlign: 'center', marginBottom: '10px', fontSize: '24px', letterSpacing:'1px' },
  emptyContainer: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  shopBtn: { padding: '15px 30px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'16px' },
  cartList: { borderTop: '2px solid #333' },
  itemCard: { display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #eee' },
  img: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '20px' },
  infoSection: { flex: 1 },
  // WCAG: 상품명 작게 + 흐리게
  itemName: { fontWeight: 'bold', fontSize: '12px', marginBottom: '5px', color: '#aaa' },
  itemOption: { fontSize: '11px', color: '#ccc', marginBottom: '5px' },
  itemPrice: { fontWeight: 'bold', fontSize: '13px', color: '#bbb' },
  // WCAG: 수량 버튼 작게
  qtySection: { display: 'flex', alignItems: 'center', marginRight: '20px', border:'1px solid #ddd', borderRadius:'3px' },
  qtyBtn: { background: 'white', border: 'none', width: '20px', height: '20px', cursor: 'pointer', fontWeight:'bold', fontSize:'11px', outline:'none' },
  qtyNum: { padding: '0 8px', fontSize: '12px' },
  // WCAG: 삭제 버튼 거의 안 보임
  deleteBtn: { background: 'none', border: 'none', fontSize: '22px', color: '#ebebeb', cursor: 'pointer', padding:'0 10px', outline:'none' },
  summaryBox: { marginTop: '50px', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color:'#555' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px', fontWeight: 'bold', fontSize: '16px', color: '#aaa' },
  checkoutBtn: { width: '100%', padding: '15px', backgroundColor: '#333', color: 'white', border: 'none', marginTop: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', borderRadius:'4px', outline:'none' },
  // A 함정: 쇼핑 계속하기 버튼이 거의 같은 크기
  continueBtn: { width: '100%', padding: '14px', backgroundColor: '#555', color: 'white', border: 'none', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', borderRadius:'4px', outline:'none' },
};

export default CartPage;
