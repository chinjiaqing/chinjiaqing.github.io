<!--
 * @Author: Chin Jiaqing
 * @Date: 2023-08-08 11:59:49
 * @LastEditTime: 2023-08-08 11:59:52
 * @LastEditors: Chin Jiaqing
 * @Description: 动态加载script
-->
在一些特殊的场景下，特别是一些库和框架的开发中，我们有时会去动态的加载 JS 文件并执行，下面是利用 Promise 进行了简单的封装
```javascript
function loadJS(files, done) {
  // 获取head标签
  const head = document.getElementsByTagName('head')[0];
  Promise.all(files.map(file => {
    return new Promise(resolve => {
      // 创建script标签并添加到head
      const s = document.createElement('script');
      s.type = "text/javascript";
      s.async = true;
      s.src = file;
      // 监听load事件，如果加载完成则resolve
      s.addEventListener('load', (e) => resolve(), false);
      head.appendChild(s);
    });
  })).then(done);  // 所有均完成，执行用户的回调事件
}

loadJS(["test1.js", "test2.js"], () => {
  // 用户的回调逻辑
});
```
