// pageA/pages/applycard/applycard.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '申请店铺名片',
    navH: '',
    token:'',
    applyid:'',
    user:[],
    apply:[],
    mobile:'',
    aduser:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    wx.getStorage({
      key: 'applyid',
      success(res) {
        that.setData({
          applyid:res.data
        })
        setTimeout(function () {
          wx.getStorage({
            key: 'token',
            success(res) {
              that.setData({
                token: 'bearer' + res.data
              })
              setTimeout(function () {
                that.user()
                that.applycondition()
              }, 300)
            }
          })
        }, 300)
      }
    })
  },
  // 获取用户信息
  user(){
    let that=this
    wx.request({
      url: app.api.address,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.onLoad()
          }, 1000)
        } else {
          if(b.data==''){
            that.setData({
              user: null
            })
          }else{
            that.setData({
              user: b.data.data[that.data.applyid]
            })
          }
        }
      }
    })
  },
  
  // 获取店铺二维码申请条件
  applycondition(){
    let that=this
    wx.request({
      url: app.api.applycondition,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        console.log(b.data.data)
        that.setData({
          apply: b.data.data
        })
      }
    })
  },
  u(){
    let that=this
    wx.getStorage({
      key: 'applyid',
      success(res) {
        setTimeout(function () {
          wx.request({
            url: app.api.address,
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (b) {
              if (b.statusCode == 401) {
                relanding.relanding()
                setTimeout(function () {
                  that.onLoad()
                }, 1000)
              } else {
                if (b.data == '') {
                  that.setData({
                    user: null
                  })
                } else {
                  that.setData({
                    user: b.data.data[res.data]
                  })
                }
              }
            }
          })
        }, 300)
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
    let that=this
    that.u()
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
  // 改变收货地址
  addresst() {
    var that = this
    wx.navigateTo({
      url: '../../../pages/my/install/address?id=cs',
    })
  },
  applyl(){
    let that=this
    wx.request({
      url: app.api.mail_card,
      data: {
        address_id: that.data.user.address_id,
        mobile: that.data.mobile
      },
      method: 'post',
      header: t.logintype(),
      success: function (b) {
        wx.showToast({
          title: b.data.message,
          icon:'none',
          duration: 3000
        })
        that.onLoad()
      }
    })
  },
  mobile(e) {
    var that = this
    that.setData({
      mobile: e.detail.value
    })
  },
})