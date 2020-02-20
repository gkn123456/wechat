// pages/buybond/ware.js
const app = getApp()
const form = require('../../pages/common/formid.js')
const t = require('../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    paytype: '',// 支付方式选择
    id:'',
    paymode: [],  // 支付方式信息
    sty1:'display:none;',
    details:[],
    det: [],
    address_id:'',
    order_id: '', //下单成功后的订单id
    pay_price: '', //需要支付的金额
    code:'',
    navH: '',
    headtitle: '确认订单',
    quota:0,
    isrecharge:0,
    num:1,
    selprice:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })
    if (options !== undefined) {
      that.setData({
        id: options.id,
        num: options.num
      },()=>{
        that.details()
      })
    }
    // 获取支付方式
    wx.request({
      url: app.api.address,
      data: {},
      method: 'get',
      header: t.logintype(),
      success(c) {
        if (c.statusCode == 204) {

        }
        if (c.statusCode == 200) {
          that.setData({
            det: c.data.data[0],
            address_id: c.data.data[0].address_id
          })
        }
      }
    })
    wx.request({
      url: app.api.pay_type + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        that.setData({
          paymode: res.data.data,
          paytype: res.data.data[1].pay_mark
        })
      }
    })
  },
  // 获取商品详情
  details(){
    const that=this
    wx.request({
      url: app.api.live_goods_info+that.data.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success(c) {
        that.setData({
          details: c.data.data,
          selprice: Number(c.data.data.sell_price) * Number(that.data.num)
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
    var that=this
    let wareid = wx.getStorageSync('wareid');
    if (!wareid) {
      wx.request({
        url: app.api.address,
        data: {},
        method: 'get',
        header: t.logintype(),
        success(c) {
          console.log(c)
          if (c.statusCode==204){

          }
          if (c.statusCode == 200) {
            that.setData({
              det: c.data.data[0],
              address_id: c.data.data[0].address_id
            })
          }
          
        }
      })
      wx.request({
        url: app.api.pay_type + '1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (res) {
          that.setData({
            paymode: res.data.data,
            paytype: res.data.data[1].pay_mark
          })
        }
      })
    } else {
      wx.getStorage({
        key: 'wareid',
        success: function (a) {
          wx.request({
            url: app.api.address,
            data: {},
            method: 'get',
            header: t.logintype(),
            success(c) {
              that.setData({
                det: c.data.data[a.data],
                address_id: c.data.data[a.data].address_id
              })
            }
          })
          wx.request({
            url: app.api.pay_type + '1',
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (res) {
              that.setData({
                paymode: res.data.data,
                paytype: res.data.data[1].pay_mark
              })
            }
          })
        }
      })
    }
    setTimeout(function () {
      const balance = that.data.paymode[0].amount
      if (Number(that.data.details.price) <= Number(balance)) {
        that.setData({
          paytype: 'balance',
          isrecharge: 0
        })
      } else {
        that.setData({
          isrecharge: 1
        })
      }
    },300)

  },
// // 判断是否有地址
// is_place(){
//   const that=this
//   if (that.data.address_id!==''){
//     that.set
//   }else{

//   }
// },
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
      prePage.onShow()
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
  // 单选点击
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
  },
  open(){
    var that=this
    that.setData({
      sty1: 'display:block;'
    })
    setTimeout(function () {
      const balance = that.data.paymode[0].amount
      if (Number(that.data.details.price) <= Number(balance)) {
        that.setData({
          paytype: 'balance',
          isrecharge: 0
        })
      }else{
        that.setData({
          isrecharge: 1
        })
      }
    }, 200)
  },
  cc(){},
  close(){
    var that = this
    that.setData({
      sty1:'display:none;'
    })
  },
  godetails(){
    const that=this
    wx.redirectTo({
      url: '../../pages/orderdetails/orderdetails?id=' + that.data.order_id,
    })
  },
  pays(){
    var that=this
    wx.showModal({
      content: '确认提交订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.live_order,
            data: {
              goods_id:that.data.id,
              address_id: that.data.address_id,
              goods_num:that.data.num
            },
            method: 'post',
            header: t.logintype(),
            success(a) {
              if (a.data.status_code==422){
                wx.showToast({
                  title: a.data.message,
                  icon:'none'
                })
              }else{
                that.setData({
                  order_id: a.data.data.order_id, //下单成功后的订单id
                  pay_price: a.data.data.pay_price //需要支付的金额
                })
                that.open()
              }
            }
          })
        } else if (res.cancel) {}
      }
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
          url: app.api.pay_order,
          data: {
            order_id: that.data.order_id,
            pay_type: that.data.paytype,
            wechat_code: res.code
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
                wx.redirectTo({
                  url: '../../pages/paysuccess/paysuccess?id=' + that.data.order_id
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
                    success(rs) {
                      that.setData({
                        flag: false
                      })
                      wx.redirectTo({
                        url: '../../pages/paysuccess/paysuccess?id=' + that.data.order_id
                      })
                    },
                    fail(d) {}
                  })
                }
              }
            }
          },
        })
      }
    })
  },
  ispay(){
    var that=this
    if (that.data.paytype == 'balance') {
      that.determinepay()
    } else {
      if (that.data.details.price > 50000) {
        that.setData({
          quota: 1
        })
      } else {
        that.determinepay()
      }
    }
    
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../pages/index/index',
    })
  },
  gopares(){
    let that=this
    wx.navigateTo({
      url: '../../pages/person/person?id=' + that.data.details.user_id,
    })
  },
  // 跳转支付限额说明
  goquota() {
    wx.navigateTo({
      url: '../../pages/my/Agreement/Agreement?src=' + app.api.quota,
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
// 跳转充值界面
  gorecharge() {
    wx.navigateTo({
      url: '../../pages/my/mywallet/rech?type=2',
    })
  }
})