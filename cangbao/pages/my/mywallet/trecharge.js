// pages/my/mywallet/trecharge.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    navH: '',
    headtitle: '充值/提现',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })
    wx.request({
      url: app.api.user,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          user: b.data.data,
        })
      }
    })
  },
  rech(){
    wx.navigateTo({
      url: 'rech?type=1',
    })
  },
  cash() {
    var that=this
    if (that.data.user.is_real_name==1){
      wx.navigateTo({
        url: 'cash',
      })
    }else{
      wx.navigateTo({
        url: 'realname',

      })
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
    wx.setNavigationBarTitle({
      title: '充值/提现',
    })
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
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.onLoad()
    }
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

  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../index/index',
    })
  }
})