// pages/my/install/Modifyaddress.js
const jsonData = require('../../../utils/util.js');
const t = require('../../common/time.js')
const show = false;
const item = {};
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['请', '选', '择'],
    customItem: '全部',
    provincecode: '',
    citycode: '',
    area: '',
    default: 0,
    name: '',
    phone: '',
    content: '',
    addressid: '',
    trues: '',
    navH: '',
    headtitle: '添加新地址'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      addressid: options.id,
      navH: app.globalData.navHeight,
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
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      provincecode: e.detail.code[0],
      citycode: e.detail.code[1],
      area: e.detail.code[2],
    })
  },
  formName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  formphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  formcontent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      default: e.detail.value
    })
  },
  switch1Change(e) {
    var that = this
    if (e.detail.value == false) {
      that.setData({
        default: 0
      })
    }
    if (e.detail.value == true) {
      that.setData({
        default: 1
      })
    }
  },
  hold() {
    var that = this
    if (that.data.content.length<5){
      t.alert('详细地址不少于5个字')
    }else{
      wx.request({
        url: app.api.u_address,
        data: {
          address_id: that.data.addressid,
          accept_name: that.data.name,
          mobile: that.data.phone,
          area_code: that.data.area,
          address: that.data.content,
          default: that.data.default
        },
        method: 'post',
        header: t.logintype(),
        success(res) {
          if (res.data.status_code == 200) {
            wx.navigateBack({
              success(a) {
                let page = getCurrentPages().pop()
                page.onLoad()
              }
            })
          }
          if (res.data.status_code == 422) {
            t.alert(res.data.message)
          }
        }
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
})