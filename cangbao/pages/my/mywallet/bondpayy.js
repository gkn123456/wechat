// pages/my/mywallet/payy.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const form = require('../../common/formid.js')
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    endDate1: '',
    endDate2: '',
    endDate3: '',
    id: '',
    paymode: [],  // 支付方式信息
    paytype: '',  // 支付方式选择
    code: '',
    num:'',
    navH: '',
    headtitle: '选择支付方式',
    type:'',
    flag:true,
  },
  // 提交form id
  formSubmit: function (e) {
    form.form(e.detail.formId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight
    })
    if (options!==undefined){
      that.setData({
        num: options.num,
        type: options.type
      })
    }
    // 获取支付方式
    wx.request({
      url: app.api.pay_type + '3',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        that.setData({
          paymode: res.data.data
        })
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].default == 1) {
            that.setData({
              paytype: res.data.data[i].pay_mark
            })
          }
        }
      }
    })
  },
  // 单选点击
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
  },
  // 确认支付按钮
  ispay() {
    var that = this
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
        wx.request({
          url: app.api.recharge,
          data: {
            pay_type: that.data.paytype,
            wechat_code: res.code,
            recharge_amount: that.data.num,
            recharge_type: 2
          },
          method: 'post',
          header: t.logintype(),
          success: function (res) {
            if (res.statusCode == 200) {
              if (that.data.paytype == "balance") {
                if (res.data.status_code !== 200) {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none'
                  })
                }
                else {
                  wx.redirectTo({
                    url: '../../paysuccess/bondcashsuccess?type=' + that.data.type,
                  })
                }
              } else {
                form.prepay(res.data.data.wechat_mini.package.substring(10, res.data.data.wechat_mini.package.length))
                if (res.data.status_code !== 200) {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none'
                  })
                }
                else if (res.data.status_code == 200) {
                  wx.requestPayment({
                    timeStamp: res.data.data.wechat_mini.timeStamp,
                    nonceStr: res.data.data.wechat_mini.nonceStr,
                    package: res.data.data.wechat_mini.package,
                    signType: 'MD5',
                    paySign: res.data.data.wechat_mini.paySign,
                    success(res) {
                      wx.redirectTo({
                        url: '../../paysuccess/bondcashsuccess?type=' + that.data.type,
                      })
                    },
                    fail(d) {

                    }
                  })
                }
              }
            }
            if (res.statusCode == 422) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
            if (res.statusCode == 401) {
              relanding.relanding()
              setTimeout(function () {
                that.ispay()
              }, 1000)
            }
          },
        })
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
    var that = this
    that.onLoad()
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
      url: '../../index/index',
    })
  }
})