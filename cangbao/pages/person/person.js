// pages/person/person.js
const app = getApp()
const t = require('../common/time.js')
const form = require('../common/formid.js')
const relanding = require('../common/relanding.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:{},
    headtitle:'主页',
    id:'',
    details1:null,
    heights:'100%',
    block:'block',
    block1:'none',
    token: '' ,
    follow:'',
    type:'0',
    sizeheight: '',// 宝库列表宽
    bk:null,
    style:'display:none',
    navH: '',
    page:'2',
    header:{},
    scene: app.globalData.scene,
    openAPPurl:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      sizeheight: ((wx.getSystemInfoSync().windowWidth - 2) / 3) + 'px',
      navH: app.globalData.navHeight,
    })
    that.setData({
      id: options.id
    })
    that.tokens()
    wx.request({
      url: app.api.selinformation + that.data.id,
      data: {},
      header: t.logintype(),
      method: 'get',
      success: function (res) {
        that.setData({
          details: res.data.data,
          follow: res.data.data.is_follow,
          openAPPurl: app.api.personalpage + res.data.data.user_id,
        })
      },
    })
      wx.request({
        url: app.api.selinformation + options.id,
        data: {},
        header: t.logintype(),
        method: 'get',
        success: function (res) {
          that.setData({
            details: res.data.data,
          })
        },
      })
      wx.request({
        url: app.api.selshoplist + that.data.id + '/1',
        method: 'get',
        header: t.logintype(),
        success: function (b) {
          if (b.data == "") {
            that.setData({
              bk: null
            })
          } else {
            that.setData({
              bk: b.data.data
            })
          }
        }
      })
      // 请求用户竞拍拍品数据
      var page = 1
      wx.request({
        url: app.api.selgoodlist + 'auctioning/' + options.id + '/1',
        data: {},
        header: t.logintype(),
        method: 'get',
        success: function (res) {
          if (res.data !== "") {
            that.setData({
              details1: res.data.data,
            })
          }
        },
      })
      wx.request({
        url: app.api.selshoplist + that.data.id + '/1',
        method: 'get',
        header: t.logintype(),
        success: function (b) {
          if (b.data == "") {
            that.setData({
              bk: null
            })
          } else {
            that.setData({
              bk: b.data.data
            })
          }
        }
      })
    // 接收推荐人id
    let u = options.share_id
    if (options.share_id == undefined) {
      u = ''
    }
    if (u !== '') {
      let s = wx.getStorageSync('share_id');
      if (!s) {
        t.share(options.share_id)
      } else { }
    }
    
  },
  // 登陆头部定义
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
        },
      })
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
            token: 'bearer ' + r.data,
          })
        }
      })
    }
  },
  // 监听页面滑动
  onPageScroll: function (ev) {
    var that=this
    if (ev.scrollTop > 200 || ev.scrollTop==200){
      that.setData({
        style: 'display:block;'
      })
    }else{
      that.setData({
        style: 'display:none;'
      })
    } 
  },
  shopdetail(){
    var that=this
    wx.navigateTo({
      url: '../videos/storedetails?id=' + that.data.details.user_id,
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
  //事件处理函数
  onPullDownRefresh: function () {
    var that = this
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
    })
    that.setData({
      page: 2,
    })
    if(that.data.type==0){
      wx.request({
        url: app.api.selgoodlist + 'auctioning/' + that.data.id + '/1',
        data: {},
        header: t.logintype(),
        method: 'get',
        success: function (res) {
          that.setData({
            details1: res.data.data,
          })
          wx.stopPullDownRefresh()
        },
      })
    }
    if (that.data.type == 1){
      wx.request({
        url: app.api.selshoplist + that.data.id + '/1',
        method: 'get',
        header: t.logintype(),
        success: function (b) {
          that.setData({
            bk: b.data.data
          })
          wx.stopPullDownRefresh()
        }
      })
    }
  },
onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
  if (that.data.type == 0){
      wx.request({
        url: app.api.selgoodlist + 'auctioning/' +that.data.id+'/'+that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.data == '') {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } else {
            var moment_list = that.data.details1;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            that.setData({
              details1: that.data.details1,
              page: Number(that.data.page) + 1
            })
            wx.hideLoading();
          }
        }
      })
    }else{
    wx.request({
      url: app.api.selshoplist + that.data.id + '/' + that.data.page,
      data: {
      },
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.data == '') {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } else {
          var moment_list = that.data.bk;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            bk: that.data.bk,
            page: Number(that.data.page) + 1
          })
          wx.hideLoading();
        }
      }
    })
    }
    
  },
  onShareAppMessage: function () {
    const that=this
    const user_id = t.shareuserid()
    return {
      title: '藏宝-'+that.data.details.nick_name,
      path: '/pages/person/person?id=' + that.data.details.user_id + '&share_id=' + user_id
    }
  },
  // 关注
  follow() {
    var that = this
    wx.request({
      url: app.api.user_detfollow,
      data: {
        user_id: that.data.details.user_id,
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            follow: '1'
          })
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } 
        if (a.statusCode == 401) {
          relanding.relanding()
        }
      }
    })
  },
  //取消关注
  tofollow() {
    var that = this
    wx.request({
      url: app.api.user_detfollow,
      data: {
        user_id: that.data.details.user_id,
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            follow: '0'
          })
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } if (a.statusCode == 401) {
          relanding.relanding()
        }
      }
    })
  },
  switch(e) {
    var that = this
    that.setData({
      type: e.currentTarget.dataset.type,
      page:'2'
    })
  },
  // 
  // 分享
  onShareAppMessage: function (r) {
    const that = this;
    const imgurl = that.data.details.user_icon;
    const num = imgurl.length - 8
    const imgurls = imgurl.substring(num, -1)
    const imageurl = imgurls + 'square_image'
    return {
      title: '藏宝-' + that.data.details.nick_name, // 转发后 所显示的title
      desc: that.data.details.profile,
      path: '/pages/person/person?id=' + that.data.id, // 相对的路径
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
          complete: function (res) {  }
        })
      },
      fail: function (res) {
      }
    }
  },
  xiala: function () {
    this.setData({
      heights: '',
      block: 'none',
      block1: 'block'
    })

  },
  xiala1: function () {
    this.setData({
      heights: '100%',
      block: 'block',
      block1: 'none'
    })

  },
  todown() {
    wx.showModal({
      title: '藏宝',
      content: '暂未开放此功能,是否下载APP',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../download/download',
          })
        } else if (res.cancel) {}
      }
    })
  },
  gopers(e){
    var that=this
    wx.navigateTo({
      url: '../videos/commoditydetails?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  launchAppError(e) {
    console.log(this.data.openAPPurl)
    if (e.detail.errMsg == 'invalid scene') {
      wx.navigateTo({
        url: '../download/download',
      })
    }
  },
})