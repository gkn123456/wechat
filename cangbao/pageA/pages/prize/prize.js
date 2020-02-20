// pageA/pages/prize/prize.js
const app = getApp()
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    navHs: '',
    nav: [{ nav_name: "投票", mark: "0" }, { nav_name: "我的", mark: "1" },],
    currentTab:0,
    vlist:null,
    starttime:null,
    m_vlist: null,
    m_starttime: null,
    page:2
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight+66
    })
    that.votelist()
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
    const that = this
    wx.showLoading({
      title: '加载中'
    })
    that.setData({
      page: 2
    })
    if (that.data.currentTab==0){
      that.votelist()
    }else{
      that.m_votelist()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    const id = that.data.currentTab
    wx.showLoading({
      title: '加载中'
    })
    if(id==0){
      that.votelist_onReachBottom()
    }else{
      that.m_votelist_onReachBottom()
    }
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
  swichNav: function (e) {
    var that = this
    that.setData({
      page: '2'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if (e !== undefined) {
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        if (e.target.dataset.current==1){
          let token = wx.getStorageSync('token');
          if (!token) {
            wx.navigateTo({
              url: '../grant/grant',
            })
          } else {
            that.setData({
              currentTab: e.target.dataset.current,
            })
            that.m_votelist()
          }
        }else{
          that.votelist()
          that.setData({
            currentTab: e.target.dataset.current,
          })
        }
      }
    }
    // 请求数据
  },
  // 跳转投票详情页
  jump_details(e){
    wx.navigateTo({
      url: 'prize_details?id=' + e.currentTarget.dataset.id,
    })
  },
  votelist(){
    const that=this
    wx.request({
      url: app.api.vote_list + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          that.setData({
            vlist: b.data.data,
          })
          const json=[]
          for (let i = 0; i < b.data.data.length; i++) {
            json.push(t.daytime(b.data.data[i].lottery_time * 1000))
          }
          that.setData({
            starttime: json,
          })
        } else if (b.statusCode == 204) {} else {}
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })
  },
  votelist_onReachBottom(){
    const that = this
    wx.request({
      url: app.api.vote_list + that.data.page,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          var moment_list = that.data.vlist;
          var json = that.data.starttime;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
            json.push(t.daytime(res.data.data[i].lottery_time * 1000))
          }
          that.setData({
            vlist: that.data.vlist,
            starttime: that.data.starttime,
            page: Number(that.data.page) + 1
          })
        } else if (res.statusCode == 204) {
          t.alert('没有更多')
        } else { }
        wx.hideLoading();
      }
    })
  },
  m_votelist(){
    const that = this
    wx.request({
      url: app.api.m_vote_list + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          that.setData({
            m_vlist: b.data.data,
          })
          const json = []
          for (let i = 0; i < b.data.data.length; i++) {
            json.push(t.daytime(b.data.data[i].vote.lottery_time * 1000))
          }
          that.setData({
            m_starttime: json,
          })
        } else if (b.statusCode == 204) {

        } else {}
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })
  },
  m_votelist_onReachBottom() {
    const that = this
    wx.request({
      url: app.api.m_vote_list + that.data.page,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          var moment_list = that.data.m_vlist;
          var json = that.data.m_starttime;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
            json.push(t.daytime(res.data.data[i].lottery_time * 1000))
          }
          that.setData({
            m_vlist: that.data.m_vlist,
            m_starttime: that.data.m_starttime,
            page: Number(that.data.page) + 1
          })
        } else if (res.statusCode == 204) {
          t.alert('没有更多')
        } else { }
        wx.hideLoading();
      }
    })
  },
})