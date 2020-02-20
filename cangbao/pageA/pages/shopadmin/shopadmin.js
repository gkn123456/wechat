// pageA/pages/shopadmin/shopadmin.js
const app = getApp()
const common = require('../../../pages/common/common.js')
const t = require('../../../pages/common/time.js')
const relanding = require('../../../pages/common/relanding.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    navH: '',
    navHs: '',
    headtitle: '',
    nav: [{ nav_name: "拍品", mark: "0" },{ nav_name: "宝库", mark: "1" },],
    navs: [{ name: "竞拍中", mark: "0" }, { name: "已结拍", mark: "1" }, { name: "已失败", mark: "2" }, { name: "草稿箱", mark: "3" }],
    navs_o: [{ name: "展示中", mark: "0" }, { name: "已出售", mark: "1" }, { name: "已失败", mark: "2" }, { name: "草稿箱", mark: "3" }],
    page:'2',
    currentTab:'0',
    ty1:'0',
    ty2: '0',
    time2: null,
    clock1:[],
    u: [],
    u1: [],
    // 发布时间
    create_time:[],
    // 售出或失败时间
    completion_time:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      navHs: app.globalData.navHeight + 66,
      headtitle:'商品管理'
    })
    wx.getStorage({
      key: 'token',
      success(res) {
        that.setData({
          token: 'bearer ' + res.data
        })
        that.goods()
        that.shop()
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
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      page:'2'
    })
    if (that.data.currentTab =='0'){
      that.goods()
    }else{
      that.shop()
    }
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    if (that.data.currentTab == '0') {
      that.goodsBottom()
    } else {
      that.shopBottom()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 数据请求
  // 拍品
  goods(){
    let that=this
    if(that.data.ty1 == '0'){
      // 竞拍中
      wx.request({
        url: app.api.sel_goods_type + 'doing/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (d) {
          if (d.statusCode == 204){
            that.setData({
              u: []
            })
          }
          if (d.statusCode == 200){
            that.setData({
              u: d.data.data
            })
            that.setData({
              time2: setInterval(function () {
                const storage = [];
                const length = that.data.u.length;
                for (let i = 0; i < length; i++) {
                  storage.push({
                    id: i,
                    text: t.countdown(that.data.u[i].end_time)
                  })
                }
                that.setData({
                  clock1: storage,
                })

              }, 1000)
            })
          }
          
        }
      })
    }
    if (that.data.ty1 == '1') {
      // 已结拍
      clearInterval(that.data.time2)
      wx.request({
        url: app.api.sel_goods_type + 'end/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (e) {
          if (e.statusCode == 204) {
            that.setData({
              u: []
            })
          }
          if (e.statusCode == 200) { 
            that.setData({
              u: e.data.data
            })
            const storage1 = [];
            const length1 = that.data.u.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u[i].end_time * 1000)
              })
            }
            that.setData({
              clock: storage1,
            })
          }
          
          
        }
      })
    }
    if (that.data.ty1 == '2') {
      // 已失败
      clearInterval(that.data.time2)
      wx.request({
        url: app.api.sel_goods_type + 'fail/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (f) {
          if (f.statusCode == 204){
            that.setData({
              u: []
            })
          }
          if (f.statusCode == 200) {
            that.setData({
              u: f.data.data
            })
            const storage1 = [];
            const length1 = that.data.u.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u[i].end_time * 1000)
              })
            }
            that.setData({
              clock: storage1,
            })
           }
          
          
        }
      })
    }
    if (that.data.ty1 == '3') {
      // 草稿箱
      clearInterval(that.data.time2)
      wx.request({
        url: app.api.sel_goods_type + 'draft/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (g) {
          if (g.statusCode == 204){
            that.setData({
              u: []
            })
          }
          if (g.statusCode == 200){
            that.setData({
              u: g.data.data
            })
            const storage1 = [];
            const length1 = that.data.u.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u[i].create_time * 1000)
              })
            }
            that.setData({
              clock: storage1,
            })
          }
        }
      })
    }
  },
  // 商品
  shop(){
    let that = this
    if (that.data.ty2 == '0') {
      // 竞拍中
      wx.request({
        url: app.api.sel_shop_list + 'show/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (d) {
          if (d.statusCode == 204){
            that.setData({
              u1: []
            })
          }
          if (d.statusCode == 200){
            that.setData({
              u1: d.data.data
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].create_time * 1000)
              })
            }
            that.setData({
              create_time: storage1,
            })
          }
        }
      })
    }
    if (that.data.ty2 == '1') {
      wx.request({
        url: app.api.sel_shop_list + 'end/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (d) {
          if (d.statusCode == 204){
            that.setData({
              u1: []
            })
          }
          if (d.statusCode == 200){
            that.setData({
              u1: d.data.data
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].completion_time * 1000)
              })
            }
            that.setData({
              completion_time: storage1,
            })
          }
        }
      })
    }
    if (that.data.ty2 == '2') {
      wx.request({
        url: app.api.sel_shop_list + 'fail/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (d) {
          if (d.statusCode == 204) {
            that.setData({
              u1: []
            })
          }
          if (d.statusCode == 200) {
            that.setData({
              u1: d.data.data
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].completion_time * 1000)
              })
            }
            that.setData({
              completion_time: storage1,
            })
          }
        }
      })
    }
    if (that.data.ty2 == '3') {
      wx.request({
        url: app.api.sel_shop_list + 'draft/1',
        data: {},
        method: 'get',
        header: t.logintype(),
        success: function (d) {
          if (d.statusCode == 204){
            that.setData({
              u1: []
            })
          }
          if (d.statusCode == 200){
            that.setData({
              u1: d.data.data
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].create_time * 1000)
              })
            }
            that.setData({
              create_time: storage1,
            })
          }
        }
      })
    }
  },
  // 下拉触底加载
  shopBottom(){
    let that = this
    if (that.data.ty2 == '0'){
      wx.request({
        url: app.api.sel_shop_list + 'show/' + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } if (res.statusCode == 200){
            var moment_list = that.data.u1;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            // 设置数据  
            that.setData({
              u1: that.data.u1,
              page: Number(that.data.page) + 1
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].create_time * 1000)
              })
            }
            that.setData({
              create_time: storage1,
            })
            // 隐藏加载框  
            wx.hideLoading();
          }
        }
      })
    }
    if (that.data.ty2 == '1') {
      wx.request({
        url: app.api.sel_shop_list + 'end/' + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } if (res.statusCode == 200){
            var moment_list = that.data.u1;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            // 设置数据  
            that.setData({
              u1: that.data.u1,
              page: Number(that.data.page) + 1
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].completion_time * 1000)
              })
            }
            that.setData({
              completion_time: storage1,
            })
            // 隐藏加载框  
            wx.hideLoading();
          }
        }
      })
    }
    if (that.data.ty2 == '2') {
      wx.request({
        url: app.api.sel_shop_list + 'fail/' + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204){
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } if (res.statusCode == 200){
            var moment_list = that.data.u1;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            that.setData({
              u1: that.data.u1,
              page: Number(that.data.page) + 1
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].completion_time * 1000)
              })
            }
            that.setData({
              completion_time: storage1,
            })
            wx.hideLoading();
          }
        }
      })
    }
    if (that.data.ty2 == '3') {
      wx.request({
        url: app.api.sel_shop_list + 'draft/' + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } if (res.statusCode == 200) {
            var moment_list = that.data.u1;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            that.setData({
              u1: that.data.u1,
              page: Number(that.data.page) + 1
            })
            const storage1 = [];
            const length1 = that.data.u1.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u1[i].create_time * 1000)
              })
            }
            that.setData({
              create_time: storage1,
            }) 
            wx.hideLoading();
          }
        }
      })
    }
  },
  goodsBottom(){
    let that=this
    if (that.data.ty1 == '0') {
      wx.request({
        url: app.api.sel_goods_type + 'doing/' + that.data.page,
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
            var moment_list = that.data.u;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            that.setData({
              u: that.data.u,
              page: Number(that.data.page)+ 1
            })
            that.setData({
              time2: setInterval(function () {
                const storage = [];
                const length = that.data.u.length;
                for (let i = 0; i < length; i++) {
                  storage.push({
                    id: i,
                    text: t.countdown(that.data.u[i].end_time)
                  })
                }
                that.setData({
                  clock1: storage,
                })
              }, 1000)
            })
            wx.hideLoading();
          }
        }
      })
    }
    if (that.data.ty1 == '1') {
      wx.request({
        url: app.api.sel_goods_type + 'end/' + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } if (res.statusCode == 200){
            var moment_list = that.data.u;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            } 
            that.setData({
              u: that.data.u,
              page: Number(that.data.page) + 1
            })
            const storage1 = [];
            const length1 = that.data.u.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u[i].end_time * 1000)
              })
            }
            that.setData({
              clock: storage1,
            })
            wx.hideLoading();
          }
        }
      })
    }
    if (that.data.ty1 == '2') {
      wx.request({
        url: app.api.sel_goods_type + 'fail/' + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } 
          if (res.statusCode == 200) {
            var moment_list = that.data.u;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            that.setData({
              u: that.data.u,
              page: Number(that.data.page) + 1
            })
            const storage1 = [];
            const length1 = that.data.u.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u[i].end_time * 1000)
              })
            }
            that.setData({
              clock: storage1,
            }) 
            wx.hideLoading();
          }
        }
      })
    }
    if (that.data.ty1 == '3') {
      wx.request({
        url: app.api.sel_goods_type + 'draft/' + that.data.page,
        data: {
        },
        header: t.logintype(),
        method: 'get',
        success(res) {
          if (res.statusCode == 204) {
            wx.showToast({
              title: '没有更多',
              icon: 'none'
            })
          } 
          if (res.statusCode == 200){
            var moment_list = that.data.u;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            that.setData({
              u: that.data.u,
              page: Number(that.data.page) + 1
            })
            const storage1 = [];
            const length1 = that.data.u.length;
            for (let i = 0; i < length1; i++) {
              storage1.push({
                id: i,
                text: t.formatDateTime(that.data.u[i].create_time)
              })
            }
            that.setData({
              clock: storage1,
            }) 
            wx.hideLoading();
          }
        }
      })
    }
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
  // 一级分类
  swichNav: function (e) {
    var that = this
    that.setData({
      page: '2'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if (e !== undefined) {
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current,
        })
      }
    }
    // 请求数据
  },
