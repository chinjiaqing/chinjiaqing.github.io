<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,maximum-scale=1"
    />
    <title>首页 - %siteName%</title>
    <meta name="description" content="%description%">
    <meta name="keywords" content="%keywords%">
    <r-stylesheet />
    <r-javascript />
  </head>
  <body>
    <header id="header" class="flex flex-center">
      <div class="container flex flex-between">
        <ul class="flex">
          <li><a href="/index.html" class="active">首页 · HOME</a></li>
          <li><a href="/about.html">关于 · ABOUT</a></li>
        </ul>
        <a href="/index.html" class="logo">@季夏拾陆</a>
      </div>
    </header>
    <main>
      <div class="container relative flex">
        <r-tree />
      </div>
    </main>

    <footer>
      <r-footer />
    </footer>
  </body>
</html>
