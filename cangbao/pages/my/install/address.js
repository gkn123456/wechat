// pages/my/install/address.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    id:'',
    t:'',
    navH: '',
    headtitle: '地址管理',
    header:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })
    if (options!==undefined){
      that.setData({
        id: options.id,
        t: options.t,
      })
    }
    that.tokens()
    that.list()
  },
  // 登陆头部定义
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
            token: 'bearer ' + r.data,
          })
        }
      })
    }
  },
  list(){
    const that=this
    wx.request({
      url: app.api.address,
      data: {},
      method: 'get',
      header: t.logintype(),
      success(res) {
        if (res.statusCode ==204) {
          that.setData({
            list: null
          })
        } 
        if (res.statusCode == 200) {
          that.setData({
            list: res.data.data
          })
        }
      }
    })
  },
  addnew(){
    wx.navigateTo({
      url: './addnewaddress',
    })
  },
  goorder(e){
    var that=this
    if(that.data.id!==undefined){
      if (that.data.id == 'cs') {
        wx.setStorage({
          key: "applyid",
          data: e.currentTarget.dataset.wareid,
          success() {
            wx.navigateBack({
              success() {
                let page = getCurrentPages().pop()
                if (page == undefined || page == null) {
                  return
                }
                page.onShow()
              }
            })
          }
        })
      } else {
        wx.request({
          url: app.api.order_addressput,
          data: {
            address_id: e.currentTarget.dataset.id,
            order_id: that.data.id
          },
          method: 'put',
          header: t.logintype(),
          success(res) {
            wx.navigateBack({
              success() {
                let page = getCurrentPages().pop()
                if (page == undefined || page == null) {
                  return
                }
                page.onShow()
              }
            })
          }
        })
      }
    }else{}
    if (that.data.t == 1) {
      wx.setStorage({
        key: "wareid",
        data: e.currentTarget.dataset.wareid,
        success(){
          wx.navigateBack({
            success() {
              let page = getCurrentPages().pop()
              page.onShow()
            }
          })
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
    this.list()
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
    let page = getCurrentPages().pop()
    if (page == undefined || page == null) {
      return
    }
    page.onShow()
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