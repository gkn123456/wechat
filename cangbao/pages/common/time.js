const app = getApp()
var QR = require("../../utils/qrcode.js");
// 登陆状态
function logintype(){
  const token = wx.getStorageSync('token');
  const header = !token ?{
    "x-os": "wechat_mini",
    "x-app-version": app.api.edition,
    "content-type": "application/json",
    "cache-control": "private, must-revalidate",
    "uuid": wx.getStorageSync('wxuuid')
  }:{
    "Authorization": 'bearer ' + token,
    "x-os": "wechat_mini",
    "x-app-version": app.api.edition,
    "content-type": "application/json",
    "cache-control": "private, must-revalidate",
    "uuid": wx.getStorageSync('wxuuid')
  }
  return header;
}
//时间戳转 几天，月，年前
function getDatetime(dateTimeStamp) {
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    if (monthC <= 12)
      result = "" + parseInt(monthC) + "月前";
    else {
      result = "" + parseInt(monthC / 12) + "年前";
    }
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
};
//时间戳转换时间(月日--拍卖会选择时间列表)
function monthday(number) {
  const json = []
  var date = new Date(number);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  json.push({
    str2: M + '月' + D + '日',
    stamp: Y + '-' + M + '-' + D
  })
  return json;
};
// 拍卖会日历时间戳转
function timeTransformation(number){
  var json=[]
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  json.push({
    y: Y,
    m:Number(M),
    d: Number(D)
  })
  return json;
}
// 倒计时毫秒级别
function countTime(time) {
  var date = new Date();
  var now = date.getTime();
  var endDate = time;//设置截止时间
  var end = time*1000
  var leftTime = end - now; //时间差                             
  var d, h, m, s, s1,ms;
  var downtime
  if (leftTime >= 0) {
    d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
    m = Math.floor(leftTime / 1000 / 60 % 60);
    s = Math.floor(leftTime / 1000 % 60);
    s1 = Math.floor(leftTime / 1000 % 60);
    ms = String(Math.floor(leftTime % 1000)).slice(0,1);
    if (ms < 100) {
      ms = ms;
    }
    if (s < 10) {
      s = "0" +s;
      s1 = s1;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (h < 10) {
      h = "0" + h;
    }
    return  downtime={
      'h': h,
      'm': m,
      's':s, 
      's1': s1,
      'ms':ms
    }
  } else {
    return downtime = {
      'h': '00',
      'm': '00',
      's': '00',
      's1':0,
      'ms':0
    }
  }
  //递归每秒调用countTime方法，显示动态时间效果
}
//时间戳转换时间(年月日)
function toDate(number){
  var n=number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
  return (Y+M+D)
};
//时间戳转换时间(年月日时分秒)
function timestampToTime(timestamp) {
  var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours());
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
  var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
  var json={
    y:Y,
    m:M,
    d:D,
    h:h,
    m:m,
    s:s
  }
  return json;
  
};
//优惠券时间戳转换时间(年月日)
function toDates(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '.';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
};
//时间戳转换时间(年 月 日 时 分 秒)
function formatDateTime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
//时间戳转换时间(年 月 日 时 分 秒集合)
function timejson(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  var json={
    y:y,
    m:m,
    d:d,
    h:h,
    min:minute,
    s:second
  }
  return json;
};
//时间戳转换时间(月 日 时 分)
function daytime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return m + '月' + d + '日' +' '+ h + ':' + minute
};
// 倒计时
function countdown(t){
  //剩余秒数
  var leftTime = t * 1000 - new Date().getTime();
  //剩余天数
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
  //剩余小时
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);
  //剩余分钟
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
  //剩余秒数
  var seconds = parseInt(leftTime / 1000 % 60, 10);         
  let clock=''
  if (leftTime < 0) {
    clock= ''
  } else if (leftTime > 0) {
    if (days > 0) {
      clock = days + "天" + hours + "时" + minutes + "分"
    }else if (days == 0 && hours > 0) {
      clock =hours + "时" + minutes + "分" + seconds + "秒"
    } else if (hours == 0) {
      clock = minutes + "分" + seconds + "秒"
    } else if (minutes == 0) {
      clock = seconds + "秒"
    } else {}
  }
  return clock;
};
// 全球拍倒计时
function globaltimedown(t) {
  var leftTime = t * 1000 - new Date().getTime();
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
  var seconds = parseInt(leftTime / 1000 % 60, 10);
  let clock = {
    "days": 0,
    "hours": 0,
    "minutes": 0,
    "seconds": 0
  }
  if (leftTime < 0) {
    clock = {
      "days": 0,
      "hours": 0,
      "minutes": 0,
      "seconds": 0
    }
  } else if (leftTime > 0) {
    if (days > 0) {
      clock={
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
      }
    } else if (days == 0 && hours > 0) {
      clock = {
        "days": 0,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
      }
    } else if (hours == 0) {
      clock = {
        "days": 0,
        "hours":0,
        "minutes": minutes,
        "seconds": seconds
      }
    } else if (minutes == 0) {
      clock = {
        "days": 0,
        "hours": 0,
        "minutes": 0,
        "seconds": seconds
      }
    } else {
      clock = {
        "days":0,
        "hours": 0,
        "minutes": 0,
        "seconds": 0
      }
    }
  }
  return clock;
};
// 保留小数点后两位，四舍五入
function toFixed(d, n) {
  var s = n + "";
  if (!d) d = 0;
  if (s.indexOf(".") == -1) s += ".";
  s += new Array(d + 1).join("0");
  if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
    var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
    if (a == d + 2) {
      a = s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] == 10) {
            a[i] = 0;
            b = i != 1;
          } else break;
        }
      }
      s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
    }
    if (b) s = s.substr(1);
    return (pm + s).replace(/\.$/, "");
  }
  return this + "";
};
// 替换字符(清关证件显示)
function replacepos(value) {
  var len = value.length;
  var xx = value.substring(4, len - 4);
  var values = value.replace(xx, "*********");
  return values;
}
// 解析url
function GetUrlRelativePath(url){
  //将分割？后面的字符串赋给match
  var match = url.split('//')[1].split('#')[0];
  //将后面的以‘&’分割并以数组返回
  var matches = match.split('/');               
  var obj = [];
  for (var i = 0; i < matches.length; i++) {
    //将matches里面的参数再以’=‘细分，’=‘前的值为key，后面为value
    var key = matches[i].split('=')[0];         
    var value = matches[i].split('=')[1];
    obj.push(matches[i])
  }
  return obj;
}
// 转base64
function replaceSpecialChar(input) {
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  return output;
}
function getUrlParam(url) {
  var n = url.indexOf('?'), n1 = url.indexOf('='), n2 = url.indexOf('&') < 0 ? url.length : url.indexOf('&')
  console.log(url)
  var str = url, cha = '/', num = 3, nums = 4
    var x = str.indexOf(cha);
  var c = str.indexOf(cha);
    for (var i = 0; i < num; i++) {
      x = str.indexOf(cha, x + 1);
    }
  for (var i = 0; i < nums; i++) {
    c = str.indexOf(cha, c + 1);
  }
  var type = url.slice(x+1, c)
  var name = url.slice(n1 + 1, n2)
  var id = url.slice(n + 1, n1)
  var json={
    type: type,
    name :name,
    id :id
  }
 return json;
}
// urlencode编码
function code(n) {
  return encodeURIComponent(n);
}
// 保存share_id
function share(n){
  //获取到share_id 存儲
  wx.setStorage({
    key: "share_id",
    data: n
  })
}
// 查询有无user_id
function shareuserid(){
  let u = wx.getStorageSync('user_id');
  let user_id = ''
  if (!u) {
    user_id = ''
  } else {
    user_id = wx.getStorageSync('user_id')
  }
  return user_id;
}
//判断输入框是否全为回车、空格或为空
function javaTrim(str) {
  for (var i = 0; (str.charAt(i) == ' ') && i < str.length; i++);
  //whole string is space
  if (i == str.length) return '';
  var newstr = str.substr(i);
  for (var i = newstr.length - 1; newstr.charAt(i) == ' ' && i >= 0; i--);
  newstr = newstr.substr(0, i + 1);
  return newstr;
}
// 回到顶部(动画1s)
function updown(){
  wx.pageScrollTo({
    scrollTop: 0,
    duration: 1000,
  })
}
//自定义提示信息
function alert(msg){
  wx.showToast({
    title: msg,
    mask: true,
    icon: "none",
    duration:1500
  })
}
// 去掉空格字符
function delspace(n){
  return n.replace(/\s*/g, "");
}
// 复制链接
function copylink(a,url,num){
  if(num==2){
    var n = a.name + '👉 ' + url + a.id + '&share_id=' +shareuserid() + ' 👈' + a.translate_name
  } else if (num == 3) {
    var n =  '汇聚全球艺术精品👉 ' + url + 'share_id=' + shareuserid() + ' 👈⾜不出户亲临全球拍卖现场，即刻开启中⻄艺术品收藏之旅 - 藏宝'
  }else{
    var desc = ''
    if (a.desc !== null) {
      var desc = a.desc.length > 100 ? a.desc.substr(0, 100) + '...' : a.desc
    }
    var n = a.title + '👉 ' + url + a.goods_id+ '&share_id=' + shareuserid()+ ' 👈' + delspace(desc)
  }
  wx.setClipboardData({
    data: n,
    success: function (res) {
      wx.getClipboardData({
        success: function (res) {
          alert('复制成功')
        }
      })
    }
  })
}
// 举报
function report(reason_id, mix_id){
  wx.request({
    url: app.api.report,
    data: {
      type: 1,
      reason_id: reason_id,
      mix_id: mix_id
    },
    header: logintype(),
    method: 'post',
    success(res) {
      if (res.data.status_code == 401) {
        alert('身份信息过期，请重新登陆')
      } else {
        alert(res.data.message)
      }
    }
  })
}
//绘图
function drawImg(a, coversize,shareFrends, tempFilePath, path,num) {
  let ctx = shareFrends
  // 绘制底图
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 548, 886);
  if (num == 3) {
    // 绘制二维码
    ctx.drawImage(tempFilePath,0, 0, 274, 274)
    ctx.setFontSize(18)
    ctx.setFillStyle('#444444')
    ctx.fillText('扫码下载【藏宝App】', 14, 282)
    ctx.setFontSize(11)
    ctx.setFillStyle('#444444')
    ctx.fillText('大众艺术品收藏平台', 14, 383)
    ctx.setFontSize(11)
    ctx.setFillStyle('#444444')
    ctx.fillText('www.cangbaopai.com', 14, 402)
    ctx.setFontSize(11)
    ctx.setFillStyle('#444444')
    ctx.fillText('微信公众号：' + app.api.public, 14, 421)
    ctx.drawImage('../../img/logo.png', 187, 350.5,76, 76)
  }else{
    //绘制拍品图片
    var imgWidth = coversize.width
    var imgHeight = coversize.height
    let cWidth = 250
    let cHeight = 250
    let dWidth = cWidth / imgWidth
    let dHeight = cHeight / imgHeight
    if (imgWidth > cWidth && imgHeight > cHeight || imgWidth < cWidth && imgHeight < cHeight) {
      if (dWidth > dHeight) {
        ctx.drawImage(path, 0, (imgHeight - cHeight / dWidth) / 2, imgWidth, cHeight / dWidth, 12, 12, cWidth, cHeight)
      } else {
        ctx.drawImage(path, (imgWidth - cWidth / dHeight) / 2, 0, cWidth / dHeight, imgHeight, 12, 12, cWidth, cHeight)
      }
    } else {
      if (imgWidth < cWidth) {
        ctx.drawImage(path, 0, (imgHeight - cHeight / dWidth) / 2, imgWidth, cHeight / dWidth, 12, 12, cWidth, cHeight)
      } else {
        ctx.drawImage(path, (imgWidth - cWidth / dHeight) / 2, 0, cWidth / dHeight, imgHeight, 12, 12, cWidth, cHeight)
      }
    }
    if (num == 2) {
      let title = a.name;//标题
      if (title.length > 22) {
        title = title.slice(0, 22) + '...';
      }
      //绘制英文标题
      ctx.setFontSize(18)
      ctx.setFillStyle('#444444')
      ctx.fillText(title, 12, 282)
      // 中文标题
      let titles = a.translate_name;
      if (titles.length > 15) {
        titles = titles.slice(0, 15) + '...';
      }
      ctx.setFontSize(14)
      ctx.setFillStyle('#444444')
      ctx.fillText(titles, 12, 307)
      // 拍卖行名称
      var nick_name = '拍卖行: ' + a.user.nick_name
      if (a.user.nick_name.length > 22) {
        nick_name = nick_name.slice(0, 22) + '...';
      }
      ctx.setFontSize(11)
      ctx.setFillStyle('#444444')
      ctx.fillText(nick_name, 12, 363)
      // 开拍时间
      var time = '开拍时间: ' + formatDateTime(a.start_time * 1000)
      ctx.setFontSize(11)
      ctx.setFillStyle('#444444')
      ctx.fillText(time, 12, 382)
      // 竞拍地点
      var place = '竞拍地点: ' + a.address
      if (a.address.length > 20) {
        place = place.slice(0, 20) + '...';
      }
      ctx.setFontSize(11)
      ctx.setFillStyle('#444444')
      ctx.fillText(place, 12, 401)
    }
    if (num == 1) {
      let etitle = a.title;//标题
      if (a.type == 3) {
        if (etitle.length > 22) {
          etitle = etitle.slice(0, 22) + '...';
        }
      } else {
        if (etitle.length > 10) {
          etitle = etitle.slice(0, 10) + '...';
        }
      }
      //绘制英文标题
      ctx.setFontSize(18)
      ctx.setFillStyle('#444444')
      ctx.fillText(etitle, 12, 282)
      var p = ''
      if (a.type == 1) {
        var p = a.now_price > 0 ? '当前价:' + a.currency_symbol + a.now_price : '起拍价:' + a.currency_symbol + a.start_price
      }
      if (a.type == 2) {
        var p = a.shop_class == 1 ? '商品价格:￥' + a.sell_price : '议价'
      }
      if (a.type == 3) {
        var p = a.now_price > 0 ? '当前价:' + a.currency_symbol + a.now_price : '起拍价:' + a.currency_symbol + a.start_price
      }
      //绘制价格
      ctx.setFontSize(16)
      ctx.setFillStyle('#444444')
      ctx.fillText(p, 12, 401)
      //绘制中文标题
      if (a.type == 3) {
        let title = a.goods_note.title;
        if (title.length > 16) {
          title = title.slice(0, 16) + '...';
        }
        ctx.setFontSize(14)
        ctx.setFillStyle('#444444')
        ctx.fillText(title, 12, 307)
      }
    }
    // 绘制二维码
    ctx.drawImage(tempFilePath, 188, 330, 76, 76)
    // 绘制logo
    ctx.drawImage('../img/logo.png', 216.5, 360.5, 19, 19)
    //绘制扫码文字
    ctx.setFontSize(10)
    ctx.setFillStyle('#444444')
    ctx.fillText('长按扫码看详情', 189, 415)
  }
  return new Promise((resolve, reject) => {
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        fileType: 'jpg',
        quality: 1,
        width: 548 * 2,
        height: 886 * 2,
        destWidth: 548 * 2,
        destHeight: 886 * 2,
        canvasId: 'shareFrends',
        success: res => {
          resolve(res)
        },
        fail(err) {
          wx.showToast({
            title: '图片生成失败，请稍候再试！',
            icon: 'none',
            mask: true
          })
        }
      })
    })
  })
}
function saveimg(n){
  wx.saveImageToPhotosAlbum({
    filePath: n,
    success(res) {
      wx.showToast({
        title: '保存图片成功！',
      })
    },
    fail(err) {
      if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
        wx.openSetting({
          success(settingdata) {
            if (settingdata.authSetting['scope.writePhotosAlbum']) {} else {}
          }
        })
      }
    }
  })
}
// 大小写换算
function Chinese(str){
  const data = {
    '0': '日',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '日'
  };
  let strs =str.toString();
  let result = strs.split('').map(v => data[v] || v).join('');
  return result;
}
// 判断是否为今天
function isToday(str) {
  var d = new Date(str.replace(/-/g, "/"));
  var todaysDate = new Date();
  if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return true;
  } else {
    return false;
  }
}
// 判断字符类型
function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  logintype: logintype,
  getDatetime: getDatetime,
  toDate: toDate,
  toDates: toDates,
  formatDateTime: formatDateTime,
  timestampToTime:timestampToTime,
  countdown: countdown,
  countTime: countTime,
  timejson:timejson,
  daytime: daytime,
  toFixed: toFixed,
  replacepos:replacepos,
  GetUrlRelativePath: GetUrlRelativePath,
  replaceSpecialChar: replaceSpecialChar,
  getUrlParam: getUrlParam,
  code:code,
  share: share,
  shareuserid: shareuserid,
  monthday: monthday,
  javaTrim: javaTrim,
  updown: updown,
  alert: alert,
  copylink: copylink,
  delspace: delspace,
  report: report,
  drawImg: drawImg,
  saveimg: saveimg,
  Chinese: Chinese,
  isToday:isToday,
  timeTransformation: timeTransformation,
  globaltimedown: globaltimedown,
  isNumber: isNumber
}