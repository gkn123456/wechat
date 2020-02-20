// pages/orderdetails/evaluate.js
const app = getApp()
var relanding = require('../common/relanding.js')
var form = require('../common/formid.js')
Page({
  data: {
    id:'',
    odetails: [],// 订单详情
    orderid: '',// 订单id
    flag: 0,  // 评分
    v: '1', // 匿名切换
    info: "",// 评价内容
    strs: [],// 标签
    hides:'none',
    hides1: 'none',
    hides2:'none',
    noteMaxLen: 200, // 最多字数
    noteNowLen: 0,//当前字数
    clock:'',
    lab:"",
    label1:[
      { "name": "做工粗糙", "state": 0},
      { "name": "与描述不符", "state": 0},
      { "name": "图物不符", "state": 0},
      { "name": "服务态度差", "state": 0 },
      { "name": "包装简陋", "state": 0 },
      { "name": "藏品损坏", "state": 0 },
      { "name": "发货慢", "state": 0 },
      { "name": "瑕疵显示", "state": 0 }
    ],
    label2: [
      { "name": "稍有瑕疵", "state": 0 },
      { "name": "稍有色差", "state": 0 },
      { "name": "图物相符", "state": 0 },
      { "name": "服务一般", "state": 0 },
      { "name": "包装一般", "state": 0 },
      { "name": "工艺一般", "state": 0 },
      { "name": "物流一般", "state": 0 },
      { "name": "售后一般", "state": 0 }
    ],
    label3: [
      { "name": "包装精美", "state": 0 },
      { "name": "发货快", "state": 0 },
      { "name": "成色很好", "state": 0 },
      { "name": "沟通及时", "state": 0 },
      { "name": "值得信赖", "state": 0 },
      { "name": "物超所值", "state": 0 },
      { "name": "服务贴心", "state": 0 },
      { "name": "捡到漏了", "state": 0 }
    ],
    navH: '',
    headtitle: '发表评价',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      orderid:options.id
    })
    // 订单信息
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.order_details + that.data.orderid,
          data: {},
          method: 'get',
          header: {
            "Authorization": 'bearer' + res.data,
            "content-type": "application/json",
            "cache-control": "no-cache, private",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success: function (a) {
            that.setData({
              odetails: a.data.data
            })
            const storage = [];
            var time1 = new Date(a.data.data.completion_time * 1000).getFullYear();  //订单完成年
            var time2 = new Date(a.data.data.completion_time * 1000).getMonth() + 1;//订单完成月
            var time3 = new Date(a.data.data.completion_time * 1000).getDate();     //订单完成日
            var time4 = new Date(a.data.data.completion_time * 1000).getHours();    //订单完成时
            var time5 = new Date(a.data.data.completion_time * 1000).getMinutes();  //订单完成分
            var time6 = new Date(a.data.data.completion_time * 1000).getSeconds(); //订单完成秒
              storage.push(
                time1 + "-" + time2 + "-" + time3 + ' ' + time4 + ":" + time5 + ":" + time6,
              )
            that.setData({
              clock: storage,
            })
          }
        })
      }
    })
  },
// 标签
onpa(){
  var that=this
  var str = []
  for (var i = 0; i < that.data.label1.length; i++) {
    if (that.data.label1[i].state == 1) {
      str.push(
        that.data.label1[i].name
      )
      that.setData({
        strs: str
      })
    }
  }
  for (var i = 0; i < that.data.label2.length; i++) {
    if (that.data.label2[i].state == 1) {
      str.push(
        that.data.label2[i].name
      )
      that.setData({
        strs: str
      })
    }
  }
  for (var i = 0; i < that.data.label3.length; i++) {
    if (that.data.label3[i].state == 1) {
      str.push(
        that.data.label3[i].name
      )
      that.setData({
        strs: str
      })
    }
  }
},
  changelabe: function (e) {
    var that=this
    var index = e.currentTarget.dataset.key;
    if (that.data.strs.length>2){
      if (that.data.label1[index].state == 1) {
        that.data.label1[index].state = 0;

      } else if (that.data.label1[index].state == 0) {
        wx.showToast({
          title: '最多只能选择三个标签',
          icon: 'none'
        })
      }
      that.setData({
        label1: that.data.label1,
      });
    }else{
      if (that.data.label1[index].state == 1) {
        that.data.label1[index].state = 0;
      } else if (that.data.label1[index].state == 0) {
        that.data.label1[index].state = 1;
      }
      that.setData({
        label1: that.data.label1,
      });
    }
    that.onpa()
  },
  changelabe1: function (e) {
    var that = this
    var index = e.currentTarget.dataset.key;
    if (that.data.strs.length > 2) {
      if (that.data.label2[index].state == 1) {
        that.data.label2[index].state = 0;
      } else if (that.data.label2[index].state == 0) {
        wx.showToast({
          title: '最多只能选择三个标签',
          icon: 'none'
        })
      }
      that.setData({
        label2: that.data.label2,
      });
    } else {
      if (that.data.label2[index].state == 1) {
        that.data.label2[index].state = 0;
      } else if (that.data.label2[index].state == 0) {
        that.data.label2[index].state = 1;
      }
      that.setData({
        label2: that.data.label2,
      });
    }
    that.onpa()
  },
  changelabe2: function (e) {
    var that = this
    var index = e.currentTarget.dataset.key;
    if (that.data.strs.length > 2) {
      if (that.data.label3[index].state == 1) {
        that.data.label3[index].state = 0;
      } else if (that.data.label3[index].state == 0) {
        wx.showToast({
          title: '最多只能选择三个标签',
          icon: 'none'
        })
      }
      that.setData({
        label3: that.data.label3,
      });
    } else {
      if (that.data.label3[index].state == 1) {
        that.data.label3[index].state = 0;
      } else if (that.data.label3[index].state == 0) {
        that.data.label3[index].state = 1;
      }
      that.setData({
        label3: that.data.label3,
      });
    }
    that.onpa()
  },
