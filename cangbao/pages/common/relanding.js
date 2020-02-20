//重新登陆
const app = getApp()
function relanding(){
  wx.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        wx.getNetworkType({
          success(Netres) {
            wx.request({
              url: app.api.login,
              method: 'post',
              data: {
                wechat_code: res.code,
              },
              header: {
                "content-type": "application/json",
                "cache-control": "private, must-revalidate",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success: function (res) {
                  wx.setStorage({
                    key: "token",
                    data: res.data.data.access_token
                  })
              },
              fail: function (res) { }
            })
          }
        })

      }
    },
    fail: function (res) { }
  })
}

//转化成小程序模板语言 这一步非常重要 不然无法正确调用
module.exports = {
  relanding: relanding
};