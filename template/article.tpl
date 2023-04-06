<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,maximum-scale=1"
    />
    <title>%title% - %siteName%</title>
    <meta name="author" content="%author%" >
    <meta name="description" content="%description%">
    <meta name="keywords" content="%keywords%">
    <r-stylesheet />
    <r-javascript />

  </head>
  <body>
    <header id="header" class="flex flex-center">
      <div class="container flex flex-between">
        <ul class="flex">
          <li><a href="/index.html">首页 · HOME</a></li>
          <li><a href="/about.html">关于 · ABOUT</a></li>
        </ul>
        <a href="/index.html" class="logo">@%siteName%</a>
      </div>
    </header>
    <main class="flex flex-center">
      <div class="container relative flex">
        <nav>
          <r-nav />
        </nav>
        <article>
          <h1>%title%</h1>
          <p class="datetime">🕓<span>%datetime%</span><span>⏳%time%(%count%k字)</span></p>
          <r-article />
        </article>
      </div>
    </main>

    <footer>
      <r-footer />
    </footer>
  </body>
</html>
