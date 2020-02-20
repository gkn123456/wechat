// pageA/pages/grant/grant.js
const app = getApp()
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight
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
  btn_sub: function () {
    wx.getUserInfo({
      success: function (res) {
        wx.login({
          success: function (res) {
            try {
              var infores = wx.getSystemInfoSync()
            } catch (e) { }
            if (res.code) {
              wx.showToast({
                title: '加载中...',
                mask: true,
                icon: 'loading'
              })
              wx.getNetworkType({
                success(Netres) {
                  wx.request({
                    url: app.api.login,
                    method: 'post',
                    data: {
                      wechat_code: res.code,
                      system_version: infores.version,
                      brand: infores.brand,
                      model: infores.model,
                    },
                    header: {
                      "content-type": "application/json",
                      "cache-control": "private, must-revalidate",
                      "x-os": "wechat_mini",
                      "x-net": Netres.networkType,
                      "x-app-version": app.api.edition
                    },
                    success: function (res) {
                      if (res.data.data.bind_stauts == 1) {
                        //获取到用户凭证 存儲 token 
                        wx.setStorage({
                          key: "token",
                          data: res.data.data.access_token
                        })
                        wx.showToast({
                          title: '登录成功',
                          icon: 'success',
                          duration: 1000
                        })
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                      else if (res.data.data.bind_stauts == 0) {
                        wx.redirectTo({
                          url: '../../../pages/number/number',
                        })
                      }
                    },
                    fail: function (res) { }
                  })
                }
              })
            }
          },
          fail: function (res) { }
        })
      },
      fail: function () {
        wx.clearStorage()
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {
                    wx.getUserInfo({
                      success: function (res) {
                        onLogin()
                      }
                    })
                  }
                }, fail: function (res) { }
              })
            }
          }
        })
      }
    })
  },
})