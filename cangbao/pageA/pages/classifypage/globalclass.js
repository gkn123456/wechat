// pageA/pages/classifypage/globalclass.js
const app = getApp()
const login = require('../../../pages/common/login.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: {
      "x-os": "wechat_mini",
      "x-app-version": app.api.edition,
      "content-type": "application/json",
      "cache-control": "private, must-revalidate"
    },
    navH: '',
    headtitle: '',
    // 索引id
    id: '',
    //拍品数组
    groom_list: null,
    select_s: null,
    starttime:[],
    page:'2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      id: options.id,
      headtitle: options.name
    })
    that.tokens()
    that.cate()
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
      that.tokens()
    }
  },
  // 获取分类拍品
  cate() {
    var that = this
    that.tokens()
    wx.request({
      url: app.api.newglobal+ '?cate_id=' + that.data.id+'&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.data == '') {
          that.setData({
            groom_list: null
          })
        } else {
          that.setData({
            groom_list: a.data.data
          })
          let time = []
          let jsons = []
          for (let i = 0; i < a.data.data.length; i++) {
            time.push({
              t: t.formatDateTime(a.data.data[i].start_time * 1000)
            })
            jsons.push({
              state: 0,
            })
          }
          that.setData({
            starttime: time,
            select_s: jsons
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
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
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      page:2
    })
    that.cate()
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
      url: '../../../pages/index/index',
    })
  },
  goglobal(e){
    wx.navigateTo({
      url: '../../../pages/videos/global?id=' + e.currentTarget.dataset.id,
    })
  },
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.api.newglobal + '?cate_id=' + that.data.id + '&page=' + that.data.page,
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
          var moment_list = that.data.groom_list;
          var json = that.data.select_s;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i])
            json.push({
              state: 0
            })
          }
          that.setData({
            groom_list: that.data.groom_list,
            select_s: that.data.select_s,
            page: Number(that.data.page) + 1
          })
          wx.hideLoading();
          let time = []
          let a = that.data.groom_list
          for (let i = 0; i < a.length; i++) {
            time.push({
              t: t.formatDateTime(a[i].start_time * 1000)
            })
          }
          that.setData({
            starttime: time
          })
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
})