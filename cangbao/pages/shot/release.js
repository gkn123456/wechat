const app = getApp()
const relanding = require('../common/relanding.js')
const t = require('../common/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:[],
    navH: '',
    headtitle: '编辑拍品',
    srcs:[],
    video:'',
    id:'',
    cut:'0',
    cuts: '0',// 设置封面
    v: 'none',// 描述显示隐藏
    v1: 'none',// 分类显示隐藏
    v2: 'none',// 预览图片显示隐藏
    textvalue: '',// 描述文本域中内容
    textvalue1: '',// 列表描述文本内容（上传描述文本)
    title: '', // 列表名称（上传名称)
    weight: '',// 列表重量（上传重量)
    color: '', // 列表颜色（上传颜色)
    origin: '',// 列表产地（上传产地)
    rank: '',// 列表等级（上传等级)
    technics: '',// 列表工艺（上传工艺)
    num:'',// 列表数量（上传数量)
    flaw: '',// 列表有无瑕疵（上传有无瑕疵)
    lisimg:[],// 上传图片key数组
    videokey:null,// 上传视频key
    coverimg:'',
    coverkey:'null',
    cateid: '',// 上传分类id
// 重新上拍
    return: '1',       //是否包退 1是 0否
    start_price: '',  //起拍价
    direct_price: '0', //一口价 0为无一口价
    range_price: '',  //加价幅度
    guide_price: '',  //参考价
    hide_guide: '1',   //是否隐藏参考价 1是 0否
    deposit_price: '0',//保证金金额
    is_deposit: '',   //是否已经缴纳保证金
    goods_id: '',     //
// 滑动所需要变量
    class:[],
    classid:'0',
    isTap: true,
    classifySeleted:'',
    typeIndex: '',
    jsonStr:[],
    catename:'选择分类',
    record_id:0,
    flag: false,
  // 测试排序所需变量
    hidden: true,
    flage: false,
    x: -100,
    y: 0,
    disabled: true,
    elements: [],
    beginImg:'',
    beginIndex:'',
    cd:''
  },
  // 测试排序获取所需图片位置信息(onload，上传等调用)
  obtainsort() {
    const that = this
    var query = wx.createSelectorQuery();
    var nodesRef = query.selectAll(".imglist");
    nodesRef.fields({
      dataset: true,
      rect: true
    }, (result) => {
      this.setData({
        elements: result
      })
    }).exec()
  },
  // 测试排序功能
  //长按
  _longtap: function (e) {
    const detail = e.detail;
    this.setData({
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
    this.setData({
      hidden: false,
      flage: true,
      cd:0
    })
  },
  //触摸开始
  touchs: function (e) {
    this.setData({
      beginIndex: e.currentTarget.dataset.index,
      beginImg: e.currentTarget.dataset.img
    })
  },
  //触摸结束
  touchend: function (e) {
    if (!this.data.flage) {
      return;
    }
    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY
    const list = this.data.elements;

    const srcs = this.data.srcs
    const lisimg = this.data.lisimg
    for (var j = 0; j < list.length; j++) {
      const item = list[j];
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
        const endIndex = item.dataset.id;
        const beginIndex = this.data.beginIndex;
        srcs.splice(beginIndex, 1);
        srcs.splice(endIndex, 0, this.data.beginImg);
        const key = lisimg[beginIndex]
        lisimg.splice(beginIndex, 1);
        lisimg.splice(endIndex, 0, key);
      }
    }
    this.setData({
      hidden: true,
      flage: false,
      srcs: srcs,
      beginIndex:'',
      cd: 1
    })
  },
  //滑动
  touchm: function (e) {
    if (this.data.flage) {
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      this.setData({
        x: x-80,
        y:y-160
      })
    }
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
      url: app.api.category,
      data: {},
      method: 'get',
      header:t.logintype(),
      success: function (b) {
        that.setData({
          class: b.data.data
        })
      }
    })
    if(options.id!==undefined){
      if (options.type==1){
        wx.request({
          url: app.api.sel_goods_edit + options.id,
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (c) {
            that.setData({
              goods_id: options.id,
              cateid: c.data.data.cate_id,// 上传分类id
              title: c.data.data.title,      // 列表名称（上传名称)
              coverkey: c.data.data.cover_key,
              return: c.data.data.return,       //是否包退 1是 0否
              start_price: c.data.data.start_price,  //起拍价
              direct_price: c.data.data.direct_price, //一口价 0为无一口价
              range_price: c.data.data.range_price,  //加价幅度
              guide_price: c.data.data.guide_price,  //参考价
              hide_guide: c.data.data.hide_guide,   //是否隐藏参考价 1是 0否
              deposit_price: c.data.data.deposit_price,//保证金金额
              is_deposit: c.data.data.is_deposit,   //是否已经缴纳保证金
            })
            if (c.data.data.desc !== 'null' || c.data.data.desc!==''){
              that.setData({
                textvalue1: c.data.data.desc, // 列表描述文本内容（上传描述文本)
              })
            }
            if (c.data.data.video_key !== null) {
              that.setData({
                videokey: c.data.data.video_key,// 上传视频key
              })
            }
            if (c.data.data.video !== null) {
              that.setData({
                video: c.data.data.video,// 上传视频key
              })
            }
            if (c.data.data.images_key!==null){
              that.setData({
                lisimg: c.data.data.images_key,// 上传图片key数组
              })
            }
            if (c.data.data.images !== null) {
              that.setData({
                srcs: c.data.data.images,
              })
            }
            wx.request({
              url: app.api.category,
              data: {},
              method: 'get',
              header: t.logintype(),
              success: function (b) {
                let clss = []
                for (let i = 0; i < b.data.data.length; i++) {
                  for (let i1 = 0; i1 < b.data.data[i].children.length; i1++) {
                    clss.push(b.data.data[i].children[i1])
                  }
                }
                that.setData({
                  catename: clss.filter(function (x) { return x.cate_id == c.data.data.cate_id })[0].cate_name
                })
              }
            })
            that.obtainsort()
          }
        })
      }
      if (options.type == 2) {
        wx.request({
          url: app.api.sel_shop_edit + options.id,
          data: {},
          method: 'get',
          header: t.logintype(),
          success: function (c) {
            that.setData({
              goods_id: options.id,
              cateid: c.data.data.cate_id,// 上传分类id
              title: c.data.data.title,      // 列表名称（上传名称)
              coverkey: c.data.data.cover_key,
            })
            if (c.data.data.desc !== 'null' || c.data.data.desc !== '') {
              that.setData({
                textvalue1: c.data.data.desc, // 列表描述文本内容（上传描述文本)
              })
            }
            if (c.data.data.video_key !== null) {
              that.setData({
                videokey: c.data.data.video_key,// 上传视频key
              })
            }
            if (c.data.data.video !== null) {
              that.setData({
                video: c.data.data.video,// 上传视频key
              })
            }
            if (c.data.data.images_key !== null) {
              that.setData({
                lisimg: c.data.data.images_key,// 上传图片key数组
              })
            }
            if (c.data.data.images !== null) {
              that.setData({
                srcs: c.data.data.images,
              })
            }
            wx.request({
              url: app.api.category,
              data: {},
              method: 'get',
              header: t.logintype(),
              success: function (b) {
                let clss = []
                for (let i = 0; i < b.data.data.length; i++) {
                  for (let i1 = 0; i1 < b.data.data[i].children.length; i1++) {
                    clss.push(b.data.data[i].children[i1])
                  }
                }
                that.setData({
                  catename: clss.filter(function (x) { return x.cate_id == c.data.data.cate_id })[0].cate_name
                })
              }
            })
            that.obtainsort()
          }
        })
      }
    }
    that.obtainsort()
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
  // 预览选择的图片
  previewImg: function (e) {
    var that = this
    that.setData({
      v2:'block',
      id: e.currentTarget.dataset.id,
      cut: e.currentTarget.dataset.id,
    })
  },
  swiper(e){
    var that = this
    that.setData({
      cut: e.detail.current,
      id: e.detail.current
    })
  },
  fit(){
    var that = this
    that.setData({
      cuts: that.data.cut,
      v2:'none'
    })
  },
  closeimg(){
    var that = this
    that.setData({
      v2: 'none'
    })
  },
  // 删除图片
  remove(e){
    var that=this
    var array = that.data.src
    var array1 = that.data.srcs
    var array2 = that.data.lisimg
    array.splice(e.currentTarget.dataset.id, 1);
    array1.splice(e.currentTarget.dataset.id, 1);
    array2.splice(e.currentTarget.dataset.id, 1);
    that.setData({
      src: array,
      srcs: array1,
      lisimg: array2
    })
    if (e.currentTarget.dataset.id==0){
      if (that.data.srcs.length==0){
        that.setData({
          cuts: 0,
          cut: 0,
          id: 0
        })
      }else{
        if (e.currentTarget.dataset.id < that.data.cuts) {
          that.setData({
            cuts: Number(that.data.cuts) - 1,
            cut: Number(that.data.cuts) - 1,
          })
        }
        if (e.currentTarget.dataset.id == that.data.cuts) {
          that.setData({
            cuts: 0,
            cut: 0,
            id: 0
          })
        }
      }
    } else if (that.data.srcs.length==0){
      that.setData({
        cuts: 0,
        cut: 0,
        id:0
      })
    }else{
      if (e.currentTarget.dataset.id <= that.data.cuts) {
        that.setData({
          cuts: Number(that.data.cuts) - 1,
          cut: Number(that.data.cuts) - 1,
          id: 0
        })
      }
    }
    // 测试获取排序调用
    that.obtainsort()
  },
  // 上传视频
  bindMenu1: function () {
    var that=this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        that.setData({
          video:res.tempFilePath,
          coverimg: res.thumbTempFilePath
        })
        wx.showLoading({
          mask: true,
          title: '视频上传中',
        })
        const uploadTask = wx.uploadFile({
          url: app.api.localvideo,
          filePath: that.data.video,
          name: 'video',
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
              that.setData({
                videokey: jj.data.key
              })
            }
          }
        })
        uploadTask.onProgressUpdate((res) => {
          if (res.progress == 100) {
            setTimeout(function () {
              wx.hideLoading()
            }, 500)
          }
        })
      }
    })
  },
  // 上传图片
  bindMenu2: function () {
    var that=this
    if (that.data.srcs.length<9){
      wx.chooseImage({
        count: 9 - that.data.srcs.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths
          let r = []
          for (let i = 0; i < res.tempFilePaths.length; i++){
            r.push(
              res.tempFiles[i]
            )
          }
          that.setData({
            src: r,
            flag:true
          })
          setTimeout(function(){
            let listimg = that.data.lisimg
            let srcs = that.data.srcs
            let l = that.data.src.length
            wx.showLoading({
              mask:true,
              title: '上传中',
            })
            if (that.data.flag == true) {
              that.setData({
                record_id: that.data.srcs.length,
                flag: false
              })
            }
            for (let i = 0; i < that.data.src.length; i++) {
              const uploadTask = wx.uploadFile({
                url: app.api.localimg,
                filePath: that.data.src[i].path,
                name: 'images',
                header: t.logintype(),
                success(c) {
                  var jsonStr = c.data
                  jsonStr = jsonStr.replace(" ", "");
                  if (typeof jsonStr != 'object') {
                    jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                    var jj = JSON.parse(jsonStr);
                    if (jj.status_code == 200) {
                      listimg.push(
                        jj.data.key
                      )
                      that.setData({
                        lisimg: listimg
                      })
                      srcs.push(
                        app.api.imgfield + jj.data.key + '-zvpvgsio'
                      )
                      that.setData({
                        srcs: srcs
                      })
                    }
                    if (jj.status_code == 401) {
                      relanding.relanding()
                      setTimeout(function () {
                        that.bindMenu2()
                      }, 1000)
                    }
                  }
                }
              })
              uploadTask.onProgressUpdate((res) => {

              })
            }
          },500)
        }
      })
    }
  },
  bindload(e){
    const that=this
    setTimeout(function(){
      const id = that.data.record_id > 1 ? Number((that.data.record_id-1) + that.data.src.length): Number((that.data.record_id-1) + that.data.src.length)
      if (id == Number(e.currentTarget.dataset.id)) {
        // 测试获取排序调用
        that.obtainsort()
        wx.hideLoading()
      }
    },500)
  },
  // 添加描述
  adddescribe(){
    var that=this
    that.setData({
      v:'block',
      textvalue: that.data.textvalue1
    })
  },
  // 添加名称
  name(e){
    var that = this
    that.setData({
      title: e.detail.value
    })
  },
  // 添加重量
  weight(e){
    var that = this
    that.setData({
      weight: e.detail.value
    })
  },
  // 添加颜色
  color(e) {
    var that = this
    that.setData({
      color: e.detail.value
    })
  },
  // 添加产地
  origin(e) {
    var that = this
    that.setData({
      origin: e.detail.value
    })
  },
  // 添加等级
  rank(e) {
    var that = this
    that.setData({
      rank: e.detail.value
    })
  },
  // 添加工艺
  technics(e) {
    var that = this
    that.setData({
      technics: e.detail.value
    })
  },
  // 添加数量
  num(e) {
    var that = this
    that.setData({
      num: e.detail.value
    })
  },
  // 添加有无瑕疵d
  flaw(e) {
    var that = this
    that.setData({
      flaw: e.detail.value
    })
  },
