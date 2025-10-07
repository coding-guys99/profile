/* menu.js — Mobile menu with overlay (event delegation, works with dynamic header) */

(function () {
  // 取得或建立 overlay
  function ensureOverlay() {
    let ov = document.querySelector(".nav-overlay");
    if (!ov) {
      ov = document.createElement("div");
      ov.className = "nav-overlay";
      document.body.appendChild(ov);
      // 點 overlay 關閉
      ov.addEventListener("click", closeMenu);
    }
    return ov;
  }

  function openMenu() {
    const nav = document.getElementById("site-nav");
    const toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    ensureOverlay().classList.add("is-active");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    const nav = document.getElementById("site-nav");
    const toggle = document.querySelector(".nav-toggle");
    const ov = document.querySelector(".nav-overlay");
    nav?.classList.remove("is-open");
    ov?.classList.remove("is-active");
    toggle?.setAttribute("aria-expanded", "false");
  }

  // 事件委派：處理點擊
  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(".nav-toggle");
    const nav = document.getElementById("site-nav");

    // 點擊「選單」按鈕：開/關
    if (toggleBtn && nav) {
      e.preventDefault();
      nav.classList.contains("is-open") ? closeMenu() : openMenu();
      return;
    }

    // 點擊導覽連結：關閉
    if (nav && e.target.closest("#site-nav a")) {
      closeMenu();
      return;
    }

    // 點擊外層（非 nav-list、非 toggle）：關閉
    if (nav && !e.target.closest("#site-nav") && !e.target.closest(".nav-toggle")) {
      closeMenu();
    }
  });

  // 若 partials 是動態載入：載入後保險地確保 overlay 存在
  document.addEventListener("partials:loaded", ensureOverlay);
  // DOM 就緒也保險建立一次（不會重複建立）
  document.addEventListener("DOMContentLoaded", ensureOverlay);
})();

// Footer 年份自動更新
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});