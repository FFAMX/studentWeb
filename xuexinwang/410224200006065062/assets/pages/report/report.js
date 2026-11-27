(function () {
  function resolveProfile() {
    try {
      if (typeof getProfile === "function") return getProfile();
    } catch (e) {}
    try {
      if (window.XUEXIN_CONFIG && XUEXIN_CONFIG.accounts) {
        var keys = Object.keys(XUEXIN_CONFIG.accounts);
        if (keys.length) return XUEXIN_CONFIG.accounts[keys[0]];
      }
    } catch (e) {}
    return null;
  }

  function setByLabel(label, value) {
    if (value === undefined || value === null) return;
    var rows = document.querySelectorAll(".rowcard .row");
    for (var i = 0; i < rows.length; i++) {
      var left = rows[i].querySelector(".col-left");
      var right = rows[i].querySelector(".col-right");
      if (!left || !right) continue;
      var key = (left.textContent || "").replace(/\s+/g, "");
      if (key === label) {
        right.textContent = String(value);
        return;
      }
    }
  }

  function isSafeAvatarSrc(src) {
    if (typeof src !== "string") return false;
    var value = src.trim();
    if (!value) return false;
    if (/^(data:image\/|https?:\/\/|blob:)/i.test(value)) return true;
    if (/(^|[\\/])src[\\/]/i.test(value)) return false;
    return /^(?:\.{1,2}\/)?[^?#]+\.(?:png|jpe?g|gif|webp|svg)$/i.test(value);
  }

  /**
   * 照片地址修正：config.js 里存的是应用内路径 /upload/bussiness/xxx.jpg。
   * 站点页（xuexinwang/{账号}/report.html）原样输出；后台预览（{ctx}/upload/student/{账号}/）
   * 下照片实际在 {ctx}/upload/…，必须补 {ctx} 前缀，否则 404 显示破图。
   */
  function assetUrl(url) {
    var u = String(url == null ? "" : url).trim();
    if (!u) return u;
    var idx = u.indexOf("/upload/");
    if (idx < 0) return u;
    var m = window.location.pathname.match(/^(.*)\/upload\/student\/[^\/]+\/[^\/]*$/);
    if (!m) return u;
    return m[1] + u.substring(idx);
  }

  function pickAvatarSrc(p) {
    var list = [p.录取照片, p.学历照片];
    for (var i = 0; i < list.length; i++) {
      if (isSafeAvatarSrc(list[i])) return list[i];
    }
    return "";
  }

  function applyProfile() {
    var p = resolveProfile();
    if (!p) return;

    setByLabel("姓名", p.姓名);
    setByLabel("性别", p.性别);
    setByLabel("出生日期", p.出生日期);
    setByLabel("民族", p.民族);
    setByLabel("学校名称", p.学校名称);
    // 「层次」展示学籍层次（在读层次，如硕士研究生）；没填则回退到「层次」
    setByLabel("层次", p.学籍层次 || p.层次);
    setByLabel("专业", p.专业);
    setByLabel("学制", p.学制);
    setByLabel("学历类别", p.学历类别);
    setByLabel("学习形式", p.学习形式);
    setByLabel("分院", p.分院);
    setByLabel("系所", p.系所);
    setByLabel("入学日期", p.入学日期);
    setByLabel("学籍状态", p.学籍状态);
    setByLabel("预计毕业日期", p.毕业日期);
    setByLabel("在线验证码", p.在线验证码);

    var avatar = pickAvatarSrc(p);
    var avatarImg = document.querySelector(".img-div img");
    if (avatarImg) {
      if (avatar) {
        avatarImg.src = assetUrl(avatar);
        avatarImg.style.display = "";
      } else {
        // 没有照片就整块隐藏，避免空 src 显示破图
        avatarImg.style.display = "none";
      }
    }

    var today = new Date();
    var y = today.getFullYear();
    var m = String(today.getMonth() + 1).padStart(2, "0");
    var d = String(today.getDate()).padStart(2, "0");
    setByLabel("更新日期", y + "年" + m + "月" + d + "日");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyProfile);
  } else {
    applyProfile();
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  // 页面内容已准备就绪
  // 调用支付宝小程序提供的通信方法，通知小程序隐藏加载中效果
  if (window.AlipayJSBridge) {
    AlipayJSBridge.call("hideLoading");
  } else {
    document.addEventListener(
      "AlipayJSBridgeReady",
      function () {
        AlipayJSBridge.call("hideLoading");
      },
      false
    );
  }
  // 学信网App
  if (window.ChesiccJsAPI) {
    ChesiccJsAPI.dismissLoadingView();
  }
});
