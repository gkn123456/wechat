//获取formid
const app = getApp()
function form(n) {
  wx.getStorage({
    key: 'token',
    success(c) {
      wx.request({
        url: app.api.formId,
        method: 'post',
        data: {
          type: '1',
          value:n
        },
        header: {
          "Authorization": 'bearer' + c.data,
          "x-os": "wechat_mini",
          "x-app-version": app.api.edition
        },
        success(a) {}
      })
    }
  })
}
//支付
function prepay(n) {
  wx.getStorage({
    key: 'token',
    success(c) {
      wx.request({
        url: app.api.formId,
        method: 'post',
        data: {
          type: '2',
          value: n
        },
        header: {
          "Authorization": 'bearer' + c.data,
          "x-os": "wechat_mini",
          "x-app-version": app.api.edition
        },
        success(a) {

        }
      })
    }
  })
}

//转化成小程序模板语言 这一步非常重要 不然无法正确调用
module.exports = {
 form:form,
  prepay: prepay
};