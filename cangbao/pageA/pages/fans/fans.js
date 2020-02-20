// pageA/pages/fans/fans.js
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
    list: [],
    page: 2,
    displays1:'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight
    })
    that.list()
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
    let that=this
    that.setData({
      page:2
    })
    that.list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var page = 0
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.api.user_fans + that.data.page,
      data: {
      },
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          t.alert('没有更多')
        }
        if (res.statusCode == 200) {
          let list = that.data.list;
          for (let i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          that.setData({
            list: that.data.page1,
            page: Number(that.data.page) + 1
          })
          wx.hideLoading();
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 粉丝列表api
  list() {
    var that = this
    wx.request({
      url: app.api.user_fans + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        wx.stopPullDownRefresh()
        if (a.statusCode == 204) {
          that.setData({
            list: null,
            displays1: 'block'
          })
        }
        if (a.statusCode == 200) {
          that.setData({
            list: a.data.data,
            displays1: 'none'
          })
        }
      }
    })
  },
  // 关注
  sellers(e) {
    var that = this
    wx.request({
      url: app.api.user_detfollow,
      data: {
        user_id: e.currentTarget.dataset.id,
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.list()
          t.alert(a.data.message)
        }
        if (a.statusCode == 422) {
          t.alert(a.data.message)
        }
        if (a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.sellers()
          }, 1000)
        }
      }
    })
  },
  goperson(e) {
    wx.navigateTo({
      url: '../../../pages/person/person?id=' + e.currentTarget.dataset.id,
    })
  },
  // 点击事件
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
})