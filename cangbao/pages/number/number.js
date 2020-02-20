const app = getApp()

Page({
  data: {
    login_member: '',         //手机号
    login_code: null,         //验证码
    input_login_code: '',     //输入的验证码
    get_code_status: true,    //状态判断
    show_get_code: '获取验证码',
    get_code_time: 60,
    code:'',
    iv:'',
    encryptedData:'',
    navH: '',
    headtitle: '',
  },
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })

  },
  goread(){
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=https://www.cangbaopai.com/xieyi/usera.html',
    })
  },
  formsubmit(){
    var that=this
    wx.login({
      success:function(a){
        that.setData({
          code:a.code
        })
        try {
          var infores = wx.getSystemInfoSync()
        } catch (e) {
          // Do something when catch error
        }
        wx.getUserInfo({
          success(b){
            that.setData({
              iv:b.iv ,
              encryptedData: b.encryptedData
            })
            wx.getNetworkType({
              success(Netres) {
                let u = wx.getStorageSync('share_id');
                let share_id=''
                if (!u) {
                  share_id=''
                } else {
                  share_id = wx.getStorageSync('share_id')
                }
                wx.request({
                  url: app.api.login_mobile,
                  data: {
                    mobile: that.data.login_member,
                    code: that.data.input_login_code,
                    wechat_code: a.code,
                    encrypted_data: b.encryptedData,
                    iv: b.iv,
                    system_version: infores.version,
                    brand: infores.brand,
                    model: infores.model,
                    user_id: share_id
                  },
                  method: 'post',
                  header: {
                    "content-type": "application/json",
                    "cache-control": "private, must-revalidate",
                    "x-net": Netres.networkType,
                    "x-os": "wechat_mini",
                    "x-app-version": app.api.edition
                  },
                  success(res) {
                    if (res.data.status_code == 422) {
                      wx.showToast({
                        title: res.data.message,
                        icon: 'none'
                      })
                    } else {
                      wx.setStorage({
                        key: "token",
                        data: res.data.data.access_token
                      })
                      wx.navigateBack({

                      })
                    }
                  }
                })
              }
            })
          }
        })
      },
    })
  },
   userInfoSetInSQL(userInfo) {
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.user,
          data: {},
          method: 'get',
          header: {
            "Authorization": 'bearer' + res.data,
            "content-type": "application/json",
            "cache-control": "no-cache, private",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success: function (a) {
            wx.switchTab({
              url: '../my/my',
              success(res) {
                let page = getCurrentPages().pop()
                if (page == undefined || page == null) {
                  return
                }
                page.onLoad()
              }
            })
            if (a) {

            }
            else {
             
            }
          }
        })
      }
    })
  },
  
  input_val: function (e) {
    var userphone = e.detail.value;
    this.setData({
      login_member: userphone
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
    wx.request({
      url: app.api.verify,
      data: {
        type:1,
        mobile: that.data.login_member
      },
      method:'post',
      header:{
        "content-type": "application/json",
        "cache-control": "private, must-revalidate",
        "x-os": "wechat_mini",
        "x-app-version": app.api.edition
      },
      success: function (res) {
        if (res.data.status_code == 200) {
          var timer = setInterval(function () {
            if (that.data.get_code_time > 0) {
              that.setData({
                get_code_time: that.data.get_code_time - 1,
                show_get_code: '剩余' + (that.data.get_code_time - 1) + '秒',
                get_code_status: false
              });
            } else {
              clearInterval(timer);
              that.setData({
                get_code_time: 60,
                show_get_code: '获取验证码',
                get_code_status: true
              });
            }
          }, 1000);
          that.setData({
            login_code: res.data.data.code       //后台返回的验证码，可以做判断用
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          });
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
  }
})