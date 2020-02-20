// pages/my/my.js
const common = require('../common/common.js')
const t = require('../common/time.js')
const form = require('../common/formid.js')
const relanding = require('../common/relanding.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    code: '',
    wstyle:'',
    isblock:"1",
    terminal:'0',
    num:'',
    block:"none",
    contact:'',
    type: 1,
    s1:'',
    s2: '',
    s3: '',
    s4: '',
    s5: '',
    sl1: '',
    sl2: '',
    sl3: '',
    sl4: '',
    navH: '',
    seller_user:[],
    seller_num:[],
    ewm:'',
    v1:'none',
    ispublish:'0',
    bstyle: 'margin:8px;',
    nick_name:''
  },
  goparse(){
    var that=this
    wx.navigateTo({
      url: '../person/person?id=' + that.data.user.user_id,
    })
  },
  btn_sub: function () {
    common.userLogin()
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })
    let token = wx.getStorageSync('token');
    if (!token) {
      that.setData({
        isblock: '1',
        block: 'none',
        contact: '',
        type:1
      })
    } else {
      that.setData({
        block: 'block',
        contact: 'contact',
        type: 2,
        isblock:'0'
      })
    }
    wx.request({
      url: app.api.user,
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
          wx.request({
            url: app.api.order_count,
            header: t.logintype(),
            success: function (c) {
              that.setData({
                num: c.data.data
              })
              if (c.data.data.pay !== 0) {
                that.setData({
                  s1: 'rgba(244,67,54,1);'
                })
              }
              if (c.data.data.send !== 0) {
                that.setData({
                  s2: 'rgba(244,67,54,1);'
                })
              }
              if (c.data.data.receive !== 0) {
                that.setData({
                  s3: 'rgba(244,67,54,1);'
                })
              }
              if (c.data.data.comment !== 0) {
                that.setData({
                  s4: 'rgba(244,67,54,1);'
                })
              }
              if (c.data.data.after_sale !== 0) {
                that.setData({
                  s5: 'rgba(244,67,54,1);'
                })
              }
            }
          })
          that.setData({
            user: b.data.data,
            isblock: "0"
          })
          wx.setStorage({
            key: "login_userid",
            data: b.data.data.user_id
          })
          if (b.data.data.nick_name.length > 5) {
            that.setData({
              nick_name: b.data.data.nick_name.slice(0, 5) + '...'
            })
          } else {
            that.setData({
              nick_name: b.data.data.nick_name
            })
          }
          //获取到用户凭证 存儲 token 
          wx.setStorage({
            key: "user_id",
            data: b.data.data.user_id
          })
          // 店铺信息
          wx.request({
            url: app.api.sell_user,
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (c) {
              that.setData({
                seller_user: c.data.data,
              })
            }
          })
          // 卖家订单状态数量
          wx.request({
            url: app.api.sel_order_cont,
            data: {},
            method: 'get',
            header: t.logintype(),
            success: function (e) {
              that.setData({
                seller_num: e.data.data,
              })
              if (e.data.data.pay !== 0) {
                that.setData({
                  sl1: 'rgba(244,67,54,1);'
                })
              }
              if (e.data.data.send !== 0) {
                that.setData({
                  sl2: 'rgba(244,67,54,1);'
                })
              }
              if (e.data.data.receive !== 0) {
                that.setData({
                  sl3: 'rgba(244,67,54,1);'
                })
              }
              if (e.data.data.after_sale !== 0) {
                that.setData({
                  sl4: 'rgba(244,67,54,1);'
                })
              }
            }
          })
        }
        setTimeout(function(){
          const query = wx.createSelectorQuery()
          query.select('#username').boundingClientRect()
          query.selectViewport().scrollOffset()
          query.exec(function (res) {
            const width = res[0].width - 34
            const querys = wx.createSelectorQuery()
            querys.select('#usernames').boundingClientRect()
            querys.selectViewport().scrollOffset()
            querys.exec(function (res) {
              const w1 = Math.round(res[0].width)
              const w2 = Math.round(width)
              if (w1 >= w2) {
                that.setData({
                  wstyle: 'width:' + w2 + 'px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
                  bstyle: 'margin:0;'
                })
              } else {
                that.setData({
                  wstyle: '',
                  bstyle: 'margin-left:8px;'
                })
              }
            })
          })
        },300)
        
      }
    })
  },
  // 买-卖家切换
  terchange(e){
    let that=this
    if (e.currentTarget.dataset.id == '0'){
      that.setData({
        terminal:'1'
      })
    }else{
      that.setData({
        terminal: '0'
      })
    }
  },
  jump(e){
    const that=this
    const i = e.currentTarget.dataset.type
    let token = wx.getStorageSync('token');
    if (!token) {
      t.alert('请先登陆')
    } else {
      if (i == 1){
        wx.navigateTo({
          url: '../../pageA/pages/follow/follow?'
        })
      }
      if (i == 2) { 
        wx.navigateTo({
          url: '../../pageA/pages/collect/collect?'
        })
      }
      if (i == 3) {
        wx.navigateTo({
          url: '../../pageA/pages/havebeat/havebeat?'
        })
       }
      if (i == 4) { 
        wx.navigateTo({
          url: '../../pageA/pages/fans/fans?'
        })
      }
      if (i == 5||i==12) { 
        wx.navigateTo({
          url: 'mywallet/mywallet',
        })
      }
      if (i == 6) { 
        wx.navigateTo({
          url: '../my/allorders?id=0&type=all',
        })
      }
      if (i == 7) { 
        wx.navigateTo({
          url: '../my/allorders?id=1&type=pay',
        })
      }
      if (i == 8) { 
        wx.navigateTo({
          url: '../my/allorders?id=2&type=send',
        })
      }
      if (i == 9) { 
        wx.navigateTo({
          url: '../my/allorders?id=3&type=receive',
        })
      }
      if (i == 10) { 
        wx.navigateTo({
          url: '../my/allorders?id=4&type=comment',
        })
      } 
      if (i == 11) { 
        wx.navigateTo({
          url: '../my/allorders?id=5&type=comment',
        })
      }
      if (i == 13) { 
        wx.navigateTo({
          url: 'mybond/mybond',
        })
      }
      if (i == 14) { 
        wx.navigateTo({
          url: 'install/address',
        })
      }
      if (i == 15) {}
      if (i == 16) {
        wx.navigateTo({
          url: 'install/install?uname=' + that.data.user.nick_name + '&uimg=' + that.data.user.user_icon
        })
      }
      if (i == 17) {
        wx.navigateTo({
          url: '../../pageA/pages/coupon/couponlist',
        })
      }
      if (i == 18) {
        wx.navigateTo({
          url: '../../pageA/pages/prize/prize',
        })
      }
    }
  },
  jumpedit(){
    wx.navigateTo({
      url: 'mywallet/Modify information',
    })
  },
  go_stor() {
    var that = this
    wx.navigateTo({
      url: '../videos/storedetails?id=' + that.data.user.user_id,
    })
  },
  goselor(e) {
    wx.navigateTo({
      url: './sellerCenter/selorder?type=' + e.currentTarget.dataset.type,
    })
  },
  // 修改个人信息
  modify() {
    wx.navigateTo({
      url: 'mywallet/Modify information',
    })
  },
