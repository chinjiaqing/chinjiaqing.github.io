const { execSync } = require("child_process")

let message = process.argv.slice(2)[0] || 'write'

const COMMIT_TYPES = {
    "write": "📝 Write | 写作",
    "feat": "🛴 Features | 新功能",
    "fix": "🚑 Bug Fixes | Bug 修复",
    "init": "🛫 Init | 初始化",
    "docs": "📚 Documentation | 文档",
    "style": "🚙 Styles | 风格",
    "refactor": "✂ Code Refactoring | 代码重构",
    "perf": "🚀 Performance Improvements | 性能优化",
    "test": "🚔 Tests | 测试",
    "revert": "🚧 Revert | 回退",
    "build": "⚓ Build System | 打包构建",
    "chore": "🚩 Chore | 构建/工程依赖/工具",
    "ci": "⛽ Continuous Integration | CI 配置"
}
if (COMMIT_TYPES[message]) message = COMMIT_TYPES[message]
execSync(
    `git pull && git add . && git commit -m"${message}" && git push `,
    (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(`stdout:${stdout}`)
    }
)