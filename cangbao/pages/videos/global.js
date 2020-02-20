// pages/videos/global.js
const app = getApp()
const common = require('../common/common.js')
const t = require('../common/time.js')
const relanding = require('../common/relanding.js')
const form = require('../common/formid.js')
const login = require('../common/login.js')
var QR = require("../../utils/qrcode.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    report: app.api.reportlist,
    template_loading:1,
    headtitle: '拍品详情',
    currentpage:1,
    recommend_list:null,
    template_name: "template_g",
    head_color:'rgba(255,255,255,0)',
    animation: '',
    look:'1',
    detailsstatus:1,
    ismodal:true,
    istop:'0',
    iscolumn:'0',
    currency_rate:'',
    is_evalss: '0',
    redprice: '../img/video/j-h.png',
    redprice1: '../img/video/a-j.png',
    contact: '',    // 客服
    collection: 0,    // 收藏(1显示 0隐藏)
    addprices: '',      // 出价价格
    range_price: '',    // 加价幅度
    total_sum: '',      // 总金额
    total_sum_rmb: '',  // 总金额(rmb)
    ispaybond: '1',
    paybondfonto: '一键出价',
    paybondfontt:'',
    paybondfonts: '',
    banlcenbond:'',
    bond:'',
    header: {
      "x-os": "wechat_mini",
      "x-app-version": app.api.edition,
      "content-type": "application/json",
      "cache-control": "private, must-revalidate"
    },
    now_rmb: '',    // 当前人民币价
    deposit_price: '',     // 保证金
    deposit_price_rmb: '', // 保证金(rmb)
    deposit_status: '', // 保证金状态
    start_time: '', // 竞拍时间
    clock: '',      // 结拍时间
    intervarID:null,
    mini_bidder:null,    // 简短-出价数组
    bidder_time:[],      // 简短-出价时间数组
    all_mini_bidder:null,  // 全部-出价数组
    all_bidder_time: [], // 全部-出价时间数组
    timeSpanStr1: '',
    page:'2',
    bid_count:'',
    start_rmb:'',
    // 折叠卡片参数
    details_hide: '2',  // 拍品详情
    process_hide: '2',  //竞买流程
    disrul_hide: '2',   //保证金规则
    prul_hide: '2',     //出价规则
    tip_hide: '1',     //注意事项
    tips_hide: '1',     //注意事项
    images:[],
    bondtk:'',
    disprmb:'',
    offer_rmb:'',
    scene: app.globalData.scene,
    openAPPurl:'',
    whethershare:0,
    whethereport:0,
    whetherposter: 0,
    showSharePic:'',
    sharePicUrl:'',
    coverimg: '',
    coversize: '',
    //免责open
    statement:0,
    Purchasingprocess:0,
    logistics:0,
    Bondshow:0,
    yBondshow: 0,
    ladder:0,
    entrust:0,
    creditlow:0,
    starttime:null,
    ladderul:null,
    swiper_style1:'',
    swiper_style2:'',
    select_s:null,
    isbond_img1:'../img/video/isbond_img1.png',
    isbond_img2: '../img/video/isbond_img2.png',
    isbond_img:'',
    era:'',
    bond_whether:'',
    result:'',
    insufficient:0
  },
  
  // 提交form id
  formSubmit: function (e) {
    form.form(e.detail.formId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      isbond_img: app.globalData.isbond_img,
      id: options.id,
    },()=>{
      that.details()
    })
    // 接收推荐人id
    let u = options.share_id
    if (options.share_id==undefined){
      u=''
    }
    if (u!==''){
      let s = wx.getStorageSync('share_id');
      if (!s) {
        t.share(options.share_id)
      } else {}
    }
  },
  // 拍品详情
  details(){
    var that=this
    wx.request({
      url: app.api.global_goods + that.data.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == '204'){
          if(that.data.ismodal==true){
            that.setData({
              ismodal: false
            })
            wx.showModal({
              content: '该拍品已下架',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#FF3740',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: -1
                  })
                } else if (res.cancel) {
                }
              }
            })
          }
        }else{
          const currency_rate = Number(a.data.data.currency_rate).toFixed(2)
          const p = a.data.data.now_price > 0 ? (a.data.data.now_price * a.data.data.currency_rate).toFixed(2) : (a.data.data.start_price * a.data.data.currency_rate).toFixed(2)
          const now_p = (a.data.data.start_price * a.data.data.currency_rate).toFixed(2)
          const as = a.data.data.goods_images.images_attr[that.data.currentpage-1]
          var proportion = ''
          var pheight = ''
          if (as.width > as.height) {
            var proportion = as.width / as.height
            var pheight = wx.getSystemInfoSync().windowWidth / proportion
          } else {
            var proportion = as.height / as.width
            var pheight = wx.getSystemInfoSync().windowWidth * proportion
          }
          if (250 > pheight || pheight==250) {
            const ct = (250 - pheight)/2
            that.setData({
              swiper_style1: 'height:250px;',
              swiper_style2: 'padding:'+ct+'px 0;box-sizing:border-box;'
            })
          }
          if (250 < pheight && pheight < 564) {
            that.setData({
              swiper_style1: 'height:' + pheight + 'px;',
              swiper_style2: ''
            })
          }
          if (pheight > 564) {
            const padding=(wx.getSystemInfoSync().windowWidth - (564 / as.height) * as.width)/2
            that.setData({
              swiper_style1: 'height:564px;',
              swiper_style2: 'padding:0 ' + padding + 'px 0;box-sizing:border-box;'
            })
          }
          that.setData({
            details: a.data.data,
            bid_count: a.data.data.bid_count,
            detailsstatus: a.data.data.status,
            start_time: t.formatDateTime(a.data.data.start_time * 1000),// 竞拍时间
            intervarID: setInterval(function () {                       // 结拍倒计时
              that.setData({
                clock: t.globaltimedown(a.data.data.end_time)
              })
            }, 1000),
            collection: a.data.data.event.is_collection,
            deposit_price: a.data.data.deposit_price,
            deposit_status: a.data.data.deposit_status,
            deposit_price_rmb: Math.round((a.data.data.deposit_price * a.data.data.currency_rate) * 100) / 100,
            openAPPurl: app.api.globalpage + a.data.data.goods_id,
            ladderul: a.data.data.auction.bid_rule,
            era: Math.round(a.data.data.guide_price/ 2),
            now_rmb: p,
            start_rmb: now_p,
            currency_rate: currency_rate,
            recommend_list: a.data.data.recommend_list
          },()=>{
            // 同场推荐
            const storage = [];
            let jsons = []
            for (let i = 0; i < a.data.data.recommend_list.length; i++) {
              storage.push(
                t.formatDateTime(a.data.data.recommend_list[i].start_time * 1000)
              )
              jsons.push({
                state: 0,
              })
            }
            that.setData({
              starttime: storage,
              select_s: jsons
            })
            // 出价记录
            that.mini_bidder()
            that.all_mini_bidder()
            that.setData({
              template_loading:0
            })
          })
          if (a.data.data.images == null) {
            that.setData({
              images: [a.data.data.cover]
            })
          } else {
            that.setData({
              images: a.data.data.images
            })
          }
          var price = a.data.data.now_price > 0 ? a.data.data.now_price : a.data.data.start_price
          if (a.data.data.now_price>0){
            that.setData({
              addprices: price + that.data.range_price
            }, () => {
              that.probability()
            })
          }else{
            if (a.data.data.start_price==0){
              that.setData({
                addprices: that.data.range_price
              }, () => {
                that.probability()
              })
            }else{
              that.setData({
                addprices: price
              }, () => {
                that.probability()
              })
            }
          }

          that.markup()
          that.total_sum()
          that.bondnum()
          that.ispaybond()
        }
      }
    })
  },
  //出价记录获取
  mini_bidder(){
    var that=this
    if (that.data.details.mini_bidder!==null){
      that.setData({
        mini_bidder: that.data.details.mini_bidder
      })
      var ttt1 = [];
      for (var h = 0; h < that.data.details.mini_bidder.length; h++) {
        let time = that.data.details.mini_bidder[h].create_time * 1000
        ttt1.push({
          t: t.getDatetime(time)
        })
      }
      that.setData({
        bidder_time: ttt1,
      })
    }
  },
  // 全部出价信息
  all_mini_bidder(){
    var that = this
    wx.request({
      url: app.api.all_offer + that.data.id+'/1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if(a.data!==''){
          that.setData({
            all_mini_bidder: a.data.data
          })
          var ttt1 = [];
          for (var h = 0; h < that.data.all_mini_bidder.length; h++) {
            let time = that.data.all_mini_bidder[h].create_time*1000
            ttt1.push({
              t:t.getDatetime(time)
            })
          }
          that.setData({
            all_bidder_time: ttt1,
          })
        }
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
    setTimeout(function () {
      that.localdetails()
    }, 200)
    if (app.globalData.bond_whether==0){
      that.setData({
        entrust:0
      })
    }else{
      that.setData({
        entrust: 1
      })
    }
    this.setData({
      scene: app.globalData.scene
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
    var that=this
    clearInterval(that.data.intervarID);
    that.setData({
      iscolumn:'0'
    })
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
  onShare(){
    this.onShareAppMessage()
  },
  /**
   * 用户点击右上角分享
   */
  //分享
  onShareAppMessage: function (r) {
    const that = this;
    const imgurl = that.data.details.cover;
    const num = imgurl.length - 8
    const imgurls = imgurl.substring(num, -1)
    const imageurl = imgurls + 'square_image'
    const user_id = t.shareuserid()
    return {
      title: that.data.details.title + '\n' + that.data.details.goods_note.title, // 转发后 所显示的title
      desc: that.data.details.goods_note.title,
      path: '/pages/videos/global?id=' + that.data.details.goods_id + '&share_id=' + user_id, // 相对的路径
      imageUrl: imageurl,
      success: (res) => {
        t.alert('分享成功')
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
          },
          fail: function (res) { },
          complete: function (res) { }
        })
      },
      fail: function (res) {
      }
    }
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  // 轮播图大小
  swiper_size(e){
    const that=this
    if (that.data.details.goods_images.images_attr == '' || that.data.details.goods_images.images_attr==0){

    }else{
      const a = that.data.details.goods_images.images_attr[e]
      var proportion = ''
      var pheight = ''
      if (a.width > a.height) {
        var proportion = a.width / a.height
        var pheight = wx.getSystemInfoSync().windowWidth / proportion
      } else {
        var proportion = a.height / a.width
        var pheight = wx.getSystemInfoSync().windowWidth * proportion
      }
      if (pheight < 250 || pheight == 250) {
        const ct = (250 - pheight)/2
        that.setData({
          swiper_style1: 'height:250px;',
          swiper_style2: 'padding:'+ct+'px 0;box-sizing:border-box;'
        })
      } 
      if (250 < pheight && pheight< 564) {
        that.setData({
          swiper_style1: 'height:' + pheight + 'px;',
          swiper_style2: ''
        })
      }
      if (pheight>564 ) {
        const padding = (wx.getSystemInfoSync().windowWidth - (564 / a.height) * a.width) / 2
        that.setData({
          swiper_style1: 'height:564px;',
          swiper_style2: 'padding:0 ' + padding+'px;box-sizing:border-box;'
        })
      }

    }
  },
  swiper(e){
    var that =this
    that.setData({
      currentpage: Number(e.detail.current)+1
    })
    that.swiper_size(e.detail.current)
  },
  previewImg: function (e) {
    var that = this
    var index = e.currentTarget.dataset.id;
    var imgArr = that.data.images;
    wx.previewImage({
      current: that.data.images[index],     
      urls: that.data.images,               
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'linear',
    })
  },
  onPageScroll: function (ev) {
    if (ev.scrollTop>0){
      this.animation.backgroundColor('#fff').step({
        duration: 500,                 
        timingFunction: 'linear',             
      })
      this.setData({
        animation: this.animation.export(),
        template_name: "template_o",
      })
    }else{
      this.animation.backgroundColor('rgba(255,255,255,0)').step({
        duration: 500,
        timingFunction: 'linear',
      })
      this.setData({
        animation: this.animation.export(),
        template_name: "template_g",
      })
    }
    if (ev.scrollTop > 100){
      this.setData({
        istop: '1'
      })
    }else{
      this.setData({
        istop: '0'
      })
    }
  },

  goTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.animation.backgroundColor('rgba(255,255,255,0)').step({
      duration: 500,
      timingFunction: 'linear',
    })
    this.setData({
      animation: this.animation.export(),
      template_name: "template_g",
    })
  },
  goauction(){
    var that=this
    wx.navigateTo({
      url: '../videos/auction?id=' + that.data.details.auction.id,
    })
  },
  goauction_house(){
    var that = this
    wx.navigateTo({
      url: '../videos/auction_house?id=' + that.data.details.user.user_id,
    })
  },
  tpis1(){
    var that=this
    wx.showModal({
      title:'拍卖行佣金',
      content:'提示：竞拍成功后，部分拍品会收取VAT费（即附加税）, 具体数值以该拍品的成交价为准。',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#FF3740',
      success: function (res) {
        if (res.confirm) {} else if (res.cancel) {}
      }
    })
  },
  tpis2() {
    wx.showModal({
      content: '平台截止出价时间为竞拍时间 前12小时',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#FF3740',
      success: function (res) {
        if (res.confirm) {} else if (res.cancel) {}
      }
    })
  },
  look1(){
    let that=this
    that.setData({
      look:'2'
    })
  },
  look2() {
    let that = this
    that.setData({
      look: '1'
    })
  },
  //购买登陆
  btn_sub: function () {
    var that = this
    login.userLogin()
  },
  // 登陆判断
  button() {
    let that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {

    }
  },
  closecolumn(){
    this.setData({
      iscolumn: '0'
    })
    this.localdetails()
  },
  opencolumn() {
    this.setData({
      iscolumn: '1'
    })
  },
  
  addoffer() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
      setTimeout(function () {
        that.localdetails()
      }, 1500) 
    } else {
      that.setData({
        iscolumn:'1',
        redprice: '../img/video/j-h.png'
      })
      that.localdetails()
    }
  },
  offer(){
    var that=this
    wx.showModal({
      title: '确定出价',
      cancelColor:'#1C1C1C',
      confirmColor:'#1C1C1C',
      content: that.data.offer_rmb + '元' + '(' + that.data.details.currency_symbol+that.data.addprices+')',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            iscolumn: '0'
          })
          wx.request({
            url: app.api.globalbidder,
            data: {
              goods_id: that.data.details.goods_id,
              offer_price: that.data.addprices
            },
            method: "post",
            header: t.logintype(),
            success(res) {
              if (res.statusCode == 200) {
                that.setData({
                  entrust:1
                })
                that.localdetails()
                that.all_mini_bidder()
                that.mini_bidder()
              }
              if (res.statusCode == 422) {
                t.alert(res.data.message)
              }
              if (res.statusCode == 401) {
                relanding.relanding()
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  goread() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.bondrule,
    })
  },
  goxieyi(){
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.globalrule,
    })
  },
  goglobal_ball(){
    var that = this
    if (that.data.isbond_img==0){
      wx.showModal({
        title: '确定出价',
        cancelColor: '#1C1C1C',
        confirmColor: '#F44336',
        content: that.data.offer_rmb + '元' + '(' + that.data.details.currency_symbol + that.data.addprices + ')\n' + '(' + that.data.bondtk + ')',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              iscolumn: '0'
            })
            wx.navigateTo({
              url: '../buybond/global_ball?id=' + that.data.details.goods_id + '&price=' + that.data.disprmb + '&rmbprice=' + that.data.total_sum_rmb + '&payprice=' + that.data.addprices + '&paypricetype=' + that.data.details.currency_symbol + '&paypricermb=' + '￥' + that.data.offer_rmb,
            })
          } else if (res.cancel) { }
        }
      })
    }else{
      if (that.data.details.deposit_account >= that.data.bond - that.data.details.paid_deposit){
        that.setData({
          insufficient:1
        })
      }else{
        that.setData({
          creditlow: 1
        })
      }
    }
  },
  // 保证金账户余额不足
  insufficient(e){
    const that = this
    const id = e.currentTarget.dataset.type
    if(id==0){
      that.setData({
        insufficient: 0
      })
    }else{
      wx.login({
        success(res) {
          wx.request({
            url: app.api.global_bond_pay,
            data: {
              goods_id: that.data.id,
              pay_type: 'other',
              wechat_code: res.code,
              bid_amount: that.data.total_sum_rmb,
              bid_price: that.data.addprices
            },
            method: 'post',
            header: t.logintype(),
            success: function (res) {
              if (res.data.status_code == 200) {
                that.localdetails()
                that.setData({
                  iscolumn: '0',
                  entrust: 1,
                  insufficient: 0
                })
              } else if (res.data.status_code == 422) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })

              } else { }
            },
          })
        }
      })
    }
  },
  // 去充值or缴纳实时保证金
  creditlow_o(e){
    const that=this
    const id=e.currentTarget.dataset.type
    if(id==0){
      that.setData({
        iscolumn: '0',
        creditlow: 0,
      })
      wx.navigateTo({
        url: '../my/mywallet/bondrech?type=3'
      })
    }else{
      that.setData({
        iscolumn: '0',
        creditlow:0,
      })
      app.globalData.isbond_img=0
      wx.navigateTo({
        url: '../buybond/global_ball?id=' + that.data.details.goods_id + '&price=' + that.data.disprmb + '&rmbprice=' + that.data.total_sum_rmb + '&payprice=' + that.data.addprices + '&paypricetype=' + that.data.details.currency_symbol + '&paypricermb=' + '￥' + that.data.offer_rmb,
      })
    }
  },
  closecreditlow_o(e){
    const that = this
    that.setData({
      creditlow: e.currentTarget.dataset.type
    })
  },
  close_evalss(){
    var that=this
    that.setData({
      is_evalss:'0'
    })
  },
  open_evalss() {
    var that = this
    that.setData({
      is_evalss:'1'
    })
    that.all_mini_bidder()
  },
  // 是否需要缴纳保证金
  ispaybond(){
    if (this.data.details.deposit_status === 2) {
      this.setData({
        ispaybond: '1',
        paybondfonto:'一键出价',
        paybondfontt:'',
        bondtk:'需缴纳保证金'+this.data.bond+'元',
        banlcenbond: '需缴纳保证金' + this.data.bond + '元',
        paybondfonts: '需缴纳保证金' + this.data.bond + '元',
        
        disprmb: this.data.bond
      })
    }
    if (this.data.details.deposit_status === 3) {
      if ((this.data.bond - this.data.details.paid_deposit) > 0) {
        this.setData({
          ispaybond:'1',
          paybondfonto: '一键出价',
          paybondfontt: '需补缴保证金￥' +(this.data.bond - this.data.details.paid_deposit)+'元',
          paybondfonts: '需补缴保证金' + (this.data.bond - this.data.details.paid_deposit) + '元',
          banlcenbond: '需缴纳保证金' + (this.data.bond - this.data.details.paid_deposit) + '元',
          bondtk: '需补缴保证金' + (this.data.bond - this.data.details.paid_deposit) + '元',
          disprmb: this.data.bond - this.data.details.paid_deposit
        })
      } else {
        this.setData({
          ispaybond: '0',
          paybondfonto: '一键出价',
          paybondfonts: '已缴保证金' + parseFloat(this.data.details.paid_deposit) + '元',
          bondtk:''
        })
      }
    }
  },
  //计算进得概率
  probability() {
    var that = this
    var price = Number(that.data.addprices)
    var min = Number(that.data.details.guide_price)
    var max = Number(that.data.details.guide_price_max)
    var min21 = Math.round(that.data.details.guide_price / 2)
    var max2 = Math.round(that.data.details.guide_price_max * 2)
    if (min!==0){
      if (price <= min21) {
        that.setData({
          result: 1
        })
      } 
      if (min21 < price && price <= min) {
        that.setData({
          result: 2
        })
      } 
      if (min < price && price <= max) {
        that.setData({
          result: 3
        })
      } 
      if (max < price && price <= max2) {
        that.setData({
          result: 4
        })
      }  
      if (max2 < price) {
        that.setData({
          result: 5
        })
      } 
    }
  },
  // 保证金计算
  bondnum() {
    let price = Math.ceil(this.data.total_sum_rmb)
    const p = this.data.details.auction.deposit_rate*1000
    let num = Math.ceil(price / p)
    this.setData({
      bond: num * 1000,
    })
  },
  // 加价幅度计算
  markup(){
    var that=this 
    var price = that.data.details.now_price > 0 ? that.data.details.now_price : that.data.details.start_price
    const rule = that.data.details.auction.bid_rule
    rule.forEach(function (val, index, rule) {
      if (price >= rule[index].threshold) {
        that.setData({
          range_price: rule[index].inc
        })
      } else {
        return;
      }
    });
  },
  // 加价幅度计算
  markups() {
    var that = this
    var price = that.data.addprices
    const rule = that.data.details.auction.bid_rule
    rule.forEach(function (val, index, rule) {
      if (price >= rule[index].threshold){
        that.setData({
          range_price: rule[index].inc
        })
      }else{
        return;
      }
    });
  },
  total_sum(){
    var that=this
    that.setData({
      total_sum: Math.round((that.data.addprices + (that.data.addprices * (that.data.details.goods_note.service / 100)) + (that.data.addprices * (that.data.details.goods_note.commission/100)))*100)/100,
      total_sum_rmb: t.toFixed(2, ((that.data.addprices + (that.data.addprices * (that.data.details.goods_note.service / 100)) + (that.data.addprices * (that.data.details.goods_note.commission / 100))) * that.data.details.currency_rate)),
      offer_rmb:(that.data.addprices * that.data.details.currency_rate).toFixed(2)
    })
  },
  // 输入额度限制
  addprices_input(e){
    var that=this
    if (t.isNumber(e.detail.value)==true){
      that.setData({
        addprices: Number(e.detail.value)
      },()=>{
        const rule = that.data.details.auction.bid_rule
        var prices = that.data.details.now_price > 0 ? that.data.details.now_price: that.data.details.start_price
        var range_price=''
       
        rule.forEach(function (val, index, rule) {
          if (prices >= rule[index].threshold) {
            that.setData({
              range_price: rule[index].inc
            })
            range_price = rule[index].inc
          } else {
            return;
          }
        });
        var price = that.data.details.now_price > 0 ? that.data.details.now_price + that.data.range_price : that.data.details.start_price + that.data.range_price
        var value = Number(e.detail.value)
        if (that.data.details.now_price>0){
          if (value < price) {
            const p = that.data.details.now_price > 0 ? that.data.details.now_price : that.data.details.start_price
            that.setData({
              addprices: p
            }, () => {
              that.markups()
              const ps = that.data.details.now_price > 0 ? that.data.details.now_price + that.data.range_price : that.data.details.start_price + that.data.range_price
              that.setData({
                addprices: ps,
                redprice: '../img/video/j-h.png',
              })
              that.total_sum()
              that.bondnum()
              that.ispaybond()
              that.probability()
            })
          } else {
            that.setData({
              addprices: value,
              redprice: '../img/video/j-j.png',
            }, () => {
              that.markups()
              that.total_sum()
              that.bondnum()
              that.ispaybond()
              that.probability()
            })
          }
        }else{
          var sp = that.data.details.start_price > 0 ? that.data.details.start_price : range_price
          if (value < sp) {
            that.setData({
              addprices: sp
            }, () => {
              that.markups()
              that.setData({
                addprices: sp,
                redprice: '../img/video/j-h.png',
              })
              that.total_sum()
              that.bondnum()
              that.ispaybond()
              that.probability()
            })
          } else {
            that.setData({
              addprices: value,
              redprice: '../img/video/j-j.png',
            }, () => {
              that.markups()
              that.total_sum()
              that.bondnum()
              that.ispaybond()
              that.probability()
            })
          }
        }
        
      })
      
      
    }else{
      wx.showModal({
        title: '提示',
        content: '非法字符，请填入正确价格',
        showCancel:false,
        success(res) {
          if (res.confirm) {
            that.setData({
              addprices: that.data.addprices
            })
          } else if (res.cancel) {
            
          }
        }
      })
    }
    
  },
  // 加价按钮
  addp() {
    var that = this
    var price = that.data.addprices
    if (Number(price) + that.data.range_price<=99999999){
      that.markups()
      that.setData({
        addprices: that.data.addprices + that.data.range_price,
        redprice: '../img/video/j-j.png',
        redprice1: '../img/video/a-j.png',
      },()=>{
        that.probability()
      })
      that.markups()
      that.total_sum()
      that.bondnum()
      that.ispaybond()
      if (that.data.addprices > Number(price) + that.data.range_price) {
        that.setData({
          redprice: '../img/video/j-j.png',
        },()=>{
          that.probability()
        })
      }
      that.bondnum()
      that.ispaybond()
    }else{}
    
  },
  
  // 减价幅度计算
  markups_s() {
    var that = this
    var price = that.data.addprices
    const rule = that.data.details.auction.bid_rule
    rule.forEach(function (val, index, rule) {
      var r_price=''
      var indexs=''
      if (price >= rule[index].threshold) {
        r_price = rule[index].inc
        indexs=index
      } else {
        return r_price,index;
      }
      if (price - r_price >= rule[indexs].threshold){
        that.setData({
          range_price: r_price
        })
      }else{
        var t = indexs>0?indexs-1:0
        that.setData({
          range_price: rule[t].inc
        })
      }
      
    });
  },
  // 减价按钮
  redp(){
    const that = this
    that.markups_s()
    setTimeout(function(){
      const price = that.data.details.now_price > 0 ? that.data.details.now_price : that.data.details.start_price
      const addprices = that.data.addprices
      const range_price = that.data.range_price
      var r_price = ''
      const rule = that.data.details.auction.bid_rule
      rule.forEach(function (val, index, rule) {
        if (price >= rule[index].threshold) {
          r_price = rule[index].inc
        } else {
          return r_price;
        }
      });
      if(that.data.details.now_price>0){
        if (addprices - range_price > price + r_price) {
          that.setData({
            addprices: that.data.addprices - range_price,
          })
        } else {
          if (that.data.addprices - that.data.range_price <= price + r_price) {
            that.setData({
              addprices: price + r_price,
              redprice: '../img/video/j-h.png'
            })
          }
        }
      }else{
        const bprice = that.data.details.start_price > 0 ? that.data.details.start_price : r_price
        if (addprices - range_price > bprice) {
          that.setData({
            addprices: that.data.addprices - range_price,
          })
        } else {
          if (that.data.addprices - that.data.range_price <= bprice) {
            that.setData({
              addprices: bprice,
              redprice: '../img/video/j-h.png'
            })
          }
        }
      }
      
      that.total_sum()
      that.bondnum()
      that.ispaybond()
      that.probability()
    },200)
    
  },
  // 收藏
  collect() {
    const that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: that.data.details.goods_id,
        type: "3"
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            collection: '1'
          })
          t.alert(a.data.message)
        } else if (a.statusCode == 422) {
          t.alert(a.data.message)
        }
        else {
          relanding.relanding()
          setTimeout(function () {
            that.collect()
          }, 1000)
        }
      }
    })
  },
  //取消收藏
  offcollect() {
    const that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: that.data.details.goods_id,
        type: "3"
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            collection: '0'
          })
          t.alert(a.data.message)
        } else if (a.statusCode == 422) {
          t.alert(a.data.message)
        } else {
          relanding.relanding()
          setTimeout(function () {
            that.offcollect()
          }, 1000)
        }
      }
    })
  },
  //上拉触底
  onReachBottom1: function () {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.api.all_offer + that.data.id + '/' + that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.data == '') {
          t.alert('没有更多')
        } else {
          const list = that.data.all_mini_bidder;
          for (let i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          that.setData({
            all_mini_bidder: that.data.all_mini_bidder,
            page: that.data.page + 1
          })
          wx.hideLoading();
          const ttt1 = [];
          for (var h = 0; h < that.data.all_mini_bidder.length; h++) {
            const time = that.data.all_mini_bidder[h].create_time * 1000
            ttt1.push({
              t: t.getDatetime(time)
            })
          }
          that.setData({
            all_bidder_time: ttt1,
          })
        }
      }
    })
  },
