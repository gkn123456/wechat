// pages/my/allorders.js
const app = getApp()
const relanding = require('../common/relanding.js')
const t = require('../common/time.js')
const form = require('../common/formid.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    nav: [{ current: '0', type: 'all', name: '全部' }, { current: '1', type: 'pay', name: '待付款' }, { current: '2', type: 'send', name: '待发货' }, { current: '3', type: 'receive', name: '待收货' }, { current: '4', type: 'comment', name: '待评价' }, { current: '5', type: 'cc', name: '售后' }],
    nav1: [{ type: '0', name: '待处理' }, { type: '1', name: '进行中' }, { type: '2', name: '已完成' }],
    currentData: 0,
    paydetalis:[],
    clock: [],   // 待付款时间
    disclock:[],
    clock1: [],  // 待发货时间
    clock2: [],  // 待收货时间
    clock3: [],  // 订单完成时间
    currentname:'',
    displays:'block',
    displays1:'none',
    length:'',
    time1:'',
    time2: '',
    time3: '',
    time4: '',
    scrollleft:'0',
    allpaydetalis:[],
    all1paydetalis: [],
    all2paydetalis: [],
    all3paydetalis: [],
    all4paydetalis: [],
    page: 2,
    remindorder_id: '',// 提醒发货id
    refundorder_id: '',// 退款id
    confirmreceiptid: '',// 确认收货id
    detelordid: '',// 删除订单id
    mtype1:'0',
    // 售后
    sh:[],
    i:"none",
    paytype: '',// 支付方式选择
    paymode: [],  // 支付方式信息
    sty1:'display:none;',
    price: '',// 支付金额
    orderids: '',// 订单号
    code:'',
    navHs: '',
    navH: '',
    headtitle: '买家订单',
    all_pmb_price:'',
    pmb_price:'',
    quota:0,
    isrecharge: 0
  },
  // 提交form id
  formSubmit: function (e) {
    //获取formId
    form.form(e.detail.formId)
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight+44,
    })
    if (options == undefined) {
      wx.request({
        url: app.api.order_list + that.data.currentname + '/1',
        data: {},
        method: 'get',
        header:t.logintype(),
        success: function (a) {
          if (a.statusCode == 204) {
            that.setData({
              length: 0,
              paydetalis: null,
            })
            if (that.data.currentname == 'comment'){
              that.setData({
                scrollleft:'700px'
              })
            }
          } 
          if (a.statusCode == 200){
            that.setData({
              length: a.data.data.length,
              paydetalis: a.data.data,
            })
            let all_pmb_price = []
            let pmb_price = []
            for (let i = 0; i < a.data.data.length; i++) {
              all_pmb_price.push({
                n: t.toFixed(2, a.data.data[i].order_foreign_amount * a.data.data[i].goods.currency_rate)
              })
              pmb_price.push({
                n: t.toFixed(2, a.data.data[i].goods.deal_price * (a.data.data[i].order_amount / a.data.data[i].order_foreign_amount))
              })
            }
            that.setData({
              all_pmb_price: all_pmb_price,
              pmb_price: pmb_price
            })
            if (that.data.currentname =='all'){
              that.settime()
              that.settime1()
              that.settime2()
              that.settime3()
            }
            if (that.data.currentname == 'pay') {
              clearInterval(that.data.time2);
              clearInterval(that.data.time3);
              that.settime()
            }
            if (that.data.currentname == 'send') {
              that.settime1()
            }
            if (that.data.currentname == 'receive') {
              that.settime2()
              clearInterval(that.data.time1);
              clearInterval(that.data.time2);
            }
            if (that.data.currentname == 'comment') {
              that.setData({
                scrollleft: '700px'
              })
              that.settime3()
              clearInterval(that.data.time1);
              clearInterval(that.data.time2);
              clearInterval(that.data.time3);
            }
            if (that.data.currentname == 'cc'){
              that.switchs1()
            }
          }
        }
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
    } else {
      that.setData({
        currentData: options.id,
        currentname: options.type
      })
          if (options.id!=='5'){
            wx.request({
              url: app.api.order_list + that.data.currentname + '/1',
              data: {},
              method: 'get',
              header: t.logintype(),
              success: function (a) {
                if (a.statusCode == 204) {
                  that.setData({
                    length: 0,
                    paydetalis: null,
                    displays: "none",
                    displays1: "block",
                  })
                  if (that.data.currentname == 'comment') {
                    that.setData({
                      scrollleft: '700px'
                    })
                  }
                } 
                if (a.statusCode == 200) {
                  that.setData({
                    length: a.data.data.length,
                    paydetalis: a.data.data
                  })
                  let all_pmb_price = []
                  let pmb_price = []
                  for (let i = 0; i < a.data.data.length; i++) {
                    all_pmb_price.push({
                      n: t.toFixed(2, a.data.data[i].order_foreign_amount * a.data.data[i].goods.currency_rate)
                    })
                    pmb_price.push({
                      n: t.toFixed(2, a.data.data[i].goods.deal_price * (a.data.data[i].order_amount / a.data.data[i].order_foreign_amount))
                    })
                  }
                  that.setData({
                    all_pmb_price: all_pmb_price,
                    pmb_price: pmb_price
                  })
                  if (that.data.currentname == 'all') {
                    that.settime()
                    that.settime1()
                    that.settime2()
                    that.settime3()
                  }
                  if (that.data.currentname == 'pay') {
                    that.settime()
                    clearInterval(that.data.time2);
                    clearInterval(that.data.time3);
                  }
                  if (that.data.currentname == 'send') {
                    that.settime1()
                    clearInterval(that.data.time1);
                    clearInterval(that.data.time3);
                  }
                  if (that.data.currentname == 'receive') {
                    that.settime2()
                    clearInterval(that.data.time1);
                    clearInterval(that.data.time2);
                  }
                  if (that.data.currentname == 'comment') {
                    that.setData({
                      scrollleft: '700px'
                    })
                    that.settime3()
                    clearInterval(that.data.time1);
                    clearInterval(that.data.time2);
                    clearInterval(that.data.time3);
                  }
                }
              }
            })
          }else{
            that.switchs1()
          }
          wx.request({
            url: app.api.pay_type + '1',
            data: {},
            method: 'get',
            header:t.logintype(),
            success: function (c) {
              that.setData({
                paymode: c.data.data,
                paytype: c.data.data[1].pay_mark
              })
            }
          })
    }
  },
// 待付款倒计时
settime(){
  const that=this
  if (that.data.paydetalis!==null) {
      that.data.time1=setInterval(function () {
        const storage = [];
        const storage1 = [];
        const length1 = that.data.length;
        for (let i = 0; i < length1; i++) {
          storage.push({
            id: i,
            text: t.countdown(that.data.paydetalis[i].end_pay_time)
          })
        }
        // 运费倒计时
        for (let i = 0; i < length1; i++) {
          var price = that.data.paydetalis[i].order_note == null ? 0 : that.data.paydetalis[i].order_note.pay_end_time
          storage1.push({
            id: i,
            text: t.countdown(price)
          })
        }
        that.setData({
          clock: storage,
          disclock: storage1
        })
      }, 1000)
  }else {}
},
  // 待发货倒计时
  settime1(){
    var that = this
      if (that.data.paydetalis!==null) {
          that.data.time2=setInterval(function () {
            const storage = [];
            const length2 = that.data.length;
            for (let i = 0; i < length2; i++) {
              storage.push({
                id: i,
                text: t.countdown(that.data.paydetalis[i].end_send_time)
              })
            }
            that.setData({
              clock1: storage,
            })
            
          }, 1000)
      } else {}
  },
  // 待收货倒计时
  settime2() {
    var that = this
      if (that.data.paydetalis !== null) {
          that.data.time3=setInterval(function () {
            const storage = [];
            const length3 = that.data.length;
            for (let i = 0; i < length3; i++) {
              storage.push({
                id: i,
                text: t.countdown(that.data.paydetalis[i].auto_delivery_time)
              })
            }
            that.setData({
              clock2: storage,
            })
            
          }, 1000)
      } else {}
  },
  settime3() {
    var that=this
    if (that.data.paydetalis !== null) {
      const storage1 = [];
      const length4 = that.data.length;
      for (let i = 0; i < length4; i++) {
        storage1.push({
          id: i,
          text: t.formatDateTime(that.data.paydetalis[i].completion_time * 1000)
        })
      }
      that.setData({
        clock3: storage1,
      })
    }
   },
  //当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current,
    })
  },
  //点击滑块赋值
  checkCurrent: function (e) {
    var that = this;
    that.setData({
      displays: "none",
      displays1: "none",
      paydetalis: null,
      length: 0,
      page:'2'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if (e!==undefined){
      that.setData({
        currentData: e.target.dataset.current,
        currentname: e.currentTarget.dataset.type
      },()=>{
        wx.request({
          url: app.api.order_list + that.data.currentname + '/1',
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (a) {
            if (a.statusCode == 204) {
              that.setData({
                displays: "none",
                displays1: "block",
                length: 0,
                paydetalis: null
              })
              if (that.data.currentname == 'pay') {
                that.setData({
                  scrollleft: '0px'
                })
              }
              if (that.data.currentname == 'cc') {
                that.switchs1()
                that.setData({
                  paydetalis: null
                })
                clearInterval(that.data.time);
                clearInterval(that.data.time1);
                clearInterval(that.data.time2);
                clearInterval(that.data.time3);
              }
              if (that.data.currentname == 'comment') {
                that.setData({
                  scrollleft: '700px'
                })
              }
            }
            if (a.statusCode == 200) {
              that.setData({
                displays: "block",
                displays1: "none",
                paydetalis: a.data.data,
                length: a.data.data.length,
              })
              let all_pmb_price = []
              let pmb_price = []

              for (let i = 0; i < a.data.data.length; i++) {
                all_pmb_price.push({
                  n: t.toFixed(2, a.data.data[i].order_foreign_amount * a.data.data[i].goods.currency_rate)
                })
                pmb_price.push({
                  n: t.toFixed(2, a.data.data[i].goods.deal_price * (a.data.data[i].order_amount / a.data.data[i].order_foreign_amount))
                })
              }
              that.setData({
                all_pmb_price: all_pmb_price,
                pmb_price: pmb_price
              })
              if (that.data.currentname == 'all') {
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  duration: 1500
                })
                that.settime()
                that.settime1()
                that.settime2()
                that.settime3()
              }
              if (that.data.currentname == 'pay') {
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  duration: 1500
                })
                that.setData({
                  scrollleft: '0px'
                })
                that.settime()
                clearInterval(that.data.time2);
                clearInterval(that.data.time3);
              }
              if (that.data.currentname == 'send') {
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  duration: 1500
                })
                that.settime1()
                clearInterval(that.data.time1);
                clearInterval(that.data.time3);
              }
              if (that.data.currentname == 'receive') {
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  duration: 1500
                })
                that.settime2()
                clearInterval(that.data.time1);
                clearInterval(that.data.time2);
              }
              if (that.data.currentname == 'comment') {
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  duration: 1500
                })
                that.settime3()
                that.setData({
                  scrollleft: '700px'
                })
                clearInterval(that.data.time1);
                clearInterval(that.data.time2);
                clearInterval(that.data.time3);
              }
            }
          }
        })
      })
    }
  },
  // 提醒发货
  remind(e) {
    var that = this
    if(e!==undefined){
      that.setData({
        remindorder_id: e.currentTarget.dataset.id
      })
    }
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.order_remind,
          data: {
            order_id: that.data.remindorder_id
          },
          method: 'post',
          header: {
            "Authorization": 'bearer' + res.data,
            "content-type": "application/json",
            "cache-control": "no-cache, private",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success: function (a) {
            if (a.statusCode == 200) {
              t.alert(a.data.message)
              that.onLoad()
            } 
            if (a.statusCode == 422) {
              t.alert(a.data.message)
            }
            if (a.statusCode == 401){
              relanding.relanding()
              setTimeout(function () {
                that.remind()
              }, 1000)
            }
          }
        })
      }
    })
  },
  // 退款
  refund(e) {
    var that = this
    if(e!==undefined){
      that.setData({
        refundorder_id: e.currentTarget.dataset.id
      })
    }
    wx.showModal({
      content: '确认退款吗?',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success(res) {
              wx.request({
                url: app.api.order_refund,
                data: {
                  order_id: that.data.refundorder_id
                },
                method: 'post',
                header: {
                  "Authorization": 'bearer' + res.data,
                  "content-type": "application/json",
                  "cache-control": "no-cache, private",
                  "x-os": "wechat_mini",
                  "x-app-version": app.api.edition
                },
                success: function (a) {
                  if (a.statusCode == 200) {
                    t.alert(a.data.message)
                    that.onLoad()
                  } 
                  if (a.statusCode == 422){
                    t.alert(a.data.message)
                  }
                  if (a.statusCode == 401) {
                    relanding.relanding()
                    setTimeout(function () {
                      that.refund()
                    }, 1000)
                  }
                }
              })
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  // 删除订单
  detelord(e) {
    var that = this
    if(e!==undefined){
      that.setData({
        detelordid: e.currentTarget.dataset.id
      })
    }
    wx.showModal({
      content: '确认删除订单?',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success(res) {
              wx.request({
                url: app.api.order_delete,
                data: {
                  order_id: that.data.detelordid
                },
                method: 'delete',
                header: {
                  "Authorization": 'bearer' + res.data,
                  "content-type": "application/json",
                  "cache-control": "no-cache, private",
                  "x-os": "wechat_mini",
                  "x-app-version": app.api.edition
                },
                success: function (a) {
                  if (a.statusCode == 200) {
                    t.alert(a.data.message)
                    that.onLoad()
                  } 
                  if (a.statusCode == 422) {
                    t.alert(a.data.message)
                  }
                  if (a.statusCode == 401) {
                    relanding.relanding()
                    setTimeout(function () {
                      that.detelord()
                    }, 1000)
                  }
                }
              })
            }
          })
        }else if (res.cancel) {}
      }
    })
  },
  // 确认收货
  confirmreceipt(e) {
    var that = this
    if(e!==undefined){
      that.setData({
        confirmreceiptid: e.currentTarget.dataset.id
      })
    }
    wx.showModal({
      content: '确认收货后货款将打入卖家账户,是否确认收到?',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success(res) {
              wx.request({
                url: app.api.order_confirm,
                data: {
                  order_id: that.data.confirmreceiptid
                },
                method: 'post',
                header: {
                  "Authorization": 'bearer' + res.data,
                  "content-type": "application/json",
                  "cache-control": "no-cache, private",
                  "x-os": "wechat_mini",
                  "x-app-version": app.api.edition
                },
                success: function (a) {
                  if (a.statusCode == 200) {
                    t.alert(a.data.message)
                    that.onLoad()
                  }
                  if (a.statusCode == 422) {
                    t.alert(a.data.message)
                  }
                  if (a.statusCode == 422) {
                    relanding.relanding()
                    setTimeout(function () {
                      that.confirmreceipt()
                    }, 1000)
                  }
                }
              })
            }
          })
        } else if (res.cancel) {
        }
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
  onShow: function (options) {
    const that=this
    setTimeout(function(){
      that.isfs()
    },300)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    var that=this
    clearInterval(that.data.time1);
    clearInterval(that.data.time2);
    clearInterval(that.data.time3);
    clearInterval(that.data.time4);
  },
  // 事件处理函数
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      page:2
    })
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      success() {
            if (that.data.currentname == 'cc') {
              that.switchs1()
              clearInterval(that.data.time);
              clearInterval(that.data.time1);
              clearInterval(that.data.time2);
              clearInterval(that.data.time3);
            }else{
              wx.request({
                url: app.api.order_list + that.data.currentname + '/1',
                data: {},
                method: 'get',
                header: t.logintype(),
                success: function (a) {
                  if (a.statusCode == 204) {
                    that.setData({
                      length: 0,
                      paydetalis: null,
                    })
                  } 
                  if (a.statusCode == 200) {
                    that.setData({
                      length: a.data.data.length,
                      paydetalis: a.data.data,
                    })
                    if (that.data.currentname == 'all') {
                      that.settime()
                      that.settime1()
                      that.settime2()
                      that.settime3()
                    }
                    if (that.data.currentname == 'pay') {
                      that.settime()
                    }
                    if (that.data.currentname == 'send') {
                      that.settime1()
                    }
                    if (that.data.currentname == 'receive') {
                      that.settime2()
                    }
                    if (that.data.currentname == 'comment') {
                      that.settime3()
                    }
                  }
                }
              })
            }
        wx.stopPullDownRefresh()
      }
    })
  },
  onReachBottom: function () {
    var that = this
    var page = 0
    wx.showLoading({
      title: '加载中',
    })
    if (that.data.currentData == '5'){
          let u=''
          if (that.data.mtype1 == 0){
            u ='return_wait/'
          }
          if (that.data.mtype1 == 1) {
            u = 'return_doing/'
          }
          if (that.data.mtype1 == 2) {
            u = 'return_complete/'
          }
          wx.request({
            url: app.api.order_list + u + that.data.page,
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (a) {
              if (a.statusCode == 204) {
                t.alert('没有更多')
                wx.hideLoading()
              } 
              if (a.statusCode == 200){
                var sh = that.data.sh;
                for (var i = 0; i < a.data.data.length; i++) {
                  sh.push(a.data.data[i]);
                }
                that.setData({
                  length: that.data.sh.length,
                  sh: that.data.sh,
                  page: Number(that.data.page) + 1
                },()=>{
                  wx.hideLoading()
                })
              }
              
            }
          })
    }else{
          wx.request({
            url: app.api.order_list + that.data.currentname + '/' + that.data.page,
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (a) {
              if (a.statusCode == 204) {
                t.alert('没有更多')
              } if (a.statusCode == 200){
                var paydetalis = that.data.paydetalis;
                for (var i = 0; i < a.data.data.length; i++) {
                  paydetalis.push(a.data.data[i]);
                }
                that.setData({
                  length: that.data.paydetalis.length,
                  paydetalis: that.data.paydetalis,
                  page: Number(that.data.page) + 1
                })
                if (that.data.currentname == 'all') {
                  that.settime()
                  that.settime3()
                  that.settime1()
                  that.settime2()
                }
                if (that.data.currentname == 'pay') {
                  that.settime()
                }
                if (that.data.currentname == 'send') {
                  that.settime1()
                }
                if (that.data.currentname == 'receive') {
                  that.settime2()
                }
                if (that.data.currentname == 'comment') {
                  that.settime3()
                }
                wx.hideLoading();
              }
            }
          })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goparse(e){
    var that=this
    wx.navigateTo({
      url: '../person/person?id=' + e.currentTarget.dataset.id,
    })
  },
  // 评价按钮
  toevaluate(e){
    wx.navigateTo({
      url: '../orderdetails/evaluate?id=' + e.currentTarget.dataset.id,
    })
  },
  // 查看物流
  towuliu(e){
    wx.navigateTo({
      url: '../orderdetails/logistics?id=' + e.currentTarget.dataset.id + '&types=' + e.currentTarget.dataset.types+'&type=1',
    })
  },
  // 退货
  returngoods(e){
    wx.navigateTo({
      url: '../my/returngoods?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title + '&cover=' + e.currentTarget.dataset.cover + '&price=' + e.currentTarget.dataset.price + '&time=' + e.currentTarget.dataset.time + '&uname=' + e.currentTarget.dataset.uname + '&uimg=' + e.currentTarget.dataset.uimg + '&type=0',
    })
  },
  switchs1(e) {
    var that = this
    if (e !== undefined) {
      that.setData({
        mtype1: e.currentTarget.dataset.type
      })
      wx.showLoading({
        title: '加载中',
        mask: true,
        duration: 1500
      })
      if (that.data.mtype1==0){
            wx.request({
              url: app.api.order_list + 'return_wait/1',
              data: {},
              method: 'get',
              header: t.logintype(),
              success: function (a) {
                if (a.statusCode == 204) {
                  that.setData({
                    i: 'block',
                    sh: null
                  })
                } 
                if (a.statusCode == 200) {
                  that.setData({
                    i: 'none',
                    sh: a.data.data,
                    length: a.data.data.length,
                  })
                }
              }
            })
      }
      if (that.data.mtype1 == 1) {
            wx.request({
              url: app.api.order_list + 'return_doing/1',
              data: {},
              method: 'get',
              header: t.logintype(),
              success: function (a) {
                if (a.statusCode == 204) {
                  that.setData({
                    i: 'block',
                    sh: null
                  })
                } 
                if (a.statusCode == 200){
                  that.setData({
                    i: 'none',
                    sh: a.data.data,
                    length: a.data.data.length,
                  })
                }
              }
            })
      }
      if (that.data.mtype1 == 2) {
            wx.request({
              url: app.api.order_list + 'return_complete/1',
              data: {},
              method: 'get',
              header: t.logintype(),
              success: function (a) {
                if (a.statusCode == 204) {
                  that.setData({
                    i: 'block',
                    sh: null
                  })
                } 
                if (a.statusCode == 200) {
                  that.setData({
                    i: 'none',
                    sh: a.data.data,
                    length: a.data.data.length,
                  })
                }
              }
            })
      }
    }else{
      if (that.data.mtype1 == 0){
        wx.request({
          url: app.api.order_list + 'return_wait/1',
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (a) {
            if (a.statusCode == 204) {
              that.setData({
                i: 'block',
                sh: null
              })
            } 
            if (a.statusCode == 200) {
              that.setData({
                i: 'none',
                sh: a.data.data,
                length: a.data.data.length,
              })
            }
          }
        })
      }
      if (that.data.mtype1 == 1) {
        wx.request({
          url: app.api.order_list + 'return_doing/1',
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (a) {
            if (a.statusCode == 204) {
              that.setData({
                i: 'block',
                sh: null
              })
            } 
            if (a.statusCode == 200){
              that.setData({
                i: 'none',
                sh: a.data.data,
                length: a.data.data.length,
              })
            }
          }
        })
      }
      if (that.data.mtype1 == 2) {
        wx.request({
          url: app.api.order_list + 'return_complete/1',
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (a) {
            if (a.statusCode == 204){
              that.setData({
                i: 'block',
                sh: null
              })
            } 
            if (a.statusCode == 200) {
              that.setData({
                i: 'none',
                sh: a.data.data,
                length: a.data.data.length,
              })
            }
          }
        })
      }
    }
  },
  // 单选点击
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
  },
  open(e) {
    var that = this
    wx.request({
      url: app.api.pay_type + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (c) {
        that.setData({
          paymode: c.data.data,
        })
      }
    })
    that.setData({
      sty1: 'display:block;',
      price: e.currentTarget.dataset.price,
      orderids: e.currentTarget.dataset.id,
    },()=>{
      that.isfs()
    })
  },
  isfs(){
    const that=this
    wx.request({
      url: app.api.pay_type + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (c) {
        const balance = c.data.data[0].amount
        if (that.data.price !== '') {
          if (Number(that.data.price) <= Number(balance)) {
            that.setData({
              paytype: 'balance',
              isrecharge: 0
            })
          } else {
            that.setData({
              isrecharge: 1
            })
          }
        }
      }
    })
  },
  close() {
    var that = this
    that.setData({
      sty1: 'display:none;'
    })
  },
  ispay() {
    var that = this
    if (that.data.paytype == 'balance') {
      that.determinepay()
    } else {
      if (that.data.price > 50000) {
        that.setData({
          quota: 1
        })
      } else {
        that.determinepay()
      }
    }
  },
  //支付
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
            order_id: that.data.orderids,
            pay_type: that.data.paytype,
            wechat_code: res.code
          },
          method: 'post',
          header:t.logintype(),
          success: function (res) {
            if (res.statusCode==500){
              t.alert(res.data.message)
            }else{
              if (that.data.paytype == "balance") {
                if (res.data.status_code !== 200) {
                  t.alert(res.data.message)
                }
                else {
                  that.close()
                  wx.navigateTo({
                    url: '../paysuccess/paysuccess?id=' + that.data.orderids
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
                          url: '../paysuccess/paysuccess?id=' + that.data.orderids
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
  go_pays(e){
    wx.navigateTo({
      url: '../orderdetails/orderdetails?id=' + e.currentTarget.dataset.id,
    })
  },
  jumporder(e){
    const that=this
    wx.navigateTo({
      url: '../orderdetails/orderdetails?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转拍卖行
  go_ahouse(e) {
    var that = this
    wx.navigateTo({
      url: '../videos/auction_house?id=' + e.currentTarget.dataset.id,
    })
  },
  go_price_d(e){
    wx.navigateTo({
      url: '../orderdetails/orderdetails?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转支付限额说明
  goquota(){
    const that = this
    that.setData({
      sty1: 'display:none;'
    })
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.quota,
    })
  },
  // 关闭限额弹框
  closequota(e){
    const that=this
    const id = e.currentTarget.dataset.id
    that.setData({
      sty1: 'display:none;'
    })
    if(id==0){
      that.setData({
        quota: 0
      })
      that.determinepay()
    } if (id ==1){
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
    const that = this
    that.setData({
      sty1: 'display:none;'
    })
    wx.navigateTo({
      url: '../my/mywallet/rech?type=2',
    })
  }
})