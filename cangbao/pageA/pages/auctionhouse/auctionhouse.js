// pageA/pages/auctionhouse/auctionhouse.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '拍卖行',
    navH: '',
    header: {},
    auction_house_list:null,
    page:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    that.tokens()
    setTimeout(function () {
      that.auction_house_list()
    }, 500)
  },
  // 登陆头部定义
  tokens() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.setData({
        header: {
          "x-os": "wechat_mini",
          "x-app-version": app.api.edition,
          "content-type": "application/json",
          "cache-control": "private, must-revalidate"
        },
      })
    } else {
      wx.getStorage({
        key: 'token',
        success(r) {
          that.setData({
            header: {
              "Authorization": 'bearer ' + r.data,
              "x-os": "wechat_mini",
              "x-app-version": app.api.edition,
              "content-type": "application/json",
              "cache-control": "private, must-revalidate"
            },
            token: 'bearer ' + r.data,
          })
        }
      })
    }
  },
  // 全球拍拍卖行列表
  auction_house_list() {
    var that = this
    wx.request({
      url: app.api.auctionhouse + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.data == '') {
          that.setData({
            auction_house_list: null
          })
        } else {
          that.setData({
            auction_house_list: a.data.data
          })
        }
        wx.hideLoading();
        wx.stopPullDownRefresh()
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
    let that=this
    wx.showLoading({
      title: '加载中'
    })
    that.auction_house_list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.api.auctionhouse + that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204){
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } if (res.statusCode == 200){
          var moment_list = that.data.auction_house_list;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i])
          }
          that.setData({
            auction_house_list: that.data.auction_house_list,
            page: Number(that.data.page) + 1
          })
          wx.hideLoading();
        }
        if (res.statusCode == 422){
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  goauction_house(e){
    wx.navigateTo({
      url: '../../../pages/videos/auction_house?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  },
})