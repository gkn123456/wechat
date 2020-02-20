const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    user:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight
    })
    that.user()
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
  // 认证信息获取
  user(){
    let that=this
    wx.request({
      url: app.api.attestation,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        that.setData({
          user: res.data.data
        })
      }
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  }
})