//点击事件结束
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.setData({
        isblock: '1',
        type:1
      })
    } else {
      that.onLoad()
      that.setData({
        type: 2
      })
    }
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
  // 帮助中心
  goread() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.helpcenter,
    })
  },
  // 卖家中心
  goseller() {
    let token = wx.getStorageSync('token');
    if (!token) {
      t.alert('请先登陆')
    } else {
      wx.navigateTo({
        url: 'sellerCenter/sellerC',
      })
    }
  },
  // 打开二维码
  openewm() {
    var that = this
    wx.showLoading({
      title: '加载图片中',
    })
    wx.request({
      url: app.api.shop_arcode + that.data.user.user_id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          ewm: b.data.data.qr_url,
        })
        wx.hideLoading()
      }
    })
    that.setData({
      v1: 'block'
    })
  },
  // 关闭
  closeewm() {
    var that = this
    that.setData({
      v1: 'none'
    })
  },
  // 保存图片到本地
  sav() {
    var that = this
    wx.downloadFile({
      url: that.data.ewm,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            t.alert('保存图片成功')
            that.setData({
              v1:'none'
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  } else {}
                }
              })
            }
          },
          complete(res) {}
        })
      }
    })
  },
  openpub() {
    var that = this
    that.setData({
      ispublish: '1'
    })
  },
  closepub() {
    var that = this
    that.setData({
      ispublish: '0'
    })
  },
  closepub1() {
    var that = this
    that.setData({
      ispublish: '0'
    })
    wx.navigateTo({
      url: '../shot/release',
    })
  },
  closepub2() {
    var that = this
    that.setData({
      ispublish: '0'
    })
    wx.navigateTo({
      url: '../shot/goods',
    })
  },
  goshopadmin(){
    wx.navigateTo({
      url: '../../pageA/pages/shopadmin/shopadmin',
    })
  },
  goapplycard(){
    let that=this
    wx.setStorage({
      key: "applyid",
      data: '0',
      success() {
        wx.navigateTo({
          url: '../../pageA/pages/applycard/applycard',
        })
        that.setData({
          v1: 'none'
        })
      }
    })
  },
  goreal(){
    let that=this
    wx.request({
      url: app.api.attestation,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode==204){
          wx.navigateTo({
            url: '../../pageA/pages/attestation/attest',
          })
        }else{
          let data = res.data.data
          if (data.status == 1) {
            wx.navigateTo({
              url: '../../pageA/pages/attestation/attestcenter',
            })
          }
          if (data.status == 2) {
            wx.navigateTo({
              url: '../../pageA/pages/attestation/attestsuccess',
            })
          }
          if (data.status == 3) {
            wx.navigateTo({
              url: '../../pageA/pages/attestation/attestfail',
            })
          }
        }
      }
    })
  },
  launchAppError(e) {
    console.log(e)
    if (e.detail.errMsg == 'invalid scene'){
      wx.navigateTo({
        url: '../download/download',
      })
    }
  },
  goload(){
    wx.navigateTo({
      url: '../download/download',
    })
  },
  // 提交form id
  formSubmit: function (e) {
    form.form(e.detail.formId)
  },
  go_live(){
    wx.navigateTo({
      url: '../../live/live/live',
    })
  },
  go_pay(){
    wx.navigateTo({
      url: '../../live/pay/pay',
    })
  },
  go_pay1(){
    wx.navigateTo({
      url: '../../live/livepusher/livepusher',
    })
  }
})