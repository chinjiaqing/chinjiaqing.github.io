const path = require("path");
const ROOT_PATH = path.join(__dirname, "../");

module.exports = {
	path: {
		root: ROOT_PATH,
		markdown: path.join(ROOT_PATH, "markdown"),
		article: path.join(ROOT_PATH, "article"),
		backup:path.join(ROOT_PATH,'backup')
	},
	site: {
		name: "季夏拾陆",
		keywords: ["chinjiaqing"],
		description: "Chinjiaqing`s blog,Some writing about the front-end ...",
		copyright: "蜀ICP备2023007060号",
		author: "Chin Jiaqing",
	},
	assets: {
		css: {
			common: [
				"/assets/css/normalize.css",
				"/assets/css/base.css",
				"https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-webfont/1.1.0/style.min.css",
			],
			article: [
				"/assets/css/article.css",
				"/assets/highlight/styles/default.min.css",
				"/assets/highlight/styles/atom-one-light.min.css",
			],
			index: ["/assets/css/index.css"],
		},
		js: {
			common: [],
			article: ["/assets/highlight/highlight.min.js"],
			index: [],
		},
	},
};
