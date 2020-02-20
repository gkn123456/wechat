// pages/my/mywallet/pasword.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Length: 6,        //输入框个数
    isFocus: true,    //聚焦
    Value: "",        //输入的内容
    ispassword: true, //是否密文显示 true为密文， false为明文。
    disabled: true,
    code: '',
    amount:'',
    id:'',
    navH: '',
    headtitle: '输入支付密码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH: app.globalData.navHeight,
      amount: options.paynum,
      id:options.id,
    })
    
  },
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    if (ilen == 6) {
      that.setData({
        disabled: false,
      })
    } else {
      that.setData({
        disabled: true,
      })
    }
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit() {
    var that = this
    wx.request({
      url: app.api.cash,
      data: {
        draw_amount: that.data.amount,
        card_id: that.data.id,
        pay_password: that.data.Value,
        account_type: 2
      },
      method: 'post',
      header:t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          wx.redirectTo({
            url: '../../paysuccess/bondtobanksuccess',
          })
        }
        if (b.statusCode == 422) {
          wx.showToast({
            title: b.data.message,
            icon: "none"
          })
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.formSubmit()
          }, 1000)
        }
      }
    })
  },
  forgetpassword(){
    wx.navigateTo({
      url: 'proving',
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
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
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