// pages/my/mybond/mybond.js
const app = getApp()
const t = require('../../common/time.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    price:'',
    bonddetails:[],
    page:2,
    cdd:[],
    navH: '',
    navHs:'',
    headtitle: '我的保证金',
    kb_nav:[
      { id: 0, 'n': '实时保证金'}, { id: 1, 'n': '保证金账户' }
    ],
    kbcd:0,
    cbond_num:null,
    cashmode:[
      { 'type': '0', 'name': '钱包', 'text': '立即到账', 'checked': 'true' }, { 'type': '1', 'name': '银行卡', 'text': '', 'checked': '' }
    ],
    paytype:0,
    pageScroll:0,
    cashframe:0,
    user:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // 冻结金额获取
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight+3
    })
    wx.request({
      url: app.api.frozendeposit,
      data: {},
      method: 'get',
      header:t.logintype(),
      success: function (a) {
        that.setData({
          price: a.data.data.amount,
        })
      }
    })
    // 保证金列表获取
    that.cbond()
    that.cbond_num()
  },
  cbond(){
    const that=this
    const p = this.data.kbcd == 0 ? 'column/' :'ledger/'
    wx.request({
      url: app.api.depositlist+p + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          that.setData({
            bonddetails: null
          })
        }
        if (b.statusCode == 200) {
          that.setData({
            bonddetails: b.data.data,
          })
          if (that.data.bonddetails !== undefined) {
            var bonddetails1 = [];
            for (var i = 0; i < that.data.bonddetails.length; i++) {
              bonddetails1.push({
                id: i,
                text: t.formatDateTime(that.data.bonddetails[i].completion_time * 1000)
              })
              that.setData({
                cdd: bonddetails1,
              })
            }
          }
        }
      }
    })
  },
  // 保证金账户
  cbond_num(){
    const that=this
    wx.request({
      url: app.api.bondaccount_details,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          that.setData({
            cbond_num: b.data.data,
          })
        }else{}
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
      url: '../../index/index',
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
    const that=this
    wx.request({
      url: app.api.user,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          user: b.data.data,
        })
      }
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
    wx.removeStorageSync("bonddetails1")
    
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
    var that=this
    var page=0
    wx.showLoading({
      title: '加载中',
    })
    const p = this.data.kbcd == 0 ? 'column/' : 'ledger/'
    // 保证金列表获取
    wx.request({
      url: app.api.depositlist + p + that.data.page,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          t.alert('没有更多')
        } if (b.statusCode == 200) {
          var moment_list = that.data.bonddetails;
          for (var i = 0; i < b.data.data.length; i++) {
            moment_list.push(b.data.data[i]);
          }
          // 设置数据  
          that.setData({
            bonddetails: that.data.bonddetails,
            page: Number(that.data.page) + 1
          })
          if (that.data.bonddetails !== undefined) {
            var bonddetails1 = [];
            for (var i = 0; i < that.data.bonddetails.length; i++) {
              bonddetails1.push({
                id: i,
                text: t.formatDateTime(that.data.bonddetails[i].completion_time * 1000),
              })
            }
            that.setData({
              cdd: bonddetails1
            })
          }
          // 隐藏加载框  
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
  switch_nav(e){
    this.setData({
      kbcd: e.currentTarget.dataset.type,
      page:2
    },()=>{
      this.cbond()
      this.top()
    })
    if (e.currentTarget.dataset.type==1){
      this.cbond_num()
    }
  },
  go_bondc(){
    wx.navigateTo({
      url: '../mywallet/bondrech?type=2',
    })
  },
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
  },
  opencashframe(){
    const that = this
    that.setData({
      cashframe: 1,
      paytype:0
    })
  },
  close_bondcash(e){
    const that = this
    that.setData({
      cashframe: e.currentTarget.dataset.type
    })
  },
  gobondcash(){
    const that=this
    if (that.data.paytype==0){
      that.setData({
        cashframe: 0
      })
      // 提现到钱包
      wx.navigateTo({
        url: '../mywallet/bondcash_o',
      })
    }else{
      // 提现到银行卡
      if (that.data.user.is_pay_password == 1) {
        if (that.data.user.is_real_name == 1) {
          that.setData({
            cashframe: 0
          })
          wx.navigateTo({
            url: '../mywallet/bondtobank',
          })
        } else {
          wx.navigateTo({
            url: '../mywallet/realname',
          })
        }
      }else{
        wx.navigateTo({
          url: '../mywallet/proving',
        })
      }
    }
  },
  //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    const that = this
    if (ev.scrollTop>=147){
      that.setData({
        pageScroll:1
      })
    }else{
      that.setData({
        pageScroll: 0
      })
    }
  },
  // 滚动到顶部
  top(){
    const that=this
    wx.pageScrollTo({
      scrollTop: 0
    })
    that.setData({
      pageScroll: 0
    })
  },
  gomybond(e){
    if (e.currentTarget.dataset.type==1){
      wx.navigateTo({
        url: '../mybond/budget?id=' + e.currentTarget.dataset.id,
      })
    }
  }
})