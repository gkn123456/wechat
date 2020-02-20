// pages/my/mybond/mybond.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: '',
    bonddetails: null,
    page: 2,
    cdd: [],
    navH: '',
    headtitle: '余额明细',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    // 冻结金额获取
    wx.request({
      url: app.api.frozendeposit,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        that.setData({
          price: a.data.data.amount,
        })

      }
    })
    // 保证金列表获取
    wx.request({
      url: app.api.balance_det + '1',
      data: {},
      method: 'get',
      header:t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          that.setData({
            bonddetails: null,
          })
        }
        if (b.statusCode == 200) {
          that.setData({
            bonddetails: b.data.data,
          })
          var bonddetails1 = [];
          for (var i = 0; i < that.data.bonddetails.length; i++) {
            bonddetails1.push({
              id: i,
              text: t.formatDateTime(that.data.bonddetails[i].completion_time * 1000)

            })
            that.setData({
              cdd: bonddetails1
            })
          }
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
    wx.removeStorageSync("bonddetails1")

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
    var that = this
    var page = 0
    wx.showLoading({
      title: '加载中',
    })
    // 保证金列表
    wx.request({
      url: app.api.balance_det + that.data.page,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          t.alert('没有更多')
        } if (b.statusCode == 200) {
          var moment_list = that.data.bonddetails;

          for (var i = 0; i < b.data.data.length; i++) {
            moment_list.push(b.data.data[i]);
          }
          that.setData({
            bonddetails: that.data.bonddetails,
            page: Number(that.data.page) + 1
          })
          if (that.data.bonddetails !== undefined) {
            var bonddetails1 = [];
            for (var i = 0; i < that.data.bonddetails.length; i++) {
              bonddetails1.push(t.formatDateTime(that.data.bonddetails[i].completion_time * 1000))
            }
            that.setData({
              cdd: bonddetails1
            })
          }
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