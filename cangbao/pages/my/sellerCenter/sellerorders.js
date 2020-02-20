// pages/my/sellerCenter/sellerorders.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    headtitle: '订单详情',
    selldet:[],
    wldetails:[],
    clock: '',
    clock1: '',
    clock2: '',
    endDate:'',
    paytime:'',
    sendtime:'',
    comtime:'',
    time1:[],
    sel_t1: '',
    sel_t2: '',
    sel_t3:'',
    intervarID:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight
    })
    if (options !== undefined){
      that.setData({
        orderid: options.id,
      })
    }
    // 拍品详情
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.order_sel_details+that.data.orderid,
          data: {},
          method: 'get',
          header: {
            "Authorization": 'bearer ' + res.data,
            "content-type": "application/json",
            "cache-control": "no-cache, private",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success: function (d) {
            if (d.statusCode == 200) {
              that.setData({
                selldet: d.data.data,
                endDate: t.formatDateTime(d.data.data.create_time * 1000),      //中拍时间
                paytime: t.formatDateTime(d.data.data.pay_time * 1000),         //付款时间          
                sendtime: t.formatDateTime(d.data.data.send_time * 1000),       //发货时间
                comtime: t.formatDateTime(d.data.data.completion_time * 1000),  //完成时间

              })
              clearInterval(that.data.intervarID);
              that.data.intervarID = setInterval(function () {
                that.setData({
                  clock1: t.countdown(d.data.data.end_send_time),//未发货剩余秒数
                  clock: t.countdown(d.data.data.end_pay_time),//待付款剩余秒数
                  clock2: t.countdown(d.data.data.auto_delivery_time),//待收货剩余秒数
                })
              }, 1000)
              that.settime1()
            }
            if (d.statusCode == 401) {
              relanding.relanding()
              setTimeout(function () {
                that.onLoad()
              }, 500)
            }
          }
        })

        // 物流信息
        wx.request({
          url: app.api.logdetils + that.data.orderid,
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (res1) {
            if (res1.statusCode == 422) {
              that.setData({
                wldetails: null
              })
            } 
            if (res1.statusCode == 200) {
              that.setData({
                wldetails: res1.data.data[0]
              })
            }
          }
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ED624B',
    })
    wx.setNavigationBarTitle({
      title: '订单详情',
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
    const that=this
    clearInterval(that.data.intervarID);
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
  },

  goperson(){
    var that = this
    wx.navigateTo({
      url: '../../person/person?id=' + that.data.selldet.user.user_id,
    })
  },
  govideo(){
    var that = this
    if (that.data.selldet.type==1){
      wx.navigateTo({
        url: '../../videos/videos?id=' + that.data.selldet.goods.goods_id,
      })
    }else{
      wx.navigateTo({
        url: '../../videos/commoditydetails?id=' + that.data.selldet.goods.goods_id,
      })
    }
    
  },
  // 复制地址
  copy1() {
    var that = this
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: that.data.selldet.pca_text+ that.data.selldet.address ,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  },
  // 复制订单
  copy2() {
    var that = this
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: that.data.selldet.order_no,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  },
  // 查看物流
  gowuliu(e){
    var that = this
    wx.navigateTo({
      url: '../../orderdetails/logistics?id=' + that.data.selldet.order_id + '&type=2&types=' + e.currentTarget.dataset.types,
    })
  },
  // 退货流程时间
  settime1() {
    var that = this
    if (that.data.selldet.process !== null) {
      const storage1 = [];
      const length4 = that.data.selldet.process.length;
      for (let i = 0; i < length4; i++) {
        storage1.push({
          id: i,
          text: t.formatDateTime(that.data.selldet.process[i].time * 1000),
        })
      }
      that.setData({
        time1: storage1,
      })
      clearInterval(that.data.intervarID);
      that.data.intervarID = setInterval(function () {
        that.setData({
          sel_t1: t.countdown(that.data.selldet.return_info.end_buyer_send_time),
          sel_t2: t.countdown(that.data.selldet.return_info.end_seller_accept_time),
          sel_t3: t.countdown(that.data.selldet.return_info.end_seller_agree_time),
        })
      }, 1000) 
    }
  },
  down(e) {
    wx.navigateTo({
      url: '../returnreturns?id=' + e.currentTarget.dataset.id + '&types=2',
    })
  },
  lx() {
    wx.showModal({
      title: '藏宝',
      content: '暂未开放此功能,是否下载APP',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../download/download',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  // 同意申请
  agree(){
    let that=this
    wx.showModal({
      content: '确认同意申请吗?',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success(res) {
              wx.request({
                url: app.api.agree_return,
                data: {
                  order_id: that.data.selldet.order_id
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
                    wx.showToast({
                      title: a.data.message,
                      icon: 'none',
                      duration: 2000
                    })
                    that.onLoad()
                  }
                  if (a.statusCode == 422) {
                    wx.showToast({
                      title: a.data.message,
                      icon: 'none'
                    })
                  }
                  if (a.statusCode == 401) {
                    relanding.relanding()

                    setTimeout(function () {
                      that.agree()
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
  refuse(){
    let that=this
    wx.navigateTo({
      url: '../../../pageA/pages/refusereturn/refusereturn?id=' + that.data.selldet.order_id,
    })
  },
  confirmreceiving(){
    let that=this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.confirmreceiving,
          data: {
            order_id: that.data.selldet.order_id
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
              wx.showToast({
                title: a.data.message,
                icon: 'none',
                duration: 2000
              })
              that.onLoad()
            }
            if (a.statusCode == 422) {
              wx.showToast({
                title: a.data.message,
                icon: 'none'
              })
            }
            if (a.statusCode == 401) {
              relanding.relanding()
              setTimeout(function () {
                that.agree()
              }, 1000)
            }
          }
        })
      }
    })
  }
})