#!/usr/bin/env sh

# 发布打包后的文件到deploy分支

# 忽略错误
set -e  #有错误抛出错误

rm -rf .vitepress/dist  #删除dist文件夹

# 构建
npm run build  #然后执行打包命令

# 进入待发布的目录
cd .vitepress/dist  #进到dist目录

git init  #执行这些git命令
git add -A
git commit -m 'deploy'

git push -f https://github.com/chinjiaqing/chinjiaqing.github.io.git master:deploy  #提交到这个分支

cd -

rm -rf .vitepress/dist  #删除dist文件夹