// /js/include.js
document.addEventListener("DOMContentLoaded", () => {
  const inject = (id, url) =>
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const slot = document.getElementById(id);
        if (slot) slot.innerHTML = html;
      });

  Promise.all([
    inject("include-header", "./partials/header.html"),
    inject("include-footer", "./partials/footer.html")
  ])
  .then(() => {
    // 通知其他腳本「partials 載入完成」
    document.dispatchEvent(new CustomEvent("partials:loaded"));
  })
  .catch(err => console.error("Failed to load partials:", err));
});