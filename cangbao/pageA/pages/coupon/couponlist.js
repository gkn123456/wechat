// pageA/pages/coupon/couponlist.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '优惠券',
    navH: '',
    navHs:'',
    width: wx.getSystemInfoSync().windowWidth-21,
    widths: wx.getSystemInfoSync().windowWidth-9+91,
    widths1:wx.getSystemInfoSync().windowWidth - 9-116,
    header:{},
    nav: [{ 'id': 0, 'name': '未使用' }, { 'id': 1, 'name': '已使用' }, { 'id': 2, 'name': '已过期'}],
    sign:0,
    sign1:0,
    page:2,
    list:null,
    value:'',
    time:[],
    scroll_left:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight+48
    })
    that.tokens()
    setTimeout(function () {
      that.list()
    }, 400)
  },
  // 登陆头部定义
  tokens() {
    const that = this
    that.setData({
      header: t.logintype()
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
    const that=this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    that.setData({
      page: 2
    })
    that.list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that=this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.api.coupon + that.data.sign + '/'+that.data.page,
      data: {
      },
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          t.alert('没有更多')
        }else if (res.statusCode == 200) {
          const list = that.data.list;
          const json=that.data.time
          for (let i = 0; i < res.data.data.length; i++) {
            const i1 = t.toDates(res.data.data[i].use_start_time)
            const i2 = t.toDates(res.data.data[i].use_end_time)
            list.push(res.data.data[i]);
            json.push({
              start_time: i1,
              end_time: i2
            })
          }
          that.setData({
            list: that.data.list,
            time:that.data.time,
            page: Number(that.data.page) + 1
          })
        }else{}
        wx.hideLoading()
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
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  down1(e){
    const that=this
    that.setData({
      sign: e.target.dataset.id,
      list:null
    })
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    setTimeout(function(){
      that.list()
    },400)
  },
  bindinput(e){
    const that=this
    const v = e.detail.value
    that.setData({
      value: v
    })
    if(v==''){
      that.setData({
        sign1:0
      })
    }else{
      that.setData({
        sign1: 1
      })
    }
  },
  delval(){
    const that=this
    that.setData({
      value:'',
      sign1: 0
    })
  },
  // 数据
  list(){
    const that=this
    wx.request({
      url: app.api.coupon + that.data.sign+'/1',
      data: {
      },
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          that.setData({
            list: null
          })
        }else if (res.statusCode == 200) {
          that.setData({
            list: res.data.data
          })
          const json=[]
          for(let i in res.data.data){
            const i1 = t.toDates(res.data.data[i].use_start_time)
            const i2 = t.toDates(res.data.data[i].use_end_time)
            json.push({
              start_time:i1,
              end_time:i2
            })
          }
          that.setData({
            time:json
          })
        }else{}
        wx.hideLoading();
        wx.stopPullDownRefresh()
        that.setData({
          scroll_left:''
        })
      }
    })
  },
  exchangebut(){
    const that=this
    wx.request({
      url: app.api.exchange,
      data: {
        code: that.data.value
      },
      header: t.logintype(),
      method: 'post',
      success(res) {
        t.alert(res.data.message)
        if (res.data.status_code == 200) {
          that.list()
          that.setData({
            value:'',
            sign1: 0
          })
        } else {}
      }
    })
  },
  delcoupon(e){
    const that = this
    wx.showModal({
      content: '确认删除此优惠券？',
      cancelColor:'#444',
      confirmColor:'#444',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.delcoupon,
            data: {
              id: e.target.dataset.id
            },
            header: t.logintype(),
            method: 'delete',
            success(res) {
              t.alert(res.data.message)
              if (res.statusCode == 200) {
                that.list()
              } else { }
            }
          })
        } else if (res.cancel) {
          that.setData({
            scroll_left: ''
          })
        }
      }
    })
  },
})