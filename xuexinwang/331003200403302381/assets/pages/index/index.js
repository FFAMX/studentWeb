
var _profile = getProfile();

var mixin = {
                data: function () {
                    return {
                        activeBottom: 0,
                        schoolInfo: _profile ? (_profile.学校名称 + '-' + _profile.专业 + '专业') : '',
                        xzData: {},//学职数据
                        xzImg: '',//学职图片
                        xzyData: {},//新职业数据
                        mydData: {},//满意度数据
                        sqNum: 0,//待授权数量
                        zwtjTimer: null,//获取职位推荐监控变量
                }
            },
            created: function () {
                    this.init();
            },
            methods: {
                    checkAvatar: function () {},
                    init: function () {
                        this.getXzOrMyd();//获取学职或者满意度初始化数据
                        this.getXzy(null);//获取新职业初始化数据
                        this.getSqNum();//获取待授权数量
                    },
                    getXzOrMyd: function () {//学职测评返回数据
                        console.log('删除了getXzOrMyd:function()');

                    },
                    getXzy: function (taskId) {
                        console.log('删除了getXzy:function(taskId)');

                    },
                    getXzyprogress: function (taskId) {
                        var _this = this;
                        api.syncAjax('post', 'https://my.chsi.com.cn/archive/asyn/progress.do', { data: { taskId: taskId } }).then(function (res) {
                            switch (res.state) {
                                case "wait":
                                    _this.zwtjTimer = setTimeout(function () {
                                        _this.getXzyprogress(taskId);
                                    }, 3000);
                                    break;
                                case "success":
                                    _this.getXzy(taskId)
                                    _this.closedTimer();
                                    break;
                                default:
                                    _this.closedTimer();
                            }
                        }).catch(function () {
                        });
                    },
                    closedTimer: function () {
                        clearTimeout(this.zwtjTimer);
                        this.zwtjTimer = null;
                    },
                    getSqNum: function () {
                        console.log('删除了getSqNum:function()');
                    },
                    goUrl: function (url) {
                        if (window.xuexinNavigate) {
                        window.xuexinNavigate(url);
                    } else {
                        window.location.href = url;
                    }
                    }
                }
            }

var myVue = new Vue({
            el: '#app',
            data: function () {
                return {
                    activeBottom: 0,
                    topText: '学信档案' //标题文字
                }
            },
            mixins: typeof mixin != 'undefined' ? [mixin] : {},
            created: function () {
            },
            methods: {
                onClickLeft: function () { //左上的返回按钮
                    history.back(-1);
                },
                goToIndex: function () {
                    if (window.xuexinNavigate) {
                        window.xuexinNavigate('https://my.chsi.com.cn/archive/wap/index.action');
                    } else {
                        window.location.href = 'https://my.chsi.com.cn/archive/wap/index.action';
                    }
                },
                getQueryString: function (name) {//获取地址栏参数
                    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) {
                        return unescape(r[2]);
                    }
                    return null;
                },
                VoteGoToIndex: function () {//投票完成返回首页
                    var _from = this.getQueryString('from');
                    if (_from == 'archive-dctp-wap') {
                        if (window.xuexinNavigate) {
                        window.xuexinNavigate('https://my.chsi.com.cn/archive/survey/index.action');
                    } else {
                        window.location.href = 'https://my.chsi.com.cn/archive/survey/index.action';
                    }
                    } else {
                        if (window.xuexinNavigate) {
                        window.xuexinNavigate('https://my.chsi.com.cn/archive/wap/index.action');
                    } else {
                        window.location.href = 'https://my.chsi.com.cn/archive/wap/index.action';
                    }
                    }
                },
                addCookie: function (name, value) { //设置cookie
                    var cookieString = name + "=" + escape(value);
                    document.cookie = cookieString;
                    document.cookie.setSecure = true;//只允许在https环境下使用cookie
                },
                getCookie: function (name) {
                    var strCookie = document.cookie;
                    var arrCookie = strCookie.split("; ");
                    for (var i = 0; i < arrCookie.length; i++) {
                        var arr = arrCookie[i].split("=");
                        if (arr[0] == name) return arr[1];
                    }
                    return "";
                },
                trimSpace: function (s) {//去掉左右空格
                    return s.replace(/(^\s*)|(\s*$)/g, "");
                },
                showSfhyOrder: function () {
                    //展示身份核验方式的序号，动态组合显示方式一、二、三
                    var nodeList = document.getElementsByClassName('verify-list')[0].getElementsByTagName("li");
                    var liLen = nodeList.length;
                    for (var i = 0; i < liLen; i++) {
                        nodeList[i].getElementsByTagName('div')[0].innerText = '方式 ' + (i + 1);
                    }
                },
                noticeFace: function (from) {
                    var _this = this;
                    api.syncAjax('post', 'https://my.chsi.com.cn/archive/gdjy/check/face/notice.action', { data: { from: from } }).then(function (res) {
                        if (res.status == 0) {
                            if (window.xuexinNavigate) {
                        window.xuexinNavigate(res.result);
                    } else {
                        window.location.href = res.result;
                    }
                        } else {
                            _this.$toast(res.message);
                        }
                    });
                }
            }
        });

//解决手机浏览器自带返回 没刷新问题
        (function () {
            var isPageHide = false;
            window.addEventListener('pageshow', function () {
                if (isPageHide) {
                    var curUrl = window.location.href,
                        curIndex = curUrl.substring(curUrl.indexOf('wap/') + 4);
                    if (curIndex == 'my.jsp') {
                        myVue.$data.activeBottom = 4;
                    } else {
                        myVue.$data.activeBottom = 0;
                    }
                }
            });
            window.addEventListener('pagehide', function () {
                isPageHide = true;
            });
        })();
