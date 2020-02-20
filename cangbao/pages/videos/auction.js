// pages/videos/auction.js
const app = getApp()
const t = require('../common/time.js')
const login = require('../common/login.js')
const relanding = require('../common/relanding.js')
const QR = require("../../utils/qrcode.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    navHs:'',
    headtitle: '拍卖会详情',
    id:'',
    details:null,
    list_details:null,
    select_s:null,
    header:{},
    start_time:'',
    starttime1:null,
    page:'2',
    is_collection:'0',
    ismodal:true,
    scene: app.globalData.scene,
    openAPPurl: '',
    isdown: 0,
    animationData:'',
    animationDatas:'',
    istext:1,
    isimg1:0,
    isimg2:0,
    code:'',
    price_sort:'',
    lot_sort:'',
    label:1,
    value:'',
    stop:0,
    sharePicUrl: '',
    report: app.api.reportlist,
    whethershare: 0,
    whethereport: 0,
    whetherposter: 0,
    coverimg:'',
    coversize:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight-1,
      id: options.id
    })
    // 确定头部信息
    that.tokens()
    // 商品列表
    that.list_details()
    // 接收推荐人id
    let u = options.share_id
    if (options.share_id == undefined) {
      u = ''
    }
    if (u !== '') {
      let s = wx.getStorageSync('share_id');
      if (!s) {
        t.share(options.share_id)
      } else {

      }
    }
  },
  // 登陆未登录头部定义
  tokens() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.setData({
        header: {
          "x-os": "wechat_mini",
          "x-app-version": app.api.edition,
          "content-type": "application/json",
          "cache-control": "private, must-revalidate"
        }
      })
      that.details()
    } else {
      wx.getStorage({
        key: 'token',
        success(r) {
          that.setData({
            header: {
              "Authorization": 'bearer ' + r.data,
              "x-os": "wechat_mini",
              "x-app-version": app.api.edition,
              "content-type": "application/json",
              "cache-control": "private, must-revalidate"
            },
          })
          that.details()
        }
      })
    }
  },
  //点击登陆
  btn_sub: function () {
    var that = this
    login.userLogin()
    setTimeout(function () {
      that.tokens()
    }, 1000)

  },
  // 登陆判断
  button() {
    let that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {

    }
  },
