$(".slick-end").slick({
  lazyLoad: "ondemand",
  arrows: false,
  dots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
});


$(".slick-end-2").slick({
  lazyLoad: "ondemand",
  arrows: false,
  dots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
});



document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".section.div262");
  if (!root) return;

  const track = root.querySelector(".slick-track");
  const list = root.querySelector(".slick-list");

  let slides = Array.from(root.querySelectorAll(".slick-slide"));
  const dots = Array.from(root.querySelectorAll(".focal-option"));
  const focalItems = Array.from(root.querySelectorAll(".focal-item"));
  const indicator = root.querySelector(".focal-track-indicator");

  const btnPrev = root.querySelector(".control-button.left");
  const btnNext = root.querySelector(".control-button.right");
  const btnPlay = root.querySelector(".control-button.center");

  /* ======================================================
     MAPAS FIXOS (DOT ↔ SLIDE REAL)
     slide real: 0 1 2 3
     dots:       3x 1x 1.2x 1.5
  ====================================================== */
  const dotToSlideMap = [3, 0, 1, 2];
  const slideToDotMap = [1, 2, 3, 0];

  let current = 1; // primeiro slide REAL
  let autoplay = true;
  let timer = null;
  let isAnimating = false;

  /* ================= CLONES ================= */
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  firstClone.classList.add("slick-clone");
  lastClone.classList.add("slick-clone");

  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  slides = Array.from(root.querySelectorAll(".slick-slide"));

  /* ================= HELPERS ================= */
  function clampTranslate(x) {
    const max = track.scrollWidth - list.clientWidth;
    return Math.max(0, Math.min(x, max));
  }

  function getX(slide) {
    const center = slide.offsetLeft + slide.offsetWidth / 2;
    return clampTranslate(center - list.clientWidth / 2);
  }

  function updateIndicator(dotIndex) {
    const dot = dots[dotIndex];
    if (!dot) return;
    indicator.style.width = dot.offsetWidth + "px";
    indicator.style.transform = `translateX(${dot.offsetLeft}px)`;
  }

  function syncUIByCurrent() {
    const realIndex = current - 1;
    if (realIndex < 0 || realIndex >= focalItems.length) return;

    focalItems.forEach((item, i) =>
      item.classList.toggle("active", i === realIndex)
    );

    dots.forEach(dot => dot.classList.remove("active"));

    const dotIndex = slideToDotMap[realIndex];
    if (dotIndex != null) {
      dots[dotIndex].classList.add("active");
      updateIndicator(dotIndex);
    }
  }

  /* ================= CORE ================= */
  function goTo(index, animate = true) {
    if (isAnimating) return;
    isAnimating = true;

    const slide = slides[index];
    if (!slide) return;

    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translate3d(-${getX(slide)}px,0,0)`;

    slides.forEach(s => {
      s.classList.remove("slick-current", "slick-active", "slick-center");
      s.setAttribute("aria-hidden", "true");
    });

    slide.classList.add("slick-current", "slick-active", "slick-center");
    slide.setAttribute("aria-hidden", "false");

    current = index;

    setTimeout(() => {
      // clone final → primeiro real
      if (current === slides.length - 1) {
        current = 1;
        goTo(current, false);
        return;
      }

      // clone inicial → último real
      if (current === 0) {
        current = slides.length - 2;
        goTo(current, false);
        return;
      }

      syncUIByCurrent();
      isAnimating = false;
    }, 650);
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  /* ================= AUTOPLAY ================= */
  function startAutoplay() {
    autoplay = true;
    btnPlay.classList.add("playing");
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  function stopAutoplay() {
    autoplay = false;
    btnPlay.classList.remove("playing");
    clearInterval(timer);
  }

  /* ================= EVENTS ================= */
  btnNext.addEventListener("click", () => {
    stopAutoplay();
    next();
  });

  btnPrev.addEventListener("click", () => {
    stopAutoplay();
    prev();
  });

  btnPlay.addEventListener("click", () => {
    autoplay ? stopAutoplay() : startAutoplay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoplay();
      const slideReal = dotToSlideMap[i];
      goTo(slideReal + 1);
    });
  });

  window.addEventListener("resize", () => goTo(current, false));

  /* ================= INIT ================= */
  goTo(current, false);
  syncUIByCurrent();
  startAutoplay();
});

