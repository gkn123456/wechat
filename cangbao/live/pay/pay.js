const app = getApp()
const common = require('../../pages/common/common.js')
const relanding = require('../../pages/common/relanding.js')
const t = require('../../pages/common/time.js')
const login = require('../../pages/common/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    headtitle:'付费开通直播',
    selection:0,
    month:0,
    sty:false,
    price:0,
    paymode:null,
    paytype:'',
    m:null,
    termofvalidity:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.expiry_type()
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
    const that=this
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
  // 支付方式
  paytype(){
    const that=this
    wx.request({
      url: app.api.pay_type + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (c) {
        that.setData({
          paymode: c.data.data
        })
        var json=c.data.data
        for(let i=0;i<json.length;i++){
          if(json[i].default==1){
            that.setData({
              paytype: c.data.data[i].pay_mark
            })
          }
        }
        const balance = c.data.data[0].amount
        if (Number(that.data.price) <= Number(balance)) {
          that.setData({
            isrecharge: 0
          })
        } else {
          that.setData({
            isrecharge: 1
          })
        }
      }
    })
  },
  // 单选点击
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
  },
  // 续费类型
  expiry_type(){
    const that=this
    wx.request({
      url: app.api.expiry_type,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          if(res.data.data.expiry_time!==0){
            that.setData({
              termofvalidity:t.timejson(res.data.data.expiry_time*1000)
            })
          }
          var json=res.data.data
          for(let i=0;i<json.expiry_type.length;i++){
            json.expiry_type[i].state=0
          }
          that.setData({
            m: json
          })
        } else {
          that.setData({
            m: null
          })
        }
      }
    })
  },
  choice(e){
    const that=this
    const m=that.data.m
    if( m.expiry_type[e.currentTarget.dataset.id].state==1){
      m.expiry_type[e.currentTarget.dataset.id].state=0
      that.setData({
        m:m,
        month:0,
        price:0
      })
    }else{
      for(let i=0;i<m.expiry_type.length;i++){
        m.expiry_type[i].state=0
      }
      that.setData({
        m:m
      },()=>{
        m.expiry_type[e.currentTarget.dataset.id].state=1
        that.setData({
          m:m,
          price:m.expiry_type[e.currentTarget.dataset.id].now_price,
          month:m.expiry_type[e.currentTarget.dataset.id].duration
        })
      })
      
    }
  },
  selection(e) {
    const that = this
    that.setData({
      selection: Number(e.currentTarget.dataset.type)
    })
  },
  goxy(){
    wx.navigateTo({
      url: '../../pages/my/Agreement/Agreement?src=' + app.api.transport,
    })
  },
  openpay(){
    const that=this
    if(that.data.selection!==0&&that.data.month!==0){
      that.setData({
        sty:true
      })
    }
    that.paytype()
  },
  close(){
    const that=this
    that.setData({
      sty:false
    })
  },
  // 支付
  ispay() {
    var that = this
    if (that.data.paytype == 'balance') {
      that.determinepay()
    } else {
      if (that.data.price> 5) {
        that.setData({
          quota: 1
        })
      } else {
        that.determinepay()
      }
    }
  },
  // 关闭限额弹框
  closequota(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    if (id == 0) {
      that.setData({
        quota: 0
      })
      that.determinepay()
    } if (id == 1) {
      that.setData({
        quota: 0
      })
      that.goquota()
    }
    if (id == 2) {
      that.setData({
        quota: 1
      })
    }
    if (id == 3) {
      that.setData({
        quota: 0
      })
    }
  },
  // 跳转充值界面
  gorecharge() {
    this.close()
    wx.navigateTo({
      url: '../../pages/my/mywallet/rech?type=2',
    })
  },
  determinepay(){
    const that=this
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
        wx.request({
          url: app.api.live_expiry,
          data: {
            pay_type: that.data.paytype,
            wechat_code: that.data.code,
            duration:that.data.month
          },
          method: 'post',
          header: t.logintype(),
          success: function (res) {
            if (res.data.status_code == 500) {
              t.alert(res.data.message)
            } else {
              if (that.data.paytype == "balance") {
                if (res.data.status_code !== 200) {
                  t.alert(res.data.message)
                }
                else {
                  that.close()
                  wx.redirectTo({
                    url: 'success',
                  })
                }
              } else {
                console.log(res.data.data)
                form.prepay(res.data.data.wechat_mini.package.substring(10, res.data.data.wechat_mini.package.length))
                if (res.data.status_code !== 200) {
                  t.alert(res.data.message)
                }
                else if (res.data.status_code == 200) {
                  if (that.data.flag == true) {
                    wx.requestPayment({
                      timeStamp: res.data.data.wechat_mini.timeStamp,
                      nonceStr: res.data.data.wechat_mini.nonceStr,
                      package: res.data.data.wechat_mini.package,
                      signType: 'MD5',
                      paySign: res.data.data.wechat_mini.paySign,
                      success(rs) {
                        that.setData({
                          flag: false
                        })
                        that.close()
                        wx.redirectTo({
                          url: 'success',
                        })
                      },
                      fail(d) { }
                    })
                  }

                }
              }
            }
          },
        })
      }
    })
  },
  // 跳转支付限额说明
  goquota() {
    wx.navigateTo({
      url: '../../pages/my/Agreement/Agreement?src=' + app.api.quota,
    })
  },
  // 跳转开通记录
  record(){
    wx.navigateTo({
      url: '../record/record'
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