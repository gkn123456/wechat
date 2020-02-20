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
    List:[],
    region: ['1', '2', '2'],
    customItem: '全部',
    provincecode: '',
    citycode: '',
    area: '',
    name:'',
    phone:'',
    content:'',
    addressid:'',
    trues:'',
    navH: '',
    headtitle: '修改地址',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      region:[options.pro],
      addressid: options.id,
      navH: app.globalData.navHeight,
    })
    wx.request({
      url: app.api.address_details + options.id,
      data: {},
      method: 'get',
      header:t.logintype(),
      success(res) {
        that.setData({
          name: res.data.data.accept_name,
          phone: res.data.data.mobile,
          content: res.data.data.address,
          area: res.data.data.area_code,
          trues: res.data.data.default
        })
      }
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
  formName:function(e){
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
  switch1Change(e) {
    var that=this
    if (e.detail.value==false){
      that.setData({
        trues: 0
      })
    }
    if (e.detail.value == true) {
      that.setData({
        trues: 1
      })
    }
  },
  hold(){
    var that=this
    wx.request({
      url: app.api.u_address,
      data: {
        address_id: that.data.addressid,
        accept_name: that.data.name,
        mobile: that.data.phone,
        area_code: that.data.area,
        address: that.data.content,
        default: that.data.trues
      },
      method: 'put',
      header: t.logintype(),
      success(res) {
        wx.navigateBack({
          success() {
            let page = getCurrentPages().pop()
            page.onLoad()
          }
        })
      }
    })
  },
  cutaddress(){
    var that = this
    wx.showModal({
      content: '是否删除地址',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.u_address,
            data: {
              address_id: that.data.addressid
            },
            method: 'delete',
            header: t.logintype(),
            success(res) {
              wx.navigateBack({
                success() {
                  t.alert(res.data.message)
                  let page = getCurrentPages().pop()
                  page.onLoad()
                }
              })
            }
          })
        } else if (res.cancel) {}
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
      title: '修改地址',
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