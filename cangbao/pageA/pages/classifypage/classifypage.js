// pageA/pages/classifypage/classifypage.js
const app = getApp()
const login = require('../../../pages/common/login.js')
const t = require('../../../pages/common/time.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header: {
      "x-os": "wechat_mini",
      "x-app-version": app.api.edition,
      "content-type": "application/json",
      "cache-control": "private, must-revalidate"
    },
    navH: '',
    headtitle: '',
    // 索引id
    id: '',
    //拍品数组
    cate:null,
    page:'2'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      id: options.id,
      headtitle:options.name
    })
    that.tokens()
    that.cate()
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
// 获取分类拍品
  cate(){
    var that = this
    wx.request({
      url: app.api.classgoodslist+that.data.id+'&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if(b.data==''){
          that.setData({
            cate: null
          })
        }else{
          that.setData({
            cate: b.data.data
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
      url: '../../../pages/index/index',
    })
  },
  go_video(e){
    wx.navigateTo({
      url: '../../../pages/videos/videos?id=' + e.currentTarget.dataset.id,
    })
  },
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.api.classgoodslist + that.data.id + '&page=' + that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.data == '') {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } else {
          var moment_list = that.data.cate;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
            
          }
          that.setData({
            cate: that.data.cate,
            page: Number(that.data.page) + 1
          })
         
        }
        wx.hideLoading();
      }
    })
  }
})