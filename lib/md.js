const hljs = require('highlight.js')
const MarkdownIt = require('markdown-it')
// https://github.com/markdown-it/markdown-it
module.exports = new MarkdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    },
    breaks: true,
    typographer: true
})