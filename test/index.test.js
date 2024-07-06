const { expect } = require("chai");
const { describe, it } = require("mocha");
const { promiseAllLimited } = require("../src/index.js");
// nyc只识别require()语法，会针对require语法的源文件进行代码覆盖率报告，动态导入import(source)是无法被nyc识别的

describe("测试并发模式下异步结果的顺序", function () {
  let arr = [];
  let intervals = [];
  for (let index = 0; index < 8; index++) {
    const interval = (Math.random() * (1 + 0.8)).toFixed(3) * 1000;
    intervals.push(interval);
    arr[index] = new Promise((resolve) => {
      setTimeout(() => {
        resolve(interval);
      }, interval);
    });
  }

  it("the elements of result and intervals should be the same", function (done) {
    promiseAllLimited(arr, 3).then((result) => {
      result.forEach((res, index) => {
        expect(res).to.equal(intervals[index]);
      });
      done();
    });
  });
});

describe("测试并发模式下异步结果包含Error", function () {
  let arr = [];
  let intervals = [];

  for (let index = 0; index < 8; index++) {
    const interval = (Math.random() * (1 + 0.8)).toFixed(3) * 1000;
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

  it("the elements of result and intervals should be the same, except the elements of result include errors", function (done) {
    promiseAllLimited(arr).then((result) => {
      result.forEach((res, index) => {
        if (intervals[index] > 1000) {
          expect(res).to.be.a.instanceOf(Error);
        } else {
          expect(res).to.equal(intervals[index]);
        }
      });
      done();
    });
  });
});

// // function test(num, limited) {
// //   const arr = [];
// //   const intervals = [];
// //   for (let index = 0; index < num; index++) {
// //     const interval = (Math.random() * (index + 0.3)).toFixed(3) * 1000;
// //     intervals.push(interval);
// //     arr[index] = new Promise((resolve, reject) => {
// //       setTimeout(() => {
// //         if (interval > (num + 0.1) * 500) {
// //           reject(new Error(`${interval} is too large`));
// //         }
// //         resolve(interval);
// //       }, interval);
// //     });
// //   }
// //   console.log("intervals", intervals);
// //   promiseAllLimited(arr, limited)
// //     .then((result) => {
// //       console.log("result", result);
// //     })
// //     .catch((e) => {
// //       console.log("test error", e);
// //     });
// // }

// describe("测试并发模式下异步结果的顺序", function () {
//   let arr = [];
//   let intervals = [];
//   beforeEach(() => {
//     for (let index = 0; index < 8; index++) {
//       const interval = (Math.random() * (1 + 0.8)).toFixed(3) * 1000;
//       intervals.push(interval);
//       arr[index] = new Promise((resolve, reject) => {
//         setTimeout(() => {
//           // if (interval > (num + 0.1) * 500) {
//           //   reject(new Error(`${interval} is too large`));
//           // }
//           resolve(interval);
//         }, interval);
//       });
//     }
//   });
//   it("the elements of result and intervals should be the same", function (done) {
//     promiseAllLimited(arr, 3).then((result) => {
//       result.forEach((res, index) => {
//         console.log(`result[${index}]: `, result[index]);
//         console.log(`intervals${index}: `, intervals[index]);
//         expect(res).to.equal(intervals[index]);
//       });
//       done();
//     });
//   });
// });

// describe("测试并发模式下异步结果包含Error", function () {
//   let arr = [];
//   let intervals = [];
//   beforeEach(() => {
//     for (let index = 0; index < 8; index++) {
//       const interval = (Math.random() * (1 + 0.8)).toFixed(3) * 1000;
//       intervals.push(interval);
//       arr[index] = new Promise((resolve, reject) => {
//         setTimeout(() => {
//           if (interval > 1000) {
//             reject(new Error(`${interval} is too large`));
//           }
//           resolve(interval);
//         }, interval);
//       });
//     }
//   });
//   it("the elements of result and intervals should be the same, except the elements of result include errors", function (done) {
//     promiseAllLimited(arr, 3).then((result) => {
//       result.forEach((res, index) => {
//         console.log(`result[${index}]: `, result[index]);
//         console.log(`intervals${index}: `, intervals[index]);
//         // expect(res).to.equal(intervals[index]);
//         if (intervals[index] > 1000) {
//           expect(res).to.be.a.instanceOf(Error);
//         } else {
//           expect(res).to.equal(intervals[index]);
//         }
//       });
//       done();
//     });
//   });
// });
