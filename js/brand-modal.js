/* =========================================================
   brand-modal.js
   - 點擊 .brand-card（需有 data-brand）開啟品牌介紹
   - 手機：Bottom Sheet；桌機：Center Modal（CSS 已處理）
   - 關閉方式：背景點擊 / ESC / 關閉鈕 / 手機下滑手勢
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- 元素 ----------
  const sheet    = document.getElementById('brand-sheet');
  const content  = sheet?.querySelector('.sheet-content');
  const titleEl  = document.getElementById('sheet-title');
  const descEl   = document.getElementById('sheet-desc');
  const logoEl   = document.getElementById('sheet-logo');
  const gallery  = document.getElementById('sheet-gallery');

  if (!sheet || !content || !titleEl || !descEl || !logoEl || !gallery) return;

  // ---------- 品牌資料（只含 Logo / 名稱 / 介紹；產品圖可選） ----------
  const BRANDS = {
    blackmagic: {
      name: "Blackmagic Design",
      logo: "./assets/brands/blackmagic.svg",
      desc: "Film and broadcast equipment maker known for ATEM switchers, DeckLink capture cards, and DaVinci Resolve software.",
      products: ["./assets/products/bmd-atem-mini.jpg"] // e.g. ["./assets/products/bmd-atem-mini.jpg"]
    },
    synco: {
      name: "SYNCO",
      logo: "./assets/brands/synco.svg",
      desc: "On-camera and studio microphones popular for compact, reliable on-set recording.",
      products: []
    },
    unileader: {
      name: "Uni-Leader",
      logo: "./assets/brands/unileader.svg",
      desc: "Broadcast peripherals and accessories used across studio builds.",
      products: []
    },
    obsbot: {
      name: "OBSBOT",
      logo: "./assets/brands/obsbot.svg",
      desc: "AI tracking and PTZ cameras for smart framing and flexible studio setups.",
      products: []
    },
    achemic: {
      name: "Achemic",
      logo: "./assets/brands/achemic.svg",
      desc: "Studio hardware and integration modules for stable signal pipelines.",
      products: []
    },
    yamaha: {
      name: "Yamaha Mixer",
      logo: "./assets/brands/yamaha.svg",
      desc: "Professional audio mixers and processing for studio and live broadcast.",
      products: []
    },
    mipro: {
      name: "Mipro",
      logo: "./assets/brands/mipro.svg",
      desc: "Wireless microphone systems widely used in live and studio environments.",
      products: []
    },
    mls: {
      name: "MLS LED (木林森)",
      logo: "./assets/brands/mls.svg",
      desc: "LED display modules used for broadcast video walls and stage visuals.",
      products: [] // e.g. ["./assets/products/mls-wall.jpg"]
    },
    obs: {
      name: "OBS",
      logo: "assets/brands/obs.png",
      desc: "Open-source live production and streaming software for capture and mixing.",
      products: ["./assets/products/OBS_Studio_Logo.svg.png"]
    },
    unreal: {
      name: "Unreal Engine",
      logo: "./assets/brands/unreal.svg",
      desc: "Real-time 3D engine for virtual sets, live rendering, and broadcast graphics.",
      products: []
    },
    ndi: {
      name: "NDI",
      logo: "./assets/brands/ndi.svg",
      desc: "IP-based, low-latency video protocol for routing sources across networks.",
      products: []
    },
    streamdeck: {
      name: "StreamDeck",
      logo: "./assets/brands/streamdeck.svg",
      desc: "Programmable macro controller improving operator UX in live workflows.",
      products: []
    }
  };

  // ---------- 開關控制 ----------
  let lastActiveTrigger = null;
  let isOpen = false;

  function populate(data) {
  titleEl.textContent = data.name || '';
  descEl.textContent  = data.desc || '';
  logoEl.src = data.logo || '';
  logoEl.alt = data.name ? `${data.name} logo` : 'Brand logo';

  // 產品圖（可選）
  gallery.innerHTML = '';
  if (Array.isArray(data.products) && data.products.length) {
    gallery.style.display = 'grid';
    data.products.forEach(src => {
      const tile = document.createElement('div');
      tile.className = 'tile';                    // 先用預設 4:3

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = src;
      img.alt = `${data.name} product`;

      img.addEventListener('load', () => {
        const r = img.naturalWidth / img.naturalHeight;
        // 自動判斷比例並套用最適合的容器比例（可依需要調整門檻）
        tile.classList.remove('ar-16x9', 'ar-4x3', 'ar-1x1');
        if (r >= 1.55)      tile.classList.add('ar-16x9'); // 很寬 → 16:9
        else if (r <= 1.1)  tile.classList.add('ar-1x1');  // 接近方形 → 1:1
        else                tile.classList.add('ar-4x3');  // 其他 → 4:3
      }, { once: true });

      tile.appendChild(img);
      gallery.appendChild(tile);
    });
  } else {
    gallery.style.display = 'none';
  }
}

  // 開啟
function openSheet(key, triggerEl = null) {
  const data = BRANDS[key];
  if (!data) return;
  lastActiveTrigger = triggerEl || null;
  populate(data);

  // 先移除關閉狀態，再加開啟動畫
  sheet.classList.remove('hidden', 'is-closing');
  // 觸發 reflow 以重置動畫（少數瀏覽器需要）
  void sheet.offsetWidth;
  sheet.classList.add('is-opening');

  document.body.style.overflow = 'hidden';
  isOpen = true;

  setTimeout(() => { titleEl.setAttribute('tabindex', '-1'); titleEl.focus({ preventScroll: true }); }, 10);
}

// 收回
function closeSheet() {
  if (!isOpen) return;
  sheet.classList.remove('is-opening');
  sheet.classList.add('is-closing');

  // 等待動畫結束再真正隱藏
  const handleEnd = (e) => {
    if (e.target !== content) return; // 只聽內容面板的動畫
    sheet.classList.add('hidden');
    sheet.classList.remove('is-closing');
    content.removeEventListener('animationend', handleEnd);
  };
  content.addEventListener('animationend', handleEnd);

  document.body.style.overflow = '';
  isOpen = false;

  if (lastActiveTrigger) { lastActiveTrigger.focus(); lastActiveTrigger = null; }
}

  // ---------- 綁定卡片（點擊 / 鍵盤） ----------
  document.querySelectorAll('.brand-card').forEach(card => {
    const key = card.dataset.brand;
    if (!key) return;

    // 讓卡片可鍵盤啟動
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => openSheet(key, card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSheet(key, card);
      }
    });
  });

  // ---------- 關閉行為 ----------
  // 點背景關閉（只在點到 sheet 背景時）
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) closeSheet();
  });

  // ESC 關閉
  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') closeSheet();
  });

  // 手機：下滑手勢關閉
  let touchStartY = null;
  let dragging = false;

  content.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  content.addEventListener('touchmove', (e) => {
    if (!dragging || touchStartY === null) return;
    const delta = e.touches[0].clientY - touchStartY;

    // 只在向下滑且內容已在最頂（避免與滾動衝突）時才跟隨
    const atTop = content.scrollTop <= 0;
    if (delta > 0 && atTop) {
      e.preventDefault(); // 阻止整頁滾動
      content.style.transform = `translateY(${delta * 0.5}px)`; // 阻尼
    }
  }, { passive: false });

  content.addEventListener('touchend', (e) => {
    if (!dragging) return;
    const endY = (e.changedTouches && e.changedTouches[0].clientY) || 0;
    const delta = endY - (touchStartY || 0);
    content.style.transform = ''; // 還原

    // 超過臨界值則關閉
    if (delta > 80) closeSheet();

    dragging = false;
    touchStartY = null;
  });

});