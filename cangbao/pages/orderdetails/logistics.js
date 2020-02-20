const app = getApp()
Page({
  data: {
    logistics:null,
    logistics1:null, // 全球拍物流
    navH: '',
    headtitle: '物流信息',
    times:[],
    types:'',
    item:''
  },
  
  onLoad: function (options) {
    var that=this
    that.setData({
      navH: app.globalData.navHeight,
      types: options.types
    })
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        // 物流信息
        if (options.type==1){
          if (options.types == 3) {
            wx.request({
              url: app.api.buylogdetils + options.id + '?type=3',
              data: {},
              method: 'get',
              header: {
                "Authorization": 'bearer' + res.data,
                "content-type": "application/json",
                "cache-control": "no-cache, private",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success: function (res1) {
                if (res1.data.status_code==422){
                  wx.hideLoading();
                  wx.showToast({
                    icon: 'none',
                    title: res1.data.message,
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      note: 1
                    })
                  }, 2000)
                }else{
                  that.setData({
                    logistics1: res1.data.data
                  })
                  for (let a = 0; a < res1.data.data.length; a++) {
                    let time = []
                    for (let i = 0; i < res1.data.data[a].Traces.length; i++) {
                      let mont = res1.data.data[a].Traces[i].AcceptTime.substring(5, 10)
                      let hour = res1.data.data[a].Traces[i].AcceptTime.substring(11, 16)
                      time.push({
                        t1: mont,
                        t2: hour,
                        t3: res1.data.data[a].Traces[i].AcceptStation
                      })
                    }
                    var times = that.data.times;
                    times.push(time);
                    that.setData({
                      times: times
                    })
                  }
                  wx.hideLoading();
                }
                
              }
            })
          }
          if (options.types == 2 || options.types == 1) {
            wx.request({
              url: app.api.buylogdetils + options.id + '?type=1',
              data: {},
              method: 'get',
              header: {
                "Authorization": 'bearer' + res.data,
                "content-type": "application/json",
                "cache-control": "no-cache, private",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success: function (res1) {
                console.log(res1)
                if (res1.data.status_code == 422) {
                  wx.hideLoading();
                  wx.showToast({
                    icon: 'none',
                    title: res1.data.message,
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      note: 1
                    })
                  }, 2000)
                }else{
                  that.setData({
                    logistics: res1.data.data[0]
                  })
                  let time = []
                  for (let i = 0; i < res1.data.data[0].Traces.length; i++) {
                    let mont = res1.data.data[0].Traces[i].AcceptTime.substring(5, 10)
                    let hour = res1.data.data[0].Traces[i].AcceptTime.substring(11, 16)
                    time.push({
                      t1: mont,
                      t2: hour
                    })
                  }
                  that.setData({
                    times: time
                  })
                  wx.hideLoading();
                }
                
              }
            })
          }
        }
        if (options.type == 2) {
          if (options.types == 3) {
            wx.request({
              url: app.api.logdetils + options.id+'type=3',
              data: {},
              method: 'get',
              header: {
                "Authorization": 'bearer' + res.data,
                "content-type": "application/json",
                "cache-control": "no-cache, private",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success: function (res1) {
                that.setData({
                  logistics1: null
                })
                for (let a = 0; a < res1.data.data.length; a++) {
                  let time = []
                  for (let i = 0; i < res1.data.data[a].Traces.length; i++) {
                    let mont = res1.data.data[a].Traces[i].AcceptTime.substring(5, 10)
                    let hour = res1.data.data[a].Traces[i].AcceptTime.substring(11, 16)
                    time.push({
                      t1: mont,
                      t2: hour,
                      t3: res1.data.data[a].Traces[i].AcceptStation
                    })
                  }
                  var times = that.data.times;
                  times.push(time);
                  that.setData({
                    times: times
                  })
                  wx.hideLoading();
                }
              }
            })
          }
          if (options.types == 2 || options.types == 1){
            wx.request({
              url: app.api.logdetils + options.id + 'type=1',
              data: {},
              method: 'get',
              header: {
                "Authorization": 'bearer' + res.data,
                "content-type": "application/json",
                "cache-control": "no-cache, private",
                "x-os": "wechat_mini",
                "x-app-version": app.api.edition
              },
              success: function (res1) {
                if (res1.data.status_code==422){
                  wx.hideLoading();
                  wx.showToast({
                    icon:'none',
                    title: res1.data.message,
                  })
                  setTimeout(function(){
                    wx.navigateBack({
                      note:1
                    })
                  },2000)
                }else{
                  that.setData({
                    logistics: res1.data.data[0]
                  })
                  let time = []
                  for (let i = 0; i < res1.data.data[0].Traces.length; i++) {
                    let mont = res1.data.data[0].Traces[i].AcceptTime.substring(5, 10)
                    let hour = res1.data.data[0].Traces[i].AcceptTime.substring(11, 16)
                    time.push({
                      t1: mont,
                      t2: hour
                    })
                  }
                  that.setData({
                    times: time
                  })
                  wx.hideLoading();
                }
                
                
              }
            })
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