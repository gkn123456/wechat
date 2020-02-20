// pages/my/mywallet/Modify information.js
const app = getApp()
const relanding = require('../../common/relanding.js')
const t = require('../../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "../../img/my/usericons.png", //绑定image组件的src
    tokens:'',
    key:'',
    name:'',
    name1:'',
    region: ['请', '选', '择'],
    dates:"1",
    array: ['保密','男', '女'],
    index: 0,
    sex:'0',
    area:'',
    tempFilePaths:'',
    bir:'',
    user:[],
    jj:'',
    jsonStr:[],
    navH: '',
    headtitle: '填写/修改资料',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
    })
    wx.request({
      url: app.api.user,
      data: {},
      method: 'get',
      header: t.logintype(),
      success: function (b) {
        that.setData({
          user: b.data.data,
          name: b.data.data.nick_name,
          name1: b.data.data.profile,
          src: b.data.data.user_icon,
          sex: b.data.data.sex,
          area: b.data.data.area_code,
          dates: t.toDate(b.data.data.birthday)
        })
        if (b.data.data.pca_text == null) {
          that.setData({
            region: ['暂无地址']
          })
        } else {
          that.setData({
            region: [b.data.data.pca_text],
          })
        }
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
      title: '填写/修改资料',
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
  bindPickerChange: function (e) {
    var that=this
    if(e!==undefined){
      that.setData({
        index: e.detail.value,
      })
      if (e.detail.value == 0) {
        that.setData({
          sex: 3,
        })
      }
      if (e.detail.value == 1) {
        that.setData({
          sex: 1,
        })
      }
      if (e.detail.value == 2) {
        that.setData({
          sex: 2,
        })
      }
    }
    wx.request({
      url: app.api.user,
      data: {
        sex: that.data.sex,
      },
      method: 'put',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 200) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.bindPickerChange()
          }, 1000)
        }
      }
    })
  },
  bindRegionChange: function (e) {
    var that = this
    if(e!==undefined){
      that.setData({
        region: e.detail.value,
        provincecode: e.detail.code[0],
        citycode: e.detail.code[1],
        area: e.detail.code[2],
      })
    }
    wx.request({
      url: app.api.user,
      data: {
        area_code: that.data.area,
      },
      method: 'put',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 200) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.bindRegionChange()
          }, 1000)
        }
      }
    })
  },
  bindDateChange: function (e) {
    var that=this
    if(e!==undefined){
      this.setData({
        dates: e.detail.value
      })
    }
    let d = new Date(e.detail.value)
    let ts = d.getTime(d)
    that.setData({
      bir: ts/1000
    })
    wx.request({
      url: app.api.user,
      data: {
        birthday: that.data.bir,
      },
      method: 'put',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 200) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.bindDateChange()
          }, 1000)
        }
      }
    })
  },
  formName(e){
    var that = this
    if (e !== undefined){
      that.setData({
        name: e.detail.value
      })
    }
    wx.request({
      url: app.api.user,
      data: {
        nick_name: that.data.name,
      },
      method: 'put',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 200) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.formName()
          }, 1000)
        }
      }
    })
  },
  formName1(e) {
    var that=this
    if(e!==undefined){
      that.setData({
        name1: e.detail.value
      })
    }
    wx.request({
      url: app.api.user,
      data: {
        profile: that.data.name1,
      },
      method: 'put',
      header: t.logintype(),
      success: function (b) {
        if (b.statusCode == 422) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 200) {
          t.alert(b.data.message)
        }
        if (b.statusCode == 401) {
          relanding.relanding()
          setTimeout(function () {
            that.formName1()
          }, 1000)
        }
      }
    })
  },
  // 上传头像
 
  chooseImageUpload() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (r) {
        var tempFilePaths = r.tempFilePaths
        wx.uploadFile({
          url: app.api.localimg,
          filePath: tempFilePaths[0],
          name: 'images',
          header: t.logintype(),
          success(c) {
            that.setData({
              jsonStr: c.data
            })
            var jsonStr = that.data.jsonStr;
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
              var jj = JSON.parse(jsonStr);
              if (jj.status_code == 200) {
                that.setData({
                  jj: jj.data.key,
                  src: app.api.imgfield + jj.data.key + '-zvpvgsio'
                })
                wx.request({
                  url: app.api.user,
                  data: {
                    user_icon: jj.data.key,
                  },
                  method: 'put',
                  header: t.logintype(),
                  success: function (b) {
                    if (b.statusCode == 422) {
                      wx.showToast({
                        title: b.data.message,
                        icon: "none"
                      })
                    }
                    if (b.statusCode == 200) {
                      t.alert(b.data.message)
                    }
                    if (b.statusCode == 401) {
                      relanding.relanding()
                      setTimeout(function () {
                        that.chooseImageUpload()
                      }, 1000)
                    }
                  }
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
  },
  btn(){
    wx.navigateBack({})
  }
})



  
