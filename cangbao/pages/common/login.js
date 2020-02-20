//用户登陆
const app = getApp()
function userLogin() {
  let token = wx.getStorageSync('token');
  if (!token) {
    //不存在token，调用登录
    onLogin()
  } else {}
}
function onLogin() {
  wx.getUserInfo({
    success: function (res) {
      wx.login({
        success: function (res) {
          try {
            var infores = wx.getSystemInfoSync()
          } catch (e) {
            // Do something when catch error
          }
          wx.showToast({
            title: '登陆中',
            mask: true,
            icon: 'loading'
          })
          if (res.code) {
            //发起网络请求
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
                    "x-net": Netres.networkType,
                    "x-os": "wechat_mini",
                    "x-app-version": app.api.edition
                  },
                  success: function (res) {
                    wx.setStorage({
                      key: "token",
                      data: res.data.data.access_token
                    })
                    wx.setStorage({
                      key: "login_userid",
                      data: res.data.data.user_id
                    })
                    if (res.data.data.bind_stauts == 1) {
                      //获取到用户凭证 存儲 token 
                      wx.setStorage({
                        key: "token",
                        data: res.data.data.access_token
                      })
                      wx.hideLoading()
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                    else if (res.data.data.bind_stauts == 0) {
                      wx.showToast({
                        title: '请先绑定手机号',
                        icon: 'none',
                        duration: 1000
                      })
                      setTimeout(function () {
                        wx.navigateTo({
                          url: '../number/number',
                        })
                      }, 1500)
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
              }, fail: function (res) {

              }
            })

          }
        }
      })

    }
  })
}

function userInfoSetInSQL(userInfo) {
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
          "x-app - version": app.api.edition
        },
        success: function (a) {
          if (a) {

          }
          else {
            //SQL更新用户数据失败
          }
        }
      })
    }
  })
}
//转化成小程序模板语言 这一步非常重要 不然无法正确调用
module.exports = {
  userLogin: userLogin
};