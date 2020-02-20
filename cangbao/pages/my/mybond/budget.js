// pages/my/mybond/budget.js
const app = getApp()
const t = require('../../common/time.js')
const relanding = require('../../common/relanding.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:[],
    navH: '',
    headtitle: '收支详情',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      id:options.id
    })
    setTimeout(function(){
      that.det()
    },500)
  },
  det(){
    const that=this
    wx.request({
      url: app.api.depositdetailed + that.data.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 200) {
          that.setData({
            details: a.data.data,
            time: t.formatDateTime(a.data.data.completion_time * 1000)
          })
        }
        if (a.statusCode == 401) {
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
    wx.setNavigationBarTitle({
      title: '收支详情',
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
  go(e){
    let that=this
    let type=e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    if (type == 1){
      wx.navigateTo({
        url: '../../videos/videos?id='+id,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '../../videos/global?id=' + id,
      })
    }
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
})