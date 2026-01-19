document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slick-track");
  const slides = Array.from(document.querySelectorAll(".slick-slide"));

  const btnPrev = document.querySelector(".control-button.left");
  const btnNext = document.querySelector(".control-button.right");
  const btnPlay = document.querySelector(".control-button.center");

  let current = slides.findIndex(slide =>
    slide.classList.contains("slick-current")
  );
  if (current < 0) current = 0;

  let autoplay = true;
  let timer = null;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    current = index;

    const target = slides[index];
    const x = target.offsetLeft;

    // move track
    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translate3d(-${x}px, 0px, 0px)`;

    // atualiza classes
    slides.forEach((slide, i) => {
      slide.classList.remove("slick-active", "slick-current");
      slide.setAttribute("aria-hidden", "true");

      if (i === index) {
        slide.classList.add("slick-active", "slick-current");
        slide.setAttribute("aria-hidden", "false");
      }
    });
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAutoplay() {
    autoplay = true;
    btnPlay.classList.add("playing");
    timer = setInterval(next, 4000);
  }

  function stopAutoplay() {
    autoplay = false;
    btnPlay.classList.remove("playing");
    clearInterval(timer);
  }

  // eventos
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

  // init
  goTo(current);
  startAutoplay();

  window.addEventListener("resize", () => {
    goTo(current);
  });
});

