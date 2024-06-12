import {defineConfig} from 'vitepress'
import path from "path"
import * as fs from 'fs';
import dree from 'dree';

console.log('dree',dree.default)
const DocPath = "./docs"
const SideBar = {}

const result = dree.scan(DocPath, {
    exclude:/index.md/,
    size:false,
    hash:false,
    extensions:["md"]
})

function parseSlideBar(children,side) {
    if(!children.length) return
    children.forEach(child=>{
        if(child.type === 'directory') {
        }
        if(child.type === 'file') {

        }
    })
}
parseSlideBar(result.children,SideBar)
console.log('result',JSON.stringify(result))
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Chin Jiaqing",
    description: "some writing.",
    srcDir: DocPath,
    lang: 'zh-CN',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '首页', link: '/'},
            {text: 'JavaScript', link: '/JavaScript'}
        ],

        sidebar: SideBar,

        socialLinks: [
            {icon: 'github', link: 'https://github.com/chinjiaqing'}
        ]
    }
})
