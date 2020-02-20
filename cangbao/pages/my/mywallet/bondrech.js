// pages/my/mywallet/rech.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'',
    navH: '',
    headtitle: '充值保证金账户',
    type:'other',
    input_n:0
  },
  input(e){
    var that=this
    if (t.isNumber(e.detail.value) == true) {
      that.setData({
        num: e.detail.value
      },()=>{
        that.switchinput()
      })
    } else {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none'
      })
      that.setData({
        num:''
      }, () => {
        that.switchinput()
      })
    }
    
  },
  rech(){
    var that = this
    if (that.data.num == "" || that.data.num ==0){
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none'
      })
    }else{
      wx.navigateTo({
        url: 'bondpayy?num=' + that.data.num+'&type='+that.data.type,
      })
    }
    
  },
  switchinput(){
    const that=this
    if(that.data.num!==''){
      that.setData({
        input_n:1
      })
    }else{
      that.setData({
        input_n: 0
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