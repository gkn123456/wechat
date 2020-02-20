// pages/orderdetails/orderdetails.js
const app = getApp()
const form = require('../common/formid.js')
const t = require('../common/time.js')
const relanding = require('../common/relanding.js')
Page({
  data: {
    headtitle: '订单详情',
    id: '',  // 订单id
    flag: true,
    flag1: true,
    details:[],
    wldetails:[],
    endDate1:'',
    paytime1:'',
    sendtime1:'',
    comtime1: '',
    clock:'',
    clock1:'',
    end_pay_time:'',
    end_send_time: '',
    auto_delivery_time:'',
    intervarID:'',
    timer1:null,
    time1:[],
    time2:'',
    time3:'',
    time4:'',
    paymode: [],
    paytype: '',
    sty1: 'display:none;',
    sty2: 'display:none;',
    price: '',
    navH: '',
    rmb_price:'',
    parperid:'0',
    list:null,
    do_tyle: 'border:1px solid rgba(252,230,227,1);color:rgba(252,230,227,1);',
    amount_pay_clock:'',
    amount_clock:'',
    amount_rmb_price:'',
    allnum:'',
    isrecharge:0,
    isrecharge1: 0,
    money:0,
    cou_id:0,
  },
  // 提交form id
  formSubmit: function (e) {
    form.form(e.detail.formId)
  },
  onLoad: function (options) {
    const that=this
    that.setData({
      navH: app.globalData.navHeight
    })
    if (options!==undefined){
      that.setData({
        id: options.id
      })
    }
    wx.request({
      url: app.api.order_details + that.data.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 200) {
          wx.setStorage({
            key: "orderid",
            data: a.data.data.order_id,
          })
          that.setData({
            details: a.data.data,
            allnum: t.toFixed(2, (Number(a.data.data.real_freight) + Number(a.data.data.order_foreign_amount))),
            rmb_price: Math.round((a.data.data.order_foreign_amount * a.data.data.goods.currency_rate) * 100) / 100,
            endDate1: t.formatDateTime(a.data.data.create_time * 1000),
            paytime1: t.formatDateTime(a.data.data.pay_time * 1000),
            sendtime1: t.formatDateTime(a.data.data.send_time * 1000),
            comtime1: t.formatDateTime(a.data.data.completion_time * 1000),
            end_pay_time: a.data.data.end_pay_time,
            end_send_time: a.data.data.end_send_time,
            auto_delivery_time: a.data.data.auto_delivery_time
          })
          setTimeout(function () {
            if (wx.getStorageSync('coupon_id') !== a.data.data.coupon_id) {
              that.list()
            }
          }, 500)
          if (a.data.data.freight_status !== 0) {
            that.setData({
              amount_pay_clock: t.formatDateTime(a.data.data.order_note.pay_time * 1000),
              amount_rmb_price: Math.round((a.data.data.real_freight * a.data.data.goods.currency_rate) * 100) / 100,
            })
            that.data.intervars = setInterval(function () {
              that.setData({
                amount_clock: t.countdown(a.data.data.order_note.pay_end_time)
              })
            }, 1000)
          }
          that.settime1()
          that.settime2()
          that.settime3()
          that.settime4()
        }
        if (a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.onLoad()
          }, 500)
        }
      }
    })
  // 物流信息
    wx.request({
      url: app.api.buylogdetils + that.data.id,
      data: {},
      method: 'get',
      dataType:'json',
      header: t.logintype(),
      success: function (res1) {
        if (res1.data.status_code==422){
          that.setData({
            wldetails: null
          })
        } 
        if (res1.data.status_code == 200){
          that.setData({
            wldetails: res1.data.data
          })
        }
      },
      fail: function (fail){}
    })
    wx.request({
      url: app.api.pay_type + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (c) {
        that.setData({
          paymode: c.data.data,
          paytype: c.data.data[1].pay_mark
        })
      }
    })
    setTimeout(function () {
      that.isfs()
    }, 300)
    that.data.intervarID = setInterval(function () {
      that.setData({
        clock: t.countdown(that.data.end_pay_time),
        clock1:t.countdown(that.data.end_send_time),
        clock2: t.countdown(that.data.auto_delivery_time)
      })
    }, 1000)  
    that.comparison()
  },
  copy() {
    const that = this
    t.alert('复制成功')
    wx.setClipboardData({
      data: that.data.details.order_no,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) { }
        })
      }
    })
  },
  // 全球拍证件比对
  comparison(){},
  isfs(){
    const that=this
    wx.request({
      url: app.api.pay_type + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (c) {
        const balance = c.data.data[0].amount
        if (Number(that.data.details.order_amount) <= Number(balance)) {
          that.setData({
            paytype: 'balance',
            isrecharge: 0
          })
        } else {
          that.setData({
            isrecharge: 1
          })
        }
        if (that.data.details.type == 3) {
          if (that.data.details.order_note.amount !== '0.00') {
            if (Number(that.data.details.order_note.amount) <= Number(balance)) {
              that.setData({
                paytype: 'balance',
                isrecharge1: 0
              })
            } else {
              that.setData({
                isrecharge1: 1
              })
            }
          }
        }
      }
    })
  },
  // 提醒发货
  remind() {
    var that = this
    wx.request({
      url: app.api.order_remind,
      data: {
        order_id: that.data.id
      },
      method: 'post',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 200) {
          t.alert(a.data.message)
          that.onLoad()
        } else {
          t.alert(a.data.message)
        }
      }
    })
  },
  // 退款
  refund() {
    var that = this
    wx.showModal({
      content: '确认退款吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.order_refund,
            data: {
              order_id:that.data.id
            },
            method: 'post',
            header: t.logintype(),
            success: function (a) {
              if (a.statusCode == 200) {
                t.alert(a.data.message)
                that.onLoad()
              } else {
                t.alert(a.data.message)
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
// 删除订单
  detelorder(){
    var that=this
    wx.showModal({
      content: '确认删除订单?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.order_details,
            data: {
              order_id: that.data.id
            },
            method: 'delete',
            header: t.logintype(),
            success: function (a) {
              if (a.statusCode == 200) {
                t.alert(a.data.message)
              } else {
                t.alert(a.data.message)
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  // 确认收货
  confirmreceipt() {
    var that = this
    wx.showModal({
      content: '确认收货后货款将打入卖家账户,是否确认收到?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.order_confirm,
            data: {
              order_id: that.data.id
            },
            method: 'post',
            header: t.logintype(),
            success: function (a) {
              if (a.statusCode == 200) {
                t.alert(a.data.message)
                that.onLoad()
              } else {
                t.alert(a.data.message)
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  // 取消申请
  cancel(){
    var that=this
    wx.showModal({
      content: '确认取消申请吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.order_del_refund,
            data: {
              order_id: that.data.id
            },
            method: 'post',
            header: t.logintype(),
            success: function (a) {
              if (a.statusCode == 200) {
                t.alert(a.data.message)
                that.onLoad()
              } else {
                t.alert(a.data.message)
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that=this
    setTimeout(function () {
      const i = that.data.details.coupon_id
      wx.setStorageSync("coupon_id", that.data.details.coupon_id)
      if (that.data.details.promotions!== 0.00) {
        that.setData({
          money: that.data.details.promotions,
        })
      }
    }, 500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    that.onLoad()
    that.comparison()
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
    }
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  list(){
    const that=this
    const id = wx.getStorageSync('coupon_id');
    wx.request({
      url: app.api.availablelist + that.data.id,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          that.setData({
            money: 0,
            cou_id: 0
          })
        } 
        else if (res.statusCode == 200) {
          var json = 0
          var jsons =0
          for (let i in res.data.data.usable) {
            if (res.data.data.usable[i].id==id){
              var json=res.data.data.usable[i].coupon.money
              var jsons=res.data.data.usable[i].id
            }
          }
          that.setData({
            money:json,
            cou_id:jsons
          })
        } else {}
      }
    })
  },
  govideos(){
    var that=this
    if (that.data.details.type==1){
      wx.navigateTo({
        url: '../videos/videos?id=' + that.data.details.goods.goods_id,
      })
    }else{
      wx.navigateTo({
        url: '../videos/commoditydetails?id=' + that.data.details.goods.goods_id + '&type=' + that.data.details.goods.class,
      })
    }
  },
  gopreson(){
    var that = this
    wx.navigateTo({
      url: '../person/person?id=' + that.data.details.seller.user_id,
    })
  },
  // 跳转拍卖行
  go_ahouse() {
    var that = this
    wx.navigateTo({
      url: '../videos/auction_house?id=' + that.data.details.seller.user_id,
    })
  },
  // 跳转全球拍拍品详情
  go_global(){
    var that = this
    wx.navigateTo({
      url: '../videos/global?id=' + that.data.details.goods.goods_id,
    })
  },
  // 添加清关证件
  add_edit(){
    var that = this
    if (that.data.details.status == 1 || (that.data.details.status == 2 && that.data.details.freight_status!==2)){
      wx.navigateTo({
        url: '../my/install/paper?iden=1' + '&order_id=' + that.data.details.order_id,
      })
    }
  },
  // 无收货地址跳转
  addnewaddress(e){
    var that = this
    wx.navigateTo({
      url: '../my/install/address?id=' + that.data.details.order_id,
    })
  },
  // 改变收货地址
  addresst(e){
    var that = this
    if (that.data.details.status == 1 || (that.data.details.type==3&&that.data.details.status == 2 && that.data.details.freight_status !== 2)) {
      wx.navigateTo({
        url: '../my/install/address?id=' + that.data.details.order_id,
      })
    }
  },
  goev(){
    var that=this
    wx.redirectTo({
      url: '../orderdetails/evaluate?id=' + that.data.id,
    })
  },
// 退货流程时间
  settime1() {
    var that = this
    if (that.data.details.process !== null) {
      const storage1 = [];
      const length4 = that.data.details.process.length;
      for (let i = 0; i < length4; i++) {
        storage1.push({
          id: i,
          text: t.formatDateTime(that.data.details.process[i].time * 1000), 
        })
      }
      that.setData({
        time1: storage1,
      })
    }
  },
  // 买家待发货倒计时
  settime2() {
    var that = this
    if (that.data.details.process !== null) {
      that.setData({
        timer1: setInterval(function () {
            that.setData({
              time2: t.countdown(that.data.details.return_info.end_buyer_send_time)
            })
        }, 1000)
      })
    } else {
    }
  },
  // 卖家同意退货倒计时
  settime3() {
    var that = this
    if (that.data.details.process !== null) {
      that.setData({
        timer3: setInterval(function () {
          that.setData({
            time3: t.countdown(that.data.details.return_info.end_seller_agree_time)
          })
        }, 1000)
      })
    } else {
    }
  },
  // 卖家逾期倒计时
  settime4() {
    var that = this
    if (that.data.details.process !== null) {
      that.setData({
        timer4: setInterval(function () {
          that.setData({
            time4: t.countdown(that.data.details.return_info.end_seller_accept_time)
          })
        }, 1000)
      })
    } else {
    }
  },
  // 退货
  returngoods(e) {
    var that=this
    wx.navigateTo({
      url: '../my/returngoods?id=' + that.data.id + '&title=' + that.data.details.goods.title + '&cover=' + that.data.details.goods.cover + '&price=' + that.data.details.order_amount + '&time=' + that.data.comtime1 + '&uname=' + that.data.details.seller.nick_name + '&uimg=' + that.data.details.seller.user_icon + '&type=1',
    })
  },
  goretu(){
    var that = this
    wx.navigateTo({
      url: '../my/returnreturns?id=' + that.data.id + '&types=1',
    })
  },
  // 单选点击
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
  },
  open() {
    var that = this
    if (that.data.details.accept_name == '') {
      wx.showModal({
        content: '尚未添加收货地址，是否立即添加？',
        cancelText: '取消',
        confirmText: '立即添加',
        confirmColor:'#09BB07',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../my/install/address?id=' + that.data.details.order_id,
            })
          } else if (res.cancel) {}
        }
      })
    } else {
      if (that.data.details.type == 3) {
        that.setData({
          sty1: 'display:block;',
          do_tyle: 'border:1rpx solid #EF5350;color:#EF5350;'
        })
      } else {
        that.setData({
          sty1: 'display:block;',
        })
      }
    }
  },
  close() {
    var that = this
    that.setData({
      sty1: 'display:none;'
    })
  },
  freightopen() {
    var that = this
    that.setData({
      sty2: 'display:block;',
    })
  },
  freightclose() {
    var that = this
    that.setData({
      sty2: 'display:none;'
    })
  },
  determinepays(){
    const that=this
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
        wx.request({
          url: app.api.global_payfreight,
          data: {
            order_id: that.data.id,
            pay_type: that.data.paytype,
            wechat_code: that.data.code
          },
          method: 'post',
          header: t.logintype(),
          success: function (res) {
            if (res.data.status_code == 500) {
              t.alert(res.data.message)
            } else {
              if (that.data.paytype == "balance") {
                if (res.data.status_code !== 200) {
                  t.alert(res.data.message)
                }
                else {
                  that.freightclose()
                  wx.navigateTo({
                    url: '../paysuccess/paysuccess?id=' + that.data.details.order_id
                  })
                }
              } else {
                form.prepay(res.data.data.wechat_mini.package.substring(10, res.data.data.wechat_mini.package.length))
                if (res.data.status_code !== 200) {
                  t.alert(res.data.message)
                }
                else if (res.data.status_code == 200) {
                  if (that.data.flag1 == true) {
                    wx.requestPayment({
                      timeStamp: res.data.data.wechat_mini.timeStamp,
                      nonceStr: res.data.data.wechat_mini.nonceStr,
                      package: res.data.data.wechat_mini.package,
                      signType: 'MD5',
                      paySign: res.data.data.wechat_mini.paySign,
                      success(rs) {
                        that.setData({
                          flag1: false
                        })
                        that.freightclose()
                        wx.navigateTo({
                          url: '../paysuccess/paysuccess?id=' + that.data.details.order_id
                        })
                      },
                      fail(d) {}
                    })
                  }
                }
              }
            }
          },
        })
      }
    })
  },
  // 支付运费
  ispayfreight(){
    let that=this
    if (that.data.paytype == 'balance') {
      that.determinepays()
    } else {
      if (that.data.details.order_note.amount > 50000) {
        that.setData({
          quota: 1
        })
      } else {
        that.determinepays()
      }
    }
  },
  determinepay(){
    const that=this
    const coupon_id = that.data.money > 0 ? wx.getStorageSync('coupon_id'):0
    if (that.data.details.type == 3) {
      if (that.data.details.status == 1) {
        wx.login({
          success(res) {
            that.setData({
              code: res.code
            })
            wx.request({
              url: app.api.pay_order,
              data: {
                order_id: that.data.id,
                pay_type: that.data.paytype,
                wechat_code: that.data.code,
                coupon_id: coupon_id
              },
              method: 'post',
              header: t.logintype(),
              success: function (res) {
                if (res.data.status_code == 500) {
                  t.alert(res.data.message)
                } else {
                  if (that.data.paytype == "balance") {
                    if (res.data.status_code !== 200) {
                      t.alert(res.data.message)
                    }
                    else {
                      that.close()
                      wx.navigateTo({
                        url: '../paysuccess/paysuccess?id=' + that.data.details.order_id
                      })
                    }
                  } else {
                    form.prepay(res.data.data.wechat_mini.package.substring(10, res.data.data.wechat_mini.package.length))
                    if (res.data.status_code !== 200) {
                      t.alert(res.data.message)
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
                            that.close()
                            wx.navigateTo({
                              url: '../paysuccess/paysuccess?id=' + that.data.details.order_id
                            })
                          },
                          fail(d) { }
                        })
                      }

                    }
                  }
                }
              },
            })
          }
        })
      } else {}
    } else {
      wx.login({
        success(res) {
          that.setData({
            code: res.code
          })
          wx.request({
            url: app.api.pay_order,
            data: {
              order_id: that.data.id,
              pay_type: that.data.paytype,
              wechat_code: that.data.code,
              coupon_id: coupon_id
            },
            method: 'post',
            header: t.logintype(),
            success: function (res) {
              if (res.data.status_code == 500) {
                t.alert(res.data.message)
              } else {
                if (that.data.paytype == "balance") {
                  if (res.data.status_code !== 200) {
                    t.alert(res.data.message)
                  }
                  else {
                    that.close()
                    wx.navigateTo({
                      url: '../paysuccess/paysuccess?id=' + that.data.details.order_id
                    })
                  }
                } else {
                  form.prepay(res.data.data.wechat_mini.package.substring(10, res.data.data.wechat_mini.package.length))
                  if (res.data.status_code !== 200) {
                    t.alert(res.data.message)
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
                          that.close()
                          wx.navigateTo({
                            url: '../paysuccess/paysuccess?id=' + that.data.details.order_id
                          })
                        },
                        fail(d) { }
                      })
                    }
                  }
                }
              }
            },
          })
        }
      })
    }
  },
  // 支付
  ispay() {
    var that = this
    if (that.data.paytype == 'balance') {
      that.determinepay()
    } else {
      if (that.data.details.order_amount > 50000) {
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
      url: '../index/index',
    })
  },
  tis(){
    wx.showModal({
      content: '全球拍可以协助客户安排物流运输至中国或境外指定地址，客户授权全球拍及其合作物流公司运输货品，由买家承担物流费用及风险。若客户选择自提，则全球拍不承担任何责任。如需帮助，请联系客服。',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#FF3740',
      success: function (res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    })
  },
  lx() {
    wx.showModal({
      title: '藏宝',
      content: '暂未开放此功能,是否下载APP',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../download/download',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  // 跳转支付限额说明
  goquota() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.quota,
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
      url: '../my/mywallet/rech?type=2',
    })
  },
  gocoupon(){
    const that=this
    wx.navigateTo({
      url: '../../pageA/pages/coupon/choiceCoupon?order_id=' + that.data.id,
    })
  }
})