const common = require('../common/common.js')
const relanding = require('../common/relanding.js')
const t = require('../common/time.js')
const app = getApp()
const login = require('../common/login.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    navHs: '',
    navHs_s: '',
    width: '',
    navHst:'',
    auchotwidth: '',
    auchousewidth: '',
    goodheight:'',
    headtitle: '',
    header: {},
    token: '',
    scrollTop:'',
    istime: 0,
    isgoods: 0,
    nav: [{ type: '0', name: '首页' }, { type: '1', name: '全球拍' }, { type: '2', name: '国内拍' }],
    fourbox: [
      { type: 'oldgoods', name1: '老货入口', name2: '精品老货', name3:'老货', img: '../img/homepage/h1.png' },
      { type: 'soon', name1: '即将结束', name2: '极速捡漏', name3: '即将结束', img: '../img/homepage/h2.png' },
      { type: 'crafts', name1: '工艺品/珠宝', name2: '精致有趣', name3: '工艺品/珠宝', img: '../img/homepage/h3.png' },
      { type: 'zero', name1: '0元起', name2: '好物0元拍', name3: '0元起', img: '../img/homepage/h4.png' }
    ],
    nav3: [{ type: '0', name: '推荐' }, { type: '1', name: '老货' }, { type: '2', name: '工艺品' }, { type: '3', name: '0元起' }, { type: '4', name: '即将结束' }],
    sign1: '0',
    navindex: 0,
    class1: [],
    banner: [],
    select: [],
    select_s:[],
    auchouse: [],
    auc_banner: [],
    starttime: [],
    starttime1: [],
    endclock: [],
    multiArray1: [],
    auction_list: null,
    auction_lists:null,
    goodslist: null,
    page: 2,
    collection: '0',
    auction_stamptime: '',
    scrollleft: '0',
    id:'',
    interval:'',
    interval1:'',
    scene:'',
    // 左划
    class_swiper_current: 0,
    swiper_current:0,
    rclass:null,
    // 拍卖会
    cal_height: '',
    heights: '',
    height1: '',
    style: 'position:absolute;',
    setInterval: null,
    auction_stamptime: '',
    auction_list: null,
    endclock: null,
    date_o: '今天',
    data_time:'',
    date_w: '',
    pagescroll: '',
    pagescroll1: '',
    pagescroll2: 'margin-right: 3px;',
    scrolli: 0,
    is_calmaskbox:1,
    time_count:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight + 41,
      navHst: app.globalData.navHeight + 48,
      navHs_s: app.globalData.navHeight + 44 + 52,
      height: wx.getSystemInfoSync().windowHeight - app.globalData.navHeight,
      scene: app.globalData.scene
    })
    that.tokens()
    that.obtain_classification()
    that.obtain_banner()
    that.obtain_Selected()
    that.obtain_auchouse()
    that.auction_list()
    that.obtain_goodslist()
    that.gain_while()
    // 接收推荐人id
    let u = options.share_id
    if (options.share_id == undefined) {
      u = ''
    }
    if (u !== '') {
      let s = wx.getStorageSync('share_id');
      if (!s) {
        t.share(options.share_id)
      } else {}
    }
  },
  // 登陆头部定义
  tokens() {
    const that=this
    that.setData({
      header: t.logintype()
    })
  },
  //点击登陆
  btn_sub: function () {
    const that = this
    login.userLogin()
    setTimeout(function(){
      that.tokens()
    }, 1000)
  },
  // 登陆判断
  button() {
    const that = this
    const token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {
      that.tokens()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    setInterval(function () {
      if (that.data.scrolli == 1) {
        that.setData({
          pagescroll: 'transform: translatex(0);transition: all 1s;',
          pagescroll1: 'transform:rotate(0);transition: all 1s;',
        })
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    const id = that.data.sign1
    wx.showLoading({
      title: '加载中'
    })
    that.setData({
      page:2
    },()=>{
      if (id == 0) {
        that.obtain_classification()
        that.obtain_banner()
        that.obtain_Selected()
      }
      if (id == 1) {
        that.auction_list()
        that.obtain_auchouse()
      }
      if (id == 2) {
        that.obtain_goodslist()
      }
    })
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    const id = that.data.sign1
    wx.showLoading({
      title: '加载中'
    })
    if (id == 0) {
      wx.request({
        url: app.api.newglobal+'?page='+that.data.page,
        data: {},
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            t.alert('没有更多')
          } if (res.statusCode == 200) {
            var moment_list = that.data.select;
            var json = that.data.select_s;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
              json.push({
                state:0
              })
            }
            that.setData({
              select: that.data.select,
              select_s: that.data.select_s,
              page:Number(that.data.page)+1
            },()=>{
              let a = that.data.select
              let time = []
              for (let i = 0; i < a.length; i++) {
                time.push(
                  t.formatDateTime(a[i].start_time * 1000)
                )
              }
              that.setData({
                starttime1: time
              },()=>{
                wx.hideLoading();
              })
            })
          }
          if (res.statusCode == 422){
            t.alert(res.data.message)
          }
        }
      })
    }
    if (id == 1) {
      wx.request({
        url: app.api.newauctionlist + that.data.auction_stamptime + '&page=' + that.data.page,
        data: {},
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } if (res.statusCode == 200) {
            var moment_list = that.data.auction_list;
            var moment_lists = that.data.auction_lists;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
              moment_lists.push({
                state: 0
              })
            }
            that.setData({
              auction_list: that.data.auction_list,
              auction_lists: that.data.auction_lists,
              page: Number(that.data.page) + 1
            },()=>{
              that.auc_clock()
              wx.hideLoading();
            })
          }
          if (res.statusCode == 422) {
            wx.hideLoading();
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      })
    }
    if (id == 2) {
      let url = ''
      if (that.data.navindex == 0) {
        url = app.api.newgoodslist + 'hot&page='
      }
      if (that.data.navindex == 1) {
        url = app.api.newgoodslist + 'oldgoods&page='
      }
      if (that.data.navindex == 2) {
        url = app.api.newgoodslist + 'crafts&page='
      }
      if (that.data.navindex == 3) {
        url = app.api.newgoodslist + 'zero&page='
      }
      if (that.data.navindex == 4) {
        url = app.api.newgoodslist + 'soon&page='
      }
      if (that.data.goodslist !== null) {
        wx.request({
          url: url + that.data.page,
          data: {},
          header: t.logintype(),
          method: 'get',
          success(res) {
            if (res.statusCode == 204) {
              t.alert('没有更多')
            } if (res.statusCode == 200) {
              var moment_list = that.data.goodslist;
              for (var i = 0; i < res.data.data.length; i++) {
                moment_list.push(res.data.data[i]);
              }
              that.setData({
                goodslist: that.data.goodslist,
                page: Number(that.data.page) + 1
              },()=>{
                wx.hideLoading();
              })
            }
            if (res.statusCode == 422) {
              t.alert(res.data.message)
            }
          }
        })
      }else{
        wx.hideLoading();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  headclick(e) {
    let that = this
    that.gotop()
    that.setData({
      sign1: e.currentTarget.dataset.id,
      page: 2,
      isgoods:0,
      istime:0
    })
  },
  head3click(e) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      navindex: e.currentTarget.dataset.id,
      page: 2
    },()=>{
      that.obtain_goodslist()
    })
    if (that.data.scrollTop>=23){
      wx.pageScrollTo({
        scrollTop: 23,
        duration: 0,
      })
    }
  },
  // 获取首页全球拍分类
  obtain_classification() {
    let that = this
    wx.request({
      url: app.api.category + '?type=3',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        let class_show = b.data.data.children
        class_show.push({
          cate_icon: "../img/homepage/home_btn_more.png",
          cate_id: 315,
          cate_name: "查看更多",
          type: 'more'
        })
        var N = 5
        var R = [], F;
        for (F = 0; F < class_show.length;) {
          R.push(class_show.slice(F, F += N))
        }
        that.setData({
          class1: b.data.data.children,
          rclass: R
        }, () => {
          wx.hideLoading();
          wx.stopPullDownRefresh()
        })
        if (b.data.data.children.length * 80 > wx.getSystemInfoSync().windowWidth) {
          that.setData({
            width: b.data.data.children.length * 80 + 100
          })
        } else {
          that.setData({
            width: '100%'
          })
        }
      }
    })
  },
  // 获取首页轮播图
  obtain_banner() {
    let that = this
    wx.request({
      url: app.api.banner,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          banner: b.data.data.slide,
          auc_banner: b.data.data.auction,
        },()=>{
          wx.hideLoading();
          wx.stopPullDownRefresh()
        })
        if (b.data.data.auction.length * 128 > wx.getSystemInfoSync().windowWidth) {
          that.setData({
            auchotwidth: b.data.data.auction.length * 148
          })
        } else {
          that.setData({
            auchotwidth: '100%'
          })
        }
        const storage = [];
        for (let i = 0; i < b.data.data.auction.length; i++) {
          storage.push(
            t.daytime(b.data.data.auction[i].start_time*1000)
          )
        }
        that.setData({
          starttime: storage,
        })
      }
    })
  },
  // 首页全球拍热门拍卖行
  obtain_auchouse() {
    let that = this
    wx.request({
      url: app.api.hot_auchouse,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode==200){
          that.setData({
            auchouse: b.data.data,
          }, () => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
          })
          if (b.data.data.length * 297 > wx.getSystemInfoSync().windowWidth) {
            that.setData({
              auchousewidth: b.data.data.length * 297
            })
          } else {
            that.setData({
              auchousewidth: '100%'
            })
          }
        }else if (b.statusCode == 204){
          that.setData({
            auchouse: null,
          },()=>{
            wx.hideLoading()
            wx.stopPullDownRefresh()
          })
        }else{}
      }
    })
  },
  // 获取热门精选
  obtain_Selected() {
    let that = this
    wx.request({
      url: app.api.newglobal+'?page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode==200){
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
          },()=>{
            const query = wx.createSelectorQuery()
            query.select('.selectli').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function (res) {
              that.setData({
                goodheight: res[0].width
              })
            })
            wx.hideLoading();
            wx.stopPullDownRefresh()
          })
        }else if (b.statusCode == 204) {
          that.setData({
            select: null,
          }, () => {
            wx.hideLoading();
            wx.stopPullDownRefresh()
          })
        }else{}
      }
    })
  },
  // 获取时间
  gain_while() {
    var that = this
    var strs2 = []
    for (let i = 0; i < 16; i++) {
      if (i == 0) {
        strs2.push({
          t: '全部',
          tg: 1,
          stamp: ''
        })
      } else {
        const str2 = t.monthday(new Date(new Date().toLocaleDateString()).getTime() + ((i) * 24 * 60 * 60 * 1000))[0].str2
        const stamp = t.monthday(new Date(new Date().toLocaleDateString()).getTime() + ((i) * 24 * 60 * 60 * 1000))[0].stamp
        strs2.push({
          t: str2,
          tg: 0,
          stamp: stamp
        })
      }
    }
    that.setData({
      multiArray1: strs2
    })
  },
  // 全球拍拍卖会列表(旧版)
  auction_list() {
    var that = this
    wx.request({
      url: app.api.newauctionlist + that.data.auction_stamptime + '&page=1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 204) {
          that.setData({
            auction_list: null
          })
          clearInterval(that.data.interval)
          wx.hideLoading();
          wx.stopPullDownRefresh()
        } else {
          let json = []
          for (let i = 0; i < a.data.data.length; i++) {
            json.push({ state: 0 })
          }
          that.setData({
            auction_list: a.data.data,
            auction_lists: json
          },()=>{
            that.auc_clock()
            wx.hideLoading();
            wx.stopPullDownRefresh()
          })
        }
      }
    })
  },
  // 拍卖会开拍倒计时
  auc_clock() {
    let that = this
    if (that.data.auction_list!==null){
      that.data.interval = setInterval(function () {
        const storage = [];
        if (that.data.auction_list !== null) {
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
    }
  },
  // 国内拍拍品列表
  obtain_goodslist() {
    let that = this
    let url = ''
    if (that.data.navindex == 0) {
      url = app.api.newgoodslist + 'hot&page=1'
    }
    if (that.data.navindex == 1) {
      url = app.api.newgoodslist + 'oldgoods&page=1'
      that.setData({
        scrollleft: '0'
      })
    }
    if (that.data.navindex == 2) {
      url = app.api.newgoodslist + 'crafts&page=1'
    }
    if (that.data.navindex == 3) {
      url = app.api.newgoodslist + 'zero&page=1'
      that.setData({
        scrollleft: '100px'
      })
    }
    if (that.data.navindex == 4) {
      url = app.api.newgoodslist + 'soon&page=1'
      that.setData({
        scrollleft: '100px'
      })
    }
    wx.request({
      url: url,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        if (a.statusCode == 204) {
          that.setData({
            goodslist: null
          }, () => {
            wx.hideLoading()
          })
        } else {
          that.setData({
            goodslist: a.data.data
          },()=>{
            wx.hideLoading()
          })
        }
      }
    })
  },
  // 首页分类点击
  goclasspage(e) {
    let that = this
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: '../../pageA/pages/classifypage/classifypage?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
      })
    } else if (e.currentTarget.dataset.type=='more'){
      wx.reLaunch({
        url: '../classify/classify',
      })
    }else {
      wx.navigateTo({
        url: '../../pageA/pages/classifypage/globalclass?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
      })
    }
  },
  // 跳转不同页面
  gourl(e) {
    let that = this
    let num = Number(t.GetUrlRelativePath(e.currentTarget.dataset.url).length) - 1
    let type = t.GetUrlRelativePath(e.currentTarget.dataset.url)[0]
    let id = t.GetUrlRelativePath(e.currentTarget.dataset.url)[num]
    if (type == 'webview') {
      wx.navigateTo({
        url: '../my/Agreement/Agreement?src=' + t.replaceSpecialChar(t.GetUrlRelativePath(e.currentTarget.dataset.url)[2]),
      })
    }
    if (type == 'global_auction_list') {
      // 跳转到全球拍拍卖会列表：bjcbapp://global_auction_list/auction_id/{auction_id}
      wx.navigateTo({
        url: '../videos/auction?id=' + id,
      })
    }
    if (type == 'global_goods_detail') {
      // 跳转到全球拍商品详情：bjcbapp://global_goods_detail/goods_id/{goods_id}
      wx.navigateTo({
        url: '../videos/global?id=' + id,
      })
    }
    if (type == 'seller_detail') {
      //跳转到个人主页
      wx.navigateTo({
        url: '../person/person?id=' + id,
      })
    }
    if (type == 'global_seller_list') {
      //跳转到全球拍拍卖行列表：bjcbapp:///seller_id/{seller_id}
      wx.navigateTo({
        url: '../videos/auction_house?id=' + id,
      })
    }
    if (type == 'goods_detail') {
      //跳转到宝库商品详情：bjcbapp://goods_detail/shop/goods_id/{goods_id}
      //跳转到商品详情页：bjcbapp://goods_detail/goods/goods_id/{goods_id}
      if (t.GetUrlRelativePath(e.currentTarget.dataset.url)[1] == 'shop') {
        wx.navigateTo({
          url: '../videos/commoditydetails?id=' + id,
        })
      } else {
        wx.navigateTo({
          url: '../videos/videos?id=' + id,
        })
      }
    }
  },
  // 热拍跳转拍卖会
  goauction(e) {
    let that = this
    wx.navigateTo({
      url: '../videos/auction?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转拍品详情
  goglobalgoods(e) {
    let that = this
    wx.navigateTo({
      url: '../videos/global?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转拍卖会列表
  goauctionlist() {
    let that = this
    wx.navigateTo({
      url: '../../pageA/pages/auction/auction',
      // url: '../../pageA/pages/auction/calendar',
    })
  },
  // 跳转拍卖会列表
  goauctionhouselist() {
    let that = this
    that.setData({
      is_calmaskbox:1
    })
    wx.navigateTo({
      url: '../../pageA/pages/auctionhouse/auctionhouse',
    })
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
          t.alert(a.data.message)
          that.data.select_s[e.currentTarget.dataset.ids].state = 1
          that.setData({
            select_s: that.data.select_s
          })
        } else if (a.statusCode == 422) {
          t.alert(a.data.message)
        }
        else {
          relanding.relanding()
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
          t.alert(a.data.message)
        } else if (a.statusCode == 422) {
          t.alert(a.data.message)
        } else {
          relanding.relanding()
        }
        that.data.select_s[e.currentTarget.dataset.ids].state = 0
        that.setData({
          select_s: that.data.select_s
        })
      }
    })
  },
  // 跳转拍卖行详情
  goauchouse(e) {
    let that = this
    wx.navigateTo({
      url: '../videos/auction_house?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转拍品详情
  govideos(e) {
    let that = this
    wx.navigateTo({
      url: '../videos/videos?id=' + e.currentTarget.dataset.id,
    })
  },
  // 拍卖会时间选择
  changelabe2: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var index = e.currentTarget.dataset.key;
    for (let i = 0; i < that.data.multiArray1.length; i++) {
      that.data.multiArray1[i].tg = 0;
    }
    that.setData({
      multiArray1: that.data.multiArray1,
      page:2
    });
    if (that.data.multiArray1[index].tg == 1) {
      that.data.multiArray1[index].tg = 1;
    } else if (that.data.multiArray1[index].tg == 0) {
      that.data.multiArray1[index].tg = 1;
    }
    that.setData({
      multiArray1: that.data.multiArray1,
      auction_stamptime: that.data.multiArray1[index].stamp
    },()=>{
      that.auction_list()
    });
    if (that.data.scrollTop >= 351) {
      wx.pageScrollTo({
        scrollTop: 351,
        duration: 0,
      })
    }
    
  },
  // 扫一扫
  scancode() {
    let that = this
    wx.scanCode({
      success(res) {
        var type = t.getUrlParam(res.result).type, name = t.getUrlParam(res.result).name, id = t.getUrlParam(res.result).id
        if (id =='user_id'){
          wx.navigateTo({
            url: '../person/person?id=' + name,
          })
        }
        if (type == 'goods') {
          wx.navigateTo({
            url: '../videos/videos?id=' + name,
          })
        }
        if (type == 'global_goods') {
          wx.navigateTo({
            url: '../videos/global?id=' + name,
          })
        }
        if (type == 'treasury') {
          wx.navigateTo({
            url: '../videos/commoditydetails?id=' + name,
          })
        }
        if (type == 'global'){
          wx.navigateTo({
            url: '../videos/auction?id=' + name,
          })
        }
      },
      fail() {}
    })
  },
  gochans(e){
    let that=this
    wx.navigateTo({
      url: '../../pageA/pages/search/searchpage?id=' + e.currentTarget.dataset.type + '&type=2' + '&value=' + e.currentTarget.dataset.name3,
    })
  },
  // 监听页面滑动
  onPageScroll: function (ev) {
    var that = this
    that.setData({
      scrollTop: ev.scrollTop
    })
    if (that.data.sign1 == 1) {
      if (ev.scrollTop > 348 || ev.scrollTop == 348) {
        that.setData({
          istime: 1
        })
      } else {
        that.setData({
          istime: 0
        })
      }
    }
    if (that.data.sign1 == 2) {
      if (ev.scrollTop > 23 || ev.scrollTop == 23) {
        that.setData({
          isgoods: 1
        })
      } else {
        that.setData({
          isgoods: 0
        })
      }
    }
  },
  gotop(){
    let that=this
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  // 搜索页
  gosearch() {
    let that = this
    wx.navigateTo({
      url: '../../pageA/pages/search/search',
    })
  },
  forbidMove(e) { 
    return; 
  },
  // 收藏（取消）拍卖会
  global_collect(e) {
    var that = this
    that.button()
    that.tokens()
    wx.request({
      url: app.api.gloabl_auctioncollection,
      data: {
        auction_id: e.currentTarget.dataset.id,
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          t.alert(a.data.message)
          that.data.auction_lists[e.currentTarget.dataset.ids].state = 1
          that.setData({
            auction_lists: that.data.auction_lists
          })
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
        that.data.auction_lists[e.currentTarget.dataset.ids].state = 0
        that.setData({
          auction_lists: that.data.auction_lists
        })
      }
    })
  },
  launchAppError(e) {
    if (e.detail.errMsg == 'invalid scene') {
      wx.navigateTo({
        url: '../download/download',
      })
    }
  },
  bindchange(e) {
    const that = this
    that.setData({
      swiper_current: e.detail.current
    })
  },
  class_bindchange(e) {
    const that = this
    that.setData({
      class_swiper_current: e.detail.current
    })
  },
})