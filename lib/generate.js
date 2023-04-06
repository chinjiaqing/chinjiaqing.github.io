/*
 * @Author: Chin Jiaqing
 * @Date: 2023-04-06 11:51:13
 * @LastEditTime: 2023-04-06 12:02:50
 * @LastEditors: Chin Jiaqing
 * @Description: 
 */
const MD = require("./md")
const Render = require("./render")
const path = require('path')
const { mkdirp } = require('mkdirp');
const { read, write } = require("./utils")
const ARTICLE_TPL_PATH = path.join(__dirname, '../template/article.tpl')
const INDEX_TPL_PATH = path.join(__dirname, '../template/index.tpl')
const ABOUT_TPL_PATH = path.join(__dirname, '../template/about.tpl')
const PATTERN_TREE_TAG = /<r-tree\s*\/>/g;

let _template;

// 生成 文章html
const generateArticleHtml = (current, target) => {
    if (!_template) {
        _template = read(ARTICLE_TPL_PATH)
    }
    // 创建文件夹
    mkdirp.sync(path.dirname(target))
    // 读取markdown
    const content = read(current)
    // 解析markdown
    const article = MD.render(content)
    // 渲染网页
    const render = new Render(_template, 'article')
    const title = path.basename(current, '.md')
    render.generate(title, article, content)
    write(target, render.html)
}

// 生成首页 html
const generateIndexHtml = (navHtml) => {
    const tpl = read(INDEX_TPL_PATH)
    const render = new Render(tpl, 'index')
    const html = render.html.replace(PATTERN_TREE_TAG, navHtml)
    write(path.join(__dirname, '../index.html'), html)
}

//生成 about html
const generateAboutHtml = _ => {
    const tpl = read(ABOUT_TPL_PATH)
    const render = new Render(tpl, 'about')
    write(path.join(__dirname, '../about.html'), render.html)
}


module.exports = {
    generateArticleHtml,
    generateIndexHtml,
    generateAboutHtml
}