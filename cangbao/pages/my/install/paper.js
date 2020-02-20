// pages/my/install/paper.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    id: '',
    t: '',
    navH: '',
    headtitle: '清关证件',
    iden:'2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    that.parlist()
    if (options['iden'] !== undefined) {
      that.setData({
        iden: options.iden,
        order_id: options.order_id
      })
    }
  },
  parlist(){
    var that=this
    wx.request({
      url: app.api.customcert_list,
      data: {},
      method: 'get',
      header: t.logintype(),
      success(res) {
        if (res.data == '') {
          that.setData({
            list: null
          })
        } else {
          let json = []
          for (let i = 0; i < res.data.data.length; i++) {
            json.push(t.replacepos(res.data.data[i].card))
          }
          that.setData({
            list: res.data.data,
            json: json
          })
        }
      }
    })
  },
  addnew() {
    var that=this
    if(that.data.list==null){
      wx.navigateTo({
        url: './addnewpaper?d=1',
      })
    }else{
      wx.navigateTo({
        url: './addnewpaper?d=0',
      })
    }
  },
  goorder(e) {
    var that = this
    if (that.data.id !== undefined) {
      wx.request({
        url: app.api.order_addressput,
        data: {
          address_id: e.currentTarget.dataset.id,
          order_id: that.data.id
        },
        method: 'put',
        header: t.logintype(),
        success(res) {
        }
      })
      wx.navigateBack({
        success() {
          let page = getCurrentPages().pop()
          page.onLoad()
        }
      })
    } else { }
    if (that.data.t == 1) {
      wx.setStorage({
        key: "wareid",
        data: e.currentTarget.dataset.wareid,
        success() {
          wx.navigateBack({
            success() {
              let page = getCurrentPages().pop()
              page.onShow()
            }
          })
        }
      })
    }
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
    this.parlist()
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
    let page = getCurrentPages().pop()
    if (page == undefined || page == null) {
      return
    }
    page.onShow()
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
  },
  iden_paper(e){
    var that=this
    if(that.data.iden==1){
      wx.request({
        url: app.api.order_custom,
        data: {
          cert_id: e.currentTarget.dataset.id,
          order_id: that.data.order_id
        },
        method: 'put',
        header: t.logintype(),
        success(res) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          if (res.data.status_code == 422) { }
          if (res.data.status_code == 200) {
            wx.navigateBack({
              success() {
                let page = getCurrentPages().pop()
                page.onLoad()
              }
            })
          }
        }
      })
    }
  }
})