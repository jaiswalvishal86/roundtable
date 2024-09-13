import { Hero } from "./hero.js";
import { Input } from "./input.js";
import { World } from "./world.js";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.1,
  duration: 1.2,
});

lenis.on("scroll", (e) => {
  console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const hero = document.querySelector(".hero");
const canvasContainer = document.querySelector(".canvas-container");

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: canvasContainer,
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    // markers: true,
  },
});

tl.to(hero, {
  opacity: 0,
  ease: "power4.inOut",
}).to(
  canvasContainer,
  {
    scale: 1.1,
    ease: "power2.inOut",
  },
  "<"
);

export const TILE_SIZE = 116;
export const COLS = 15;
export const ROWS = 10;
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
        position: { x: 12 * TILE_SIZE, y: TILE_SIZE },
      });
      this.input = new Input();

      this.eventUpdate = false;
      this.eventTimer = 0;
      this.eventInterval = 60;

      this.movementPattern = [
        { dx: 2, dy: 0 }, // Right
        { dx: 0, dy: 1 }, // Down
        { dx: -1, dy: 0 }, // Left
        { dx: 0, dy: -1 }, // Up
      ];
      this.currentMoveIndex = 0;
      this.stepsInCurrentDirection = 0;
      this.maxSteps = 3; // Number of steps in each direction
    }

    render(ctx, deltaTime) {
      this.hero.update();
      this.world.drawBackground(ctx);
      this.world.drawGrid(ctx);
      // this.hero.draw(ctx);
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

window.addEventListener("load", loadCanvas);
// window.addEventListener("resize", loadCanvas);
