export class Timer {
  #innerTimer;

  constructor(targetFn, interval = 1000) {
    this.fn = targetFn;
    this.interval = interval;
    this.repeat = true;
  }

  //   /**
  //    * @param {number} t
  //    */
  //   set interval(t) {}

  //   /**
  //    * @param {boolean} repeat
  //    */
  //   set repeat(repeat) {}

  #handleTimer() {
    this.fn;
    if (this.repeat) {
      this.start();
    }
  }

  start() {
    this.#innerTimer = window.setTimeout(
      this.#handleTimer,
      this.interval
    );
    return this;
  }

  stop() {
    if (this.#innerTimer) {
      clearInterval(this.#innerTimer);
      this.#innerTimer = null;
    }
    return this;
  }

  reset() {
    if (this.#innerTimer) {
      this.stop().start();
    }
    return this;
  }
}
