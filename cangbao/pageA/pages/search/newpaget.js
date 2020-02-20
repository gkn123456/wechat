// pageA/pages/search/newpage.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
const login = require('../../../pages/common/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    value:'',
    header: {},
    page: 2,
    auction_list: null,
    auction_lists: null,
    endclock: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      value:options.v
    })
    that.tokens()
    setTimeout(function () {
      that.list()
    }, 300)
  },
  // 是否有登陆态
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
  // 获取查询数据
  // 全球拍拍卖会列表
  list() {
    const that = this
    const n = t.code(that.data.value)
    that.tokens()
    wx.request({
      url: app.api.hall + n+'&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 204) {
          that.setData({
            auction_list: null
          })
          wx.hideLoading();
        } else {
          let json = []
          for (let i = 0; i < a.data.data.length; i++) {
            json.push({ state: 0 })
          }
          that.setData({
            auction_list: a.data.data,
            auction_lists: json
          })
          setTimeout(function () {
            that.auc_clock()
          }, 500)
          wx.hideLoading();
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  // 拍卖会开拍倒计时
  auc_clock() {
    const that = this
    setInterval(function () {
      const storage = [];
      for (let i = 0; i < that.data.auction_list.length; i++) {
        storage.push(
          t.countdown(that.data.auction_list[i].start_time)
        )
      }
      that.setData({
        endclock: storage,
      })
    }, 1000)
  },
  // 收藏（取消）拍卖会
  global_collect(e) {
    const that = this
    that.button()
    wx.request({
      url: app.api.gloabl_auctioncollection,
      data: {
        auction_id: e.currentTarget.dataset.id,
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
          that.data.auction_lists[e.currentTarget.dataset.ids].state = 1
          that.setData({
            auction_lists: that.data.auction_lists
          })
        } else if (a.statusCode == 422) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        else if (a.statusCode == 401){
          relanding.relanding()
          setTimeout(function () {
            that.global_collect()
          }, 1000)
        }else{}
      }
    })
  },
  global_collect_d(e) {
    var that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: e.currentTarget.dataset.id,
        type: '4'
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
        }
        else if (a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.global_collect_d()
          }, 1000)
        }else{}
        that.data.auction_lists[e.currentTarget.dataset.ids].state = 0
        that.setData({
          auction_lists: that.data.auction_lists
        })
      }
    })
  },
  //跳转拍卖会
  goauction(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/videos/auction?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    that.tokens()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    that.tokens()
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
    const that = this
    that.tokens()
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    const n = t.code(that.data.value)
    wx.request({
      url: app.api.hall + n +'&page='+that.data.page,
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
          var moment_list = that.data.auction_list;
          var moment_lists = that.data.auction_lists;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
            moment_lists.push({
              state: 0
            })
          }
          that.setData({
            auction_list: that.data.auction_list,
            auction_lists: that.data.auction_lists,
            page: Number(that.data.page) + 1
          })
          setTimeout(function () {
            that.auc_clock()
          }, 300)
          wx.hideLoading();
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  back() {
    wx.navigateBack({
      note: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
})