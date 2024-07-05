<a name="module_PromiseAllLimited"></a>

## PromiseAllLimited
PromiseAllLimited

<a name="module_PromiseAllLimited..promiseAllLimited"></a>

### PromiseAllLimited~promiseAllLimited(promises, [limited]) ⇒ <code>Array.&lt;any&gt;</code>
## 有着并发限制的PromiseAll方法
### 功能描述
给定一个数组`Array<Promise>`, 以及并发限制数，将数组中的并发请求一一执行，每执行完一个请求后，在未达到并发限制数时取下一个请求继续执行，一直到执行完所有请求.

### 使用范例
```js
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
```

**Kind**: inner method of [<code>PromiseAllLimited</code>](#module_PromiseAllLimited)  
**Returns**: <code>Array.&lt;any&gt;</code> - 响应的结果数组  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| promises | <code>Array.&lt;Promise&gt;</code> |  | 待并发执行的Promise数组 |
| [limited] | <code>number</code> | <code>6</code> | 并发限制数 |

