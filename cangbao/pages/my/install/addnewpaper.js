// pages/my/install/addnewpaper.js
const app = getApp()
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trues: '',
    navH: '',
    headtitle: '添加新证件',
    frontview: 'https://images.cangbaopai.com/qingguan_bg_zheng@3x.png', // 正面图片
    rearview: 'https://images.cangbaopai.com/qingguan_bg_fan@3x.png',    // 反面图片
    is_photo:'0',
    add1:'1',
    add2:'1',
    photo_id:'',
    d: '',// 是否首次添加
    is_hold: '1', // 保存状态判断
    phone: '',       // 身份证号（上传）
    name: '',        // 名字（上传）
    default: '0',    // 是否默认（上传）
    jj1: '',         // 正面图片key值（上传）
    jj2: '',         // 反面图片key值（上传）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      default:options.d
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

  switch1Change(e) {
    var that = this
    if (e.detail.value == false) {
      that.setData({
        default: 0
      })
    }
    if (e.detail.value == true) {
      that.setData({
        default: 1
      })
    }
  },
  hold() {
    var that = this
    that.setData({
      is_hold:'2'
    })
    wx.request({
      url: app.api.customcert,
      data: {
        name: that.data.name,
        card: that.data.phone,
        positive: that.data.jj1,
        back: that.data.jj2,
        default: that.data.default,
      },
      method: 'post',
      header: t.logintype(),
      success(res) {
        that.setData({
          is_hold: '1'
        })
        if (res.data.status_code == 200) {
          wx.navigateBack({
            success(a) {
              let page = getCurrentPages().pop()
              page.onLoad()
            }
          })
        }
        if (res.data.status_code == 422) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
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
    wx.setNavigationBarTitle({
      title: '添加新地址',
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
  // 视频相册选择
  bindMenu1: function () {
    let that=this
    that.setData({
      is_photo: '0',
    })
    if (that.data.photo_id==1){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function (r) {
          var tempFilePaths = r.tempFilePaths
          wx.uploadFile({
            url: app.api.localimg,
            filePath: tempFilePaths[0],
            name: 'images',
            header: t.logintype(),
            success(c) {
              that.setData({
                add1: '0'
              })
              var jsonStr = c.data;
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                if (jj.status_code == 200) {
                  that.setData({
                    jj1: jj.data.key,
                    frontview: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (jj.status_code == 401) {
                  relanding.relanding()
                  setTimeout(function () {
                    that.chooseImageUpload()
                  }, 1000)
                }
              }
            }
          })
        }
      })
    }
    if (that.data.photo_id == 2) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function (r) {
          var tempFilePaths = r.tempFilePaths
          wx.uploadFile({
            url: app.api.localimg,
            filePath: tempFilePaths[0],
            name: 'images',
            header: t.logintype(),
            success(c) {
              that.setData({
                add2: '0'
              })
              var jsonStr = c.data;
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                if (jj.status_code == 200) {
                  that.setData({
                    jj2: jj.data.key,
                    rearview: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (jj.status_code == 401) {
                  relanding.relanding()
                  setTimeout(function () {
                    that.chooseImageUpload()
                  }, 1000)
                }
              }
            }
          })
        }
      }) 
    }
  },
  bindMenu2: function () {
    let that = this
    that.setData({
      is_photo: '0',
    })
    if (that.data.photo_id == 1) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: function (r) {
          var tempFilePaths = r.tempFilePaths
          wx.uploadFile({
            url: app.api.localimg,
            filePath: tempFilePaths[0],
            name: 'images',
            header: t.logintype(),
            success(c) {
              that.setData({
                add1: '0'
              })
              var jsonStr = c.data;
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                if (jj.status_code == 200) {
                  that.setData({
                    jj1: jj.data.key,
                    frontview: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (jj.status_code == 401) {
                  relanding.relanding()
                  setTimeout(function () {
                    that.chooseImageUpload()
                  }, 1000)
                }
              }
            }
          })
        }
      })
    }
    if (that.data.photo_id == 2){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: function (r) {
          var tempFilePaths = r.tempFilePaths
          wx.uploadFile({
            url: app.api.localimg,
            filePath: tempFilePaths[0],
            name: 'images',
            header: t.logintype(),
            success(c) {
              that.setData({
                add2: '0'
              })
              var jsonStr = c.data;
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                if (jj.status_code == 200) {
                  that.setData({
                    jj2: jj.data.key,
                    rearview: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (jj.status_code == 401) {
                  relanding.relanding()
                  setTimeout(function () {
                    that.chooseImageUpload()
                  }, 1000)
                }
              }
            }
          })
        }
      })
    }
  },
  close_photo(){
    let that=this 
    that.setData({
      is_photo:'0'
    })
  },
  open_photo(e){
    let that = this
    that.setData({
      is_photo: '1',
      photo_id:e.target.dataset.id
    })
  },
})