// 星星点击
  changeColor1: function () {
    var that = this;
    that.clears()
    that.setData({
      strs:[]
    })
    that.setData({
      flag: 1
    });
    that.onShow()
  },
  changeColor2: function () {
    var that = this;
    that.clears()
    that.setData({
      strs: []
    })
    that.setData({
      flag: 2
    });
    that.onShow()
  },
  changeColor3: function () {
    var that = this;
    that.clears()
    that.setData({
      strs: []
    })
    that.setData({
      flag: 3
    });
    that.onShow()
  },
  changeColor4: function () {
    var that = this;
    that.clears()
    that.setData({
      strs: []
    })
    that.setData({
      flag: 4
    });
    that.onShow()
  },
  changeColor5: function () {
    var that = this;
    that.clears()
    that.setData({
      strs: []
    })

    that.setData({
      flag: 5
    });
    that.onShow()
  },
  clears(){
    var that = this
    var str1=[]
    var str2 = []
    var str3 = []
    for (var i = 0; i < that.data.label1.length; i++) {
      that.data.label1[i].state = 0;
    }
    for (var i = 0; i < that.data.label2.length; i++) {
      that.data.label2[i].state = 0;
    }
    for (var i = 0; i < that.data.label3.length; i++) {
      that.data.label3[i].state = 0;
    }
    that.setData({
      label1: that.data.label1,
      label2: that.data.label2,
      label3: that.data.label3,
    })
  },
  // 监听字数
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({ info: value, noteNowLen: len })
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
    if (that.data.flag > 0 && that.data.flag < 3){
      that.setData({
        lab:'label1',
        hides:'block',
        hides1: 'none',
        hides2: 'none'
      })
    }
    if (that.data.flag == 3) {
      that.setData({
        lab: 'label2',
        hides: 'none',
        hides1: 'block',
        hides2: 'none'
      })
    }
    if (that.data.flag > 3) {
      that.setData({
        lab: 'label3',
        hides: 'none',
        hides1: 'none',
        hides2: 'block',
      })
    }
    wx.setNavigationBarTitle({
      title: '发表评价',
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
  onUnload: function (e) {
    
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
  // 匿名
  tipz1(){
    var that = this
    that.setData({
      v:'1'
    })
  },
  tipz2(){
    var that=this
    that.setData({
      v: '0'
    })
  },
  // 发布评价
  pubeval(){
    var that=this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.newappraise,
          data: {
            order_id:that.data.orderid,
            star:that.data.flag,
            desc: that.data.info,
            anonymous: that.data.v,
            seller_tag: that.data.strs,
          },
          method: 'post',
          header: {
            "Authorization": 'bearer ' + res.data,
            "content-type": "application/json",
            "cache-control": "no-cache, private",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success: function (a) {
            if (a.data.status_code==422){
              wx.showToast({
                title: a.data.message,
                icon: 'none'
              })
            }
            if (a.data.status_code == 200){
              setTimeout(function () {
                wx.redirectTo({
                  url: '../orderdetails/evsuccess',
                })
              }, 1500)
              
            }
          }
        })
      }
    })
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
  }
})