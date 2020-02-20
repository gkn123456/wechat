const app = getApp()
const login = require('../../pages/common/login.js')
const t = require('../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    headtitle:'开通记录',
    list:null,
    page:2,
    time:null,
    pagefooter:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.record()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    // 保证金列表
    wx.request({
      url: app.api.expiry_record + that.data.page,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          t.alert('没有更多')
          that.setData({
            pagefooter:true
          })
        } if (b.statusCode == 200) {
          if(b.data.data.length<20){
            that.setData({
              pagefooter:true
            })
          }
          var moment_list = that.data.list;
          for (var i = 0; i < b.data.data.length; i++) {
            moment_list.push(b.data.data[i]);
          }
          that.setData({
            list: moment_list,
            page: Number(that.data.page) + 1
          },()=>{
            var bonddetails1 = [];
            for (var i = 0; i < that.data.list.length; i++) {
              bonddetails1.push({
                text1: t.formatDateTime(that.data.list[i].end_time * 1000),
                text2:t.formatDateTime(that.data.list[i].begin_time * 1000)
              })
            }
            that.setData({
              time: bonddetails1
            })
            wx.hideLoading();
          })
          
          
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 开通记录
  record(){
    const that=this
    wx.request({
      url: app.api.expiry_record + '1',
      data: {},
      method: 'get',
      header:t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          that.setData({
            list: null,
          })
        }
        if (b.statusCode == 200) {
          that.setData({
            list: b.data.data,
          })
          if(b.data.data.length<20){
            that.setData({
              pagefooter:true
            })
          }
          var time = [];
          for (var i = 0; i < b.data.data.length; i++) {
            time.push({
              id: i,
              text1: t.formatDateTime(b.data.data[i].end_time * 1000),
              text2:t.formatDateTime(b.data.data[i].begin_time * 1000)

            })
            that.setData({
              time: time
            })
          }
        }
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
      url: '../../pages/index/index',
    })
  },
})