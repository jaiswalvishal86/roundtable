import { COLS, ROWS, TILE_SIZE } from "./main.js";

export class World {
  constructor() {
    this.level1 = {
      backgroundLayer: document.getElementById("scene"),
    };
  }
  drawBackground(ctx) {
    ctx.drawImage(
      this.level1.backgroundLayer,
      0,
      0,
      this.level1.backgroundLayer.width,
      this.level1.backgroundLayer.height
    );
  }
  drawGrid(ctx) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        // ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}
