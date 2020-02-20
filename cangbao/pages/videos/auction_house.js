// pages/videos/auction_house.js
const app = getApp()
const relanding = require('../common/relanding.js')
const t = require('../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    headtitle: '拍卖行',
    a: [{}, {}, {}, {}, {}, {}, {}],
    animation:'',
    template_name: "template_h",
    id:'',
    details:null,
    starttime1:[],
    page:'2',
    goodheight:'',
    scene: app.globalData.scene,
    openAPPurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      id:options.id
    })
    // 确定头部信息
    that.tokens()
    // 获取详情
    that.details()
    // 获取拍卖会列表
    that.list_details()
    // 接收推荐人id
    let u = options.share_id
    if (options.share_id == undefined) {
      u = ''
    }
    if (u !== '') {
      let s = wx.getStorageSync('share_id');
      if (!s) {
        t.share(options.share_id)
      } else {}
    }
    setTimeout(function () {
      that.width()
    }, 300)
  },
  // 登陆未登录头部定义
  tokens() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.setData({
        header: {
          "x-os": "wechat_mini",
          "x-app-version": app.api.edition,
          "content-type": "application/json",
          "cache-control": "private, must-revalidate"
        },
      })
    } else {
      wx.getStorage({
        key: 'token',
        success(r) {
          that.setData({
            header: {
              "Authorization": 'bearer ' + r.data,
              "x-os": "wechat_mini",
              "x-app-version": app.api.edition,
              "content-type": "application/json",
              "cache-control": "private, must-revalidate"
            },
          })
        }
      })
    }
  },
  // 获取页面元素宽
  width() {
    let that = this
    const query = wx.createSelectorQuery()
    query.select('.head_cont').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        goodheight: res[0].height
      })
    })
  },
  // 详情获取
  details() {
    var that = this
    wx.request({
      url: app.api.auchouse + that.data.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.data.data !== '') {
          that.setData({
            details: a.data.data,
            openAPPurl: app.api.auchousepage + a.data.data.user_id,
          })
          setTimeout(function(){
            that.width()
          },300)
        }
      }
    })
  },
  // 商品列表
  list_details() {
    var that = this
    wx.request({
      url: app.api.newauchouseauc + '?seller_id=' + that.data.id + '&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.data !== '') {
          that.setData({
            list_details: a.data.data,
          })
          let time = []
          for (let i = 0; i < a.data.data.length; i++) {
            time.push({
              t: t.formatDateTime(a.data.data[i].start_time * 1000)
            })
          }
          that.setData({
            starttime1: time
          })
        }else{
          that.setData({
            list_details:null
          })
        }
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
    this.setData({
      scene: app.globalData.scene
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
    var that = this
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
    })
    that.tokens()
    that.details()
    that.list_details()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.api.newauchouseauc + '?seller_id=' + that.data.id + '&page=' + that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204){
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } if (res.statusCode == 200) {
          var moment_list = that.data.list_details;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i])
          }
          that.setData({
            list_details: that.data.list_details,
            page: Number(that.data.page) + 1
          })
          let time = []
          for (let i = 0; i < a.data.data.length; i++) {
            time.push({
              t: t.formatDateTime(a.data.data[i].start_time * 1000)
            })
          }
          that.setData({
            starttime1: time
          }) 
          wx.hideLoading();
        }
        if (res.statusCode == 422) {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const that = this;
    const imgurl = that.data.details.user.user_icon;
    const num = imgurl.length - 8
    const imgurls = imgurl.substring(num, -1)
    const imageurl = imgurls + 'square_image'
    const user_id = t.shareuserid()
    return {
      title: that.data.details.user.nick_name +'\r\n'+ '近期'+that.data.details.auctions_num+'场拍卖会' + ' 共' + that.data.details.goods_num+'件拍品',
      desc: '近期' + that.data.details.auctions_num + '场拍卖会' + '共' + that.data.details.goods_num + '件拍品',
      path: '/pages/videos/auction_house?id=' + that.data.details.user.user_id + '&share_id=' + user_id, // 相对的路径
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
      fail: function (res) {}
    }
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
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'linear',
    })
  },
  onPageScroll: function (ev) {
    if (ev.scrollTop > 220) {
      this.animation.backgroundColor('#fff').step({
        duration: 300,
        timingFunction: 'linear',
      })
      this.setData({
        animation: this.animation.export(),
        template_name: "template_o"
      })
    } else {
      this.animation.backgroundColor('rgba(255,255,255,0)').step({
        duration: 300,
        timingFunction: 'linear',
      })
      this.setData({
        animation: this.animation.export(),
        template_name: "template_h"
      })
    }
  },
  goauction(e){
    wx.navigateTo({
      url: '../videos/auction?id=' + e.currentTarget.dataset.id,
    })
  },
  launchAppError(e) {
    if (e.detail.errMsg == 'invalid scene') {
      wx.navigateTo({
        url: '../download/download',
      })
    }
  },
})