// pages/shot/info.js
const app = getApp()
const t = require('../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    headtitle: '拍卖信息',
    radio:'1',  // 是否包退
    radio1: '1', // 是否展示
    timedy: 'none', // 选择时间显示隐藏
    nowday: '',// 今天
    tomday: '',// 明天
    aftday: '',// 后天
    nowday1: '',// 今天
    tomday1: '',// 明天
    aftday1: '',// 后天
    timetype:'',
    timenum:'',
    nav: [{ type: '0', state: '0', name: '老货',id:'1' }, { type: '1', state: '0', name: '工艺品',id:'2'}],
    r_num:'2',
    year: '',// 选择年
    tomday_m: '',// 选择明天月
    tomday_d: '',// 选择明天日
    v1:'block',
    v2: 'block',
    v3: 'block',
    v4: 'block',
    v5: 'block',
    v6: 'block',
    v7: 'block',
    v8: 'block',
    v9: 'block',
    bon: [{ value: '0', state: '0' }, { value: '10', state: '0' }, { value: '30', state: '0' }, { value: '50', state: '0' }, { value: '100', state: '0' }, { value: '200', state: '0' }, { value: '500', state: '0' }, { value: '1000', state: '0' }, { value: '2000', state: '0' }],
    bondChoice:'0',
    btext:'0',

  // 上传
    end_time:'',  // 结拍时间戳(上传)
    returns: '1',  // 是否包退(上传)
    returns1: '1', // 是否展示(上传)
    input1: '',   // 起拍价(上传)
    input2: '',   // 一口价(上传)
    input3: '',   // 加价幅度(上传)
    input4: '0',   // 保证金(上传)
    input5: '',   // 市场估价(上传)
    lisimg: [],   // 图片数组(上传)
    cateid:'',    // 分类id(上传)
    videokey1:'',  // 视频key(上传)
    title:'',     // 拍品名称(上传)
    textvalue1: '',//拍品描述(上传)
    cover: '',//封面图片(上传)
    area: '',//地址(上传)
    data: null, //请求data
    is_deposit: '',//是否已缴纳保证金

    baoku: '0',//是否自动转入宝库
    shop_in: '1',//商品售出模式
    sell_price: '',//商品售出价格
    navname:'',

  //发布成功获得goodid
    goodid:'', 

  //重新上拍goodid
    goods_id:""
  },
  yxz(){
    var that=this
    that.setData({
      radio1:'0',
      returns1: '0', // 是否展示(上传)
    })
  },
  wxz() {
    var that = this
    that.setData({
      radio1: '1',
      returns1: '1', // 是否展示(上传)
    })
  },
  yxz1() {
    var that = this
    that.setData({
      radio: '0',
      returns: '0',  // 是否包退(上传)
    })
  },
  wxz1() {
    var that = this
    that.setData({
      radio: '1',
      returns: '1',  // 是否包退(上传)
    })
  },
  yxz2() {
    var that = this
    that.setData({
      baoku: '0',
      sell_price:'',
    })
  },
  wxz2() {
    var that = this
    that.setData({
      baoku: '1',
    })
  },
  shopy(){
    var that = this
    that.setData({
      shop_in: '2'
    })
  },
  shopn(){
    var that = this
    that.setData({
      shop_in: '1',
      sell_price: '',
    })
  },
  r_open(){
    var that = this
    that.setData({
      r_num:'1'
    })
  },
  r_close(){
    var that = this
    that.setData({
      r_num: '2'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options.direct_price)
    that.setData({
      navH: app.globalData.navHeight,
      cateid: options.cateid,
      title: options.title,
      textvalue1: options.textvalue1,
      cover: options.coverskey,
      returns: options.return,       //是否包退 1是 0否
      radio: options.return,         //是否包退 1是 0否(页面使用)
      input1: options.start_price,  //起拍价
      input2: options.direct_price == 0 ? '' : options.direct_price, //一口价 0为无一口价
      input3: options.range_price,  //加价幅度
      input5: options.guide_price,  //参考价
      returns1: options.hide_guide,   //是否隐藏参考价 1是 0否
      radio1: options.hide_guide,   //是否隐藏参考价 (页面使用)
      is_deposit: options.is_deposit,   //是否已经缴纳保证金
      goods_id: options.goods_id,

    })
    if (options.deposit_price!=='0'){
      that.setData({
        input4:options.deposit_price,
        btext:'1',
      })
    }else{

    }
    if (options.videokey == 'null') {
      that.setData({
        videokey1: '',
      })
    }else{
      that.setData({
        videokey1: options.videokey,
      })
    }
    
    wx.request({
      url: app.api.addressdefault,
      method: 'get',
      header:t.logintype(),
      success: function (b) {
        if (b.data == '') {
          that.setData({
            area: null
          })
        } else {
          that.setData({
            area: b.data.data.address_id
          })
        }
      }
    })
    var jsonStr = options.lisimg;
    jsonStr = jsonStr.replace(" ", "");
    if (typeof jsonStr != 'object') {
      jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
      var jj = JSON.parse(jsonStr);
      that.setData({
        lisimg:jj
      })
    }
    var now = Date.parse(new Date())                          // 今天时间戳
    var tom = Date.parse(new Date()) + 24 * 60 * 60 * 1000    // 明天时间戳
    var aft = Date.parse(new Date()) + 2 * 24 * 60 * 60 * 1000// 后天时间戳
    var tom1 = new Date(tom)
    var aft1 = new Date(aft)
    // 当前时间
    var date = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() +' '+ '10:00:00');
    var date1 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '12:00:00');
    var date2 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '16:00:00');
    var date3 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '17:00:00');
    var date4 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '19:00:00');
    var date5 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '20:00:00');
    var date6 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '21:00:00');
    var date7 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '22:00:00');
    var date8 = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + '23:00:00');
    var time1 = Date.parse(date);
    var time2 = Date.parse(date1);
    var time3 = Date.parse(date2);
    var time4 = Date.parse(date3);
    var time5 = Date.parse(date4);
    var time6 = Date.parse(date5);
    var time7 = Date.parse(date6);
    var time8 = Date.parse(date7);
    var time9 = Date.parse(date8);
    
    if (time1 - new Date().getTime()<0){
      that.setData({
        v1:'none'
      })
    }
    if (time2 - new Date().getTime()<0) {
      that.setData({
        v2: 'none'
      })
    }
    if (time3 - new Date().getTime() < 0) {
      that.setData({
        v3: 'none'
      })
    }
    if (time4 - new Date().getTime() < 0) {
      that.setData({
        v4: 'none'
      })
    }
    if (time5 - new Date().getTime() < 0) {
      that.setData({
        v5: 'none'
      })
    }
    if (time6 - new Date().getTime() < 0) {
      that.setData({
        v6: 'none'
      })
    }
    if (time7 - new Date().getTime() < 0) {
      that.setData({
        v7: 'none'
      })
    } 
    if (time8 - new Date().getTime() < 0) {
      that.setData({
        v8: 'none'
      })
    }
    if (time9 - new Date().getTime() < 0) {
      that.setData({
        v9: 'none'
      })
    }


    if (new Date().getMonth()+1<10){
      that.setData({
        nowday: '0'+(new Date().getMonth() + 1) +'月',
      })
    }else{
      that.setData({
        nowday: (new Date().getMonth() + 1) + '月',
      })
    }
    if (new Date().getDate() < 10) {
      that.setData({
        nowday1: '0' +new Date().getDate() + '日',
      })
    }else{
      that.setData({
        nowday1: new Date().getDate() + '日',
      })
    }
    // 明天
    if (tom1.getMonth() + 1 < 10) {
      that.setData({
        tomday: '0' + (tom1.getMonth() + 1) + '月',
      })
    } else {
      that.setData({
        tomday: (tom1.getMonth() + 1) + '月',
      })
    }
    if (tom1.getDate() < 10) {
      that.setData({
        tomday1: '0' + tom1.getDate() + '日',
      })
    } else {
      that.setData({
        tomday1: tom1.getDate() + '日',
      })
    }
    // 后天
    if (aft1.getMonth() + 1 < 10) {
      that.setData({
        aftday: '0' + (aft1.getMonth() + 1) + '月',
      })
    } else {
      that.setData({
        aftday: (aft1.getMonth() + 1) + '月',
      })
    }
    if (aft1.getDate() < 10) {
      that.setData({
        aftday1: '0' + aft1.getDate() + '日',
      })
    } else {
      that.setData({
        aftday1: aft1.getDate() + '日',
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
    var that=this
    wx.setNavigationBarTitle({
      title: '拍卖信息',
    })
    wx.request({
      url: app.api.addressdefault,
      method: 'get',
      header:t.logintype(),
      success: function (b) {
        if (b.data == '') {
          that.setData({
            area: null
          })
        } else {
          that.setData({
            area: b.data.data.address_id
          })
        }
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

  },
  // 七天包退选择
  radio(e){
    var that=this
    if (e.currentTarget.dataset.type==''){
      that.setData({
        radio: true,
        returns:'1'
      })
    } if (e.currentTarget.dataset.type == true){
      that.setData({
        radio:'',
        returns: '0'
      })
    }
  },
  // 是否展示选择
  radio1(e) {
    var that = this
    if (e.currentTarget.dataset.type == '') {
      that.setData({
        radio1: true,
        returns1: '1'
      })
    } if (e.currentTarget.dataset.type == true) {
      that.setData({
        radio1: '',
        returns1: '0'
      })
    }

  },
  // 出售价格
  shopprice(e){
    var that = this
    that.setData({
      sell_price: e.detail.value
    })
  },
  // 起拍价
  input1(e){
    var that=this
    that.setData({
      input1: e.detail.value
    })
  },
  // 一口价
  input2(e){
    var that = this
    that.setData({
      input2: e.detail.value
    })
  },
  // 加价幅度
  input3(e){
    var that = this
    that.setData({
      input3: e.detail.value
    })
  },
  // 保证金
  input4(e){
    var that = this
    that.setData({
      input4: e.detail.value
    })
  },
  //市场估价
  input5(e){
    var that = this
    that.setData({
      input5: e.detail.value
    })
  },
  // 打开选择时间
  open(){
    var that = this
    that.setData({
      timedy:'block'
    })
  },

  // 关闭选择时间
  close() {
    var that = this
    that.setData({
      timedy: 'none'
    })
  },
  // 具体时间选择
  timer(e){
    var that=this
    that.setData({
      timenum: e.currentTarget.dataset.time,
      timedy:'none'
    })
    var now = new Date()                        // 今天时间戳
    var tom = Date.parse(new Date()) + 24 * 60 * 60 * 1000    // 明天时间戳
    var aft = Date.parse(new Date()) + 2 * 24 * 60 * 60 * 1000// 后天时间戳
    var tom1 = new Date(tom)
    var aft1 = new Date(aft)
    console.log(new Date().getMonth())
    // 今天
    if (e.currentTarget.dataset.type == 'now') {
      that.setData({
        year: now.getFullYear(),
        timetype:'今天',
      })
      if (new Date().getMonth()+1 < 10) {
        that.setData({
          tomday_m: '0' + (new Date().getMonth() + 1),
        })
      } else {
        that.setData({
          tomday_m: (new Date().getMonth() + 1),
        })
      }
      if (new Date().getDate() < 10) {
        that.setData({
          tomday_d: '0' + new Date().getDate(),
        })
      } else {
        that.setData({
          tomday_d: new Date().getDate(),
        })
      }
    }
    // 明天
    if (e.currentTarget.dataset.type=='tom'){
      that.setData({
        year: tom1.getFullYear(),
        timetype: '明天',
      })
      if (tom1.getMonth() + 1 < 10) {
        that.setData({
          tomday_m: '0' + (tom1.getMonth() + 1) ,
        })
      } else {
        that.setData({
          tomday_m: (tom1.getMonth() + 1),
        })
      }
      if (tom1.getDate() < 10) {
        that.setData({
          tomday_d: '0' + tom1.getDate(),
        })
      } else {
        that.setData({
          tomday_d: tom1.getDate(),
        })
      }
    }
    // 后天
    if (e.currentTarget.dataset.type == 'aft') {
      that.setData({
        year: aft1.getFullYear(),
        timetype: '后天',
      })
      if (aft1.getMonth() + 1 < 10) {
        that.setData({
          tomday_m: '0' + (aft1.getMonth() + 1),
        })
      } else {
        that.setData({
          tomday_m: (aft1.getMonth() + 1),
        })
      }
      if (aft1.getDate() < 10) {
        that.setData({
          tomday_d: '0' + aft1.getDate(),
        })
      } else {
        that.setData({
          tomday_d: aft1.getDate(),
        })
      }
    }
    var date = that.data.year + '/' + that.data.tomday_m +'/'+that.data.tomday_d+' '+e.currentTarget.dataset.time+':00:00';
    var time3 = Date.parse(new Date(date));
    that.setData({
      end_time: time3/1000
    })
    
  },
  choicegory(e){
    let that=this
    for (let i = 0; i < that.data.nav.length; i++) {
      that.data.nav[i].state = '0'
    }
    if (e.currentTarget.dataset.type==1){
      that.data.nav[e.currentTarget.dataset.id].state = '0'
      that.setData({
        nav: that.data.nav,
        navname:''
      })
    }else{
      that.data.nav[e.currentTarget.dataset.id].state = '1'
      that.setData({
        nav: that.data.nav,
        navname: that.data.nav[e.currentTarget.dataset.id].id
      })
    }
  },
  // 发布
  pub(){
    var that=this
    if (that.data.area==null){
      wx.showModal({
      content: '尚未添加收货退货地址,为了方便退货的处理请您在发布拍品前添加您的地址',
      confirmText:'立即添加',
        confirmColor:'#444444',
        cancelColor:'#444444',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../my/install/address',
          })
        } else if (res.cancel) {
          
        }
      }
    })
     
    }else{
      if (that.data.videokey1!==''){
        that.setData({
          data: {
            cate_id: that.data.cateid,
            title: that.data.title,
            desc: that.data.textvalue1,
            return: that.data.returns,
            start_price: that.data.input1 == '' ? 0 : that.data.input1,
            direct_price: that.data.input2,
            range_price: that.data.input3,
            guide_price: that.data.input5,
            deposit_price: that.data.input4,
            end_time: that.data.end_time,
            video: that.data.videokey1,
            hide_guide: that.data.returns1,
            cover: that.data.cover,
            images: that.data.lisimg,
            address_id: that.data.area,
            goods_id: that.data.goods_id,
            shop_class: that.data.shop_in,
            sell_price: that.data.sell_price,
            auto_into: that.data.baoku,
            quality:that.data.navname
          }
        })
      }else{
        that.setData({
          data: {
            cate_id: that.data.cateid,
            title: that.data.title,
            desc: that.data.textvalue1,
            return: that.data.returns,
            start_price: that.data.input1 == '' ? 0 : that.data.input1,
            direct_price: that.data.input2,
            range_price: that.data.input3,
            guide_price: that.data.input5,
            deposit_price: that.data.input4,
            end_time: that.data.end_time,
            hide_guide: that.data.returns1,
            cover: that.data.cover,
            images: that.data.lisimg,
            address_id: that.data.area,
            goods_id: that.data.goods_id,
            shop_class: that.data.shop_in,
            sell_price: that.data.sell_price,
            auto_into: that.data.baoku,
            quality: that.data.navname
          }
        })
      }
      
      var data = that.data.data;
      wx.request({
        url: app.api.goodsrelease,
        data,
        method: 'post',
        header: t.logintype(),
        success: function (b) {
          if (b.data.status_code == 200) {
            if (that.data.input4 == '0') {
              wx.redirectTo({
                url: '../paysuccess/relsuccess?id=' + b.data.data.goods_id + '&type=1',
              })
            } else {
              wx.redirectTo({
                url: '../buybond/selbond?id=' + b.data.data.goods_id + '&title=' + that.data.title + '&start=' + that.data.input1 + '&range=' + that.data.input3 + '&cover=' + that.data.cover + '&deposit=' + that.data.input4,
              })
            }
          }
          if (b.data.status_code == 422) {
            t.alert(b.data.message)
          }
        }
      })
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
  bondChoice(){
    let that=this
    that.setData({
      bondChoice:'0'
    })
  },
  bondChoices() {
    let that = this
    that.setData({
      bondChoice: '1'
    })
  },
  bondChoicec(e){
    let that=this
    if (that.data.input4 !== e.currentTarget.dataset.value || that.data.input4 =='0'){
      for (let i = 0; i < that.data.bon.length; i++) {
        that.data.bon[i].state = '0'
      }
      that.data.bon[e.currentTarget.dataset.id].state = '1'
      that.setData({
        bon: that.data.bon,
        input4: e.currentTarget.dataset.value,
        bondChoice:'0',
        btext:'1'
      })
    }
  },
  goread() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=https://www.cangbaopai.com/xieyi/bonda.html',
    })
  },
})