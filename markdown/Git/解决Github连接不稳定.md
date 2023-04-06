Github 经常会出现即使翻墙也连不上的问题，经过搜索，发现修改 host 文件比较靠谱。

## 修改 host 文件

打开文件：**C:\Windows\System32\drivers\etc\hosts**

访问比较慢的域名有：`github.com` 、`githubusercontent.com` 等等。主要的还是`github.com` , 然后在 [https://ip138.com](https://ip138.com) 或者 [https://www.ipaddress.com](https://www.ipaddress.com) 查询一下域名对应的 ip,按下面的格式添加到 hosts 文件中即可。

```bash
# GitHub Start

	20.205.243.166     github.com
#	140.82.114.20      gist.github.com
#	199.232.69.194     github.global.ssl.fastly.net
#	151.101.184.133    assets-cdn.github.com
#	151.101.184.133    raw.githubusercontent.com
#	199.232.28.133     raw.githubusercontent.com
#	151.101.184.133    gist.githubusercontent.com
#	151.101.184.133    cloud.githubusercontent.com
#	151.101.184.133    camo.githubusercontent.com
#	199.232.96.133     avatars.githubusercontent.com

# GitHub End
```

## 刷新 DNS

打开 `cmd`,执行以下语句刷新 DNS 即可：

```bash
ipconfig/flushdns
```
