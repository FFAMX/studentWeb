$(function () {
    $("#username").attr("placeholder", "手机号/邮箱");
    $("#password").attr("placeholder", "密码");

    $(".js-network-error-trigger").on("click", function (e) {
        e.preventDefault();
        showNetworkError();
    });

    $("#network-error-mask").on("click", closeNetworkError);
    $("#network-error-dialog").on("click", function (e) {
        e.stopPropagation();
    });
    $(".network-error-btn").on("click", closeNetworkError);
});

function showNetworkError() {
    $("#network-error-mask").addClass("is-visible").attr("aria-hidden", "false");
}

function closeNetworkError() {
    $("#network-error-mask").removeClass("is-visible").attr("aria-hidden", "true");
}

function addTimestamp(url) {
    try {
        var target = new URL(url, window.location.href);
        target.searchParams.set('t', Date.now().toString());
        return target.toString();
    } catch (e) {
        return url;
    }
}

function navigate(url) {
    if (window.xuexinNavigate) {
        return window.xuexinNavigate(url);
    }
    window.location.href = addTimestamp(url);
    return true;
}

function formSubmit(evt) {
    if (evt && typeof evt.preventDefault === 'function') {
        evt.preventDefault();
    }
    var username = $.trim($('#username').val() || '');
    var password = $.trim($('#password').val() || '');
    if (username === '') { alert('用户名不能为空！'); $('#username').focus(); return false; }
    if (password === '') { alert('密码不能为空！'); $('#password').focus(); return false; }

    var old = document.getElementById('config-script');
    if (old) old.remove();
    window.XUEXIN_CONFIG = null;

    var script = document.createElement('script');
    script.id = 'config-script';
    script.src = './config.js?t=' + Date.now();
    script.onload = function() {
        var config = window.XUEXIN_CONFIG;
        if (!config) { alert('系统异常，请稍后重试'); return; }
        var account = config.accounts[username];
        if (!account || account.password !== password) {
            alert('用户名或密码错误！');
            return;
        }
        localStorage.removeItem('xuexin_token');
        localStorage.setItem('xuexin_user', JSON.stringify(account));
        localStorage.setItem('xuexin_username', username);
        navigate('./index.html');
    };
    script.onerror = function() { alert('系统异常，请稍后重试'); };
    document.head.appendChild(script);

    return false;
}

//鼠标移入显示微信登录弹框
$(".wx-login-box").mouseover(function () {
    $(".wx-tip-dialog").fadeIn();
});
$(".wx-login-box").mouseout(function () {
    $(".wx-tip-dialog").fadeOut();
});

//鼠标移入显示支付宝登录弹框
$(".zfb-login-box").mouseover(function () {
    $(".zfb-tip-dialog").fadeIn();
});
$(".zfb-login-box").mouseout(function () {
    $(".zfb-tip-dialog").fadeOut();
});