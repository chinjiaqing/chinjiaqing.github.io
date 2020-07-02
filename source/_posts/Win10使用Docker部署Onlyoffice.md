---
title: Win10使用Docker部署OnlyOffice
date: 2020-07-02 15:36:27
tags: onlyoffice
---
- 安装docker
- 拉取镜像
```shell
docker pull onlyoffice/documentserver
```
- 启动服务
```shell
docker run -i -t -d -p 8072:80 onlyoffice/documentserver
```