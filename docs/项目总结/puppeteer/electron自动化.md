---
title: puppeteer连接electron实现自动化控制
description: puppeteer连接electron实现自动化控制
editLink: false
---

# {{ $frontmatter.title }}

嗯...,  这个场景看上去似乎有点多此一举？但在取一些页面数据时很有用。

## 安装依赖

```bash
# 安装puppeteer-core 不需要安装浏览器内核
pnpm install puppeteer-core
# electron
pnpm install electron
```

## 打开 electron 调试模式

在 `main\index.ts` 中，`app.whenReady` 之前执行如下代码：

```ts
// 调式端口可自行约定
const DEBUT_PORT: number = 6789;
const DEBUG_HOST: string = "localhost";

app.commandLine.appendSwitch("remote-debugging-port", DEBUG_PORT);
app.commandLine.appendSwitch("remote-debugging-address", DEBUG_HOST);
```

## puppeteer 连接

puppeteer 的连接建议在窗口完成后进行（其他情况未作尝试），只需要连接一次。 在 `main\browser.ts` 中实现连接代码如下：

```ts
// browser.ts
import http from "http";
import puppeteer, { Browser } from "puppeteer";

//  第一步，获取 electron 的 调试url

interface ElectronDebugJsonItem {
	description: string;
	devtoolsFrontendUrl: string;
	id: string;
	title: string;
	type: string;
	url: string;
	webSocketDebuggerUrl: string;
}

const getElectronDebugJsonList = async (): Promise<ElectronDebugJsonItem[]> => {
	new Promise((resolve, reject) => {
		let json = "";
		const request = http.request(`http://${DEBUG_HOST}:${DEBUG_PORT}/json/list`, (response) => {
			response.on("error", reject);
			response.on("data", (chunk: Buffer) => {
				json += chunk.toString();
			});
			response.on("end", () => resolve(JSON.parse(json)));
		});
		request.on("error", reject);
		request.end();
	});
};

// 第二步，puppeteer连接方法

export async function puppeteerConnect(): Promise<Browser> {
	const list = await getElectronDebugJsonList();
	// 这里任选一个url进行连接即可
	const url = "http://" + DEBUG_HOST + ":" + DEBUG_PORT + json[0].devtoolsFrontendUrl;
	//  注意不要使用 browserWSEndpoint 进行连接，会报错。。
	return await puppeteer.connect({
		browserURL: url,
		defaultViewport: null,
	});
}
```

## puppeteer 如何操控网页

在 `electron` 中通常一个 `BrowserWindow` 对应一个页面，即 `puppeteer` 中的一个 `Page`, 假设你的 `electron` 程序有多个窗口，那么 `puppeteer` 的 `Browser` 就会有多个 `Page`, 如下图所示：

![puppeteer-electron.png](/puppeteer/puppeteer-electron.png)

所以，当我们需要操作页面( `BrowserWindow` )时，则需要根据 `BrowserWindow` 拿到对应的 `Page`：

```ts
import type { Browser, Page } from "puppeteer";
import type { BrowserWindow } from "electron";

export function getPage(browser: Browser, wind: BrowserWindow): Promise<Page | null> {
	if (wind.webContents.getURL() === "") {
		// 如果是空窗口，则默认打开一个空白网页
		await wind.webContents.loadURL("about:blank");
	}

	const uid:string = Math.random() + ''; // 生产一个唯一标识
	await wind.webContents.executeJavaScript(`window.__UNIQ_ID__="${uid}"`); //将全局变量写入页面
	const pages = await browser.pages(); // 获取puppeteer的全部页面
	const ids = await Promise.all(
		pages.map(async (page) => {
			try {
				return await page.evaluate("window.__UNIQ_ID__");
			} catch {
				return undefined;
			}
		})
	);
	const index = ids.findIndex((id) => id === uid); // 拿到对应的page
	await wind.webContents.executeJavaScript("delete window.__UNIQ_ID__"); //删除全局变量
	return pages[index] || null;
}
```

## 参考资料

- [https://github.com/TrevorSundberg/puppeteer-in-electron](https://github.com/TrevorSundberg/puppeteer-in-electron)
- [https://juejin.cn/post/7444660960264192034](https://juejin.cn/post/7444660960264192034)
