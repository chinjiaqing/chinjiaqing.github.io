import {defineConfig} from 'vitepress'
import dree from 'dree';

interface NavSubItem {
    text: string
    link?: string
    items?: NavSubItem[]
}

// 文档根目录
const DocPath = "./docs"
// 侧边栏
const SideBar = {}
// 导航栏
const NavItems = [
    {text: "首页", link: "/"}
]
// 读取文档根目录的文件树
const result = dree.scan(DocPath, {
    exclude: [/index.md/,'/public'], //排除每个文件下的index.md 和 public 静态资源目录
    size: false,
    hash: false,
    extensions: ["md"]
})
// 读取文档根目录下的一级目录 生成导航栏和侧边栏的一级属性
const topDirs = result?.children?.filter(v => v.type === 'directory')|| []
topDirs.forEach(item => {
    NavItems.push({
			text: item.name,
			link: "/" + item.relativePath,
		});
    const sideRowData = {
        text: item.name,
        items: []
    }
    parseSlideBar(item.children, sideRowData)
    SideBar[`/${item.name}/`] = [sideRowData]
})

// 生成导航栏的自定义侧边栏
function parseSlideBar(children, side) {
    if (!children || children.length === 0) return
    children.forEach(child => {
        let childRow:NavSubItem = {
					text: child.name.replace(/\.md$/, ""),
					items: [],
				};
        if (child.type === 'directory') {
            parseSlideBar(child.children, childRow)
        }
        if (child.type === 'file') {
            if (!side.items) side.items = []
            childRow.link = "/" + child.relativePath.replace(/\\/g, "/").replace(/\.md$/, "") + "/"
        }
        side.items.push(childRow)
    })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "季夏拾陆",
	description: "some writing.",
	srcDir: DocPath,
	lang: "zh-CN",
	lastUpdated: true,
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: "/avatar.png",
		nav: NavItems,
		sidebar: SideBar,
		socialLinks: [{ icon: "github", link: "https://github.com/chinjiaqing" }],
		search: {
			provider: "local",
		},
	},
});
