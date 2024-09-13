import { COLS, ROWS, TILE_SIZE } from "./main.js";

export class World {
  constructor() {
    this.level1 = {
      backgroundLayer: document.getElementById("scene"),
      foregroundLayer: document.getElementById("table"),
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
  drawForeground(ctx) {
    ctx.drawImage(
      this.level1.foregroundLayer,
      this.level1.foregroundLayer.width / 5,
      this.level1.foregroundLayer.height / 3,
      this.level1.foregroundLayer.width / 4,
      this.level1.foregroundLayer.height / 4
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
