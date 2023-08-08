const util = require("util");
const dayjs = require("dayjs");
const config = require("../config/index");
function parseWordsCount(markdown) {
	const words = markdown
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
		.replace(/\s/g, "");
	return words.length;
}

function parseReadCost(count) {
	const WPM = 275;
	const m = count / WPM;
	const s = Math.ceil((m % 1) * 60);
	const time = `${Math.floor(m)}分${s}秒`;
	return time;
}

function renderArticleAsideNav(template = "") {
	const pattern = /<h([2-5]).*?>(.*?)<\/h\1>/g;
	let html = "",
		index = [];
	html += "<ul>\n";
	template = template.replace(pattern, function (all, num, text) {
		var level = num - 1;
		while (level > index.length) {
			index.push(0);
		}
		while (level < index.length) {
			index.pop();
		}
		index[index.length - 1] += 1;
		html += util.format(
			'<li class="level-%s"><a href="#%s">%s</a></li>',
			num,
			index.join("."),
			index.join(".") + " " + text
		);
		return util.format('<h%s id="%s">%s</h%s>', num, index.join("."), text, num);
	});
	html += "</ul>\n";
	return {
		aside: html,
		html: template,
	};
}

//解析markdown注释信息
function parseMarkdownHead(content = "") {
	const result = {
		author: config.site.author,
		create_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		update_at: "",
		description: "",
		id: "", //这里得到的id是不可靠的，如果没有解析出 @Date,则id为空，若是存在相同的@Date,则存在多个相同的id
		// 目前为止，这个id还未派上用场
	};
	/** 这样的注释才能被正确解析   --vscode插件  koroFileHeader 一键生成
	 * <!--
	 * @Author: Chin Jiaqing
	 * @Date: 2023-04-05 17:24:24
	 * @LastEditTime: 2023-04-05 18:47:13
	 * @LastEditors: Chin Jiaqing
	 * @Description:
	 * -->
	 */
	const noteMatch = content.match(/<!--([\s\S]*?)-->/);
	if (noteMatch) {
		const info = noteMatch[0];
		const createDateMatch = info.match(/@Date:([\s\S]*?)(\r\n|\n)/);
		const updateDateMatch = info.match(/@LastEditTime:([\s\S]*?)(\r\n|\n)/);
		const authorMatch = info.match(/@Author:([\s\S]*?)(\r\n|\n)/);
		const descMatch = info.match(/@Description:([\s\S]*?)(\r\n|\n)/);
		result.author = authorMatch && authorMatch[1] ? authorMatch[1].trim() : "";
		result.create_at = createDateMatch && createDateMatch[1] ? createDateMatch[1].trim() : "";
		result.update_at = updateDateMatch && updateDateMatch[1] ? updateDateMatch[1].trim() : "";
		result.description = descMatch && descMatch[1] ? descMatch[1].trim() : "";

		if (createDateMatch && createDateMatch[1]) {
			result.id = new Date(createDateMatch[1]).getTime();
		}
	}
	return result;
}

module.exports = {
	parseReadCost,
	parseWordsCount,
	renderArticleAsideNav,
	parseMarkdownHead,
};
