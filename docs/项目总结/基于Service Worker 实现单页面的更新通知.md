---
title: 基于Service Worker 实现单页面的更新通知
description: 基于Service Worker 实现单页面的更新通知
editLink: false
---

# {{ $frontmatter.title }}

无需后端参与便可以完成单页面的更新提醒。

## 关于 Service Worker API
[https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)

## 具体实现步骤

### 版本记录

在public下新建一个 version.sw.js ，这个js文件无需代码逻辑，只需要记录版本号即可

**注意：这个文件需要放在public目录下**

```js
// version: 1.0.0
```
### 注册用于更新的 service worker

新建一个 `update.sw.ts`

```ts


// 显示自定义的提醒弹窗，可以引用vue组件
function showUpdatePrompt() {
    const useUpdate = window.confirm("发现新版本，是否更新")
    useUpdate && window.location.reload()
}

export function registerSw() {
    if ("serviceWorker" in navigator) { // 先判断是否支持 serviceWorker特性
        navigator.serviceWorker
        .register("/version.sw.js", {
            updateViaCache: "none", // 所有依赖都不缓存
        })
        .then((registration) => {
            let updateTimerId = setInterval(async () => {
                await registration.update();  // 这里实现自定义轮询更新，10秒钟轮询一次
                console.log(`检测更新`);
            }, 10 * 1000);
            registration.onupdatefound = () => {
                updateTimerId && clearInterval(updateTimerId);
                const installingWorker = registration.installing;
                if (installingWorker) {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                            // 新的 Service Worker 已被安装，并且控制页面
                            showUpdatePrompt();
                        }
                    };
                }
            };
        })
        .catch((err) => {
            console.error("Service Worker registration failed:", err);
        });
    }
}

```
在 `main.ts` 中 引用该文件

```ts
import  { registerSw } from "./update.sw"

// app.mount("#app")

registerSw()

```
当我们手动修改 version.sw.js 中的内容时，便会触发更新提醒。

### 借助 standard-version 自动化修改 version.sw.js

在根目录下新建 `version.bin.js`，用于自动化生成 `version.sw.js`，并放在`dist` 目录中。
这个文件的作用是读取 `package.json` 中的版本号，并写入到文件中。

而手动更改 version 是不太明智的选择，所以借助 `standard-version` 来自动增加版本号。

- standard-version：[https://www.npmjs.com/package/standard-version](https://www.npmjs.com/package/standard-version)

```js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "./package.json" assert { type: "json" };

// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义文件路径
const distSwFilePath = path.resolve(__dirname, "dist/version.sw.js");

// 读取 package.json 中的版本号
const version = pkg.version;

// 定义要插入的版本号行，并添加换行符
const versionTxt = `// version: ${version}`;

// 将新的内容写回 /dist/sw.js 文件
fs.writeFileSync(distSwFilePath, versionTxt, "utf-8");

console.log("version.sw.js 文件已更新，版本号:", version);


```
在 `package.json` 中新增 `postbuild` 脚本命令, `postbuild` 是一个 npm 的 hooks，表示在执行`build`之后执行。

```json
{
  "scripts": {
    "postbuild": "node version.bin.js"
  }
}
```
