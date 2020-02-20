// pages/buybond/Paydeposit.js
const app = getApp()
const form = require('../common/formid.js')
const t = require('../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    title:'',
    cover: '',
    start: '',
    range: '',
    deposit:'',
    items: [
      { name: 'yue', value: '余额支付', checked: 'true' },
      { name: 'wex', value: '微信支付' },
    ],
    details: [],
    id: '',
    paymode: [],  // 支付方式信息
    paytype: '',  // 支付方式选择
    navH: '',
    headtitle: '卖家保证金',
    isrecharge: 0
  },
  // 跳转协议页
  goread() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.bondrule,
    })
  },
  // 单选点击
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
  },
  determinepay(){
    const that=this
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
        wx.request({
          url: app.api.goods_deposit,
          data: {
            goods_id: that.data.id,
            pay_type: that.data.paytype,
            wechat_code: res.code,
            role: 2
          },
          method: 'post',
          header: t.logintype(),
          success: function (res) {
            if (that.data.paytype == "balance") {
              if (res.data.status_code !== 200) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
              else {
                wx.navigateTo({
                  url: '../paysuccess/relsuccess_s?id=' + that.data.id + '&type=1',
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
                if (that.data.flag == true) {
                  wx.requestPayment({
                    timeStamp: res.data.data.wechat_mini.timeStamp,
                    nonceStr: res.data.data.wechat_mini.nonceStr,
                    package: res.data.data.wechat_mini.package,
                    signType: 'MD5',
                    paySign: res.data.data.wechat_mini.paySign,
                    success(res) {
                      that.setData({
                        flag: false
                      })
                      wx.navigateTo({
                        url: '../paysuccess/relsuccess_s?id=' + that.data.id + '&type=1',
                      })

                    },
                    fail(d) { }
                  })
                }
              }
            }


          },


        })
      }
    })
  },
  // 确认支付按钮
  ispay() {
    var that = this
    if (that.data.paytype == 'balance') {
      that.determinepay()
    } else {
      if (that.data.deposit > 50000) {
        that.setData({
          quota: 1
        })
      } else {
        that.determinepay()
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    if (options !== undefined) {
      
      that.setData({
        id: options.id,
        title: options.title,
        cover: 'https://images.cangbaopai.com/'+options.cover,
        start: options.start,
        range: options.range,
        deposit:options.deposit
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
          paymode: res.data.data,
          paytype: res.data.data[1].pay_mark
        })
        that.isfs()
      }
    })
  },
  isfs(){
    const that=this
    setTimeout(function () {
      const balance = that.data.paymode[0].amount
      if (Number(that.data.deposit) <= Number(balance)) {
        that.setData({
          paytype: 'balance',
          isrecharge: 0
        })
      } else {
        that.setData({
          isrecharge: 1
        })
      }
    }, 200)
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
    wx.setNavigationBarTitle({
      title: '卖家保证金',
    })
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
  // 跳转充值界面
  gorecharge() {
    wx.navigateTo({
      url: '../my/mywallet/rech?type=2',
    })
  },
  // 关闭限额弹框
  closequota(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    if (id == 0) {
      that.setData({
        quota: 0
      })
      that.determinepay()
    } if (id == 1) {
      that.setData({
        quota: 0
      })
      that.goquota()
    }
    if (id == 2) {
      that.setData({
        quota: 1
      })
    }
    if (id == 3) {
      that.setData({
        quota: 0
      })
    }
  },
  goquota() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.quota,
    })
  },
})