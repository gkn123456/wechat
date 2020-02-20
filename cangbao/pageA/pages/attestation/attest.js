// pageA/pages/attestation/attest.js
const app = getApp()
const relanding = require('../../../pages/common/relanding.js')
const t = require('../../../pages/common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    token:'',
    headtitle:'填写基础信息',
    region: ['请', '选', '择'],
    classnames:'',
    items: [
      { name: '1', value: '个人', checked: 'true' },
      { name: '2', value: '商家' },
    ],
    classname:'请选择',
    isCategory:'0',
    namecolor: 'rgba(170,170,170,1)',
    classid: '0',
    toView1:'',
    json: [],   // 主营项目(暂存数组)
    // 身份证照片
    src1: '../img/rz/identitycard.png',// 图片地址(身份证)
    key1: '',                          // 图片key值
    // 手持身份证照片
    src2: '../img/rz/identitycard.png',// 图片地址(手持身份证)
    key2: '',                          // 图片key值
    // 商家营业执照照片
    src3: '../img/rz/cary.png',// 图片地址(商家营业执照)
    key3: '',                  // 图片key值
    value: '1', // 认证类型(1-个人，2-企业)
    name: '',   // 姓名      （个人/企业 共用）
    card: '',   // 身份证号码 （个人/企业 共用）
    mobile: '', // 联系电话   (个人/企业 共用)
    wechat: '', // 微信号     (个人/企业 共用)
    area: '',   // 区县code   (个人/企业 共用)
    address: '',// 详细地址(店铺地址)(个人/企业 共用)
    project: [],// 主营项目(通过数组形式上传分类id)(个人/企业 共用)
    selname: '',// 商家名称（商家类型必传）
  },
  radioChange(e) {
    var that = this
    that.setData({
      value: e.detail.value
    })
    that.reset() 
  },
  // 重置
  reset(){
    let that=this
    that.setData({
      region: ['请', '选', '择'],
      classname: '请选择',
      isCategory: '0',
      namecolor: 'rgba(170,170,170,1)',
      classid: '0',
      toView1: '',
      json: [],   // 主营项目(暂存数组)
      src1: '../img/rz/identitycard.png',// 图片地址(身份证)
      key1: '',                          // 图片key值
      src2: '../img/rz/identitycard.png',// 图片地址(手持身份证)
      key2: '',                          // 图片key值
      src3: '../img/rz/cary.png',// 图片地址(商家营业执照)
      key3: '',                  // 图片key值
      name: '',   // 姓名      （个人/企业 共用）
      card: '',   // 身份证号码 （个人/企业 共用）
      mobile: '', // 联系电话   (个人/企业 共用)
      wechat: '', // 微信号     (个人/企业 共用)
      area: '',   // 区县code   (个人/企业 共用)
      address: '',// 详细地址(店铺地址)(个人/企业 共用)
      project: [],// 主营项目(通过数组形式上传分类id)(个人/企业 共用)
      selname: '',// 商家名称（商家类型必传）
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      token: 'bearer ' + wx.getStorageSync('token')
    })
    that.classn()
  },
  classn(){
    let that=this
    wx.request({
      url: app.api.category,
      data: {},
      method: 'get',
      header: {
        "Authorization": that.data.token,
        "content-type": "application/json",
        "x-os": "wechat_mini",
        "x-app-version": app.api.edition,
        "cache-control": "no-cache, private"
      },
      success: function (b) {
        that.setData({
          class: b.data.data
        })
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
  // input数据接收
  // 个人
  ip1(e){
    // 真实姓名
    let that=this
    that.setData({
      name: e.detail.value
    })
  },
  ip2(e) {
    // 身份证号
    let that = this
    that.setData({
      card: e.detail.value
    })
  },
  ip3(e) {
    // 联系电话
    let that = this
    that.setData({
      mobile: e.detail.value
    })
  },
  ip4(e) {
    // 微信号
    let that = this
    that.setData({
      wechat: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    // 地址选择
    this.setData({
      region: e.detail.value,
      provincecode: e.detail.code[0],
      citycode: e.detail.code[1],
      area: e.detail.code[2],
    })
  },
  ip5(e) {
    // 详细地址
    let that = this
    that.setData({
      address: e.detail.value
    })
  },
  // 商家
  sp1(e) {
    // 法人姓名
    let that = this
    that.setData({
      name: e.detail.value
    })
  },
  sp2(e) {
    // 身份证号
    let that = this
    that.setData({
      card: e.detail.value
    })
  },
  sp3(e) {
    // 联系电话
    let that = this
    that.setData({
      mobile: e.detail.value
    })
  },
  sp4(e) {
    // 微信号
    let that = this
    that.setData({
      wechat: e.detail.value
    })
  },
  sp5(e) {
    // 商家名称
    let that = this
    that.setData({
      selname: e.detail.value
    })
  },
  sp6(e) {
    // 店铺地址
    let that = this
    that.setData({
      address: e.detail.value
    })
  },
  // 经营类目
  // 显示(隐藏)
  isCategory(e){
    let that = this
    that.setData({
      isCategory: e.currentTarget.dataset.id,
    })
    if (that.data.project.length=='0'){
      that.classn()
      that.setData({
        json: []
      })
    }
  },
  isCategory1(e) {
    let that = this
    that.setData({
      isCategory: e.currentTarget.dataset.id
    })
  },
  setScrollTop1(e) {
    this.setData({
      classid: e.currentTarget.dataset.id,
      toView1: e.currentTarget.dataset.name,
    })
  },
  isCategory2(){
    let that=this
    that.setData({
      project:that.data.json,
      isCategory:'0'
    })
    if (that.data.classname == '请选择' && that.data.classnames !== ''){
      that.data.classname = that.data.classnames+'等主营类目'
      that.setData({
        classname: that.data.classnames + '等主营类目',
        namecolor: 'rgba(28,28,28,1)'
      })
      that.isco()
    }else{
      
    }
  },
  allclass(e){
    let that=this
      if (e.currentTarget.dataset.type == '5') {
        that.data.class[that.data.classid].children[e.currentTarget.dataset.id].type = '4'
        var array = that.data.json
        var index = array.indexOf(e.currentTarget.dataset.cid);
        if (index > -1) {
          array.splice(index, 1);
        }
        that.setData({
          class: that.data.class,
          json: that.data.json
        })
        if (that.data.json.length==0){
          that.setData({
            classname:'请选择',
            classnames:''
          })
        }
      } else {
        if (that.data.json.length < 10) {
          setTimeout(function () {
            that.data.class[that.data.classid].children[e.currentTarget.dataset.id].type = '5'
            that.data.classnames = e.currentTarget.dataset.name
            that.setData({
              class: that.data.class
            })
          }, 200)
          that.data.json.push(e.currentTarget.dataset.cid)
          that.setData({
            json: that.data.json
          })
        }
        
      }
    that.isco()
  },
  // 身份证照片上传
  chooseImageUpload1() {
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
                that.setData({
                  key1: jj.data.key,
                  src1: app.api.imgfield + jj.data.key + '-zvpvgsio'
                })
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
  // 手持身份证照片上传
  chooseImageUpload2() {
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
                that.setData({
                  key2: jj.data.key,
                  src2: app.api.imgfield + jj.data.key + '-zvpvgsio'
                })
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
  // 营业执照照片上传
  chooseImageUpload3() {
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
                that.setData({
                  key3: jj.data.key,
                  src3: app.api.imgfield + jj.data.key + '-zvpvgsio'
                })
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
  pers(e){
    let that=this
    let id = e.currentTarget.dataset.id
    if(id=='1'){
      if(that.data.name==''){
        wx.showToast({
          title: '请填写真实姓名',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.card == ''){
        wx.showToast({
          title: '请填写身份证号码',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.mobile == '') {
        wx.showToast({
          title: '请填写联系电话',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.wechat == '') {
        wx.showToast({
          title: '请填写微信号',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.area == '') {
        wx.showToast({
          title: '请选择地址',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.address == '') {
        wx.showToast({
          title: '请填写详细地址',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.project.length == '0') {
        wx.showToast({
          title: '请选择主营类目',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.key1=='') {
        wx.showToast({
          title: '请上传身份证照片',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.key2 == '') {
        wx.showToast({
          title: '请上传手持身份证照片',
          icon: 'none',
          duration: 1500
        })
      } else{
        let json=[{
          value: that.data.value, // 认证类型(1-个人，2-企业)
          name: that.data.name,   // 姓名      （个人/企业 共用）
          card: that.data.card,   // 身份证号码 （个人/企业 共用）
          mobile: that.data.mobile, // 联系电话   (个人/企业 共用)
          wechat: that.data.wechat, // 微信号     (个人/企业 共用)
          area: that.data.area,   // 区县code   (个人/企业 共用)
          address: that.data.address,// 详细地址(店铺地址)(个人/企业 共用)
          project: that.data.project,// 主营项目(通过数组形式上传分类id)(个人/企业 共用)
          key1: that.data.key1,
          key2: that.data.key2
        }]
        wx.navigateTo({
          url: './attestlish?json=' + JSON.stringify(json),
        })
      }
    }else{
      if (that.data.name == '') {
        wx.showToast({
          title: '请填写法人真实姓名',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.card == '') {
        wx.showToast({
          title: '请填写企业法人的身份证号码',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.mobile == '') {
        wx.showToast({
          title: '请填写联系电话',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.wechat == '') {
        wx.showToast({
          title: '请填写微信号',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.project.length == '0') {
        wx.showToast({
          title: '请选择主营类目',
          icon: 'none',
          duration: 1500
        })
      }  else if (that.data.area == '') {
        wx.showToast({
          title: '请选择所在地区',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.selname == '') {
        wx.showToast({
          title: '请填写商家名称',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.address == '') {
        wx.showToast({
          title: '请填写店铺地址',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.key1 == '') {
        wx.showToast({
          title: '请上传身份证照片',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.key2 == '') {
        wx.showToast({
          title: '请上传手持身份证照片',
          icon: 'none',
          duration: 1500
        })
      } else if (that.data.key3 == '') {
        wx.showToast({
          title: '请上传商家营业执照',
          icon: 'none',
          duration: 1500
        })
      } else {
        let json = [{
          value: that.data.value, // 认证类型(1-个人，2-企业)
          name: that.data.name,   // 姓名      （个人/企业 共用）
          card: that.data.card,   // 身份证号码 （个人/企业 共用）
          mobile: that.data.mobile, // 联系电话   (个人/企业 共用)
          wechat: that.data.wechat, // 微信号     (个人/企业 共用)
          area: that.data.area,   // 区县code   (个人/企业 共用)
          address: that.data.address,// 详细地址(店铺地址)(个人/企业 共用)
          project: that.data.project,// 主营项目(通过数组形式上传分类id)(个人/企业 共用)
          selname: that.data.selname,// 商家名称（商家类型必传）
          key1: that.data.key1,
          key2: that.data.key2,
          key3: that.data.key3,
        }]
        wx.navigateTo({
          url: './attestlish?json=' + JSON.stringify(json),
        })
      }
    }
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
  isco(){
    let that=this
    if (that.data.classname=='请选择'){
      that.setData({
        namecolor: 'rgba(170,170,170,1)'
      })
    }else{
      that.setData({
        namecolor: 'rgba(28,28,28,1)'
      })
    }
  }
})