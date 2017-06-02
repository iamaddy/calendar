//index.js
//获取应用实例
var app = getApp();
var Calendar = require('../cal/calendar');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    date:"",
    calendar_data: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    new Calendar(this, function(date){
        that.setData({
            date: date
        })
    });
  }
})
