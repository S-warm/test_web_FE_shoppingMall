// src/pages/ShopPage.js
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

export const products = [
  // --- TOP (상의) ---
  { id: 1, 
    name: "strength pigment long sleeve ", 
    price: 39000, 
    category: "TOP", 
    img: "https://the-otherside.co.kr/web/product/big/202509/8ebeb67ee79e05e71d729eaba49c08c4.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250911/strength-pigment-long-sleeve-BLACK.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250911/strength-pigment-long-sleeve-GRAY.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/KakaoTalk_20250909_142541845_18.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/KakaoTalk_20250909_142541845_19.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/KakaoTalk_20250909_142541845_01.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/3.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250909/4.jpg"
         
    ]
   },
   

  { id: 2, 
    name: "5668 bony wool crop round knit", 
    price: 41000, category: "TOP", 
    img: "https://the-otherside.co.kr/web/product/big/202511/5d288e7fa533f8dbb7044ad330865763.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/copy-1762498641-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251201/EAB7B8EBA088EC9DB4.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251201/EB84A4EC9DB4EBB984.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251201/EB8D94EC8AA4ED8BB0EBB894EBA3A8.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251201/EBAAA8ECB9B4.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251201/EC9584EC9DB4EBB3B4EBA6AC.jpg" ]
  },

  { id: 3, 
    name: "cashmere like round knit", 
    price: 42000, 
    category: "TOP", 
    img: "https://the-otherside.co.kr/web/product/small/202412/a147d3df7374ad0b3b90fe13fa8d694f.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20241224/%EC%BA%90%EC%8B%9C%EB%AF%B8%EC%96%B4-%EA%B7%B8%EB%A0%88%EC%9D%B4_shop1_152855.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20241224/%EC%BA%90%EC%8B%9C%EB%AF%B8%EC%96%B4-%EA%B7%B8%EB%A0%88%EC%9D%B42_shop1_152855.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20241224/%EC%BA%90%EC%8B%9C%EB%AF%B8%EC%96%B4-%EC%B9%B4%ED%82%A42_shop1_152855.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241219/%EC%BA%90%EC%8B%9C%EB%AF%B8%EC%96%B4-%EB%84%A4%EC%9D%B4%EB%B9%84_shop1_175905.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20241219/%EC%BA%90%EC%8B%9C%EB%AF%B8%EC%96%B4-%EB%A0%88%EB%93%9C_shop1_175905.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241212/1.jpg"  ]
   },

  { id: 4, 
    name: "Coel henly neck round knit", 
    price: 36000, 
    category: "TOP", 
    img: "https://the-otherside.co.kr/web/product/small/202509/fc1be70f870f3d718cea72965eff194d.jpg", 
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250919/copy-1758264363-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251015/EB84A4EC9DB4EBB984.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251015/EBB894EB9E99.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251015/ECB1A0ECBD9C.jpg", ]},

  { id: 5, name: "Aran heavy henley cable knit ", price: 42000, category: "TOP", 
    img: "https://the-otherside.co.kr/web/product/big/202512/f08cee894dd4b03d5a1015c7c3c727fd.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251230/copy-1767063606-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251230/KakaoTalk_20251230_124629340_05.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251230/KakaoTalk_20251230_124629340_01.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251230/KakaoTalk_20251230_124621725_06.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251230/KakaoTalk_20251230_124621725_16.jpg" ]
   },

  { id: 6, name: "neo Iceland nordic brush knit ", price: 36000, category: "TOP", img: "https://the-otherside.co.kr/web/product/big/202511/368e0569861c87ff5d7f2a0eb00fff87.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251125/copy-1764048305-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251201/EB84A4EC98A4-EB84A4EC9DB4EBB984.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251201/EB84A4EC98A4-EBB2A0EC9DB4ECA780.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251125/copy-1764048305-4.jpg"   ]
   },

  { id: 7, name: "Wave border brush knit", price: 54000, category: "TOP", img: "https://the-otherside.co.kr/web/product/small/202601/52014da929db3912d906d159a9eeeedb.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260106/0.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260121/EC9BA8EC9DB4EBB88C-EBB3B4EB8D94-3ED8FBC.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260115/EC9BA8EC9DB4EBB88CEBB3B4EB8D94-EBA088EB939C-EC8381EC9D98.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260115/EC9BA8EC9DB4EBB88CEBB3B4EB8D94-EBB894EBA3A8-EC8381EC9D98.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260121/EC9BA8EC9DB4EBB88C-EBB3B4EB8D94-EB84A4EC9DB4EBB984-EC8381EC9D98ED8FBC.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260121/EC9BA8EC9DB4EBB88C-EBB3B4EB8D94-EBB284EAB1B4EB9494-EC8381EC9D98ED8FBC.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260121/EC9BA8EC9DB4EBB88C-EBB3B4EB8D94-EBB88CEB9DBCEC9AB4-EC8381EC9D98ED8FBC.jpg"   ]
   },

  { id: 8, name: " alaska half polo neck knit", price: 37000, category: "TOP", img: "https://the-otherside.co.kr/web/product/big/202412/b6b4b7da977178af3624cd4a15ed9b2d.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20241205/copy-1733382819-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241206/copy-1733476500-KakaoTalk_20241204_144658758_07.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241209/%EC%95%8C%EB%A0%88%EC%8A%A4%EC%B9%B4_shop1_174532.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241206/copy-1733476521-KakaoTalk_20241206_163629514_10.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241209/KakaoTalk_20241209_155612515_13_shop1_173017.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241219/KakaoTalk_20241219_164430754_03.jpg"  ]
   },

  // --- OUTER (아우터) ---
  { id: 9, name: "plain heritage nordic cardigan", price: 36000, category: "OUTWEAR", 
    img: "https://the-otherside.co.kr/web/product/big/202601/8ba4ac5f680ccb5c2b2eff68da355146.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251230/1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260114/EBB88CEB9DBCEC9AB4.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260114/EC98A4ED8AB8EBB080.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260116/ECB0A8ECBD9C.jpg"] },

  { id: 10, name: "uni city padding jumper", price: 69000, category: "OUTWEAR", 
    img: "https://the-otherside.co.kr/web/product/big/202510/827c2ea638cd706c7b8b1fce82eacd47.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/EC8B9CED8BB0-EBB894EB9E99-EC8381ED9598EC9D98.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251107/EC8B9CED8BB0-ECB0A8ECBD9C-EC8381ED9598EC9D98.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251209/7-1.jpg"] },

  { id: 11, name: "Stripe brush semi crop cardigan ", price: 42000, category: "OUTWEAR",
    img: "https://the-otherside.co.kr/web/product/big/202511/872e2e452b68283d1740761caefbbab6.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/copy-1762497261-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251107/KakaoTalk_20251106_174918464_06.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251107/KakaoTalk_20251106_174929030_13.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251107/copy-1762497261-2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251107/copy-1762497261-10.jpg" ] },

  { id: 12, name: "LAB 2-way hoodie padding", price: 54000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202512/bfde67d37be2c6a8c20213fa76de525e.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20241108/EB9EA9-ED8CA8EB94A9-EBB894EB9E99-EC9E91EC9785-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251030/8EC9584EC9AB0ED84B0.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251030/2EC8381EC9D98.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231025/EC8A98ED8DBCEBA788ECBC93-ED9B84EB939C-ED8CA8EB94A9.jpg"] },

  { id: 13, name: "blanc crop work jacket ", price: 119000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202411/fe84c405c62a5014347a6203b283ef5c.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251230/copy-1730273618-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241104/EBB894EB9E91-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241104/EBB894EB9E91-2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251230/copy-1767077377-blanc-crop-work-jacket.jpg"]
   },

  { id: 14, name: "steady balmacaan coat", price: 129000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202312/4b188ceecb4299c358e6e9370341062a.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251030/5EC9584EC9AB0ED84B0.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231205/KakaoTalk_20231205_114200444_08.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231205/KakaoTalk_20231205_114133431_29.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231205/KakaoTalk_20231205_114228091_03.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231205/KakaoTalk_20231205_114102840_18.jpg"]
   },
   { id: 15, name: "light down quilted jumper", price: 39000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202512/48cf9ca5a23a9815ea8b48ca7dff74cc.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251107/3ED8FBC.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241203/EB9DBCEB8BA4ED80BCECA090-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241203/EB9DBCEB8BA4ED80BCECA090-2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241203/EB9DBCEB8BA4ED80BCECA090-3.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251028/EC8381EC9D98-28EB85B8EBB88CED9B84EB949429.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20241115/copy-1731664883-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20241115/37.jpg"]
   },
   { id: 16, name: "Seraph light down padding", price: 119000, category: "OUTWEAR", img: "https://the-otherside.co.kr/web/product/big/202512/b18d6d738a88210be48366a771b9e4ae.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251219/copy-1766120286-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251219/KakaoTalk_20251218_171955272_16.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251219/copy-1766136102-KakaoTalk_20251218_172001967_27.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251219/KakaoTalk_20251218_172009856_14.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251219/KakaoTalk_20251218_172009856_24.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251219/copy-1766120286-2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251219/copy-1766120286-3.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20251219/copy-1766120286-4.jpg"]
   },

  // --- BOTTOM (하의) ---
  { id: 17, name: "[004] two-tuck wide denim (black)", price: 56000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202409/ce0b729183a8f149be2b8cafa79224c8.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251114/copy-1763113610-004-9ED8FBC-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20230913/1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231208/004-EC8381EC84B8.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250311/004-ECB0A9EC9EA510.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250311/004-ECB0A9EC9EA511.jpg"]
   },

  { id: 18, name: "[003] two-tuck wide denim (light gray)", price: 58000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202410/f07f511ed0688ed276efdfe807e28adb.jpg", detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20231219/003-EBA994EC9DB8.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20230320/1.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20250611/003-ECB0A9EC9EA59.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250929/5B0035D-two-tuck-wide-denim-3ED8FBC-1-3.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250929/5B0035D-two-tuck-wide-denim-3ED8FBC-2.jpg"]
   },

  { id: 19, name: "pleat balloon string sweat pants", price: 34000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202601/0d991deffc195b6d161493a09474570d.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767940992-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260112/0-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260112/copy-1768209466-5.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260112/copy-1768209466-15.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260112/KakaoTalk_20260109_164448981_17.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260112/copy-1768209466-KakaoTalk_20260109_164448981_27.jpg"]
   },

  { id: 20, name: "Non-fade dart balloon denim", price: 54000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202601/a4d3691e706f1ccf9654b326ffdded4c.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767939563-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260109/KakaoTalk_20260109_124422718_29.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260109/KakaoTalk_20260109_124422718_04.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260109/KakaoTalk_20260109_124430549_03.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767939563-2.jpg"]
   },
  { id: 21, name: "Yuki curved dyeing cargo pants", price: 42000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202601/c60f4f8c72c748a09cba71b0466b22ea.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767937757-1.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767949503-KakaoTalk_20260109_124446026_08.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260109/KakaoTalk_20260109_124454321_08.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767937757-3.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767937758-14.jpg"]
   },

  { id: 22, name: "wonted pocket cargo pants", price: 51000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202509/d957beb3be132d3bce76df03945ca521.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250219/copy-1739948300-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250917/EB9DBCEC9DB8-EC9BA8EC8AA4ED84B0.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250924/copy-1758695875-mountain-herringbone-cotton-jacket-BLACK.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250912/KakaoTalk_20250912_145732553_04.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250314/copy-1741956784-1.jpg"]
   },
   
   { id: 23, name: "Cloud soft fleece pants", price: 49000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202511/eab61b1afd26c2ad95f2e526416688d4.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251113/copy-1763016712-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251114/KakaoTalk_20251114_123219414_23.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251114/KakaoTalk_20251114_123159885_20.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251114/KakaoTalk_20251111_164820901_04.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251113/copy-1763016712-4.jpg"]
   },
   { id: 24, name: "wide straight washed denim ", price: 36000, category: "BOTTOM", img: "https://the-otherside.co.kr/web/product/big/202502/b08d0e8d4ad8deaefd4f16071188755c.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20250911/wide-straight-washed-denim.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250911/ECA09CEB8488EB9FB4-EC8594ECB8A0.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250911/EBA6BD-ED97A8EBA6ACEB84A5.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20250911/EBA19CEB9DBCEBB680ED81B4.jpg"]
   },

  // --- ACC ---
  { id: 25, name: "Italy leather belt ", price: 29000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202601/deaaf3cb1d15a616ae297d0f7c872082.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767942236-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260115/copy-1768470514-KakaoTalk_20260109_124422718_25.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260115/KakaoTalk_20260109_124430549_07.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260115/KakaoTalk_20260109_124508092_15.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260115/copy-1768470840-KakaoTalk_20260109_124446026_19.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767942236-2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767942236-3.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260109/copy-1767942236-4.jpg"]
   },

  { id: 26, name: "Chester leather cross bag ", price: 45000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202512/b88f3e10328b8a11edaa22b0cfb21098.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20251126/1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251216/KakaoTalk_20251124_161931261_17.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251216/KakaoTalk_20251124_161931261_18.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251216/KakaoTalk_20251124_161931261_20.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251216/KakaoTalk_20251124_161941812_03.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251126/2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251126/3.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251126/4.jpg"] },

  { id: 27, name: "every wool muffler ", price: 59000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202311/94ef4b708acad6a3058b29a47ecea3f9.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20240110/EC9584EC9DB4ED859C-ECB694ECB29C-13.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20251226/2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231229/KakaoTalk_20231229_144505912_11.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231229/KakaoTalk_20231226_174811260_15.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231207/copy-1701918279-2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20231207/KakaoTalk_20231207_111100938_032028129.jpg"]
   },
   { id: 28, name: "rustle double bag", price: 25000, category: "ACC", img: "https://the-otherside.co.kr/web/product/big/202108/5831e168a5abd335e448a6ae022546e6.jpg",
    detailImages: ["https://contents.sixshop.com/thumbnails/uploadedFiles/73125/product/image_1618295139576_1000.jpg","https://contents.sixshop.com/thumbnails/uploadedFiles/73125/product/image_1618295140051_1000.jpg","https://contents.sixshop.com/thumbnails/uploadedFiles/73125/product/image_1618295140709_1000.jpg","https://contents.sixshop.com/thumbnails/uploadedFiles/73125/product/image_1618295142799_1000.jpg","https://contents.sixshop.com/thumbnails/uploadedFiles/73125/product/image_1618917753037_1000.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20230519/copy-1684488369-2.jpg"]
    },

  // --- NEW ---
  { id: 35, name: "More nordic knit zip-up ", price: 68400, category: "NEW", img: "https://the-otherside.co.kr/web/product/big/202601/552fa489f01a4fb1943e1b8fcfa52570.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260123/copy-1769151188-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171236506_04.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171236506_12.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171236506_13.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171236506_17.jpg"]
   },
  { id: 36, name: "double pocket collar cardigan ", price: 51300, category: "NEW", img: "https://the-otherside.co.kr/web/product/small/202601/72b865f1308d861c9870aa18623ae793.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769062459-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171717626_11.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171724486_05.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171251048_25.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769062460-2.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769062459-3.jpg", "https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769062460-4.jpg"]
   },
  { id: 37, name: "wool hairy stripe cardigan ", price: 48500, category: "NEW", img: "https://the-otherside.co.kr/web/product/big/202601/f0008d5aaa544cf424fda3e390ecf207.jpg",
    detailImages: ["https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769060246-1.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171236506_25.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171243890_06.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171243890_10.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260123/KakaoTalk_20260122_171243890_15.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769060246-2.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260122/copy-1769060246-3.jpg","https://the-otherside.co.kr/web/upload/NNEditor/20260122/9.jpg"      ]
   },
];

