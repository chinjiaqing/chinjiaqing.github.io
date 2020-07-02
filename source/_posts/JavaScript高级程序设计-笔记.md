---
title: JavaScript高级程序设计 笔记
date: 2020-07-02 15:51:21
categories : JavaScript
tags: 
- JavaScript
- JavaScript高级程序设计
- 笔记
photos: [
    ['https://gitee.com/chinjiaqing/blogImg/raw/master/imgs/JavaScript高级程序设计.jpg']
]
---

## 第一章 JavaScript简介

- JavaScript简史

  诞生于1995年。

- JavaScript实现

+ ECMAScript

  是对实现`ECMA-262`标准规定的各个方面内容的语言描述。

+ DOM

  文档对象模型，用于HTML的应用程序编程接口。`DOM`把整个页面映射成为一个多层节点结构。

+ BOM

  浏览器对象模型，以`window`对象为依托，表示浏览器窗口以及页面可见区域。同时,`window`对象还是ECMAScript中的`Global`对象。

##  第二章 在HTML中使用JavaScript

- 标签的位置

- 延迟脚本

- 异步脚本

- noscript

  ```php
  <script type="text/javascript" defer="defer" src="xx.js"></script>
  <script type="text/javascript" async src="xx.js"></script> //只适用于外部脚本文件,并不能保证其执行的先后顺序
  <noscript>
      <p>当前浏览器不支持(未启用)JavaScript.</p>
  </noscript>
  ```

## 第三章 基本概念

- 语法

- 关键字、保留字

- 变量

- 数据类型

- 操作符

- 语句

  + label语句

  ```javascript
  begin:for(var i=0;i<10;i++){
      for(var j=0;j<5;j++){
          if(j+i=6){
              break begin;
          }
      }
  }
  ```

  + with

  ```javascript
  //严格模式下，不被允许
  var hostName = location.hostname;
  var url = location.href;
  //等于如下代码:
  with(location){
      var hostName = hostname;
      var url = href;
  }
  //大量使用with会导致性能下降
  ```

- 函数

## 第四章 变量、作用域和内存

- 基本类型和引用类型的值

  + 变量可能包含两种不同数据类型的值：`基本类型值`(数据段)和`引用类型值`(对象)。
  + 不能给`基本类型值`添加属性。

- 复制变量值

  + 复制`基本类型值`时，会分配一份新的空间，创建一个新值
  + 复制`引用类型值`时，不同的是，该值实际是一个指针，指向存储在堆中的一个对象。

  ```javascript
  var obj1 = new Object();
  var obj2 = obj1;
  obj1.name="Chin";
  console.log(obj2.name) //"Chin"
  ```
<!--more-->
- 参数传递

  参数传递是按值传递的。

  ```javascript
  function setName(obj){
      obj.name = "Chin";
      obj = new Object();
      obj.name =  "Qin";
  }
  var person = new Object();
  setName(person);
  console.log(person.name) // "Chin"
  //即使在函数内部修改了参数的值，但原始的引用仍然保持未变。
  //在函数内部重写obj时，这个变量引用就是一个局部对象了，在函数执行完毕后立即销毁。
  ```

- 检测类型

  ```javascript
  var u,n=null;
  console.log(typeof u,typeof n); // undefined object
  //用 typeof检测函数和正则表达式时，均会返回"function"
  ```

  + 在检测引用类型的值时，通常用 `instanceof`

  ```javascript
  //示例语法
  result = variable instanceof constructor
  ```

  