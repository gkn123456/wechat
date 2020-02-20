// pages/paysuccess/relsuccess.js
const app = getApp()
const common = require('../common/common.js')
const relanding = require('../common/relanding.js')
const form = require('../common/formid.js')
const login = require('../common/login.js')
Page({
  data: {
    id:"",
    goods:[],
    navH: '',
    headtitle: '',
    type:''
  },
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      id: options.id,
      type: options.type,
    })
    wx.getStorage({
      key: 'token',
      success(d) {
        if (options.type==1){
          wx.request({
            url: app.api.video_goods + options.id,
            data: {},
            header: {
              "Authorization": 'bearer' + d.data,
              "content-type": "application/json",
              "cache-control": "private, must-revalidate",
              "x-os": "wechat_mini",
              "x-app-version": app.api.edition
            },
            method: 'get',
            success: function (res) {
              that.setData({
                goods: res.data.data
              })
            }
          }) 
        }else{
          wx.request({
            url: app.api.shop_details + options.id,
            data: {},
            header: {
              "Authorization": 'bearer' + d.data,
              "content-type": "application/json",
              "cache-control": "private, must-revalidate",
              "x-os": "wechat_mini",
              "x-app-version": app.api.edition
            },
            method: 'get',
            success: function (res) {
              that.setData({
                goods: res.data.data
              })
            }
          }) 
        }
      }
    }) 
  },
  back: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../index/index',
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
    wx.showTabBar({})
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
  close(){
    wx.navigateBack({
      delta: 2
    })
  },
  // 再发一条
  agginsend(){
    var that = this
    if(that.data.type==1){
      wx.navigateBack({
        delta: 2
      })
    }else{
      wx.navigateBack({
        delta: 2
      })
    }
    
  },
  // 立即查看
  govideos(){
    var that = this
    if (that.data.type == 1){
      wx.navigateBack({
        delta: 2,
        complete(){
          wx.navigateTo({
            url: '../videos/videos?id=' + that.data.id,
          })
        },
        success(){
          // wx.navigateTo({
          //   url: '../videos/videos?id=' + that.data.id,
          // })
        }
      })
      
    }else{
      wx.navigateBack({
        delta: 2,
        complete(){
          wx.navigateTo({
            url: '../videos/commoditydetails?id=' + that.data.id,
          })
        },
        success() {
          wx.navigateTo({
            url: '../videos/commoditydetails?id=' + that.data.id,
          })
        }
      })
    }
    
  },
  // 分享
  onShareAppMessage: function (r) {
    var that = this;
    var imgurl = that.data.goods.cover;
    var num = imgurl.length - 8
    var imgurls = imgurl.substring(num, -1)
    var imageurl = imgurls + 'square_image'
    if(that.data.type==1){
      return {
        title: "当前价:" + "￥" + that.data.goods.now_price + " " + that.data.goods.title,
        desc: that.data.goods.desc,
        path: '/pages/videos/videos?id=' + that.data.goods.goods_id,
        imageUrl: imageurl,
        success: (res) => {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
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
    }else{
      return {
        title: that.data.goods.title,
        desc: that.data.goods.desc,
        path: '/pages/videos/commoditydetails?id=' + that.data.goods.goods_id,
        imageUrl: imageurl,
        success: (res) => {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: (res) => {
              that.setData({
                isShow: true
              })
            },
            fail: function (res) {},
            complete: function (res) {}
          })
        },
        fail: function (res) {
          
        }
      }
    }
    
  },
})