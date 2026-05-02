// src/pages/PaymentPage.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { TimerContext } from '../context/TimerContext'; 
import { saveLogToDB } from '../utils/saveLogToDB';

const PaymentPage = () => {
  const navigate = useNavigate();
  // CartContext에서 변수명 cartItems와 getTotalPrice 함수를 가져옵니다.
  const { cartItems, clearCart, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { endTimer } = useContext(TimerContext); 
  
  const totalProductPrice = getTotalPrice ? getTotalPrice() : 0;

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [payMethod, setPayMethod] = useState(''); 

  const [couponInput, setCouponInput] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [pointsInput, setPointsInput] = useState('');
  const [usedPoints, setUsedPoints] = useState(0);
  const myPoints = 5000; 

  const handleApplyCoupon = () => {
    if (couponInput !== 'SWARM2026') {
        alert("유효하지 않은 쿠폰 코드입니다.");
        return;
    }
    if (usedPoints > 0) {
        alert("[안내] 쿠폰과 적립금은 중복 사용이 불가합니다.\n적립금 사용이 취소됩니다.");
        setUsedPoints(0);
        setPointsInput('');
    }
    alert("10% 시크릿 쿠폰이 적용되었습니다.\n(단, 쿠폰 적용 시 무료배송 혜택이 제외되어 배송비 3,000원이 부과됩니다.)");
    setIsCouponApplied(true);
  };

  const handleApplyPoints = () => {
    if (isCouponApplied) {
        alert("[안내] 적립금 사용 시 쿠폰 할인은 자동 취소됩니다.\n쿠폰 적용이 해제되었습니다.");
        setIsCouponApplied(false);
    }
    setUsedPoints(myPoints);
    setPointsInput(myPoints.toString());
  };

  const couponDiscount = isCouponApplied ? Math.floor(totalProductPrice * 0.1) : 0;
  const shippingFee = isCouponApplied ? 3000 : 0; 
  const finalPrice = totalProductPrice - couponDiscount - usedPoints + shippingFee;

  // PaymentPage.js - handlePayment 함수 수정
const handlePayment = async () => {
  
    if (totalProductPrice === 0) {
      alert("결제할 상품이 없습니다. 장바구니를 확인해주세요.");
      return;
    }
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }
    if (!payMethod) {
      alert("결제 수단을 선택해주세요.");
      return;
    }


   // ── 로그 DB 저장 ──────────────────────────────────────────────
if (window.__log) {
  const hasSkipped = window.__log.current.pages.some(
    p => p.issues.some(i => i.issue_type === 'PAGE_SKIPPED')
  );
  window.__log.current.is_success = !hasSkipped;
  await saveLogToDB(window.__log.current);
}
    // ──────────────────────────────────────────────────────────────

    const timeResult = endTimer();
    let timeLogStr = "시간 측정 불가";
    if (timeResult) {
        timeLogStr = `${timeResult.formatted} 소요 (${timeResult.durationSeconds}초)`;
    }

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/log`, {
            username: user?.username || user?.name || 'guest',
            action: 'TEST_END',
            detail: `[결제완료] 수단:${payMethod} | 최종금액:${finalPrice} | 소요시간: ${timeLogStr}`
        });

        alert(`[결제 완료]\n실험이 종료되었습니다.\n(소요시간: ${timeResult ? timeResult.formatted : '측정불가'})`);
        sessionStorage.removeItem('hasViewedTerms');
        clearCart();
        navigate('/');

    } catch (e) {
        console.error(e);
        alert("결제 처리는 완료되었습니다.");
        sessionStorage.removeItem('hasViewedTerms');
        clearCart();
        navigate('/');
    }
};

  const handleCancelPanic = () => {
    if(window.confirm("경고: 정말 결제를 취소하시겠습니까?\n지금까지 적용된 혜택이 해제되며 배송지 정보가 초기화됩니다.")) {
        setShippingInfo({ name: '', phone: '', address: '' });
        navigate('/cart');
    }
  };

  const paymentMethods = [
    { category: '간편결제', items: ['네이버페이', '카카오페이', '토스페이', '삼성페이', '애플페이', '페이코', 'SSG페이', 'L.PAY', '스마일페이', 'SK페이'] },
    { category: '신용/체크카드', items: ['신한카드', 'KB국민카드', '삼성카드', '현대카드', '롯데카드', '하나카드', '우리카드', 'BC카드', 'NH농협카드', '씨티카드', '광주카드', '전북카드'] },
    { category: '계좌이체/무통장', items: ['신한은행', 'KB국민은행', '우리은행', '하나은행', 'NH농협', 'IBK기업은행', '카카오뱅크', '토스뱅크', '케이뱅크', '우체국', '새마을금고', '신협'] }
  ];

  return (
    <div style={styles.container}>
        <h2 style={styles.title}>주문/결제</h2>
        
        <div style={styles.section}>
          <h3 style={styles.subTitle}>주문 상품 정보</h3>
          <div style={styles.orderItemList}>
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div key={idx} style={styles.orderItem}>
                  <img src={item.img} alt={item.name} style={styles.itemImg} />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemOption}>{item.options} | {item.quantity}개</div>
                    <div style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}원</div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{color: '#888', fontSize: '14px', padding: '20px 0'}}>결제할 상품이 없습니다.</p>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>배송지 정보</h3>
          <label style={styles.label}>받는 분</label>
          <input type="text" placeholder="이름" value={shippingInfo.name} onChange={(e)=>setShippingInfo({...shippingInfo, name: e.target.value})} style={styles.input} />
          <label style={styles.label}>연락처</label>
          <input type="text" placeholder="휴대폰 번호" value={shippingInfo.phone} onChange={(e)=>setShippingInfo({...shippingInfo, phone: e.target.value})} style={styles.input} />
          <label style={styles.label}>주소</label>
          <input type="text" placeholder="주소 입력" value={shippingInfo.address} onChange={(e)=>setShippingInfo({...shippingInfo, address: e.target.value})} style={styles.input} />
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>할인/포인트 적용</h3>
          <div style={styles.discountBox}>
              <label style={styles.label}>할인 쿠폰 등록</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <input type="text" placeholder="쿠폰 코드 입력" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} style={styles.inputFlex} />
                  <button onClick={handleApplyCoupon} style={styles.applyBtn}>적용</button>
              </div>

              <label style={styles.label}>적립금 사용 (보유: {myPoints.toLocaleString()}원)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="0" value={pointsInput} readOnly style={{...styles.inputFlex, backgroundColor: '#f5f5f5'}} />
                  <button onClick={handleApplyPoints} style={styles.applyBtn}>전액 사용</button>
              </div>
          </div>
        </div>

        <div style={styles.summaryBox}>
            <div style={styles.summaryRow}><span>상품 금액</span><span>{totalProductPrice.toLocaleString()}원</span></div>
            <div style={styles.summaryRow}>
                <span style={{color: '#0078ff'}}>쿠폰 할인 {isCouponApplied && '(10%)'}</span>
                <span style={{color: '#0078ff'}}>- {couponDiscount.toLocaleString()}원</span>
            </div>
            <div style={styles.summaryRow}>
                <span style={{color: '#ff4757'}}>적립금 사용</span>
                <span style={{color: '#ff4757'}}>- {usedPoints.toLocaleString()}원</span>
            </div>
            <div style={styles.summaryRow}>
                <span>배송비 {isCouponApplied ? '(쿠폰적용 할증)' : '(기본 무료)'}</span>
                <span>+ {shippingFee.toLocaleString()}원</span>
            </div>
            <div style={{...styles.summaryRow, borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px', fontWeight: 'bold', fontSize: '16px', color: '#bbb'}}>
                <span>최종 결제 금액</span>
                <span>{finalPrice.toLocaleString()}원</span>
            </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subTitle}>결제 수단 선택</h3>
          <div style={styles.paymentMethodContainer}>
            {paymentMethods.map((group, gIdx) => (
              <div key={gIdx} style={{marginBottom: '20px'}}>
                <h4 style={{fontSize: '14px', color: '#555', marginBottom: '10px'}}>{group.category}</h4>
                <div style={styles.paymentGrid}>
                  {group.items.map((item, iIdx) => (
                    <button 
                      key={iIdx}
                      style={payMethod === item ? styles.activeGridBtn : styles.gridBtn}
                      onClick={() => setPayMethod(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.actionArea}>
            <button onClick={handleCancelPanic} style={styles.fakeSubmitBtn}>
                결제 취소 및 혜택 포기하기
            </button>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                <button onClick={handlePayment} style={styles.realSubmitBtn}>
                    최종 결제진행
                </button>
            </div>
        </div>
    </div>
  );
};

const styles = {
    container: { padding: '50px 20px 100px 20px', maxWidth:'600px', margin:'0 auto', fontFamily: 'sans-serif' },
    title: { textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '10px' },
    section: { marginBottom: '40px' },
    subTitle: { fontSize: '18px', marginBottom: '15px', fontWeight: 'bold', color: '#333' },
    label: { display:'block', marginBottom:'8px', fontSize:'11px', color:'#bbb', fontWeight:'normal'},
    input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #f0f0f0', borderRadius: '4px', boxSizing:'border-box', outline:'none' },
    
    orderItemList: { borderTop: '2px solid #1a1a1a', borderBottom: '1px solid #ddd', padding: '10px 0' },
    orderItem: { display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' },
    itemImg: { width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' },
    itemOption: { fontSize: '12px', color: '#888', marginBottom: '5px' },
    itemPrice: { fontSize: '14px', fontWeight: 'bold' },

    discountBox: { border: '1px solid #e1e1e1', padding: '20px', borderRadius: '4px', backgroundColor: '#fafafa' },
    inputFlex: { flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing:'border-box' },
    applyBtn: { padding: '0 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' },
    
    summaryBox: { backgroundColor: '#fff', border: '1px solid #eee', padding: '25px', borderRadius: '8px', marginBottom: '40px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#bbb' },

    paymentMethodContainer: { border: '1px solid #ddd', padding: '20px', borderRadius: '4px', backgroundColor: '#fff' },
    paymentGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
    gridBtn: { padding: '10px 5px', border: '1px solid #f0f0f0', backgroundColor: '#fdfdfd', fontSize: '10px', color: '#aaa', cursor: 'pointer', borderRadius: '4px', wordBreak: 'keep-all', outline:'none' },
    activeGridBtn: { padding: '10px 5px', border: '2px solid #333', backgroundColor: '#fff', fontSize: '10px', color: '#333', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', wordBreak: 'keep-all', outline:'none' },

    actionArea: { marginTop: '20px' },
    fakeSubmitBtn: { width: '100%', padding: '25px', backgroundColor: '#0078ff', color: 'white', border: 'none', fontSize: '20px', fontWeight: '900', cursor: 'pointer', borderRadius: '8px' },
    realSubmitBtn: { padding: '10px 20px', backgroundColor: '#e0e0e0', color: '#888', border: 'none', fontSize: '12px', cursor: 'pointer', borderRadius: '4px' }
};

export default PaymentPage;