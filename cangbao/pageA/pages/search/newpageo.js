// pageA/pages/search/newpage.js
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
    page: 2,
    cate: null,
    top:'',
    top1: app.globalData.navHeight + 96,
    height: wx.getSystemInfoSync().windowHeight - app.globalData.navHeight-96,
    sort1:0,
    sort2:0,
    sort3:0,
    sortpage1: [{ type: 'playcount', state: '0', name: '浏览最高' }, { type: 'priceasc', state: '0', name: '价格最低' }, { type: 'pricedesc', state: '0', name: '价格最高' }],
    sortpage2: [{ type: '', state: '0', name: '默认排序' }, { type: 'newest', state: '0', name: '最近上拍' }, { type: 'soonend', state: '0', name: '即将结束' }],
    sortpage3: [{ type: '', state: '0', name: '全部' }, { type: 'oldgoods', state: '0', name: '老货' }, { type: 'crafts', state: '0', name: '工艺品' }, { type: 'zero', state: '0', name: '0元起' }, { type: 'refund', state: '0', name: '包退' }],
    sortname1:'价格',
    sortname2:'时间',
    sortname3:'筛选',
    // 导航标示 zero：拍卖页面--0元起 oldgoods 老货 crafts 工艺品 refund 包退
    mark:'',
    // 价格排序规则 pricedesc 价格最高 priceasc 价格最低 playcount 浏览最高
    price_sort:'',
    // 时间排序规则 newest 最近上拍 soonend 即将结束
    time_sort:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      top: app.globalData.navHeight+36,
      top1: app.globalData.navHeight + 96,
      value:options.v
    })
    that.tokens()
    setTimeout(function () {
      that.list()
    }, 300)
  },
  // 是否有登陆态
  tokens() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.setData({
        header: {
          "x-os": "wechat_mini",
          "x-app-version": app.api.edition,
          "content-type": "application/json",
          "cache-control": "private, must-revalidate"
        },
      })
    } else {
      wx.getStorage({
        key: 'token',
        success(r) {
          that.setData({
            header: {
              "Authorization": 'bearer ' + r.data,
              "x-os": "wechat_mini",
              "x-app-version": app.api.edition,
              "content-type": "application/json",
              "cache-control": "private, must-revalidate"
            },
            token: 'bearer ' + r.data,
          })
        }
      })
    }
  },
  // 获取查询数据
  list() {
    const that = this
    const n = t.code(that.data.value)
    wx.request({
          url: app.api.normal + n + '&mark=' + that.data.mark + '&price_sort=' + that.data.price_sort + '&time_sort=' + that.data.time_sort+'&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 204) {
          that.setData({
            cate: null
          })

        } else {
          that.setData({
            cate: a.data.data
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    that.tokens()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    that.tokens()
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
    const that = this
    that.tokens()
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    wx.showLoading({
      title: '加载中'
    })
    const n = t.code(that.data.value)
    wx.request({
      url: app.api.normal + n + '&mark=' + that.data.mark + '&price_sort=' + that.data.price_sort + '&time_sort=' + that.data.time_sort+'&page='+that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.data == '') {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } else {
          var moment_list = that.data.cate;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          // 设置数据  
          that.setData({
            cate: that.data.cate,
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
      note: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  go_video(e) {
    wx.navigateTo({
      url: '../../../pages/videos/videos?id=' + e.currentTarget.dataset.id,
    })
  },
  // 筛选
  close(){
    const that = this
    that.setData({
      sort1: 0,
      sort2: 0,
      sort3: 0
    })
  },
  open(e){
    const that = this
    const id = e.currentTarget.dataset.id
    if(id==1){
      that.setData({
        sort1: 1,
        sort2: 0,
        sort3: 0
      })
    }
    if (id ==2) {
      that.setData({
        sort1:0,
        sort2:1,
        sort3: 0
      })
    }
    if (id == 3) {
      that.setData({
        sort1: 0,
        sort2: 0,
        sort3: 1
      })
    }
  },
  sort1(e){
    const that=this
    const id = e.currentTarget.dataset.id
    
    if(id==0&&that.data.sortname1!=='价格'){
      that.setData({
        sort1: 1,
        sort2: 0,
        sort3: 0
      })
    }else{
      that.setData({
        sort1: e.currentTarget.dataset.id,
        sort2: 0,
        sort3: 0
      })
    }
  },
  sort2(e){
    const that = this
    const id = e.currentTarget.dataset.id
    
    if (id == 0 && that.data.sortname1 !== '时间') {
      that.setData({
        sort2: 1,
        sort1: 0,
        sort3: 0
      })
    }else{
      that.setData({
        sort2: e.currentTarget.dataset.id,
        sort1: 0,
        sort3: 0
      })
    }
  },
  sort3(e){
    const that = this
    const id = e.currentTarget.dataset.id
    that.setData({
      sort3: e.currentTarget.dataset.id,
      sort2: 0,
      sort1:0
    })
  },
  sorts1(e){
    const that = this
    const id = e.currentTarget.dataset.id
    const json = that.data.sortpage1
    const type = e.currentTarget.dataset.type
    const name = e.currentTarget.dataset.name
    that.setData({
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname1: name,
      price_sort: type
    })
    for (let i = 0; i < json.length; i++) {
      that.data.sortpage1[i].state = 0
    }
    that.data.sortpage1[id].state = 1
    that.setData({
      sortpage1: that.data.sortpage1
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  sorts2(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    const json = that.data.sortpage2
    const type = e.currentTarget.dataset.type
    const name = e.currentTarget.dataset.name
    that.setData({
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname2: name,
      time_sort: type
    })
    for (let i = 0; i < json.length; i++) {
      that.data.sortpage2[i].state = 0
    }
    that.data.sortpage2[id].state = 1
    that.setData({
      sortpage2: that.data.sortpage2
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  sorts3(e) {
    const that = this
    const json = that.data.sortpage3
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type
    const name = e.currentTarget.dataset.name
    if(id==0){
      if (that.data.sortpage3[0].state == 1){
        for (let i = 0; i < json.length; i++) {
          that.data.sortpage3[i].state = 0
        }
      }else{
        for (let i = 0; i < json.length; i++) {
          that.data.sortpage3[i].state = 0
        }
        that.data.sortpage3[0].state = 1
      }
      that.setData({
        mark: ''
      })
    }else{
      that.data.sortpage3[0].state = 0
      if (that.data.sortpage3[id].state == 1) {
        that.data.sortpage3[id].state = 0
        that.setData({
          sortpage3: that.data.sortpage3
        })
        that.data.mark = ''
        for (let i = 0; i < that.data.sortpage3.length; i++) {
          if (that.data.sortpage3[i].state == 1){
            let s = that.data.mark == '' ? that.data.sortpage3[i].type : that.data.mark + ',' + that.data.sortpage3[i].type
            that.setData({
              mark: s
            })
          }else{

          }
        }
      }else{
        that.data.sortpage3[id].state = 1
        that.setData({
          sortpage3:that.data.sortpage3
        })
        if (that.data.mark.indexOf(that.data.sortpage3[id].type) == -1) {
          let s = that.data.mark == '' ? that.data.sortpage3[id].type : that.data.mark + ',' + that.data.sortpage3[id].type
          that.setData({
            mark: s
          })
        } else {

        }
      }
      
    }
    
    that.setData({
      sortpage3: that.data.sortpage3
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  }
})