// 添加分类
    tapClassify: function (e) {
      var that=this
      that.setData({
        classid: e.currentTarget.dataset.id
      })
    },
    // 获取分类id
    gain(e){
      var that = this
      that.setData({
        cateid: e.currentTarget.dataset.id,
        catename: e.currentTarget.dataset.name,
      })
      that.close()
    },
    // 打开分类
    openclass(){
      var that = this
      that.setData({
        v1: 'block'
      })
    },
    // 关闭分类
    close(){
      var that = this
      that.setData({
        v1:'none'
      })
    },
// 下一步跳转
  step(){
    var that=this
    var model = JSON.stringify(that.data.lisimg);
    if (that.data.lisimg.length == '0'){
      t.alert('照片至少选择一张,请添加')
    }else if (that.data.title == ''){
      t.alert('拍品名字为2到20个字符')
    } else if (that.data.cateid == ''){
      t.alert('请选择分类')
    }else {
      wx.navigateTo({
        url: '../shot/info?cateid=' + that.data.cateid + '&title=' + that.data.title + '&textvalue1=' + that.data.textvalue1 + '&videokey=' + that.data.videokey + '&lisimg=' + model + '&coverkey=' + that.data.coverkey + '&coverskey=' + that.data.lisimg[that.data.cuts] + '&return=' + that.data.return + '&start_price=' + that.data.start_price + '&direct_price=' + that.data.direct_price + '&range_price=' + that.data.range_price + '&guide_price=' + that.data.guide_price + '&hide_guide=' + that.data.hide_guide + '&deposit_price=' + that.data.deposit_price + '&is_deposit=' + that.data.is_deposit + '&goods_id=' + that.data.goods_id,
      })
    }
  },
