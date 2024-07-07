# Description

this package is aimed at providing extra promise related methods to simplify the code.

# Usage

```js
const { promiseAllLimited } = require("@mxydl2009/promise-extra"); // commonjs module

import { promisedAllLimited } from "@mxydl2009/promise-extra"; // es module
```

# API

## promiseAllLimited(promises, [limited]) ⇒ <code>Array&lt;any&gt;</code>

## PromiseAllLimited

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

### example

```js
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
  promiseAllLimited(arr, 3).then((result) => {
    console.log("result", result);
    result.forEach((res, index) => {
      console.log(res === intervals[index]); // true, except intervals[index] > 1000, then res is an instance of Error
    });
  });
}
```

**Returns**: <code>Array&lt;any&gt;</code> - an array of results which are resolved from pending promises

| Param     | Type                              | Default        | Description                  |
| --------- | --------------------------------- | -------------- | ---------------------------- |
| promises  | <code>Array&lt;Promise&gt;</code> |                | an array of pending promises |
| [limited] | <code>number</code>               | <code>6</code> | limited number               |
