# 微信小程序日历组件-calendar
原生的日期选择器picker只支持公历，于是采用picker-view自定义了一个组件，可以支持农历。

### 模版使用：
```
<import src="../cal/calendar.wxml"></import>
<!--index.wxml-->
<template is="calendar" data="{{calendar_data}}"></template>
```
### JS代码使用：
```
 var Calendar = require('../cal/calendar');
 
 Page({
  data: {
    calendar_data: {}
  },
  ....
  
  var calendar = new Calendar(this, function(date){
      // 指定选择器回调函数
      that.setData({
          date: date.name
      })
  });
  
  /*return {
    day:6,
    month:6
    name:"2017年6月6日"
    type:1
    year:2017
  }*/
  // 返回当前选择时间
  var currentDate = calendar.getCurrentSelectDate();
  console.log(currentDate)
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

以上用法看不懂的话，具体就参考index目录下的代码。   
 
### 图片示例
![image](http://iamaddy.github.io/images/demo.png)
