### webview注意事项：
[https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)
- webview的网页url域名需要加入域名白名单
- 在 iOS 中，若存在JSSDK接口调用无响应的情况，可在 web-view 的 src 后面加个#wechat_redirect解决
- web-view 网页与小程序之间不支持除 JSSDK 提供的接口之外的通信
- 不可自定义导航栏，webview强制全屏且无法在上面覆盖小程序布局
### webview调试
- 真机调试的话，给网页添加vConsole:[https://github.com/Tencent/vConsole/blob/dev/README_CN.md](https://github.com/Tencent/vConsole/blob/dev/README_CN.md)
- 模拟器页面的右下角有个debug按钮，可调试webview网页