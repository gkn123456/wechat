// pages/my/mywallet/cash.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    user1: [],
    num:'',
    bank_name:'',
    icon_url:'',
    id:'',
    amount:'',
    navH: '',
    headtitle: '提现',
    paystyle:0
  },
  allcash(){
    var that=this
    that.setData({
      amount: that.data.user1.deposit_account
    },()=>{
      that.rcalue()
    })
  },
  xuancar(){
    wx.redirectTo({
      url: 'myband?name=bond',
    })
  },
  gopass(){
    var that=this
    if (that.data.id !== '') {
      if (that.data.amount==''){} else if (that.data.amount <=0){}else{
        wx.navigateTo({
          url: 'bondpassword?paynum=' + that.data.amount + '&&id=' + that.data.id,
        })
      }
    } else {
      wx.showToast({
        title: '请先选择银行卡',
        icon: 'none'
      })
    }
    
  },
  val1(e){
    var that = this
    that.setData({
      amount: e.detail.value
    }, ()=> {
      if (that.data.amount == '') {
        that.setData({
          paystyle:0
        });
      } else if (that.data.amount <= 0) {
        that.setData({
          paystyle: 0
        });
      } else {
        that.setData({
          paystyle: 1
        });
      }
    })
  },
  rcalue: function rcalue() {
    var that = this;
    if (that.data.amount !== '') {
      that.setData({
        paystyle: 1
      });
    } else if (that.data.amount > 0) {
      that.setData({
        paystyle: 1
      });
    } else {
      that.setData({
        paystyle: 0
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    wx.request({
      url: app.api.bankcard,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          that.setData({
            user: null,
          })
        }
        if (b.statusCode == 200) {
          that.setData({
            user: b.data.data,
          })
        }
        if (options.urls == undefined) {
          if (b.statusCode == 204) {
            wx.showToast({
              title: '请先选择银行卡',
              icon: 'none'
            })
          } else {
            that.setData({
              num: b.data.data[0].bank_number.substr(b.data.data[0].bank_number.length - 4),
              bank_name: b.data.data[0].bank_name,
              icon_url: b.data.data[0].icon_url,
              id: b.data.data[0].card_id
            })
          }
        } else {
          that.setData({
            icon_url: options.urls,
            num: options.num.substr(options.num.length - 4),
            bank_name: options.names,
            id: options.carid
          })
        }
      }
    })
    wx.request({
      url: app.api.bondaccount_details,
      data: {},
      method: 'get',
      header:t.logintype(),
      success: function (c) {
        that.setData({
          user1: c.data.data
        })
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
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.onLoad()
    }
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