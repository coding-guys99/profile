/* ==========================
   reveal.js — scroll animation for .reveal
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".reveal");
  const timeline = document.querySelector(".timeline");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => io.observe(el));

    // 當 timeline 區塊出現時啟動金線動畫
    if (timeline) {
      const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timeline.classList.add("active");
            tlObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      tlObserver.observe(timeline);
    }
  } else {
    // fallback
    elements.forEach(el => el.classList.add("is-in"));
    timeline?.classList.add("active");
  }
});