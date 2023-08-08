const fs = require("fs");
const path = require("path");

const read = (pathname) => {
	return fs.readFileSync(pathname, "utf-8");
};

const write = (pathname, data) => {
	fs.writeFileSync(pathname, data);
};

const deleteDir = (url) => {
	let files = [];
	if (fs.existsSync(url)) {
		//判断给定的路径是否存在
		files = fs.readdirSync(url); //返回文件和子目录的数组
		files.forEach(function (file, index) {
			var curPath = path.join(url, file);
			if (fs.statSync(curPath).isDirectory()) {
				//同步读取文件夹文件，如果是文件夹，则函数回调
				deleteDir(curPath);
			} else {
				fs.unlinkSync(curPath); //是指定文件，则删除
			}
		});
		fs.rmdirSync(url); //清除文件夹
	}
};

module.exports = {
	read,
	write,
	deleteDir,
};
