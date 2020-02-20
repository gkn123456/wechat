// pages/my/install/feedback.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    headtitle: '反馈',
    public: app.api.public,
    length: '',// 字符长度
    noteMaxLen: 200, // 最多放多少字
    noteNowLen: 0,//备注当前字数
    info: '', // 反馈内容
    sty: 'color:rgba(204,204,204,0.5);',
    phone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
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
  },
  // 监听字数
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
    len = parseInt(value.length);
    that.setData({ info: value, noteNowLen: len,length:len })
    if (len<5){
      that.setData({
        sty:'color:rgba(204,204,204,0.5);'
      })
    }else{
      that.setData({
        sty: 'color:#fff;'
      })
    }
  },
  phone(e){
    var that=this
    that.setData({
      phone: e.detail.value
    })
  },
  sendfeed(){
    var that=this
    if(that.data.length<5){
      wx.showToast({
        title: '请填写您遇到的问题',
        icon:'none'
      })
    }else{
      wx.request({
        url: app.api.feedback,
        data: {
          desc: that.data.info,
          call: that.data.phone
        },
        method: 'post',
        header: t.logintype(),
        success: function (a) {
          if (a.data.status_code == 422) {
            wx.showToast({
              title: a.data.message,
              icon: 'none'
            })
          }
          if (a.data.status_code == 200) {
            wx.showToast({
              title: a.data.message,
              icon: 'none'
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          }
        }
      })
    }
  },
})