import {random, randomRange} from "../../commons/utils.js";

class Snowflake {

  constructor(width, height, span = 375) {
    this.canvasHeight = height;

    // initial path
    this.offsetX = randomRange(0, width - span);
    this.posXForAxisY = span / 2;
    this.posX = 0;
    this.posY = randomRange(-50, 0);
    this.initialAngle = random(2 * Math.PI);
    this.size = randomRange(1, 3);

    // radius of snowflake spiral
    // chosen so the snowflakes are uniformly spread out in the given span
    this.radius = Math.sqrt(random(Math.pow(this.posXForAxisY, 2)));
  }

  display(ctx) {
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialAngle;
    this.posX = this.offsetX + this.posXForAxisY + this.radius * Math.sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += Math.pow(this.size, 0.5);

    // if snowflake past end of screen, return it so the caller can deal with it.
    if (this.posY > this.canvasHeight) {
      return this;
    }
    return null;
  }
}

export default Snowflake;