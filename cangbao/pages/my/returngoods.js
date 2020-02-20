// pages/my/returngoods.js
const app = getApp()
const relanding = require('../common/relanding.js')
const form = require('../common/formid.js')
const t = require('../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: '',
    id: '',
    price: '',
    price1: '',
    time: '',
    title: '',
    uimg: '',
    uname: '',
    cname:'',
    noteNowLen:'0',
    reason: '', // 退货原因
    info: '',   // 申请退货原因
    cTab:'9',
    v:'none',
    v1: 'none',
    type:'',
      check: [{
        name: '图物不符',
      }, {
          name: '收到商品破损',
      }, {
          name: '商品质量问题',
      }, {
          name: '未收到货',
      }, {
          name: '七天无理由退货',
      }, {
          name: '其他',
      }],
    navH: '',
    headtitle: '退货',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      cover: options.cover,
      id: options.id,
      price: options.price,
      price1: options.price,
      time: options.time,
      title: options.title,
      uimg: options.uimg,
      uname: options.uname,
      type: options.type,
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
  check(e){
    var that=this
    that.setData({
      cTab: e.currentTarget.dataset.id,
      cname: e.currentTarget.dataset.name
    })
    if (e.currentTarget.dataset.id<5){
      that.setData({
        reason: e.currentTarget.dataset.id + 1,
        v1: 'none'
      })
    }else{
      that.setData({
        reason: e.currentTarget.dataset.id - e.currentTarget.dataset.id,
        v1:'block'
      })
    }
    that.close()
  },

  close(){
    var that=this
    that.setData({
      v:"none"
    })
  },
  open() {
    var that = this
    that.setData({
      v: "block"
    })
  },
  // 监听字数
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({ info: value, noteNowLen: len })
  },
  prices(e){
    var that=this
    that.setData({
      price1: e.detail.value
    })
  },
  send(){
    var that=this
    wx.request({
      url: app.api.order_return,
      data: {
        order_id: that.data.id,
        return_amount: that.data.price1,
        return_reason: that.data.reason,
        return_reason_other: that.data.info,
      },
      method: 'post',
      header: t.logintype(),
      success: function (a) {
        wx.showToast({
          title: a.data.message,
          icon: 'none'
        })
        if (that.data.type == 0) {
          if (a.statusCode == 422) {
          }
          if (a.statusCode == 200) {
            setTimeout(function () {
              wx.redirectTo({
                url: '../orderdetails/orderdetails?id=' + that.data.id,
              })
            }, 2000)
          }
        }
        if (that.data.type == 1) {
          if (a.statusCode == 422) {
          }
          if (a.statusCode == 200) {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 2000)
          }
        }
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
      url: '../index/index',
    })
  }
})