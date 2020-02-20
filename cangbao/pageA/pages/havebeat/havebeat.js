// pageA/pages/havebeat/havebeat.js
const app = getApp()
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtitle: '',
    navH: '',
    ahh2:'1',
    list1:[],
    list2: [],
    page:'2',
    displays1: 'none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight
    })
    that.list()
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
    that.setData({
      page: 2
    })
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    that.list()
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
    if (that.data.ahh2 == '0') {
      wx.request({
        url: app.api.partake_goods + that.data.page,
        data: {
        },
        header:t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            t.alert('没有更多')
          } 
          if (res.statusCode == 200) {
            let list = that.data.list1;
            for (let i = 0; i < res.data.data.length; i++) {
              list.push(res.data.data[i]);
            }
            that.setData({
              list1: that.data.list1,
              page: Number(that.data.page) + 1
            }) 
            wx.hideLoading();
          }

        }
      })
    } else {
      wx.request({
        url: app.api.partake_global + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            t.alert('没有更多')
          } 
          if (res.statusCode == 200){
            let list = that.data.list2;
            for (let i = 0; i < res.data.data.length; i++) {
              list.push(res.data.data[i]);
            }
            // 设置数据  
            that.setData({
              list2: that.data.list2,
              page: Number(that.data.page) + 1
            })
            // 隐藏加载框  
            wx.hideLoading();
          }

        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 拍品列表 全球拍列表
  list(){
    var that = this
    if (that.data.ahh2 == '0'){
      wx.request({
        url: app.api.partake_goods + '1',
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
          }
        }
      })
    }else{
      wx.request({
        url: app.api.partake_global + '1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (a) {
          wx.stopPullDownRefresh()
          wx.hideLoading();
          if (a.statusCode ==204) {
            that.setData({
              list2: null,
              displays1: 'block'
            })
          } 
          if (a.statusCode == 200) {
            that.setData({
              list2: a.data.data,
              displays1: 'none'
            })

          }
        }
      })
    }
  },

  // 点击事件
  // 切换
  switch(e) {
    var that = this
    that.setData({
      page: '2'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if (e !== undefined) {
      if (that.data.ahh2 === e.target.dataset.id) {
        return false;
      } else {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
        that.setData({
          ahh2: e.target.dataset.id,
        })
      }
    }
    that.list()
  },
// 取消出价
  cancel_price(e) {
    var that = this
    wx.showModal({
      title: '确认取消出价？',
      content: '注：取消后保证金将原路返回',
      confirmColor: '#1C1C1C',
      cancelColor: '#1C1C1C',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api.globalcancel,
            data: {
              goods_id: e.currentTarget.dataset.id,
            },
            method: "post",
            header: t.logintype(),
            success(a) {
              if (a.statusCode == 200) {
                that.list()
                t.alert(a.data.message)
              }
              if (a.statusCode == 422) {
                t.alert(a.data.message)
              }
              if (a.statusCode == 401) {
                relanding.relanding()
                setTimeout(function () {
                  that.follow()
                }, 1000)
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  // 继续出价
  go_glabal(e) {
    wx.navigateTo({
      url: '../../../pages/videos/global?id=' + e.currentTarget.dataset.id,
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
})