export class Timer {
  #innerTimer = null;

  /**
   * @param {function} targetFn
   * @param {number} interval
   */
  constructor(targetFn, interval = 1000) {
    this.fn = targetFn;
    this.interval = interval;
    this.repeat = true;
  }

  get interval() {
    return this._interval;
  }

  /**
   * @param {number} t
   */
  set interval(t) {
    if (t < 0) {
      throw new Error('Interval cannot be less than 0.');
    }
    this._interval = t;
  }

  get repeat() {
    return this._repeat;
  }

  /**
   * @param {boolean} value
   */
  set repeat(value) {
    this._repeat = value;
  }

  #handleTimer = () => {
    this.fn();
    if (this.repeat) {
      this.start();
    }
  };

  start = () => {
    this.#innerTimer = setTimeout(this.#handleTimer, this.interval);
    return this;
  };

  stop = () => {
    if (this.#innerTimer) {
      clearInterval(this.#innerTimer);
      this.#innerTimer = null;
    }
    return this;
  };

  reset = () => {
    this.stop().start();
  };
}
