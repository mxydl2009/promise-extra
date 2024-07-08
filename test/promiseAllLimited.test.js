const { expect } = require("chai");
const { describe, it } = require("mocha");
const { promiseAllLimited } = require("../src/index.js");
// nyc只识别require()语法，会针对require语法的源文件进行代码覆盖率报告，动态导入import(source)是无法被nyc识别的

describe("测试并发模式下异步结果的顺序", function () {
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
    // 最大的间隔为1800ms，不超过2000ms，否则mocha测试时会超时
    const interval = Math.floor(Math.random() * 1600);
    taskIntervals.push({
      name: `${interval}`,
      interval,
    });
  }

  it("the elements of result and intervals should be the same", function (done) {
    // 限制并发数
    const limited = promiseAllLimited(3);
    // 注册并发异步任务
    taskIntervals.forEach((item) =>
      limited(() => taskFactory(item.name, item.interval))
    );
    // 启动并发任务队列
    limited
      .run()
      .then((result) => {
        result.forEach((res, index) => {
          expect(res).to.equal(`task-${taskIntervals[index].name}`);
        });
      })
      .finally(() => {
        done();
      });
  });
});

describe("测试并发模式下异步结果包含Error", function () {
  function taskFactory(name, interval) {
    return new Promise(function (resolve, reject) {
      console.log(`task ${name} has started!`);
      setTimeout(() => {
        console.log("~~~~~~~~~", `task ${name} has finished!`);
        if (interval > 1000) {
          reject(interval);
        }
        resolve(`task-${name}`);
      }, interval);
    });
  }

  const taskIntervals = [];
  for (let index = 0; index < 8; index++) {
    // 最大的间隔为1800ms，不超过2000ms，否则mocha测试时会超时
    const interval = Math.floor(Math.random() * 1600);
    taskIntervals.push({
      name: `${interval}`,
      interval,
    });
  }
  it("the elements of result and intervals should be the same, except the elements of result include errors", function (done) {
    // 限制并发数
    const limited = promiseAllLimited(3);
    // 注册并发异步任务
    taskIntervals.forEach((item) =>
      limited(() => taskFactory(item.name, item.interval))
    );
    // 启动并发任务队列
    limited
      .run()
      .then((result) => {
        console.log("result", res);
        result.forEach((res, index) => {
          if (intervals[index] > 1000) {
            expect(res).to.be.a.instanceOf(Error);
          } else {
            expect(res).to.equal(`task-${taskIntervals[index].name}`);
          }
        });
      })
      .finally(() => {
        done();
      });
  });
});
