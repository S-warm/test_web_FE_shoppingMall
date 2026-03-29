// src/pages/ShopPage.js
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

export const products = [
  // --- TOP (상의) ---
  { id: 1, name: "strength pigment long sleeve ", price: 39000, category: "TOP", img: "https://the-otherside.co.kr/web/product/big/202509/8ebeb67ee79e05e71d729eaba49c08c4.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250911/strength-pigment-long-sleeve-BLACK.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250911/strength-pigment-long-sleeve-GRAY.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/1.jpg"] },
  { id: 2, name: "5668 bony wool crop round knit", price: 41000, category: "TOP", img: "https://the-otherside.co.kr/web/product/big/202511/5d288e7fa533f8dbb7044ad330865763.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/copy-1762498641-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251201/EAB7B8EBA088EC9DB4.jpg"] },
  { id: 3, name: "cashmere like round knit", price: 42000, category: "TOP", img: "https://the-otherside.co.kr/web/product/small/202412/a147d3df7374ad0b3b90fe13fa8d694f.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20241224/%EC%BA%90%EC%8B%9C%EB%AF%B8%EC%96%B4-%EA%B7%B8%EB%A0%88%EC%9D%B4_shop1_152855.jpg"] },
  { id: 4, name: "Coel henly neck round knit", price: 36000, category: "TOP", img: "https://the-otherside.co.kr/web/product/small/202509/fc1be70f870f3d718cea72965eff194d.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250919/copy-1758264363-1.jpg"] },
  { id: 5, name: "Aran heavy henley cable knit ", price: 42000, category: "TOP", img: "https://the-otherside.co.kr/web/product/big/202512/f08cee894dd4b03d5a1015c7c3c727fd.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251230/copy-1767063606-1.jpg"] },
  { id: 6, name: "neo Iceland nordic brush knit ", price: 36000, category: "TOP", img: "https://the-otherside.co.kr/web/product/big/202511/368e0569861c87ff5d7f2a0eb00fff87.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251125/copy-1764048305-1.jpg"] },
  { id: 7, name: "Wave border brush knit", price: 54000, category: "TOP", img: "https://the-otherside.co.kr/web/product/small/202601/52014da929db3912d906d159a9eeeedb.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260106/0.jpg"] },
  { id: 8, name: " alaska half polo neck knit", price: 37000, category: "TOP", img: "https://the-otherside.co.kr/web/product/big/202412/b6b4b7da977178af3624cd4a15ed9b2d.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20241205/copy-1733382819-1.jpg"] },

  // --- OUTER (아우터) ---
  { id: 9, name: "plain heritage nordic cardigan", price: 36000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202601/8ba4ac5f680ccb5c2b2eff68da355146.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251230/1.jpg"] },
  { id: 10, name: "uni city padding jumper", price: 69000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202510/827c2ea638cd706c7b8b1fce82eacd47.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/EC8B9CED8BB0-EBB894EB9E99-EC8381ED9598EC9D98.jpg"] },
  { id: 11, name: "Stripe brush semi crop cardigan ", price: 42000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202511/872e2e452b68283d1740761caefbbab6.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/copy-1762497261-1.jpg"] },
  { id: 12, name: "LAB 2-way hoodie padding", price: 54000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202512/bfde67d37be2c6a8c20213fa76de525e.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20241108/EB9EA9-ED8CA8EB94A9-EBB894EB9E99-EC9E91EC9785-1.jpg"] },
  { id: 13, name: "blanc crop work jacket ", price: 119000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202411/fe84c405c62a5014347a6203b283ef5c.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251230/copy-1730273618-1.jpg"] },
  { id: 14, name: "steady balmacaan coat", price: 129000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202312/4b188ceecb4299c358e6e9370341062a.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251030/5EC9584EC9AB0ED84B0.jpg"] },
  { id: 15, name: "light down quilted jumper", price: 39000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202512/48cf9ca5a23a9815ea8b48ca7dff74cc.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/3ED8FBC.jpg"] },
  { id: 16, name: "Seraph light down padding", price: 119000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202512/b18d6d738a88210be48366a771b9e4ae.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251219/copy-1766120286-1.jpg"] },

  // --- BOTTOM (하의) ---
  { id: 17, name: "[004] two-tuck wide denim (black)", price: 56000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202409/ce0b729183a8f149be2b8cafa79224c8.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251114/copy-1763113610-004-9ED8FBC-1.jpg"] },
  { id: 18, name: "[003] two-tuck wide denim (light gray)", price: 58000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202410/f07f511ed0688ed276efdfe807e28adb.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20231219/003-EBA994EC9DB8.jpg"] },
  { id: 19, name: "pleat balloon string sweat pants", price: 34000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202601/0d991deffc195b6d161493a09474570d.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767940992-1.jpg"] },
  { id: 20, name: "Non-fade dart balloon denim", price: 54000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202601/a4d3691e706f1ccf9654b326ffdded4c.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767939563-1.jpg"] },
  { id: 21, name: "Yuki curved dyeing cargo pants", price: 42000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202601/c60f4f8c72c748a09cba71b0466b22ea.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767937757-1.jpg"] },
  { id: 22, name: "wonted pocket cargo pants", price: 51000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202509/d957beb3be132d3bce76df03945ca521.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250219/copy-1739948300-1.jpg"] },
  { id: 23, name: "Cloud soft fleece pants", price: 49000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202511/eab61b1afd26c2ad95f2e526416688d4.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251113/copy-1763016712-1.jpg"] },
  { id: 24, name: "wide straight washed denim ", price: 36000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202502/b08d0e8d4ad8deaefd4f16071188755c.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250911/wide-straight-washed-denim.jpg"] },

  // --- ACC ---
  { id: 25, name: "Italy leather belt ", price: 29000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202601/deaaf3cb1d15a616ae297d0f7c872082.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767942236-1.jpg"] },
  { id: 26, name: "Chester leather cross bag ", price: 45000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202512/b88f3e10328b8a11edaa22b0cfb21098.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251126/1.jpg"] },
  { id: 27, name: "every wool muffler ", price: 59000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202311/94ef4b708acad6a3058b29a47ecea3f9.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20240110/EC9584EC9DB4ED859C-ECB694ECB29C-13.jpg"] },
  { id: 28, name: "rustle double bag", price: 25000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202108/5831e168a5abd335e448a6ae022546e6.jpg", detailImages: ["https://contents.sixshop.com/thumbnails/uploadedFiles/73125/product/image_1618295139576_1000.jpg"] },

  // --- NEW ---
  { id: 35, name: "More nordic knit zip-up ", price: 68400, category: "NEW", img: "https://the-otherside.co.kr/web/product/big/202601/552fa489f01a4fb1943e1b8fcfa52570.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260123/copy-1769151188-1.jpg"] },
  { id: 36, name: "double pocket collar cardigan ", price: 51300, category: "NEW", img: "https://the-otherside.co.kr/web/product/small/202601/72b865f1308d861c9870aa18623ae793.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769062459-1.jpg"] },
  { id: 37, name: "wool hairy stripe cardigan ", price: 48500, category: "NEW", img: "https://the-otherside.co.kr/web/product/big/202601/f0008d5aaa544cf424fda3e390ecf207.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769060246-1.jpg"] },
];

const banners = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
];

// 기존 팝업창 5개 데이터
const popupAdData = [
  { id: 1, title: 'WEEKEND SALE', subtitle: '주말특가, 최대 75% OFF!', desc: '매주 금/토/일 3일간 최대 혜택!\n설화수, 헤라 단독특집', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80', top: '10%', left: '45%', zIndex: 2001 },
  { id: 2, title: 'NEW MEMBER', subtitle: '신규 가입 즉시 10,000P', desc: '지금 가입하고 첫 구매 시\n무료배송 혜택까지 받아가세요.', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80', top: '15%', left: '50%', zIndex: 2002 },
  { id: 3, title: 'SEASON OFF', subtitle: '25 S/S 클리어런스 세일', desc: '놓치면 후회할 마지막 기회\n재고 소진 시 자동 종료됩니다.', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80', top: '20%', left: '55%', zIndex: 2003 },
];

const ShopPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const [, setHoveredProduct] = useState(null);

  const [currentCategory, setCurrentCategory] = useState("BEST 20");
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [myPageOpen, setMyPageOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('화이트');
  const [selectedSize, setSelectedSize] = useState('Free');

  // ✨ 시크릿 쿠폰창 보이기/숨기기 상태
  const [showSecretCoupon, setShowSecretCoupon] = useState(true);

  const [fleetingMessage, setFleetingMessage] = useState('');
  const triggerFleetingMessage = (msg, duration) => {
    setFleetingMessage(msg);
    setTimeout(() => setFleetingMessage(''), duration);
  };

  // ✨ [수정 완료] sessionStorage를 사용하여 브라우저 종료 시 리셋되도록 변경
  const [visiblePopups, setVisiblePopups] = useState(() => {
    return popupAdData
      .filter(p => !sessionStorage.getItem(`hide_popup_${p.id}`))
      .map(p => p.id);
  });

  const handleClosePopup = (id) => {
    setVisiblePopups(prev => prev.filter(popupId => popupId !== id));
  };

  // ✨ [수정 완료] localStorage 대신 sessionStorage에 저장
  const handleNeverShowPopup = (id) => {
    sessionStorage.setItem(`hide_popup_${id}`, 'true');
    handleClosePopup(id);
  };

  const bestProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 20);
  }, []); 

  // ✨ [수정 완료] 로그아웃 시 팝업 닫음 기록(sessionStorage) 싹 다 파괴
  const handleLogout = () => {
    const isConfirm = window.confirm("정말 로그아웃 하시겠습니까?");
    if (isConfirm) {
        logout(); 
        
        // 팝업 기록 파괴
        popupAdData.forEach(p => sessionStorage.removeItem(`hide_popup_${p.id}`));
        
        alert("로그아웃 되었습니다.");
        navigate('/login'); 
    }
  }; 

  useEffect(() => {
    const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  const filteredProducts = useMemo(() => {
    if (searchQuery.trim() !== "") {
      return products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return currentCategory === "BEST 20" 
      ? bestProducts
      : products.filter(p => p.category === currentCategory);
  }, [searchQuery, currentCategory, bestProducts]);

  const openOptionModal = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
    setSelectedColor('화이트');
    setSelectedSize('Free');
  };

  const handleConfirmCart = () => {
    const optionString = `색상: ${selectedColor} / 사이즈: ${selectedSize}`;
    addToCart(selectedProduct, 1, optionString);
    setModalOpen(false);
    if(window.confirm("장바구니에 담았습니다. 확인하시겠습니까?")) navigate('/cart');
  };

  const handleBuyNow = () => {
    const optionString = `색상: ${selectedColor} / 사이즈: ${selectedSize}`;
    addToCart(selectedProduct, 1, optionString);
    setModalOpen(false);
    navigate('/payment');
  };


  return (
    <div style={styles.container}>
      
      {/* CSS 스타일 주입 */}
      <style>
        {`
          .fake-heart { display: inline-block; cursor: pointer; font-size: 18px; user-select: none; transition: transform 0.2s, color 0.2s; }
          .fake-heart:hover { transform: scale(1.2); color: red !important; }
          .fake-heart:active { transform: scale(0.9); }
          
          .fake-filter span { cursor: pointer; transition: color 0.2s; }
          .fake-filter span:hover { color: #333; font-weight: bold; }
        `}
      </style>

      {fleetingMessage && (
        <div style={{ 
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', 
          backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', 
          padding: '15px 30px', borderRadius: '3px', fontWeight: 'bold', 
          zIndex: 9999, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '14px'
        }}>
          ⚠️ {fleetingMessage}
        </div>
      )}

      {/* ✨ [수정 완료] 좌측 하단 복사 금지 쿠폰 (X 버튼 추가됨) */}
      {showSecretCoupon && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '30px', zIndex: 1000,
          backgroundColor: '#333', color: 'white', padding: '20px', borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)', width: '220px'
        }}>
          {/* ✨ 우측 상단 닫기(X) 버튼 추가 */}
          <span 
            onClick={() => setShowSecretCoupon(false)}
            style={{ 
              position: 'absolute', top: '10px', right: '15px', 
              cursor: 'pointer', color: '#ccc', fontSize: '16px', fontWeight: 'bold' 
            }}
          >
            ✕
          </span>

          <h4 style={{ margin: '0 0 10px 0', color: '#fbc531' }}> 10% 할인 시크릿 쿠폰 도착!</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ccc' }}>결제창에서 코드를 입력하세요.</p>
          <div
            style={{
              backgroundColor: '#000', padding: '10px', textAlign: 'center',
              fontWeight: 'bold', letterSpacing: '3px', userSelect: 'none', 
              cursor: 'not-allowed'
            }}
            onCopy={(e) => {
              e.preventDefault(); 
              triggerFleetingMessage('보안 정책상 쿠폰 번호는 직접 타이핑하셔야 합니다.', 1000);
            }}
          >
            SWARM2026
          </div>
        </div>
      )}

      {/* 기존 5연타 우측 팝업 */}
      {popupAdData.map(popup => {
        if (!visiblePopups.includes(popup.id)) return null;
        return (
          <div key={popup.id} style={{
            position: 'fixed', top: popup.top, left: popup.left, zIndex: popup.zIndex,
            width: '320px', height: '420px', backgroundColor: 'white',
            borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ flex: 1, position: 'relative', backgroundImage: `url(${popup.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: '900', margin: '0 0 5px 0', fontStyle: 'italic', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{popup.title}</h2>
                <div style={{ backgroundColor: '#2ed573', padding: '5px 15px', borderRadius: '20px', marginBottom: '15px' }}><span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>{popup.subtitle}</span></div>
                <p style={{ color: '#fff', fontSize: '14px', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>{popup.desc}</p>
              </div>
            </div>
            <div style={{ height: '50px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px' }}>
              <span onClick={() => handleNeverShowPopup(popup.id)} style={{ fontSize: '13px', color: '#f0f0f0', cursor: 'pointer', userSelect: 'none' }}>오늘 그만보기</span>
              <span onClick={() => handleClosePopup(popup.id)} style={{ fontSize: '15px', fontWeight: 'bold', color: '#333', cursor: 'pointer', userSelect: 'none' }}>닫기</span>
            </div>
          </div>
        );
      })}

      <header style={styles.header}>
        <div style={styles.logoGroup} onClick={() => setCurrentCategory("ALL")}>
            <h1 style={styles.logo}>Swarm</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #333', marginRight: '15px' }}>
            <input type="text" placeholder="상품 검색" style={{ border: 'none', outline: 'none', width: '120px', padding: '5px' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <span style={{ cursor: 'pointer' }}>🔍</span>
          </div>
          <span onClick={() => navigate('/cart')} style={styles.iconLink}>🛍 CART</span>
          <span onClick={() => setMyPageOpen(true)} style={styles.iconLink}>👤 {user.name ? `${user.name}님` : 'MYPAGE'}</span>
        </div>
      </header>

      <nav style={styles.navBar}>
        {["BEST 20", "TOP", "OUTWEAR", "BOTTOM", "ACC", "NEW"].map((cat) => (
            <span key={cat} style={{...styles.navItem, color: currentCategory === cat ? 'black' : '#888', borderBottom: currentCategory === cat ? '2px solid black' : 'none'}} onClick={() => setCurrentCategory(cat)}>
                {cat}
            </span>
        ))}
      </nav>

      <div style={styles.sliderContainer}>
        <div style={{...styles.sliderTrack, transform: `translateX(-${currentSlide * 100}%)`}}>
            {banners.map((img, index) => (
                <div key={index} style={styles.slide}>
                    <img src={img} alt="banner" style={styles.bannerImg} />
                    <div style={styles.bannerOverlay}><h2>2026 S/S NEW COLLECTION</h2><p>Swarm만의 감성을 만나보세요</p></div>
                </div>
            ))}
        </div>
        <div style={styles.indicatorBox}>
            {banners.map((_, idx) => (
                <div key={idx} style={{...styles.indicator, background: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.5)'}} />
            ))}
        </div>
      </div>

      <div style={styles.titleSection}>
        <h2 style={styles.mainTitle}>{currentCategory}</h2>
        <div className="fake-filter" style={{ fontSize: '13px', color: '#999', marginTop: '10px' }}>
            <span onClick={() => {}}>신상품순</span> &nbsp;|&nbsp; 
            <span onClick={() => {}}>리뷰많은순</span> &nbsp;|&nbsp; 
            <span style={{color: '#333', fontWeight:'bold'}} onClick={() => {}}>가격낮은순</span>
        </div>
      </div>

      <div style={styles.gridContainer}>
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '150px 0', fontSize: '18px', fontWeight: 'bold', color: '#888' }}>해당 상품이 없습니다.</div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} style={styles.productCard} onClick={() => navigate(`/product/${product.id}`)} onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
              <div style={styles.imageWrapper}>
                <img src={product.img} alt={product.name} style={{...styles.productImage, opacity: 1, transition: 'opacity 0.2s ease-in-out'}} />
              </div>
              <div style={styles.productName}>{product.name}</div>
              
              <div style={styles.priceRow}>
                  <button style={styles.cartIconBtn} onClick={(e) => openOptionModal(e, product)}>🛒</button>
                  <span 
                    className="fake-heart" 
                    title="찜하기"
                    style={{ color: '#ccc' }} 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                  >
                    🤍
                  </span>
                  <span style={styles.price}>₩{product.price.toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ width: '100%', marginTop: '60px', paddingBottom: '40px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#333' }}>💬 실시간 베스트 후기</h3>
            <span style={{ fontSize: '12px', color: '#888', cursor: 'pointer' }}>더보기 {'>'}</span>
          </div>
          
          <div style={{ 
            width: '100%', 
            height: '420px', 
            overflowY: 'scroll', 
            backgroundColor: '#fafafa', 
            border: '1px solid #eaeaea', 
            borderRadius: '8px',
            padding: '20px', 
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.02)'
          }}>
            {Array.from({length: 50}).map((_, i) => (
              <div key={i} style={{ 
                backgroundColor: 'white', padding: '15px', marginBottom: '10px', 
                borderRadius: '4px', border: '1px solid #f1f1f1' 
              }}>



                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#fbc531', fontSize: '12px' }}>★★★★★</span>
                  <span style={{ color: '#aaa', fontSize: '12px' }}>
                    {['kim**', 'lee**', 'park**', 'choi**', 'jung**'][i % 5]} | 2026.03.{String(24 - (i%10)).padStart(2, '0')}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#444', margin: '5px 0 0 0', lineHeight: '1.4' }}>
                  {
                    i % 3 === 0 ? "배송도 빠르고 핏이 딱 맞아서 너무 예뻐요! 고민하다 샀는데 진작 살 걸 그랬네요. 다음에도 여기서 구매할게요~ 🥰" :
                    i % 3 === 1 ? "재질도 좋고 마감 처리도 깔끔합니다. 화면에서 본 색상 그대로라 마음에 쏙 들어요! (사진보다 실물이 나음)" :
                    "가성비 대박입니다. 친구들이 어디서 샀냐고 계속 물어보네요 ㅋㅋㅋ 데일리로 입기 딱 좋습니다 강추!!"
                  }
                </p>
              </div>
            ))}
            <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '12px' }}>
              리뷰를 모두 불러왔습니다.
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: '11px', marginTop: '10px' }}>
            * 하단 회사 정보(고객센터)를 보시려면 마우스를 리뷰 창 밖으로 빼고 스크롤하세요.
          </p>
      </div>
{/* ✨ [함정 추가 5] 핑퐁 이동(Pogo-Sticking) 유발 푸터 */}
      <footer style={{ backgroundColor: '#1a1a1a', padding: '50px 20px', marginTop: '50px', color: '#888', fontSize: '13px', textAlign: 'center' }}>
        {/* 직관적인 '고객센터(1588-0000)'는 절대 적어두지 않고 모호하게 쪼개놓습니다. */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/cs/support')} onMouseEnter={(e)=>e.target.style.color='white'} onMouseLeave={(e)=>e.target.style.color='#888'}>온라인 지원</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/cs/voice')} onMouseEnter={(e)=>e.target.style.color='white'} onMouseLeave={(e)=>e.target.style.color='#888'}>고객의 소리</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/cs/helpdesk')} onMouseEnter={(e)=>e.target.style.color='white'} onMouseLeave={(e)=>e.target.style.color='#888'}>Swarm 헬프데스크</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/cs/guide')} onMouseEnter={(e)=>e.target.style.color='white'} onMouseLeave={(e)=>e.target.style.color='#888'}>이용 안내</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/cs/contact')} onMouseEnter={(e)=>e.target.style.color='white'} onMouseLeave={(e)=>e.target.style.color='#888'}>문의하기</span>
        </div>
        <p style={{ margin: '5px 0' }}>(주)SWARM | 대표: 김스웜 | 개인정보보호책임자: 김스웜</p>
        <p style={{ margin: '5px 0' }}>사업자등록번호: 123-45-67890 | 통신판매업신고: 2026-서울강남-0000</p>
        <p style={{ marginTop: '20px', fontSize: '11px', color: '#555' }}>
          * 고객센터 전화번호는 각 부서별 안내 페이지에서 확인하실 수 있습니다. (※ 사실 어디에도 안 적어둠)
        </p>
      </footer>

      {modalOpen && selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}><h3 style={{margin:0}}>옵션 선택</h3><span onClick={() => setModalOpen(false)} style={styles.closeX}>×</span></div>
            <p style={styles.modalTitle}>{selectedProduct.name}</p>
            <div style={styles.optionRow}><label>색상</label><select style={styles.select} value={selectedColor} onChange={(e)=>setSelectedColor(e.target.value)}><option>화이트</option><option>블랙</option><option>네이비</option></select></div>
            <div style={styles.optionRow}><label>사이즈</label><select style={styles.select} value={selectedSize} onChange={(e)=>setSelectedSize(e.target.value)}><option>Free</option><option>S</option><option>M</option><option>L</option></select></div>
            <div style={styles.modalBtnGroup}><button style={styles.cartBtn} onClick={handleConfirmCart}>장바구니</button><button style={styles.buyBtn} onClick={handleBuyNow}>바로 구매</button></div>
          </div>
        </div>
      )}

      {myPageOpen && (
        <div style={styles.centerModalOverlay} onClick={() => setMyPageOpen(false)}>
          <div style={styles.centerModalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.mpTitle}>MY PAGE</h2>
            <div style={styles.infoRow}><span style={styles.label}>아이디</span><span>{user.username || '-'}</span></div>
            <div style={styles.infoRow}><span style={styles.label}>이름</span><span>{user.name || '게스트'}</span></div>
            <div style={styles.infoRow}><span style={styles.label}>연락처</span><span>{user.phone || '-'}</span></div>
            <div style={{marginTop:'30px', display:'flex', gap:'10px'}}><button style={styles.closeBtn} onClick={() => setMyPageOpen(false)}>닫기</button><button style={styles.logoutBtn} onClick={handleLogout}>로그아웃</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: 'white', minHeight: '100vh', paddingBottom: '50px', fontFamily: 'sans-serif', paddingTop: '115px', width: '100%', overflowX: 'hidden', position: 'relative' },
  header: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #ddd', position: 'fixed', top: 0, left: 0, right: 0, height: '60px', backgroundColor: 'white', zIndex: 1000, boxSizing: 'border-box' },
  logoGroup: { gridColumn: '2', cursor: 'pointer', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  logo: { fontFamily: 'cursive', fontSize: '28px', margin: 0 },
  headerRight: { gridColumn: '3', justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  iconLink: { cursor:'pointer', transition: 'color 0.3s' },
  navBar: { display:'flex', justifyContent:'center', gap:'20px', padding:'15px 0', borderBottom:'1px solid #eee', position: 'fixed', top: '60px', left: 0, right: 0, backgroundColor: 'white', zIndex: 999, boxSizing: 'border-box', flexWrap: 'wrap' },
  navItem: { fontSize:'14px', fontWeight:'bold', cursor:'pointer', paddingBottom:'5px', letterSpacing:'1px' },
  sliderContainer: { width: '100%', height: '400px', overflow: 'hidden', position: 'relative', marginBottom: '40px' },
  sliderTrack: { display: 'flex', width: '100%', height: '100%', transition: 'transform 0.5s ease-in-out' },
  slide: { minWidth: '100%', height: '100%', position:'relative' },
  bannerImg: { width: '100%', height: '100%', objectFit: 'cover' },
  bannerOverlay: { position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'white', textAlign:'center', textShadow:'0 2px 10px rgba(0,0,0,0.5)', width:'90%' },
  indicatorBox: { position:'absolute', bottom:'20px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'10px' },
  indicator: { width:'10px', height:'10px', borderRadius:'50%', transition:'background 0.3s' },
  titleSection: { textAlign: 'center', padding: '20px 0 20px 0' },
  mainTitle: { fontSize: '24px', margin: '0', textTransform: 'uppercase', letterSpacing: '2px' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', boxSizing: 'border-box' },
  productCard: { cursor: 'pointer', textAlign: 'center' },
  imageWrapper: { width: '100%', aspectRatio: '3/4', overflow: 'hidden', marginBottom: '10px', borderRadius:'4px' },
  productImage: { width: '100%', height: '100%', objectFit: 'cover', transition:'transform 0.3s' },
  productName: { fontSize: '14px', marginBottom: '5px', color:'#333' },
  priceRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '5px' },
  price: { fontWeight: 'bold', fontSize: '15px' },
  cartIconBtn: { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 1000 },
  modalBox: { backgroundColor: 'white', padding: '30px', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '500px', animation:'slideUp 0.3s' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
  closeX: { fontSize:'24px', cursor:'pointer', color:'#999' },
  modalTitle: { fontSize:'16px', fontWeight:'bold', marginBottom:'20px', borderBottom:'1px solid #eee', paddingBottom:'10px' },
  optionRow: { marginBottom: '15px' },
  select: { width:'100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  modalBtnGroup: { display: 'flex', gap: '10px', marginTop: '20px' },
  cartBtn: { flex: 1, padding: '15px', background: 'white', border: '1px solid #333', fontWeight: 'bold', cursor: 'pointer' },
  buyBtn: { flex: 1, padding: '15px', background: '#333', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  centerModalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 },
  centerModalBox: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', width: '320px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  mpTitle: { textAlign:'center', marginBottom:'20px', borderBottom:'2px solid #333', paddingBottom:'10px' },
  infoRow: { display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'14px', borderBottom:'1px solid #f1f1f1', paddingBottom:'5px' },
  label: { color:'#888', fontWeight:'bold' },
  closeBtn: { flex: 1, padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold' },
  logoutBtn: { flex: 1, padding: '12px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold' }
};

export default ShopPage;