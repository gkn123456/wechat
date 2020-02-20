const app = getApp()
const relanding = require('../../pages/common/relanding.js')
const login = require('../../pages/common/login.js')
const t = require('../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    message:[],
    num:[],
    num1:[],
    chat:[],
    number:0,
    hotgoods:null,
    goods1:null,
    goods2:null,
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const userid = wx.getStorageSync('login_userid')
    const token = wx.getStorageSync('token');
    // 登陆调用身份验证
    app.globalData.socket.emit('login',{
      token:'bearer ' +token
    });
    app.globalData.socket.on('fail',function(data){
      var a=that.data.message
      a.push(data.message)
      that.setData({
        message:a
      })
    });
    app.globalData.socket.on('error',function(data){
      var a=that.data.message
      a.push(data.message)
      that.setData({
        message:a
      })
    });
    app.globalData.socket.on('start_live',function(data){
      var a=that.data.message
      a.push('推流地址:'+data.publish_url+'(直播间已经开通，可以开始直播)')
      that.setData({
        message:a
      })
    });
    app.globalData.socket.on('people_list',function(data){
      var a=[]
      for(let i=0;i<data.list.length;i++){
        a.push(data.list[i].user_name)
      }
      that.setData({
        num:a,
        num1:data.list
      })
    });
    app.globalData.socket.on('radio_chat',function(data){
      var a=that.data.chat
      a.push(data.nick_name+':'+data.message)
      that.setData({
        chat:a
      })
    });
    app.globalData.socket.on('bidder_auction',function(data){
      var a=that.data.chat
      a.push(data.nick_name+':出价'+data.offer_price+'元')
      that.setData({
        chat:a
      })
    });
    
    app.globalData.socket.on('people_join',function(data){
      var a=that.data.chat
      a.push('欢迎 '+data.user_name)
      that.setData({
        chat:a
      })
    });
    app.globalData.socket.on('peoples_num',function(data){
      that.setData({
        number:data.number
      })
    });
    
    app.globalData.socket.on('follow', function (data) {
      var a=that.data.chat
      a.push(data.message)
      that.setData({
        chat:a
      })
    })
    app.globalData.socket.on('hot_auction_goods', function (data) {
      if(data.goods_id!==0){
        that.setData({
          hotgoods:data
        })
      }else{
        that.setData({
          hotgoods:null
        })
      }
    })
    app.globalData.socket.on('auction_goods', function (data) {
      that.setData({
        goods1:data
      })
    })
    app.globalData.socket.on('fixed_goods', function (data) {
      that.setData({
        goods2:data
      })
    });
  },
  input(e){
    const that=this
    that.setData({
      title:e.detail.value
    })
  },
  create_room(){
    const that=this
    if(that.data.title!==''){
      app.globalData.socket.emit('create_room',{
        title:that.data.title,
        type:1,
        cover:'https://images.cangbaopai.com/Fvhosxm-6Ek8o3b0YRXJkdOBGooi-nweicxce'
      })
    }
  },
  create_hotgoods(){
    const that=this
    app.globalData.socket.emit('publish_goods',{
      title:'翡翠',
      cover:'https://images.cangbaopai.com/Fvhosxm-6Ek8o3b0YRXJkdOBGooi-nweicxce',
      type:5,
      cate_id:12,
      return:1,
      start_price:666,
      range_price:20,
      deposit_price:0,
      end_time:30,
      order:1
    })
  },
  xf(){
    const that=this
    console.log(that.data.num)
    wx.showActionSheet({
      itemList: that.data.num,
      success (res) {
        console.log(res.tapIndex)
        app.globalData.socket.emit('send_order',{
          user_id:that.data.num1[res.tapIndex].user_id,
          goods_id:that.data.goods2[0].goods_id,
          goods_num:1
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  create_fixgoods(){
    const that=this
    const userid = wx.getStorageSync('login_userid')
    app.globalData.socket.emit('publish_goods',{
      
      title:'黄花梨手串',
      cover:'https://images.cangbaopai.com/Fvhosxm-6Ek8o3b0YRXJkdOBGooi-nweicxce',
      type:4,
      cate_id:12,
      return:1,
      start_price:666,
      sell_price:145,
      range_price:0,
      deposit_price:0,
      end_time:0,
      order:1,
      stock:22
    })
  },
  start(){
    const that=this
    app.globalData.socket.emit('start_auction',{
      goods_id:that.data.hotgoods.goods_id
    })
  },
  hottop(e){
    const that=this
    console.log(e)
    app.globalData.socket.emit('recommend_goods',{
      goods_id:Number(e.currentTarget.dataset.id),
      action:Number(e.currentTarget.dataset.hot)>0?0:1,
      type:Number(e.currentTarget.dataset.type)
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
    app.globalData.socket.emit('leave')
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
  Emptyfunction(){},
  back() {
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