// 详情获取
  details(){
    var that=this
    wx.request({
      url: app.api.global_auction+that.data.id,
      header: t.logintype(),
      data: {},
      method: 'get',
      success: function (a) {
        if(a.data.data!==''){
          if (a.data.data.status==2){
            if (that.data.ismodal == true) {
              that.setData({
                ismodal: false
              })
              wx.showModal({
                content: '已失效',
                showCancel: false,
                confirmText: '知道了',
                confirmColor: '#FF3740',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: -1
                    })
                  } else if (res.cancel) {}
                }
              })
            }
          }else{
            that.setData({
              details: a.data.data,
              is_collection: a.data.data.is_collection,
              openAPPurl:app.api.auctionpage + a.data.data.id
            })
            that.setData({
              start_time: t.formatDateTime(a.data.data.start_time * 1000)
            })
          }
        }
      }
    })
  },
  // 商品列表
  list_details() {
    var that = this
    wx.request({
      url: app.api.newglobal + '?auction_id='+that.data.id + '&search='+that.data.code + '&price_sort=' + that.data.price_sort + '&lot_sort=' + that.data.lot_sort+ '&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.data !== '') {
          that.setData({
            list_details: a.data.data,
          })
          let jsons = []
          let time = []
          for (let i = 0; i < a.data.data.length; i++) {
            time.push({
              t: t.formatDateTime(a.data.data[i].start_time * 1000)
            })
            jsons.push({
              state: 0,
            })
          }
          that.setData({
            starttime1: time,
            select_s: jsons
          })
        }else{
          that.setData({
            list_details: null
          })
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
  onShow: function () {
    this.setData({
      scene: app.globalData.scene
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that=this
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
    })
    that.setData({
      page:2
    })
    // 确定头部信息
    that.tokens()
    // 获取详情
    that.details()
    // 商品列表
    that.list_details()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.api.newglobal + '?auction_id=' + that.data.id + '&search=' + that.data.code + '&price_sort=' + that.data.price_sort + '&lot_sort=' + that.data.lot_sort+ '&page=' + that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } if (res.statusCode == 200) {
          var moment_list = that.data.list_details;
          var json = that.data.select_s;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
            json.push({
              state: 0
            })
          }
          that.setData({
            list_details: that.data.list_details,
            select_s: that.data.select_s,
            page: Number(that.data.page) + 1
          })
          let a = that.data.list_details
          let time = []
          for (let i = 0; i < a.length; i++) {
            time.push({
              t: t.formatDateTime(a[i].start_time * 1000)
            })
          }
          that.setData({
            starttime1: time
          })
          wx.hideLoading();
        }
        if (res.statusCode == 422) {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const that = this;
    const imgurl = that.data.details.cover;
    const num = imgurl.length - 8
    const imgurls = imgurl.substring(num, -1)
    const imageurl = imgurls + 'square_image'
    const user_id = t.shareuserid()
    return {
      title: that.data.details.name + '\n' + that.data.details.translate_name, // 转发后 所显示的title
      desc: that.data.details.translate_name,
      path: '/pages/videos/auction?id=' + that.data.details.id + '&share_id=' + user_id, // 相对的路径
      imageUrl: imageurl,
      success: (res) => {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
          },
          fail: function (res) { },
          complete: function (res) { }
        })
      },
      fail: function (res) {}
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
  go_global(e){
    wx.navigateTo({
      url: '../videos/global?id=' + e.currentTarget.dataset.id,
    })
  },
  go_auctionhouse(e){
    wx.navigateTo({
      url: '../videos/auction_house?id=' + e.currentTarget.dataset.id,
    })
  },
  // 收藏（取消）拍卖会
  global_collect(){
    var that = this
    that.button()
    wx.request({
      url: app.api.gloabl_auctioncollection,
      data: {
        auction_id: that.data.id,
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            is_collection: '1'
          })
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else if (a.statusCode == 422) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        else {
          relanding.relanding()
          setTimeout(function () {
            that.collect()
          }, 1000)
        }
      }
    })
  },
  global_collect_d() {
    var that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: that.data.id,
        type: '4'
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            is_collection: '0'
          })
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else if (a.statusCode == 422) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        else {
          relanding.relanding()
          setTimeout(function () {
            that.collect()
          }, 1000)
        }
      }
    })
  },
  // 收藏
  collect(e) {
    var that = this
    that.button()
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: e.currentTarget.dataset.id,
        type: "3"
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
          that.data.select_s[e.currentTarget.dataset.ids].state = 1
          that.setData({
            select_s: that.data.select_s
          })
        } else if (a.statusCode == 422) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        else {
          relanding.relanding()
          setTimeout(function () {
            that.collect()
          }, 1000)
        }
      }
    })
  },
  //取消收藏
  offcollect(e) {
    var that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: e.currentTarget.dataset.id,
        type: "3"
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else if (a.statusCode == 422) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else {
          relanding.relanding()
          setTimeout(function () {
            that.offcollect()
          }, 1000)
        }
        that.data.select_s[e.currentTarget.dataset.ids].state = 0
        that.setData({
          select_s: that.data.select_s
        })
      }
    })
  },
  launchAppError(e) {
    if (e.detail.errMsg == 'invalid scene') {
      wx.navigateTo({
        url: '../download/download',
      })
    }
  },
  // 监听页面滑动
  onPageScroll: function (ev) {
    var that = this
    var animation = wx.createAnimation({
      duration: 180,
      timingFunction: "linear",
      delay: 0
    })
    var animationo = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animations = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    if (ev.scrollTop>1010){
      if (that.data.isdown == 0){
        that.setData({
          isdown: 1
        })
        animations.opacity(0.95).step()
        animation.translateY(-44).step()
        that.setData({
          animationData: animation.export(),
          animationDatas: animations.export(),
        })
        animations.export()
        animation.export()
      }
    }else{
      if (that.data.isdown==1){
        animationo.translateY(-100).step()
        that.setData({
          animationData: animation.export(),
        })
        that.setData({
          isdown: 0
        })
        animationo.translateY(44).step()
        animations.opacity(0).step()
        that.setData({
          animationDatas: animations.export(),
          animationData: animationo.export()
        })
        animations.export()
        animationo.export()
      }
    }
    if (ev.scrollTop>203){
      that.setData({
        stop:1
      })
    }else{
      that.setData({
        stop:0
      })
    }
  },
  up(){
    t.updown()
  },
  //排序
  sort(e){
    const that=this
    const id = e.currentTarget.dataset.id
    that.setData({
      istext: e.currentTarget.dataset.id,
    })
    if (that.data.stop==1){
      wx.pageScrollTo({
        scrollTop: 204,
        duration: 0,
      })
    }
    if (id == 1) {
      that.setData({
        isimg1: 0,
        isimg2: 0,
        price_sort:'',
        lot_sort:''
      })
    }
    if (id == 2) {
      that.setData({
        isimg2: 0,
        price_sort:''
      })
      if (that.data.isimg1==0){
        that.setData({
          isimg1:2,
          lot_sort:'lotdesc'
        })
      }else{
        const i = that.data.isimg1==1?2:1
        that.setData({
          isimg1:i
        })
        if(i==1){
          that.setData({
            lot_sort:'lotasc'
          })
        } 
        if (i == 2){
          that.setData({
            lot_sort:'lotdesc'
          })
        }
      }
    }
    if (id == 3) {
      that.setData({
        isimg1: 0,
        lot_sort:''
      })
      if (that.data.isimg2 == 0) {
        that.setData({
          isimg2:1,
          price_sort:'priceasc'
        })
      } else {
        const i = that.data.isimg2 == 1 ? 2 : 1
        that.setData({
          isimg2: i
        })
        if (i == 1) {
          that.setData({
            price_sort: 'priceasc'
          })
        }
        if (i == 2) {
          that.setData({
            price_sort: 'pricedesc'
          })
        }
      }
    }
    setTimeout(function () {
      that.list_details()
    }, 200)
  },
  bindinput(e) {
    const that = this
    if (t.javaTrim(e.detail.value.replace(/\n/g, '')) == '') {
      that.setData({
        label: 1,
        value:'',
        code:''
      })
    } else {
      that.setData({
        label: 0,
        value: e.detail.value
      })
      const v = t.code(e.detail.value)
      that.setData({
        code:v
      })
    }
    setTimeout(function () {
      that.list_details()
    }, 200)
  },
  delvalue(){
    const that=this
    that.setData({
      label: 1,
      value: '',
      code: ''
    })
    setTimeout(function () {
      that.list_details()
    }, 200)
  },
  closeshare() {
    const that = this
    that.setData({
      whethershare: 0
    })
  },
  openshare() {
    const that = this
    that.setData({
      whethershare: 1
    })
  },
  copylink() {
    const that = this
    const a = that.data.details
    t.copylink(a, app.api.url_auction,2)
    that.closeshare()
  },
  closereport() {
    const that = this
    that.setData({
      whethereport: 0
    })
  },
  openreport() {
    const that = this
    that.setData({
      whethereport: 1,
      whethershare: 0
    })
  },
  report(e) {
    const that = this
    const reason_id = e.currentTarget.dataset.id
    const mix_id = that.data.details.id
    t.report(reason_id, mix_id)
    that.closereport()
  },
  closeposter() {
    const that = this
    that.setData({
      whetherposter: 0
    })
  },
  poster() {
    const that = this
    that.closeshare()
    if (that.data.sharePicUrl == '') {
      wx.showLoading({
        title: '生成海报中',
      })
      const shareFrends = wx.createCanvasContext('shareFrends')
      const cover = wx.createCanvasContext('canvascover')
      const a = that.data.details
      var url = app.api.url_auction + a.id + '&share_id=' + t.shareuserid()
      QR.api.draw(url, 'canvascode', 76, 76);
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          fileType: 'jpg',
          quality: 1,
          width: 76 * 2,
          height: 76 * 2,
          destWidth: 76 * 2,
          destHeight: 76 * 2,
          canvasId: 'canvascode',
          success: function (res) {
            var tempFilePath = res.tempFilePath
            wx.downloadFile({
              url: a.cover,
              success: res => {
                var path = res.tempFilePath
                that.setData({
                  coverimg: path
                })
                setTimeout(function () {
                  t.drawImg(a, that.data.coversize, shareFrends, tempFilePath, path, 2).then(res => {
                    that.setData({
                      sharePicUrl: res.tempFilePath
                    })
                    setTimeout(function () { wx.hideLoading() }, 300)
                  })
                }, 500)
              }
            })
          },
          fail: function (res) { }
        });
      }, 500)
    }
    that.setData({
      whetherposter: 1
    })
  },
  bindload(e) {
    const that=this
    that.setData({
      coversize: e.detail
    })
  },
  // 保存海报
  saveimg() {
    const that = this
    t.saveimg(that.data.sharePicUrl)
    that.closeposter()
  }
})