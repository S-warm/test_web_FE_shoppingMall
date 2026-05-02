// src/pages/ProductDetailPage.js
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from './ShopPage'; 
import { CartContext } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const product = products.find(p => p.id === parseInt(id));

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  // ✨ [함정] 기존의 isExpanded를 지우고, '현재 열려있는 아코디언 탭'을 추적하는 상태 추가
  const [activeAccordion, setActiveAccordion] = useState(null);

  // 드롭다운 상태
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [openColorList, setOpenColorList] = useState(false);
  const [openSizeList, setOpenSizeList] = useState(false);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const colorOptions = ["화이트", "블랙", "네이비", "차콜", "베이지", "그레이"];
  const sizeOptions = ["Free", "S", "M", "L", "XL"];

  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  const topImages = [product.img];
  if (product.hoverImg) topImages.push(product.hoverImg);
  const detailImages = product.detailImages || [];

  const handleNextImage = () => setCurrentImageIdx((prev) => (prev + 1) % topImages.length);
  const handlePrevImage = () => setCurrentImageIdx((prev) => (prev - 1 + topImages.length) % topImages.length);

  const handleSelectColor = (e, color) => {
    e.stopPropagation();
    setSelectedColor(color);
    setOpenColorList(false);
    // D 함정: 색상 선택 후 드롭다운 전체 닫힘 → 사이즈 선택하려면 다시 열어야 함
    setShowMainDropdown(false);
  };

  const handleSelectSize = (e, size) => {
    e.stopPropagation(); 
    setSelectedSize(size);
    setOpenSizeList(false);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("-[필수] 색상과 사이즈를 모두 선택해주세요.");
      return;
    }
    const optionString = `색상: ${selectedColor} / 사이즈: ${selectedSize}`;
    addToCart(product, quantity, optionString);
    if(window.confirm("장바구니에 담겼습니다. 확인하시겠습니까?")) navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      alert("-[필수] 색상과 사이즈를 모두 선택해주세요.");
      return;
    }
    const optionString = `색상: ${selectedColor} / 사이즈: ${selectedSize}`;
    addToCart(product, quantity, optionString);
    navigate('/payment');
  };

  // ✨ [함정 로직] 클릭한 탭이 이미 열려있으면 닫고(null), 아니면 해당 탭만 열어줍니다. (다른 탭은 자동 닫힘)
  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
            <span onClick={() => navigate('/shop')} style={styles.navBackBtn}>←</span>
            <span style={styles.navTitle}>SWARM SELECT</span>
            <span onClick={() => navigate('/cart')} style={styles.navIcon}>🛍</span>
        </div>
      </nav>

      <div style={styles.wrapper}>
        <div style={styles.topSection}>
            <div style={styles.imgCol}>
                <div style={styles.imgWrapper}>
                    <img src={topImages[currentImageIdx]} alt="main_slide" style={styles.mainImg} />
                    {topImages.length > 1 && (
                        <>
                            <button style={{...styles.arrowBtn, left: '10px'}} onClick={handlePrevImage}>&lt;</button>
                            <button style={{...styles.arrowBtn, right: '10px'}} onClick={handleNextImage}>&gt;</button>
                            <div style={styles.indicatorContainer}>
                                {topImages.map((_, idx) => (
                                    <div key={idx} onClick={() => setCurrentImageIdx(idx)}
                                        style={{
                                            ...styles.indicatorDot,
                                            backgroundColor: currentImageIdx === idx ? '#1a1a1a' : '#ddd',
                                            transform: currentImageIdx === idx ? 'scale(1.2)' : 'scale(1)'
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div style={{...styles.infoCol, zIndex: showMainDropdown ? 2000 : 20}}>
                <div style={styles.headerGroup}>
                    <h2 style={styles.productTitle}>{product.name}</h2>
                    <div style={styles.iconGroup}><span style={styles.heartIcon}>♡</span></div>
                </div>
                <div style={styles.reviewRow}>
                    <span style={styles.stars}>★★★★★</span><span style={styles.reviewText}>97개 리뷰 보기</span>
                </div>
                <div style={styles.priceArea}>
                    <div style={styles.originalPrice}>₩{Math.floor(product.price * 1.52).toLocaleString()}</div>
                    <div style={styles.finalPriceRow}>
                        <span style={styles.discountRate}>52%</span>
                        <span style={styles.finalPrice}>₩{product.price.toLocaleString()}</span>
                        <button style={styles.couponBtn}>⬇ 쿠폰받기</button>
                    </div>
                </div>
                
                <div style={styles.infoTable}>
                    <div style={styles.tableRow}><span style={styles.th}>구매 적립금</span><div style={styles.td}>최대 {Math.floor(product.price * 0.015)}원 <span style={{color:'#0078ff'}}>(1.5%)</span></div></div>
                    <div style={styles.tableRow}><span style={styles.th}>배송정보</span><div style={styles.td}>3일 이내 배송 시작</div></div>
                    <div style={styles.tableRow}><span style={styles.th}>배송비</span><div style={styles.td}><strong>무료배송</strong></div></div>
                </div>

                <div style={styles.optionDropdownArea}>
                    <div style={styles.selectorTrigger} onClick={() => setShowMainDropdown(!showMainDropdown)}>
                        <span style={{fontWeight: 'bold', color: (selectedColor && selectedSize) ? '#1a1a1a' : '#888'}}>
                            {showMainDropdown 
                                ? '옵션을 선택해주세요' 
                                : (selectedColor && selectedSize ? `선택: ${selectedColor} / ${selectedSize}` : '옵션을 선택해주세요')}
                        </span>
                        <span style={{float:'right', transform: showMainDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s'}}>∨</span>
                    </div>
                    
                    {showMainDropdown && (
                        <div style={styles.dropdownContent}>
                            <div style={styles.customSelectGroup}>
                                <div style={styles.selectLabel}>색상</div>
                                <div style={styles.customSelectBox} 
                                     onClick={(e) => {
                                         e.stopPropagation(); 
                                         setOpenColorList(!openColorList); 
                                         setOpenSizeList(false);
                                     }}>
                                    <span style={{color: selectedColor ? '#000' : '#888'}}>
                                        {selectedColor || "-[필수] 색상 선택-"}
                                    </span>
                                    <span>▼</span>
                                </div>
                                {openColorList && (
                                    <ul style={styles.customOptionsList}>
                                        {colorOptions.map((color, idx) => (
                                            <li key={idx} style={styles.customOption} onClick={(e) => handleSelectColor(e, color)}>{color}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div style={styles.customSelectGroup}>
                                <div style={styles.selectLabel}>사이즈</div>
                                <div style={styles.customSelectBox} 
                                     onClick={(e) => {
                                         e.stopPropagation(); 
                                         setOpenSizeList(!openSizeList); 
                                         setOpenColorList(false);
                                     }}>
                                    <span style={{color: selectedSize ? '#000' : '#888'}}>
                                        {selectedSize || "-[필수] 사이즈 선택-"}
                                    </span>
                                    <span>▼</span>
                                </div>
                                {openSizeList && (
                                    <ul style={styles.customOptionsList}>
                                        {sizeOptions.map((size, idx) => (
                                            <li key={idx} style={styles.customOption} onClick={(e) => handleSelectSize(e, size)}>{size}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div style={styles.fixedActionArea}>
                    <div style={styles.quantityRow}>
                        <div style={styles.counter}>
                            <button style={styles.countBtn} onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
                            <span style={styles.countNum}>{quantity}</span>
                            <button style={styles.countBtn} onClick={() => setQuantity(q => q+1)}>+</button>
                        </div>
                        <span style={styles.optionPrice}>₩{(product.price * quantity).toLocaleString()}</span>
                    </div>
                    <div style={styles.totalRow}>
                        <span>총 상품금액</span>
                        <span style={styles.totalPrice}>₩{(product.price * quantity).toLocaleString()}</span>
                    </div>
                    <div style={styles.btnGroup}>
                        <button style={styles.cartBtn} onClick={handleAddToCart}>장바구니</button>
                        <button style={styles.buyBtn} onClick={handleBuyNow}>바로구매</button>
                    </div>
                </div>
            </div>
        </div>

        {/* ✨ [함정 UI] 숨바꼭질 아코디언 피로도 존 */}
        <div style={styles.detailSection}>
            <h3 style={{fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #1a1a1a', paddingBottom: '15px', marginBottom: '20px'}}>
                상품 상세 정보
            </h3>

            {/* 1. 상품 상세 이미지 아코디언 */}
            <div style={styles.accordionWrapper}>
                <div style={styles.accordionHeader} onClick={() => toggleAccordion('images')}>
                    <span>[+] 상품 상세 이미지 보기</span>
                    <span>{activeAccordion === 'images' ? '▲' : '▼'}</span>
                </div>
                {activeAccordion === 'images' && (
                    <div style={styles.accordionContent}>
                        {detailImages.length > 0 ? (
                            detailImages.map((img, idx) => (
                                <img key={idx} src={img} style={styles.detailImgFull} alt={`detail_${idx}`} />
                            ))
                        ) : (
                            <img src={product.img} style={styles.detailImgFull} alt="default_detail" />
                        )}
                    </div>
                )}
            </div>

            {/* 2. 사이즈 표 아코디언 */}
            <div style={styles.accordionWrapper}>
                <div style={styles.accordionHeader} onClick={() => toggleAccordion('size')}>
                    <span>[+] 실측 사이즈 표 확인하기</span>
                    <span>{activeAccordion === 'size' ? '▲' : '▼'}</span>
                </div>
                {activeAccordion === 'size' && (
                    <div style={styles.accordionContent}>
                        <table style={styles.detailTable}>
                            <tbody>
                                <tr><th style={styles.detailTh}>사이즈</th><th style={styles.detailTh}>총장</th><th style={styles.detailTh}>어깨너비</th><th style={styles.detailTh}>가슴단면</th><th style={styles.detailTh}>소매길이</th></tr>
                                <tr><td style={styles.detailTd}>S</td><td style={styles.detailTd}>68</td><td style={styles.detailTd}>45</td><td style={styles.detailTd}>52</td><td style={styles.detailTd}>60</td></tr>
                                <tr><td style={styles.detailTd}>M</td><td style={styles.detailTd}>70</td><td style={styles.detailTd}>47</td><td style={styles.detailTd}>54</td><td style={styles.detailTd}>61</td></tr>
                                <tr><td style={styles.detailTd}>L</td><td style={styles.detailTd}>72</td><td style={styles.detailTd}>49</td><td style={styles.detailTd}>56</td><td style={styles.detailTd}>62</td></tr>
                                <tr><td style={styles.detailTd}>XL</td><td style={styles.detailTd}>74</td><td style={styles.detailTd}>51</td><td style={styles.detailTd}>58</td><td style={styles.detailTd}>63</td></tr>
                            </tbody>
                        </table>
                        <p style={{fontSize:'12px', color:'#888', marginTop:'10px'}}>* 사이즈는 측정 방법에 따라 1~3cm 오차가 있을 수 있습니다.</p>
                    </div>
                )}
            </div>

            {/* 3. 소재 및 혼용률 아코디언 */}
            <div style={styles.accordionWrapper}>
                <div style={styles.accordionHeader} onClick={() => toggleAccordion('material')}>
                    <span>[+] 혼용률 및 세탁 방법</span>
                    <span>{activeAccordion === 'material' ? '▲' : '▼'}</span>
                </div>
                {activeAccordion === 'material' && (
                    <div style={styles.accordionContent}>
                        <table style={styles.detailTable}>
                            <tbody>
                                <tr><th style={styles.detailTh}>제품 소재</th><td style={styles.detailTd}>WOOL 100%</td></tr>
                                <tr><th style={styles.detailTh}>세탁방법</th><td style={styles.detailTd}>드라이클리닝 권장 / 기계 건조기 사용 금지</td></tr>
                                <tr><th style={styles.detailTh}>제조국</th><td style={styles.detailTd}>대한민국</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 4. 배송 및 환불 규정 아코디언 */}
            <div style={styles.accordionWrapper}>
                <div style={styles.accordionHeader} onClick={() => toggleAccordion('policy')}>
                    <span>[+] 배송 및 환불 규정</span>
                    <span>{activeAccordion === 'policy' ? '▲' : '▼'}</span>
                </div>
                {activeAccordion === 'policy' && (
                    <div style={styles.accordionContent}>
                        <p style={{fontSize:'13px', lineHeight:'1.8', color:'#555'}}>
                            - 배송은 영업일 기준 3~5일 소요됩니다.<br/>
                            - 상품 수령 후 7일 이내에 교환/반품 접수가 가능합니다.<br/>
                            - 단순 변심에 의한 반품 시 왕복 배송비 6,000원은 고객님 부담입니다.<br/>
                            - 상품 택(Tag) 제거 또는 훼손 시 교환/환불이 불가합니다.
                        </p>
                    </div>
                )}
            </div>

            {/* 5. 판매자 정보 아코디언 */}
            <div style={styles.accordionWrapper}>
                <div style={styles.accordionHeader} onClick={() => toggleAccordion('seller')}>
                    <span>[+] 판매자 및 A/S 정보</span>
                    <span>{activeAccordion === 'seller' ? '▲' : '▼'}</span>
                </div>
                {activeAccordion === 'seller' && (
                    <div style={styles.accordionContent}>
                        <table style={styles.detailTable}>
                            <tbody>
                                <tr><th style={styles.detailTh}>상호명</th><td style={styles.detailTd}>(주)SWARM</td></tr>
                                <tr><th style={styles.detailTh}>사업자등록번호</th><td style={styles.detailTd}>123-45-67890</td></tr>
                                <tr><th style={styles.detailTh}>A/S 책임자</th><td style={styles.detailTd}>SWARM 고객센터 1588-0000</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
      </div>

      {showMainDropdown && <div style={styles.transparentOverlay} onClick={() => setShowMainDropdown(false)}></div>}
    </div>
  );
};

const styles = {
  // 기존 스타일 유지
  container: { backgroundColor: 'white', minHeight: '100vh', fontFamily: '"Pretendard", sans-serif', color: '#1a1a1a' },
  nav: { borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, background: 'white', zIndex: 50 },
  navInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', padding: '0 20px' },
  navTitle: { fontWeight: '800', fontSize: '18px', letterSpacing: '1px' },
  navBackBtn: { fontSize: '24px', cursor: 'pointer' },
  navIcon: { fontSize: '20px', cursor: 'pointer' },
  wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' },

  topSection: { display: 'flex', gap: '50px', flexWrap: 'wrap', marginBottom: '80px', alignItems: 'flex-start' },
  imgCol: { flex: '1 1 450px', maxWidth: '550px' },
  imgWrapper: { position: 'relative', width: '100%', paddingBottom: '100%', backgroundColor:'#f4f4f4', overflow:'hidden', borderRadius:'4px' },
  mainImg: { position: 'absolute', top:0, left:0, width: '100%', height: '100%', objectFit: 'cover' },
  arrowBtn: { position:'absolute', top:'50%', transform:'translateY(-50%)', width:'40px', height:'40px', borderRadius:'50%', background:'rgba(255,255,255,0.8)', border:'none', cursor:'pointer', fontSize:'20px', color:'#333', zIndex: 10 },
  indicatorContainer: { position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 },
  indicatorDot: { width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.3s' },

  infoCol: { flex: '1 1 400px', maxWidth: '500px', position: 'sticky', top: '80px' },
  headerGroup: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' },
  productTitle: { fontSize: '24px', fontWeight: '400', margin: 0, lineHeight: '1.4', color: '#888' },
  iconGroup: { display:'flex', gap:'15px' },
  heartIcon: { fontSize:'24px', cursor:'pointer', color:'#bbb' },
  reviewRow: { fontSize: '13px', display:'flex', alignItems:'center', gap:'8px', marginBottom:'30px', color:'#333' },
  stars: { fontSize:'14px' },
  reviewText: { textDecoration:'underline', cursor:'pointer', color:'#666' },
  priceArea: { paddingBottom:'30px', borderBottom:'1px solid #eee', marginBottom:'25px' },
  originalPrice: { textDecoration: 'line-through', color: '#aaa', fontSize: '16px', marginBottom: '5px' },
  finalPriceRow: { display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' },
  discountRate: { fontSize: '28px', fontWeight: 'bold', color: '#ff4800' },
  finalPrice: { fontSize: '28px', fontWeight: 'bold', color: '#000' },
  couponBtn: { marginLeft:'auto', padding:'5px 12px', fontSize:'11px', backgroundColor:'black', color:'white', border:'none', cursor:'pointer' },
  infoTable: { display:'flex', flexDirection:'column', gap:'15px', marginBottom:'40px' },
  tableRow: { display:'flex', fontSize:'13px', lineHeight:'1.6' },
  th: { width:'90px', color:'#555', fontWeight:'bold', flexShrink:0 },
  td: { color:'#333', flex:1 },

  optionDropdownArea: { position: 'relative', marginBottom: '20px', zIndex: 1000 },
  selectorTrigger: { border:'1px solid #ddd', padding:'15px', cursor:'pointer', display:'flex', justifyContent:'space-between', color:'#333', fontSize:'14px', backgroundColor: 'white' },
  dropdownContent: { position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', border: '1px solid #ddd', borderTop: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', padding: '20px', boxSizing: 'border-box', zIndex: 2000 },
  
  customSelectGroup: { marginBottom: '15px', position: 'relative' },
  selectLabel: { fontSize: '13px', color: '#666', marginBottom: '5px', fontWeight: 'bold' },
  customSelectBox: { width: '100%', padding: '12px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
  customOptionsList: { position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', border: '1px solid #ddd', borderTop: 'none', maxHeight: '150px', overflowY: 'auto', zIndex: 3000, listStyle: 'none', margin: 0, padding: 0 },
  customOption: { padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f1f1', fontSize: '14px', transition: 'background 0.2s' },

  fixedActionArea: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px', position: 'relative', zIndex: 1 },
  quantityRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', padding:'15px', backgroundColor:'#f9f9f9' },
  counter: { display:'flex', border:'1px solid #ddd', background:'white' },
  countBtn: { background:'none', border:'none', width:'18px', height:'18px', cursor:'pointer', fontSize:'10px', color:'#bbb', outline:'none', padding:0 },
  countNum: { display:'flex', alignItems:'center', padding:'0 10px', fontSize:'14px', fontWeight:'bold' },
  optionPrice: { fontWeight:'bold', fontSize:'16px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' },
  totalPrice: { color: '#ff4800', fontSize: '22px' },
  btnGroup: { display: 'flex', gap: '8px' },
  cartBtn: { flex: 1, padding: '18px', background: 'white', border: '1px solid #ddd', color: '#ccc', fontWeight: 'normal', cursor: 'pointer', fontSize:'13px', outline:'none' },
  buyBtn: { flex: 1, padding: '18px', background: '#1a1a1a', border: '1px solid #1a1a1a', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize:'15px', outline:'none' },
  transparentOverlay: { position:'fixed', top:0, left:0, right:0, bottom:0, zIndex: 999, cursor:'default' },

  detailSection: { borderTop:'2px solid #1a1a1a', paddingTop:'40px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' },
  
  // ✨ [함정 스타일] 아코디언 스타일 추가
  accordionWrapper: { borderBottom: '1px solid #e1e1e1', marginBottom: '5px' },
  accordionHeader: { display: 'flex', justifyContent: 'space-between', padding: '18px 10px', backgroundColor: '#f9f9f9', cursor: 'pointer', fontSize: '12px', fontWeight: 'normal', color: '#aaa', transition: 'background 0.2s', outline: 'none' },
  accordionContent: { padding: '20px 10px', backgroundColor: 'white', animation: 'fadeIn 0.3s ease-in-out' },

  detailTable: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#555', textAlign: 'center' },
  detailTh: { backgroundColor: '#f9f9f9', padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#333' },
  detailTd: { padding: '12px', borderBottom: '1px solid #eee' },
  detailImgFull: { width: '100%', height: 'auto', display: 'block', marginBottom: '0px' },
};

export default ProductDetailPage;