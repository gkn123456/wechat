const GsManager = require('./gcsdk.js')
const checkUpdateVersion = require('./utils/util.js')
const url ='https://test.cangbaopai.com/'
import io from './utils/socket.io.xcx.min.js'
//socket连接
const socketio='http://test.cangbaopai.com/live_room_nsp'
App({
  onLaunch: function (options) {
    checkUpdateVersion.checkUpdateVersion()
    GsManager.init('mhT1oeCDryAoxVpx8eBYq1')
    GsManager.setSessionTime(30000)
    this.globalData.scene = options.scene;
    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight = res.statusBarHeight + 46;
        this.globalData.statusBarHeight = res.statusBarHeight
      },
      fail(err) {}
    })
    const wxuuid = wx.getStorageSync('wxuuid');
    if (!wxuuid){
      wx.setStorageSync('wxuuid', checkUpdateVersion.wxuuid())
    }
  },
  onShow:function(options){
    this.globalData.scene = options.scene;
    this.globalData.shareTicket = options.shareTicket
    this.globalData.socket=io(socketio)
  },
  onHide:function(){
    this.globalData.socket.close()
  },
  api:{
    field: 'https://api.cangbaopai.com/',
    // 图片
    imgfield: 'https://images.cangbaopai.com/',
    // 本地上传图片
    localimg: url +'qiniu_local_images',
    // 本地上传视频
    localvideo: url +'qiniu_local_video',
    // 小程序登陆 [post]
    login: url +'login/wechat_mini',
    // 绑定手机号
    login_mobile: url +'login/bind_mini',
    // 短信验证码
    verify: url +'verify/sms',
    // 接收小程序formId和prepay_id  [post]
    formId: url +'wechat_mini/message',
    // 获取登陆用户信息   [get]
    user: url +'user',
    // 反馈  [post]
    feedback: url +'feedback',
    // 举报
    report: url + 'report',
    // 获取用户收货地址列表
    address: url +'address/column',
    // 清关证件列表
    customcert_list: url + 'customcert/column',
    // 默认收货地址
    addressdefault: url +'address/default',
    // 创建 删除 更新收货地址 [post delete put] 
    u_address: url +'address',
    // 收货地址详细信息(address/{address_id})
    address_details: url +'address/',
    // 创建 删除 更新清关证件 [post delete put]
    customcert: url +'customcert',
    // 分类(path:'type':类型 1 普通商品 2 全球拍 默认1)
    category: url +'category',
    // 币种
    currency: url +'auction/currency',
    // 首页轮播
    banner: url+'slideshow',
    // 热门拍卖行
    hot_auchouse: url +'hot_auction_house',
    // 搜索（旧版废弃）
    search: url +'goods/column/search/',
    // 搜索（新版）
    newsearch: url +'search/all/',
    // 查看更多国内拍
    normal: url +'search/normal?search=',
    // 查看更多全球拍商品
    globallist: url + 'search/global?search=',
    // 查看更多拍卖会[search/auction_hall/{search}]
    hall: url + 'search/auction_hall?search=',
    // 查看更多拍卖行[search/auction_house/{search}]
    ahouse: url + 'search/auction_house?search=',
    // 查看更多店铺[search/seller/{search}]
    shopsell: url + 'search/seller?search=',

    // 首页拍品列表
    newgoodslist: url + 'search/normal?mark=',
    // 国内拍分类
    classgoodslist: url + 'search/normal?cate_id=',
    // 首页热门拍卖会列表
    newauctionlist: url + 'search/auction_hall?time=',
    //（首页全球拍拍品列表/拍卖会商品列表 / 分类全球拍拍品)
    newglobal: url + 'search/global',
    // 拍卖行列表
    newauchouse: url +'search/auction_house',
    // 拍卖行拍卖会列表
    newauchouseauc: url + 'search/auction_hall',
    // 获取全球拍拍卖会日历场次 [GET auction / count]
    auc_calendarcount: url + 'auction/count?time=',
    // 获取全球拍拍卖会列表 [auction / auction]
    new_auctionlist: url +'auction/auction?time=',

    // 店铺基本信息(seller/{seller_id})
    selinformation: url +'seller/',
    // 自身商家信息
    sell_user: url +'user/seller',
    // 获取认证信息(创建认证)
    attestation: url +'authenticate',
    // 获取店铺二维码图片地址(seller/card/{seller_id} 店铺id，即用户id)
    shop_arcode: url +'seller/card/',
    // 获取店铺二维码申请条件
    applycondition: url +'seller/card_condition',
    // 申请邮寄店铺名片
    mail_card: url +'seller/card',
    // 获取店铺拍品列表(seller/column/{type}/{seller_id}/{page})[auctioning-拍卖中，end-已结束]
    selgoodlist: url + 'seller/column/',
    // 获取店铺宝库商品列表(seller/shop_column/{class}/{seller_id}/{page})[类型 请填写固定字符 all]
    selshoplist: url + 'seller/shop_column/all/',
    // 获取店铺的评价列表(appraise/column/{seller_id}/{page})
    selevaluate: url +'appraise/column/',
    // ---弃用---[拍品列表(goods/column/{mark}/{page})]
    goods_column: url +'goods/column/',
    // ---弃用---获取分类拍品列表
    goodscategory: url +'goods/column/category/',
    // ---弃用---获取拍卖行拍卖会列表
    auchousthome: url + 'auction/seller/auction/',
    // ---弃用---拍卖行列表
    auctionhouse: url + 'auction/seller/',
    // ---弃用---拍卖会列表(time 时间格式2019-04-01)
    auction: url + 'auction/auction/',
    // ---弃用---获取全球拍商品列表(auction/column/{page})
    goods_global: url + 'auction/column/',
    // ---弃用---拍卖会商品列表
    global_auctiongoods: url + 'auction/goodslist/',
    // 普通拍[拍品详情]
    video_goods: url +'goods/',
    // 商品[拍品详情]
    shop_details: url + 'shop/',
    // 全球拍[拍品详情]
    global_goods: url + 'auction/goods/',
    // 获取全球拍拍卖行[详情]
    auchouse: url + 'auction/seller/detail/',
    //拍卖会[详情]
    global_auction: url + 'auction/detail/',
    // 发布新拍品或重新上架
    goodsrelease: url +'goods',
    // 全部出价信息
    all_offer: url +'bidder/list/',
    // 评论信息(评论出价)
    comment: url +'comment/column/',
    // 取消关注(关注用户店铺)[delete/post]
    user_detfollow: url + 'follow',
    // 点赞
    fabulous: url +'up',
    // 评论
    comments: url +'comment',
    // 确认出价
    confirmoffer: url +'bidder',
    // 全球拍取消出价
    globalcancel: url +'bidder/cancel',
    // 全球拍出价
    globalbidder: url +'bidder/global',
    // 物流信息(卖家)
    logdetils: url +'delivery/seller/',
    // 物流信息(买家)
    buylogdetils: url +'delivery/buyer/',
    // 订单详情(买家)
    order_details: url +'order/',
    // 订单详情(卖家)
    order_sel_details: url +'seller/order/',
    // 订单列表(order/column/{type}/{page})
    order_list: url +'order/column/',
    // 获取订单各个状态的数量
    order_count: url +'order/count',
    // 更改订单收货地址   [put]
    order_addressput: url +'order/address',
    // 更改清关证件
    order_custom: url +'order/custom_cert',
    // 删除订单   [delete]
    order_delete: url +'order',
    // 提醒发货（order/remind）[post]
    order_remind: url +'order/remind',
    // 确认收货
    order_confirm: url +'order/confirm',
    // 申请退款 (order/refund) [post]
    order_refund: url +'order/refund',
    // 取消申请
    order_del_refund: url +'order/cancel_return',
    // 买家申请退货   [post]
    order_return: url +'order/return',
    // 买家发回退货   [post]
    buyer_return: url +'delivery/return',
    // 卖家订单详情
    seller_order: url +'seller/order/',
    // 卖家为订单发货  [post]
    deller_delivery: url +'delivery',
    // 可用物流公司
    delivery: url +'delivery/company',
    // 获取卖家订单各个状态的数量
    sel_order_cont: url +'seller/order/count',
    // 拍品管理各状态
    sel_goods_type: url +'goods/seller/column/',
    // 获取卖家订单列表(seller/order/column/{type}/{page})[ all-所有订单，pay-待支付，send-待发货，receive-待收货，complete-已完成，return_wait-退货待处理，return_doing-退货进行中，return_complete-退货已完成]
    sel_order_list: url +'seller/order/column/',
    // 视频拍下架
    sel_goods_down: url +'goods/down',
    // 发布新宝库商品或重新编辑
    shoprelease: url +'shop',
    // 宝库下架()[put]
    sel_shop_down: url +'shop/down',
    // 删除草稿箱拍品
    sel_goods_del: url +'goods/draft',
    // 删除草稿箱商品
    sel_shop_del: url +'shop/draft',
    // 卖家获取自己发布的宝库商品列表(show-展示中 end-已卖出 draft-草稿箱 fail-已失败)[shop/seller/column/{type}/{page}]
    sel_shop_list: url +'shop/seller/column/',
    // 获取需编辑拍品的参数
    sel_goods_edit: url +'goods/edit/',
    // 获取需编辑宝库商品的参数
    sel_shop_edit: url +'shop/edit/',
    // 卖家同意退货
    agree_return: url +'seller/order/agree_return',
    // 卖家拒绝退货
    refuse_return: url +'seller/order/refuse_return',
    // 卖家收到退货
    confirmreceiving: url +'seller/order/confirm_return',
    // 创建新订单评价
    newappraise: url +'appraise',
    // 商品下单
    shop_order: url +'shop/order',
    //收藏拍卖会
    gloabl_auctioncollection: url +'collection_auction',
    //全球拍收藏拍品(取消)
    gloabl_collection: url +'collection',
    // 关注列表
    user_follow: url +'follow/column/seller/',
    // 粉丝列表
    user_fans: url +'follow/column/fans/',
    // 拍品[参拍列表]
    partake_goods: url +'bidder/column/1/',
    // 全球拍[参拍列表]
    partake_global: url +'bidder/column/2/',
    // 拍品[收藏列表]
    collect_goods: url +'collection/column/1/',
    // 宝库[收藏列表]
    collect_treasury: url +'collection/column/2/',
    // 全球拍[收藏列表]
    collect_global: url +'collection/column/3/',
    // 拍卖会[收藏列表]
    collect_auction: url +'collection/auction/',
    // 批量取消收藏
    batch_cancel: url +'collection/batch',
    // 保证金详情
    depositdetailed: url +'deposit/',
    // 冻结保证金
    frozendeposit: url +'deposit/count',
    // 保证金账户详细
    bondaccount_details: url + 'deposit/account',
    // 保证金账户申请提现到钱包POST wallet/draw_wallet
    cashtowallet: url +'wallet/draw_wallet',
    // 保证金列表
    depositlist: url +'deposit/',
    // 保证金账户列表[GET deposit/ledger/{page}]
    bondaccount: url + 'deposit/ledger/',
    // 获取支付方式(场景 1为订单支付 2充值余额 3支付保证金 4运费)
    pay_type: url +'pay/method/',
    // 拍品保证金
    goods_deposit: url +'pay/deposit',
    // 充值（pay/recharge）
    recharge: url +'pay/recharge',
    // 申请提现
    cash: url +'wallet/draw_cash',
    // 设置支付密码
    setpassword: url +'wallet/password',
    // 验证设置支付密码时验证码是否正确
    checkpassword: url +'wallet/check_password',
    // 设置实名认证
    setrealname: url +'wallet/real_name',
    // 订单支付
    pay_order: url +'pay/order',
    // 全球拍支付运费
    global_payfreight: url + 'pay/freight',
    // 支付全球拍保证金
    global_bond_pay: url + 'pay/globalDeposit',
    // 获取绑定银行卡列表(删除绑定的银行卡/绑定提现银行卡)[get/delete/post]
    bankcard: url +'card',
    // 获取支持的银行列表
    bank_list: url +'card/banks',
    // 获取绑定银行卡的账户信息
    bankcard_user: url +'card/bank_real_name',
    // 获取余额明细列表(wallet/record/{page})
    balance_det: url +'wallet/record/',
    // 优惠券列表 coupon/column/{type}/{page} 0-未使用，1-已使用，2-已过期
    coupon: url +'coupon/column/',
    // 兑换优惠券 coupon/exchange [post]    formData: code-兑换码
    exchange:url+'coupon/exchange',
    // 删除优惠券 coupon  [delete]          formData: coupon_id-用户优惠券ID
    delcoupon: url +'coupon',
    // 获取可用优惠券的列表 coupon/usable/{order_id}     path: order_id-订单ID
    availablelist: url + 'coupon/usable/',
    // 获取可用优惠券数量 coupon/usable_count/{order_id} path: order_id-订单ID
    availablenum: url + 'coupon/usable_count/',
    // 获取投票列表 [vote/column/{page}]
    vote_list: url +'vote/column/',
    // 获取我的投票列表 [vote/voted/{page}]
    m_vote_list: url + 'vote/voted/',
    // 获取投票详情 [vote/{vote_id}]
    vote_details: url +'vote/',
    // 投票[vote]
    vote: url +'vote',
    // 获取投票机会
    vote_opportunity: url +'vote/get_chance',

// --直播--
    // 直播房间基本信息
    liveinfo: url +'live/info/',
    // 直播观众列表
    liveviewer: url +'live/viewer/',
    // 直播房间列表
    live_list: url +'live/column/',
    // 直播间拍品列表
    live_goodslist: url +'live/goods/',
    // 直播提交订单
    creat_live_order:url+'live/order',
    // 直播一口价详情
    live_goods_info: url +'live/goods_info/',
    // 开通直播续费类型
    expiry_type: url +'live/expiry_type',
    // 支付直播费用
    live_expiry: url +'pay/live_expiry',
    // 直播开通列表
    expiry_record:url +'live/expiry_record/',
    // 获取待支付直播订单列表
    live_order:url+'order/live_order',
    
    //app落地页
    // 个人主页
    personalpage:'bjcbapp://seller_detail/user_id/',
    // 拍品详情
    goodspage: 'bjcbapp://goods_detail/goods/goods_id/',
    // 商品详情
    shopgoodspage:'bjcbapp://goods_detail/shop/goods_id/',
    // 全球拍拍品详情
    globalpage: 'bjcbapp://global_goods_detail/goods_id/',
    // 拍卖会
    auctionpage:'bjcbapp://global_auction_list/auction_id/',
    // 拍卖行
    auchousepage:'bjcbapp://global_seller_list/seller_id/',
    // 全球拍拍品url
    url_globalgoods:'https://www.cangbaopai.com/share/global_goods/?goods_id=',
    // 视频拍
    url_goods:'https://www.cangbaopai.com/share/goods/?goods_id=',
    // 宝库拍品
    url_treasurygoods:'https://www.cangbaopai.com/share/treasury/?goods_id=',
    // 拍卖会url
    url_auction:'https://www.cangbaopai.com/share/global/?auction_id=',
    // 分享appurl
    url_shareapp: 'https://www.cangbaopai.com/?',
    //《藏宝交易服务用户协议》
    userAgreement:'https://www.cangbaopai.com/xieyi/usera.html',
    // 藏宝隐私政策
    privacyrule:'https://www.cangbaopai.com/xieyi/rivacy.html',
    // 全球拍保证金规则
    bondrule:'https://www.cangbaopai.com/rule/rule.html',
    // 藏宝全球拍规则
    globalrule:'https://www.cangbaopai.com/xieyi/global.html',
    // 帮助中心
    helpcenter:'https://www.cangbaopai.com/help/index.html',
    // 支付限额说明
    quota:'https://www.cangbaopai.com/help/html/pay.html',
    reportlist: [{ 'id': 1, name: '营销诈骗' }, { 'id': 2, name: '人身攻击' }, { 'id': 3, name: '淫秽色情' }, { 'id': 4, name: '主题不符' }, { 'id': 5, name: '其他' }],

// 固定参数
    // 版本号
    edition:'1.2.15',
    editions: 'v1.2.15',
    // 公众号
    public:'藏宝艺术',
    // 联系电话
    phone:'400-8889215'
  },
  globalData: {
    userInfo: null,
    navHeight: 0,
    statusBarHeight:0,
    // 场景值
    scene:'0',
    shareTicket:undefined,
    isbond_img:0,
    bond_whether:0,
    socket:''
  },
  GsManager: GsManager
})