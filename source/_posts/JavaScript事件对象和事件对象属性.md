---
title: JavaScript事件对象和事件对象属性
date: 2020-07-07 19:52:25
tags: Javascript
categories : JavaScript
---

## 获取事件对象和事件源

```javascript

document.onclick = function(ev){
    var e = ev || window.event;
    var target = e.target || window.event.srcElement;
}

```

## button 事件属性

```javascript
    event.button=0|1|2
```

|  参数   | 描述  |
|  ----  | ----  |
| 0  | 鼠标左键 |
| 1  | 鼠标中键 |
| 2  | 鼠标右键 |

IE

|  参数   | 描述  |
|  ----  | ----  |
| 1  | 鼠标左键 |
| 4  | 鼠标中键 |
| 2  | 鼠标右键 |

## 阻止事件冒泡

```javascript

     oBox.onclick = function(ev){
        var e = ev || window.event;
        // e.cancelBubble = true;
        // e.stopPropagation();
        stopBubble(e);
     }

    function stopBubble(e){
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
    }
```

## 阻止默认事件

```javascript

     oBox.onclick = function(ev){
        var e = ev || window.event;
        // e.preventDefault();
        // window.event.returnValue = false;
        preventDef(e);
     }

    function preventDef(e){
        if(e.preventDefault){
            e.stopPropagation();
        }else{
            window.event.returnValue = false;
        }
    }
```

## 事件监听器兼容

```javascript

    function addEvent(node,evenType,funcName){
        if(node.addEventListener){
            node.addEventListener(evenType,funcName,false);
        }else{
            node.attachEvent("on" + evenType,funcName);
        }
    }

    function removeEvent(node,evenType,funcName){
        if(node.removeEventListener){
            node.removeEventListener(evenType,funcName,false);
        }else{
            node.detachEvent("on" + evenType,funcName);
        }
    }

```
