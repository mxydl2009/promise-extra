# Description

this package is aimed at providing extra promise related methods to simplify the code.

# Usage

```js
const { promiseAllLimited } = require("@mxydl2009/promise-extra"); // commonjs module

import { promisedAllLimited } from "@mxydl2009/promise-extra"; // es module

// async task factory
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
// constrain the concurrency to 3
const limited = promiseAllLimited(3);
// register the async tasks
taskIntervals.forEach((item) =>
  limited(() => taskFactory(item.name, item.interval))
);
// start the registered async tasks
limited.run().then((res) => {
  console.log("result", res); // res: [task-xxx, task-xxx, ...]
});
```

# API

## promiseAllLimited([limit]) ⇒ <code>undefined</code>

**Returns**: <code>undefined</code> - (callback: () => Promise) => undefined

| Param   | Type                | Default        | Description         |
| ------- | ------------------- | -------------- | ------------------- |
| [limit] | <code>number</code> | <code>6</code> | default concurrency |

### description

#### English

like Promise.all, but limited the number of the concurrent promises.

When one promise resolved, then take the next pendingPromise unless reach the limited number again.

When all the pending promises resolved, the return promise is resolved with result corresponding to the pending promises like Promise.all.

the result contains the rejected value(mostly Error) when the corresponding pending promise was rejected.

#### Chinese

类似于 Promise.all 方法，但是会限制并发的 promise 数量。

每当其中一个 promise 被 resolve 后，接着取下一个 pending promise，直到再次达到限制数。

所有的 pending promises 都 resolve 后（或者其中有 reject），返回带着 result 的 promise，result 的元素顺序与 pending promise 是一一对应的，其中可能包含 Error（当对应的 promise 被 reject）。
