---
title: Obejct.defineProperty实现双向绑定
date: 2020-07-10 00:21:49
tags: [Javascript,Obejct.defineProperty]
categories : JavaScript
---

## Obejct.defineProperty手册

MDN直达: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

## 实现双向绑定

**HTML代码**

```html
 <input type="text" id="ipt">
 <p id="txt"></p>
```

**JS代码**

```js

let data = {msg:""}; //相当于vue 的 data

function watch(obj,callback){
    Object.keys(obj).forEach(key=>{
        let internalValue = obj[key];
        Object.defineProperty(obj,key,{
            get(){
                console.log(`getting key "${key}": ${internalValue}`)
                return internalValue
            }
            ,set(newValue){
                console.log(`setting key "${key}" to: ${newValue}`)
                internalValue = newValue   //赋新值
                //劫持后 执行回调
                callback(internalValue) 
            }
        })
    })
}
function updateMsg(value){
    document.querySelector("#ipt").value = value;
    document.querySelector("#txt").innerHTML = value;
}

document.querySelector("#ipt").addEventListener("input",(e)=>{
    data.msg = e.target.value
})
watch(data,updateMsg)


```
