// pageA/pages/search/newpage.js
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
    value:'',
    header:{},
    page:2,
    auction_house_list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      value:options.v,
    })
    that.tokens()
    setTimeout(function () {
      that.list()
    }, 300)
  },
  // 是否有登陆态
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
  // 获取查询数据
  list() {
    const that = this
    const n = t.code(that.data.value)
    wx.request({
      url: app.api.ahouse+n+'&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 204) {
          that.setData({
            auction_house_list: null
          })
        } else {
          that.setData({
            auction_house_list: a.data.data
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    that.tokens()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    that.tokens()
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
    const that = this
    that.tokens()
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    wx.showLoading({
      title: '加载中'
    })
    const n = t.code(that.data.value)
    wx.request({
      url: app.api.ahouse + n +'&page='+that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.data == '') {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } else {
          var moment_list = that.data.auction_house_list;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            auction_house_list: that.data.auction_house_list,
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
  back() {
    wx.navigateBack({
      note: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  goauction_house(e) {
    wx.navigateTo({
      url: '../../../pages/videos/auction_house?id=' + e.currentTarget.dataset.id,
    })
  }
})