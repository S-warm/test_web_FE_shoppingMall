// src/pages/TermsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('hasViewedTerms', 'true');
  }, []);
  
  // 체크박스 상태 관리
  const [agreements, setAgreements] = useState({
    all: false,
    term1: false, // 필수
    term2: false, // 선택
    term3: false, // 선택
    term4: false, // 선택
  });

  // 모달(팝업창) 상태 관리
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', text: '' });

  // 전체 동의 클릭
  const handleAllCheck = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      term1: newValue,
      term2: newValue,
      term3: newValue,
      term4: newValue,
    });
  };

  // 개별 항목 클릭
  const handleSingleCheck = (key) => {
    setAgreements({ ...agreements, [key]: !agreements[key], all: false });
  };

  // [보기] 버튼 클릭 시 모달 열기
  const openModal = (type) => {
    let content = { title: '', text: '' };
    
    if (type === 'term1') {
      content = {
        title: '서비스 이용약관',
        text: '제1조(목적) 본 약관은 서비스 이용조건 및 절차를 규정합니다.\n\n제2조(정의) "이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.\n\n제3조(약관의 효력) 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.'
      };
    } else if (type === 'term3') {
      content = {
        title: '위치기반서비스 이용약관',
        text: '제1조(목적) 위치정보의 보호 및 이용 등에 관한 법률에 따라...\n\n제2조(이용요금) 서비스는 기본적으로 무료입니다.'
      };
    } else if (type === 'term4') {
      content = {
        title: '개인정보 수집 및 이용',
        text: '1. 수집항목: 이름, 전화번호, 생년월일.\n2. 목적: 마케팅 활용 및 이벤트 정보 전달.\n3. 보유기간: 회원 탈퇴 시까지.'
      };
    } else {
       return; 
    }
    
    setModalContent(content);
    setShowModal(true);
  };

  // 다음 버튼 로직
  const handleNext = () => {
    if (agreements.term1) {
      navigate('/signup'); 
    } else {
      alert('필수 약관에 동의해주세요.');
    }
  };

  return (
    <div style={styles.background}>
      
      <h2 style={styles.pageTitle}>약관 동의</h2>

      <div style={styles.card}>
        
        {/* 전체 동의 박스 (파란색 포인트) */}
        <div style={styles.allCheckArea} onClick={handleAllCheck}>
          <div style={{
            ...styles.checkboxIcon, 
            backgroundColor: agreements.all ? '#007bff' : 'white', 
            borderColor: agreements.all ? '#007bff' : '#ccc'       
          }}>
            {agreements.all && <span style={{color:'white'}}>✔</span>}
          </div>
          
          <div style={{flex:1}}>
            <div style={{fontWeight: 'bold', fontSize: '15px', color: '#333'}}>
              약관 전체 동의하기
            </div>
            <div style={{fontSize: '12px', color: '#888', marginTop: '5px', lineHeight: '1.4'}}>
              실명 인증된 아이디로 가입, 위치기반서비스(선택), 이벤트 혜택 수신(선택) 동의를 포함합니다.
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* 1. 필수 약관 */}
        <div style={styles.row}>
          <div style={styles.checkGroup} onClick={() => handleSingleCheck('term1')}>
             <div style={{...styles.checkboxIcon, backgroundColor: agreements.term1 ? '#007bff' : 'white'}}>
               {agreements.term1 && <span style={{color:'white'}}>✔</span>}
             </div>
             <span style={{color: '#007bff', marginRight: '5px', fontSize:'14px'}}>[필수]</span>
             <span style={{color: '#333', fontSize:'14px'}}>서비스 이용약관</span>
          </div>
          <span style={styles.viewLink} onClick={() => openModal('term1')}>보기 &gt;</span>
        </div>

        {/* 2. 선택 약관 */}
        <div style={styles.row}>
          <div style={styles.checkGroup} onClick={() => handleSingleCheck('term2')}>
             <div style={{...styles.checkboxIcon, backgroundColor: agreements.term2 ? '#007bff' : 'white'}}>
               {agreements.term2 && <span style={{color:'white'}}>✔</span>}
             </div>
             <span style={{color: '#999', marginRight: '5px', fontSize:'14px'}}>[선택]</span>
             <span style={{color: '#999', fontSize:'14px'}}>실명 인증된 아이디로 가입</span>
          </div>
        </div>

        {/* 3. 선택 약관 */}
        <div style={styles.row}>
          <div style={styles.checkGroup} onClick={() => handleSingleCheck('term3')}>
             <div style={{...styles.checkboxIcon, backgroundColor: agreements.term3 ? '#007bff' : 'white'}}>
               {agreements.term3 && <span style={{color:'white'}}>✔</span>}
             </div>
             <span style={{color: '#999', marginRight: '5px', fontSize:'14px'}}>[선택]</span>
             <span style={{color: '#999', fontSize:'14px'}}>위치기반서비스 이용약관</span>
          </div>
          <span style={styles.viewLink} onClick={() => openModal('term3')}>보기 &gt;</span>
        </div>

        {/* 4. 선택 약관 */}
        <div style={styles.row}>
          <div style={styles.checkGroup} onClick={() => handleSingleCheck('term4')}>
             <div style={{...styles.checkboxIcon, backgroundColor: agreements.term4 ? '#007bff' : 'white'}}>
               {agreements.term4 && <span style={{color:'white'}}>✔</span>}
             </div>
             <span style={{color: '#999', marginRight: '5px', fontSize:'14px'}}>[선택]</span>
             <span style={{color: '#999', fontSize:'14px'}}>개인정보 수집 및 이용</span>
          </div>
          <span style={styles.viewLink} onClick={() => openModal('term4')}>보기 &gt;</span>
        </div>

        {/* 다음 버튼 */}
        <button 
          onClick={handleNext}
          style={{
            ...styles.nextBtn,
            backgroundColor: agreements.term1 ? '#007bff' : '#eee',
            color: agreements.term1 ? 'white' : '#aaa',
            cursor: agreements.term1 ? 'pointer' : 'default'
          }}
        >
          다음 단계로
        </button>

        {/* ✨ [함정 UI] 폼 초기화 멘탈 붕괴 버튼 */}
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backBtn}
        >
          ← 작성 중이던 화면으로 돌아가기
        </button>

      </div>

      {/* 모달 팝업 */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{marginTop:0, fontSize:'16px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
              {modalContent.title}
            </h3>
            <div style={styles.modalText}>
              {modalContent.text}
            </div>
            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
              확인
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  background: {
    backgroundColor: '#f5f6f7', 
    minHeight: '100vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif'
  },
  pageTitle: { fontSize: '32px', color: '#333', marginBottom: '20px', fontWeight: 'bold' },
  card: {
    width: '460px', backgroundColor: 'white', padding: '30px 20px', borderRadius: '6px',
    border: '1px solid #ddd', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', boxSizing: 'border-box'
  },
  allCheckArea: { display: 'flex', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '10px' },
  checkboxIcon: {
    width: '22px', height: '22px', borderRadius: '50%', border: '1px solid #ccc',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    marginRight: '12px', fontSize: '12px', flexShrink: 0
  },
  divider: { height: '1px', backgroundColor: '#eee', margin: '20px 0' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  checkGroup: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
  viewLink: { fontSize: '13px', color: '#888', textDecoration: 'underline', cursor: 'pointer' },
  nextBtn: {
    width: '100%', padding: '15px', border: 'none', borderRadius: '5px',
    fontSize: '18px', fontWeight: 'bold', marginTop: '30px'
  },
  // ✨ 돌아가기 버튼 스타일 추가
  backBtn: {
    width: '100%', padding: '15px', backgroundColor: 'white', color: '#666', 
    border: '1px solid #ddd', borderRadius: '5px', fontSize: '15px', fontWeight: 'bold', 
    marginTop: '10px', cursor: 'pointer', transition: 'background 0.2s'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
  },
  modalBox: { width: '320px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  modalText: {
    fontSize: '13px', lineHeight: '1.5', color: '#555', height: '150px', overflowY: 'auto',
    backgroundColor: '#f8f9fa', padding: '10px', marginBottom: '15px', whiteSpace: 'pre-wrap', border: '1px solid #eee'
  },
  closeBtn: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default TermsPage;