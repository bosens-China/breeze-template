/**
 * 防抖函数
 *
 * @param {(...args: any[]) => any} fn
 * @param {number} timeout
 * @return {*}
 */
function shake(fn: (...args: any[]) => any, timeout: number) {
  let i: number | undefined;
  return function (this: any, ...args: any[]) {
    clearTimeout(i);
    i = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
}

interface Iparameter {
  current?: number;
  timeous?: number;
  change?: (current: number) => void;
}

class Carousel {
  public current: number;
  public box!: JQuery<HTMLElement>;
  public timeous: number;
  public change: Iparameter['change'];

  public length = 0;
  private width = 0;
  private id: number | null = null;

  /**
   * 下一张
   *
   * @memberof Carousel
   */
  next() {
    this.current += 1;
    this.animation();
  }

  /**
   * 上一张
   *
   * @memberof Carousel
   */
  last() {
    this.current -= 1;
    this.animation();
  }

  /**
   * 跳转到指定
   *
   * @param {number} num
   * @memberof Carousel
   */
  jumpTo(num: number) {
    this.current = num;
    this.animation();
  }

  /**
   * 定时器
   *
   * @memberof Carousel
   */
  timing() {
    this.cancelTiming();
    this.id = setInterval(() => {
      this.next();
    }, this.timeous);
  }

  /**
   * 清楚定时器
   *
   * @return {*}
   * @memberof Carousel
   */
  cancelTiming() {
    if (!this.id) {
      return;
    }
    clearInterval(this.id);
  }

  constructor(parameter?: Iparameter) {
    const { current, change, timeous } = parameter || {};
    this.current = current || 1;
    this.timeous = timeous || 2000;
    this.change = change;
  }

  /**
   * 初始化
   *
   * @memberof Carousel
   */
  init() {
    // 复制第一张和最后一张图片，作为过渡使用
    const box = $('.box');
    const list = $('.box-li');

    box.append(list.eq(0).clone());
    box.prepend(list.eq(-1).clone());
    const width = list.width() || 0;
    this.width = width;
    const length = list.length + 2;

    this.length = length;
    this.box = box;
    this._init();
  }

  /**
   * 当页面大小发生变化的时候，可以调用此方法
   *
   * @memberof Carousel
   */
  reset() {
    const box = $('.box');
    const list = $('.box-li');
    const width = list.width() || 0;
    this.width = width;
    const length = list.length;

    this.length = length;
    this.box = box;
    this._init();
  }

  private _init() {
    const { box, width, current } = this;
    box.css({
      left: `-${current * width}px`,
    });
    if (this.change) {
      this.change(this.current);
    }
  }

  // 确定下边界
  private animation() {
    const { length, box, width } = this;
    this.current = Math.min(length - 1, this.current);
    this.current = Math.max(0, this.current);
    // 改用异步通知
    setTimeout(() => {
      let x = this.current;
      if (x > length - 2) {
        x = 1;
      } else if (x <= 0) {
        x = length - 2;
      }
      // 通知
      if (this.change) {
        this.change(x);
      }
    }, 0);
    box.animate(
      {
        left: `-${width * this.current}px`,
      },
      () => {
        // 完成之后判断一下边界
        if (this.current > length - 2) {
          this.current = 1;
        } else if (this.current <= 0) {
          this.current = length - 2;
        }
        box.css({
          left: `-${this.current * width}px`,
        });
      },
    );
  }
}

$(() => {
  const carousel = new Carousel({ change });
  const left = $('.left');
  const right = $('.right');
  const operation = $('.operation-li');
  carousel.init();

  left.on('click', () => {
    carousel.last();
  });
  right.on('click', () => {
    carousel.next();
  });
  function change(index: number) {
    operation
      .removeClass('active')
      .eq(index - 1)
      .addClass('active');
  }
  operation.on('click', function () {
    const index = operation.index($(this)) + 1;
    carousel.jumpTo(index);
  });
  carousel.timing();
  carousel.box.hover(
    () => {
      carousel.cancelTiming();
    },
    () => {
      carousel.timing();
    },
  );

  $(window).resize(shake(carousel.reset.bind(carousel), 16));
});
