# 自动解析 markdown 生成静态.html

只需要更新 md 文件并 push 到 github，自动生成 html 并发布。

> 预览地址：[https://chinjiaqing.github.io/](https://chinjiaqing.github.io/)

## 实现原理

主要是利用 [markdown-it](https://github.com/markdown-it/markdown-it) 将 markdown 文件解析成 html 内容再动态写入到.html 文件即可。
每次 push 后利用 action 自动 build,再由 github-pages 发布为静态站点。

## 约定

- markdown 存放.md 文件
- article html 输出文件
- config 配置文件
- build.js github action 执行的脚本文件
- lib build 相关的 js 目录
- assets 静态资源
- template 网页模板模块

## 文章日期

平时写作用 vscode，有个插件叫 `koroFileHeader` ，能快捷生成如下的文件头部注释，就利用这种注释匹配 `@Date` 解析出日期。

```html
<!--
 * @Author: Chin Jiaqing
 * @Date: 2023-04-05 23:47:14
 * @LastEditTime: 2023-04-05 23:47:33
 * @LastEditors: Chin Jiaqing
 * @Description:
-->

# test 看下能否自动 build from test.md
```

## 已知问题

1. 无排序：解析只能按文件夹及文件的读取顺序，无法按实际修改/增加的顺序
