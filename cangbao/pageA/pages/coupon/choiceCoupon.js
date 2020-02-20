const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: wx.getSystemInfoSync().windowWidth - 21,
    widths: wx.getSystemInfoSync().windowWidth - 21 + 91,
    widths1: wx.getSystemInfoSync().windowWidth - 21 - 116,
    headtitle: '选择优惠券',
    navH: '',
    navHs: '',
    header: {},
    value:'',
    sign1: 0,
    list:null,
    list1:null,
    time:null,
    time1:null,
    coupon_id:'',
    order_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      order_id: options.order_id
    })
    that.tokens()
    setTimeout(function () {
      that.list()
      that.id()
    }, 400)

  },
  // 登陆头部定义
  tokens() {
    const that = this
    that.setData({
      header: t.logintype()
    })
  },
  // 判断有无优惠券id
  id(){
    const that=this
    let u = wx.getStorageSync('coupon_id');
    if (!u) {
      that.setData({
        coupon_id:''
      })
    } else {
      that.setData({
        coupon_id: wx.getStorageSync('coupon_id')
      })
    }
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
  bindinput(e) {
    const that = this
    const v = e.detail.value
    that.setData({
      value: v
    })
    if (v == '') {
      that.setData({
        sign1: 0
      })
    } else {
      that.setData({
        sign1: 1
      })
    }
  },
  delval() {
    const that = this
    that.setData({
      value: '',
      sign1: 0
    })
  },
  exchangebut() {
      const that = this
      wx.request({
        url: app.api.exchange,
        data: {
          code: that.data.value
        },
        header: t.logintype(),
        method: 'post',
        success(res) {
          t.alert(res.data.message)
          if (res.data.status_code == 200) {
            that.list()
            that.setData({
              value:'',
              sign1: 0
            })
          } else { }
        }
      })
  },
  list(){
    const that=this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.api.availablelist + that.data.order_id,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          that.setData({
            list: null,
            list1:null,
          })
        } else if (res.statusCode == 200) {
          const json = []
          const json1 = []
          if (res.data.data.usable!==undefined){
            that.setData({
              list: res.data.data.usable,
            })
            for (let i in res.data.data.usable) {
              const i1 = t.toDates(res.data.data.usable[i].use_start_time)
              const i2 = t.toDates(res.data.data.usable[i].use_end_time)
              json.push({
                start_time: i1,
                end_time: i2
              })
            }
          }
          if (res.data.data.disabled !== undefined) {
            that.setData({
              list1: res.data.data.disabled,
            })
            for (let i in res.data.data.disabled) {
              const i1 = t.toDates(res.data.data.disabled[i].use_start_time)
              const i2 = t.toDates(res.data.data.disabled[i].use_end_time)
              json1.push({
                start_time: i1,
                end_time: i2
              })
            }
          }
          that.setData({
            time: json,
            time1: json1
          })
        } else { }
        wx.hideLoading();
      }
    })
  },
  gobackdetails(e){
    const that=this
    if (e.currentTarget.dataset.type == 1) {
      wx.setStorageSync("coupon_id", e.currentTarget.dataset.id)
    }
    if (e.currentTarget.dataset.type == 2) {
      wx.setStorageSync("coupon_id",'')
    }
    wx.navigateBack({
      delta: 1
    })
  }
})