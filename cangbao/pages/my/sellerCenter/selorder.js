// pages/my/sellerCenter/selorder.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const t = require('../../common/time.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    u: [], 
    u1: [], 
    mtype: '0',
    page: '2',
    mtype1: '0',
    nav: [{ type: '0', name: '全部' }, { type: '1', name: '待付款' }, { type: '2', name: '待发货' }, { type: '3', name: '待收货' }, { type: '4', name: '已完成' }, { type: '5', name: '售后' }],
    nav1: [{ type: '0', name: '待处理' }, { type: '1', name: '进行中' }, { type: '2', name: '已完成' }],
    scrollleft: '',// 滚动距离
    v: 'block',// 一级页面显示隐藏
    v1: 'none',// 二级页面显示隐藏
    time2: null,// 待 付款 倒计时
    time3: null,// 待 发货 倒计时
    time3: null,// 待 收货 倒计时
    clock1: [], // 待 付款 倒计时
    clock2: [], // 待 发货 倒计时
    clock3: [], // 待 收货 倒计时
    clock: [],  // 完成时间
    navH: '',
    navHs: '',
    headtitle: '卖家订单',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight+43,
    })
    if(options!==undefined){
      that.setData({
        mtype: options.type
      })
      if (options.type=='5'){
        that.setData({
          scrollleft: '700px'
        })
      }
    }
    that.switchs()
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
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 点击事件
  switchs(e){
    var that = this
    that.setData({
      page:2
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if (e !== undefined) {
      that.setData({
        mtype: e.currentTarget.dataset.type
      })
    }
    if (that.data.mtype == 0) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      that.wait()
    }
    if (that.data.mtype==1){
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      that.wait1()
    }
    if (that.data.mtype == 2) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      that.setData({
        scrollleft: ''
      })
      that.wait2()
    }
    if (that.data.mtype == 3) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      that.wait3()
    }
    if (that.data.mtype == 4) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      that.setData({
        scrollleft:'700px'
      })
      that.wait4()
    }
    if (that.data.mtype == 5) {
      that.aftersale()
    }else{
      that.setData({
        v: 'block',
        v1: 'none'
      })
    }
    
  },
  switchs1(e) {
    var that = this
    that.setData({
      page:'2'
    })
    if (e !== undefined) {
      that.setData({
        mtype1: e.currentTarget.dataset.type
      })
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.aftersale()
  },
  // 全部
  wait() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.sel_order_list + 'all/1',
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
            if (d.statusCode == 204) {
              that.setData({
                u: ''
              })
            } 
            if (d.statusCode == 200) {
              that.setData({
                u: d.data.data
              })
              // 完成时间
              const storage1 = [];
              const length1 = that.data.u.length;
              for (let i = 0; i < length1; i++) {
                storage1.push({
                  id: i,
                  text: t.formatDateTime(that.data.u[i].completion_time * 1000)
                })
              }
              that.setData({
                clock: storage1,
              })
              // 待付款
              that.setData({
                time2: setInterval(function () {
                  const storage = [];
                  const length = that.data.u.length;
                  for (let i = 0; i < length; i++) {
                    storage.push({
                      id: i,
                      text: t.countdown(that.data.u[i].end_pay_time)
                    })
                  }
                  that.setData({
                    clock1: storage,
                  })

                }, 1000)
              })
              // 待发货
              that.setData({
                time3: setInterval(function () {
                  const storage2 = [];
                  const length = that.data.u.length;
                  for (let i = 0; i < length; i++) {
                    storage2.push({
                      id: i,
                      text: t.countdown(that.data.u[i].end_send_time)
                    })
                  }
                  that.setData({
                    clock2: storage2,
                  })

                }, 1000)
              })
              // 待收货
              that.setData({
                time4: setInterval(function () {
                  const storage3 = [];
                  const length = that.data.u.length;
                  for (let i = 0; i < length; i++) {
                    storage3.push({
                      id: i,
                      text: t.countdown(that.data.u[i].auto_delivery_time)
                    })
                  }
                  that.setData({
                    clock3: storage3,
                  })

                }, 1000)
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 待付款
  wait1(){
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.sel_order_list + 'pay/1',
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
            
            if (d.statusCode==204){
              that.setData({
                u:''
              })
            } 
            if (d.statusCode == 200){
              that.setData({
                u: d.data.data
              })
              that.setData({
                time2: setInterval(function () {
                  const storage = [];
                  const length = that.data.u.length;
                  for (let i = 0; i < length; i++) {
                    storage.push({
                      id: i,
                      text: t.countdown(that.data.u[i].end_pay_time)
                    })
                  }
                  that.setData({
                    clock1: storage,
                  })

                }, 1000)
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 待发货
  wait2() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.sel_order_list + 'send/1',
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
            
            if (d.statusCode == 204) {
              that.setData({
                u: ''
              })
            } 
            if (d.statusCode == 200) {
              that.setData({
                u: d.data.data
              })
              that.setData({
                time3: setInterval(function () {
                  const storage = [];
                  const length = that.data.u.length;
                  for (let i = 0; i < length; i++) {
                    storage.push({
                      id: i,
                      text: t.countdown(that.data.u[i].end_send_time)
                    })
                  }
                  that.setData({
                    clock2: storage,
                  })

                }, 1000)
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 待收货
  wait3() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.sel_order_list + 'receive/1',
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
           
            if (d.statusCode == 204) {
              that.setData({
                u: ''
              })
            } 
            if (d.statusCode == 200){
              that.setData({
                u: d.data.data
              })
              that.setData({
                time4: setInterval(function () {
                  const storage = [];
                  const length = that.data.u.length;
                  for (let i = 0; i < length; i++) {
                    storage.push({
                      id: i,
                      text: t.countdown(that.data.u[i].auto_delivery_time)
                    })
                  }
                  that.setData({
                    clock3: storage,
                  })

                }, 1000)
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 已完成
  wait4() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.sel_order_list + 'complete/1',
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
            
            if (d.statusCode == 204) {
              that.setData({
                u: ''
              })
            } 
            if (d.statusCode == 200)  {
              that.setData({
                u: d.data.data
              })
              const storage1 = [];
              const length1 = that.data.u.length;
              for (let i = 0; i < length1; i++) {
                storage1.push({
                  id: i,
                  text: t.formatDateTime(that.data.u[i].completion_time * 1000)
                })

              }
              that.setData({
                clock: storage1,
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 滚动
  scroll(e){
    
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    //下拉
    var that = this
    that.setData({
      page: 2
    })
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      mask: true
    })
    that.switchs()
    wx.stopPullDownRefresh()
  },
  // 上拉加载
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (that.data.mtype == 0) {
      wx.getStorage({
        key: 'token',
        success(res) {
          wx.request({
            url: app.api.sel_order_list + 'all/' + that.data.page,
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
              // 隐藏加载框  
              wx.hideLoading();
              if (d.statusCode == 204) {
                wx.showToast({
                  title: '没有更多',
                  icon: 'none'
                })
              } 
              if (d.statusCode == 200) {
                var moment_list = that.data.u;
                for (var i = 0; i < d.data.data.length; i++) {
                  moment_list.push(d.data.data[i]);
                }
                // 设置数据  
                that.setData({
                  u: that.data.u,
                  page: Number(that.data.page) + 1
                })
                
                // 完成时间
                const storage1 = [];
                const length1 = that.data.u.length;
                for (let i = 0; i < length1; i++) {
                  storage1.push({
                    id: i,
                    text: t.formatDateTime(that.data.u[i].completion_time * 1000)
                  })
                }
                that.setData({
                  clock: storage1,
                })
                // 待付款
                that.setData({
                  time2: setInterval(function () {
                    const storage = [];
                    const length = that.data.u.length;
                    for (let i = 0; i < length; i++) {
                      storage.push({
                        id: i,
                        text: t.countdown(that.data.u[i].end_pay_time)
                      })
                    }
                    that.setData({
                      clock1: storage,
                    })

                  }, 1000)
                })
                // 待发货
                that.setData({
                  time3: setInterval(function () {
                    const storage2 = [];
                    const length = that.data.u.length;
                    for (let i = 0; i < length; i++) {
                      storage2.push({
                        id: i,
                        text: t.countdown(that.data.u[i].end_send_time)
                      })
                    }
                    that.setData({
                      clock2: storage2,
                    })

                  }, 1000)
                })
                // 待收货
                that.setData({
                  time4: setInterval(function () {
                    const storage3 = [];
                    const length = that.data.u.length;
                    for (let i = 0; i < length; i++) {
                      storage3.push({
                        id: i,
                        text: t.countdown(that.data.u[i].auto_delivery_time)
                      })
                    }
                    that.setData({
                      clock3: storage3,
                    })

                  }, 1000)
                })
              }
            }
          })
        }
      })
    }
    if (that.data.mtype == 1) {
      wx.getStorage({
        key: 'token',
        success(res) {
          wx.request({
            url: app.api.sel_order_list + 'pay/' + that.data.page,
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
              // 隐藏加载框  
              wx.hideLoading();
              
              if (d.statusCode == 204) {
                wx.showToast({
                  title: '没有更多',
                  icon: 'none'
                })
              } 
              if (d.statusCode == 200) {
                var moment_list = that.data.u;
                for (var i = 0; i < d.data.data.length; i++) {
                  moment_list.push(d.data.data[i]);
                }
                // 设置数据  
                that.setData({
                  u: that.data.u,
                  page: Number(that.data.page) + 1
                })
                that.setData({
                  time2: setInterval(function () {
                    const storage = [];
                    const length = that.data.u.length;
                    for (let i = 0; i < length; i++) {
                      storage.push({
                        id: i,
                        text: t.countdown(that.data.u[i].end_pay_time)
                      })
                    }
                    that.setData({
                      clock1: storage,
                    })

                  }, 1000)
                })
              }

            }
          })
        }
      })
    }
    if (that.data.mtype == 2) { 
      wx.getStorage({
        key: 'token',
        success(res) {
          wx.request({
            url: app.api.sel_order_list + 'send/' + that.data.page,
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
              // 隐藏加载框  
              wx.hideLoading();
              if (d.statusCode == 204) {
                wx.showToast({
                  title: '没有更多',
                  icon: 'none'
                })
              } 
              if (d.statusCode == 200) {
                var moment_list = that.data.u;

                for (var i = 0; i < d.data.data.length; i++) {
                  moment_list.push(d.data.data[i]);
                }
                // 设置数据  
                that.setData({
                  u: that.data.u,
                  page: Number(that.data.page) + 1
                })
                that.setData({
                  time3: setInterval(function () {
                    const storage = [];
                    const length = that.data.u.length;
                    for (let i = 0; i < length; i++) {
                      storage.push({
                        id: i,
                        text: t.countdown(that.data.u[i].end_send_time)
                      })
                    }
                    that.setData({
                      clock2: storage,
                    })

                  }, 1000)
                })
              }

            }
          })
        }
      })
    }
    if (that.data.mtype == 3) {
      wx.getStorage({
        key: 'token',
        success(res) {
          wx.request({
            url: app.api.sel_order_list + 'receive/' + that.data.page,
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
              // 隐藏加载框  
              wx.hideLoading();
              console.log(d.data)
              if (d.statusCode == 204) {
                wx.showToast({
                  title: '没有更多',
                  icon: 'none'
                })
              } 
              if (d.statusCode == 200) {
                var moment_list = that.data.u;

                for (var i = 0; i < d.data.data.length; i++) {
                  moment_list.push(d.data.data[i]);
                }
                // 设置数据  
                that.setData({
                  u: that.data.u,
                  page: Number(that.data.page) + 1
                })

                that.setData({
                  time4: setInterval(function () {
                    const storage = [];
                    const length = that.data.u.length;
                    for (let i = 0; i < length; i++) {
                      storage.push({
                        id: i,
                        text: t.countdown(that.data.u[i].auto_delivery_time)
                      })
                    }
                    that.setData({
                      clock3: storage,
                    })

                  }, 1000)
                })
              }

            }
          })
        }
      })
    }
    if (that.data.mtype == 4) {
      wx.getStorage({
        key: 'token',
        success(res) {
          wx.request({
            url: app.api.sel_order_list + 'complete/' + that.data.page,
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
              // 隐藏加载框  
              wx.hideLoading();
             
              if (d.statusCode == 204) {
                wx.showToast({
                  title: '没有更多',
                  icon: 'none'
                })
              } 
              if (d.statusCode == 200) {
                var moment_list = that.data.u;
                for (var i = 0; i < d.data.data.length; i++) {
                  moment_list.push(d.data.data[i]);
                }
                // 设置数据  
                that.setData({
                  u: that.data.u,
                  page: Number(that.data.page) + 1
                })
                const storage1 = [];
                const length1 = that.data.u.length;
                for (let i = 0; i < length1; i++) {
                  storage1.push({
                    id: i,
                    text: t.formatDateTime(that.data.u[i].completion_time * 1000)
                  })

                }
                that.setData({
                  clock: storage1,
                })
              }

            }
          })
        }
      })
    }
    if (that.data.mtype == 5){
      wx.getStorage({
        key: 'token',
        success(res) {
          if (that.data.mtype1 == '0') {
            wx.request({
              url: app.api.sel_order_list + 'return_wait/' + that.data.page,
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
                // 隐藏加载框  
                wx.hideLoading();
                if (d.statusCode == 204) {
                  wx.showToast({
                    title: '没有更多',
                    icon: 'none'
                  })
                } 
                if (d.statusCode == 200) {
                  var moment_list = that.data.u1;
                  for (var i = 0; i < d.data.data.length; i++) {
                    moment_list.push(d.data.data[i]);
                  }
                  // 设置数据  
                  that.setData({
                    u1: that.data.u1,
                    page: Number(that.data.page) + 1
                  })
                }
              }
            })
          }
          if (that.data.mtype1 == '1') {
            wx.request({
              url: app.api.sel_order_list + 'return_doing/' + that.data.page,
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
                wx.hideLoading();
                if (d.statusCode == 204) {
                  wx.showToast({
                    title: '没有更多',
                    icon: 'none'
                  })
                } 
                if (d.statusCode == 200)  {
                  var moment_list = that.data.u1;
                  for (var i = 0; i < d.data.data.length; i++) {
                    moment_list.push(d.data.data[i]);
                  }
                  that.setData({
                    u1: that.data.u1,
                    page: Number(that.data.page) + 1
                  })
                }
              }
            })
          }
          if (that.data.mtype1 == '2') {
            wx.request({
              url: app.api.sel_order_list + 'return_complete/' + that.data.page,
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
                // 隐藏加载框  
                wx.hideLoading();
                if (d.statusCode == 204) {
                  wx.showToast({
                    title: '没有更多',
                    icon: 'none'
                  })
                } 
                if (d.statusCode == 200) {
                  var moment_list = that.data.u1;
                  for (var i = 0; i < d.data.data.length; i++) {
                    moment_list.push(d.data.data[i]);
                  } 
                  that.setData({
                    u1: that.data.u1,
                    page: Number(that.data.page) + 1
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  gogoodsdet(e){
    wx.navigateTo({
      url: '../../person/person?id=' + e.currentTarget.dataset.id,
    })
  },
  // 拍品详情
  godetail(e){
    wx.navigateTo({
      url: '../sellerCenter/sellerorders?id=' + e.currentTarget.dataset.id,
    })
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
  down(e){
    wx.navigateTo({
      url: '../returnreturns?id=' + e.currentTarget.dataset.id+'&types=2',
    })
  },
  // 售后数据请求（刷新）
  aftersale(){
    let that=this
    wx.getStorage({
      key: 'token',
      success(res) {
        if (that.data.mtype1 == '0') {
          wx.request({
            url: app.api.sel_order_list + 'return_wait/1',
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
              if (d.statusCode == 204) {
                that.setData({
                  u1: ''
                })
              } 
              if (d.statusCode == 200) {
                that.setData({
                  u1: d.data.data
                })
              }
              wx.hideLoading()
            }
          })
        }
        if (that.data.mtype1 == '1') {
          wx.request({
            url: app.api.sel_order_list + 'return_doing/1',
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
              if (d.statusCode == 204) {
                that.setData({
                  u1: ''
                })
              } 
              if (d.statusCode == 200)  {
                that.setData({
                  u1: d.data.data
                })
              }
              wx.hideLoading()
            }
          })
        }
        if (that.data.mtype1 == '2') {
          wx.request({
            url: app.api.sel_order_list + 'return_complete/1',
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
              if (d.statusCode == 204) {
                that.setData({
                  u1: ''
                })
              }
              if (d.statusCode == 200) {
                that.setData({
                  u1: d.data.data
                })
              }
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  lx(){
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
  }
  
})