### 16进制颜色转rgba
```js
function hexToRgba(hexColor, alpha = 0.5) {
	// 移除 # 号并提取颜色值
	let hex = hexColor.replace("#", "");
	// 将颜色值拆分成 R、G、B 三个部分
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);
	// 转换为 RGBA 格式并添加透明度
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```
### 获取类型
```js
function getType (o) {
  return Object.prototype.toString.call(o).match(/\[object (.*?)\]/)[1].toLowerCase()
}
```