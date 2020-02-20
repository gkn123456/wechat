const app = getApp()
const relanding = require('../../pages/common/relanding.js')
const t = require('../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    headtitle:'在线观众',
    live_id:'',
    room:null,
    list:null,
    page:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    that.setData({
      live_id: options.id
    }, () => {
      that.liveinfo()
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
  // 直播房间基本信息
  liveinfo() {
    const that = this
    wx.request({
      url: app.api.liveinfo + that.data.live_id + '?view_type=HDL',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            room: res.data.data
          })
        } else {
          that.setData({
            room: null
          })
        }
      }
    })
  },
  // 在线列表
  list(){
    const that = this
    wx.request({
      url: app.api.liveviewer + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            list: res.data.data
          })
        } else {
          that.setData({
            list: null
          })
        }
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
      url: '../../pages/index/index',
    })
  }
})