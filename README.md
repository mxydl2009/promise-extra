# Description

this package is aimed at providing extra promise related methods to simplify the code.

# Usage

## promiseAllLimited method

### example

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

## last method

### example

```js
const { last } = require("@mxydl2009/promise-extra"); // commonjs module

import { last } from "@mxydl2009/promise-extra"; // es module
// define async task function
function asyncTask(name, interval) {
  var text = `task-${name}`;
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve(text);
    }, interval || 1000);
  });
}
let result = null;
let index = 0;

// define the original event handler
function handler() {
  const name = index++;
  // interval should be random when async task is a web request
  const interval = 500;
  return asyncTask(name, interval);
}

// wrap the original handler with last method;
const wrappedHandler = last(handler);

const btnEl = document.querySelector("#btn");
// add the wrapped event handler
btnEl.addEventListener("click", () => {
  wrappedHandler()
    .then((res) => {
      result = res;
      console.log("result", result); // when click, result is task-${click times}, when quickly click btnEl 8 times, result is "task-7", because the previous 7 click are all aborted.
    })
    .catch((e) => {
      console.log("click event: ", e);
    });
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

## last(fn) ⇒ <code>function</code>

**Returns**: <code>function</code> - () => Promise<any>: the function to execute the async task function

| Param | Type                  | Description         |
| ----- | --------------------- | ------------------- |
| fn    | <code>function</code> | async task function |

### description

**English**

resolve the last promise among a sequence of pending promises generated over time,
usually used in handling the frequently triggered async task, like the below scenarios:

1. In the input field, quickly type to display a dropdown list showing the response results for the current input text.
2. quickly click, and show result of last click;

**sometime, debounce or throttle can also resolve the same problem**;

**Chinese**

随时间产生的 promise 序列里，将最后一个 promise 的结果 resolve 出去。
通常用于频繁触发的异步任务场景:

1. 在输入框中快速输入，下拉列表展示当前输入文本的响应结果;
2. 快速点击，展示最近点击的结果;

有时候，也会使用防抖或者节流来解决类似的问题。
