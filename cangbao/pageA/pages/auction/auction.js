// pageA/pages/auction/auction.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
const login = require('../../../pages/common/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '拍卖会',
    navH: '',
    auction_list:null,
    auction_lists:null,
    page:2,
    endclock: [],
    multiArray1: [],
    auction_stamptime: '',
    header: {},
    setInterval:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    that.tokens()
    setTimeout(function () {
      that.auction_list()
    }, 500)
    that.gain_while()
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
  // 全球拍拍卖会列表
  auction_list() {
    var that = this
    wx.request({
      url: app.api.newauctionlist + that.data.auction_stamptime+'&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 204) {
          clearInterval(that.data.interval);
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
            auction_lists:json
          })
          setTimeout(function () {
            that.auc_clock()
          }, 500)
          wx.hideLoading();
        }
      }
    })
  },
  // 拍卖会开拍倒计时
  auc_clock() {
    let that = this
    if (that.data.auction_list!==null){
      that.data.setInterval=setInterval(function () {
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
    }else{
      clearInterval(that.data.interval);
    }
  },
  // 拍卖会时间选择
  changelabe2: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    var index = e.currentTarget.dataset.key;
    for (let i = 0; i < that.data.multiArray1.length; i++) {
      that.data.multiArray1[i].tg = 0;
    }
    that.setData({
      multiArray1: that.data.multiArray1,
      page:2
    });
    if (that.data.multiArray1[index].tg == 1) {
      that.data.multiArray1[index].tg = 1;
    } else if (that.data.multiArray1[index].tg == 0) {
      that.data.multiArray1[index].tg = 1;
    }
    that.setData({
      multiArray1: that.data.multiArray1,
      auction_stamptime: that.data.multiArray1[index].stamp
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    that.auction_list()
  },
  // 获取时间
  gain_while() {
    var that = this
    var strs2 = []
    for (let i = 0; i < 16; i++) {
      if (i == 0) {
        strs2.push({
          t: '全部',
          tg: 1,
          stamp: ''
        })
      } else {
        const str2 = t.monthday(new Date(new Date().toLocaleDateString()).getTime() + ((i) * 24 * 60 * 60 * 1000))[0].str2
        const stamp = t.monthday(new Date(new Date().toLocaleDateString()).getTime() + ((i) * 24 * 60 * 60 * 1000))[0].stamp
        strs2.push({
          t: str2,
          tg: 0,
          stamp: stamp
        })
      }
    }
    that.setData({
      multiArray1: strs2
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
    clearInterval(this.data.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.interval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that=this
    wx.showLoading({
      title: '加载中'
    })
    that.setData({
      page:2
    })
    that.auction_list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.api.newauctionlist + that.data.auction_stamptime +'&page='+that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } if (res.statusCode == 200)  {
          var moment_list = that.data.auction_list;
          var moment_lists = that.data.auction_lists;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
            moment_lists.push({
              state:0
            })
          }
          that.setData({
            auction_list: that.data.auction_list,
            auction_lists: that.data.auction_lists,
            page: Number(that.data.page) + 1
          })
          setTimeout(function () {
            that.auc_clock()
          }, 500)
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
  // 收藏（取消）拍卖会
  global_collect(e) {
    var that = this
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
        else {
          relanding.relanding()
        }
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
        }else {
          relanding.relanding()
        }
        that.data.auction_lists[e.currentTarget.dataset.ids].state = 0
        that.setData({
          auction_lists: that.data.auction_lists
        })
      }
    })
  },
  // 热拍跳转拍卖会
  goauction(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/videos/auction?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
})