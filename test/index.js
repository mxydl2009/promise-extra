// usage example

import { promiseAllLimited } from "../src/index";

function taskFactory(name, interval) {
  return new Promise(function (resolve) {
    console.log(`task ${name} has started!`);
    setTimeout(() => {
      console.log("~~~~~~~~~", `task ${name} has finished!`);
      resolve(`task-${name}`);
    }, interval);
  });
}

// const jobs = ["a", "b", "c", "d", "e"];
const taskIntervals = [];
for (let index = 0; index < 8; index++) {
  // 最大的间隔为1800ms，不超过2000ms，否则mocha测试时会超时
  const interval = Math.floor(Math.random() * 1800);
  taskIntervals.push({
    name: `${interval}`,
    interval,
  });
}
// 限制并发数
const limited = promiseAllLimited(3);
// 注册并发异步任务
taskIntervals.forEach((item) =>
  limited(() => taskFactory(item.name, item.interval))
);
// 启动并发任务队列
limited.run().then((res) => {
  console.log("result", res);
});
