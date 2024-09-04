---
title: 实现一个管理puppeteer的pool池
description: 实现一个管理puppeteer的pool池
editLink: false
---

# {{ $frontmatter.title }}

## 需求描述
1. 每次执行时，需要创建一个浏览器上下文 context
2. 最多支持4个context在线

## 安装依赖

- generic-pool: [https://www.npmjs.com/package/generic-pool](https://www.npmjs.com/package/generic-pool)

```shell
npm i puppeteer generic-pool
```
## 实现代码

```js
const { createPool } = require("generic-pool");
const PPTM = require("./puppeteer-manager"); // 假设有一个公共方法用于创建puppeteer browser, 并且在断开时，自动再次创建

function createContextPool(){
    return createPool({
        // 创建
        create: async ()=>{
            if(!PPTM.browser) {
                await PPT.create()
            }
            const context = await PPTM.browser.createBrowserContext()
            
            // 重写close方法
            context._close = context.close.bind(context)
            context.close = async () =>{
                await context._close()
                await contextPool.destroy(context)
            }
            
            return context
        },
       
        // 销毁
        destroy: async (context) => {
            try {
                context.removeAllListeners()
                await context._close()
                return Promise.resolve()
            } catch (_) {
                return Promise.resolve()
            }
        },
        
        // 校验是否可用
        validate: async (context) =>{
            try {
                await context.browser.version(); // 尝试进行一次轻量操作，来验证是否有效
                return true
            } catch (_) {
                return  false
            }
        }
    },{
        min:1,
        max:4,
        autostart:false,
        acquireTimeoutMillis: 1 * 1000, // 每次请求context的等待时间，超过则会报错
        maxWaitingClients:20, // 最多排队等候的 请求
        idleTimeoutMillis: 10 * 1000, // 10秒内没有使用则释放资源
        evictionIntervalMillis: 30 * 1000, //30秒检测一次
    })
}

const contextPool = createPool()

module.exports = contextPool


```
## 如何使用

```js
 const context = await contextPool.acquire()  // 获取一个空闲的实例
 await contextPool.release(context) // 释放这个实例
 await contextPool.drain() // 等待所有的实例被释放，且不接收新的资源进入
 await contextPool.clear() // 销毁所有资源，通常在 程序关闭或重启时结合 drain() 调用
```
## 遇到的一些问题
1. 配合HTTP请求使用时，假设多个进程共享这个pool能否实现
2. Pool的create方法似乎是静态的，每次请求资源时无法动态传入参数
3. 或许并不需要这样严格的pool,手动写一个缓存器也能实现？