// 协议跳转
  goread() {
    wx.navigateTo({
      url: '../my/Agreement/Agreement?src=https://www.cangbaopai.com/xieyi/usera.html',
    })
  },
// 描述页面内事件
      // 取消
        cancel(){
          var that = this
          if (that.data.textvalue==''){
            that.setData({
              v: 'none',
              textvalue: that.data.textvalue
            })
          }else{
            wx.showModal({
              content: '是否放弃修改',
              success(res){
                if (res.confirm){
                  that.setData({
                    v: 'none',
                    textvalue1: that.data.textvalue1
                  })
                }else{}
              }
            })
          }
        },
      // 确定
        sure(){
          var that = this
          that.setData({
            v: 'none',
            textvalue1: that.data.textvalue
          })
        },
      // 获取文本域内容
        textarea(e){
          var that = this
          that.setData({
            textvalue: e.detail.value
          })
        },
  // 存入草稿箱
  keep(){
    var that=this
    var data={}
    if (that.data.videokey!==null){
      data = {
        cate_id: that.data.cateid,
        title: that.data.title,
        desc: that.data.textvalue1,
        video: that.data.videokey,
        cover: that.data.lisimg[0],
        images: that.data.lisimg
      }
    } else if (that.data.lisimg==null){
      data = {
        cate_id: that.data.cateid,
        title: that.data.title,
        desc: that.data.textvalue1,
      }
    }else{
      data = {
        cate_id: that.data.cateid,
        title: that.data.title,
        desc: that.data.textvalue1,
        cover: that.data.lisimg[0],
        images: that.data.lisimg
      }
    }
    wx.request({
      url: app.api.sel_goods_del,
      method: 'post',
      data: data,
      header: t.logintype(),
      success: function (b) {
        t.alert(b.data.message)
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
      url: '../index/index',
    })
  }
})