import { Hero } from "./hero.js";
import { Input } from "./input.js";
import { World } from "./world.js";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie from "lottie-web";
import TextScramble from "./scramble.js";

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({
  lerp: 0.1,
  duration: 1.5,
});

lenis.on("scroll", (e) => {
  ScrollTrigger.update();
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.querySelector(".hero-info").addEventListener("click", function () {
  this.classList.toggle("flip");
});

document.getElementById("contactLink").addEventListener("click", function (e) {
  e.preventDefault();
  lenis.scrollTo("bottom", { duration: 2 });
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-spacer",
    start: "top center",
    end: "bottom top",
    scrub: 1,
  },
});

tl.to(".hero", {
  opacity: 0,
  display: "none",
  ease: "power4.inOut",
})
  .to(
    ".hero-bg",
    {
      yPercent: -20,
    },
    "<"
  )
  .fromTo(
    ".hero-bg",
    {
      scale: 1.2,
    },
    {
      scale: 1,
    },
    "<"
  );

let isScramble = true;

let tl2;

function createScrollAnimation() {
  // Kill the previous timeline if it exists
  if (tl2) {
    tl2.kill();
  }

  tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".bottom-wrap",
      start: `top ${window.innerWidth <= 600 ? "-5%" : "-25%"}`,
      end: "bottom bottom",
      scrub: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      // markers: true,
    },
    onStart: () => {
      if (isScramble && window.innerWidth > 600) {
        const el = document.querySelector(".content-info p");
        const fx = new TextScramble(el);
        fx.setText(el.innerText);
        isScramble = false;
      }
    },
  });

  tl2
    .to(".canvas-container", {
      scale: 1,
      force3D: true,
      overwrite: "auto",
    })
    .to(
      [".pillar.right", ".pillar.left"],
      {
        xPercent: (index) => (index === 0 ? -75 : 75),
        scale: 1.1,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
      },
      "<"
    )
    .fromTo(
      ".content-wrap",
      {
        opacity: 0,
      },
      {
        yPercent: -95,
        opacity: 1,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
      },
      "<+0.25"
    )
    .fromTo(
      ".orland-wrap",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        yPercent: -110,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
      },
      "<+0.15"
    )
    .fromTo(
      ".pillars-wrap",
      {
        pointerEvents: "none",
      },
      {
        pointerEvents: "auto",
      },
      "<"
    );
}

const proceedBtn = document.querySelector(".proceed-btn");

proceedBtn.addEventListener("click", () => {
  const tl3 = gsap.timeline();

  tl3
    .to(".content", {
      opacity: 0,
      display: "none",
    })
    .to(".content.form-wrap", {
      opacity: 1,
      display: "block",
    })
    .to(
      ".proceed-btn",
      {
        display: "none",
        opacity: 0,
      },
      "<"
    )
    .to(
      ".submit-btn",
      {
        display: "block",
        opacity: 1,
      },
      "<"
    );
});

function handlePreloader() {
  const preloader = document.getElementById("preloader");
  const preloaderVideo = document.getElementById("preloader-video");
  const body = document.body;

  preloaderVideo.addEventListener("ended", () => {
    body.classList.add("loaded");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  });

  preloaderVideo.play();
}

// function handlePreloader() {
//   const preloader = document.getElementById("preloader");
//   const lottieContainer = document.getElementById("lottie-container");
//   const body = document.body;

//   const animation = lottie.loadAnimation({
//     container: lottieContainer,
//     renderer: "svg",
//     loop: false,
//     autoplay: true,
//     path: "/table_loader.json", // Replace with your Lottie JSON file path
//   });

//   animation.addEventListener("complete", () => {
//     body.classList.add("loaded");
//     setTimeout(() => {
//       preloader.style.display = "none";
//     }, 500);
//   });
// }

function handleFormSubmit() {
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const modal = document.getElementById("processingModal");
      const video = document.getElementById("processingVideo");

      // Show the modal and play the video
      modal.style.display = "block";
      video.play();

      fetch("https://formspree.io/f/xanwgvla", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            this.reset();
            // Hide the modal and pause the video
            modal.style.display = "none";
            video.pause();
            window.location.href = "/pages/thanks.html";
          } else {
            // Hide the modal and pause the video
            modal.style.display = "none";
            video.pause();
            alert("Oops! There was a problem submitting your form");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Hide the modal and pause the video
          modal.style.display = "none";
          video.pause();
          alert("Oops! There was a problem submitting your form");
        });
    });
}

