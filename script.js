// script.js
// Lightbox with zoom, drag, and next/prev navigation
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Lightbox creation ---------- */
  if (!document.querySelector('.lightbox')) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-prev" aria-label="Previous image">‹</button>
      <div class="lightbox-inner" role="dialog" aria-modal="true">
        <img src="" alt="" class="lightbox-img">
      </div>
      <button class="lightbox-next" aria-label="Next image">›</button>
      <button class="lightbox-close" aria-label="Close image">×</button>
    `;
    document.body.appendChild(lb);
  }

  const lightbox = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lightbox-img');
  const lbClose = document.querySelector('.lightbox-close');
  const lbPrev = document.querySelector('.lightbox-prev');
  const lbNext = document.querySelector('.lightbox-next');

  const selectors = [
    '.img-item img',
    '.project-item img',
    'main img',
    '.image-grid img'
  ];

  const imgs = Array.from(document.querySelectorAll(selectors.join(',')));

  // 当前索引与缩放参数
  let currentIndex = -1;
  let zoom = 1;
  let translateX = 0, translateY = 0;

  function resetTransform() {
    zoom = 1;
    translateX = 0;
    translateY = 0;
    lbImg.style.transform = 'scale(1) translate(0, 0)';
    lbImg.style.cursor = 'grab';
  }

  /* ---------- 打开 Lightbox ---------- */
  function openLightbox(index) {
    const img = imgs[index];
    if (!img) return;
    currentIndex = index;
    lbImg.src = img.getAttribute('src') || img.dataset.src;
    lbImg.alt = img.alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetTransform();
  }

  imgs.forEach((img, idx) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(idx));
  });

  /* ---------- 关闭 ---------- */
  function closeLB() {
    lightbox.classList.remove('active');
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLB);
  lightbox.addEventListener('click', (ev) => {
    if (ev.target === lightbox || ev.target === document.querySelector('.lightbox-inner')) {
      closeLB();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLB();
  });

  /* ---------- 前后切换 ---------- */
  function showNext() {
    if (currentIndex < imgs.length - 1) openLightbox(currentIndex + 1);
    else openLightbox(0); // 循环浏览
  }
  function showPrev() {
    if (currentIndex > 0) openLightbox(currentIndex - 1);
    else openLightbox(imgs.length - 1); // 循环浏览
  }

  lbNext.addEventListener('click', showNext);
  lbPrev.addEventListener('click', showPrev);

  // 键盘左右方向键支持
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  /* ---------- 滚轮缩放 ---------- */
  lbImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoom = Math.min(Math.max(0.5, zoom + delta), 5);
    lbImg.style.transform = `scale(${zoom}) translate(${translateX / zoom}px, ${translateY / zoom}px)`;
  });

  /* ---------- 鼠标拖动查看 ---------- */
  let isDragging = false;
  let startX, startY;
  lbImg.addEventListener('mousedown', (e) => {
    if (zoom > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      lbImg.style.cursor = 'grabbing';
    }
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      lbImg.style.transform = `scale(${zoom}) translate(${translateX / zoom}px, ${translateY / zoom}px)`;
    }
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    lbImg.style.cursor = zoom > 1 ? 'grab' : 'auto';
  });

  /* ---------- Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="index.html#"], a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
          history.replaceState(null, '', '#' + id);
        }
      }
    });
  });

});
