const path = require("path");
const ROOT_PATH = path.join(__dirname, "../");

module.exports = {
	path: {
		root: ROOT_PATH,
		markdown: path.join(ROOT_PATH, "markdown"),
		article: path.join(ROOT_PATH, "article"),
		backup: path.join(ROOT_PATH, "backup"),
	},
	site: {
		name: "季夏拾陆",
		keywords: ["chinjiaqing"],
		description: "Chinjiaqing`s blog,Some writing about the front-end ...",
		copyright: "蜀ICP备2023007060号",
		author: "Chin Jiaqing",
	},
	resume: {
		description:
			"一名前端工程师，从事过SASS财务软件、电商、社区医药、直播等行业，对于web开发、小程序开发和移动端H5开发有丰富经验。",
		skills: [
			"Vue",
			"Nodejs",
			"Uniapp",
			"Electron",
			"PHP",
			"Nuxtjs",
			"SSR",
			"Mysql",
			"Vite",
			"QianKun",
			"Eggjs",
			"Laravel",
		],
		github: "https://github.com/chinjiaqing",
		email: "chinjiaqing@qq.com",
		job: "前端工程师",
		age: new Date().getFullYear() - 1996,
		city: "四川·成都",
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
