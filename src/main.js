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
      scrub: 1, // Reduced scrub time
      fastScrollEnd: true, // Improves performance during fast scrolling
      invalidateOnRefresh: true,
      // markers: true,
    },
    onStart: () => {
      if (isScramble) {
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
      scale: 0.9,
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
    .to(
      ".content-wrap",
      {
        yPercent: -95,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
      },
      "<+0.25"
    )
    .to(
      ".orland-wrap",
      {
        yPercent: -115,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
      },
      "<+0.1"
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

export const TILE_SIZE = 116;
export const COLS = 15;
export const ROWS = 11;
export const HALF_TILE = TILE_SIZE / 2;

function loadCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;

  // Always set the width to the container's full width
  const newWidth = container.clientWidth;

  // Calculate the height based on the aspect ratio
  const aspectRatio = COLS / ROWS;
  const newHeight = newWidth / aspectRatio;

  // Set canvas size
  canvas.width = newWidth;
  canvas.height = newHeight;

  // Scale the context to maintain tile size proportions
  const scale = newWidth / (COLS * TILE_SIZE);
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
      this.world.drawForeground(ctx);

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

window.addEventListener("resize", () => {
  loadCanvas();
  createScrollAnimation();
});
