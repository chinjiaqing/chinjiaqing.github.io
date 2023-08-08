const fs = require("fs");
const path = require("path");
const dree = require("dree");
const dayjs = require("dayjs");
const { deleteDir, read, write } = require("./lib/utils");
const config = require("./config/index");
const MD = require("./lib/md");
const ejs = require("ejs");
const { mkdirp } = require("mkdirp");
const articleEjsTemplate = read("./template/article.ejs");
const { parseWordsCount, parseReadCost, renderArticleAsideNav, parseMarkdownHead } = require("./lib/render");

let articleCategoryHtml = "";
let articles = [];
function handleMarkdownFile(item) {
	if (!item) return "";
	//path.sep
	// 替换 markdown/ -> article/
	const articlePath = item.path.replace("markdown" + path.sep, "article" + path.sep);
	const title = item.name.replace("." + item.extension, "");
	item.title = title;
	if (item.type === "file") {
		if (item.extension === "md") {
			// 文章标题
			// 文章访问地址
			const href = articlePath.replace(config.path.root, "/").replace(".md", ".html").replaceAll(path.sep, "/");
			// 文章markdown 内容
			const markdown = read(item.path);
			const content = MD.render(markdown);
			// 文章字数
			const count = parseWordsCount(markdown);
			// 文章阅读时间
			const readTimeStr = parseReadCost(count);
			// 文章头部信息
			const info = parseMarkdownHead(markdown);
			// 文章侧边标题栏
			const article = renderArticleAsideNav(content);
			// 文章html内容
			let html = ejs.render(articleEjsTemplate, {
				config,
				title,
				contentHtml: article.html,
				css: [...config.assets.css.common, ...config.assets.css.article],
				js: [...config.assets.js.common, ...config.assets.js.article],
				countStr: (count / 1000).toFixed(1) + "k",
				readTimeStr,
				asideHtml: article.aside,
				...info,
				navHtml: articleCategoryHtml,
			});
			mkdirp.sync(path.dirname(articlePath));
			write(articlePath.replace(".md", ".html"), html);

			// 绑定额外信息
			item.href = href;
			item.info = info;
		}
		if (item.extension === "html") {
		}
	}
	if (item.type === "directory") {
		if (item.children && item.children.length) {
			for (let child of item.children) {
				handleMarkdownFile(child);
			}
		}
	}
}

function handleArticleCategoryHtml(item, level) {
	if (!item) return "";
	const articlePath = item.path.replace("markdown" + path.sep, "article" + path.sep);
	const href = articlePath.replace(config.path.root, "/").replace(".md", ".html").replaceAll(path.sep, "/");
	const title = item.name.replace("." + item.extension, "");
	let html = "";
	item.title = title;
	if (item.type === "file") {
		html += `<div class="top-${level} flex item file">
								<ion-icon name="document-outline"></ion-icon>
								<a href="${href}">${item.name}</a>
							</div>`;
		const markdown = read(item.path);
		const info = parseMarkdownHead(markdown);

		articles.push({
			title,
			href,
			name: item.name,
			timeStr: info.create_at || dayjs().format("YYYY-MM-DD HH:mm:ss"),
			timestamp: info.create_at ? new Date(info.create_at).getTime() : -1,
			content: markdown
				.replace(/<!--([\s\S]*?)-->/, "")
				.replace(/(\*)(.*?)(\*)/g, (a, b, c) => c)
				//全局匹配内联代码块
				.replace(/`{1,2}[^`](.*?)`{1,2}/g, (a, b) => b)
				//全局匹配代码块
				// .replace(/```([\s\S]*?)```[\s]*/g, (a, b) => b)
				//全局匹配删除线
				.replace(/\~\~(.*?)\~\~/g, (a, b) => b)
				//全局匹配无序列表
				.replace(/[\s]*[-\*\+]+(.*)/g, (a, b) => b)
				//全局匹配有序列表
				.replace(/[\s]*[0-9]+\.(.*)/g, (a, b) => b)
				//全局匹配标题
				.replace(/(#+)(.*)/g, (a, b, c, d) => c)
				//全局匹配摘要
				.replace(/(>+)(.*)/g, (a, b, c) => c)
				//全局匹配换行
				.replace(/\r\n/g, "")
				//全局匹配换行
				.replace(/\n/g, "")
				.replace(/\s/g, "")
				.substr(0, 300),
		});
	}
	if (item.type === "directory") {
		html += `<div class="top-${level} flex item">
						<ion-icon name="folder-outline"></ion-icon>
						<span>${title}</span>
						<ion-icon class="arrow" name="chevron-forward-outline"></ion-icon>`;
		if (item.children && item.children.length) {
			for (let child of item.children) {
				html += handleArticleCategoryHtml(child, level + 1);
			}
		}
		html += `</div>`;
	}
	return html;
}

function buildHomeHtml(recentHtml,moreLink) {
	const template = read(path.join(config.path.root, "template/index.ejs"));
	let html = ejs.render(template, {
		...config,
		css: [...config.assets.css.common, ...config.assets.css.index],
		js: [...config.assets.js.common, ...config.assets.js.index],
		keywordsText: config.site.keywords.join(","),
		recentHtml,
		moreLink,
	});
	write(path.join(config.path.root, "index.html"), html);
}

(async () => {
	if (!fs.existsSync(config.path.article)) {
		fs.mkdirSync(config.path.article);
	}
	if (fs.existsSync(config.path.backup)) {
		deleteDir(config.path.backup);
		fs.renameSync(config.path.article, config.path.backup);
	} else {
		fs.mkdirSync(config.path.backup);
	}

	const rootMd = dree.scan(config.path.markdown);
	const mdList = rootMd.children;

	for (let item of mdList) {
		articleCategoryHtml += handleArticleCategoryHtml(item, 1);
	}
	for (let item of mdList) {
		handleMarkdownFile(item);
	}
	write(path.join(config.path.root, "assets/js/data.js"), "window.__ARTICLES__=" + JSON.stringify(mdList));
	articles.sort((a, b) => b.timestamp - a.timestamp);
	let recentHtml = "";
	for (let i = 0; i < 3; i++) {
		let a = articles[i];
		if (!a) break;
		recentHtml += `
		<div class="item flex flex-column">
                    <p class="flex"><span></span>${a.timeStr}</p>
                    <div class="sub flex flex-column">
                        <h4>${a.title}</h4>
                        <p>${a.content}</p>
                        <a href="${a.href}">查看全文</a>
                    </div>
                </div>
		`;
	}
	let m = articles[0] || ''
	buildHomeHtml(recentHtml,m ? m.href : '');
})();
