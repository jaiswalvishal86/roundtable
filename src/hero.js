import { GameObject } from "./gameObject.js";
import { UP, DOWN, LEFT, RIGHT } from "./input.js";

export class Hero extends GameObject {
  constructor({ game, sprite, position, scale }) {
    super({ game, sprite, position, scale });
  }
  update() {
    if (this.game.input.lastKey === UP) {
      console.log("hero up");
      this.position.y -= 1;
    } else if (this.game.input.lastKey === DOWN) {
      this.position.y += 1;
    } else if (this.game.input.lastKey === LEFT) {
      this.position.x -= 1;
    } else if (this.game.input.lastKey === RIGHT) {
      this.position.x += 1;
    }
  }
}
