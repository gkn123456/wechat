// pages/classify/classify.js
const app = getApp()
const t = require('../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    headtitle: '分类',
    // 滑动所需要变量
    class:null,
    classid: '-1',
    classid1:'0',
    class1:null,
    all_clss:null,
    scrollTop: 0,    //滚动的值
    winHeight:'',
    winWidth:'',
    toView:'',
    curId:'0',
    toView1:'',
    toView2:'',
    ids:'1',
    goodstitle:'0',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var winWidth = sysInfo.windowWidth;
    this.setData({
      winHeight: winHeight,
      winWidth: winWidth
    })
    that.obtain_class()
    that.classify_home()
  },
// 获取分类
  obtain_class(){
    let that=this
    if(that.data.classid!==-1){
      wx.request({
        url: app.api.category,
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (b) {
          that.setData({
            class: b.data.data,
          })
        }
      })
    }else{
      that.setData({
        class: null,
      })
      that.classify_home()
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
  //全球拍
  classify_home() {
    var that = this
    wx.request({
      url: app.api.category + '?type=2',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          class1: b.data.data[0].children
        })
        let clss = []
        let all_clss = []
        for (let i = 0; i < that.data.class1.length; i++) {
          for (let i1 = 0; i1 < that.data.class1[i].children.length; i1++) {
            clss.push(that.data.class1[i].children[i1])
            all_clss.push({ name: that.data.class1[i].children[i1].cate_name, id: that.data.class1[i].children[i1].cate_id })
          }
        }
        that.setData({
          all_clss: all_clss
        })
      }
    })
  },
  //右边导航栏锚点跳转
  setScrollTop: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      curId: id,
      toView: id,
    })
  },
  setScrollTop3(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      curId: id,
      toView: id,
      toView1: id,
      goodstitle:'0'
    })
  },
  is_title(){
    this.setData({
      goodstitle: '1'
    })
  },
  is_title1() {
    this.setData({
      goodstitle: '0'
    })
  },
  setScrollTop1(e){
    this.setData({
      curId: e.currentTarget.dataset.id,
      toView1: e.currentTarget.dataset.id,
    })
  },
  setScrollTop2(e) {
    this.setData({
      classid: e.currentTarget.dataset.id,
      toView2: e.currentTarget.dataset.id,
    })
  },
  // 添加分类
  tapClassify: function (e) {
    var that = this
    that.setData({
      classid: e.currentTarget.dataset.id,
      toView: e.currentTarget.dataset.id,
    })
    if (e.currentTarget.dataset.id==-1){
      that.setData({
        ids:'1',
      })
      that.setData({
        classid: e.currentTarget.dataset.id,
        toView: e.currentTarget.dataset.id,
      })
    }else{
      that.setData({
        ids: '0',
      })
      that.setData({
        classid: e.currentTarget.dataset.id,
        toView: e.currentTarget.dataset.id,
      })
    }
  },
  // 拍品分类跳转
  classify_jump(e){
    wx.navigateTo({
      url: '../../pageA/pages/classifypage/classifypage?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  // 拍品分类跳转(全球拍)
  global_classify_jump(e) {
    wx.navigateTo({
      url: '../../pageA/pages/classifypage/globalclass?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    })
  },
})