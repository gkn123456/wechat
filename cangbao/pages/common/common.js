//用户登陆
const app = getApp()
function userLogin() {
  let token = wx.getStorageSync('token');
  if (!token) {
    onLogin()
  }else {}
}
function onLogin() {
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
                      wx.setStorage({
                        key: "login_userid",
                        data: res.data.data.user_id
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                      let page = getCurrentPages().pop()
                      page.onLoad()
                    }
                    else if (res.data.data.bind_stauts == 0) {
                      wx.navigateTo({
                        url: '../number/number',
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
}
function getUserInfo() {
  
}
//转化成小程序模板语言 这一步非常重要 不然无法正确调用
module.exports = {
  userLogin: userLogin
};