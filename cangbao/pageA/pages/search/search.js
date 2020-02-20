// pageA/pages/search/search.js
const app = getApp()
var relanding = require('../../../pages/common/relanding.js')
var t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    header:{},
    // 搜索记录原数据
    search:[],
    // 搜索记录截取数据
    searchs:[],
    label:1,
    value:'',
    list1:null,
    list2: null,
    list3: null,
    list4: null,
    list5: null,
    interval:'',
    endclock:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight
    })
    that.tokens()
    that.record()
  },
// 判断是否存在搜索记录
  record(){
    var that = this
    let search = wx.getStorageSync('search');
    if (!search) {}else{
      let json = []
      let l = search.length < 9 ? search.length:8
      for(let i=0;i<l;i++){
        let t=''
        if (String(search[i]).length>15){
          t = search[i].slice(0, 15)+'...'
        }else{
          t = search[i]
        }
        json.push(t)
      }
      that.setData({
        search: search,
        searchs:json
      })
    }
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
    const that=this
    clearInterval(that.data.interval);
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
      note:1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  // 点击搜索或完成触发
  search(e){
    let that=this
    
  },
  // 失去焦点触发
  bindblur(e){
    let that=this
    let v = t.javaTrim(e.detail.value.replace(/\n/g, ''));
    let json=that.data.search
    if (v==''){}else{
      if (json.length !== 0) {
        if (json.length <8){
          if (json.indexOf(v) == -1) {
            json.unshift(v)
            wx.setStorage({
              key: "search",
              data: json
            })
            that.record()
          }
        }else{
          if (json.indexOf(v) == -1) {
            json.pop()
            json.unshift(v)
            wx.setStorage({
              key: "search",
              data: json
            })
            that.record()
          }
        }
        
      } else {
        json.unshift(e.detail.value)
        wx.setStorage({
          key: "search",
          data: json
        })
        that.record()
      }
    }
  },
  // 键盘输入时触发
  bindinput(e){
    let that=this
    if (t.javaTrim(e.detail.value.replace(/\n/g, ''))==''){
      that.setData({
        label: 1,
        value: e.detail.value
      })
    }else{
      that.setData({
        label: 0,
        value: e.detail.value
      })
      clearInterval(that.data.interval);
      let v = t.code(e.detail.value)
      wx.request({
        url: app.api.newsearch + v,
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (b) {
          if (b.statusCode == 204) {

          } else {
            that.setData({
              list1: b.data.data.global_goods,
              list2: b.data.data.normal_goods,
              list3: b.data.data.auction_hall,
              list4: b.data.data.auction_house,
              list5: b.data.data.seller
            })
            if (b.data.data.auction_hall.count!==0){
              clearInterval(that.data.interval);
              that.inter(b)
            }else{
              clearInterval(that.data.interval);
            }
          }
        }
      })
    }
  },
  // 删除输入框内容
  del_val(){
    let that = this
    that.setData({
      label: 1,
      value:''
    })
  },
  // 删除搜索记录
  delsearch(){
    let that=this
    that.setData({
      search: [],
      searchs: [],
    })
    wx.setStorage({
      key: "search",
      data: []
    })
  },
  // 搜索历史点击
  searcho(e){
    let that=this
    that.setData({
      label: 0,
      value: e.currentTarget.dataset.id
    })
    clearInterval(that.data.interval);
    let v = t.code(e.currentTarget.dataset.id)
    wx.request({
      url: app.api.newsearch + v,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {} else {
          that.setData({
            list1: b.data.data.global_goods,
            list2: b.data.data.normal_goods,
            list3: b.data.data.auction_hall,
            list4: b.data.data.auction_house,
            list5: b.data.data.seller
          })
          if (b.data.data.auction_hall.count !== 0) {
            that.inter(b)
            
          } else {
            clearInterval(that.data.interval);
          }
        }
      }
    })
  },
  // 倒计时
  inter(b){
    const that=this
    that.data.interval = setInterval(function () {
      const storage = [];
      for (let i = 0; i < b.data.data.auction_hall.data.length; i++) {
        storage.push(
          t.countdown(b.data.data.auction_hall.data[i].start_time)
        )
      }
      that.setData({
        endclock: storage,
      })
    }, 1000)
  },
  // 结果页
  gonewpage(e){
    let that=this
    let url=''
    if (e.currentTarget.dataset.type=='1'){
      url = './newpage?v=' + that.data.value
    }
    if (e.currentTarget.dataset.type == '2') {
      url = './newpageo?v=' + that.data.value
    }
    if (e.currentTarget.dataset.type == '3') {
      url = './newpaget?v=' + that.data.value
    }
    if (e.currentTarget.dataset.type == '4') {
      url = './newpageh?v=' + that.data.value
    }
    if (e.currentTarget.dataset.type == '5') {
      url = './newpagef?v=' + that.data.value
    }
    wx.navigateTo({
      url: url,
    })
  },
  goglobalgoods(e){
    wx.navigateTo({
      url: '../../../pages/videos/global?id=' + e.currentTarget.dataset.id,
    })
  },
  gogoods(e) {
    wx.navigateTo({
      url: '../../../pages/videos/videos?id=' + e.currentTarget.dataset.id,
    })
  },
  goauction(e) {
    wx.navigateTo({
      url: '../../../pages/videos/auction?id=' + e.currentTarget.dataset.id,
    })
  },
  goauchouse(e) {
    wx.navigateTo({
      url: '../../../pages/videos/auction_house?id=' + e.currentTarget.dataset.id,
    })
  },
  gopersonal(e) {
    wx.navigateTo({
      url: '../../../pages/person/person?id=' + e.currentTarget.dataset.id,
    })
  },
})