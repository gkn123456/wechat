// pageA/pages/collect/collect.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    nav: [{ nav_name: "全球拍", mark: "1" }, { nav_name: "拍卖会", mark: "2" },{ nav_name: "国内拍", mark: "0" },{ nav_name: "宝库 ", mark: "3" }],
    currentTab:'1',
    page:'2',
    navHs:'',
    choicechange:0,
    displays1:'none',
    list:[],
    list1:[],
    list2:[],
    list3:[],
    starttime:[],
    auc_starttime:[],
    // 管理状态值
    alladmin:'0',
    goods_type:'0',
    global_type:'0',
    auction_type: '0',
    treasure_type: '0',
    // 删除键状态值
    detetype:'0',
// 状态值数组
    // 普通拍品
    goodschoicelist:[],
    goodschoicelists:[],
    // 全球拍
    globalchoicelist: [],
    globalchoicelists: [],
    // 拍卖会
    auctionchoicelist:[],
    auctionchoicelists: [],
    // 宝库
    treasurychoicelist: [],
    treasurychoicelists: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight + 44,
      goodschoicelists: [],
      globalchoicelists: [],
      alladmin: '0',
      detetype: '0',
    })
    that.deta()
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
    var that = this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    that.setData({
      page:2
    })
    that.deta()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    if (that.data.currentTab == 0) {
      
      that.goods_onReachBottom()
    }
    if (that.data.currentTab == 1) {
      that.goods_onReachBottom()
    }
    if (that.data.currentTab == 2) {
      
      that.auction_onReachBottom()
    }
    if (that.data.currentTab == 3) {

      that.box_onReachBottom()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 点击事件
  // 一级头部点击
  deta(){
    let that=this
    that.setData({
      goodschoicelists: [],
      globalchoicelists: [],
      alladmin: '0',
      detetype: '0',
      choicechange:'0'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if (that.data.currentTab == 0) {
      that.list1()
    }
    if (that.data.currentTab == 1) {
      that.list1()
    }
    if (that.data.currentTab == 2) {
      that.list2()
    }
    if (that.data.currentTab == 3) {
      that.list3()
    }
  },
  swichNav: function (e) {
    var that = this
    that.setData({
      page: '2'
    })
    if (e !== undefined) {
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
        that.setData({
          currentTab: e.target.dataset.current,
        })
      }
    }
    that.deta()
  },
  // 拍品
  list1(){
    let that=this
    if (that.data.currentTab == 0) {
      wx.request({
        url: app.api.collect_goods + '1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (a) {
          wx.stopPullDownRefresh()
          wx.hideLoading();
          if (a.statusCode == 204) {
            that.setData({
              list: null,
              displays1: 'block'
            })
          } 
          if (a.statusCode == 200) {
            that.setData({
              list: a.data.data,
              displays1: 'none'
            })
          }
        }
      })
    } 
    if (that.data.currentTab ==1)  {
      wx.request({
        url: app.api.collect_global + '1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (a) {
          wx.stopPullDownRefresh()
          wx.hideLoading();
          if (a.statusCode == 204) {
            that.setData({
              list1: null,
              displays1: 'block'
            })
          } 
          if (a.statusCode == 200) {
            that.setData({
              list1: a.data.data,
              displays1: 'none'
            })
            let json = []
            for (let i = 0; i < a.data.data.length; i++) {
              json.push(t.formatDateTime(a.data.data[i].goods.start_time * 1000))
            }
            that.setData({
              auc_starttime: json
            })
          }
        }
      })
    }
  },
  // 拍卖会
  list2() {
    let that = this
    wx.request({
      url: app.api.collect_auction + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        wx.stopPullDownRefresh()
        wx.hideLoading();
        if (a.statusCode == 204) {
          that.setData({
            list2: null,
            displays1: 'block'
          })
        } 
        if (a.statusCode == 200){
          that.setData({
            list2: a.data.data,
            displays1: 'none'
          })
          that.data.interval = setInterval(function () {
            const storage = [];
            for (let i = 0; i < a.data.data.length; i++) {
              storage.push(
                t.countdown(a.data.data[i].auction.start_time)
              )
            }
            that.setData({
              starttime: storage,
            })
          }, 1000)
        }
      }
    })
  },
  // 宝库
  list3(){
    let that=this
    wx.request({
      url: app.api.collect_treasury + '1',
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (a) {
        wx.stopPullDownRefresh()
        wx.hideLoading();
        if (a.statusCode == 204) {
          that.setData({
            list3: null,
            displays1: 'block'
          })
        } 
        if (a.statusCode == 200) {
          that.setData({
            list3: a.data.data,
            displays1: 'none'
          })

        }

      }
    })
  },
  // 拍品上拉加载
  goods_onReachBottom(){
    let that=this
    if (that.data.currentTab == 0) {
      wx.request({
        url: app.api.collect_goods + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            t.alert('没有更多')
          }
          if (res.statusCode == 200){
            let list = that.data.list;
            for (let i = 0; i < res.data.data.length; i++) {
              list.push(res.data.data[i]);
            }
            that.setData({
              list: that.data.list,
              page: Number(that.data.page) + 1
            }) 
            wx.hideLoading();
            that.admin_complete()
          }
        }
      })
    } 
    if (that.data.currentTab == 1)  {
      wx.request({
        url: app.api.collect_global+that.data.page,
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (res) {
          if (res.statusCode == 204) {
            t.alert('没有更多')
          } 
          if (res.statusCode == 200){
            let list = that.data.list1;
            for (let i = 0; i < res.data.data.length; i++) {
              list.push(res.data.data[i]);
            }
            that.setData({
              list1: that.data.list1,
              page: Number(that.data.page) + 1
            })
            that.auc_starttime()
            that.admin_complete()
            
          }
          wx.hideLoading();
        }
      })
    }
  },
  auction_onReachBottom(){
    let that = this
    wx.request({
      url: app.api.collect_auction + that.data.page,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 204) {
          t.alert('没有更多')
        } 
        if (b.statusCode == 200) {
          let list = that.data.list2;
          for (let i = 0; i < b.data.data.length; i++) {
            list.push(b.data.data[i]);
          }
          that.setData({
            list2: that.data.list2,
            page: Number(that.data.page) + 1
          })
          that.starttime()
          wx.hideLoading();
          that.admin_complete()
        }
      }
    })
  },
  starttime(){
    let that=this
    clearInterval(that.data.interval);
    let a=that.data.list2
    that.data.interval = setInterval(function () {
      let time = []
      for (let i = 0; i < a.length; i++) {
        time.push(
          t.countdown(a[i].auction.start_time)
        )
      }
      that.setData({
        starttime: time
      })
    }, 1000)
  },
  auc_starttime() {
    let that = this
    let a = that.data.list1
    let time = []
    for (let i = 0; i < a.length; i++) {
      time.push(t.formatDateTime(a[i].goods.start_time*1000))
    }
    that.setData({
      auc_starttime: time
    })
  },
  box_onReachBottom(){
    let that = this
    wx.request({
      url: app.api.collect_treasury + that.data.page,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (res) {
        if (res.statusCode == 204) {
          t.alert('没有更多')
        } 
        if (res.statusCode == 200) {
          let list = that.data.list3;
          for (let i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          } 
          that.setData({
            list3: that.data.list3,
            page: Number(that.data.page) + 1
          })
          wx.hideLoading();
          that.admin_complete()
        }
      }
    })
  },
  // 管理
  admin(){
    let that=this
    that.setData({
      alladmin:'1'
    })
      if (that.data.currentTab == 0){
        if (that.data.list!==null){
          let goodschoice = []
          for (let i = 0; i < that.data.list.length; i++) {
            goodschoice.push({
              id: i,
              state: '0',
              goods_id: that.data.list[i].goods.goods_id
            })
          }
          that.setData({
            goodschoicelist: goodschoice
          })
        }
      } 
      if (that.data.currentTab == 1){
        if (that.data.list1 !== null){
          let goodschoice = []
          for (let i = 0; i < that.data.list1.length; i++) {
            goodschoice.push({
              id: i,
              state: '0',
              goods_id: that.data.list1[i].goods.goods_id
            })
          }
          that.setData({
            globalchoicelist: goodschoice
          })
        }
      }
    if (that.data.currentTab == 2) {
      if (that.data.list2 !== null){
        let auctionchoice = []
        for (let i = 0; i < that.data.list2.length; i++) {
          auctionchoice.push({
            id: i,
            state: '0',
            goods_id: that.data.list2[i].auction.id
          })
        }
        that.setData({
          auctionchoicelist: auctionchoice
        })
      }
    }
    if (that.data.currentTab == 3) {
      if (that.data.list3 !== null){
        let treasurychoice = []
        for (let i = 0; i < that.data.list3.length; i++) {
          treasurychoice.push({
            id: i,
            state: '0',
            goods_id: that.data.list3[i].goods_id
          })
        }
        that.setData({
          treasurychoicelist: treasurychoice
        })
      }
    }
  },
  // 管理完成
  admin_complete(){
    let that=this
    that.setData({
      alladmin: '0',
      choicechange:0,
    })
  },
  // 普通拍单独选择
  goods_choice_have(e){
    let that=this
      if (that.data.currentTab == 0){
        let num = e.currentTarget.dataset.id
        that.data.goodschoicelist[num].state = '1'
        that.setData({
          goodschoicelist: that.data.goodschoicelist,
        })
        that.is_deletebtn()
      } 
      if (that.data.currentTab == 1){
        let num = e.currentTarget.dataset.id
        that.data.globalchoicelist[num].state = '1'
        that.setData({
          globalchoicelist: that.data.globalchoicelist,
        })
        that.is_deletebtn()
      }
    if (that.data.currentTab == 2) {
      let num = e.currentTarget.dataset.id
      that.data.auctionchoicelist[num].state = '1'
      that.setData({
        auctionchoicelist: that.data.auctionchoicelist,
      })
      that.is_deletebtn()
    }
    if (that.data.currentTab == 3) {
      let num = e.currentTarget.dataset.id
      that.data.treasurychoicelist[num].state = '1'
      that.setData({
        treasurychoicelist: that.data.treasurychoicelist,
      })
      that.is_deletebtn()
    }
  },
  goods_choice_no(e){
    let that = this
      if (that.data.currentTab == 0) {
        let num = e.currentTarget.dataset.id
        that.data.goodschoicelist[num].state = '0'
        that.setData({
          goodschoicelist: that.data.goodschoicelist,
        })
        that.is_deletebtn()
      } 
      if (that.data.currentTab == 1){
        let num = e.currentTarget.dataset.id
        that.data.globalchoicelist[num].state = '0'
        that.setData({
          globalchoicelist: that.data.globalchoicelist,
        })
        that.is_deletebtn()
      }
    if (that.data.currentTab == 2) { 
      let num = e.currentTarget.dataset.id
      that.data.auctionchoicelist[num].state = '0'
      that.setData({
        auctionchoicelist: that.data.auctionchoicelist,
      })
      that.is_deletebtn()
    }
    if (that.data.currentTab == 3) {
      let num = e.currentTarget.dataset.id
      that.data.treasurychoicelist[num].state = '0'
      that.setData({
        treasurychoicelist: that.data.treasurychoicelist,
      })
      that.is_deletebtn()
     }
  },
  // 全部选择
  admin_alloptions(){
    let that = this
    that.setData({
      detetype: '1',
      choicechange:1,
    })
      if (that.data.currentTab == 0){
        for (let i = 0; i < that.data.goodschoicelist.length;i++){
          that.data.goodschoicelist[i].state = '1'
        }
        that.setData({
          goodschoicelist: that.data.goodschoicelist,
        })
      } if (that.data.currentTab == 1){
        for (let i = 0; i < that.data.globalchoicelist.length; i++) {
          that.data.globalchoicelist[i].state = '1'
        }
        that.setData({
          globalchoicelist: that.data.globalchoicelist,
        })
      }
    if (that.data.currentTab == 2) {
      for (let i = 0; i < that.data.auctionchoicelist.length; i++) {
        that.data.auctionchoicelist[i].state = '1'
      }
      that.setData({
        auctionchoicelist: that.data.auctionchoicelist,
      })
    }
    if (that.data.currentTab == 3) {
      for (let i = 0; i < that.data.treasurychoicelist.length; i++) {
        that.data.treasurychoicelist[i].state = '1'
      }
      that.setData({
        treasurychoicelist: that.data.treasurychoicelist,
      })
    }
  },
  // 全不选
  admin_allnooptions(){
    let that = this
    that.setData({
      detetype: '0',
      choicechange:0,
    })
      if (that.data.currentTab == 0) {
        for (let i = 0; i < that.data.goodschoicelist.length; i++) {
          that.data.goodschoicelist[i].state = '0'
        }
        that.setData({
          goodschoicelist: that.data.goodschoicelist,
        })
      } if (that.data.currentTab == 1){
        for (let i = 0; i < that.data.globalchoicelist.length; i++) {
          that.data.globalchoicelist[i].state = '0'
        }
        that.setData({
          globalchoicelist: that.data.globalchoicelist,
        })
      }
    if (that.data.currentTab == 2) {
      for (let i = 0; i < that.data.auctionchoicelist.length; i++) {
        that.data.auctionchoicelist[i].state = '0'
      }
      that.setData({
        auctionchoicelist: that.data.auctionchoicelist,
      })
    }
    if (that.data.currentTab == 3) {
      for (let i = 0; i < that.data.treasurychoicelist.length; i++) {
        that.data.treasurychoicelist[i].state = '0'
      }
      that.setData({
        treasurychoicelist: that.data.treasurychoicelist,
      })
    }
  },
  // 判断删除键
  is_deletebtn(){
    let that = this
    if (that.data.currentTab == 0) {
        let l=[]
        for (let i=0;i<that.data.goodschoicelist.length;i++){
          if (that.data.goodschoicelist[i].state=='0'){}else{
            l.push(i)
          }
        }
        if(l.length==0){
          that.setData({
            detetype: '0'
          })
        }else{
          that.setData({
            detetype: '1'
          })
        }
        
    } 
    if (that.data.currentTab == 1){
        let l = []
        for (let i = 0; i < that.data.globalchoicelist.length; i++) {
          if (that.data.globalchoicelist[i].state == '0') { } else {
            l.push(i)
          }
        }
        if (l.length == 0) {
          that.setData({
            detetype: '0'
          })
        } else {
          that.setData({
            detetype: '1'
          })
        }
      }
    if (that.data.currentTab == 2) {
      let l = []
      for (let i = 0; i < that.data.auctionchoicelist.length; i++) {
        if (that.data.auctionchoicelist[i].state == '0') { } else {
          l.push(i)
        }
      }
      if (l.length == 0) {
        that.setData({
          detetype: '0'
        })
      } else {
        that.setData({
          detetype: '1'
        })
      }
    }
    if (that.data.currentTab == 3) {
      let l = []
      for (let i = 0; i < that.data.treasurychoicelist.length; i++) {
        if (that.data.treasurychoicelist[i].state == '0') { } else {
          l.push(i)
        }
      }
      if (l.length == 0) {
        that.setData({
          detetype: '0'
        })
      } else {
        that.setData({
          detetype: '1'
        })
      }
    }
  },
  // 批量删除收藏
  deletebtn(){
    let that = this
    if (that.data.currentTab == 0) {
        let l = []
        for (let i = 0; i < that.data.goodschoicelist.length; i++) {
          if (that.data.goodschoicelist[i].state == '0') { } else {
            l.push(that.data.goodschoicelist[i].goods_id)
          }
        }
        wx.request({
          url: app.api.batch_cancel,
          data: {
            ids:l,
            type:'1'
          },
          method: 'delete',
          header: t.logintype(),
          success: function (res) {
            t.alert(res.data.message)
            that.onLoad()
          }
        })

    } if (that.data.currentTab == 1) {
        let l = []
        for (let i = 0; i < that.data.globalchoicelist.length; i++) {
          if (that.data.globalchoicelist[i].state == '0') { } else {
            l.push(that.data.globalchoicelist[i].goods_id)
          }
        }
        wx.request({
          url: app.api.batch_cancel,
          data: {
            ids: l,
            type: '3'
          },
          method: 'delete',
          header: t.logintype(),
          success: function (res) {
            t.alert(res.data.message)
            that.onLoad()
          }
        })
      }
    if (that.data.currentTab == 2) {
      let l = []
      for (let i = 0; i < that.data.auctionchoicelist.length; i++) {
        if (that.data.auctionchoicelist[i].state == '0') { } else {
          l.push(that.data.auctionchoicelist[i].goods_id)
        }
      }
      wx.request({
        url: app.api.batch_cancel,
        data: {
          ids: l,
          type: '4'
        },
        method: 'delete',
        header: t.logintype(),
        success: function (res) {
          t.alert(res.data.message)
          that.onLoad()
        }
      })
    }
    if (that.data.currentTab == 3) {
      let l = []
      for (let i = 0; i < that.data.treasurychoicelist.length; i++) {
        if (that.data.treasurychoicelist[i].state == '0') { } else {
          l.push(that.data.treasurychoicelist[i].goods_id)
        }
      }
      wx.request({
        url: app.api.batch_cancel,
        data: {
          ids: l,
          type: '2'
        },
        method: 'delete',
        header: t.logintype(),
        success: function (res) {
          t.alert(res.data.message)
          that.onLoad()
        }
      })
    }
  },
  goauction(e) {
    wx.navigateTo({
      url: '../../../pages/videos/auction?id=' + e.currentTarget.dataset.id,
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  }
})