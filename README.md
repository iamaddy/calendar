# 微信小程序日历组件-calendar
原生的日期选择器picker只支持公历，于是采用picker-view自定义了一个组件，可以支持农历。

### 模版使用：
```
<import src="../cal/calendar.wxml"></import>
<!--index.wxml-->
<template is="calendar" data="{{selected_value,days,month,years,lunar_years,lunar_month,lunar_days,selectDateType,lunar_selected_value}}"></template>
```
### JS代码使用：
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

### 样式
```
.calendar{
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 999;
    background-color: #fff; 
}
.tab{
    display:inline-block;
    width:50%;
    text-align:center;
    font-size:16px;
    color: #ccc;
}
.tab-bar{
    background-color: #eee;
    height: 40px;
    line-height: 40px;
}
.tab-bar .active{
    color: #000;
}
.selected-item{
    font-size: 28px;
}

.event-type_parent{
    font-size: 14px;
}
.event-type_child{
    text-align: center;
    line-height: 30px;
}

.event-type_txt{
    display: inline-block;
}
```

以上用法看不懂的话，具体就参考代码里面index目录下。   
 
### 图片示例
![image](http://iamaddy.github.io/images/demo.png)
