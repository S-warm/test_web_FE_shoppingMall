import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { TimerContext } from '../context/TimerContext'; // ✨ 타이머 기능 필수!

const PaymentPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { endTimer } = useContext(TimerContext); // ✨ 타이머 종료 함수 가져오기
  
  const [payMethod, setPayMethod] = useState(''); 

  const handlePayment = async () => {
    // 1. 결제 수단 선택 확인
    if (!payMethod) {
      alert("결제 수단을 선택해주세요!");
      return;
    }

    // ✨ 2. 타이머 스톱! (시간 계산 결과 받기)
    const timeResult = endTimer(); 
    let timeLogStr = "시간 측정 불가";

    if (timeResult) {
        // 로그에 남길 문자열 정리
        timeLogStr = `${timeResult.formatted} 소요 (${timeResult.durationSeconds}초)`;
    }

    try {
        // ✨ 3. 실험 종료 로그 서버로 전송
        await axios.post('http://localhost:8080/api/log', {
            username: user.username || user.name || 'guest',
            action: 'TEST_END', // 행동 이름
            // 결제 수단과 소요 시간을 같이 기록
            detail: `[결제완료] 수단:${payMethod} | 소요시간: ${timeLogStr}`
        });

        alert(`[결제 완료]\n실험이 종료되었습니다.\n(소요시간: ${timeResult ? timeResult.formatted : '측정불가'})`);
        
        // 4. 초기화 및 이동
        clearCart();
        navigate('/');

    } catch (e) {
        console.error(e);
        // 서버 에러 나도 사용자는 진행되게 처리
        alert("결제 처리는 완료되었습니다.");
        clearCart();
        navigate('/');
    }
  };

  return (
    <div style={styles.container}>
        <h2 style={styles.title}>주문/결제</h2>
        
        {/* 배송지 정보 섹션 (UI 복구) */}
        <div style={styles.section}>
          <h3 style={styles.subTitle}>배송지 정보</h3>
          <label style={styles.label}>받는 분</label>
          <input type="text" placeholder="이름" defaultValue={user.name} style={styles.input} />
          
          <label style={styles.label}>연락처</label>
          <input type="text" placeholder="휴대폰 번호" defaultValue={user.phone} style={styles.input} />
          
          <label style={styles.label}>주소</label>
          <input type="text" placeholder="주소 입력" defaultValue={user.address} style={styles.input} />
        </div>

        {/* 결제 수단 섹션 (UI 복구) */}
        <div style={styles.section}>
          <h3 style={styles.subTitle}>결제 수단</h3>
          <div style={styles.payBtnGroup}>
              <button 
                style={payMethod === 'card' ? styles.activePayBtn : styles.payBtn}
                onClick={() => setPayMethod('card')}
              >
                신용카드
              </button>
              
              <button 
                style={payMethod === 'bank' ? styles.activePayBtn : styles.payBtn}
                onClick={() => setPayMethod('bank')}
              >
                무통장입금
              </button>
              
              <button 
                style={payMethod === 'naver' ? {...styles.activePayBtn, borderColor:'#03C75A', color:'#03C75A'} : {...styles.payBtn, color:'#03C75A', fontWeight:'bold'}}
                onClick={() => setPayMethod('naver')}
              >
                네이버페이
              </button>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <button onClick={handlePayment} style={styles.submitBtn}>
            {payMethod ? `${payMethod === 'card' ? '신용카드' : payMethod === 'bank' ? '무통장입금' : '네이버페이'}로 결제하기` : '결제하기'}
        </button>
    </div>
  );
};

const styles = {
    container: { padding: '20px', maxWidth:'600px', margin:'0 auto', fontFamily: 'sans-serif' },
    title: { textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '10px' },
    section: { marginBottom: '30px' },
    subTitle: { fontSize: '18px', marginBottom: '10px', fontWeight: 'bold' },
    label: { display:'block', marginBottom:'5px', fontSize:'13px', color:'#666'},
    input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing:'border-box' },
    payBtnGroup: { display:'flex', gap:'10px' },
    payBtn: { flex: 1, padding: '15px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', borderRadius: '4px', color:'#999' },
    activePayBtn: { flex: 1, padding: '15px', border: '2px solid #333', background: 'white', cursor: 'pointer', borderRadius: '4px', fontWeight:'bold', color:'#333' },
    submitBtn: { width: '100%', padding: '15px', background: '#333', color: 'white', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', borderRadius: '4px' }
};

export default PaymentPage;