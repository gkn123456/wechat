// pages/my/mywallet/myband.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    car:[],
    n:'',
    card_id:'',
    navH: '',
    headtitle: '我的银行卡'
  },
  addcar(){
    var that=this
    if (that.data.user.is_real_name==0){
      wx.navigateTo({
        url: 'realname',
      })
    }else{
      wx.navigateTo({
        url: 'addcar',
      })
    }
  },
  solution(e){
    var that = this
    if(e!==undefined){
      that.setData({
        card_id: e.currentTarget.dataset.cid
      })
    }
    wx.request({
      url: app.api.bankcard,
      data: {
        card_id: that.data.card_id
      },
      method: 'delete',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          wx.showToast({
            title: b.data.message,
            icon: "none"
          })
        }
        if (b.statusCode == 200) {
          wx.showToast({
            title: b.data.message,
            icon: "none"
          })
          that.onLoad()
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.solution()
          }, 1000)
        }
      }
    })
  },
  gocash(e){
    var that=this
    if(that.data.n=="car"){
      wx.redirectTo({
        url: 'cash?urls=' + e.currentTarget.dataset.urls + '&&names=' + e.currentTarget.dataset.names + '&&num=' + e.currentTarget.dataset.num + '&&carid=' + e.currentTarget.dataset.carid,
      })
    } else if (that.data.n == "bond"){
      wx.redirectTo({
        url: 'bondtobank?urls=' + e.currentTarget.dataset.urls + '&&names=' + e.currentTarget.dataset.names + '&&num=' + e.currentTarget.dataset.num + '&&carid=' + e.currentTarget.dataset.carid,
      })
    }else{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    if (options!==undefined){
      that.setData({
        n: options.name
      })
    }
    wx.request({
      url: app.api.bankcard,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          that.setData({
            car: null,
          })
        }
        if (b.statusCode == 200) {
          that.setData({
            car: b.data.data,
          })
        }
      }
    })
    // 获取用户信息
    wx.request({
      url: app.api.user,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (c) {
        that.setData({
          user: c.data.data,
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
    const that=this
    wx.request({
      url: app.api.bankcard,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          that.setData({
            car: null,
          })
        }
        if (b.statusCode == 200) {
          that.setData({
            car: b.data.data,
          })
        }


      }
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