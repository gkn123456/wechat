// pages/my/mywallet/addcar.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    number:'',
    mobel:'',
    karea: '', // 开户地址
    banks:[],
    index:0,
    bank_code:'',
    navH: '',
    headtitle: '添加银行卡',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })
    wx.request({
      url: app.api.bankcard_user,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          user: b.data.data,
        })
      }
    })
    wx.request({
      url: app.api.bankcard,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (c) {

      }
    })
    // 银行卡列表
    wx.request({
      url: app.api.bank_list,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (d) {
        that.setData({
          banks: d.data.data,
          bank_code: d.data.data[0].bank_code
        })
      }
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
  },
  bindPickerChange: function (e) {
    var that=this
    that.setData({
      index: e.detail.value,
      bank_code: that.data.banks[e.detail.value].bank_code
    })
  },

  val2(e) {
    var that = this
    that.setData({
      number: e.detail.value
    })
   },
  val3(e){
    var that = this
    that.setData({
      mobel: e.detail.value
    })
  },
  val4(e) {
    var that = this
    that.setData({
      karea: e.detail.value
    })
  },
  band(){
    var that = this
    wx.request({
      url: app.api.bankcard,
      data: {
        bank_number: that.data.number,
        mobile: that.data.mobel
      },
      method: 'post',
      header:t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          wx.showToast({
            title: b.data.message,
            icon: "none"
          })
        }
        if (b.statusCode == 200) {
          wx.navigateBack({})
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.band()
          }, 1000)
        }
      }
    })
  },

  band1() {
    var that = this
    wx.request({
      url: app.api.bankcard,
      data: {
        bank_number: that.data.number,
        mobile: that.data.mobel,
        bank_code: that.data.bank_code,
        bank_address: that.data.karea
      },
      method: 'post',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          wx.showToast({
            title: b.data.message,
            icon: "none"
          })
        }
        if (b.statusCode == 200) {
          wx.navigateBack({})
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.band1()
          }, 1000)
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
      title: '添加银行卡',
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
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.onLoad()
    }
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
  tkuan() {
    wx.showModal({
      content: '为了保证账户资金安全，只能绑定认证用户本人的银行卡',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#FF3740',
      success: function (res) {
        
      }
    })
  },
  tkuan1() {
    wx.showModal({
      content: '为了保证账户资金安全，只能使用认证时用的企业名称',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#FF3740',
      success: function (res) {}
    })
  }
})