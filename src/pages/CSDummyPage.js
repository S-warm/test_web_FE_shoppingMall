// src/pages/CSDummyPage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CSDummyPage = () => {
  const { type } = useParams(); 
  const navigate = useNavigate();

  // 각 메뉴별 콘텐츠 (전화번호는 오직 'contact(문의하기)' 탭의 구석에만 숨겨둡니다)
  const contentMap = {
    support: { 
      title: '온라인 지원', 
      desc: 'SWARM의 온라인 지원 센터입니다.\n원하시는 서비스를 선택해 주세요.',
      showFakeButtons: true 
    },
    guide: { 
      title: '자주 묻는 질문 (FAQ)', 
      desc: '고객님들이 가장 많이 묻는 질문 TOP 10입니다.\n(※ 배송 관련 문의는 1:1 문의를 이용해주세요.)',
      showFakeButtons: true 
    },
    contact: { 
      title: '1:1 문의 및 상담', 
      desc: '궁금하신 점을 남겨주시면 빠르게 답변해 드리겠습니다.',
      showContactTrap: true // ✨ 여기에 핑퐁 함정을 가동합니다.
    }
  };

  const currentContent = contentMap[type] || { title: '고객센터', desc: '메뉴를 준비 중입니다.' };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px' }}>
      
      {/* 가짜 고객센터 상단 네비게이션 탭 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button onClick={() => navigate('/cs/support')} style={{ ...styles.tabBtn, backgroundColor: type === 'support' ? '#333' : '#fff', color: type === 'support' ? '#fff' : '#666' }}>온라인 지원</button>
        <button onClick={() => navigate('/cs/guide')} style={{ ...styles.tabBtn, backgroundColor: type === 'guide' ? '#333' : '#fff', color: type === 'guide' ? '#fff' : '#666' }}>자주 묻는 질문</button>
        <button onClick={() => navigate('/cs/contact')} style={{ ...styles.tabBtn, backgroundColor: type === 'contact' ? '#333' : '#fff', color: type === 'contact' ? '#fff' : '#666' }}>1:1 문의하기</button>
      </div>

      <div style={{ backgroundColor: 'white', width: '600px', padding: '50px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>
          {currentContent.title}
        </h2>
        <p style={{ color: '#666', lineHeight: '1.6', whiteSpace: 'pre-line', marginBottom: '40px', fontSize: '14px' }}>
          {currentContent.desc}
        </p>

        {/* 허탕 치는 일반 메뉴들 */}
        {currentContent.showFakeButtons && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
             <button style={styles.fakeActionBtn} onClick={() => alert('해당 서비스는 준비 중입니다.')}>회원정보 변경 안내</button>
             <button style={styles.fakeActionBtn} onClick={() => alert('해당 서비스는 준비 중입니다.')}>반품/교환 접수 안내</button>
             <button style={styles.fakeActionBtn} onClick={() => alert('해당 서비스는 준비 중입니다.')}>배송 조회 시스템</button>
          </div>
        )}

        {/* ✨ [핵심 함정] 1:1 문의 탭의 시각적 낚시 (Visual Hierarchy Dark Pattern) */}
        {currentContent.showContactTrap && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* 시선을 완벽하게 강탈하는 거대하고 파란 1:1 게시판 버튼 */}
            <button 
              onClick={() => alert('1:1 문의 게시판으로 이동합니다.')} 
              style={{ padding: '20px 40px', backgroundColor: '#0078ff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '60px', boxShadow: '0 4px 10px rgba(0, 120, 255, 0.3)' }}
            >
               1:1 온라인 게시판 문의 작성하기
            </button>
            
            <div style={{ borderTop: '1px solid #eee', width: '100%', paddingTop: '30px' }}>
              <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 5px 0' }}>긴급한 문의의 경우 아래 방법을 이용하실 수 있습니다.</p>
              {/* 시선을 피하도록 설계된 보호색 + 작은 글씨의 전화번호 */}
              <div style={{ color: '#e0e0e0', fontSize: '11px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                 <span>고객센터 운영시간: 평일 10:00 - 17:00</span>
                 <span>|</span>
                 {/* 드래그도 헷갈리게 하이픈 대신 점(.) 사용 */}
                 <span>전화상담: 1588.0000</span> 
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  tabBtn: { padding: '12px 25px', border: '1px solid #ddd', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
  fakeActionBtn: { padding: '15px', backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #eee', borderRadius: '5px', fontSize: '14px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }
};

export default CSDummyPage;