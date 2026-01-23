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

  const dotToSlideMap = [0, 1, 2, 3];
  const slideToDotMap = [0, 1, 2, 3];

  let current = 1;
  let isAnimating = false;
  let timer = null;

  /* ================= CLONES ================= */
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  firstClone.classList.add("slick-clone");
  lastClone.classList.add("slick-clone");

  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  slides = Array.from(root.querySelectorAll(".slick-slide"));

  /* ================= POSIÇÃO ================= */
  function getX(slide) {
    return slide.offsetLeft - (list.clientWidth - slide.offsetWidth) / 2;
  }

  /* ================= INDICATOR ================= */
  function updateIndicator(dotIndex) {
    const step = 100 / dots.length;
    indicator.style.transform = `translateX(${dotIndex * step}%)`;
  }

  function syncUI() {
    const realIndex = current - 1;

    focalItems.forEach((item, i) =>
      item.classList.toggle("active", i === realIndex),
    );

    dots.forEach((dot) => dot.classList.remove("active"));
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

    slides.forEach((s) => {
      s.classList.remove("slick-current", "slick-active", "slick-center");
      s.setAttribute("aria-hidden", "true");
    });

    slide.classList.add("slick-current", "slick-active", "slick-center");
    slide.setAttribute("aria-hidden", "false");

    current = index;

    if (!animate) {
      syncUI();
      isAnimating = false;
      return;
    }

    track.addEventListener(
      "transitionend",
      () => {
        // loop invisível
        if (current === slides.length - 1) {
          current = 1;
          goTo(current, false);
        } else if (current === 0) {
          current = slides.length - 2;
          goTo(current, false);
        } else {
          syncUI();
          isAnimating = false;
        }
      },
      { once: true },
    );
  }

  function next() {
    goTo(current + 1);
  }

  /* ================= DOTS ================= */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(timer);
      goTo(dotToSlideMap[i] + 1);
      startAutoplay();
    });
  });

  /* ================= AUTOPLAY ================= */
  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  window.addEventListener("resize", () => goTo(current, false));

  /* ================= INIT ================= */
  goTo(current, false);
  syncUI();
  startAutoplay();
});

