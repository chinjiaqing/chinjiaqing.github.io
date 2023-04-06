const fs = require('fs');
const path = require('path');


const read = pathname => {
    return fs.readFileSync(pathname, 'utf-8');
}

const write = (pathname, data) => {
    fs.writeFileSync(pathname, data);
}

const deleteDir = url => {
    let files = []
    if (fs.existsSync(url)) {  //判断给定的路径是否存在
        files = fs.readdirSync(url);   //返回文件和子目录的数组
        files.forEach(function (file, index) {
            var curPath = path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) { //同步读取文件夹文件，如果是文件夹，则函数回调
                deleteDir(curPath);
            } else {
                fs.unlinkSync(curPath);    //是指定文件，则删除
            }

        });
        fs.rmdirSync(url); //清除文件夹
    }
}

const calcMarkdownWordsCount = markdown => {
    const words = markdown.replace(/(\*)(.*?)(\*)/g, (a, b, c) => c)
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
    return words.length
}

module.exports = {
    write, read, deleteDir, calcMarkdownWordsCount
}