// pages/my/install/install.js
const app = getApp()
var QR = require("../../../utils/qrcode.js");
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    icon:'',
    navH: '',
    headtitle: '设置',
    version:'',
    openAPPurl: '',
    whethershare: 0,
    whethereport: 0,
    whetherposter: 0,
    showSharePic: '',
    sharePicUrl: '',
    coverimg: '',
    coversize: ''
  },
  modify() {
    wx.navigateTo({
      url: '../mywallet/Modify information',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      name: options.uname,
      icon: options.uimg,
      navH: app.globalData.navHeight,
      version: app.api.editions
    })
  },
  addressmanage(){
    wx.navigateTo({
      url: './address',
      success(){
       
      }
    })
  },
  papermanage() {
    wx.navigateTo({
      url: './paper',
      success() {

      }
    })
  },
  gofeed(){
    wx.navigateTo({
      url: './feedback',
      success() {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onShareAppMessage: function () {
    const user_id = t.shareuserid()
    return {
      title:'大众艺术品收藏平台', // 转发后 所显示的title
      desc: '微信公众号：藏宝艺术',
      path: '/pages/index/index?share_id=' + user_id, // 相对的路径
      imageUrl: '../../img/logo.png',
      success: (res) => {
        t.alert('分享成功')
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
          },
          fail: function (res) { },
          complete: function (res) { }
        })
      },
      fail: function (res) {
      }
    }
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
  goabout(){
    wx.navigateTo({
      url: './about',
    })
  },
  closeshare() {
    const that = this
    that.setData({
      whethershare: 0
    })
  },
  openshare() {
    const that = this
    that.setData({
      whethershare: 1
    })
  },
  copylink() {
    const that = this
    const a = []
    t.copylink(a, app.api.url_shareapp,3)
    that.closeshare()
  },
  closereport() {
    const that = this
    that.setData({
      whethereport: 0
    })
  },
  openreport() {
    const that = this
    that.setData({
      whethereport: 1,
      whethershare: 0
    })
  },
  report(e) {
    const that = this
    const reason_id = e.currentTarget.dataset.id
    const mix_id = that.data.details.goods_id
    t.report(reason_id, mix_id)
    that.closereport()
  },
  closeposter() {
    const that = this
    that.setData({
      whetherposter: 0
    })
  },
  poster() {
    const that = this
    that.closeshare()
    //显示/生成分享海报
    if (that.data.sharePicUrl == '') {
      wx.showLoading({
        title: '生成海报中',
      })
      const shareFrends = wx.createCanvasContext('shareFrends')
      const a = []
      let url = app.api.url_shareapp+'share_id=' + t.shareuserid()
      QR.api.draw(url, 'canvascode', 76, 76);
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          fileType: 'jpg',
          quality: 1,
          width: 260 * 2,
          height: 260 * 2,
          destWidth: 260 * 2,
          destHeight: 260 * 2,
          canvasId: 'canvascode',
          success: function (res) {
            var tempFilePath = res.tempFilePath
            var path=''
            setTimeout(function () {
              t.drawImg(a, that.data.coversize, shareFrends, tempFilePath, path, 3).then(res => {
                that.setData({
                  sharePicUrl: res.tempFilePath
                })
                setTimeout(function () { wx.hideLoading() }, 300)
              })
            }, 500)
          },
          fail: function (res) { }
        });
      }, 500)
    }
    that.setData({
      whetherposter: 1
    })
  },
  // 保存海报
  saveimg() {
    const that = this
    t.saveimg(that.data.sharePicUrl)
    that.closeposter()
  }
})