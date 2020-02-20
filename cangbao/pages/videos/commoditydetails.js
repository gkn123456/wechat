
const app = getApp()
const common = require('../common/common.js')
const relanding = require('../common/relanding.js')
const form = require('../common/formid.js')
const login = require('../common/login.js')
const t = require('../common/time.js')
const QR = require("../../utils/qrcode.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    navHs: '',
    navHs1: '',
    currentTab: 0,
    st1: 'bottom:162rpx;right: 32rpx;',
    user_icon: '../img/my/usericons.png',// 用户头像
    style1:'background:rgba(255,255,255,0);',
    style2: '',
    style3: 'display:flex;',
    s_color:'0',
    style4: 'display:none;',
    style5:'width:50%;',
    style6:'width:50%;',
    sizeheight:'',
    det:[],
    op:'',
    up_count:'',
    is_up:'',
    id:'',
    type:'',
    arrt:[],
    t:'',
    stopSwiper:'',
    collection:'0',
    follow:'0',
    videofit: "cover",
    class:'',
    ismodal:true,
    scene: app.globalData.scene,
    openAPPurl: '',
    sharePicUrl: '',
    report: app.api.reportlist,
    whethershare: 0,
    whethereport: 0,
    whetherposter: 0,
    coverimg: '',
    coversize: '',
    showSharePic: '',
    descstyle: 'text-overflow:-o-ellipsis-lastline;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // 场景值判断
    var obj = app.globalData.scene
    if (obj == 1007 || obj == 1044) {
      that.setData({
        scene: 1
      })
    } else {
      that.setData({
        scene: 2
      })
    }
    that.setData({
      id: options.id,
      type: options.type,
      sizeheight: ((wx.getSystemInfoSync().windowWidth - 32) / 3) + 'px',
      navH: app.globalData.navHeight - 20,
      navHs: app.globalData.navHeight,
      navHs1: app.globalData.navHeight+50,
    },()=>{
      that.shoping1()
    })
  },
  //点击登陆

  // 登陆判断
  button() {
    let that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.btn_sub()
    } else {
      
    }
  },
  // 登陆获取商品信息
  shoping1(){
    var that=this
    wx.request({
      url: app.api.shop_details+that.data.id,
      data: {},
      method: "get",
      header: t.logintype(),
      success(a) {
        if (a.statusCode==204){
          if (that.data.ismodal == true) {
            that.setData({
              ismodal: false
            })
            wx.showModal({
              content: '该商品已下架',
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
          that.setData({
            det: a.data.data,
            openAPPurl: app.api.shopgoodspage + a.data.data.goods_id,
            collection: a.data.data.event.is_collection,
            user_icon: a.data.data.user.user_icon,
            follow: a.data.data.event.is_follow,
            up_count: a.data.data.up_count,
            is_up: a.data.data.event.is_up,
            class: a.data.data.video,
            t: t.daytime(a.data.data.create_time * 1000)
          })
          that.swichNav()
          if (a.data.data.video_width < a.data.data.video_height) {
            that.setData({
              videofit: "cover"
            })
          } else {
            that.setData({
              videofit: "contain"
            })
          }
          if (a.data.data.attr !== null) {
            var json1 = a.data.data.attr;
            var arrt1 = []
            for (let key in json1) {
              arrt1.push({
                key: key,
                name: json1[key]
              })
              that.setData({
                arrt: arrt1
              })
            }
          }
          if (a.data.data.shop_class == 2) {
            that.setData({
              style5: "width:80%;",
              style6: 'width:20%;'
            })
          }
          if (a.data.data.desc !== null) {
            if (a.data.data.desc.length > 70) {
              that.setData({
                op: '1'
              })
            } else {
              that.setData({
                op: '3'
              })
            }
          }
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
    this.shoping1()
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
  // 点击事件
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
    if (this.data.currentTab==0){
      this.setData({
        style1: 'background:rgba(255,255,255,0);',
        style2:'display:flex;',
        st1: 'bottom:162rpx;right: 32rpx;',
      })
      
    }else{
      this.setData({
        style1: 'background:rgba(255,255,255,1);',
        style2: 'display:none;',
        st1: 'bottom:0;right: 0;',
      })
    }
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if(e!==undefined){
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
      }
    }else{
      if(that.data.class==null){
        that.setData({
          currentTab: 1,
          style3: 'display:none;',
          style4: 'display:block;',
          stopSwiper: 'stopSwiper'
        })
      }else{
        that.setData({
          currentTab:0,
          style3: 'display:flex;',
          style4: 'display:none;',
          stopSwiper: 'stopSwiper'
        })
      }
      
    }
    if (this.data.currentTab == 0) {
      this.setData({
        s1:'z-index:9;',
        s2: 'z-index:8;',
        s_color: '0',
      })

    } else {
      this.setData({
        s1: 'z-index:8;',
        s2: 'z-index:9;',
        s_color:'1',
      })
    }
    
  },
  openss() {
    var that = this
    that.setData({
      descstyle: '',
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
  previewImg: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var imgArr = that.data.det.images;
    wx.previewImage({
      current: that.data.det.images[index],     //当前图片地址
      urls: that.data.det.images,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  addoffer(){
    var that=this
    let token = wx.getStorageSync('token');
    if (!token) {
      //不存在token，调用登录
      that.btn_sub()
    } else {
      if (that.data.det.is_self!==1){
        wx.navigateTo({
          url: '../buybond/ware?id=' + that.data.id,
        })
      }else{

      }
      
    }
  },

  //购买登陆
  btn_sub: function () {
    var that = this
    login.userLogin()

  },
  // 收藏
  collection() {
    var that = this
    that.button()
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: that.data.det.goods_id,
        type: "2"
      },
      method: "post",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          t.alert(a.data.message)
          that.setData({
            collection: '1'
          })
        } 
        if(a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.collection()
          }, 1000)
        }
      }
    })
  },
  //取消收藏
  tocollection() {
    var that = this
    wx.request({
      url: app.api.gloabl_collection,
      data: {
        goods_id: that.data.det.goods_id,
        type: "2"
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            collection: '0'
          })
          t.alert(a.data.message)
        }
        if (a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.tocollection()
          }, 1000)
        }
      }
    })
  },

  //分享
  onShareAppMessage: function (r) {
    var that = this;
    var imgurl = that.data.det.cover;
    var num = imgurl.length - 8
    var imgurls = imgurl.substring(num, -1)
    var imageurl = imgurls + 'square_image'
    var desc = that.data.det.desc == null ? '' : that.data.det.desc
    return {
      title:desc + " " + that.data.det.title, // 转发后 所显示的title
      desc: desc,
      path: '/pages/videos/commoditydetails?id=' + that.data.det.goods_id, // 相对的路径
      imageUrl: imageurl,
      success: (res) => {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
          },
          fail: function (res){},
          complete: function (res){}
        })
      },
      fail: function (res) {}
    }
  },
  // 关注
  follow() {
    var that = this
    that.button()
    wx.request({
      url: app.api.user_detfollow,
      data: {
        user_id: that.data.det.user.user_id,
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
  },
  //取消关注
  tofollow() {
    var that = this
    wx.request({
      url: app.api.user_detfollow,
      data: {
        user_id: that.data.det.user.user_id,
      },
      method: "delete",
      header: t.logintype(),
      success(a) {
        if (a.statusCode == 200) {
          that.setData({
            follow: '0'
          })
          t.alert(a.data.message)
        }
        if (a.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.tofollow()
          }, 1000)
        }
      }
    })
  },
  // 点赞
  is_up() {
    var that = this
    let token = wx.getStorageSync('token');
    if (!token) {
      that.button()
    } else {
      if (that.data.det.event.is_up !== 1) {
        wx.request({
          url: app.api.fabulous,
          data: {
            goods_id: that.data.det.goods_id,
          },
          method: "post",
          header:t.logintype(),
          success(a) {
            if (a.statusCode == 200) {
              that.setData({
                is_up: '1'
              })
              wx.request({
                url: app.api.shop_details + that.data.id,
                data: {},
                header: t.logintype(),
                method: 'get',
                success: function (res) {
                  wx.setStorage({
                    key: "goodid",
                    data: res.data.data.goods_id
                  })
                  that.setData({
                    up_count: res.data.data.up_count,          //点赞数量
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
  doubleClick: function (e) {
    var that = this
    var curTime = e.timeStamp
    var lastTime = e.currentTarget.dataset.time
    if (curTime - lastTime > 0) {
      if (curTime - lastTime < 300) {
        that.is_up()
      }
    }
    this.setData({
      lastTapTime: curTime
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
  jump: function () {
    var ids = this.data.det.user_id
    wx.navigateTo({
      url: '../person/person?id=' + ids,
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
    const a = that.data.det
    t.copylink(a, app.api.url_treasurygoods)
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
    const mix_id = that.data.det.goods_id
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
    if (that.data.sharePicUrl==''){
      wx.showLoading({
        title: '生成海报中',
      })
      const shareFrends = wx.createCanvasContext('shareFrends')
      const a = that.data.det
      var url = app.api.url_treasurygoods + a.goods_id + '&share_id=' + t.shareuserid()
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
  }
})