// pages/paysuccess/paydisuccess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    headtitle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      type:options.type
    })
  },
  back: function () {
    var that = this
    wx.navigateBack({
      delta: 2,
      success: function () {
        if (that.data.type == 2) {
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 1];
          beforePage.onLoad();
        }
      }
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  goback() {
    var that = this
    wx.navigateBack({
      delta: 2,
      success: function () {
        if (that.data.type == 2) {
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 1];
          beforePage.onLoad();
        }
      }
    })
  },
  shili() {
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.details()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})