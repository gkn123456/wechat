// pages/my/install/about.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:'',
    version: '',
    headtitle: '关于藏宝',
    public:'',
    phone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      version: app.api.editions,
      public: app.api.public,
      phone: app.api.phone,
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
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../index/index',
    })
  },
  goxieyi1(){
    wx.navigateTo({
      url: '../Agreement/Agreement?src=' + app.api.userAgreement,
    })
  },
  goxieyi2() {
    wx.navigateTo({
      url: '../Agreement/Agreement?src=' + app.api.privacyrule,
    })
  },
  phonecall(){
    wx.makePhoneCall({
      phoneNumber: app.api.phone
    })
  }
})