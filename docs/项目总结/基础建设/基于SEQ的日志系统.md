---
title: 基于SEQ的日志系统
description: 基于SEQ的日志系统
editLink: false
---

# {{ $frontmatter.title }}

Seq 官方网站：[https://datalust.co/seq](https://datalust.co/seq)

## 下载安装

按照官网教程即可，略过。

## 工作区间 Workspace

Seq 的免费版仅支持一个用户，目前看来`workspace`似乎没啥实际用处。

![/seq/Snipaste_2025-04-27_16-26-50.png](/seq/Snipaste_2025-04-27_16-26-50.png)

## 标志 Signals

可以理解为自定义的快捷查询方式。

![/seq/Snipaste_2025-04-27_16-31-48.png](/seq/Snipaste_2025-04-27_16-31-48.png)

## 结合 API-KEYS 和 Signals 实现日志分类

可以理解为一个`API-Key`对应一个应用，如果我们有多个应用使用同一个日志系统，那么可能需要对应多个不同`API-KEY`。

### API-KEY 配置

其中，自定义属性很关键，用来后面自定义`Signal`实现快速分类查询。
*(当然，你也可以在你的日志代码中来定义这个属性)*

![/seq/Snipaste_2025-04-27_16-37-56.png](/seq/Snipaste_2025-04-27_16-37-56.png)

### Signal 实现应用分类

新增一个`Signal`，点击下拉箭头以`JSON`模式编辑，参考如下：

![/seq/Snipaste_2025-04-27_16-44-05.png](/seq/Snipaste_2025-04-27_16-44-05.png)

### Signal 扩展

按上面的思路，假设每个应用，有不同的业务模块，同样可以为每个模块注入单独的日志属性，如用户模块：`__LOG_NAME='user'`，最后再归纳一下如下：

![/seq/Snipaste_2025-04-27_16-45-59.png](/seq/Snipaste_2025-04-27_16-45-59.png)

## Winston 中使用 Seq

### 安装依赖

```bash
pnpm add @datalust/winston-seq
```

### 添加 Transport

```ts
    new SeqTransport({
        serverUrl: this.configService.get<string>('SEQ_HOST'),
        apiKey: this.configService.get<string>('SEQ_SECRET'),
        onError: (e) => {
            console.error(`SeqTransport Error`, e);
        },
        format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf((info: Logform.TransformableInfo) => {
            // return printfMessagePayload(info); 自定义格式化消息
            return info
        }),
        ),
        handleExceptions: true,
        handleRejections: true,
    }),
```