function handleFormValidation() {
  const alphabetInputs = document.querySelectorAll(
    "[data-content='alphabets']"
  );
  const numberInputs = document.querySelectorAll("[data-content='numbers']");

  alphabetInputs.forEach((input) => {
    input.addEventListener("input", function () {
      var inputValue = input.value;

      var nonAlphabeticRegex = /[^a-zA-Z ]/;

      if (nonAlphabeticRegex.test(inputValue)) {
        input.value = inputValue.replace(nonAlphabeticRegex, "");
      }
    });
  });

  numberInputs.forEach((input) => {
    input.addEventListener("input", function () {
      var inputValue = input.value;

      var nonAlphabeticRegex = /[^0-9]/;

      if (nonAlphabeticRegex.test(inputValue)) {
        input.value = inputValue.replace(nonAlphabeticRegex, "");
      }
    });
  });
}

export const TILE_SIZE = 108;
export const COLS = 15;
export let ROWS = 12;
export const HALF_TILE = TILE_SIZE / 2;
export let heightScaler = 2;

function loadCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;

  if (window.innerWidth <= 1024 && window.innerWidth >= 768) {
    heightScaler = 2;
    ROWS = 15;
  } else if (window.innerWidth <= 600) {
    heightScaler = 2.35;
    ROWS = 17;
  } else {
    heightScaler = 1.25;
    ROWS = 12;
  }

  const breakpoint = 1280;

  const containerWidth = container.clientWidth;

  // Calculate dimensions and scale
  let newWidth, newHeight, scale;

  if (containerWidth <= breakpoint) {
    // Vertical layout for smaller screens
    newWidth = containerWidth;
    newHeight = ((newWidth * ROWS) / COLS) * heightScaler;
    scale = newWidth / (COLS * TILE_SIZE);
  } else {
    // Horizontal layout for larger screens
    newWidth = containerWidth;
    newHeight = newWidth / (COLS / ROWS);
    scale = newWidth / (COLS * TILE_SIZE);
  }

  // Set canvas size
  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.scale(scale, scale);

  container.style.height = `${newHeight}px`;

  class Game {
    constructor() {
      this.world = new World();
      this.hero = new Hero({
        game: this,
        sprite: {
          image: document.getElementById("hero"),
          x: 0,
          y: 11,
          width: 64,
          height: 64,
        },
        position: {
          x: 8 * TILE_SIZE,
          y: window.innerWidth <= 600 ? 2 * TILE_SIZE : 1 * TILE_SIZE,
        },
        walkRange: 3,
        speed: 3,
        label: "Hero",
      });

      this.hero1 = new Hero({
        game: this,
        sprite: {
          image: document.getElementById("hero1"),
          x: 0,
          y: 11,
          width: 64,
          height: 64,
        },
        position: {
          x: 3 * TILE_SIZE,
          y: window.innerWidth <= 600 ? 12 * TILE_SIZE : 8 * TILE_SIZE,
        },
        walkRange: 1,
        speed: 2,
        label: "Hero1",
      });
      this.input = new Input();

      this.eventUpdate = false;
      this.eventTimer = 0;
      this.eventInterval = 60;

      this.currentMoveIndex = 0;
      this.stepsInCurrentDirection = 0;
      this.maxSteps = 3; // Number of steps in each direction
    }

    render(ctx, deltaTime) {
      this.hero.update();
      // this.hero1.update();
      this.world.drawBackground(ctx);
      this.world.drawGrid(ctx);
      this.hero.draw(ctx);
      // this.hero1.draw(ctx);
      // this.hero.renderLabel(ctx);
      // this.world.drawForeground(ctx);

      if (this.eventTimer < this.eventInterval) {
        this.eventTimer += deltaTime;
        this.eventUpdate = false;
      } else {
        this.eventTimer = 0;
        this.eventUpdate = true;
      }

      // if (this.eventUpdate) {
      //   this.moveHero();
      // }
    }
  }

  const game = new Game();

  let lastTime = 0;
  function animate(timeStamp) {
    requestAnimationFrame(animate);

    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.render(ctx, deltaTime);
  }

  animate();
}

window.addEventListener("DOMContentLoaded", () => {
  handlePreloader();
  loadCanvas();
  createScrollAnimation();
  handleLenisPrevent();
  updateLabels();
  handleFormSubmit();
  handleFormValidation();
});

// ... existing code ...

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function handleLenisPrevent() {
  const formWrap = document.querySelector(".content.form-wrap");
  if (window.innerWidth <= 600) {
    formWrap.setAttribute("data-lenis-prevent", "");
  } else {
    formWrap.removeAttribute("data-lenis-prevent");
  }
}

function updateLabels() {
  if (window.innerWidth <= 600) {
    const labels = document.querySelectorAll("label");
    labels.forEach((label) => {
      label.innerHTML = label.innerHTML.replace(/\.\s*/g, "");
    });
  }
}

const debouncedResize = debounce(() => {
  loadCanvas();
  createScrollAnimation();
  handleLenisPrevent();
  updateLabels();
  window.location.reload();
}, 250);

window.addEventListener("resize", debouncedResize);

// ... existing code ...
