import { GameObject } from "./gameObject.js";
import { UP, DOWN, LEFT, RIGHT } from "./input.js";
import { TILE_SIZE } from "./main.js";

export class Hero extends GameObject {
  constructor({ game, sprite, position, scale }) {
    super({ game, sprite, position, scale });
    this.speed = 10;
    this.maxFrame = 8;
    this.moving = false;
  }
  update() {
    let nextX = this.destinationPosition.x;
    let nextY = this.destinationPosition.y;

    const distance = this.moveTowards(this.destinationPosition, this.speed);

    const arrived = distance <= this.speed;

    if (arrived) {
      if (this.game.input.lastKey === UP) {
        nextY -= TILE_SIZE;
        this.sprite.y = 8;
      } else if (this.game.input.lastKey === DOWN) {
        nextY += TILE_SIZE;
        this.sprite.y = 10;
      } else if (this.game.input.lastKey === LEFT) {
        nextX -= TILE_SIZE;
        this.sprite.y = 9;
      } else if (this.game.input.lastKey === RIGHT) {
        nextX += TILE_SIZE;
        this.sprite.y = 11;
      }
      this.destinationPosition.x = nextX;
      this.destinationPosition.y = nextY;
    }

    if (this.game.input.keys.length > 0 || !arrived) {
      this.moving = true;
    } else {
      this.moving = false;
    }

    if (this.game.eventUpdate && this.moving) {
      this.sprite.x < this.maxFrame ? this.sprite.x++ : (this.sprite.x = 1);
    } else if (!this.moving) {
      this.sprite.x = 0;
    }
  }
}
