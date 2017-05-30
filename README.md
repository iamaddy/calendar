# 微信小程序日历组件-calendar
原生的日期选择器只支持公历，于是自定义了一个组件，可以支持农历。

模版使用：
```
<import src="../cal/calendar.wxml"></import>
<!--index.wxml-->
<template is="calendar" data="{{selected_value,days,month,years,lunar_years,lunar_month,lunar_days,selectDateType,lunar_selected_value}}"></template>
```

 ```
 var Calendar = require('../cal/calendar');
 
 Page({
  data: {
    selected_value: [],
    days: [],
    month: [],
    years: [],
    lunar_years: [],
    lunar_month: [],
    lunar_days: [],
    selectDateType: 1,
    lunar_selected_value: []
  },
  ....
  
  // 指定选择器回调函数
  new Calendar('key', this, function(date){
      that.setData({
          date: date
      })
  });
 ```
 
 以上用法看不懂，具体就参考代码里面index目录下。    
 
### 图片示例
![image](http://iamaddy.github.io/images/demo.png)
