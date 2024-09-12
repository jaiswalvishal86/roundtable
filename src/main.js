import { Hero } from "./hero.js";
import { Input } from "./input.js";
import { World } from "./world.js";

export const TILE_SIZE = 116;
export const COLS = 15;
export const ROWS = 10;

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

        position: { x: 10, y: 5 },
      });
      this.input = new Input();
    }
    render(ctx) {
      this.hero.update();
      this.world.drawBackground(ctx);
      this.world.drawGrid(ctx);
      this.hero.draw(ctx);
    }
  }

  const game = new Game();

  function animate() {
    requestAnimationFrame(animate);
    game.render(ctx);
  }

  animate();
}

window.addEventListener("load", loadCanvas);
window.addEventListener("resize", loadCanvas);
