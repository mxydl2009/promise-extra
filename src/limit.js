/**
 * @module limit
 */

/**
 * ## limit
 * 
 * ### description
 * 
 * **English**
 *
 * like Promise.all, but limited the number of the concurrent promises by parameter concurrency.
 *
 * When one promise resolved, then take the next pendingPromise unless reach the limited number again.
 *
 * When all the pending promises resolved, the return promise is resolved with result corresponding to the pending promises like Promise.all.
 *
 * the result contains the rejected value(mostly Error) when the corresponding pending promise was rejected.
 *
 * **Chinese**
 *
 * 类似于Promise.all方法，但是会限制并发的promise数量。
 *
 * 每当其中一个promise 被resolve后，接着取下一个pending promise，直到再次达到限制数。
 *
 * 所有的pending promises都resolve后（或者其中有reject），返回带着result的promise，result的元素顺序与pending promise是一一对应的，其中可能包含Error（当对应的promise被reject）。
 *
 * ### example
 ```js
  function taskFactory(name, interval) {
    return new Promise(function (resolve) {
      console.log(`task ${name} has started!`);
        setTimeout(() => {
          console.log("~~~~~~~~~", `task ${name} has finished!`);
          resolve(`task-${name}`);
        }, interval);
    });
  }
  const taskIntervals = [];
  for (let index = 0; index < 8; index++) {
    const interval = Math.floor(Math.random() * 1800);
    taskIntervals.push({
      name: `${interval}`,
      interval,
    });
  }

  const limited = promiseAllLimited(3);

  taskIntervals.forEach((item) =>
    limited(() => taskFactory(item.name, item.interval))
  );

  limited.run().then((res) => {
    console.log("result", res);
  });
```
 *
 * @param {number} [concurrency=6] default concurrency
 * @returns {function} (callback: () => Promise) => undefined
 */
function limit(concurrency = 6) {
  let pendingPromisesNum = 0;
  let promiseIndex = 0;
  // 存储promise的执行结果
  const result = [];
  const pendingPromises = [];

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
    while (pendingPromisesNum < concurrency && pendingPromises.length > 0) {
      const pendingPromiseFn = pendingPromises.shift();
      // const index = promises.indexOf(pendingPromise);
      pendingPromisesNum++;
      const pendingPromise = pendingPromiseFn();
      if (!(pendingPromise instanceof Promise)) {
        throw new Error(`${pendingPromise} is not an instance of Promise`);
      } else {
        pendingPromise
          .then((res) => {
            handler(res, promiseIndex, resolve, reject);
          })
          .catch((e) => {
            handler(e, promiseIndex, resolve, reject);
          })
          .finally(() => {
            promiseIndex++;
          });
      }
    }
  }

  limited.run = function () {
    return new Promise((resolve, reject) => {
      exec(resolve, reject);
    });
  };

  // fn为返回promise的函数
  function limited(fn) {
    pendingPromises.push(fn);
  }
  return limited;
}

export default limit;
