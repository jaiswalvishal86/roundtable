import { Hero } from "./hero.js";
import { Input } from "./input.js";
import { World } from "./world.js";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextScramble from "./scramble.js";

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({
  lerp: 0.1,
  duration: 1.5,
});

lenis.on("scroll", (e) => {
  ScrollTrigger.update(); // Synchronize ScrollTrigger with Lenis
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".bottom-wrap",
    start: "top bottom",
    end: "center center",
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
// .fromTo(
//   "#canvas",
//   {
//     scale: 1.1,
//   },
//   {
//     scale: 1,
//   },
//   "<"
// );

let isScramble = true;

let tl2;

function createScrollAnimation() {
  // Kill the previous timeline if it exists
  if (tl2) {
    tl2.kill();
  }
  console.log("risizing");

  tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".bottom-wrap",
      start: "top -25%",
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

  // Add your animations to tl2 here
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
    .to(".content-info", {
      opacity: 0,
      display: "none",
    })
    .to(".form-container", {
      opacity: 1,
      display: "block",
    });
});

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
    heightScaler = 2.5;
    ROWS = 17;
  } else {
    heightScaler = 1.25;
    ROWS = 12;
  }

  // Define breakpoint for switching to vertical layout
  const breakpoint = 1280; // Adjust this value as needed

  // Get container width
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

  // Scale the context
  ctx.scale(scale, scale);

  // Adjust container height to match canvas
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
        position: { x: 8 * TILE_SIZE, y: TILE_SIZE },
        label: "Hero",
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
      this.world.drawBackground(ctx);
      this.world.drawGrid(ctx);
      // this.hero.draw(ctx);
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

window.addEventListener("load", () => {
  // const el = document.querySelector(".scramble-text");
  // const fx = new TextScramble(el);
  // fx.setText(el.innerText);
  loadCanvas();
  createScrollAnimation();
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

const debouncedResize = debounce(() => {
  loadCanvas();
  createScrollAnimation();
}, 250); // Adjust the delay (in milliseconds) as needed

window.addEventListener("resize", debouncedResize);

// ... existing code ...
