// ================================
// lang.js — 全域多語系控制
// ================================

// 語言設定表（集中管理）
const LANGS = [
  { code: "en",    label: "EN"   },
  { code: "zh-TW", label: "繁中" },
  { code: "zh-CN", label: "简中" }
];
const LANG_PATH = "./lang/";

// 自動判斷瀏覽器語言
let browserLang = navigator.language || navigator.userLanguage;
let currentLang =
  localStorage.getItem("lang") ||
  (browserLang.startsWith("zh-TW")
    ? "zh-TW"
    : browserLang.startsWith("zh-CN")
    ? "zh-CN"
    : "en");

// -----------------------------
// 初始化語言切換按鈕
// -----------------------------
function buildLangMenu() {
  const container = document.getElementById("lang-switch");
  if (!container) return;

  container.innerHTML = ""; // 清空舊內容
  LANGS.forEach(({ code, label }) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.dataset.setlang = code;
    btn.setAttribute("aria-pressed", code === currentLang);
    if (code === currentLang) btn.classList.add("active");
    container.appendChild(btn);
  });
}

// -----------------------------
// 載入對應語言 JSON 並套用
// -----------------------------
function loadAndApply(lang) {
  fetch(`${LANG_PATH}${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (data[key]) el.textContent = data[key];
      });
      updateLangMenu(lang);
    })
    .catch((err) => console.error("語言載入失敗：", err));
}

// -----------------------------
// 更新按鈕狀態
// -----------------------------
function updateLangMenu(lang) {
  document.querySelectorAll("[data-setlang]").forEach((btn) => {
    const active = btn.dataset.setlang === lang;
    btn.setAttribute("aria-pressed", active);
    btn.classList.toggle("active", active);
  });
}

// -----------------------------
// 事件與初始化
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  buildLangMenu();
  loadAndApply(currentLang);
});

document.addEventListener("partials:loaded", () => {
  buildLangMenu();
  loadAndApply(currentLang);
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-setlang]");
  if (!btn) return;
  const newLang = btn.dataset.setlang;
  if (newLang === currentLang) return;
  currentLang = newLang;
  localStorage.setItem("lang", newLang);
  loadAndApply(newLang);
});