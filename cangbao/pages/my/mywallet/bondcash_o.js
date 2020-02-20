// pages/my/mywallet/cash.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    user1: [],
    num:'',
    bank_name:'',
    icon_url:'',
    id:'',
    amount:'',
    navH: '',
    headtitle: '提现',
    paystyle: 0
  },
  allcash(){
    var that=this
    that.setData({
      amount: that.data.user1.deposit_account
    })
    that.rcalue()
  },
  xuancar(){
    wx.redirectTo({
      url: 'myband?name=car',
    })
  },
  gopass(){
    var that=this
    if (that.data.amount !== '') {
      wx.request({
        url: app.api.cashtowallet,
        data: {
          draw_amount: that.data.amount
        },
        method: 'post',
        header: t.logintype(),
        success: function (res) {
          if (res.statusCode == 200){
            wx.redirectTo({
              url: '../../paysuccess/bondblancesuccess',
            })
          } else if (res.statusCode == 422){
            t.alert(res.data.message)
          }
        }
      })
    }
  },
  val1(e){
    var that = this
    that.setData({
      amount: e.detail.value
    },()=>{
      if (that.data.amount !== ''){
        that.setData({
          paystyle:1
        })
      } else if (that.data.amount>0){
        that.setData({
          paystyle: 1
        })
      }else{
        that.setData({
          paystyle: 0
        })
      }
    })
  },
  rcalue(){
    const that=this
    if (that.data.amount !== '') {
      that.setData({
        paystyle: 1
      })
    } else if (that.data.amount > 0) {
      that.setData({
        paystyle: 1
      })
    } else {
      that.setData({
        paystyle: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    wx.request({
      url: app.api.bondaccount_details,
      data: {},
      method: 'get',
      header:t.logintype(),
      success: function (c) {
        that.setData({
          user1: c.data.data
        })
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