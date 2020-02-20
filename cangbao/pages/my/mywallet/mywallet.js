// pages/my/mywallet/mywallet.js
const app = getApp()
const t = require('../../common/time.js')
const relanding = require('../../common/relanding.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    navH: '',
    headtitle: '我的钱包',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })
    that.det()
  },
  det(){
    const that=this
    wx.request({
      url: app.api.user,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          that.setData({
            user: b.data.data,
          })
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.det()
          }, 500)
        }
      }
    })
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

  },
  // 点击事件
  gopaypassword(){
    var that=this
    wx.navigateTo({
      url: 'paypassword?id=' + that.data.user.mobile,
    })
  },
  balancedetails() {
    var that = this
    wx.navigateTo({
      url: 'balancedetails',
    })
  },
  trecharge(){
    wx.navigateTo({
      url: 'trecharge',
    })
  },
  mybond(){
    wx.navigateTo({
      url: 'myband',
    })
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