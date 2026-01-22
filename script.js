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

  /* ======================================================
     ORDEM VISUAL DOS DOTS (HTML):
     [0] 1x
     [1] 1.2x
     [2] 1.5
     [3] 3x

     ORDEM DOS SLIDES REAIS:
     [0] 24mm
     [1] 28mm
     [2] 35mm
     [3] 72mm
  ====================================================== */

  const dotToSlideMap = [0, 1, 2, 3];
  const slideToDotMap = [0, 1, 2, 3];

  let current = 1; // primeiro slide real
  let isAnimating = false;
  let autoplay = true;
  let timer = null;

  /* ================= CLONES ================= */
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  firstClone.classList.add("slick-clone");
  lastClone.classList.add("slick-clone");

  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  slides = Array.from(root.querySelectorAll(".slick-slide"));

  /* ================= SLIDE POSITION ================= */
  function getX(slide) {
    return slide.offsetLeft - (list.clientWidth - slide.offsetWidth) / 2;
  }

  /* ================= INDICATOR (FIXO E ESTÁVEL) ================= */
  function updateIndicator(dotIndex) {
    const step = 100 / dots.length;
    indicator.style.transform = `translateX(${dotIndex * step}%)`;
  }

  function syncUI() {
    const realIndex = current - 1;

    focalItems.forEach((item, i) =>
      item.classList.toggle("active", i === realIndex)
    );

    dots.forEach(dot => dot.classList.remove("active"));

    const dotIndex = slideToDotMap[realIndex];
    dots[dotIndex].classList.add("active");
    updateIndicator(dotIndex);
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
      if (current === slides.length - 1) {
        current = 1;
        goTo(current, false);
        return;
      }

      if (current === 0) {
        current = slides.length - 2;
        goTo(current, false);
        return;
      }

      syncUI();
      isAnimating = false;
    }, 650);
  }

  function next() {
    goTo(current + 1);
  }

  /* ================= DOTS ================= */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoplay();
      goTo(dotToSlideMap[i] + 1);
    });
  });

  /* ================= AUTOPLAY ================= */
  function startAutoplay() {
    autoplay = true;
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  function stopAutoplay() {
    autoplay = false;
    clearInterval(timer);
  }

  window.addEventListener("resize", () => goTo(current, false));

  /* ================= INIT ================= */
  goTo(current, false);
  syncUI();
  startAutoplay();
});

