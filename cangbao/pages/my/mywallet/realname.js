// pages/my/mywallet/realname.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '1', value: '身份证' ,checked: 'true'},
      { name: '2', value: '营业执照（企业对公）' },
    ],
    tokens:'',
    value:'1',
    key:'',
    src1:'../../img/my/carz.png',
    src2: '../../img/my/carf.png',
    src3: '../../img/my/cary.png',
    real_name: "",     // 真实姓名
    card: "",          // 身份证
    company_name: "",  // 企业名称 
    licence_card: "",  // 企业证件号码 
    key1:'',
    key2: '',
    key3: '',
    navH: '',
    headtitle: '实名认证(必填)',
  },
  radioChange(e) {
    var that=this
    that.setData({
      value: e.detail.value
    })
  },
//input数据
  ip1(e){
    var that=this
    that.setData({
      real_name: e.detail.value
    })
  },
  ip2(e) {
    var that = this
    that.setData({
      card: e.detail.value
    })

  },
  ip3(e) {
    var that = this
    that.setData({
      real_name: e.detail.value
    })

  },
  ip4(e) {
    var that = this
    that.setData({
      card: e.detail.value
    })
  },
  ip5(e) {
    var that = this
    that.setData({
      company_name: e.detail.value
    })
  },
  ip6(e) {
    var that = this
    that.setData({
      licence_card: e.detail.value
    })
  },
// 个人提交认证
  pers(){
    var that=this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.setrealname,
          data: {
            card_type:1,
            real_name: that.data.real_name,
            card:that.data.card,

          },
          method: 'post',
          header: {
            "Authorization": 'bearer' + res.data,
            "content-type": "application/json",
            "cache-control": "private, must-revalidate",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success(a) {
            if (a.data.status_code == 422) {
              wx.showToast({
                title: a.data.message,
                icon: 'none'
              })
            } else {
              wx.navigateBack({
                success(){
                  var pages = getCurrentPages();
                  if (pages.length > 1) {
                    var prePage = pages[pages.length - 2];
                    prePage.onLoad()
                  }
                } 
              })
            }
          }
        })
      }
    })
  },
  // 企业提交认证
  pers1() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.api.setrealname,
          data: {
            card_type: 2,
            real_name: that.data.real_name,
            card: that.data.card,
            company_name: that.data.company_name,  // 企业名称 
            licence_card: that.data.licence_card,  // 企业证件号码 
            card_photo_positive: that.data.key1,  // 企业法人身份证正面照片
            card_photo_reverse: that.data.key2,   // 企业法人身份证反面照片
            company_photo_licence: that.data.key3,// 企业营业执照照片
          },
          method: 'post',
          header: {
            "Authorization": 'bearer' + res.data,
            "content-type": "application/json",
            "cache-control": "private, must-revalidate",
            "x-os": "wechat_mini",
            "x-app-version": app.api.edition
          },
          success(a) {
            if (a.data.status_code == 422) {
              wx.showToast({
                title: a.data.message,
                icon: 'none'
              })

            } else {
              wx.navigateBack({

              })

            }

          }
        })

      }
    })
  },
  // 上传企业执照
  chooseImageUpload() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (r) {
        var tempFilePaths = r.tempFilePaths
        wx.getStorage({
          key: 'token',
          success(res) {
            wx.uploadFile({
              url: app.api.localimg,
              filePath: tempFilePaths[0],
              name: 'images',
              header: {
                "Authorization": 'bearer ' + res.data,
                "content-type": "multipart/form-data",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success(c) {
                var jsonStr = c.data;
                jsonStr = jsonStr.replace(" ", "");
                if (typeof jsonStr != 'object') {
                  jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                  var jj = JSON.parse(jsonStr);
                  that.setData({
                    jj: jj.data.key,
                    src3: app.api.imgfield + jj.data.key,
                    key3: jj.data.key,
                  })
                  
                }
              }
            })

          }
        })
      }
    })

  },

  // 上传身份证反面
  chooseImageUpload2() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (r) {
        var tempFilePaths = r.tempFilePaths
        wx.getStorage({
          key: 'token',
          success(res) {
            wx.uploadFile({
              url: app.api.localimg,
              filePath: tempFilePaths[0],
              name: 'images',
              header: {
                "Authorization": 'bearer ' + res.data,
                "content-type": "multipart/form-data",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success(c) {
                var jsonStr = c.data;
                jsonStr = jsonStr.replace(" ", "");
                if (typeof jsonStr != 'object') {
                  jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                  var jj = JSON.parse(jsonStr);
                  that.setData({
                    jj: jj.data.key,
                    src2: app.api.imgfield + jj.data.key,
                    key2: jj.data.key,
                  })
                  
                }
              }
            })

          }
        })
      }
    })

  },
  // 上传身份证正面
  chooseImageUpload1() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (r) {
        var tempFilePaths = r.tempFilePaths
        wx.getStorage({
          key: 'token',
          success(res) {
            wx.uploadFile({
              url: app.api.localimg,
              filePath: tempFilePaths[0],
              name: 'images',
              header: {
                "Authorization": 'bearer ' + res.data,
                "content-type": "multipart/form-data",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success(c) {
                var jsonStr = c.data;
                jsonStr = jsonStr.replace("", "");
                if (typeof jsonStr != 'object') {
                  jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                  var jj = JSON.parse(jsonStr);
                  that.setData({
                    jj: jj.data.key,
                    src1: app.api.imgfield + jj.data.key,
                    key1: jj.data.key,
                  })
                  
                }
              }
            })

          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
      navH: app.globalData.navHeight
    })
    
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../index/index',
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
    wx.setNavigationBarTitle({
      title: '实名认证(必填)',
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
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.onLoad()
    }
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

  }
})