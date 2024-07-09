/**
 * @file last
 */

/**
 *
 * ## last
 * ### description
 * **English**
 * resolve the last promise among a sequence of pending promises generated over time,
 * usually used in handling the frequently triggered async task, like the below scenarios:
 * 1. In the input field, quickly type to display a dropdown list showing the response results for the current input text.
 * 2. quickly click, and show result of last click;
 *
 * **sometime, debounce or throttle can also resolve the same problem**;
 * **Chinese**
 * 随时间产生的promise序列里，将最后一个promise的结果resolve出去。
 * 通常用于频繁触发的异步任务场景:
 * 1. 在输入框中快速输入，下拉列表展示当前输入文本的响应结果;
 * 2. 快速点击，展示最近点击的结果;
 *
 * 有时候，也会使用防抖或者节流来解决类似的问题。
 /

/**
 *
 * @param {function} fn async task function
 * @returns {function} () => Promise<any>: the function to execute the async task function
 */
function last(fn) {
  let cached = null; // 缓存最近一次调用last的Promise
  return function (...args) {
    if (cached) {
      cached.abort(); // 取消上次的异步任务;
    }
    cached = new LastTask(fn); // 调度新的异步任务;
    return cached.exec(...args).then(
      (res) => {
        cached = null;
        return res;
      },
      (e) => {
        if (e.name !== "abort") {
          throw e;
        }
      }
    );
  };
}

class AbortError extends Error {
  constructor(message) {
    super(message);
    this.name = "abort";
    this.message = message;
  }
}

class LastTask {
  constructor(fn) {
    this.task = fn;
    this.resolve = null;
    this.reject = null;
    this.p = null;
  }

  exec(...args) {
    this.p = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.task &&
        this.task(...args)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            this.reject(e);
          });
    });
    return this.p;
  }

  abort() {
    this.reject && this.reject(new AbortError("cancel previous promise"));
  }
}

export default last;
