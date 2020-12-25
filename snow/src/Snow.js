import Snowflake from "./Snowflake.js";
import { random } from "../../commons/utils.js";

/**
 * Simulate a scene of snow.
 * @desc
 *  the snow effect applies as background to the attached node.
 *  the snow color is rgb(240, 240, 240). Apply proper background color
 *  to the node for visibility.
 *  Use start() to start the snow.
 *  Use stop() to stop the snow.
 */
class Snow {
  /**
   * Create a new Snow object
   * @param node
   *  the element to apply the background effect to
   * @param intensity
   *  the intensity of the snow. From low to high [1, 5].
   *  @default 3
   * @param span
   *  the width of the snow spiral
   *  @default 375
   */
  constructor(node, { intensity = 3, span = 375 } = {}) {
    if (intensity > 5) {
      intensity = 5;
    } else if (intensity < 1) {
      intensity = 1;
    }

    const container = document.createElement('div');
    const topOffset = window.getComputedStyle(node).getPropertyValue('padding-top');
    const leftOffset = window.getComputedStyle(node).getPropertyValue('padding-left');
    container.style.cssText = `position: relative; top: -${topOffset}; left: -${leftOffset}; justify-self: start; align-self: start;`;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', node.clientWidth);
    canvas.setAttribute('height', node.clientHeight);
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none; background: transparent;';

    container.append(canvas);
    node.prepend(container);

    this.ctx = canvas.getContext('2d');
    this.width = canvas.getBoundingClientRect().width;
    this.height = canvas.getBoundingClientRect().height;

    this.stopped = true;
    this.intensity = intensity;
    this.span = span;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === node) {
          canvas.setAttribute('width', entry.target.clientWidth);
          canvas.setAttribute('height', entry.target.clientHeight);
          this.width = canvas.getBoundingClientRect().width;
          this.height = canvas.getBoundingClientRect().height;
        }
      }
    });

    resizeObserver.observe(node);
  }

  /**
   * @private
   * @desc
   *  clip out the previous frame
   */
  paintBackground() {
    this.ctx.fillStyle = "black";
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = "source-over";
  }

  /**
   * @desc
   *  Start the snow if it is not started yet. This will clear any existing snow immediately.
   */
  start() {
    // If it is snowing, skip.
    if (!this.stopped) {
      return;
    }

    this.stopped = false;
    const snowFlakes = [];
    const start = performance.now();

    requestAnimationFrame(function raf(now) {
      this.paintBackground();
      this.ctx.fillStyle = 'rgb(240, 240, 240)';
      // create a random number of snowflakes each frame
      const numFlakes = random(this.intensity * this.width / this.span);
      for (let i = 0; !this.stopped && i < numFlakes; i++) {
        snowFlakes.push(new Snowflake(this.width, this.height, this.span));
      }
      for (let flake of snowFlakes) {
        const secondsPassed = (now - start) / 1000;
        const dropped = flake.update(secondsPassed);

        // delete snow flake after it is dropped.
        if (dropped) {
          const index = snowFlakes.indexOf(dropped);
          snowFlakes.splice(index, 1);
        }
        flake.display(this.ctx);
      }
      // stop animation when it is stopped and there is no snow left.
      if (this.stopped && snowFlakes.length === 0) {
        return;
      }
      requestAnimationFrame(raf.bind(this));
    }.bind(this));
  }

  /**
   * @desc
   *  Stop the snow. This will still allow the remaining snow to finish the animation.
   */
  stop() {
    this.stopped = true;
  }
}

export default Snow;