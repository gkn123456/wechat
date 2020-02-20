const app = getApp()
const common = require('../common/common.js')
const t = require('../common/time.js')
const relanding = require('../common/relanding.js')
const form = require('../common/formid.js')
const login = require('../common/login.js')
const QR = require("../../utils/qrcode.js");
Page({
  data: {
    header:{},
    report: app.api.reportlist,
    videoallcomtpage:2,
    whethershare: 0,
    whethereport: 0,
    whetherposter: 0,
    comment_id:'',
    showSharePic: '',
    sharePicUrl:'',
    coverimg: '',
    coversize:'',
    page:2,
    videoshow:true,
    ismodal:true,
    flag_allcommt:true,
    navH:'',
    navHs: '',
    cct1:[],
    token:'',
    goodid:'',
    focus:false,
    wel:'none',
    videoid:'',
    details: {},
    user: {},
    covers:'',
    sizeheight:'',
    user_icon:'../img/my/usericons.png',
    vidisis:'none',
    evalvis:'none',
    evalvis1: 'none',
    videos: "",
    timeSpanStra:[],
    timeSpanStr:'',
    timeSpanStra1: [],
    timeSpanStra2:[],
    timeSpanStra3:[],
    timeSpanStr2:'',
    timeSpanStr1: '',
    timeSpanStr3:'',
    image: [],
    auto:'auto',
    releasetime:'',
    clock: '',
    clock1: '',
    clock2: '',
    clock3: '',
    pricedata: '',
    keys: [],
    values: [],
    countdown: '',
    clock1: '',
    evaluate: [],
    assess: [],
    id: 0,
    xianshi: "0",
    n: "block",
    b: "none",
    c:'block',
    c1:'none',
    top: 0,
    iss: 0,
    addprices:'',
    commblock:'none',
    v: 'block',
    arrt:[],
    comdetilsf: [],// 评论数组
    reply_time1:[],
    reply_time2: [],
    comdetilsf1: [],// 状态一评论数组
    comdetilsf2:[],
    comdetilsf3:[],
    placeholder:'喜欢就要说出来',
    substance: '',// 评论内容
    follow: '',// 关注
    collection: '',// 收藏
    is_up: '',// 点赞
    up_count: '',// 点赞数量
    rangeprices: '',  // 加价幅度
    redprice:'../img/addprice/j-h.png',
    redprice1:'../img/addprice/a-j.png',
    font: { "a": "36rpx", "b": "36rpx" },
    color: { "a": "rgba(255,255,255,1)", "b": "rgba(248,248,248,1)" },
    weight: { "a": "bold", "b": "normal" },
    lh: { "a": "25px", "b": "20px" },
    bg: { "a": "", "b": "#fff" },
    heights:'auto',
    op:'',
    imageWidth: 0,
    imageHeight: 0,
    backgrounds:'',
    onOff: true,
    comment_count:'',
    intervarID:'',
    videofit: "cover",
    scene:2,
    is_pay:'0',
    is_pay1: '0',
    is_pay2: '0',
    lastTapTime:'0',
    time:0,
    scenes: app.globalData.scene,
    openAPPurl:'',
    descstyle: 'text-overflow:-o-ellipsis-lastline;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;'
  },
  // 提交form id
  formSubmit: function (e) {
    //获取formId
    form.form(e.detail.formId)
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH: app.globalData.navHeight-20,
      navHs: app.globalData.navHeight,
      goodid:options.id,
      sizeheight: ((wx.getSystemInfoSync().windowWidth - 32) / 3) + 'px'
    })
    var obj = app.globalData.scene
    if (obj == 1036) {
      that.setData({
        scene: 1
      })
    }else{
      that.setData({
        scene: 2
      })
    }
    that.tokens()
    setTimeout(function () {
      that.Landed()
      that.videodic()
      // 出价获取
      that.twocom()
    }, 300)
    // 接收推荐人id
    let u = options.share_id
    if (options.share_id == undefined) {
      u = ''
    }
    if (u !== '') {
      let s = wx.getStorageSync('share_id');
      if (!s) {
        t.share(options.share_id)
      } else { }
    }
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
          "uuid": wx.getStorageSync('wxuuid'),
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
              "uuid": wx.getStorageSync('wxuuid'),
              "cache-control": "private, must-revalidate"
            },
            token: 'bearer ' + r.data,
          })
        }
      })
    }
  },
  // 出价获取
  twocom(){
    let that=this
    wx.request({
      url: app.api.comment + that.data.goodid + '/2/1',
      data: {},
      method: "get",
      header: that.data.header,
      success(a) {
        if (a.data == '') {
          that.setData({
            comdetilsf3: null
          })
        } else {
          that.setData({
            comdetilsf3: a.data.data
          })
        }
        // 出价时间获取
        if (that.data.comdetilsf3 !== null) {
          var tt2 = [];
          for (var r = 0; r < that.data.comdetilsf3.length; r++) {
            let time = that.data.comdetilsf3[r].create_time * 1000
            tt2.push({
              id: r,
              text: t.getDatetime(time)
            })
          }
          that.setData({
            timeSpanStra3: tt2,
          })
        }
      }
    })
  },
  // 已登陆数据获取
  Landed() {
    var that = this
    wx.request({
      // 拼接请求url
      url: app.api.video_goods + that.data.goodid,
      data: {},
      header:t.logintype(),
      method: 'get',
      success: function (res) {
        if (res.statusCode == 204) {
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
          wx.setStorage({
            key: "goodid",
            data: res.data.data.goods_id
          })
          if (res.data.data.class == 1) {
            that.debn()
          }
          that.setData({
            videos: res.data.data.video,
            details: res.data.data,
            openAPPurl: app.api.goodspage + res.data.data.goods_id,
            follow: res.data.data.event.is_follow,              //关注
            collection: res.data.data.event.is_collection,          //收藏
            is_up: res.data.data.event.is_up,          //点赞
            up_count: res.data.data.up_count,          //点赞数量
            evaluate: res.data.data.mini_bidder,//拍品出价信息[数组]
            assess: res.data.data.mini_comment,//拍品评价记录[数组]
            comment_count: res.data.data.comment_count,
            user: res.data.data.user,     //获取拍品用户信息
            user_icon: res.data.data.user.user_icon,
            releasetime: t.daytime(res.data.data.start_time * 1000), //获取发布日
            image: res.data.data.images,//拍品图片
            covers: res.data.data.cover,//拍品封面
            rangeprices: res.data.data.range_price   // 加价幅度
          })
          // 拍卖倒计时
          that.data.intervarID = setInterval(function () {
            that.setData({
              clock: t.countdown(res.data.data.end_time)
            })
          }, 1000)
          // 视频填充方式
          if (res.data.data.video_width < res.data.data.video_height) {
            that.setData({
              videofit: "cover"
            })
          } else {
            that.setData({
              videofit: "contain"
            })
          }

          if (res.data.data.status == 3 || res.data.data.status == 4 || res.data.data.status == 5) {
            that.setData({
              backgrounds: 'linear-gradient(to right,#626262 0%, rgba(255,255,255,0.00) 90%)'
            })
          } else {
            that.setData({
              backgrounds: 'linear-gradient(to right,#F44336 0%, rgba(255,255,255,0.00) 90%)'
            })
          }
          if (res.data.data.desc !== null) {
            if (res.data.data.desc.length > 70) {
              that.setData({
                op: '1'
              })
            } else {
              that.setData({
                op: '3'
              })
            }
          }
          if (res.data.data.up !== null) {
            if (res.data.data.up.length > 29) {
              const cct = []
              for (var i = 0; i < 29; i++) {
                cct.push({
                  id: i,
                  user: res.data.data.up[i].user.user_icon
                })
                that.setData({
                  cct1: cct
                })
              }
              if (res.data.data.up.length > 15 && res.data.data.up.length < 30) {
                that.setData({
                  auto: "88rpx"
                })
              }
            } else {
              const cct = []
              for (var i = 0; i < res.data.data.up.length; i++) {
                cct.push({
                  id: i,
                  user: res.data.data.up[i].user.user_icon
                })
                that.setData({
                  cct1: cct
                })
              }
              if (res.data.data.up.length > 15 && res.data.data.up.length < 30) {
                that.setData({
                  auto: "88rpx"
                })
              }
            }
          }
          // 出价时间获取
          if (that.data.details.mini_bidder !== null) {
            var ttt1 = [];
            for (var h = 0; h < that.data.details.mini_bidder.length; h++) {
              var dateTime = new Date(that.data.details.mini_bidder[h].create_time * 1000);
              let time = that.data.details.mini_bidder[h].create_time * 1000
              ttt1.push({
                id: h,
                text: t.getDatetime(time)
              })
            }
            that.setData({
              timeSpanStra1: ttt1,
            })
          }
          // 评论时间获取
          if (that.data.details.mini_comment !== null) {
            var ttt = [];
            var st=[];
            for (var r = 0; r < that.data.details.mini_comment.length; r++) {
              let time = that.data.details.mini_comment[r].create_time * 1000
              ttt.push({
                id: r,
                text: t.getDatetime(time)
              })
              let reply_time = that.data.details.mini_comment[r].parent == null ? '' : t.getDatetime(that.data.details.mini_comment[r].parent.create_time * 1000)
              st.push({
                text: reply_time
              })
              
            }
            that.setData({
              timeSpanStra: ttt,
              reply_time1: st
            })
          }
          if (res.data.data.now_price == 0) {
            that.setData({
              addprices: res.data.data.start_price + res.data.data.range_price,
            })
          } else if (res.data.data.now_price !== 0) {
            that.setData({
              addprices: res.data.data.now_price + res.data.data.range_price,
            })
          }
          // 藏品属性获取
          if (res.data.data.attr!==null){
            var json1 = res.data.data.attr;
            var arrt1 = []
            for (let key in json1) {
              arrt1.push({
                key: key,
                name: json1[key]
              })
            }
            that.setData({
              arrt: arrt1
            })
          }
        }
      },
    })

  },
  scroll: function () {
    this.index += 10;
    this.setData({
      top: this.index
    })
  },
  // 跳转协议页
  goread() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=' + app.api.userAgreement,
    })
  },
  // 评论
  gocomm(){
    var that=this
    let token = wx.getStorageSync('token');
    if (!token) {
      //不存在token，调用登录
      that.btn_sub()
    } else {
      that.setData({
        commblock: 'block',
        focus: true
      })
    }
  },
  
  gocommton(e){
    var that = this
    that.setData({
      substance: e.detail.value
    })
  },
  closecomm(){
    var that = this
    that.setData({
      commblock: 'none',
      placeholder:'喜欢就要说出来',
      comment_id: ''
    })
  },
  // 点击头像跳转
  jump: function () {
    // 获取点击id标记
    var ids = this.data.user.user_id
    wx.navigateTo({
      // 跳转链接拼接
      url: '../person/person?id=' + ids,
    })
  },
  // 关注
  follow(){
    var that=this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {
      wx.request({
        url: app.api.user_detfollow,
        data: {
          user_id: that.data.details.user.user_id,
        },
        method: "post",
        header:t.logintype(),
        success(a) {
          if (a.statusCode == 200) {
            that.setData({
              follow: '1'
            })
            t.alert(a.data.message)
          } if (a.statusCode == 401) {
            relanding.relanding()
            setTimeout(function () {
              that.follow()
            }, 1000)
          }
        }
      })
    }
  },
  //取消关注
  tofollow() {
    var that = this
    wx.request({
      url: app.api.user_detfollow,
      data: {
        user_id: that.data.details.user.user_id,
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            follow: '0'
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
 
  // 收藏
  collection(){
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {
      wx.request({
        url: app.api.gloabl_collection,
        data: {
          goods_id: that.data.details.goods_id,
          type: "1"
        },
        method: "post",
        header: t.logintype(),
        success(a) {
          if (a.statusCode == 200) {
            that.setData({
              collection: '1'
            })
            t.alert(a.data.message)
          } else if (a.statusCode == 401) {
            relanding.relanding()
            setTimeout(function () {
              that.collection()
            }, 1000)

          }
        }
      })
    }
  },
  //取消收藏
  tocollection() {
    var that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: that.data.details.goods_id,
        type: "1"
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
        } else if (a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.tocollection()
          }, 1000)
        } else { }
      }
    })
  },
  // 点赞
  is_up() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {
      //token有效
      if (that.data.details.event.is_up!==1){
        wx.request({
          url: app.api.fabulous,
          data: {
            goods_id: that.data.details.goods_id,
          },
          method: "post",
          header: t.logintype(),
          success(a) {
            if (a.statusCode == 200) {
              that.setData({
                is_up: '1'
              })
              wx.request({
                url: app.api.video_goods + that.data.goodid,
                data: {},
                header: t.logintype(),
                method: 'get',
                success: function (res) {
                  wx.setStorage({
                    key: "goodid",
                    data: res.data.data.goods_id
                  })
                  that.setData({
                    is_up: res.data.data.event.is_up,          //点赞
                    up_count: res.data.data.up_count,          //点赞数量
                    details: res.data.data
                  })
                },
              })
              t.alert(a.data.message)
            } else {
              relanding.relanding()
              setTimeout(function () {
                that.is_up()
              }, 1000)
            }
          }
        })
      }
    }
  },
  // 出价加价按钮
  addp() {
    var that = this
    that.setData({
      addprices: that.data.addprices + that.data.details.range_price,
      redprice1: '../img/addprice/a-j.png',
    })
    if (that.data.details.direct_price > 0 && that.data.addprices >= that.data.details.direct_price) {
      that.setData({
        addprices: that.data.details.direct_price,
        redprice1: '../img/addprice/a-h.png',
      })
    }
    var price = that.data.details.now_price > 0 ? that.data.details.now_price : that.data.details.start_price
    if (that.data.addprices > price + that.data.details.range_price){
      that.setData({
        redprice: '../img/addprice/j-j.png',
      })
    }
  },
  // 出价减价按钮
  redp() {
    var that = this
    that.setData({
      addprices: that.data.addprices - that.data.details.range_price,
      redprice: '../img/addprice/j-j.png',
    })

    var price = that.data.details.now_price > 0 ? that.data.details.now_price : that.data.details.start_price
    if (that.data.addprices <= price + that.data.details.range_price){
      that.setData({
        addprices: price + that.data.details.range_price,
        redprice: '../img/addprice/j-h.png',
      })
    }
    if (that.data.details.direct_price > 0 && that.data.addprices < that.data.details.direct_price) {
      that.setData({
        redprice1: '../img/addprice/a-j.png',
      })
    }
  },
  // 出价按钮(出价)
  addoffer() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      //不存在token，调用登录
      that.btn_sub()
    } else {
      //token有效，不做操作
      that.setData({
        is_pay: '1'
      })
      wx.request({
        url: app.api.video_goods + that.data.goodid,
        data: {},
        header: t.logintype(),
        method: 'get',
        success: function (res) {
          wx.setStorage({
            key: "goodid",
            data: res.data.data.goods_id
          })
          that.setData({
            v: 'none',
            details: res.data.data,
            follow: res.data.data.event.is_follow,              //关注
            collection: res.data.data.event.is_collection,          //收藏
            is_up: res.data.data.event.is_up,          //点赞
            up_count: res.data.data.up_count,          //点赞数量
            user: res.data.data.user,     //获取拍品用户信息
          })
        },
      })
      let price = that.data.details.now_price == 0 ? that.data.details.start_price : that.data.details.now_price
      that.setData({
        addprices: price + that.data.rangeprices,
        redprice: '../img/addprice/j-h.png',
        redprice1: '../img/addprice/a-j.png',
      })
    }
  },

  //点击出价登陆
  btn_sub: function () {
    var that=this
    login.userLogin()
    setTimeout(function(){
      let token = wx.getStorageSync('token');
      if (!token) {
        that.Landed()
      } else {
        wx.getStorage({
          key: 'token',
          success(res) {
            that.setData({
              token: 'bearer' + res.data,
            })
            that.Landed()
          }
        })
      }
    },1000)
    
  },
  // 打开出价弹框
  open_pay() {
    var that = this
    that.setData({
      is_pay: '1'
    })
  },
  // 关闭出价弹框
  close_pay() {
    var that = this
    that.setData({
      is_pay: '0'
    })
  },
  // 确认出价按钮
  is_offer() {
    var that = this
    that.setData({
      is_pay: '0',
      is_pay1: '1'
    })

  },
  // 一口价按钮
  yputprice() {
    var that = this
    that.setData({
      is_pay: '0',
      is_pay2: '1'
    })
  },
  // 是否确认出价按钮(否)
  isputf() {
    var that = this
    that.setData({
      is_pay1: '0'
    })
  },
  // 是否确认一口价按钮(否)
  yisputf() {
    var that = this
    that.setData({
      is_pay2: '0'
    })
  },
  // 是否确认出价按钮(是)
  isputs() {
    var that = this
    that.setData({
      is_pay1: '0'
    })
    wx.request({
      url: app.api.confirmoffer,
      data: {
        goods_id: that.data.details.goods_id,
        offer_method: 1,
        offer_price: that.data.addprices
      },
      method: "post",
      header:t.logintype(),
      success(res) {
        if (res.statusCode == 200) {
          t.alert(res.data.message)
          clearInterval(that.data.intervarID);
          if (res.data.data.type == 2) {
            wx.navigateTo({
              url: '../orderdetails/orderdetails?id=' + res.data.data.order_id,
            })
          }
          wx.getStorage({
            key: 'goodid',
            success(res) {
              wx.request({
                url: app.api.video_goods + res.data,
                data: {},
                header:t.logintype(),
                method: 'get',
                success: function (res) {
                  wx.setStorage({
                    key: "goodid",
                    data: res.data.data.goods_id
                  })
                  that.setData({
                    clock: '',
                    intervarID:'',
                    details: res.data.data,
                    evaluate: res.data.data.mini_bidder,//拍品出价信息[数组]
                    assess: res.data.data.mini_comment,//拍品评价记录[数组]
                  })
                  that.data.intervarID=setInterval(function() {
                    that.setData({
                      clock: t.countdown(res.data.data.end_time)
                    })
                  }, 1000)
                  that.twocom()
                  if (that.data.details.mini_bidder !== null) {
                    var ttt1 = [];
                    for (var h = 0; h < that.data.details.mini_bidder.length; h++) {
                      var dateTime = new Date(that.data.details.mini_bidder[h].create_time * 1000);
                      let time = that.data.details.mini_bidder[h].create_time * 1000
                      ttt1.push({
                        id: h,
                        text: t.getDatetime(time)
                      })
                    }
                    that.setData({
                      timeSpanStra1: ttt1,
                    })
                  }
                },
              })
            }
          })
          wx.request({
            url: app.api.comment + that.data.goodid + '/0/1',
            data: {},
            method: "get",
            header: t.logintype(),
            success(a) {
              that.setData({
                comdetilsf: a.data.data,
                videoallcomtpage:2
              })
            }
          })
        }
        if (res.statusCode == 422) {
          t.alert(res.data.message)
        }
        if (res.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.isputs()
          }, 1000)
        }
      }
    })
  },
  // 是否确认一口价按钮(是)
  yisputs() {
    var that = this
    that.setData({
      is_pay2: '0',
    })
    wx.request({
      url: app.api.confirmoffer,
      data: {
        goods_id: that.data.details.goods_id,
        offer_method: 2,
        offer_price: that.data.addprices
      },
      method: "post",
      header:t.logintype(),
      success(res) {
        if (res.statusCode == 200) {
          wx.navigateTo({
            url: '../orderdetails/orderdetails?id=' + res.data.data.order_id,
          })
          t.alert(res.data.message)
        }
        if (res.statusCode == 422) {
          t.alert(res.data.message)
        }
        if (res.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.yisputs()
          }, 1000)
        }
      }
    })
  },
  // 缴纳保证金
  Paydeposit(){
    var that=this
    that.setData({
      is_pay:0
    })
    wx.navigateTo({
      url: '../buybond/Paydeposit?id=' + that.data.details.goods_id,
    })
  },

  //分享
  onShareAppMessage: function (r) {
    const that = this;
    const imgurl = that.data.details.cover;
    const num = imgurl.length-8
    const imgurls = imgurl.substring(num, -1)
    const imageurl = imgurls +'square_image'
    const desc = that.data.details.desc == '' ? '' : that.data.details.desc
    const user_id = t.shareuserid()
    const u = that.data.details.now_price > 0 ? "当前价:￥" + that.data.details.now_price : "起拍价:￥" + that.data.details.start_price
    return {
      title: u + " " + that.data.details.title, // 转发后 所显示的title
      desc: desc,
      path: '/pages/videos/videos?id=' + that.data.details.goods_id + '&share_id=' + user_id, // 相对的路径
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
          fail: function (res) {  },
          complete: function (res) {  }
        })
      },
      fail: function (res) {}
    }
  },
  onShow: function () {
    var that=this
    //设置分享获取shareTicket
    wx.showShareMenu({
      withShareTicket: true,
    })
    var obj = app.globalData.scene
    if (obj == 1036) {
      that.setData({
        scene: 1
      })
    } else {
      that.setData({
        scene: 2
      })
    }
    this.setData({
      scenes: app.globalData.scene
    })
  },
  // 关闭详情弹框
  closewel(){
    var that=this
    that.setData({
      wel:'none'
    })
  },
  // 打开详情弹框
  openwel(){
    var that = this
    that.setData({
      wel: 'block'
    })
  },

  // 视频，详情切换
  vibn() {
    this.setData({
      iss: 0,
      n: "block",
      b: "none",
      commblock:'none',
      focus:false,
      pricevisb: "none",
      font: { "a": "36rpx", "b": "36rpx" },
      color: { "a": "rgba(255,255,255,1)", "b": "rgba(248,248,248,1)" },
      weight: { "a": "bold", "b": "normal" },
      lh: { "a": "25px", "b": "20px" },
      bg: { "a": "", "b": "#fff" },
      heights: 'auto',
      c: 'block',
      c1: 'none',
      evalvis: 'none',
      evalvis1: 'none',
    })
  },
  debn() {
    this.setData({
      iss: 1,
      n: "none",
      b: "block",
      pricevisb: "none",
      font: { "b": "36rpx", "a": "36rpx" },
      color: { "b": "#000", "a": "#ACACAC;" },
      weight: { "b": "normal", "a": "normal" },
      lh: { "b": "25px", "a": "20px" },
      bg: { "b": "", "a": "#fff" },
      heights: '0',
      c:'none',
      c1: 'block',
      evalvis:'none',
      evalvis1: 'none',
    })
  },
  onUnload(){
    var that=this
    that.setData({
      scene:2
    })
    clearInterval(that.data.intervarID);
  },
  // 视频评论获取
  videodic(){
    var that=this
    wx.request({
      url: app.api.comment + that.data.goodid + '/0/1',
      data: {},
      method: "get",
      header: t.logintype(),
      success(a) {
        that.setData({
          videoallcomtpage: 2
        })
        if (a.data == '') {
          that.setData({
            comdetilsf: null
          })
        } else {
          that.setData({
            comdetilsf: a.data.data
          })
        }
      }
    })
    // 视频详情评论获取
    wx.request({
      // 拼接请求url
      url: app.api.video_goods + that.data.goodid,
      data: {},
      header: t.logintype(),
      method: 'get',
      success: function (res) {
        that.setData({
          assess: res.data.data.mini_comment,//拍品评价记录[数组]
        })
      }
    })
    // 用户评论获取
    wx.request({
      url: app.api.comment+ that.data.goodid + '/1/1',
      data: {},
      method: "get",
      header: t.logintype(),
      success(a) {
        that.setData({
          page:2
        })
        if (a.statusCode == 204) {
          that.setData({
            comdetilsf1: null
          })
        } else {
          that.setData({
            comdetilsf1: a.data.data
          })
        }
        // 评论时间获取
        if (that.data.comdetilsf1 !== null) {
          var tt1 = [];
          var st=[]
          for (var r = 0; r < that.data.comdetilsf1.length; r++) {
            let time = that.data.comdetilsf1[r].create_time * 1000
            tt1.push({
              id: r,
              text: t.getDatetime(time)
            })
            let reply_time = that.data.comdetilsf1[r].parent == null ? '' : t.getDatetime(that.data.comdetilsf1[r].parent.create_time * 1000)
            st.push({
              text: reply_time
            })
          }
          that.setData({
            reply_time2:st,
            timeSpanStra2: tt1,
          })
        }
      }
    })
  },
  toevaluatebtn(){
    var that =this
    that.gocomm()
    that.closeevalss()
  },
  // 评论数量
  comment_count(){
    var that =this
    wx.request({
      url: app.api.video_goods + that.data.goodid,
      data: {},
      header: t.logintype(),
      method: 'get',
      success: function (res) {
        that.setData({
          comment_count: res.data.data.comment_count
        })
      }
    })
  },
  todown() {
    wx.showModal({
      title: '藏宝',
      content: '暂未开放此功能,是否下载APP',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../download/download',
          })
        } else if (res.cancel) {}
      }
    })
  },
  qinchu() {
    wx.clearStorage({
      success: function (e) {}
    })
  },
  cc() {
    var that = this
    that.setData({
      vidisis: 'block'
    })
  },
  openss() {
    var that = this
    that.setData({
      descstyle:'',
      op: '2'
    })
  },
  closess() {
    var that = this
    that.setData({
      descstyle: 'text-overflow:-o-ellipsis-lastline;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;',
      op: '1'
    })
  },
  openevalss() {
    var that = this
    that.setData({
      evalvis: 'block',
      v: 'none',
    })
  },
  closeevalss() {
    var that = this
    that.setData({
      evalvis: 'none',
      v: 'block'
    })
  },
  openevalss1() {
    var that = this
    that.setData({
      evalvis1: 'block'
    })
  },
  closeevalss1() {
    var that = this
    that.setData({
      evalvis1: 'none'
    })
  },
  doubleClick: function (e) {
    var that = this
    var curTime = e.timeStamp
    var lastTime = e.currentTarget.dataset.time  // 通过e.currentTarget.dataset.time 访问到绑定到该组件的自定义数据
    if (curTime - lastTime > 0) {
      if (curTime - lastTime < 300) {
        that.is_up()
      }else{}
    }
    that.setData({
      lastTapTime: curTime
    })
  },

  previewImg: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: that.data.image[index],     //当前图片地址
      urls: that.data.image,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
  },
  videoallcomt(){
    var that = this
    wx.request({
      url: app.api.comment + that.data.goodid + '/0/' + that.data.videoallcomtpage,
      data: {},
      header: t.logintype(),
      method: 'get',
      success(a) {
        if (a.statusCode == 204) {
          t.alert('没有更多')
        } else if (a.statusCode == 200){
          let list = that.data.comdetilsf;
          for (let i = 0; i < a.data.data.length; i++) {
            list.push(a.data.data[i]);
          }
          that.setData({
            comdetilsf: that.data.comdetilsf,
            videoallcomtpage: Number(that.data.videoallcomtpage) + 1
          })
        }else{}
      }
    })
  },
  all_commt(){
    var that=this
    if (that.data.flag_allcommt==true){
      that.setData({
        flag_allcommt:false
      })
      wx.request({
        url: app.api.comment + that.data.goodid + '/1/' + that.data.page,
        data: {},
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            t.alert('没有更多')
          } else {
            let list = that.data.comdetilsf1;
            for (let i = 0; i < res.data.data.length; i++) {
              list.push(res.data.data[i]);
            }
            that.setData({
              page: Number(that.data.page) + 1,
              comdetilsf1: that.data.comdetilsf1
            })
            setTimeout(function(){
              that.data.flag_allcommt=true
            },200)
            if (that.data.comdetilsf1 !== null) {
              var tt1 = [];
              var st = [];
              for (var r = 0; r < that.data.comdetilsf1.length; r++) {
                let time = that.data.comdetilsf1[r].create_time * 1000
                tt1.push({
                  id: r,
                  text: t.getDatetime(time)
                })
                let reply_time = that.data.comdetilsf1[r].parent == null ? '' : t.getDatetime(that.data.comdetilsf1[r].parent.create_time * 1000)
                st.push({
                  text: reply_time
                })
              }
              that.setData({
                timeSpanStra2: tt1,
                reply_time2: st
              })
            }
          }
        }
      })
    }
  },
  videoshow(){
    let that=this
    let t = that.data.videoshow
    let s=t==true?false:true
    that.setData({
      videoshow:s
    })
  },
  openvideo(){
    let that = this
    that.setData({
      videoshow: true
    })
  },
  // 简短评论信息
  briefcomment(){
    let that=this
    wx.request({
      url: app.api.video_goods + that.data.goodid,
      data: {},
      header: t.logintype(),
      method: 'get',
      success: function (res) {
        var ttt = [];
        var st = [];
        for (var r = 0; r < res.data.data.mini_comment.length; r++) {
          let time = res.data.data.mini_comment[r].create_time * 1000
          ttt.push({
            id: r,
            text: t.getDatetime(time)
          })
          let reply_time = res.data.data.mini_comment[r].parent == null ? '' : t.getDatetime(res.data.data.mini_comment[r].parent.create_time * 1000)
          st.push({
            text: reply_time
          })
        }
        that.setData({
          timeSpanStra: ttt,
          reply_time1:st
        })
      }
    })  
  },
  // 全部评论信息
  allfcomment(){
    let that=this
    wx.request({
      url: app.api.comment + that.data.goodid + '/1/1',
      data: {},
      method: "get",
      header: t.logintype(),
      success(res) {
        let tt1=[]
        let st=[]
        for (var r = 0; r < res.data.data.length; r++) {
          let time = res.data.data[r].create_time * 1000
          tt1.push({
            id: r,
            text: t.getDatetime(time)
          })
          let reply_time = res.data.data[r].parent == null ? '' : t.getDatetime(res.data.data[r].parent.create_time * 1000)
          st.push({
            text: reply_time
          })
        }
        that.setData({
          timeSpanStra2: tt1,
          reply_time2:st
        })
      }
    })
  },
  // 发送评论
  sendcommt() {
    var that = this
    wx.request({
      url: app.api.comments,
      data: {
        goods_id: that.data.details.goods_id,
        comment: that.data.substance,
        comment_id: that.data.comment_id
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            placeholder: '喜欢就要说出来',
            substance: '',
            commblock: 'none',
            comment_id: ''
          })
          t.alert('评论成功')
          setTimeout(function () {
            that.videodic()
            that.allfcomment()
            that.briefcomment()
            that.comment_count()
          }, 300)
        }
        if (a.statusCode == 422) {
          t.alert(a.data.message)
        }
        if (a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.sendcommt()
          }, 1000)
        }
      }
    })
  },
  // 全部
  all_pricecommt() {
    var that = this
    wx.request({
      url: app.api.comment + that.data.goodid + '/2/' + that.data.page,
      data: {
      },
      header: t.logintype(),
      method: 'get',
      success(res) {
        if (res.statusCode == 204) {
          t.alert('没有更多')
        } else {
          let list = that.data.comdetilsf3;
          for (let i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          that.setData({
            comdetilsf3: that.data.comdetilsf3,
            page: Number(that.data.page) + 1
          })
          if (that.data.comdetilsf3 !== null) {
            var tt2 = [];
            for (var r = 0; r < that.data.comdetilsf3.length; r++) {
              that.setData({
                timeSpanStr3: t.getDatetime(that.data.comdetilsf3[r].create_time * 1000)
              })
              tt2.push({
                id: r,
                text: that.data.timeSpanStr3
              })
            }
            that.setData({
              timeSpanStra3: tt2,
            })
          }
        }
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
  closeshare() {
    const that = this
    that.setData({
      whethershare: 0
    })
  },
  openshare() {
    const that = this
    that.setData({
      whethershare: 1
    })
  },
  copylink() {
    const that = this
    const a = that.data.details
    t.copylink(a, app.api.url_goods)
    that.closeshare()
  },
  closereport() {
    const that = this
    that.setData({
      whethereport: 0
    })
  },
  openreport() {
    const that = this
    that.setData({
      whethereport: 1,
      whethershare: 0
    })
  },
  report(e) {
    const that = this
    const reason_id = e.currentTarget.dataset.id
    const mix_id = that.data.details.goods_id
    t.report(reason_id, mix_id)
    that.closereport()
  },
  closeposter() {
    const that = this
    that.setData({
      whetherposter: 0
    })
  },
  poster() {
    const that = this
    that.closeshare()
    //显示/生成分享海报
    if (that.data.sharePicUrl == '') {
      wx.showLoading({
        title: '生成海报中',
      })
      const shareFrends = wx.createCanvasContext('shareFrends')
      const a = that.data.details
      var url = app.api.url_goods + a.goods_id+ '&share_id=' + t.shareuserid()
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
              url: a.cover,//网络路径
              success: res => {
                var path = res.tempFilePath //临时本地路径
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
          fail: function (res) { }
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
  saveimg() {
    const that = this
    t.saveimg(that.data.sharePicUrl)
    that.closeposter()
  },
  // 回复
  reply(e){
    const that=this
    let token = wx.getStorageSync('token');
    if (!token) {
      t.alert('请先登陆')
    } else {
      that.setData({
        commblock: 'block',
        focus: true,
        evalvis: 'none',
        placeholder: '回复@' + e.currentTarget.dataset.name,
        comment_id: e.currentTarget.dataset.id
      })
    }
  },
  preventTouchMove: function () { }
})