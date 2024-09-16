import { HALF_TILE, TILE_SIZE } from "./main.js";

export class GameObject {
  constructor({ game, sprite, position, scale }) {
    this.game = game;
    this.sprite = sprite ?? {
      image: "",
      x: 0,
      y: 0,
      width: TILE_SIZE,
      height: TILE_SIZE,
    };
    this.position = position ?? { x: 0, y: 0 };
    this.scale = scale ?? 2.5;

    this.destinationPosition = { x: this.position.x, y: this.position.y };
    this.distanceToTravel = { x: 0, y: 0 };

    this.width = this.sprite.width * this.scale;
    this.halfWidth = this.width / 2;
    this.height = this.sprite.height * this.scale;
  }
  moveTowards(destinationPosition, speed) {
    this.distanceToTravel.x = destinationPosition.x - this.position.x;
    this.distanceToTravel.y = destinationPosition.y - this.position.y;

    let distance = Math.hypot(this.distanceToTravel.x, this.distanceToTravel.y);

    if (distance <= speed) {
      this.position.x = destinationPosition.x;
      this.position.y = destinationPosition.y;
    } else {
      const stepX = this.distanceToTravel.x / distance;
      const stepY = this.distanceToTravel.y / distance;

      this.position.x += stepX * speed;
      this.position.y += stepY * speed;

      this.distanceToTravel.x = destinationPosition.x - this.position.x;
      this.distanceToTravel.y = destinationPosition.y - this.position.y;

      distance = Math.hypot(this.distanceToTravel.x, this.distanceToTravel.y);
    }
    return distance;
  }
  draw(ctx) {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE);
    ctx.drawImage(
      this.sprite.image,
      this.sprite.x * this.sprite.width,
      this.sprite.y * this.sprite.height,
      this.sprite.width,
      this.sprite.height,
      this.position.x + HALF_TILE - this.halfWidth,
      this.position.y + TILE_SIZE - 1.35 * this.height,
      this.width,
      this.height
    );
  }
}
