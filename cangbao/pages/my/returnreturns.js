// pages/my/returnreturns.js
const app = getApp()
const relanding = require('../common/relanding.js')
const t = require('../common/time.js')
const form = require('../common/formid.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wl:[],
    order:[],
    xz:'0',
    index: 0,
    t:'',
    t1: '',
    t2: '',
    t3: '',
    t4: '',
    t5: '',
    freight_code: '', // 物流公司编号
    delivery_code: '',// 运单号
    id: '',           // 订单号
    value:'',
    navH: '',
    headtitle: '发回退货',
    time:'',
    types:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      id:options.id,
      types: options.types
    })
        // 订单信息
        if (options.types==1){
          that.setData({
            headtitle:'发回退货'
          })
          wx.request({
            url: app.api.order_details + that.data.id,
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (b) {
              that.setData({
                order: b.data.data,
                t:t.formatDateTime(b.data.data.return_info.end_buyer_send_time * 1000)
              })
            }
          })
        }else{
          that.setData({
            headtitle: '发货'
          })
          wx.request({
            url: app.api.seller_order + that.data.id,
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (b) {
              that.setData({
                order: b.data.data,
              })
              timer1: setInterval(function () {
                that.setData({
                  time: t.countdown(b.data.data.end_send_time)
                })

              }, 1000)
            }
          })
        }
        // 可用物流
        wx.request({
          url: app.api.delivery,
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (a) {
            that.setData({
              wl:a.data.data
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
    wx.setNavigationBarTitle({
      title: '发回退货',
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
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.onLoad()
    }
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
  // 物流选择
  bindPickerChange(e) {
      this.setData({
        index: e.detail.value,
        freight_code: this.data.wl[e.detail.value].freight_code
      })
  },
  xz(){
    this.setData({
      xz:'1',
      freight_code: this.data.wl[0].freight_code
    })
  },
  input1(e){
    this.setData({
      delivery_code: e.detail.value,
      value: e.detail.value
    })
  },
  send(){
    var that=this
    if(that.data.types==1){
      wx.request({
        url: app.api.buyer_return,
        data: {
          freight_code: that.data.freight_code, // 物流公司编号
          delivery_code: that.data.delivery_code,// 运单号
          order_id: that.data.id,     // 订单号
        },
        method: 'post',
        header: t.logintype(),
        success: function (a) {
          wx.showToast({
            title: a.data.message,
            icon: 'none'
          })
          if (a.statusCode == 422) {

          } if (a.statusCode == 200) {
            wx.showToast({
              title:'发货成功',
              icon: 'none'
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              });
            },1500) 
          }
        }
      })
    }else{
      wx.request({
        url: app.api.deller_delivery,
        data: {
          freight_code: that.data.freight_code, // 物流公司编号
          delivery_code: that.data.delivery_code,// 运单号
          order_id: that.data.id,     // 订单号
        },
        method: 'post',
        header: t.logintype(),
        success: function (a) {
          wx.showToast({
            title: a.data.message,
            icon: 'none'
          })
          if (a.statusCode == 422) {

          } if (a.statusCode == 200) {
            wx.showToast({
              title: '发货成功',
              icon: 'none'
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 1500)
          }
        }
      })
    }
  },
  sys(){
    var that=this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        that.setData({
          delivery_code: res.result,
          value: res.result
        })
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
      url: '../index/index',
    })
  },
  copy() {
    var that = this
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: that.data.order.pca_text + that.data.order.address,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  },
})