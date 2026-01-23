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
  const indicator = root.querySelector(".focal-track-indicator");

  let current = 1; // primeiro slide real
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

  /* ================= POSITION ================= */
  function getX(index) {
    const slide = slides[index];
    return slide.offsetLeft - (list.clientWidth - slide.offsetWidth) / 2;
  }

  /* ================= DOTS ================= */
  function updateDots(realIndex) {
    dots.forEach((d) => d.classList.remove("active"));
    dots[realIndex]?.classList.add("active");

    const step = 100 / dots.length;
    indicator.style.transform = `translateX(${realIndex * step}%)`;
  }

  /* ================= CORE ================= */
  function goTo(index, animate = true) {
    if (isAnimating) return;
    isAnimating = true;

    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translate3d(-${getX(index)}px, 0, 0)`;

    // remove destaque de todos
    slides.forEach((slide) => {
      slide.classList.remove("slick-current");
    });

    // destaca o slide atual
    slides[index]?.classList.add("slick-current");

    current = index;

    setTimeout(() => {
      // clone final → volta para o primeiro real
      if (current === slides.length - 1) {
        track.style.transition = "none";
        current = 1;
        track.style.transform = `translate3d(-${getX(current)}px,0,0)`;
      }

      // clone inicial → volta para o último real
      if (current === 0) {
        track.style.transition = "none";
        current = slides.length - 2;
        track.style.transform = `translate3d(-${getX(current)}px,0,0)`;
      }

      // garante destaque correto após o jump
      slides.forEach((slide) => {
        slide.classList.remove("slick-current");
      });
      slides[current]?.classList.add("slick-current");

      updateDots(current - 1);
      isAnimating = false;
    }, 650);
  }

  function next() {
    goTo(current + 1);
  }

  /* ================= DOT CLICK ================= */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoplay();
      goTo(i + 1);
      startAutoplay();
    });
  });

  /* ================= AUTOPLAY ================= */
  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  window.addEventListener("resize", () => goTo(current, false));

  /* ================= INIT ================= */
  goTo(current, false);
  updateDots(0);
  startAutoplay();
});