const banners = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
];

// ✨ [함정 추가 1] 팝업창 데이터 세팅 (우측으로 살짝씩 밀리면서 쫘르르 배치)
const popupAdData = [
  { id: 1, title: '🔥 특가 세일 최대 80%', bg: '#ff4757', top: '15%', left: '50%', zIndex: 2001 },
  { id: 2, title: '🎁 신규 가입 1만원 쿠폰', bg: '#1e90ff', top: '20%', left: '55%', zIndex: 2002 },
  { id: 3, title: '🚚 오늘 하루 전상품 무료배송!', bg: '#2ed573', top: '25%', left: '60%', zIndex: 2003 },
  { id: 4, title: '⚡ 타임세일 마감 1시간 전!', bg: '#ffa502', top: '30%', left: '65%', zIndex: 2004 },
  { id: 5, title: '🎉 카톡 플친 추가시 5천원', bg: '#ff6b81', top: '35%', left: '70%', zIndex: 2005 }
];

const ShopPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const [currentCategory, setCurrentCategory] = useState("BEST 20");
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [myPageOpen, setMyPageOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('화이트');
  const [selectedSize, setSelectedSize] = useState('Free');

  // [함정 추가 2] 팝업창 상태 관리 (localStorage에 저장 안 된 애들만 띄움)
  const [visiblePopups, setVisiblePopups] = useState(() => {
    return popupAdData
      .filter(p => !localStorage.getItem(`hide_popup_${p.id}`))
      .map(p => p.id);
  });

  // 팝업 닫기 함수 (X 버튼 누르면 사라지지만, 다시 오면 또 뜸)
  const handleClosePopup = (id) => {
    setVisiblePopups(prev => prev.filter(popupId => popupId !== id));
  };

  // 다신 보지 않기 함수 (이걸 눌러야만 진짜 영원히 안 뜸)
  const handleNeverShowPopup = (id) => {
    localStorage.setItem(`hide_popup_${id}`, 'true');
    handleClosePopup(id);
  };

const bestProducts = useMemo(() => {
    // products 배열을 복사한 뒤 랜덤하게 섞고 앞에서 20개를 자릅니다.
    return [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때 딱 한 번만 실행됨

  // ✨ 로그아웃 기능 (수정됨: 닫는 괄호 추가완료!)
  const handleLogout = () => {
    const isConfirm = window.confirm("정말 로그아웃 하시겠습니까?");
    if (isConfirm) {
        logout(); 
        alert("로그아웃 되었습니다.");
        navigate('/login'); 
    }
  }; // 👈 아까 이 부분 중괄호와 세미콜론이 빠졌었습니다.

  // ✨ 자동 슬라이드
  useEffect(() => {
    const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

 // ✨ [수정 완] 검색어(searchQuery)를 실시간으로 감지해서 필터링하는 로직
  const filteredProducts = useMemo(() => {
    // 1. 검색창에 글자가 한 글자라도 있으면? -> 무조건 상품 이름으로 검색
    if (searchQuery.trim() !== "") {
      return products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // 2. 검색창이 비어있으면? -> 기존처럼 카테고리별로 보여줌
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
      {/* ✨ [함정 추가 3] 화면 진입 시 우측-중앙에 쫘르르 뜨는 팝업창 렌더링 */}
      {popupAdData.map(popup => {
        if (!visiblePopups.includes(popup.id)) return null;
        return (
          <div key={popup.id} style={{
            position: 'fixed', top: popup.top, left: popup.left, zIndex: popup.zIndex,
            width: '280px', height: '350px', backgroundColor: 'white',
            border: '2px solid #333', boxShadow: '5px 5px 15px rgba(0,0,0,0.3)',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* 팝업 내용 영역 */}
            <div style={{ flex: 1, backgroundColor: popup.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
              <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>{popup.title}</h2>
            </div>
            
            {/* 팝업 하단 컨트롤 바 (우측 하단 X 버튼, 좌측 하단 보호색 '다신보지않기') */}
            <div style={{ height: '40px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
              <span 
                onClick={() => handleNeverShowPopup(popup.id)}
                style={{ fontSize: '11px', color: '#f0f0f0', cursor: 'pointer', userSelect: 'none' }}
              >
                다신 보지 않기
              </span>
              <span 
                onClick={() => handleClosePopup(popup.id)}
                style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', cursor: 'pointer', userSelect: 'none' }}
              >
                ✕
              </span>
            </div>
          </div>
        );
      })}
      {/* 1. 헤더 */}
      <header style={styles.header}>
        <div style={styles.logoGroup} onClick={() => setCurrentCategory("ALL")}>
            <h1 style={styles.logo}>Swarm</h1>
        </div>
        <div style={styles.headerRight}>
          {/* 검색창 UI */}
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #333', marginRight: '15px' }}>
            <input 
              type="text" 
              placeholder="상품 검색" 
              style={{ border: 'none', outline: 'none', width: '120px', padding: '5px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={{ cursor: 'pointer' }}>🔍</span>
          </div>

          <span onClick={() => navigate('/cart')} style={styles.iconLink}>🛍 CART</span>
          <span onClick={() => setMyPageOpen(true)} style={styles.iconLink}>
            👤 {user.name ? `${user.name}님` : 'MYPAGE'}
          </span>
        </div>
      </header>

      {/* 2. 네비게이션 */}
      <nav style={styles.navBar}>
        {["BEST 20", "TOP", "OUTWEAR", "BOTTOM", "ACC", "NEW"].map((cat) => (
            <span 
                key={cat} 
                style={{
                    ...styles.navItem, 
                    color: currentCategory === cat ? 'black' : '#888',
                    borderBottom: currentCategory === cat ? '2px solid black' : 'none'
                }}
                onClick={() => setCurrentCategory(cat)}
            >
                {cat}
            </span>
        ))}
      </nav>

      {/* 3. 슬라이더 */}
      <div style={styles.sliderContainer}>
        <div style={{...styles.sliderTrack, transform: `translateX(-${currentSlide * 100}%)`}}>
            {banners.map((img, index) => (
                <div key={index} style={styles.slide}>
                    <img src={img} alt="banner" style={styles.bannerImg} />
                    <div style={styles.bannerOverlay}>
                        <h2>2026 S/S NEW COLLECTION</h2>
                        <p>Swarm만의 감성을 만나보세요</p>
                    </div>
                </div>
            ))}
        </div>
        <div style={styles.indicatorBox}>
            {banners.map((_, idx) => (
                <div 
                    key={idx} 
                    style={{
                        ...styles.indicator, 
                        background: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.5)'
                    }} 
                />
            ))}
        </div>
      </div>

      {/* 4. 상품 리스트 */}
      <div style={styles.titleSection}>
        <h2 style={styles.mainTitle}>
            {currentCategory}
        </h2>
        <div style={styles.titleLine}></div>
      </div>

      <div style={styles.gridContainer}>
        {/* ✨ 괄호 하나로 깔끔하게 수정 완료 + 수종님표 깡통 화면 적용 */}
        {filteredProducts.length === 0 ? (
          <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '150px 0', 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#888' 
          }}>
            해당 상품이 없습니다.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} style={styles.productCard} onClick={() => navigate(`/product/${product.id}`)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div style={styles.imageWrapper}>
                <img src={product.img} alt={product.name} style={{...styles.productImage, opacity: 1, 
                      transition: 'opacity 0.2s ease-in-out'}} />
              </div>
              <div style={styles.productName}>{product.name}</div>
              
              <div style={styles.priceRow}>
                  <button style={styles.cartIconBtn} onClick={(e) => openOptionModal(e, product)}>🛒</button>
                  <span style={styles.price}>₩{product.price.toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 옵션 모달 */}
      {modalOpen && selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
                <h3 style={{margin:0}}>옵션 선택</h3>
                <span onClick={() => setModalOpen(false)} style={styles.closeX}>×</span>
            </div>
            <p style={styles.modalTitle}>{selectedProduct.name}</p>
            <div style={styles.optionRow}>
              <label>색상</label>
              <select style={styles.select} value={selectedColor} onChange={(e)=>setSelectedColor(e.target.value)}>
                <option>화이트</option><option>블랙</option><option>네이비</option>
              </select>
            </div>
            <div style={styles.optionRow}>
              <label>사이즈</label>
              <select style={styles.select} value={selectedSize} onChange={(e)=>setSelectedSize(e.target.value)}>
                <option>Free</option><option>S</option><option>M</option><option>L</option>
              </select>
            </div>
            <div style={styles.modalBtnGroup}>
              <button style={styles.cartBtn} onClick={handleConfirmCart}>장바구니</button>
              <button style={styles.buyBtn} onClick={handleBuyNow}>바로 구매</button>
            </div>
          </div>
        </div>
      )}

      {/* ✨ 마이페이지 모달 (로그아웃 버튼 추가됨) */}
      {myPageOpen && (
        <div style={styles.centerModalOverlay} onClick={() => setMyPageOpen(false)}>
          <div style={styles.centerModalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.mpTitle}>MY PAGE</h2>
            
            <div style={styles.infoRow}>
                <span style={styles.label}>아이디</span>
                <span>{user.username || '-'}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.label}>이름</span>
                <span>{user.name || '게스트'}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.label}>연락처</span>
                <span>{user.phone || '-'}</span>
            </div>
            
            <div style={{marginTop:'30px', display:'flex', gap:'10px'}}>
                <button style={styles.closeBtn} onClick={() => setMyPageOpen(false)}>닫기</button>
                {/* ✨ 로그아웃 버튼 연결 */}
                <button style={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  // 1. 전체 컨테이너
  container: { 
    backgroundColor: 'white', 
    minHeight: '100vh', 
    paddingBottom: '50px', 
    fontFamily: 'sans-serif',
    paddingTop: '115px', 
    // ✨ 화면 너비 강제 제어 (가로 스크롤 방지)
    width: '100%', 
    overflowX: 'hidden',
    position: 'relative'
  },

  // 2. 헤더 (Grid 사용: 로고 중앙 정렬 보장)
  header: { 
    display: 'grid', 
    gridTemplateColumns: '1fr auto 1fr', // 좌-중-우 3등분
    alignItems: 'center', 
    padding: '0 20px', 
    borderBottom: '1px solid #ddd',
    
    // 상단 고정
    position: 'fixed', 
    top: 0,
    left: 0,
    right: 0, 
    height: '60px', 
    backgroundColor: 'white', 
    zIndex: 1000, 
    boxSizing: 'border-box' 
  },

  logoGroup: { 
    gridColumn: '2', // 무조건 가운데
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: { fontFamily: 'cursive', fontSize: '28px', margin: 0 },

  headerRight: { 
    gridColumn: '3', // 무조건 오른쪽
    justifySelf: 'end',
    display: 'flex', 
    alignItems: 'center',
    gap: '15px', 
    fontSize: '14px', 
    fontWeight: 'bold',
    whiteSpace: 'nowrap' 
  },

  iconLink: { cursor:'pointer', transition: 'color 0.3s' },

  // 3. 네비게이션 바
  navBar: { 
    display:'flex', 
    justifyContent:'center', 
    gap:'20px', 
    padding:'15px 0', 
    borderBottom:'1px solid #eee', 
    
    position: 'fixed', 
    top: '60px', 
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 999, 
    boxSizing: 'border-box',
    
    flexWrap: 'wrap' // 메뉴 줄바꿈 허용 (잘림 방지)
  },

  navItem: { fontSize:'14px', fontWeight:'bold', cursor:'pointer', paddingBottom:'5px', letterSpacing:'1px' },
  
  // 4. 슬라이더 및 기타
  sliderContainer: { width: '100%', height: '400px', overflow: 'hidden', position: 'relative', marginBottom: '40px' },
  sliderTrack: { display: 'flex', width: '100%', height: '100%', transition: 'transform 0.5s ease-in-out' },
  slide: { minWidth: '100%', height: '100%', position:'relative' },
  bannerImg: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' },

  bannerOverlay: { position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'white', textAlign:'center', textShadow:'0 2px 10px rgba(0,0,0,0.5)', width:'90%' },
  indicatorBox: { position:'absolute', bottom:'20px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'10px' },
  indicator: { width:'10px', height:'10px', borderRadius:'50%', transition:'background 0.3s' },
  titleSection: { textAlign: 'center', padding: '20px 0 40px 0' },
  mainTitle: { fontSize: '24px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' },
  titleLine: { width: '40px', height: '3px', backgroundColor: '#333', margin: '10px auto' },
  
  // ✨ 5. 상품 그리드 (여기를 4열로 고정)
  gridContainer: { 
    display: 'grid', 
    // 화면 크기와 상관없이 무조건 4개씩 배치
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '20px', 
    width: '100%', 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '0 20px',
    boxSizing: 'border-box'
  },
  
  productCard: { cursor: 'pointer', textAlign: 'center' },
  imageWrapper: { width: '100%', aspectRatio: '3/4', overflow: 'hidden', marginBottom: '10px', borderRadius:'4px' },
  productImage: { width: '100%', height: '100%', objectFit: 'cover', transition:'transform 0.3s' },
  productName: { fontSize: '14px', marginBottom: '5px', color:'#333' },
  priceRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '5px' },
  price: { fontWeight: 'bold', fontSize: '15px' },
  cartIconBtn: { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  
  // 모달 등 나머지 (그대로 유지)
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