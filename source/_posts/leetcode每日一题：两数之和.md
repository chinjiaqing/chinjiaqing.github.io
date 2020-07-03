---
title: leetcode每日一题：两数之和
date: 2020-07-03 17:45:31
tags: [leetcode每日一题,JavaScript]
categories : JavaScript
---
## 题目
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
**示例**
```javascript
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]

```
<!--more-->
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/two-sum
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 解题
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

 // 1. 基础版
var twoSum = function(nums, target) {
    let res = [];
    for(let i=0;i<nums.length;i++){
        let offset = target - nums[i];
        if(res[offset] !== undefined){
            return [res[offset],i];
        }
        res[nums[i]] = i;
    }
};

let res = twoSum([-1,-2,-3,-4,-5],-8);
//测试用时 ： 0.14990234375ms


// 2.进阶版
var twoSum2 = function(nums, target) {
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
      let dif = target-nums[i]
      if (map.has(dif)) {
        return [map.get(dif), i]
      }
      map.set(nums[i], i);
    }
};

let res2 = twoSum2([-1,-2,-3,-4,-5],-8);
//测试用时 ： 0.01611328125ms

```

## 知识点
### Map对象
<i class="fe fe-link"></i> MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map>
