const app = getApp()
const common = require('../../pages/common/common.js')
const relanding = require('../../pages/common/relanding.js')
const t = require('../../pages/common/time.js')
const login = require('../../pages/common/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    headnav:[{ 'id': 0, 'type': '关注' }, { 'id': 1, 'type': '热门'}],
    nav_id:0,
    room:null,
    hotroom:null,
    page:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
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
    if (that.data.nav_id == 1){
      that.livelist()
    }else{
      that.live_hotlist()
    }
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
    const that=this
    that.setData({
      page:2
    })
    wx.showLoading({})
    if (that.data.nav_id==1){
      that.livelist()
    }else{
      that.live_hotlist()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that=this
    wx.showLoading({
      title: '加载中'
    })
    const url = that.data.nav_id == 1 ? app.api.live_list + that.data.page : app.api.live_list + that.data.page +'?mark=follow'
    wx.request({
      url: url,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } if (res.statusCode == 200) {
          if (that.data.nav_id == 1){
            const room = that.data.room
            for (var i = 0; i < res.data.data.length; i++) {
              room.push(res.data.data[i]);
            }
            that.setData({
              room: that.data.room,
              page: Number(that.data.page) + 1
            }, () => {
              wx.hideLoading()
            })
          }else{
            const hotroom = that.data.hotroom
            for (var i = 0; i < res.data.data.length; i++) {
              hotroom.push(res.data.data[i]);
            }
            that.setData({
              hotroom: that.data.hotroom,
              page: Number(that.data.page) + 1
            }, () => {
              wx.hideLoading()
            })
          }
        }
        if (res.statusCode == 422) {
          wx.hideLoading();
          t.alert(res.data.message)
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  switch_head(e){
    const that=this
    that.setData({
      nav_id: e.currentTarget.dataset.id,
      page:2
    })
    wx.showLoading({
      title: '',
    })
    if (e.currentTarget.dataset.id == 1) {
      that.livelist()
    } else {
      that.live_hotlist() 
    }
  },
  // 跳转直播间
  goliveplayer(e){
    wx.navigateTo({
      url: '../liveplayer/liveplayer?id=' + e.currentTarget.dataset.id
    })
  },
  // 直播列表
  livelist() {
    const that = this
    wx.request({
      url: app.api.live_list + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode==200){
          that.setData({
            room:res.data.data
          },()=>{
            wx.hideLoading()
            wx.stopPullDownRefresh()
          })
        }else{
          wx.hideLoading()
          wx.stopPullDownRefresh()
          that.setData({
            room: null
          })
        }
      }
    })
  },
  live_hotlist() {
    const that = this
    wx.request({
      url: app.api.live_list + '1?mark=follow',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            hotroom: res.data.data
          }, () => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
          })
        } else {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          that.setData({
            hotroom: null
          })
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
      url: '../../pages/index/index',
    })
  },
})