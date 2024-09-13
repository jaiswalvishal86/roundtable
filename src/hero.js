import { GameObject } from "./gameObject.js";
// import { UP, DOWN, LEFT, RIGHT } from "./input.js";
import { TILE_SIZE } from "./main.js";

export class Hero extends GameObject {
  constructor({ game, sprite, position, scale }) {
    super({ game, sprite, position, scale });
    this.speed = 4;
    this.maxFrame = 8;
    this.moving = false;
    this.direction = 1;
    this.walkRange = 4;
    this.startX = this.position.x;
    this.maxX = this.startX + this.walkRange * TILE_SIZE;
    this.minX = this.startX - this.walkRange * TILE_SIZE;
  }

  update() {
    this.moveLeftRight();

    if (this.moving) {
      if (this.game.eventUpdate) {
        this.sprite.x < this.maxFrame ? this.sprite.x++ : (this.sprite.x = 1);
      }
      this.sprite.y = this.direction === 1 ? 11 : 9; // 11 for right, 9 for left
    } else {
      this.sprite.x = 0;
    }
  }

  moveLeftRight() {
    const nextX = this.position.x + this.direction * this.speed;

    if (nextX <= this.minX || nextX >= this.maxX) {
      this.direction *= -1; // Reverse direction
    }

    this.position.x += this.direction * this.speed;
    this.moving = true;

    // Ensure the hero stays within the defined range
    this.position.x = Math.max(this.minX, Math.min(this.position.x, this.maxX));
  }
}
