const app = getApp()
const t = require('../../../pages/common/time.js')
const form = require('../../../pages/common/formid.js')
const relanding = require('../../../pages/common/relanding.js')
const login = require('../../../pages/common/login.js')
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    headtitle: '拍卖会',
    top:0,
    height:'',
    heights: '',
    height1:'',
    style:'position:absolute;',
    calendarConfig: {
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 初始化时不默认选中当天，则将该值配置为false。
       */
      theme: 'multi', // 配置内置主题
      defaultDay: '',
      // showLunar: true,
      disablePastDay: false,
      onlyShowCurrentMonth: false, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    },
    setInterval:null,
    auction_stamptime:'',
    auction_list:null,
    endclock:null,
    date_o:'今天',
    date_w:'',
    pagescroll:'',
    pagescroll1:'',
    pagescroll2: 'margin-right: 3px;',
    scrolli:0,
    is_calmaskbox: 1,
    data_time:'',
    switch_view:1
  },
  // 日历-周/月-视图切换
  switch_view() {
    const that = this
    that.data.switch_view == 1 ? that.data.switch_view = 2 : that.data.switch_view = 1
    if (that.data.switch_view == 1) {
      this.calendar.switchView('week').then(() => { });
    } else {
      this.calendar.switchView('month').then(() => { });
    }
    setTimeout(function () { that.cal_height() }, 300)
  },
  preventTouchMove(){},
  pagetouchStart(e) {
    this.setData({
      scrolli:0,
      pagescroll: 'transform: translatex(20px);transition: all 1s;',
      pagescroll1:'transform:rotate(90deg);transition: all 1s;',
    })
  },
  pagetouchEnd(e) {
    const that=this
    setTimeout(function () {
      that.setData({
        scrolli:1
      })
    }, 3000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
    })
    that.auction_list()
    setInterval(function () {
      if(that.data.scrolli==1){
        that.setData({
          pagescroll: 'transform: translatex(0);transition: all 1s;',
          pagescroll1: 'transform:rotate(0);transition: all 1s;',
        })
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that=this
    setTimeout(function () { that.height() }, 300)
    
  },
  openmask() {
      this.setData({
        is_calmaskbox: 2
      })
  },
  closemask() {
    this.setData({
      is_calmaskbox: 1
    })
  },
  // 获取日历高度
  height(){
    const that = this
    const query = wx.createSelectorQuery()
    query.select('.calendar').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        height: res[0].height,
      })
    })
  },
  // 跳转至指定日期
  ct(){
    this.calendar.jump(2019, 9,3);
  },
  // 跳转至跳转至今天
  ct1() {
    this.calendar.jump();
  },
  // 获取当前选中日期
  ct2(){
    console.log(this.calendar.getSelectedDay()[0])
    console.log(t.Chinese(this.calendar.getSelectedDay()[0].week))
    this.setData({
      date_w:'星期'+t.Chinese(this.calendar.getSelectedDay()[0].week)
    })
    
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    const that=this
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0) {} else {}
      }
      if (absY > absX * 2 && tmY < 0) {
        this.calendar.switchView('week').then(() => {});
        setTimeout(function () { that.height() }, 300)
      }else{
        this.calendar.switchView('month').then(() => {})
        setTimeout(function () { that.height() }, 300)
      }
    }
    clearInterval(interval);
    time = 0;
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
    const that = this
    const selectedDay = this.calendar.getSelectedDay();
    const strtime = selectedDay[0].year + '/' + selectedDay[0].month + '/' + selectedDay[0].day + ' ' + '00:00:00'
    const daytime = t.timeTransformation(((new Date(strtime).getTime()) / 1000) - 86400)[0]
    const strtime1 = daytime.y + '/' + daytime.m + '/' + daytime.d
    this.calendar.jump(daytime.y, daytime.m, daytime.d)
    if (t.isToday(daytime.y + '/' + daytime.m + '/' + daytime.d) == false) {
      this.setData({
        date_o: daytime.m + '月' + daytime.d + '日',
        data_time: daytime.y + '-' + daytime.m + '-' + daytime.d,
        date_w: '星期' + t.Chinese(new Date(strtime1).getDay())
      }, () => {
        that.auction_list()
      })
    } else {
      this.setData({
        date_o: '今天',
        data_time: daytime.y + '-' + daytime.m + '-' + daytime.d,
        date_w: '星期' + t.Chinese(new Date(strtime1).getDay())
      }, () => {
        that.auction_list()
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that=this
    const selectedDay = this.calendar.getSelectedDay();
    const strtime = selectedDay[0].year + '/' + selectedDay[0].month + '/' + selectedDay[0].day + ' ' + '00:00:00'
    const daytime = t.timeTransformation(((new Date(strtime).getTime()) / 1000) + 86400)[0]
    const strtime1 = daytime.y + '/' + daytime.m + '/' + daytime.d
    this.calendar.jump(daytime.y, daytime.m, daytime.d)
    if (t.isToday(daytime.y + '/' + daytime.m + '/' + daytime.d) == false) {
      this.setData({
        date_o: daytime.m + '月' + daytime.d + '日',
        data_time: daytime.y + '-' + daytime.m + '-' + daytime.d,
        date_w: '星期' + t.Chinese(new Date(strtime1).getDay())
      }, () => {
        that.auction_list()
      })
    } else {
      this.setData({
        date_o: '今天',
        data_time: daytime.y + '-' + daytime.m + '-' + daytime.d,
        date_w: '星期' + t.Chinese(new Date(strtime1).getDay())
      }, () => {
        that.auction_list()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  // 监听页面滑动
  onPageScroll: function (ev) {
    var that = this
    if (ev.scrollTop > 100 || ev.scrollTop == 100) {
      
    } else {
      
    }
  },
  afterTapDay(e) {
    this.setData({
      auction_stamptime: e.detail.year + '-' + e.detail.month + '-' + e.detail.day,
      date_w: '星期' + t.Chinese(e.detail.week)
    })
    if (t.isToday(e.detail.year + '/' + e.detail.month + '/' + e.detail.day) == false) {
      this.setData({
        date_o: e.detail.month + '月' + e.detail.day + '日',
        data_time: e.detail.year + '-' + e.detail.month + '-' + e.detail.day
      },()=>{
        this.auction_list()
      })
    } else {
      this.setData({
        date_o: '今天',
        data_time: e.detail.year + '-' + e.detail.month + '-' + e.detail.day
      }, () => {
        this.auction_list()
      })
    }
    
  },
  gotop() {
    let that = this
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  /**
   * 当改变月份时触发
   * current 当前年月
   * next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail); // => { current: { month: 3, ... }, next: { month: 4, ... }}
    
  },
  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
  onTapDay(e) {
    console.log('onTapDay', e.detail); // => { year: 2019, month: 12, day: 3, ...}

  },
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
  afterCalendarRender(e) {
    const that = this
    var a = new Array("日", "一", "二", "三", "四", "五", "六");
    var week = new Date().getDay();
    var str = a[week];
    this.setData({
      date_o: '今天',
      data_time: this.calendar.getSelectedDay()[0].year + '-' + this.calendar.getSelectedDay()[0].month + '-' + this.calendar.getSelectedDay()[0].day,
      date_w: '星期' + str
    }, () => {
      that.auction_list()
    })
  },
// -----------------------------------------------------------------------------
  // 全球拍拍卖会列表
  auction_list() {
    var that = this
    wx.request({
      url: app.api.new_auctionlist + that.data.data_time,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 204) {
          that.setData({
            auction_list: null
          },()=>{
            clearInterval(that.data.interval);
            that.gotop()
            that.height()
            wx.stopPullDownRefresh()
            wx.hideLoading()
          })
        } else {
          let json = []
          for (let i = 0; i < a.data.data.length; i++) {
            json.push({ state: 0 })
          }
          that.setData({
            auction_list: a.data.data,
            auction_lists: json
          }, () => {
            that.auc_clock()
            that.gotop()
            that.height()
            wx.stopPullDownRefresh()
            wx.hideLoading()
          })
        }
      }
    })
  },
  // 拍卖会开拍倒计时
  auc_clock() {
    let that = this
    if (that.data.auction_list !== null) {
      that.data.setInterval = setInterval(function () {
        if (that.data.auction_list !== null) {
          const storage = [];
          for (let i = 0; i < that.data.auction_list.length; i++) {
            storage.push(
              t.countdown(that.data.auction_list[i].start_time)
            )
          }
          that.setData({
            endclock: storage,
          })
        }
      }, 1000)
    } else {
      clearInterval(that.data.interval);
    }
  },
  // 收藏（取消）拍卖会
  global_collect(e) {
    var that = this
    that.button()
    wx.request({
      url: app.api.gloabl_auctioncollection,
      data: {
        auction_id: e.currentTarget.dataset.id,
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
          that.data.auction_lists[e.currentTarget.dataset.ids].state = 1
          that.setData({
            auction_lists: that.data.auction_lists
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
        }
      }
    })
  },
  global_collect_d(e) {
    var that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: e.currentTarget.dataset.id,
        type: '4'
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
        }
        that.data.auction_lists[e.currentTarget.dataset.ids].state = 0
        that.setData({
          auction_lists: that.data.auction_lists
        })
      }
    })
  },
  // 热拍跳转拍卖会
  goauction(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/videos/auction?id=' + e.currentTarget.dataset.id,
    })
  },
  //点击登陆
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
    } else {}
  },
})
