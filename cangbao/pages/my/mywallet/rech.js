// pages/my/mywallet/rech.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'',
    navH: '',
    headtitle: '充值',
    type:''
  },
  input(e){
    var that=this
    that.setData({
      num: e.detail.value
    })
  },
  rech(){
    var that = this
    if (that.data.num == "" || that.data.num ==0){
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
    }else{
      wx.navigateTo({
        url: 'payy?num=' + that.data.num+'&type='+that.data.type,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      type: options.type
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
    wx.setNavigationBarTitle({
      title: '充值',
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
  }
})