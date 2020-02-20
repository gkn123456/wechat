// pages/my/mywallet/proving.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_code:'',         //传过来的验证码
    input_login_code: '',     //用户输入的验证码
    get_code_status: true,    //是否能点击获取验证码的状态判断
    show_get_code: '获取验证码',
    cstyle:'color:#FF3740;border:2rpx solid #FF3740;',
    get_code_time: 60,
    code: '',
    iv: '',
    encryptedData: '',
    id:'',
    navH: '',
    headtitle: '需验证身份',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight
    })
    wx.request({
      url: app.api.user,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          that.setData({
            id: b.data.data.mobile,
          })
        }
        if (b.statusCode == 401) {
          relanding.relanding()
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
      url: '../../index/index',
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
      title: '需验证身份',
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
  // 点击事件
  formsubmit() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.checkpassword,
          data: {
            code: that.data.input_login_code,
          },
          method: 'post',
          header: {
            "Authorization": 'bearer' + res.data,
            "content-type": "application/json",
            "cache-control": "private, must-revalidate",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success(a) {
            if (a.data.status_code == 422) {
              wx.showToast({
                title: a.data.message,
                icon: 'none'
              })
            } 
            if(a.data.status_code == 200){
              wx.redirectTo({
                url: 'paypage?code=' + that.data.input_login_code,
              })
            }
            if (a.data.status_code == 401) {
              relanding.relanding()
              setTimeout(function () {
                that.formsubmit()
              }, 1000)
            }
          }
        })
      }
    })
  },
  input_val1: function (e) {
    var usermessage = e.detail.value;
    this.setData({
      input_login_code: usermessage
    })
  },
  check: function () {
    if (!this.data.get_code_status) {
      wx.showToast({
        title: '正在获取',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else {
      if (this.data.login_member.length == 11) {
        var myreg = /^1\d{10}$/;
        if (!myreg.test(this.data.login_member)) {
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'loading',
            duration: 1000
          });
          return;
        } else {
          this.get_code();
        }
      } else {
        wx.showToast({
          title: '请输入完整手机号',
          icon: 'loading',
          duration: 1000
        })
        return;
      }
    }
  },
  get_code: function () {
    var that = this;
    if (that.data.get_code_status==true){
      wx.getStorage({
        key: 'token',
        success(res) {
          wx.request({
            url: app.api.verify,
            data: {
              type: 2
            },
            method: 'post',
            header: {
              "Authorization": 'bearer' + res.data,
              "content-type": "application/json",
              "cache-control": "private, must-revalidate",
              "x-os": "wechat_mini",
              "x-app-version": app.api.edition
            },
            success: function (c) {
              if (c.data.status_code == 200) {
                wx.showToast({
                  title: c.data.message,
                  icon: 'none',
                  duration: 1000
                });
                var timer = setInterval(function () {
                  if (that.data.get_code_time > 0) {
                    that.setData({
                      get_code_time: that.data.get_code_time - 1,
                      show_get_code: '剩余' + (that.data.get_code_time - 1) + '秒',
                      cstyle: 'color:#AAAAAA;border:2rpx solid #AAAAAA;',
                      get_code_status: false

                    });
                  } else {
                    clearInterval(timer);
                    that.setData({
                      get_code_time: 60,
                      show_get_code: '获取验证码',
                      get_code_status: true,
                      cstyle: 'color:#FF3740;border:2rpx solid #FF3740;',
                    });
                  }
                }, 1000);
              }
              if (c.data.status_code == 422) {
                wx.showToast({
                  title: c.data.message,
                  icon: 'none',
                  duration: 1000
                });
              }
              if (c.data.status_code == 401) {
                console.log('token过期')
                relanding.relanding()
                setTimeout(function () {
                  that.get_code()
                }, 1000)
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '请求失败',
                icon: 'loading',
                duration: 1000
              });
            }
          });
        }
      })
    }
  },
  tkuan(){
    wx.showModal({
      content: '为了保证账户资金安全，只能使用注册手机号',
      showCancel:false,
      confirmText:'知道了',
      confirmColor:'#FF3740',
      success: function (res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    })
  }
})