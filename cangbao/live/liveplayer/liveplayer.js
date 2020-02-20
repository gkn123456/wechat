const app = getApp()
const relanding = require('../../pages/common/relanding.js')
const login = require('../../pages/common/login.js')
const t = require('../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform:'',
    // abite immediate
    deposit_goods_id:'',
    auctionstype:'',
    newtips:1,
    is_new:'',
    is_privatechat:false,
    private_chatinpt:'',
    is_login:false,
    login_active:false,
    live_id:'',
    room_number:0,
    room:null,
    order_details:null,
    order_wait_list:null,
    liveorder_countTime:'',
    liveordertime:'',
    live_order:null,
    order_type:0,
    waitorder:null,
    user_name:'',
    last_into_viewer:null,
    paymode:null,
    paytype:'',
    deposit_paytype:'',
    is_paytype:false,
    is_deposit:false,
    isrecharge:0,
    isrecharge_s:0,
    is_paysues:false,
    address:null,
    address_sign:0,
    region: ['请', '选', '择'],
    customItem: '全部',
    provincecode: '',
    citycode: '',
    area: '',
    address_default:0,
    editoradd:1,
    name: '',
    phone: '',
    content: '',
    roomfollow:0,
    seller:null,
    goodslist:[],
    goodslist_now:[],
    timedowm_list:[],
    bidder_success:null,
    bidder_hotgoods_title:'',
    bidder_nick_name:'',
    listdown:'',
    hot_auction_goods:null,
    hotdoods_title:'',
    interception:false,
    // 三秒倒计时
    paydowncount:3,
    count:3,
    order_id:0,
    //十秒结拍时间戳
    timestamp_down:1576551046,
    hot_auction_goods_price:'',
    // 十秒倒计时显示隐藏
    is_countTime: false,
    //十秒结拍倒计时
    countdown_tiepat: {
      'h': 0,
      'm': 0,
      's': 0,
      'ms': 0
    },
    onewaitorder_time:'',
    orderd_time_down:'',
    wait_time_down:'',
    waitorder_time:'',
    bidder_name:'',
    bidder_price:0,
    s:'',
    active:true,
    active_shop:false,
    active_popup_offer: false,
    active_popup_follow: false,
    is_shop:false,
    is_popup_offer:false,
    is_popup_follow:false,
    is_popup_follows:false,
    is_process:true,
    Successfulauction:false,
    is_input:false,
    countdown:false,
    countdown_s:false,
    is_biteview:false,
    is_active_biteview:false,
    is_Closingorder:false,
    is_active_sellview:false,
    is_orderList:false,
    is_orderLists:false,
    isplace:false,
    is_newplace:false,
    navH: app.globalData.navHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    top_height:app.globalData.navHeight+60,
    topstyle:'',
    shopnav: [{ 'id': 0, 'type': '拍卖', 'num': 0, 'path': '' }, { 'id': 1, 'type': '一口价', 'num': 0, 'path': ''}],
    shopnav_sign:0,
    animation:'',
    animation_price:'',
    is_animation_price: 0,
    animation_deal:'',
    animation_deal_rotate:'',
    timer:null,
    i:'',
    is_deal: 0,
    name:'',
    notice:'',
    animation_notice:'',
    user_icon:'../img/usericons.png',
    chatinpt:'',
    chat:[
    ],
    chatips:[],
    chatview:['多少钱','666','我要这个','放个漏儿呗','货不错'],
    switch_set:false,
    scrolltop:'',
    // 变量
    // 出价按钮状态(0立即出价 1正在出价 2已出价)
    Bid_button_status:0,
    Bids_button_status:false,
    // 实时拍品保证金
    offer_deposit:false,
    offer_deposits:0,
    // 立即出价加价幅度
    price_range:10,
    // 当前商品id
    now_goodsid:0,
    // 当前价
    now_price:10,
    now_payprice:10,
    reduceon:false,
    // 一口价购买商品id
    abite_goods_id:'',
    // 一口价购买商品数量
    abite_goods_num:1,
    // 当前支付一口价商品下标
    abite_goods_indx:''
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
  //点击触发登陆
  btn_sub: function () {
    const that = this
    login.userLogin()
    setTimeout(function(){
      that.tokens()
    },1000)
  },
  loginbtn(){
    const that = this
    login.userLogin()
    that.setData({
      login_active:false 
    },()=>{
      setTimeout(function(){
        that.setData({
          is_login:false
        })
      },300)
    })
    setTimeout(function(){
      that.tokens()
    },1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    wx.getSystemInfo({
      success (res) {
        if(res.platform == "devtools"){
          t.alert('pc')
          that.setData({
            platform:'pc'
          })
        }else if(res.platform == "ios"){
            t.alert('IOS')
            that.setData({
              platform:'ios'
            })
        }else if(res.platform == "android"){
          t.alert('android')
          that.setData({
            platform:'android'
          })
        }
      }
    })
    that.address()
    that.paytype()
    that.isnew()
    that.setData({
      live_id: options.id,
    },()=>{
      that.liveinfo()
      that.tokens()
      // 15秒后弹出关注主播弹窗
      setTimeout(function(){
        if (that.data.roomfollow==0){
          that.popup_follow()
        }
      },15000)
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
    // 两分钟显示平台提示词
    that.cueword()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const that=this
    app.globalData.socket.emit('leave')
    clearInterval(that.data.listdown)
    clearInterval(that.data.s)
    clearInterval(that.data.waitorder_time)
    clearInterval(that.data.onewaitorder_time)
    
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
  
  //视频出现缓冲时触发
  bindwaiting(e){
    console.log('缓冲')
  },
  binderror(e){
    console.log('出错')
  },
  // 确认登陆状态
  tokens() {
    var that = this
    let token = wx.getStorageSync('token');
    if (token) {
      // 登陆调用身份验证
      app.globalData.socket.emit('login',{
        token:'bearer ' +token
      });
    }
  },
  // 是否首次进入(新手引导)
  isnew(){
    var that = this
    let newtip = wx.getStorageSync('newtip');
    if (newtip) {
      that.setData({
        is_new:false
      })
    }else{
      that.setData({
        is_new:true
      })
    }
  },
  //Socket 创建连接
  _setup() {
    const that = this
    const userid = wx.getStorageSync('login_userid')
    // 加入直播间
    app.globalData.socket.emit('join_room',{
      room_id:that.data.room.user_id
    });
    app.globalData.socket.on('fail', function (data) {
      if(data.ac==0){
        t.alert(data.message)
      }
      if(data.ac==1){
        wx.showModal({
          showCancel:false,
          content:data.message,
          success (res) {
            if (res.confirm) {
            } else if (res.cancel) {}
          }
        })
      }
    });
    app.globalData.socket.on('cloud_control', function (data) {
      const ch=that.data.chatips
      ch.push(data.announcement)
      ch.push(data.authTips)
      that.setData({
        chatips:ch
      })
      const c=that.data.chat
      for(let i=0;i<2;i++){
        if(i==0){
          c.push({
            type: 2, 
            content:data.announcement
          })
        }else{
          c.push({
            type: 2, 
            content: data.authTips
          })
        }
      }
      that.setData({
        chat:c
      })
    });
    app.globalData.socket.on('close_room', function () {
      wx.showModal({
        showCancel:false,
        content:'直播间已关闭',
        success (res) {
          if (res.confirm) {
            that.back()
          } else if (res.cancel) {}
        }
      })
    });
    app.globalData.socket.on('deposit_pay', function (data) {
      that.setData({
        deposit_goods_id:data.goods_id
      },()=>{
        if(that.data.hot_auction_goods.goods_id==that.data.deposit_goods_id){
          that.setData({
            offer_deposit:data.is_pdp
          })
        }else{
          that.setData({
            offer_deposit:false
          })
        }
      })
    });
    app.globalData.socket.on('success', function (data) {
      t.alert(data.message)
    });
    app.globalData.socket.on('follow_success', function (data) {
      t.alert(data.message)
      that.setData({
        roomfollow: 1,
        is_popup_follow: false,
        active_popup_follow: false
      })
    });
    app.globalData.socket.on('peoples_num', function (data) {
      that.setData({
        room_number:data.number
      })
    });
    app.globalData.socket.on('radio_chat', function (data) {
      var chat = that.data.chat
      if(that.data.chat.length>99){
        that.data.chat.shift()
      }
      chat = that.data.chat
        chat.push({
          type: 1, 
          name:data.nick_name,
          content: data.message
        })
        that.setData({
          chat: that.data.chat
        },()=>{
          that.scrolltop()
          that.setData({
            chatinpt:''
          })
        })
    });
    app.globalData.socket.on('bidder_auction', function (data) {
      var chat = that.data.chat
      if(that.data.chat.length>99){
        that.data.chat.shift()
      }
      chat = that.data.chat
      chat.push({
        type:3, 
        name:data.nick_name,
        content:'出价'+ data.offer_price+'元'
      })
      that.setData({
        chat: that.data.chat
      },()=>{
        that.scrolltop()
        that.setData({
          chatinpt:''
        })
      })
      that.setData({
        bidder_name:data.nick_name,
        bidder_price:data.offer_price
      },()=>{
        that.isprice()
      })
    });
    // 出价通知，包括：用户正在付款，用户付款成功
    app.globalData.socket.on('notice', function (data) {
      if(that.data.chat.length>99){
        that.data.chat.shift()
      }
      const chat = that.data.chat
      chat.push({
        type:4, 
        content:data.message
      })
      that.setData({
        chat: that.data.chat
      },()=>{
        that.scrolltop()
        that.setData({
          chatinpt:''
        })
      })
    })
    app.globalData.socket.on('forbidden_viewer', function (data) {
      t.alert(data.message)
    })
    app.globalData.socket.on('follow', function (data) {
      if(that.data.chat.length>99){
        that.data.chat.shift()
      }
      const chat = that.data.chat
      chat.push({
        type:5, 
        content:data.message
      })
      that.setData({
        chat: that.data.chat
      },()=>{
        that.scrolltop()
      })
    })
    // 等待付款信息
    app.globalData.socket.on('wait_pay', function (data) {
      that.setData({
        waitorder:data
      })
      if(data.wait_pay_order_count>0){
        that.setData({
          is_orderLists:true
        })
        that.data.waitorder_time=setInterval(function(){
          that.setData({
            wait_time_down:t.countTime(data.end_pay_time)
          })
          if (t.countTime(data.end_pay_time).h == '00' &&t.countTime(data.end_pay_time).m == '00' && t.countTime(data.end_pay_time).s1 == 0 && t.countTime(data.end_pay_time).ms == 0) {
            clearInterval(that.data.waitorder_time)
            app.globalData.socket.emit('update_order')
          }
        },1000)
      }else{
        that.setData({
          is_orderLists:false
        })
        clearInterval(that.data.waitorder_time)
      }
    })
    // 拍卖列表
    app.globalData.socket.on('auction_goods', function (data) {
      if(data==null){
        that.setData({
          goodslist_now:[]
        },()=>{
          that.calculation_num()
        })
      }else{
        that.setData({
          goodslist_now:data
        },()=>{
          that.calculation_num()
        })
        clearInterval(that.data.listdown)
        that.data.listdown=setInterval(function(){
          const json=[]
          for(let i=0;i<data.length;i++){
            json.push(
              t.countTime(data[i].end_time)
            )
          }
          that.setData({
            timedowm_list:json
          })
        },1000)
      }
    });
    // 一口价列表 
    app.globalData.socket.on('fixed_goods', function (data) {
      if(data==null){
        that.setData({
          goodslist:[]
        },()=>{
          that.calculation_num()
        })
      }else{
        that.setData({
          goodslist:data
        },()=>{
          that.calculation_num()
        })
      }
    });
    // 接收热推拍品
    app.globalData.socket.on('hot_auction_goods', function (data) {
      const hgoods=that.data.hot_auction_goods
      console.log(hgoods)
      if(data.goods_id!==0){
        if(data.type==4){
          that.setData({
            countdown:false,
            countdown_s:true
          })
          if(hgoods!==null){
            if(hgoods.type==5){
              that.data.goodslist_now[0].order=0
              that.setData({
                goodslist_now:that.data.goodslist_now
              })
            }
          }
        }
        if(data.type==5){
          that.setData({
            countdown:true,
            countdown_s:false
          })
          if(data.deposit_price>0){
            if(data.goods_id==that.data.deposit_goods_id){
              that.setData({
                offer_deposit:data.is_pdp
              })
            }else{
              that.setData({
                offer_deposit:false
              })
            }
          }
          if(hgoods!==null){
            if(hgoods.type==4){
              that.data.goodslist[0].order=0
              that.setData({
                goodslist:that.data.goodslist
              })
            }
          }
        }
        var p=data.now_price>0?data.now_price.toString():data.start_price.toString()
        var t=data.title.toString()
        that.setData({
          hot_auction_goods:data,
          hot_auction_goods_price:p.length>6?p.slice(0,6)+'...':p,
          hotdoods_title:t.length>9?t.slice(0,9)+'...':t,
          offer_deposits: data.deposit_price,
          // 立即出价加价幅度
          price_range: data.range_price,
          // 当前价
          now_goodsid:data.goods_id,
          now_price: data.now_price > 0 ? Number(data.now_price) + Number(data.range_price) : Number(data.start_price) + Number(data.range_price),
          now_payprice: data.now_price > 0 ? Number(data.now_price) + Number(data.range_price) : Number(data.start_price) + Number(data.range_price),
        })
        if(data.status==0){
          const json=data.end_time<60?{
            h:'00',
            m:'00',
            s:data.end_time
          }:{
            h:'00',
            m:(data.end_time/60)>9?data.end_time/60:'0'+(data.end_time/60),
            s:'00'
          }
          that.setData({
            countdown_tiepat:json
          })
        }
        if(data.status==4||data.status==5){
          that.setData({
            interception:false
          })
          clearInterval(that.data.s)
        }
        if(data.status==1||data.status==2||data.status==0){
          that.setData({
            interception:false
          })
        }
        if(data.status==1||data.status==2){
          clearInterval(that.data.s)
          that.setData({
            timestamp_down: data.end_time
          },()=>{
            that.countTime()
          })
          if(Number(data.bid_user_id)!==Number(userid)){
            that.setData({
              Bid_button_status:0
            })
          }else{
            that.setData({
              Bid_button_status:2
            })
          }
        }
      }else{
        that.setData({
          hot_auction_goods:null,
          countdown:false,
          countdown_s:false
        })
      }
    });
    // 直播间进入新观众
    app.globalData.socket.on('people_join', function (data) {
      that.setData({
        name: data.user_name
      })
      that.animation = wx.createAnimation({
        duration: 1500,
        timingFunction: 'linear',
      })
      that.animation.translateX(0).opacity(1).step()
      that.setData({
        animation: that.animation.export()
      },()=>{
        setTimeout(function () {
          that.animation.translateX('-200px').opacity(0).step()
          that.setData({
            animation: that.animation.export(),
            name:''
          })
        }, 4500)
      })
    });
    // auction_success	拍品成交通知
    app.globalData.socket.on('auction_success',function(data){
      const titles=data.title.toString()
      const name=data.bidder_nick_name
      that.setData({
        interception:false,
        bidder_success:data,
        bidder_hotgoods_title:titles.length>7?titles.slice(0,7)+'...':titles,
        bidder_nick_name:name.length>7?name.slice(0,7)+'...':name,
      },()=>{
        that.setData({
          order_id:Number(userid)==Number(data.bidder_user_id)?data.order_id:0
        },()=>{
          that.deal()
        })
      })
    })
    // 接收流拍等信息
    app.globalData.socket.on('auction_fail',function(data){
      // notice
      that.setData({
        notice: data.title+'已流拍',
        interception:false
      })
      that.animation = wx.createAnimation({
        duration: 1500,
        timingFunction: 'linear',
      })
      that.animation.translateX(0).opacity(1).step()
      that.setData({
        animation_notice: that.animation.export()
      },()=>{
        setTimeout(function () {
          that.animation.translateX('-200px').opacity(0).step()
          that.setData({
            animation_notice: that.animation.export()
          },()=>{
            that.setData({
              notice: ''
            })
          })
        }, 10000)
      })
    })
    // 接收卖家发单(that.is_Closingorder())
    app.globalData.socket.on('send_order', function (data) {
      that.setData({
        order_id:data.order_id
      },()=>{
        that.lookorder()
      })
    });
    // 检测未登录（登录弹窗）
    app.globalData.socket.on('not_login', function (data) {
      that.setData({
        is_login:true
      },()=>{
        that.setData({
          login_active:true 
        })
      })
    });
  },
  // 购物车拍品数量
  calculation_num(){
    const that=this
    that.setData({
      shoppingnum:Number(that.data.goodslist.length)+Number(that.data.goodslist_now.length)
    })
  },
  // 发送聊天信息
  sendchat(e){
    const that = this
    let v = t.javaTrim(e.detail.value.replace(/\n/g, ''));
    if(v!==''){
      that.setData({
        chatinpt: v
      })
    }
  },
  send_chatview(e){
    const that = this
    that.setData({
      chatinpt: e.currentTarget.dataset.message,
      is_input:false
    },()=>{
      that.send()
    })
  },
  send: function () {
    const that=this
    if(that.data.chatinpt!==''){
      const json={
        message:that.data.chatinpt
      }
      app.globalData.socket.emit('speak_chat', json);
      that.setData({
        is_input:false
      })
    }
  },
  // 私聊主播
  privatechat(){
    const that=this
    that.setData({
      is_privatechat:!that.data.is_privatechat,
      is_popup_follows:false,
      private_chatinpt:'@'+that.data.user_name+' '
    })
  },
  private_sendchat(e){
    const that = this
    let v = t.javaTrim(e.detail.value.replace(/\n/g, ''));
    if(v!==''){
      that.setData({
        private_chatinpt: v
      })
    }
    let n='@'+that.data.user_name+' '
    if(e.detail.cursor<n.length){
      that.setData({
        is_privatechat:false,
        is_input:true
      })
    }
  },
  private_send_chatview(e){
    const that = this
    let n='@'+that.data.user_name+' '
    that.setData({
      private_chatinpt: n+e.currentTarget.dataset.message,
      is_privatechat:false
    },()=>{
      that.private_send()
    })
  },
  private_send(){
    const that=this
    const userid = wx.getStorageSync('login_userid')
    let n='@'+that.data.user_name+' '
    const msg=that.data.private_chatinpt.slice(n.length-1,that.data.private_chatinpt.length)
    const json={
      message:msg,
      uid:userid,
      to_uid:that.data.room.user_id,
    }
    app.globalData.socket.emit('private_chat', json);
    const chat = that.data.chat
      chat.push({
        type:6, 
        content:msg
      })
      that.setData({
        chat: that.data.chat
      },()=>{
        that.scrolltop()
      })
  },
  // 聊天滚动到底部
  scrolltop(){
    const that=this
    that.setData({
      scrolltop:that.data.chat.length*100
    })
  },
  // 聊天2分钟显示一次平台提示词
  cueword(){
    const that=this
    setInterval(function(){
      const chat = that.data.chat
      for(let i=0;i<that.data.chat.length;i++){
        if(that.data.chat[i].type==2){
          var a=i
          break;
        }
      }
      that.data.chat.splice(a,2);
      for(let i=0;i<2;i++){
        if(i==0){
          chat.push({
            type: 2, 
            content:that.data.chatips[0]
          })
        }else{
          chat.push({
            type: 2, 
            content: that.data.chatips[1]
          })
        }
      }
      that.setData({
        chat: that.data.chat
      },()=>{
        that.scrolltop()
      })
    },120000)
  },
  lookorder(){
    const that=this
    const id=that.data.order_id
    wx.showLoading({
      title: '',
      icon:'none'
    })
    wx.request({
      url: app.api.order_details +id,
      data: {},
      method: "get",
      header: t.logintype(),
      success(res) {
        that.setData({
          Successfulauction: false
        })
        clearInterval(that.data.onewaitorder_time)
        if (res.statusCode == 200) {
          that.data.onewaitorder_time=setInterval(function(){
            that.setData({
              orderd_time_down:t.countTime(res.data.data.end_pay_time)
            })
          },1000)
          that.setData({
            order_details:res.data.data
          },()=>{
            that.is_Closingorder()
            wx.hideLoading()
          })
        }else{
          t.alert(res.data.message)
          wx.hideLoading()
        }
      }
    })
  },
  to_pay(e){
    const that=this
    that.setData({
      auctionstype:e.currentTarget.dataset.type
    })
    wx.login({
      success(res) {
        wx.request({
          url: app.api.pay_order,
          data: {
            order_id: that.data.order_id,
            pay_type: that.data.paytype,
            wechat_code: res.code
          },
          method: 'post',
          header: t.logintype(),
          success: function (res) {
            if (res.data.status_code == 500) {
              t.alert(res.data.message)
            } else {
              if (that.data.paytype == "balance") {
                if (res.data.status_code == 200) {
                  that.is_Closingorder()
                  that.setData({
                    address_sign:0,
                    is_paysues:true
                  },()=>{
                    that.pay_success_timedown()
                  })
                }
                else {
                  t.alert(res.data.message)
                }
              } else {
                if (res.data.status_code !== 200) {
                  t.alert(res.data.message)
                }
                else if (res.data.status_code == 200) {
                    wx.requestPayment({
                      timeStamp: res.data.data.wechat_mini.timeStamp,
                      nonceStr: res.data.data.wechat_mini.nonceStr,
                      package: res.data.data.wechat_mini.package,
                      signType: 'MD5',
                      paySign: res.data.data.wechat_mini.paySign,
                      success(rs) {
                        that.is_Closingorder()
                        that.setData({
                          address_sign:0,
                          is_paysues:true
                        },()=>{
                          that.pay_success_timedown()
                        })
                      },
                      fail(d) { }
                    })
                }
              }
            }
          },
        })
      }
    })
  },
  lokorder(){
    const that=this
    that.now()
    wx.navigateTo({
      url: '../../pages/orderdetails/orderdetails?id='+that.data.order_id
    })
  },
  now(){
    const that=this
    that.setData({
      is_paysues:false,
      paydowncount:3
    })
  },
  // 支付成功知道了3s倒计时
  pay_success_timedown() {
    const that = this
    var timer = setTimeout(fn, 1000);
    function fn() {
      if (that.data.paydowncount > 0) {
        that.setData({
          paydowncount: that.data.paydowncount - 1
        })
        setTimeout(fn, 1000);
      } else {
        that.now()
      }
    }
  },
  is_paysues(){
    const that=this
    that.setData({
      is_paysues:!that.data.is_paysues
    })
  },
  // 结拍倒计时10s
  countTime() {
    const that = this
    const time = that.data.timestamp_down
    that.data.s=setInterval(function () {
        that.setData({
          countdown_tiepat: t.countTime(time)
        })
        if (t.countTime(time).m == '00' && t.countTime(time).s1 < 11) {
          that.setData({
            is_countTime: true
          })
        }else{
          that.setData({
            is_countTime: false
          })
        }
        if (t.countTime(time).m == '00' && t.countTime(time).s1 == 0) {
          setTimeout(function(){
            clearInterval(that.data.s)
            that.setData({
              interception:true,
              Bid_button_status:0,
              is_countTime: false,
            })
          },1000)
        }
      }, 50)
  },
  // 10s成交
  deal(){
    const that=this
    that.setData({
      is_deal: 1
    })
    that.animations = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    that.animations.opacity(1).scale(1).step()
    that.setData({
      animation_deal: that.animations.export(),
      animation_deal_rotate:'transform:rotate(0deg)'
    },()=>{
      setTimeout(function () {
        that.animations.opacity(0).scale(0).step()
        that.setData({
          animation_deal: that.animations.export()
        })
        setTimeout(function () {
          that.setData({
            is_deal: 0,
            Successfulauction: true,
            animation_deal_rotate:'',
            s: null
          })
          clearInterval(that.data.timer)
          if(that.data.order_id==0){
            that.downtime_three()
          }
        }, 150)
      }, 2150)
    })
  },
  // 知道了3倒计时
  downtime_three() {
    const that = this
    var timer = setTimeout(fn, 1000);
    function fn() {
      if (that.data.count > 0) {
        that.setData({
          count: that.data.count - 1
        })
        setTimeout(fn, 1000);
      } else {
        that.setData({
          Successfulauction: false,
        })
      }
    }
  },
  // 出价信息动画
  isprice(){
    const that=this
    that.animations = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    that.animations.scale(1).opacity(1).step()
    that.setData({
      animation_price: that.animations.export()
    })
    setTimeout(function () {
      that.animations.scale(0).opacity(0).step()
      that.setData({
        animation_price: that.animations.export()
      })
    }, 3000)
  },
  // 隐藏控件
  hideview(){
    this.setData({ 
      active: !this.data.active 
    },()=>{
      if(!this.data.active){
        this.setData({
          topstyle:  'transform:translateY(-'+this.data.top_height + 'px)'
        })
      } else {
        this.setData({
          topstyle:''
        })
      }
    })
  },
  // 购物按钮
  shopping(){
    const that=this
    if(that.data.is_shop){
      that.setData({
        active_shop: !that .data.active_shop
      },()=>{
        setTimeout(function(){
          that.setData({
            is_shop: !that.data.is_shop
          })
        },400)
      })
    }else{
      that.setData({
        is_shop: !that.data.is_shop
      },()=>{
        that.setData({
          active_shop: !that .data.active_shop
        })
      })
    }
    setTimeout(function(){
      if (that.data.goodslist_now.length!==0){
        that.setData({
          shopnav_sign:0
        })
      }else{
        if(that.data.goodslist.length!==0){
          that.setData({
            shopnav_sign: 1
          })
        }
      }
    },300)
  },
  // 购物框switch
  switch_shop(e){
    const that=this
    this.setData({
      shopnav_sign: e.currentTarget.dataset.id
    })
  },
  // 拍品出价
  go_popup_offer(e){
    wx.navigateTo({
      url: '../../pages/videos/videos?id=' + e.currentTarget.dataset.id,
    })
  },
  // 弹窗我要出价
  popup_offer(){
    const that=this
    that.setData({
      active_shop: false,
      is_shop:false
    })
    that.setData({
      is_popup_offer: !that.data.is_popup_offer
    }, () => {
      that.setData({
        active_popup_offer: !that.data.active_popup_offer
      })
      if (that.data.is_popup_offer==true){
        that.setData({
          Bid_button_status:0,
          Bids_button_status:true
        })
      }else{
        that.setData({
          Bids_button_status:false
        })
      }
    })
  },
  // 关注主播弹窗
  popup_follow(){
    this.setData({
      is_popup_follow: !this.data.is_popup_follow
    }, () => {
      this.setData({
        active_popup_follow: !this.data.active_popup_follow
      })
    })
  },
  // 点击头像-关注主播弹窗
  click_follow(){
    const that=this
    const s = that.data.is_popup_follows==true?false:true
    that.setData({
      is_popup_follows:s
    })
    that.seller()
  },
  // 设置切换
  switch_set(){
    const that=this
    const s = that.data.switch_set == true ? false : true
    that.setData({
      switch_set: s
    })
  },
  // 打开（关闭）拍卖成功弹窗
  close_Successfulauction(){
    const that = this
    const s = that.data.Successfulauction == true ? false : true
    that.setData({
      Successfulauction: s
    })
  },
  // 跳转在线观众
  go_online(){
    const that=this
    wx.navigateTo({
      url: '../online/online?id=' + that.data.live_id,
    })
  },
  to_myorder(){
    const that=this
    that.setData({
      switch_set:false
    })
    wx.navigateTo({
      url: '../../pages/my/allorders?id=0&type=all',
    })
  },
  // 评论打开关闭
  is_input(){
    const that = this
    const s = that.data.is_input == true ? false : true
    that.setData({
      is_input: s
    })
    if(s==false){
      that.setData({
        chatinpt:''
      })
    }
  },
  // 一口价支付窗口
  is_biteview(e){
    const that=this
    that.setData({
      is_shop: false,
      active_shop:false,
      abite_goods_id: e.currentTarget.dataset.id == 'close' ? '' : e.currentTarget.dataset.id,
      abite_goods_indx: e.currentTarget.dataset.id == 'close'? '': e.currentTarget.dataset.indx
    })
    if(that.data.is_biteview){
      that.setData({
        is_active_biteview:false
      },()=>{
        setTimeout(function(){
          that.setData({
            is_biteview:false
          })
        },400)
      })
    }else{
      that.setData({
        is_biteview: true
      },()=>{
        that.setData({
          is_active_biteview:true
        })
      })
    }
  },
  // 卖家生成订单弹框
  is_Closingorder(){
    const that = this
    if(!that.data.is_Closingorder){
      that.setData({
        is_Closingorder: !that.data.is_Closingorder
      },()=>{
        setTimeout(function(){
          that.setData({
            is_active_sellview: !that.data.is_active_sellview
          })
        },200)
        
      })
    }else{
      that.setData({
        is_active_sellview: !that.data.is_active_sellview
      },()=>{
        setTimeout(function(){
          that.setData({
            is_Closingorder: !that.data.is_Closingorder
          })
        },200)
      })
    }
  },
  // 订单列表弹框
  is_orderList(){
    const that = this
    that.setData({
      is_orderList: !that.data.is_orderList
    },()=>{
      if(that.data.is_orderList){
        that.order_wait_list()
      }
    })
  },
  selectaddress(e){
    const that=this
    wx.showLoading()
    if(that.data.order_type==0){
      that.setData({
        address_sign:e.currentTarget.dataset.ids
      },()=>{
        wx.hideLoading()
        that.setData({
          isplace:false
        })
      })
    }
    if(that.data.order_type==1){
      wx.request({
        url: app.api.order_addressput,
        data: {
          address_id: e.currentTarget.dataset.id,
          order_id: that.data.order_id
        },
        method: 'put',
        header: t.logintype(),
        success(res) {
          wx.request({
            url: app.api.order_details +that.data.order_id,
            data: {},
            method: "get",
            header: t.logintype(),
            success(res) {
              that.setData({
                Successfulauction: false
              })
              if (res.statusCode == 200) {
                that.setData({
                  order_details:res.data.data
                },()=>{
                  wx.hideLoading()
                })
              }else{
                t.alert(res.data.message)
                wx.hideLoading()
              }
            }
          })
          that.setData({
            isplace:false
          })
        }
      })
    }
    
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      provincecode: e.detail.code[0],
      citycode: e.detail.code[1],
      area: e.detail.code[2],
    })
  },
  formName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  formphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  formcontent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  is_newplace(e){
    const that=this
    that.setData({
      is_newplace:!that.data.is_newplace
    },()=>{
      if(that.data.is_newplace==false){
        that.clear_address()
      }else{
        that.setData({
          editoradd:1
        })
      }
    })
  },
  clear_address(){
    const that=this
    that.setData({
      name: '',
      phone: '',
      content: '',
      area: '',
      region: ['请', '选', '择'],
      address_default:0
    })  
  },
  is_edit(e){
    const that=this
    const id=e.currentTarget.dataset.id
    const address=that.data.address
    wx.showLoading()
    that.setData({
      editoradd:2
    })
    wx.request({
      url: app.api.address_details + address[id].address_id,
      data: {},
      method: 'get',
      header:t.logintype(),
      success(res) {
        that.setData({
          name: res.data.data.accept_name,
          phone: res.data.data.mobile,
          content: res.data.data.address,
          area: res.data.data.area_code,
          region:[address[id].pca_text],
          address_default:res.data.data.default,
          addressid:res.data.data.address_id
        },()=>{
          wx.hideLoading()
          that.setData({
            is_newplace:!that.data.is_newplace
          })
        })
      }
    })
  },
  isaddress_default(e){
    const that=this
    that.setData({
      address_default:e.currentTarget.dataset.id
    })
  },
  hold() {
    var that = this
    if (that.data.content.length<5){
      t.alert('详细地址不少于5个字')
    }else{
      wx.showLoading()
      var type=that.data.editoradd==1?'post':'put'
      wx.request({
        url: app.api.u_address,
        data: {
          address_id: that.data.addressid,
          accept_name: that.data.name,
          mobile: that.data.phone,
          area_code: that.data.area,
          address: that.data.content,
          default: that.data.address_default
        },
        method: type,
        header: t.logintype(),
        success(res) {
          if (res.data.status_code == 200) {
            that.is_newplace()
            that.address()
            that.setData({
              address_default:0 
            })
          }
          wx.hideLoading()
          if (res.data.status_code == 422) {
            t.alert(res.data.message)
          }
        }
      })
    }
  },
  cutaddress(){
    var that = this
    wx.showModal({
      content: '是否删除地址',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.u_address,
            data: {
              address_id: that.data.addressid
            },
            method: 'delete',
            header: t.logintype(),
            success(res) {
              t.alert(res.data.message)
              that.is_newplace()
              that.address()
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  is_paytype(e){
    const that=this
    if(e!==undefined){
      that.setData({
        auctionstype:e.currentTarget.dataset.type
      })
    }
    that.setData({
      is_paytype:!that.data.is_paytype,
    },()=>{
      const balance = that.data.paymode[0].amount
      if(that.data.auctionstype=='immediate'){
        var p = that.data.order_details.payable_amount
      }
      if(that.data.auctionstype=='abite'){
        var p = that.data.goodslist[that.data.abite_goods_indx].sell_price*that.data.abite_goods_num
        
      }
      if (Number(p) <= Number(balance)) {
        that.setData({
          isrecharge: 0
        })
      } else {
        that.setData({
          isrecharge: 1
        })
      }
    })
  },
  
  radioChanges(e){
    var that = this
    that.setData({
      deposit_paytype: e.detail.value
    })
  },
  is_paytypes(e){
    const that=this
    that.setData({
      is_deposit:!that.data.is_deposit,
    },()=>{
      const balance = that.data.paymode[0].amount
      var p = that.data.hot_auction_goods.deposit_price
      if (Number(p) <= Number(balance)) {
        that.setData({
          isrecharge_s: 0
        })
      } else {
        that.setData({
          isrecharge_s: 1
        })
      }
    })
  },
  radioChange: function (e) {
    var that = this
    that.setData({
      paytype: e.detail.value
    })
    that.is_paytype()
  },
  pay_deposit(){
    const that=this
    wx.login({
      success(res) {
        wx.request({
          url: app.api.goods_deposit,
          data: {
            goods_id: that.data.hot_auction_goods.goods_id,
            pay_type: that.data.deposit_paytype,
            wechat_code: res.code,
            role: 1
          },
          method: 'post',
          header: t.logintype(),
          success: function (res) {
            if (that.data.deposit_paytype == "balance") {
              if (res.data.status_code == 200) {
                that.setData({
                  is_deposit:false
                })
              }else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            } else {
              if (res.data.status_code !== 200) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
              else if (res.data.status_code == 200) {
                  wx.requestPayment({
                    timeStamp: res.data.data.wechat_mini.timeStamp,
                    nonceStr: res.data.data.wechat_mini.nonceStr,
                    package: res.data.data.wechat_mini.package,
                    signType: 'MD5',
                    paySign: res.data.data.wechat_mini.paySign,
                    success(res) {
                      that.setData({
                        is_deposit:false
                      })
                    },
                    fail(d) { }
                  })
              }
            }
          },
        })
      }
    })
  },
  // 跳转充值界面
  gorecharge() {
    wx.navigateTo({
      url: '../../pages/my/mywallet/rech?type=2',
    })
  },
  // 立即出价弹框计算
  calculation_price(e){
    const that=this
    const type = e.currentTarget.dataset.type
    const r_price=that.data.price_range
    const n_price=that.data.now_price
    const pay_p = that.data.now_payprice
    if (type==0){
      that.setData({
        now_payprice: pay_p - r_price < n_price || pay_p - r_price == n_price ? n_price : pay_p - r_price
      })
      if (pay_p - r_price < n_price || pay_p - r_price == n_price){
        that.setData({
          reduceon:false
        })
      }else{
        that.setData({
          reduceon: true
        })
      }
    }else{
      that.setData({
        now_payprice: pay_p + r_price,
        reduceon:true
      })
    }
  },
  // 出价弹框-[出价]
  confirmation_of_bid(){
    const that=this
    const pay_p = that.data.now_payprice
    app.globalData.socket.emit('bidder', {goods_id:that.data.now_goodsid,offer_price:Number(that.data.now_payprice)});
      that.setData({
        Bids_button_status:false
      })
  },
  // 一口价购买数量改变
  alite_change(e){
    const that=this
    const indx = that.data.abite_goods_indx
    const a = that.data.goodslist[indx]
    if (e.currentTarget.dataset.type==0){
      if (that.data.abite_goods_num>1){
        that.setData({
          abite_goods_num: that.data.abite_goods_num - 1
        })
      }
    }else{
      if (that.data.abite_goods_num<a.stock){
        that.setData({
          abite_goods_num: that.data.abite_goods_num + 1
        })
      }
    }
  },
  // 关注
  follow() {
    const that = this
    const token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {
      const userid = wx.getStorageSync('login_userid')
      app.globalData.socket.emit('follow',{
        live_user_id:that.data.room.user_id,
        user_id:userid
      });
      // wx.request({
      //   url: app.api.user_detfollow,
      //   data: {
      //     user_id: that.data.room.user_id,
      //   },
      //   method: "post",
      //   header: t.logintype(),
      //   success(a) {
      //     if (a.statusCode == 200) {
      //       that.setData({
      //         roomfollow: 1,
      //         is_popup_follow: false,
      //         active_popup_follow: false
      //       })
      //       t.alert(a.data.message)
      //     } if (a.statusCode == 401) {
      //       relanding.relanding()
      //       setTimeout(function () {
      //         that.follow()
      //       }, 1000)
      //     }
      //   }
      // })
    }
  },
  //取消关注
  tofollow() {
    const that = this
    wx.request({
      url: app.api.user_detfollow,
      data: {
        user_id: that.data.room.user_id,
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            roomfollow: 0
          })
          t.alert(a.data.message)
        } else {
          relanding.relanding()
          setTimeout(function () {
            that.tofollow()
          }, 1000)
        }
      }
    })
  },
  // 选择地址
  isplace(e){
    const that=this
    if(e.currentTarget.dataset.type<2){
      that.setData({
        order_type:Number(e.currentTarget.dataset.type)
      })
    }
    that.setData({
      isplace:!that.data.isplace
    },()=>{
      if(that.data.isplace){
        that.address()
      }
    })
  },
  // 跳转卖家主页
  jump_person(){
    const that=this
    that.setData({
      is_popup_follows: false
    })
    wx.navigateTo({
      url: '../../pages/person/person?id='+that.data.room.user_id,
    })
  },
  to_pay_list(e){
    const that=this
    that.is_orderList()
    that.setData({
      order_id:e.currentTarget.dataset.id
    },()=>{
      that.lookorder()
    })

  },
  // 一口价跳转生成订单页(去支付)
  jump_ware(e){
    const that = this
    const indx = that.data.abite_goods_indx
    const a = that.data.goodslist[indx]
    that.setData({
      auctionstype:e.currentTarget.dataset.type
    })
    wx.request({
      url: app.api.creat_live_order,
      data: {
        goods_id:that.data.abite_goods_id,
        address_id: that.data.address[that.data.address_sign].address_id,
        goods_num:that.data.abite_goods_num
      },
      method: 'post',
      header: t.logintype(),
      success(a) {
        if (a.data.status_code==422){
          t.alert(a.data.message)
        }else{
          that.setData({
            order_id: a.data.data.order_id
          })
          wx.login({
            success(res) {
              wx.request({
                url: app.api.pay_order,
                data: {
                  order_id: a.data.data.order_id,
                  pay_type: that.data.paytype,
                  wechat_code: res.code
                },
                method: 'post',
                header: t.logintype(),
                success: function (res) {
                  if (res.data.status_code == 500) {
                    t.alert(res.data.message)
                  } else {
                    if (that.data.paytype == "balance") {
                      if (res.data.status_code == 200) {
                        that.setData({
                          is_biteview:false,
                          address_sign:0,
                          is_paysues:true,
                          abite_goods_num:1
                        },()=>{
                          that.pay_success_timedown()
                        })
                      }
                      else {
                        t.alert(res.data.message)
                      }
                    } else {
                      if (res.data.status_code !== 200) {
                        t.alert(res.data.message)
                      }
                      else if (res.data.status_code == 200) {
                          wx.requestPayment({
                            timeStamp: res.data.data.wechat_mini.timeStamp,
                            nonceStr: res.data.data.wechat_mini.nonceStr,
                            package: res.data.data.wechat_mini.package,
                            signType: 'MD5',
                            paySign: res.data.data.wechat_mini.paySign,
                            success(rs) {
                              that.setData({
                                is_biteview:false,
                                address_sign:0,
                                is_paysues:true,
                                abite_goods_num:1
                              },()=>{
                                that.pay_success_timedown()
                              })
                            },
                            fail(d) { }
                          })
                      }
                    }
                  }
                },
              })
            }
          })
        }
      }
    })
  },
  // 获取支付方式
  paytype(){
    const that=this
    wx.request({
      url: app.api.pay_type + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        that.setData({
          paymode: res.data.data
        })
        for(let i=0;i<res.data.data.length;i++){
          that.setData({
            paytype: res.data.data[i].default==1?res.data.data[i].pay_mark:''
          })
        }
      }
    })
  },
  // 直播房间基本信息
  liveinfo() {
    const that = this
    var platform=''
    if(that.data.platform=='pc'){
      platform='HDL'
    }else if(that.data.platform=='ios'){
      platform='HLS'
    }else if(that.data.platform=='android'){
      platform='HDL'
    }
    wx.request({
      url: app.api.liveinfo + that.data.live_id + '?view_type='+platform,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            room: res.data.data,
            user_name: res.data.data.user.nick_name.length > 5 ? res.data.data.user.nick_name.slice(0, 5) + '...' : res.data.data.user.nick_name,
            roomfollow: res.data.data.is_follow,
            last_into_viewer: res.data.data.last_into_viewer
          },()=>{
            that._setup()
          })
        } else {
          that.setData({
            room: null
          })
        }
      }
    })
  },
  // 店铺基本信息
  seller(){
    const that=this
    wx.request({
      url: app.api.selinformation + that.data.room.user_id,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            seller: res.data.data
          })
        } else {
          that.setData({
            seller: null
          })
        }
      }
    })
  },
  // 地址列表
  address(){
    const that=this
    wx.request({
      url: app.api.address,
      data: {},
      method: 'get',
      header: t.logintype(),
      success(res) {
        if (res.statusCode ==204) {
          that.setData({
            address: null
          })
        } 
        if (res.statusCode == 200) {
          that.setData({
            address: res.data.data
          })
        }
      }
    })
  },
  order_wait_list(){
    const that=this
    wx.request({
      url: app.api.live_order,
      data: {},
      method: 'get',
      header: t.logintype(),
      success(res) {
        if (res.statusCode ==204) {
          that.setData({
            live_order:null
          })
        } 
        if (res.statusCode == 200) {
          that.setData({
            live_order:res.data.data
          })
          clearInterval(that.data.liveordertime)
          that.data.liveordertime=setInterval(function(){
            const json=[]
            for(let i=0;i<res.data.data.length;i++){
              json.push(
                t.countTime(res.data.data[i].end_pay_time)
              )
            }
            that.setData({
              liveorder_countTime:json
            })
          },1000)
        }
      }
    })
  },
  newtips(e){
    const that=this
    that.setData({
      newtips:e.currentTarget.dataset.type
    })
    if(Number(e.currentTarget.dataset.type)==4){
      wx.setStorage({
        key: "newtip",
        data: 4
      })
    }
    that.isnew()
  }
})