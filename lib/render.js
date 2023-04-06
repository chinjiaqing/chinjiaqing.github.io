const util = require('util')
const dayjs = require('dayjs')
const config = require("../config/index");
const { read, calcMarkdownWordsCount } = require("./utils");
const path = require('path');
const COMMON_FOOTER_PATH = path.join(__dirname, '../template/components/footer.tpl')
const PATTERN_SITENAME_TAG = /%siteName%/g;
const PATTERN_TITLE_TAG = /%title%/g;
const PATTERN_COPYRIGHT_TAG = /%copyright%/g;
const PATTERN_ARTICLE_TAG = /<r-article\s*\/>/g;
const PATTERN_HEADER_TAG = /<h([2-5]).*?>(.*?)<\/h\1>/g;
const PATTERN_INDEX_TAG = /<r-nav\s*\/>/g;
const PATTERN_DATETIME_TAG = /%datetime%/g;
const PATTERN_CSS_TAG = /<r-stylesheet\s*\/>/g;
const PATTERN_JS_TAG = /<r-javascript\s*\/>/g;
const PATTERN_FOOTER_TAG = /<r-footer\s*\/>/g;
const PATTERN_YEAR_TAG = /%year%/g;
const PATTERN_AUTHOR_TAG = /%author%/g;
const PATTERN_DESCRIPTION_TAG = /%description%/g;
const PATTERN_KEYWORDS_TAG = /%keywords%/g;
const PATTERN_COUNT_TAG = /%count%/g;
const PATTERN_TIME_TAG = /%time%/g;










class Render {
    // template 基础模板
    // type 目前作用是读取 config中的静态资源属性
    constructor(template, type = 'article') {
        this.html = template
        this.type = type
        this.renderBaseHtml()
    }
    // 替换footer
    replaceFooter() {
        let tpl = read(COMMON_FOOTER_PATH)
        tpl = tpl.replace(PATTERN_COPYRIGHT_TAG, config.copyright)
        tpl = tpl.replace(PATTERN_YEAR_TAG, new Date().getFullYear())
        this.html = this.html.replace(PATTERN_FOOTER_TAG, tpl)
        return this
    }
    // 替换版权
    // replaceCopyright() {
    //     this.html = this.html.replace(PATTERN_COPYRIGHT_TAG, config.copyright)
    //     return this
    // }
    // 替换网站标题
    replaceWebTitle(title) {
        this.html = this.html.replace(PATTERN_TITLE_TAG, title);
        return this
        // return html.replace(PATTERN_TITLE_TAG, [title, config.siteName].join(' - '));
    }
    //替换文章正文
    replaceArticleContent(content) {
        this.html = this.html.replace(PATTERN_ARTICLE_TAG, content);
        return this

    }
    // 替换站点名称
    replaceSiteName() {
        this.html = this.html.replace(PATTERN_SITENAME_TAG, config.siteName)
        return this
    };
    // 解析日期
    replacePublishDatetime() {
        let html = this.html
        //  <!-- 只能解析这样款式的注释 -->
        // example 这样的注释能被解析
        /**
         *  <!--
         *  * @Date: 2023-04-05 18:50:10
         *  -->
         */
        let datetime = ''
        const matchRes = html.match(/<!--([\s\S]*?)-->/)
        if (matchRes) {
            const note = matchRes[0]
            // const dateMatchRes = note.match(/@Date:([\s\S]*?)\r\n/)
            const dateMatchRes = note.match(/@Date:([\s\S]*?)(\r\n|\n)/)
            if (dateMatchRes) {
                datetime = dateMatchRes[1] || ''
            }
        }
        datetime = datetime || dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.html = html.replace(PATTERN_DATETIME_TAG, datetime)
        return this
        // return html
    }
    // 生成侧边标题锚点导航
    generateNavIndex() {
        let template = this.html
        let html = "",
            index = [];
        html += "<ul>\n";
        template = template.replace(PATTERN_HEADER_TAG, function (all, num, text) {
            var level = num - 1;
            while (level > index.length) {
                index.push(0);
            }
            while (level < index.length) {
                index.pop();
            }
            index[index.length - 1] += 1;
            html += util.format(
                '<li class="level%s"><a href="#%s">%s</a></li>',
                num,
                index.join("."),
                text
            );
            return util.format(
                '<h%s id="%s">%s</h%s>',
                num,
                index.join("."),
                text,
                num
            );
        });
        html += "</ul>\n";
        this.html = template.replace(PATTERN_INDEX_TAG, html);
        return this;
    }
    // 注入js 和 css
    injectCssAndJs() {
        const type = this.type
        const css = config.assets.css
        const js = config.assets.js

        const cssList = (css.common || []).concat(css[type] || [])
        const jsList = (js.common || []).concat(js[type] || [])

        let cssHtml = '', jsHtml = ''
        cssList.forEach(src => {
            cssHtml += `<link rel="stylesheet" href="${src}">`
        })
        jsList.forEach(src => {
            jsHtml += `<script src="${src}"></script>`
        })
        this.html = this.html.replace(PATTERN_CSS_TAG, cssHtml)
        this.html = this.html.replace(PATTERN_JS_TAG, jsHtml)
        return this
    }
    // 渲染公用部分
    renderBaseHtml() {
        if (this.type !== 'article') {
            const keywords = (config.keywords || []).join(',')
            this.html = this.html.replace(PATTERN_KEYWORDS_TAG, keywords)
            this.html = this.html.replace(PATTERN_AUTHOR_TAG, config.author || config.siteName)
            this.html = this.html.replace(PATTERN_DESCRIPTION_TAG, config.description || config.siteName)
        }
        this.injectCssAndJs().replaceFooter().replaceSiteName()
        return this
    }
    // 渲染文章主体
    generate(title, content, markdown) {
        // TDK替换
        const keywords = [...(config.keywords || []), title].join(',')
        this.html = this.html.replace(PATTERN_KEYWORDS_TAG, keywords).replace(PATTERN_AUTHOR_TAG, config.author || config.siteName).replace(PATTERN_DESCRIPTION_TAG, config.description || config.siteName)
        const count = calcMarkdownWordsCount(markdown)
        const WPM = 275
        const m = count / WPM
        const s = Math.ceil((m % 1) * 60)
        const time = `${Math.floor(m)}分${s}秒`
        const c = (count / 1000).toFixed(1)
        this.html = this.html.replace(PATTERN_COUNT_TAG, c).replace(PATTERN_TIME_TAG, time)
        // 替换网页标题
        this.replaceWebTitle(title).replaceArticleContent(content).replacePublishDatetime().generateNavIndex()
        return this
    }
}


module.exports = Render