// pages/my/mywallet/paypage.js
const app = getApp()
const relanding = require('../../common/relanding.js')
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
    code:'',
    navH: '',
    headtitle: '设置支付密码',
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
    var that=this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.setpassword,
          data: {
            code:that.data.code,
            pay_password: that.data.Value,
          },
          method: 'put',
          header: {
            "Authorization": 'bearer' + res.data,
            "content-type": "application/json",
            "cache-control": "no-cache, private",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success: function (b) {
            if(b.statusCode==200){
              wx.navigateBack({})
            }
            if (b.statusCode == 422){
              wx.showToast({
                title:b.data.message,
                icon:"none"
              })
            }
            if (b.statusCode == 401) {}
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      code:options.code,
      navH: app.globalData.navHeight
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