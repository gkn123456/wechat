// pageA/pages/search/newpage.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
const login = require('../../../pages/common/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    navHs: '',
    goodheight:'',
    height:'',
    value:'',
    type:'',
    class_show: 0,
    c_show1: 1,
    c_show2: 2,
    c_show3: 3,
    c_show4: 4,
    c_shows: '0',
    c_shows1: '0',
    c_shows2: '0',
    c_shows3: '0',
    ch_show: '0',
    cc_shows: '',
    sort_name1: '价格',
    sort_name2: '开拍时间',
    sort_name3: '分类',
    sort_name4: '筛选',
    class_p: [{ 'n': '浏览最高', 'type': 'playcount' }, { 'n': '价格最低', 'type': 'priceasc' }, { 'n': '价格最高', 'type': 'pricedesc' }],
    class_t: [{ 'n': '默认排序', 'type': '0' }, { 'n': '最近开拍', 'type': 'starttimeasc' }, { 'n': '最晚开拍', 'type': 'starttimedesc' }],
    // 开拍区间
    start_time_section: [
      { 't': '近三天', 'tg': '0' },
      { 't': '近一周', 'tg': '0' },
      { 't': '近一月', 'tg': '0' }
    ],
    multiArray: [],
    multiArray1:[],
    price_sort: '',
    time_sort: '',
    start_time: '',
    end_time: '',
    currency: null,
    str_s: '',    // 筛选币种id
    min_price: '',// 筛选最低价
    max_price: '',// 筛选最高价
    all_clss: null,
    all_id: '1',
    cate_id: '',  // 分类查询id
    g_name: '',
    multiIndex: [0, 0],
    select: [],
    select_s: [],
    starttime1: [],
    page:2,
    // 筛选重整
    sort1: 0,
    sort2: 0,
    sort3: 0,
    sort4: 0,
    sortname1: '价格',
    sortname2: '开拍时间',
    sortname3: '分类',
    sortname4: '筛选',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight+36,
      height: wx.getSystemInfoSync().windowHeight - app.globalData.navHeight - 36,
      value:options.v
    })
    that.tokens()
    setTimeout(function () {
      that.list()
      that.classify_home()
      that.currency()
      that.gain_while()
    }, 300)
    
  },
  // 登陆头部定义
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
  //点击登陆
  btn_sub: function () {
    var that = this
    login.userLogin()
    setTimeout(function () {
      that.tokens()
    }, 1000)

  },
  // 登陆判断
  button() {
    let that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {
      that.tokens()
    }
  },
  // 获取页面元素宽
  width(){
    let that=this
    const query = wx.createSelectorQuery()
    query.select('.selectli').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        goodheight: res[0].width
      })
    })
  },
  // 筛选时间选择器
  // 每列下标返回
  bindMultiPickerChange(e) {
    // 开始时间戳 time1
    // 结束时间戳 time
    let that = this
    this.gain_while()
    this.setData({
      multiIndex: e.detail.value
    })
    let num1 = e.detail.value[0]
    let num2 = e.detail.value[1]
    let c_time = this.data.multiArray[0][num1]
    let t_time = this.data.multiArray[1][num2]
    // 开始时间戳转换
    if (num1 == 0) {
      var time1 = new Date(new Date().toLocaleDateString()).getTime() / 1000
    } else {
      let year1 = c_time.substring(0, 4)
      let month1 = c_time.substring(5, 7)
      let day1 = c_time.substring(8, 10)
      var date1 = year1 + '/' + month1 + '/' + day1 + ' ' + '00:00:00';
      var time1 = Date.parse(new Date(date1)) / 1000;
    }
    // 结束时间戳转换
    let year = t_time.substring(0, 4)
    let month = t_time.substring(5, 7)
    let day = t_time.substring(8, 10)
    var date = year + '/' + month + '/' + day + ' ' + '00:00:00';
    var time = Date.parse(new Date(date)) / 1000;
    that.setData({
      end_time: time,
      start_time: time1
    })
    // 区间计算
    let region = time * 1000 - time1 * 1000
    var days = parseInt(region / 1000 / 60 / 60 / 24, 10);        //剩余天数 
    if (days == 3) {
      that.data.start_time_section[0].tg = 1
      that.data.start_time_section[1].tg = 0
      that.data.start_time_section[2].tg = 0
    }
    if (days == 7) {
      that.data.start_time_section[0].tg = 0
      that.data.start_time_section[1].tg = 1
      that.data.start_time_section[2].tg = 0
    }
    if (days == 30) {
      that.data.start_time_section[0].tg = 0
      that.data.start_time_section[1].tg = 0
      that.data.start_time_section[2].tg = 1
    }
    if (days !== 30 && days !== 3 && days !== 7) {
      that.data.start_time_section[0].tg = 0
      that.data.start_time_section[1].tg = 0
      that.data.start_time_section[2].tg = 0
    }
    that.setData({
      start_time_section: that.data.start_time_section
    })
  },
  // 获取时间
  gain_while() {
    var that = this
    var strs = []
    var strs1 = []
    var strs2 = []
    for (let i = 0; i < 100; i++) {
      var date = new Date(new Date().toLocaleDateString()).getTime() + (i * 24 * 60 * 60 * 1000)
      let year = new Date(date).getFullYear()
      let month = (new Date(date).getMonth() + 1) > 9 ? new Date(date).getMonth() + 1 : '0' + (new Date(date).getMonth() + 1)
      let day = new Date(date).getDate() > 9 ? new Date(date).getDate() : '0' + new Date(date).getDate()
      var str = year + '-' + month + '-' + day
      strs.push(str)
    }
    for (let i = 1; i < 100; i++) {
      var date = new Date(new Date().toLocaleDateString()).getTime() + (i * 24 * 60 * 60 * 1000)
      let year = new Date(date).getFullYear()
      let month = (new Date(date).getMonth() + 1) > 9 ? new Date(date).getMonth() + 1 : '0' + (new Date(date).getMonth() + 1)
      let day = new Date(date).getDate() > 9 ? new Date(date).getDate() : '0' + new Date(date).getDate()
      var str1 = year + '-' + month + '-' + day
      strs1.push(str1)
    }
    for (let i = 0; i < 16; i++) {
      if (i == 0) {
        strs2.push({
          t: '全部',
          tg: 1,
          stamp: ''
        })
      } else {
        var date = new Date(new Date().toLocaleDateString()).getTime() + ((i - 1) * 24 * 60 * 60 * 1000)
        let month = (new Date(date).getMonth() + 1) > 9 ? new Date(date).getMonth() + 1 : '0' + (new Date(date).getMonth() + 1)
        let day = new Date(date).getDate() > 9 ? new Date(date).getDate() : '0' + new Date(date).getDate()
        let year = new Date(date).getFullYear()
        var str2 = month + '月' + day + '日'
        strs2.push({
          t: str2,
          tg: 0,
          stamp: year + '-' + month + '-' + day
        })
      }

    }
    var str_s = []
    str_s.push(strs, strs1)
    str_s[0][0] = '今天'
    that.setData({
      multiArray: str_s,
      multiArray1: strs2
    })

  },
  // 最低价
  min_price(e) {
    var that = this
    that.setData({
      min_price: e.detail.value
    })
  },
  // 最高价
  max_price(e) {
    var that = this
    that.setData({
      max_price: e.detail.value
    })
  },
  // 开拍时间选择
  changelabe1: function (e) {
    var that = this
    var index = e.currentTarget.dataset.key;
    if (index == 0) {
      if (that.data.start_time_section[0].tg == 1) {
        that.data.start_time_section[0].tg = 0;
      } else if (that.data.start_time_section[0].tg == 0) {
        that.data.start_time_section[0].tg = 1;
      }
      that.data.start_time_section[1].tg = 0;
      that.data.start_time_section[2].tg = 0;
      var sign = 3
    }
    if (index == 1) {
      if (that.data.start_time_section[1].tg == 1) {
        that.data.start_time_section[1].tg = 0;
      } else if (that.data.start_time_section[1].tg == 0) {
        that.data.start_time_section[1].tg = 1;
      }
      that.data.start_time_section[0].tg = 0;
      that.data.start_time_section[2].tg = 0;
      var sign = 7
    }
    if (index == 2) {
      if (that.data.start_time_section[2].tg == 1) {
        that.data.start_time_section[2].tg = 0;
      } else if (that.data.start_time_section[2].tg == 0) {
        that.data.start_time_section[2].tg = 1;
      }
      that.data.start_time_section[1].tg = 0;
      that.data.start_time_section[0].tg = 0;
      var sign = 30
    }
    that.setData({
      start_time_section: that.data.start_time_section,
      end_time: (new Date(new Date().toLocaleDateString()).getTime() + (sign * 24 * 60 * 60 * 1000)) / 1000,
      start_time: new Date(new Date().toLocaleDateString()).getTime() / 1000
    });
  },
  // 币种选择
  changelabe: function (e) {
    var that = this
    var index = e.currentTarget.dataset.key;
    if (e.currentTarget.dataset.id == 0) {
      that.setData({
        str_s: '0'
      })
      for (let i = 0; i < that.data.currency.length; i++) {
        that.data.currency[i].state = 0;
      }
      if (e.currentTarget.dataset.type == 1){
        that.data.currency[0].state =0;
      }else{
        that.data.currency[0].state = 1;
      }
      that.setData({
        currency: that.data.currency,
      });
    } else {
      that.data.currency[0].state = 0;
      if (that.data.currency[index].state == 1) {
        that.data.currency[index].state = 0;
      } else if (that.data.currency[index].state == 0) {
        that.data.currency[index].state = 1;
      }
      that.setData({
        currency: that.data.currency,
      });
      let str = []
      for (var i = 0; i < that.data.currency.length; i++) {
        if (that.data.currency[i].state == 1) {
          str = that.data.currency[i].id + "," + str
          that.setData({
            str_s: str
          })
        }
      }
    }
  },
  // 获取分类id
  tapClassify: function (e) {
    var that = this
    that.setData({
      classid: e.currentTarget.dataset.id,
      all_id: '0'
    })
  },
  // 首页分类
  classify_home() {
    var that = this
    that.tokens()
    wx.request({
      url: app.api.category + '?type=2',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          class: b.data.data[0].children
        })
        let clss = []
        let all_clss = []
        for (let i = 0; i < that.data.class.length; i++) {
          for (let i1 = 0; i1 < that.data.class[i].children.length; i1++) {
            clss.push(that.data.class[i].children[i1])
            all_clss.push({ name: that.data.class[i].children[i1].cate_name, id: that.data.class[i].children[i1].cate_id })
          }
        }
        that.setData({
          all_clss: all_clss
        })
      }
    })
  },
  // 币种
  currency() {
    var that = this
    wx.request({
      url: app.api.currency,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        let currency = []
        for (let i = 0; i < b.data.data.length; i++) {
          currency.push({
            id: b.data.data[i].currency_id,
            name: b.data.data[i].currency_name,
            state: 0,
          })
        }
        that.setData({
          currency: currency
        })
      }
    })
  },
  // 获取拍品数据
  list() {
    const that = this
    const n = t.code(that.data.value)
    wx.request({
      url: app.api.globallist+ n+ '&cate_id=' + that.data.cate_id + '&price_sort=' + that.data.price_sort + '&time_sort=' + that.data.time_sort + '&min_price=' + that.data.min_price + '&max_price=' + that.data.max_price + '&currency=' + that.data.str_s + '&start_time=' + that.data.start_time + '&end_time=' + that.data.end_time+'&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode==204){
          that.setData({
            select: null,
          })
        }
        if (b.statusCode == 200) {
          that.setData({
            select: b.data.data,
          })
          let json = []
          let jsons = []
          for (let i = 0; i < b.data.data.length; i++) {
            json.push(t.formatDateTime(b.data.data[i].start_time * 1000))
            jsons.push({
              state: 0,
            })
          }
          that.setData({
            starttime1: json,
            select_s: jsons
          })
          that.width()
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
    const that=this
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
    const that=this
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
    console.log(that.data.select.scroll_id)
    wx.request({
      url: app.api.globallist + n + '&cate_id=' + that.data.cate_id + '&price_sort=' + that.data.price_sort + '&time_sort=' + that.data.time_sort + '&min_price=' + that.data.min_price + '&max_price=' + that.data.max_price + '&currency=' + that.data.str_s + '&start_time=' + that.data.start_time + '&end_time=' + that.data.end_time+'&page='+that.data.page,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.data== '') {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
        } else {
          var moment_list = that.data.select;
          var json = that.data.select_s;
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.select.push(res.data.data[i]);
            json.push({
              state: 0
            })
          }
          // 设置数据  
          that.setData({
            select: that.data.select,
            select_s: that.data.select_s,
            page: Number(that.data.page) + 1
          })
          let a = that.data.select
          let time = []
          for (let i = 0; i < a.length; i++) {
            time.push(
              t.formatDateTime(a[i].start_time * 1000)
            )
          }
          that.setData({
            starttime1: time
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
  // 全球拍分类
  // 排序接口调用
  // 价格排序
  cla_close1(e) {
    var that = this
    that.setData({
      sort4: 0,
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname1: e.target.dataset.name,
      price_sort: e.target.dataset.type
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  // 开拍时间
  cla_close2(e) {
    var that = this
    that.setData({
      sort4: 0,
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname2: e.target.dataset.name,
      time_sort: e.target.dataset.type
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  // 筛选
  cla_close4(e) {
    var that = this
    that.setData({
      sort4: 0,
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname4: e.target.dataset.name,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  // 分类
  cla_close3(e) {
    var that = this
    that.setData({
      sort4: 0,
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname3: e.target.dataset.name,
    })
  },
  // 全部分类
  all_tapClassify: function (e) {
    var that = this
    that.setData({
      all_id: '1',
      classid: '-1',
      cate_id: '',
      sortname3: '全部',
      g_name:'',
      sort4: 0,
      sort3: 0,
      sort2: 0,
      sort1: 0,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  gain(e) {
    var that = this
    that.setData({
      cate_id: e.currentTarget.dataset.id,
      sort4: 0,
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname3: e.currentTarget.dataset.name,
      g_name: e.currentTarget.dataset.name
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  all_gain(e) {
    var that = this
    that.setData({
      cate_id: e.currentTarget.dataset.id,
      sort4: 0,
      sort3: 0,
      sort2: 0,
      sort1: 0,
      sortname3: e.currentTarget.dataset.name,
      g_name: e.currentTarget.dataset.name
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    wx.showLoading({
      title: '加载中'
    })
    that.list()
  },
  // 重置
  reset() {
    var that = this
    // 重置币种
    for (let i = 0; i < that.data.currency.length; i++) {
      that.data.currency[i].state = 0;
    }
    for (let i1 = 0; i1 < that.data.start_time_section.length; i1++) {
      that.data.start_time_section[i1].tg = 0;
    }
    that.setData({
      currency: that.data.currency,
      start_time_section: that.data.start_time_section,
      str_s: '',
      // 重置价格区间
      min_price: '',
      max_price: '',
      // 重置开拍时间
      end_time: '',
      start_time: '',
    })
  },
  // 筛选确认
  screen_confirm() {
    let that = this
    // min_price: 筛选最低价
    // max_price: 筛选最高价
    // start_time
    // end_time
    if (that.data.min_price > that.data.max_price || that.data.end_time - that.data.start_time < 0) {
      wx.showToast({
        title: '出价不符合规则',
        icon: 'none'
      })
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
      this.list()
      this.setData({
        sort4: 0,
        sort3: 0,
        sort2: 0,
        sort1: 0,
      })
    }
  },
  // 收藏
  collect(e) {
    var that = this
    that.button()
    that.tokens()
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
  offcollect(e) {
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
  goglobalgoods(e) {
    wx.navigateTo({
      url: '../../../pages/videos/global?id=' + e.currentTarget.dataset.id,
    })
  },

  // 排序筛选新
  sort1(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    if (id == 0 && that.data.sortname1 !== '价格') {
      that.setData({
        sort1: 1,
        sort2: 0,
        sort3: 0,
        sort4: 0,
      })
    }else{
      that.setData({
        sort1: e.currentTarget.dataset.id,
        sort2: 0,
        sort3: 0,
        sort4: 0,
      })
    }
  },
  sort2(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    if (id == 0 && that.data.sortname1 !== '时间') {
      that.setData({
        sort2: 1,
        sort1: 0,
        sort3: 0,
        sort4: 0
      })
    }else{
      that.setData({
        sort2: e.currentTarget.dataset.id,
        sort1: 0,
        sort3: 0,
        sort4: 0
      })
    }
  },
  sort3(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    if (id == 0 && that.data.sortname3 !== '分类') {
      that.setData({
        sort3: 1,
        sort1: 0,
        sort4: 0,
        sort2: 0
      })
    }else{
      that.setData({
        sort3: e.currentTarget.dataset.id,
        sort1: 0,
        sort2: 0,
        sort4: 0
      })
    }
  },
  sort4(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    that.setData({
      sort4: e.currentTarget.dataset.id,
      sort2: 0,
      sort1: 0,
      sort3: 0
    })
  },
  close() {
    const that = this
    that.setData({
      sort1: 0,
      sort2: 0,
      sort3: 0,
      sort4: 0,
    })
  },
  open(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        sort1: 1,
        sort2: 0,
        sort3: 0,
        sort4: 0,
      })
    }
    if (id == 2) {
      that.setData({
        sort1: 0,
        sort2: 1,
        sort3: 0,
        sort4: 0,
      })
    }
    if (id == 3) {
      that.setData({
        sort1: 0,
        sort2: 0,
        sort3: 1,
        sort4: 0,
      })
    }
    if (id == 4) {
      that.setData({
        sort1: 0,
        sort2: 0,
        sort4: 1,
        sort3: 0
      })
    }
  }
})