const md = require("./lib/md");
const fs = require("fs");
const path = require("path");
const dree = require("dree");
const { deleteDir, read, write } = require("./lib/utils");
const config = require("./config/index");
const MD = require("./lib/md");
const ejs = require("ejs");
const { mkdirp } = require("mkdirp");
const articleEjsTemplate = read("./template/article.ejs");
const { parseWordsCount, parseReadCost, renderArticleAsideNav, parseMarkdownHead } = require("./lib/render");

function handleMarkdownFile(item) {
	if (!item) return "";
	//path.sep
	// 替换 markdown/ -> article/
	const articlePath = item.path.replace("markdown" + path.sep, "article" + path.sep);

	if (item.type === "file") {
		if (item.extension === "md") {
			const markdown = read(item.path);
			const content = MD.render(markdown);
			const count = parseWordsCount(markdown);
			const readTimeStr = parseReadCost(count);
			const info = parseMarkdownHead(markdown);
			const article = renderArticleAsideNav(content)
			let html = ejs.render(articleEjsTemplate, {
				config,
				title: item.name,
				content: article.html,
				css: [...config.assets.css.common, ...config.assets.css.article],
				js: [...config.assets.js.common, ...config.assets.js.article],
				count: count > 1000 ? (count / 1000).toFixed(1) + "k" : count,
				readTimeStr,
				asideHtml: article.aside,
				...info,
			});
			mkdirp.sync(path.dirname(articlePath));
			write(articlePath.replace(".md", ".html"), html);
		}
		if (item.extension === "html") {
		}
	}
	if (item.type === "directory" && item.children.length) {
		for (let child of item.children) {
			handleMarkdownFile(child);
		}
	}
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
		handleMarkdownFile(item);
	}
})();
