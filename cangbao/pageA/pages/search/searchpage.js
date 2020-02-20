const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    value:'',
    header: {},
    goodslist:null,
    page:2,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      headtitle: options.value,
      value: t.code(options.value),
      id: options.id
    })
    that.goodslist()
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
      title: '加载中'
    })
    that.setData({
      page:2
    })
    that.goodslist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this
    let url = ''
    wx.request({
      url: app.api.newgoodslist + that.data.id + '&page=' + that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } else {
          var moment_list = that.data.goodslist;
          console.log(res)
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            goodslist: that.data.goodslist,
            page: Number(that.data.page) + 1
          })
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
      note:1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  goodslist(){
    let that=this
    wx.request({
      url:app.api.newgoodslist+that.data.id+ '&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          that.setData({
            goodslist: null
          })
          wx.stopPullDownRefresh()
          wx.hideLoading();
        } else {
          that.setData({
            goodslist: b.data.data
          })
          wx.stopPullDownRefresh()
          wx.hideLoading();
        }
      }
    })
  },
  govideos(e){
    wx.navigateTo({
      url: '../../../pages/videos/videos?id='+e.currentTarget.dataset.id,
    })
  }
})