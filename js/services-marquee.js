document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".tech-slider");
  const track = document.querySelector(".tech-track");
  if (!slider || !track) return;

  const gap = 40;
  const speed = 0.4; // 調慢一點更順
  const items = Array.from(track.children);

  // ✅ 僅複製兩輪，不無限複製
  track.innerHTML += track.innerHTML;

  const totalWidth = track.scrollWidth / 2;
  let x = 0;
  let paused = false;

  function loop() {
    if (!paused) {
      x -= speed;
      if (x <= -totalWidth) x = 0; // 無縫回到開頭
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(loop);
  }
  loop();

  slider.addEventListener("mouseenter", () => (paused = true));
  slider.addEventListener("mouseleave", () => (paused = false));
  slider.addEventListener("touchstart", () => (paused = true), { passive: true });
  slider.addEventListener("touchend", () => (paused = false), { passive: true });
});