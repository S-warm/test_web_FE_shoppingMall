import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✨ 통신 도구 추가
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext'; // ✨ 유저 정보 가져오기

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(UserContext); // ✨ 현재 로그인한 사람 누구니?

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

  // ✨ 로그 전송 함수 (삭제할 때 사용)
  const sendDeleteLog = async (itemName) => {
    try {
        // 로그인 안 했으면 'GUEST'로 기록, 했으면 아이디로 기록
        const username = user.username || "GUEST"; 
        
        await axios.post(`${process.env.REACT_APP_API_URL}/api/log`, {
            username: username,
            action: "CART_REMOVE", // ✨ 행동 이름: 장바구니 삭제
            detail: `장바구니에서 [${itemName}] 상품을 삭제함`
        });
        console.log("삭제 로그 전송 완료!");
    } catch (e) {
        console.error("로그 전송 실패(서버 꺼짐?):", e);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>SHOPPING CART ({cartItems.length})</h2>
      
      <div style={styles.cartList}>
        {cartItems.map((item, index) => (
          <div key={`${item.id}-${index}`} style={styles.itemCard}>
            
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

            {/* ✨ 삭제 버튼 (로그 기능 추가됨) */}
            <button 
                style={styles.deleteBtn} 
                onClick={() => {
                    if (window.confirm("정말 이 상품을 삭제하시겠습니까?")) {
                        // 1. 화면에서 지우기 (로컬 작업)
                        removeFromCart(item.id, item.options);
                        
                        // 2. 서버로 보고하기 (DB 로그 저장)
                        sendDeleteLog(item.name); 
                    }
                }}
            >
                ×
            </button>
          </div>
        ))}
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
            <span style={{color:'#ff4757'}}>{getTotalPrice().toLocaleString()}원</span>
        </div>
        
        <button style={styles.checkoutBtn} onClick={() => navigate('/payment')}>
            구매하기
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '50px 20px', maxWidth: '800px', margin: '0 auto', fontFamily:'sans-serif' },
  title: { textAlign: 'center', marginBottom: '40px', fontSize: '24px', letterSpacing:'1px' },
  emptyContainer: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  shopBtn: { padding: '15px 30px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'16px' },
  cartList: { borderTop: '2px solid #333' },
  itemCard: { display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #eee' },
  img: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '20px' },
  infoSection: { flex: 1 },
  itemName: { fontWeight: 'bold', fontSize: '15px', marginBottom: '5px' },
  itemOption: { fontSize: '12px', color: '#888', marginBottom: '5px' },
  itemPrice: { fontWeight: 'bold', fontSize: '14px' },
  qtySection: { display: 'flex', alignItems: 'center', marginRight: '20px', border:'1px solid #ddd', borderRadius:'3px' },
  qtyBtn: { background: 'white', border: 'none', width: '25px', height: '25px', cursor: 'pointer', fontWeight:'bold' },
  qtyNum: { padding: '0 10px', fontSize: '13px' },
  deleteBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#ccc', cursor: 'pointer', padding:'0 10px' },
  summaryBox: { marginTop: '50px', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color:'#555' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px', fontWeight: 'bold', fontSize: '18px' },
  checkoutBtn: { width: '100%', padding: '15px', backgroundColor: '#333', color: 'white', border: 'none', marginTop: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', borderRadius:'4px' }
};

export default CartPage;