// 卡片折叠
  // 拍品详情
  fold_o(e){
    var that=this
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        details_hide:2,
      })
    }
    if (id == 2) {
      that.setData({
        details_hide: 1,
      })
    }
  },
  // 竞买流程
  fold_t(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        process_hide: 2,
      })
    }
    if (id == 2) {
      that.setData({
        process_hide: 1,
      })
    }
  },
  // 保证金规则
  fold_h(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        disrul_hide: 2,
      })
    }
    if (id == 2) {
      that.setData({
        disrul_hide: 1,
      })
    }
  },
  // 出价规则
  fold_f(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        prul_hide: 2,
      })
    }
    if (id == 2) {
      that.setData({
        prul_hide: 1,
      })
    }
  },
  // 注意事项
  fold_i(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        tip_hide: 2,
      })
    }
    if (id == 2) {
      that.setData({
        tip_hide: 1,
      })
    }
  },
  // 注意事项
  fold_s(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        tips_hide: 2,
      })
    }
    if (id == 2) {
      that.setData({
        tips_hide: 1,
      })
    }
  },
  kefu() {
    let token = wx.getStorageSync('token');
    if (!token) {
      t.alert('请先登陆')
    } else {}
  },
  launchAppError(e) {
    if (e.detail.errMsg == 'invalid scene') {
      wx.navigateTo({
        url: '../download/download',
      })
    }
  },
  closeshare(){
    const that=this
    that.setData({
      whethershare:0
    })
  },
  openshare() {
    const that = this
    that.setData({
      whethershare: 1
    })
  },
  copylink(){
    const that=this
    const a = that.data.details
    t.copylink(a, app.api.url_globalgoods)
    that.closeshare()
  },
  closereport(){
    const that = this
    that.setData({
      whethereport: 0
    })
  },
  openreport(){
    const that = this
    that.setData({
      whethereport: 1,
      whethershare: 0
    })
  },
  report(e){
    const that=this
    const reason_id=e.currentTarget.dataset.id
    const mix_id=that.data.details.goods_id
    t.report(reason_id, mix_id)
    that.closereport()
  },
  closeposter(){
    const that = this
    that.setData({
      whetherposter: 0
    })
  },
  poster(){
    const that=this
    that.closeshare()
    //显示/生成分享海报
    if (that.data.sharePicUrl==''){
      wx.showLoading({
        title: '生成海报中',
      })
      const shareFrends = wx.createCanvasContext('shareFrends')
      const a = that.data.details
      let url = app.api.url_globalgoods + a.goods_id+ '&share_id=' + t.shareuserid()
      QR.api.draw(url, 'canvascode', 76, 76);
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          fileType: 'jpg',
          quality: 1,
          width: 76 * 2,
          height: 76 * 2,
          destWidth: 76 * 2,
          destHeight: 76 * 2,
          canvasId: 'canvascode',
          success: function (res) {
            var tempFilePath = res.tempFilePath
            wx.downloadFile({
              url: a.cover,
              success: res => {
                var path = res.tempFilePath
                that.setData({
                  coverimg: path
                })
                setTimeout(function () {
                  t.drawImg(a, that.data.coversize, shareFrends, tempFilePath, path, 1).then(res => {
                    that.setData({
                      sharePicUrl: res.tempFilePath
                    })
                    setTimeout(function () { wx.hideLoading() }, 300)
                  })
                }, 500)
              }
            })
          },
          fail: function (res) {}
        });
      }, 500)
    }
    that.setData({
      whetherposter: 1
    })
  },
  bindload(e) {
    const that = this
    that.setData({
      coversize: e.detail
    })
  },
  // 保存海报
  saveimg(){
    const that=this
    t.saveimg(that.data.sharePicUrl)
    that.closeposter()
  },
  // 免责声明
  statement(e){
    const that=this
    that.setData({
      statement: e.currentTarget.dataset.type
    })
  },
  // 竞买流程
  Purchasingprocess(e){
    this.setData({
      Purchasingprocess: e.currentTarget.dataset.type
    })
  },
  // 物流运输
  logistics(e) {
    this.setData({
      logistics: e.currentTarget.dataset.type
    })
  },
  // 保证金
  Bondshow(e) {
    this.setData({
      Bondshow: e.currentTarget.dataset.type
    })
  },
  // 佣金
  yBondshow(e) {
    this.setData({
      yBondshow: e.currentTarget.dataset.type
    })
  },
  // 进价阶梯
  ladder(e){
    this.setData({
      ladder: e.currentTarget.dataset.type
    })
  },
  // 保证金支付成功
  entrust(e){
    app.globalData.bond_whether = 0
    this.setData({
      entrust: e.currentTarget.dataset.type
    })
  },
  go_global(e) {
    wx.navigateTo({
      url: '../videos/global?id=' + e.currentTarget.dataset.id,
    })
  },
  isbondimg(e) {
    app.globalData.isbond_img = e.currentTarget.dataset.type
    this.setData({
      isbond_img: e.currentTarget.dataset.type
    })
  },
  // 收藏
  collects(e) {
    var that = this
    that.button()
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: e.currentTarget.dataset.id,
        type: "3"
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
          that.data.select_s[e.currentTarget.dataset.ids].state = 1
          that.setData({
            select_s: that.data.select_s
          })
        } else if (a.statusCode == 422) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        else {
          relanding.relanding()
          setTimeout(function () {
            that.collect()
          }, 1000)
        }
      }
    })
  },
  //取消收藏
  offcollects(e) {
    var that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: e.currentTarget.dataset.id,
        type: "3"
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else if (a.statusCode == 422) {
          wx.showToast({
            title: a.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else {
          relanding.relanding()
          setTimeout(function () {
            that.offcollect()
          }, 1000)
        }
        that.data.select_s[e.currentTarget.dataset.ids].state = 0
        that.setData({
          select_s: that.data.select_s
        })
      }
    })
  },
  preventTouchMove(){},
  // 局部刷新
  localdetails() {
    var that = this
    wx.request({
      url: app.api.global_goods + that.data.id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == '204') {
          if (that.data.ismodal == true) {
            that.setData({
              ismodal: false
            })
            wx.showModal({
              content: '该拍品已下架',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#FF3740',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: -1
                  })
                } else if (res.cancel) {
                }
              }
            })
          }
        } else {
          const currency_rate = Number(a.data.data.currency_rate).toFixed(2)
          const p = a.data.data.now_price > 0 ? (a.data.data.now_price * a.data.data.currency_rate).toFixed(2) : (a.data.data.start_price * a.data.data.currency_rate).toFixed(2)
          const now_p = (a.data.data.start_price * a.data.data.currency_rate).toFixed(2)
          that.setData({
            details: a.data.data,
            bid_count: a.data.data.bid_count,
            detailsstatus: a.data.data.status,
            collection: a.data.data.event.is_collection,
            deposit_price: a.data.data.deposit_price,
            deposit_status: a.data.data.deposit_status,
            deposit_price_rmb: Math.round((a.data.data.deposit_price * a.data.data.currency_rate) * 100) / 100,
            ladderul: a.data.data.auction.bid_rule,
            era: Math.round(a.data.data.guide_price / 2),
            now_rmb: p,
            start_rmb: now_p,
            currency_rate: currency_rate
          }, () => {
            // 出价记录
            that.mini_bidder()
            that.all_mini_bidder()
            that.setData({
              template_loading: 0
            })
          })
          var price = a.data.data.now_price > 0 ? a.data.data.now_price : a.data.data.start_price
          if (a.data.data.now_price > 0) {
            that.setData({
              addprices: price + that.data.range_price
            }, () => {
              that.probability()
            })
          } else {
            if (a.data.data.start_price == 0) {
              that.setData({
                addprices: that.data.range_price
              }, () => {
                that.probability()
              })
            } else {
              that.setData({
                addprices: price
              }, () => {
                that.probability()
              })
            }
          }
          that.markup()
          that.total_sum()
          that.bondnum()
          that.ispaybond()
        }
      }
    })
  },
})