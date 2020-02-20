const app = getApp()
const t = require('../../../pages/common/time.js')
const relanding = require('../../../pages/common/relanding.js')
const form = require('../../../pages/common/formid.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    height:'',
    ktime:'',
    imgh:'',
    id:'',
    det:null,
    desc:'',
    prize_images:[],
    endtime:'',
    // 单选标
    s1:'空',
    num:null,
    user:'',
    det_s:null,
    imgsrc:'',
    isimg:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      height:(wx.getSystemInfoSync().windowWidth-40)/3,
      imgh:wx.getSystemInfoSync().windowWidth-20,
      id:options.id
    })
    that.details()
    wx.showShareMenu({
      withShareTicket: true
    })
    // 接收推荐人id
    let u = options.share_id
    that.setData({
      user:u
    })
  },
  isimg(){
    const that=this
    that.setData({
      isimg:0
    })
  },
  isimgs(e){
    console.log(e)
    const that = this
    that.setData({
      isimg: 1,
      imgsrc:e.currentTarget.dataset.img
    })
  },
  // 提交form id
  formSubmit: function (e) {
    form.form(e.detail.formId)
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
    if (app.globalData.shareTicket!==undefined){
      that.vote_opportunity()
    }
    that.details()
    that.setData({
      s1: '空'
    })
  },
  vote_opportunity(){
    const that=this
    wx.login({
      success(b) {
        wx.getShareInfo({
          shareTicket: app.globalData.shareTicket,
          success: function (res) {
            console.log(res)
            wx.request({
              url: app.api.vote_opportunity,
              header: t.logintype(),
              data: {
                vote_id: that.data.id,
                user_id: that.data.user,
                wechat_code: b.code,
                iv: res.iv,
                encrypt_data: res.encryptedData
              },
              method: 'post',
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {

                } else if (res.statusCode == 401) {
                  relanding.relanding()
                  setTimeout(function () { that.vote_opportunity() }, 800)
                } else { }
              }
            })

          }
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
    const that=this
    const imgurl = that.data.det.cover;
    const num = imgurl.length - 8
    const imgurls = imgurl.substring(num, -1)
    const imageurl = imgurls + 'square_image'
    const user_id = t.shareuserid()
    const msg = ['来不及解释了，快来帮我一把！', '大奖免费送了，人人都有机会!','好友需要助力，快来帮TA!']
    const max = 0;
    const min = msg.length-1;
    const random = Math.random() * (max - min) + min;
    const sharetitle=msg[Math.round(random)]; 
    return {
      title:sharetitle,
      desc: '',
      path: 'pageA/pages/prize/prize_details?id=' + that.data.id + '&share_id=' + user_id,
      imageUrl: imageurl,
    }
  },
  // 数据
  details(){
    const that=this
    wx.request({
      url: app.api.vote_details + that.data.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          that.setData({
            det: b.data.data,
            endtime: t.daytime(b.data.data.end_time * 1000),
            ktime: t.daytime(b.data.data.lottery_time * 1000),
            prize_images: [b.data.data.prize_images],
            
          })
          if (b.data.data.question[0].images!==null){
            that.setData({
              imgsrc: b.data.data.question[0].images[0]
            })
          }
          let json=[]
          for (var i = 0; i < b.data.data.question.length;i++){
            json.push({v:[]})
            for (var i1 = 0; i1 < b.data.data.question[i].option.length; i1++){
              json[i].v.push({'state':0})
            }
          }
          
          that.setData({
            det_s:json
          })
        } else if (b.statusCode == 204) { } else if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.details()
          }, 800)
        } else {}
        wx.hideLoading()
      }
    })
  },
  
  // 点击事件
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  single_election(e) {
    const that = this
    console.log(e.currentTarget.dataset.ids, e.target.dataset.id)
    console.log(that.data.det_s[e.currentTarget.dataset.ids].v)
    for (var i = 0; i < that.data.det_s[e.currentTarget.dataset.ids].v.length; i++) {
      that.data.det_s[e.currentTarget.dataset.ids].v[i].state = 0
    }
    that.data.det_s[e.currentTarget.dataset.ids].v[e.target.dataset.id].state = 1
    that.setData({
      det_s: that.data.det_s
    })
  },
  // 查看图片
  previewImg1: function () {
    const that = this
    wx.previewImage({
      current: that.data.prize_images[0],
      urls: that.data.prize_images,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  vote(){
    const that = this
    const json = []
    const json1=[]
    const json2=[]
    for (var i = 0; i < that.data.det_s.length; i++) {
      for (var i1 = 0; i1 < that.data.det_s[i].v.length; i1++) {
        if (that.data.det_s[i].v[i1].state == 1) {
          let a = that.data.det.question[i].question_id
          let b = that.data.det.question[i].option[i1].id
          let c = a+':'+'['+b+']'
          json2[a]=[b]
          console.log(1)
        }
      }
    }
    console.log(json2)
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../grant/grant',
      })
    } else {
      wx.request({
      url: app.api.vote,
      data: {
        vote_id: that.data.det.vote_id,
        option:json2
      },
      method: 'post',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 200) {
          t.alert(b.data.message)
          that.details()
        } else if (b.statusCode == 422) {
          t.alert(b.data.message)
        } else { }
      }
    })
    }
  }
})