/**
 * @file PromiseAllLimited
 *
 * @module PromiseAllLimited
 */

/**
 * ## 有着并发限制的PromiseAll方法
 * ### 功能描述
 * 给定一个数组`Array<Promise>`, 以及并发限制数，将数组中的并发请求一一执行，每执行完一个请求后，在未达到并发限制数时取下一个请求继续执行，一直到执行完所有请求.
 * 
 * ### 使用范例
 * ```js
    function test(num, limited) {
      const arr = [];
      const intervals = [];
      // 创建一个Promise数组
      for (let index = 0; index < num; index++) {
        const interval = (Math.random() * (index + 0.3)).toFixed(3) * 1000;
        intervals.push(interval);
        arr[index] = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (interval > (num + 0.1) * 500) {
              reject(new Error(`${interval} is too large`));
            }
            resolve(interval);
          }, interval);
        });
      }
      // 消费
      promiseAllLimited(arr, limited)
        .then((result) => {
          // result跟intervals的元素应该是一样的，包括顺序，如果promise响应有错误，错误对象被包装在result里
          console.log("result", result);
        });
    }
 * ```
 * @param {Array<Promise>} promises 待并发执行的Promise数组
 * @param {number} [limited=6] 并发限制数
 * @returns {Array<any>} 响应的结果数组
 */
function promiseAllLimited(promises, limited = 6) {
  promises.forEach((promise) => {
    if (!promise instanceof Promise) {
      throw new Error(`${promise} is not a instance of Promise`);
    }
  });
  let pendingPromisesNum = 0;
  // 存储promise的执行结果
  const result = [];
  const pendingPromises = [...promises];
  function handler(res, index, resolve, reject) {
    result[index] = res;
    pendingPromisesNum--;
    exec(resolve, reject);
  }
  function exec(resolve, reject) {
    if (pendingPromises.length === 0) {
      if (pendingPromisesNum === 0) {
        // 只有清空了pendingPromises，以及记录pendingPromises的数据再次归零，说明所有的pendingPromises都resolve了
        resolve(result);
      }
    }
    // 消费：取出pendingPromise成员进行消费
    while (pendingPromisesNum < limited && pendingPromises.length > 0) {
      const pendingPromise = pendingPromises.shift();
      const index = promises.indexOf(pendingPromise);
      pendingPromisesNum++;
      pendingPromise
        .then((res) => {
          handler(res, index, resolve, reject);
        })
        .catch((e) => {
          handler(e, index, resolve, reject);
        });
    }
  }
  return new Promise((resolve, reject) => {
    exec(resolve, reject);
  });
}

export default promiseAllLimited;
