---
title: SASS实现BEM规范
description: SASS实现BEM规范
editLink: false
---

<script setup>
import Bem from "../../components/bem/index.vue"
</script>


# {{ $frontmatter.title }}

## 关于BEM

> BEM（Block, Element, Modifier）是一种前端命名约定，旨在帮助开发者创建可维护和可重用的CSS代码。BEM由Yandex公司提出，是一种模块化CSS的方法论。通过使用BEM，开发者可以更好地组织和管理CSS代码，减少样式冲突，提高代码的可读性和可维护性。

### BEM的核心概念

#### 1. Block
应当是有意义的名字，能够清晰地表达其功能。如：`menu`, `button`

#### 2. Element
元素，作为Block的组成部分，通常表示目的，如：`text`, `item`

#### 3. Modifier
修饰符，通常用于描述外观或行文状态，如：`disabled`, `red`

## 实现 bem.scss

```scss

$BlockSep: '-' !default; // namespace或前缀 与 block的连接符
$ElemSep: '__' !default; // block与 element的连接符
$ModSep: '--' !default; // element与modifier的连接符
$NAMESPACE: '' !default; // 定义命名空间,即前缀 如 el-button

@mixin B($block) {
  $B: if($NAMESPACE != '', #{$NAMESPACE + $BlockSep + $block}, $block);
  .#{$B} {
    @content;
  }
}

@mixin E($ele) {
  $selector: &; // 获取当前的选择器
  @at-root { // 将选择器放在根级别，避免嵌套过深
     #{$selector + $ElemSep + $ele} {
       @content;
     }
  }
}

@mixin M($m) {
  $selector: &;
  @at-root {
    #{$selector + $ModSep + $m} {
      @content;
    }
  }
}


```
## 在Vite.js中全局引用

```js
// vite.config
{
    css:{
        preprocessorOptions:{
            scss:{
                additionalData: `@use "@/styles/bem.scss" as *;`
            }
        }
    }
}
```
## 使用示例

<Bem />



```vue

<template>
    <!-- Block: button -->
    <div class="button">
        <!-- Element: text -->
        <span class="button__text">Click me</span>
    </div>

    <!-- Block: button with Modifier: primary -->
    <div class="button button--primary">
        <!-- Element: text with Modifier: primary -->
        <span class="button__text">Click me</span>
    </div>

    <!-- Block: button with Modifier: secondary -->
    <div class="button button--secondary">
        <!-- Element: text with Modifier: secondary -->
        <span class="button__text">Click me</span>
    </div>
</template>

<style lang="scss">
    
@import "bem.scss";   

@include B(button) {
    --color: #000;
    --bgColor: #000;
    display: inline-block;
    padding: 10px 20px;
    border: 1px solid;
    box-sizing: border-box;
    border-color: var(--color);
    color: white;
    cursor: pointer;
    margin: 0 10px;
    background: var(--bgColor);

    @include E(text) {
        font-size: 16px;
    }

    @include M(primary) {
        --color: #3498db;
        --bgColor: #3498db;
        @include E(text) {
            color: white;
        }
    }

    @include M(secondary) {
        --bgColor: #2ecc71;
        --color: #2ecc71;

        @include E(text) {
            color: white;
        }
    }
}


</style>

```
