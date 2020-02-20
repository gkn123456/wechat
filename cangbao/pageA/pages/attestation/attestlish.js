// pageA/pages/attestation/attestlish.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    token: '',
    type:'',
    headtitle: '填写资质信息',
    arry1: ['1年以内', '1-3年', '3-5年', '5-10年', '10年以上'],
    pick1:'去选择',
    arry2: ['10人以下', '10-50人', '50-100人', '100人以上'],
    pick2: '去选择',
    img1:'../img/rz/identitycard.png',
    img2:'../img/rz/identitycard.png',
    img3:'../img/rz/identitycard.png',
    imgs1: '../img/rz/identitycard.png',
    imgs2: '../img/rz/identitycard.png',
    imgs3: '../img/rz/identitycard.png',
    imgkey1:'',
    imgkey2:'',
    imgkey3:'',
    imgskey1: '',
    imgskey2: '',
    imgskey3: '',
    years: '', // 从业年限
    peoples: '', // 公司规模
    desc: '',// 相关经历
    channel: '',// 销售渠道
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      token: 'bearer ' + wx.getStorageSync('token'),
      json: JSON.parse(options.json)[0],
      type: JSON.parse(options.json)[0].value
    })
    console.log(that.data.json)
  },
  bindPickerChange(e){
    let that=this
    that.setData({
      pick1: that.data.arry1[e.detail.value],
      years: that.data.arry1[e.detail.value],
    })
  },
  bindPickerChange1(e) {
    let that = this
    that.setData({
      pick2: that.data.arry2[e.detail.value],
      peoples: that.data.arry2[e.detail.value]
    })
  },
  input1(e){
    let that=this
    that.setData({
      desc: e.detail.value
    })
  },
  input2(e) {
    let that = this
    that.setData({
      channel: e.detail.value
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
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  backhome() {
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  previousstep(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 店铺照片
  chooseImageUpload1(e) {
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
            var jsonStr = c.data
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
              var jj = JSON.parse(jsonStr);
              if (jj.status_code == 200) {
                if (e.currentTarget.dataset.id=='1'){
                  that.setData({
                    imgkey1: jj.data.key,
                    img1: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (e.currentTarget.dataset.id == '2') {
                  that.setData({
                    imgkey2: jj.data.key,
                    img2: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (e.currentTarget.dataset.id == '3') {
                  that.setData({
                    imgkey3: jj.data.key,
                    img3: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                
              }
              if (jj.status_code == 401) {
                relanding.relanding()
                setTimeout(function () {
                  that.chooseImageUpload1()
                }, 1000)
              }
            }
          }
        })
      }
    })
  },
  // 相关证书
  chooseImageUpload2(e) {
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
            var jsonStr = c.data
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
              var jj = JSON.parse(jsonStr);
              if (jj.status_code == 200) {
                if (e.currentTarget.dataset.id == '1') {
                  that.setData({
                    imgskey1: jj.data.key,
                    imgs1: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (e.currentTarget.dataset.id == '2') {
                  that.setData({
                    imgskey2: jj.data.key,
                    imgs2: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }
                if (e.currentTarget.dataset.id == '3') {
                  that.setData({
                    imgskey3: jj.data.key,
                    imgs3: app.api.imgfield + jj.data.key + '-zvpvgsio'
                  })
                }

              }
              if (jj.status_code == 401) {
                relanding.relanding()
                setTimeout(function () {
                  that.chooseImageUpload1()
                }, 1000)
              }
            }
          }
        })
      }
    })
  },
  submission(){
    let that=this
    let d = that.data.json
    let seller_photo = [that.data.imgkey1, that.data.imgkey3, that.data.imgkey2]
    let other_photo = [that.data.imgskey1, that.data.imgskey3, that.data.imgskey2]
    let datas={}
    if(that.data.type=='1'){
      datas={
        class:1,
        name:d.name,
        card:d.card,
        mobile: d.mobile,
        wechat: d.wechat,
        project: d.project,
        area_code: d.area,
        address: d.address,
        card_photo_positive:d.key1,
        card_photo_hand: d.key2,
        peoples: that.data.peoples,
        desc: that.data.desc,
        years: that.data.years,
        channel: that.data.channel,
        seller_photo: seller_photo,
        other_photo: other_photo,
      }
    }else{
      datas = {
        class:2,
        name: d.name,
        card: d.card,
        mobile: d.mobile,
        wechat: d.wechat,
        project: d.project,
        area_code: d.area,
        address: d.address,
        card_photo_positive: d.key1,
        card_photo_hand: d.key2,
        company_photo_licence: d.key3,
        company_name: d.selname,// 商家名称（商家类型必传）
        peoples: that.data.peoples,
        desc: that.data.desc,
        channel: that.data.channel,
        seller_photo: seller_photo,
        other_photo: other_photo,
      }
    }
    wx.request({
      url: app.api.attestation,
      data: datas,
      method: 'post',
      header: t.logintype(),
      success: function (b) {
        if (b.data.status_code==200){
          wx.showToast({
            title: b.data.message,
            icon: 'none'
          })
          wx.navigateBack({
            delta: 2
          })
          wx.navigateTo({
            url: './attestcenter',
          })
        }else{
          wx.showToast({
            title: b.data.message,
            icon:'none'
          })
        }
      }
    })
  }
})