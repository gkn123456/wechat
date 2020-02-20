// pages/videos/storedetails.js
const app = getApp()
const t = require('../common/time.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag:'1',
    details:[],
    registrationtime:'',
    settledtime:'',
    detailss:[],
    cdd:[],
    images:[],
    navH:'',
    headtitle: '店铺简介',
    page:'2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH:app.globalData.navHeight,
      id:options.id
    })
    wx.request({
      url: app.api.selinformation + options.id,
      data: {},
      header: t.logintype(),
      method: 'get',
      success: function (res) {
        that.setData({
          details: res.data.data,
          registrationtime: t.formatDateTime(res.data.data.detail.reg_time * 1000),
          settledtime: t.formatDateTime(res.data.data.detail.auth_time * 1000),
        })
        let images = []
        images.push(
          res.data.data.user_icon
        )
        that.setData({
          images: images
        })
      },
    })
    // 评论列表
    wx.request({
      url: app.api.selevaluate + options.id + '/1',
      data: {},
      header:t.logintype(),
      method: 'get',
      success: function (res) {
        that.setData({
          detailss: res.data.data,
        })
        if (that.data.detailss !== undefined) {
          var detailss1 = [];
          for (var i = 0; i < that.data.detailss.length; i++) {
            detailss1.push({
              text: t.toDate(that.data.detailss[i].create_time)
            })
          }
          that.setData({
            cdd: detailss1
          })
        }
      },
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
    wx.removeStorageSync("detailss1")
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
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.api.selevaluate + that.data.id + '/'+that.data.page,
      data: {},
      header:t.logintype(),
      method: 'get',
      success(res) {
        if (res.data == '') {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } else {
          var moment_list = that.data.detailss;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            detailss: that.data.detailss,
            page: Number(that.data.page) + 1
          })
          var detailss1 = [];
          for (var i = 0; i < that.data.detailss.length; i++) {
            detailss1.push({
              text: t.toDate(that.data.detailss[i].create_time)
            })
          }
          that.setData({
            cdd: detailss1
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
  openimg(){
    var that = this
    wx.previewImage({
      current: that.data.images[0],
      urls: that.data.images
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../index/index',
    })
  }
})