// 二级分类
  swidth_o1(e) {
    var that = this
    that.setData({
      page: '2'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if (e !== undefined) {
      if (that.data.ty1 === e.target.dataset.id) {
        return false;
      } else {
        that.setData({
          ty1: e.target.dataset.id,
        })
      }
    }
    // 请求数据
    that.goods()
  },
  swidth_o2(e) {
    var that = this
    that.setData({
      page: '2'
    })
    if (e !== undefined) {
      if (that.data.ty2 === e.target.dataset.id) {
        return false;
      } else {
        that.setData({
          ty2: e.target.dataset.id,
        })
      }
    }
    // 请求数据
    that.shop()
  },
  // 拍品下架
  down(e) {
    var that = this
    wx.showModal({
      content: '是否确认下架',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.api.sel_goods_down,
            data: {
              goods_id: e.currentTarget.dataset.id
            },
            method: 'put',
            header: t.logintype(),
            success: function (e) {
              wx.showToast({
                title: e.data.message,
                icon: 'none'
              })
              that.goods()
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  // 商品下架
  shop_down(e){
    let that=this
    wx.showModal({
      content: '是否确认下架',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.api.sel_shop_down,
            data: {
              goods_id: e.currentTarget.dataset.id
            },
            method: 'put',
            header: t.logintype(),
            success: function (e) {
              wx.showToast({
                title: e.data.message,
                icon: 'none'
              })
              that.shop()
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  //拍品重新上架 -跳转页面（拍品详情/编辑拍品）
  godetail(e) {
    var that = this
    if (that.data.ty1 == 0 || that.data.ty1 == 1 || that.data.ty1 == 2){
      wx.navigateTo({
        url: '../../../pages/videos/videos?id=' + e.currentTarget.dataset.id,
      })
    }
    if (that.data.ty1 == 3) {
      wx.navigateTo({
        url: '../../../pages/shot/release?id=' + e.currentTarget.dataset.id+'&type=1',
      })
    }
    
  },
  goods_godetail(e){
    let that=this
    wx.navigateTo({
      url: '../../../pages/shot/release?id=' + e.currentTarget.dataset.id + '&type=1',
    })
  },
  // 编辑商品
  goshopdetails(e){
    var that = this
    if (that.data.ty2 == '3'){
      wx.navigateTo({
        url: '../../../pages/shot/goods?id=' + e.currentTarget.dataset.id + '&type=2',
      })
    }else{
      wx.navigateTo({
        url: '../../../pages/videos/commoditydetails?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  shopgoods_edit(e){
    var that = this
    wx.navigateTo({
      url: '../../../pages/shot/goods?id=' + e.currentTarget.dataset.id + '&type=2',
    })
  },
  godetails(e) {
    var that = this
    wx.navigateTo({
      url: '../../../pages/shot/release?id=' + e.currentTarget.dataset.id + '&type=2',
    })
  },
  // 删除草稿箱拍品
  detel(e) {
    var that = this
    wx.showModal({
      content: '确认删除草稿',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.api.sel_goods_del,
            data: {
              goods_id: e.currentTarget.dataset.id
            },
            method: 'delete',
            header: t.logintype(),
            success: function (e) {
              wx.showToast({
                title: e.data.message,
                icon: 'none'
              })
              that.goods()
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  detel_shop(e){
    let that=this
    wx.showModal({
      content: '确认删除草稿',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.api.sel_shop_del,
            data: {
              goods_id: e.currentTarget.dataset.id
            },
            method: 'delete',
            header: t.logintype(),
            success: function (e) {
              wx.showToast({
                title: e.data.message,
                icon: 'none'
              })
              that.shop()
            }
          })
        } else if (res.cancel) {}
      }
    })
  }
})