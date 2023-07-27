<!--
 * @Author: Chin Jiaqing
 * @Date: 2023-04-06 22:40:52
 * @LastEditTime: 2023-04-06 22:42:53
 * @LastEditors: Chin Jiaqing
 * @Description:
-->

Nuxt 的缓存可以分为组件级别的缓存，API 级别的缓存和页面级别的缓存

## 组件级别的缓存

在 nuxt.config.js 中编写相关配置：

```javascript
const LRU = require("lru-cache"); // 需要先安装该依赖
module.exports = {
  render: {
    bundleRenderer: {
      cache: LRU({
        max: 1000, // 最大的缓存个数
        maxAge: 1000 * 60 * 15, // 缓存15分钟
      }),
    },
  },
};
```

然后需要在 vue 组件上增加一些相关属性：

```javascript
export default {
  name: "AppHeader",
  props: ["type"],
  serverCacheKey: (props) => props.type,
};
```

上述组件会根据父组件传下来的 type 值去做缓存，键值是： AppHeader::${props.type} ，由此，新的请求到来时，只要父组件传下来的 type 属性之前处理过，就可以复用之前的渲染缓存结果，以增进性能。
从该例子可以看出，如果该组件除了依赖父组件的 type 属性，还依赖于别的属性， serverCacheKey 这里也要做出相应的改变，因此，如果组件依赖于很多的全局状态，或者，依赖的状态取值非常多，意味需要缓存会被频繁被设置而导致溢出，其实就没有多大意义了，在 lru-cache 的配置中，设置的最大缓存个数是 1000，超出部分就会被清掉
其次，不应该缓存可能对渲染上下文产生副作用的子组件，比如，组件的 created 与 beforeCreated 的钩子在服务端也会走，组件被缓存后就不会执行了，这些可能影响到渲染上下文的地方也要小心，更多内容请参考：[组件级别缓存](https://cn.vuejs.org/guide/scaling-up/ssr.html#why-ssr)
一般来说，比较适合的场景是 v-for 大量数据的渲染，因为循环操作比较耗 cpu

## API 级别的缓存

通常是对 axios 进行缓存标识，代码如下：

```javascript
import axios from "axios";
import md5 from "md5";
import LRU from "lru-cache";

// 给api加3秒缓存
const CACHED = LRU({
  max: 1000,
  maxAge: 1000 * 3,
});

function request(config) {
  let key;
  // 服务端才加缓存，浏览器端就不管了
  if (config.cache && !process.browser) {
    const { params = {}, data = {} } = config;
    key = md5(config.url + JSON.stringify(params) + JSON.stringify(data));
    if (CACHED.has(key)) {
      // 缓存命中
      return Promise.resolve(CACHED.get(key));
    }
  }
  return axios(config).then((rsp) => {
    if (config.cache && !process.browser) {
      // 返回结果前先设置缓存
      CACHED.set(key, rsp.data);
    }
    return rsp.data;
  });
}
```

使用时新增 cache 标识来判断是否需要做缓存

```javascript
const api = {
  getGames: (params) =>
    request({
      url: "/gameInfo/gatGames",
      params,
      cache: true,
    }),
};
```

## 页面级别的缓存

页面级别的话，需要编写中间件，对每次的 url 访问都进行缓存判断，比如之前的 Nuxt 项目有帖子模块，在一次 push 推送后并发量很大， 便采用的页面级的缓存。大致代码如下：

### 编写 cache 中间件

新建 cache.js

```javascript
const LRU = require('lru-cache');
const urlib = require("url");
export pageCache = new LRU({
    max: 1000, // 缓存队列长度 最大缓存数量
    maxAge: 1000 * 2 * 60, // 缓存时间 单位：毫秒
});

export default function (req, res, next) {
    const url = req._parsedOriginalUrl;
    const pathname = url ? (url.pathname || '') : '';
    let topicId = ''
    const reqParams = urlib.parse(req.url, true)
    if (pathname === '/topic') { // 这里是 针对topic这个url进行缓存，也可以在地址栏加参数，如cache=1这种来判断是否要缓存
        topicId = reqParams.query.topicId || ''
    }
    if (topicId) { // 这是对帖子id进行了判断
        const params = {}
        // const { token, uid } = req;
        const cacheKey = ['topic', topicId, 'page'].join('-') //生成一个缓存key
        const cacheHtml = cachePage.get(cacheKey);
        if (cacheHtml) {
            //  如果没有Content-Type:text/html 的 header，gtmetrix网站无法做测评
            res.writeHead(200)
            return res.end(cacheHtml.html, 'utf-8');
        } else {
            res.original_end = res.end;
            res.end = function (data) {
                if (res.statusCode === 200) {
                    // 设置缓存
                    cachePage.set(cacheKey, {
                        html: data,
                    });
                }
                return res.original_end(data, 'utf-8');
            };
        }
    }

    return next();

}
```

### 在 nuxt.config.js 中配置中间件

```javascript
module.exports = {
  // ...
  serverMiddleware: ["~/server/middleware/cache.js"],
  // ...
};
```
