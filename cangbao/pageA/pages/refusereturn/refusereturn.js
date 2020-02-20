// pageA/pages/refusereturn/refusereturn.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '拒绝退货',
    navH: '',
    check: [{
      name: '理由不符',
    }, {
      name: '其他',
    }],
    v: 'none',
    v1: 'none',
    id:'',
    u:[],
    cTab: '9',
    cname:'',
    noteNowLen: '0',
    reason: '', // 退货原因
    info: '',   // 申请退货原因
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      id: options.id
    })
    wx.request({
      url: app.api.order_sel_details + options.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (d) {
        that.setData({
          u: d.data.data,
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
  // 点击事件
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
  close() {
    var that = this
    that.setData({
      v: "none"
    })
  },
  open() {
    var that = this
    that.setData({
      v: "block"
    })
  },
  check(e) {
    var that = this
    that.setData({
      cTab: e.currentTarget.dataset.id,
      cname: e.currentTarget.dataset.name
    })
    if (e.currentTarget.dataset.id < 1) {
      that.setData({
        reason: 1,
        v1: 'none'
      })
    } else {
      that.setData({
        reason: 2,
        v1: 'block'
      })
    }
    that.close()
  },
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({ info: value, noteNowLen: len })
  },
  send() {
    var that = this
    var d={}
    if (that.data.reason==1){
      d={
        order_id: that.data.id,
        refuse_reason: 1,
      }
    }else{
      d = {
        order_id: that.data.id,
        refuse_reason:2,
        refuse_reason_other: that.data.info,
      }
    }
    wx.request({
      url: app.api.refuse_return,
      data: d,
      method: 'post',
      header: t.logintype(),
      success: function (a) {
        wx.showToast({
          title: a.data.message,
          icon: 'none'
        })
        if (a.statusCode == 422) {

        }
        if (a.statusCode == 200) {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    })
  },
})