// 首页 编译
const ejs = require("ejs");
const { write, read } = require("../lib/utils");
const config = require("../config/index");
const path = require("path");
function buildHomeHtml() {
	const template = read(path.join(config.path.root, "template/index.ejs"));
	let html = ejs.render(template, {
		...config,
		css: [...config.assets.css.common, ...config.assets.css.index],
		js: [...config.assets.js.common, ...config.assets.js.index],
		keywordsText: config.site.keywords.join(","),
	});
	write(path.join(config.path.root, "index.html"), html);
	console.log(`dome`);
}
buildHomeHtml();
