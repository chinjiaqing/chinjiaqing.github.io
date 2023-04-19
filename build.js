const fs = require("fs")
const path = require("path")
const dree = require('dree');
const { deleteDir } = require("./lib/utils")
const { generateArticleHtml, generateIndexHtml, generateAboutHtml } = require("./lib/generate")
const ARTICLE_FOLDER_NAME = 'article'
const ARTICLE_BACKUP_FOLDER_NAME = 'article-backup'
const MARKDOWN_FOLDER_NAME = 'markdown'


const parseMarkdownTree = (item, topLevel = 2) => {
    if (!item) return ''
    let html = ''
    if (item.type === 'file') {
        if (item.extension === 'md') {
            const target = item.path.replace(MARKDOWN_FOLDER_NAME, ARTICLE_FOLDER_NAME).replace('.' + item.extension, '.html')
            const link = target.replace(__dirname, '')
            // 生成文章
            generateArticleHtml(item.path, target)
            html += `<li class="level4"><a href="${link}">${path.basename(target)}</a></li>`
        }
    }
    if (item.type === 'directory') {
        html += `<li class="level${topLevel}">${item.name}</li>`
        for (let i = 0; i < item.children.length; i++) {
            html += parseMarkdownTree(item.children[i], topLevel + 1)
        }
    }
    return html
}

    ; (async () => {
        if (fs.existsSync(ARTICLE_FOLDER_NAME)) {
            deleteDir(path.join(ARTICLE_BACKUP_FOLDER_NAME))
            // fs.renameSync(ARTICLE_FOLDER_NAME, ARTICLE_BACKUP_FOLDER_NAME)
        }
        const markdownTree = dree.scan(MARKDOWN_FOLDER_NAME)
        if (markdownTree && markdownTree.children && markdownTree.children.length) {
            let navHtmlGroup = []
            let items = markdownTree.children
            try {
                for (let i = 0; i < items.length; i++) {
                    const html = parseMarkdownTree(items[i], 2)
                    navHtmlGroup.push(`<nav><ul>${html}</ul></nav>`)
                }
            } catch (err) {
                // if (fs.existsSync(ARTICLE_BACKUP_FOLDER_NAME)) {
                //     deleteDir(path.join(ARTICLE_FOLDER_NAME))
                //     fs.renameSync(ARTICLE_BACKUP_FOLDER_NAME, ARTICLE_FOLDER_NAME)
                // }
            }

            // 生成首页
            generateIndexHtml(navHtmlGroup.join(''))
        }
        // 生成about页面
        generateAboutHtml()
    })()