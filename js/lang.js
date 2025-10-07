// lang-dropdown.js
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("lang-dropdown");
  if (!dropdown) return;

  // 定義所有可用語言（顯示名稱、代碼）
  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "ms", label: "Bahasa Melayu" },
    { code: "zh-CN", label: "简体中文" },
    { code: "zh-TW", label: "繁體中文" },
  ];

  // 從 localStorage 或瀏覽器語言判定當前語言
  let currentLang = localStorage.getItem("lang") || "en";
  const browserLang = navigator.language || navigator.userLanguage;
  if (!localStorage.getItem("lang")) {
    if (browserLang.startsWith("zh-TW")) currentLang = "zh-TW";
    else if (browserLang.startsWith("zh")) currentLang = "zh-CN";
    else if (browserLang.startsWith("ms")) currentLang = "ms";
  }

  // 建立按鈕與選單
  const button = document.createElement("button");
  button.id = "lang-btn";
  button.textContent = LANGUAGES.find(l => l.code === currentLang)?.label || "English";

  const menu = document.createElement("ul");
  LANGUAGES.forEach(lang => {
    const li = document.createElement("li");
    li.textContent = lang.label;
    li.dataset.setlang = lang.code;
    li.addEventListener("click", () => {
      localStorage.setItem("lang", lang.code);
      location.reload(); // 或改用你的 lang.js 即時切換
    });
    menu.appendChild(li);
  });

  dropdown.appendChild(button);
  dropdown.appendChild(menu);

  // 點擊展開/收合
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  // 點外層收回
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) menu.classList.remove("show");
  });
});
