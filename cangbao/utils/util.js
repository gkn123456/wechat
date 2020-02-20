//Util.js

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
function checkUpdateVersion() {
  //创建 UpdateManager 实例
  const updateManager = wx.getUpdateManager();
  //检测版本更新
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
  })
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      }
    })
  })
  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
    wx.showModal({
      title: '已经有新版本咯~',
      content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开呦~',
    })
  })
}
// 生成uuid
function wxuuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("");
  return uuid
}
module.exports = {
  throttle: throttle,
  checkUpdateVersion: checkUpdateVersion,
  wxuuid: wxuuid
}

