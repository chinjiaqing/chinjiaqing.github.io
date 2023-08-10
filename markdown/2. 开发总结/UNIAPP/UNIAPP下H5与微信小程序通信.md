<!--
 * @Author: Chin Jiaqing
 * @Date: 2023-08-10 15:21:16
 * @LastEditTime: 2023-08-10 15:21:41
 * @LastEditors: Chin Jiaqing
 * @Description: uniapp下H5与微信小程序通信
-->
## 需求背景
小程序需要做一个分享海报功能，海报内容需要动态生成。鉴于海报内容丰富，决定通过用H5渲染该页面，用`html2canvas` 绘制海报，最终将绘制好的图片base64传递给小程序。
在小程序的webview与小程序通讯时，有这一样一条官方文档说明：
> 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }，data 是多次 postMessage 的参数组成的数组
所以，从H5页面postMessage时，小程序只会在以下几种情况接收到消息并触发事件：
1. 页面跳转
2. 用户点击了分享
3. 组件销毁
## 基础代码
### 小程序
需要给webview绑定onMessage事件。
```vue
<template>
	<web-view  :src="src" @message="handleMessage"></web-view>
</template>
<script>
	export default {
		data() {
			return {
				src:'',
			}
		},
		onLoad(e) {
			this.src  = e.src || ''
		},
		methods: {
			handleMessage(e){
                console.log(e)
				let actions = e.detail.data
				let imageAction = actions.filter(v=>v.action == 'renderImage')
				if(imageAction && imageAction[0]){
					let action = imageAction[0]
					// handle onMessage Event
				}
			}
		}
	}
</script>
```
### H5
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>测试</title>
</head>
<body>
    <h1>webview postMessage test</h1>
    <!-- 微信JS SDK -->
    <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
    <!-- UNIAPP WEBVIEW SDK -->
    <script src="./uni.webview.1.5.5.js"></script>
    <!-- HTML2CANVAS -->
    <script src="./html2canvas.hertzen.com_dist_html2canvas.min.js"></script>
    <script>
        window.onload = () =>{
            html2canvas(document.body,{
                useCORS:true,
                allowTaint:true,
            }).then(function(canvas) {
                const base64 = canvas.toDataURL('image/jpeg',1)
                 uni.postMessage({
                    data: {
                        action: 'renderImage',
                        base64,
                    }
                });
                //  操作微信小程序 后退一页
                uni.navigateBack({ delta: 1 })
            });
        }
    </script>
</body>
</html>
```
## 页面跳转实现消息接收
在上诉代码中，H5加载完成后，html2canvas完成绘制，并控制小程序后退一页，最终小程序监听到了消息，如下图：
![action image](/image/action.png)
## 组件销毁
原理跟页面跳转差不多，可以通过页面重定向再后退回当前页面，或者v-if销毁webview组件
## 总结
方案都不是很完美，都要造成页面跳转，体验不太好。