/**
 * @file PromiseAllLimited
 *
 */

/**
 * ## PromiseAllLimited
 * ### description
 * English
 * 
 * like Promise.all, but limited the number of the concurrent promises. 
 * 
 * When one promise resolved, then take the next pendingPromise unless reach the limited number again.
 * 
 * When all the pending promises resolved, the return promise is resolved with result corresponding to the pending promises like Promise.all.
 * 
 * the result contains the rejected value(mostly Error) when the corresponding pending promise was rejected.
 * 
 * Chinese
 * 
 * 类似于Promise.all方法，但是会限制并发的promise数量。
 * 
 * 每当其中一个promise 被resolve后，接着取下一个pending promise，直到再次达到限制数。
 * 
 * 所有的pending promises都resolve后（或者其中有reject），返回带着result的promise，result的元素顺序与pending promise是一一对应的，其中可能包含Error（当对应的promise被reject）。
 * 
 * ### example
 * ```js
    function test(limited) {
      const arr = [];
      const intervals = [];
      for (let index = 0; index < 6; index++) {
        const interval = (Math.random() * 1.8).toFixed(3) * 1000;
        intervals.push(interval);
        arr[index] = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (interval > 1000) {
              reject(new Error(`${interval} is too large`));
            }
            resolve(interval);
          }, interval);
        });
      }
      promiseAllLimited(arr, 3)
        .then((result) => {
          console.log("result", result);
          result.forEach((res, index) => {
            console.log(res === intervals[index]); // true, except intervals[index] > 1000, then res is an instance of Error
          })
        });
    }
 * ```
 * @param {Array<Promise>} promises an array of pending promises
 * @param {number} [limited=6] limited number
 * @returns {Array<any>} an array of results which are resolved from pending promises
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
