---
title: docker常见容器安装
description: docker常见容器安装
editLink: false
---

# {{ $frontmatter.title }}

作为一个新手，备忘一下。

## 安装 Mysql8

### 录取官方镜像

```bash
docker pull mysql:8.0.35  # 或指定其他版本如8.0.22、8.3.0
```

### 创建宿主主机挂载目录

```bash
mkdir -p /docker/mysql/{data,conf,logs}
chmod -R 755 /docker/mysql  # 确保目录权限
```

### 自定义配置

在宿主主机`/docker/mysql/conf`下创建`my.cnf`

```bash
# 确保目录存在（如果已创建可跳过）
sudo mkdir -p /docker/mysql/conf

# 进入目录
cd /docker/mysql/conf
```

```bash
sudo vi my.cnf
```

```ini
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
default-time-zone=+08:00
max_connections=1000
lower_case_table_names=1  # 表名大小写不敏感（仅首次启动前有效）

[client]
default-character-set=utf8mb4
```

确保文件权限

```bash
# 确保文件权限可被容器读取
sudo chmod 644 /docker/mysql/conf/my.cnf
```

### 启动容器 & 数据持久化

```bash
docker run -d \
--name mysql8 \
-p 3307:3306 \  # 推荐使用非默认端口（如3307）提升安全性
-v /docker/mysql/data:/var/lib/mysql \
-v /docker/mysql/conf:/etc/mysql/conf.d \
-v /docker/mysql/logs:/var/log/mysql \
-e MYSQL_ROOT_PASSWORD=YourStrongPassword123! \  # 使用强密码
--restart=always \
mysql:8.0.35
```

### 开启远程访问

进入 docker 并登录 mysql

```bash
docker exec -it mysql8 bash
mysql -u root -p
```

执行 sql 命令：

```mysql
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'YourStrongPassword123!';  # 修改加密方式
UPDATE mysql.user SET host='%' WHERE user='root';
FLUSH PRIVILEGES;
```
