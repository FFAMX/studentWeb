var _profile = getProfile();

var mixin = {
    data: function() {
        return {
            activeBottom: 0,
            noXjUp: false, //没有学籍，展开处理办法
            noXlUp: false, //没有学历，展开处理办法
            noXwUp: false, //没有学位，展开处理办法
            greenTit: '高等教育信息',
            xj: { //学籍找找看相关数据
                flag: false,
                xh: '',
                yxmc: '',
                rxnf: '',
                cc: '',
                errorObj: {
                    flag: false,
                    errorMsg: '',
                    limitNum: 0
                }
            },
            xjBindBtnStatus: false, //学籍绑定提交按钮是否有loading效果
            xjBindBtnClick: true, //防止点击过快
            xlBindBtnStatus: false, //学历绑定提交按钮是否有loading效果
            xlBindBtnClick: true, //防止点击过快
            xl: { //学历找找看相关数据
                flag: false,
                zsbh: '',
                bynf: '',
                yxmc: '',
                errorObj: {
                    flag: false,
                    errorMsg: '',
                    limitNum: 0
                }
            },
            bindCc: {
                flag: false,
                columns: ['博士研究生', '硕士研究生', '本科', '专科', '第二学士学位']
            },
            bindBynf: {
                flag: false,
                columns: []
            },
            showZxsTipsFlag: false, //在校生弹层
            resultJson: _profile ? buildResult1(_profile) : {},
            xw: { //学位找找看相关数据
                flag: false,
                zsbh: '',
                errorObj: {
                    flag: false,
                    errorMsg: '',
                    limitNum: 0
                },
                showErrMsg: false,
                bindBtnStatus: false, //学位绑定提交按钮是否有loading效果
                bindBtnClick: true, //防止点击过快
            }
        }
    },
    created: function() {
        if (this.resultJson.status === 0) {
            if (this.resultJson.result.xj.showZxsTips) { //在校生没有学籍第一次登陆进来提示框
                this.showZxsTipsFlag = true;
            }
        }
    },
    methods: {
        findXj: function() { //学籍找找看
            this.showZxsTipsFlag = false; //可能从在校生提示进来，所以关闭那个在校生找学籍的提示层
            this.xj.flag = true;
        },
        findXl: function() { //学历找找看            
            if (this.bindBynf.columns.length == 0) { //初始化年份
                var nowYear = new Date().getFullYear();
                for (var i = 2001; i <= nowYear; i++) {
                    this.bindBynf.columns.push(i);
                }
            }
            this.xl.flag = true;
        },
        findXw: function() { //学位找找看
            this.xw.flag = true;
            this.xw.zsbh = '';
            this.xw.errorObj.flag = false;
            this.xw.showErrMsg = false;
        },
        closeBind: function(type) { //关闭绑定弹层，清除数据
            if (type == 'xj') {
                this.xj.flag = false;
                this.xj.xh = '';
                this.xj.yxmc = '';
                this.xj.rxnf = '';
                this.xj.cc = '';
                this.xl.errorObj.flag = false;
            }
            if (type == 'xl') {
                this.xl.flag = false;
                this.xl.zsbh = '';
                this.xl.bynf = '';
                this.xl.yxmc = '';
                this.xl.errorObj.flag = false;
            }
            if (type == 'xw') {
                this.xw.flag = false;
                this.xw.zsbh = '';
                this.xw.errorObj.flag = false;
                this.xw.showErrMsg = false;
            }
        },
        findXjSubmit: function() { //学籍找找看提交
            var _this = this,
                xh = this.trimSpace(this.xj.xh),
                yxmc = this.trimSpace(this.xj.yxmc),
                rxnf = this.trimSpace(this.xj.rxnf),
                cc = this.trimSpace(this.xj.cc);
            if (xh == "") {
                this.$toast('学号不能为空');
                return;
            }
            if (yxmc == "") {
                this.$toast('院校名称不能为空');
                return;
            }
            if (yxmc.length < 4) {
                this.$toast('院校名称的长度不能小于4');
                return;
            }
            if (yxmc.length > 30) {
                this.$toast('院校名称不能超过30个字符长度');
                return;
            }
            if (rxnf == "") {
                this.$toast('入学年份不能为空');
                return;
            }
            if (!(rxnf.length == 4 && /^[0-9]+$/.test(rxnf))) {
                this.$toast('请输入有效的年份信息，如：2018');
                return;
            }
            if (cc == "") {
                this.$toast('请选择层次');
                return;
            }
            var postData = {
                xh: xh, //学号
                yxmc: yxmc, //院校名称
                rxnf: rxnf, //入学年份
                cc: cc //层级
            };
            if (_this.xjBindBtnClick) {
                _this.xjBindBtnClick = false;

                setTimeout(function() {
                    _this.xjBindBtnClick = true;
                }, 5000);

                _this.xjBindBtnStatus = true; //按钮loading效果
                api.syncAjax('post', 'https://my.chsi.com.cn/archive/wap/gdjy/xj/bindxj.action', {
                    data: postData
                }).then(function(res) {
                    _this.xj.errorObj.flag = false;
                    _this.xjBindBtnStatus = false; //按钮loading效果
                    if (res.status == 0) {
                        _this.$toast('绑定成功');
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000)
                    } else {
                        if (res.result.isParamError) {
                            var msg = '';
                            if (res.result.cc && res.result.cc.length > 0) {
                                msg = res.result.cc;
                            }
                            if (res.result.rxnf && res.result.rxnf.length > 0) {
                                msg = res.result.rxnf;
                            }
                            if (res.result.yxmc && res.result.yxmc.length > 0) {
                                msg = res.result.yxmc;
                            }
                            if (res.result.xh && res.result.xh.length > 0) {
                                msg = res.result.xh;
                            }
                            _this.$toast(msg);
                        } else {
                            _this.xj.errorObj = {
                                flag: true,
                                errorMsg: res.result.errorMsg,
                                limitNum: res.result.limitNum
                            }
                        }
                    }
                });
            } else {
                this.$toast('操作过于频繁，请稍后再试');
            }
        },
        findXlSubmit: function() { //学历找找看提交
            var _this = this,
                zsbh = this.trimSpace(this.xl.zsbh),
                // bynf = this.trimSpace(this.xl.bynf),
                bynf = this.xl.bynf,
                yxmc = this.trimSpace(this.xl.yxmc);

            if (zsbh == "") {
                this.$toast('证书编号不能为空');
                return;
            }
            if (bynf == "") {
                this.$toast('毕业年份不能为空');
                return;
            }
            if (yxmc == "") {
                this.$toast('院校名称不能为空');
                return;
            }
            if (yxmc.length < 4) {
                this.$toast('院校名称的长度不能小于4');
                return;
            }
            if (yxmc.length > 30) {
                this.$toast('院校名称不能超过30个字符长度');
                return;
            }
            var postData = {
                zsbh: zsbh, //证书编号
                yxmc: yxmc, //院校名称
                bynf: bynf, //毕业年份
            };
            if (_this.xlBindBtnClick) {
                _this.xlBindBtnClick = false;

                setTimeout(function() { //防止快速多次点击
                    _this.xlBindBtnClick = true;
                }, 5000);
                _this.xlBindBtnStatus = true; //按钮loading效果
                api.syncAjax('post', 'https://my.chsi.com.cn/archive/wap/gdjy/xl/bindxl.action', {
                    data: postData
                }).then(function(res) {
                    _this.xl.errorObj.flag = false;
                    _this.xlBindBtnStatus = false; //按钮loading效果
                    if (res.status == 0) {
                        _this.$toast('绑定成功');
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000)
                    } else {
                        if (res.result.isParamError) {
                            _this.$toast('输入参数有误');
                            var msg = '';
                            if (res.result.yxmc && res.result.yxmc.length > 0) {
                                msg = res.result.yxmc;
                            }
                            if (res.result.bynf && res.result.bynf.length > 0) {
                                msg = res.result.bynf;
                            }
                            if (res.result.zsbh && res.result.zsbh.length > 0) {
                                msg = res.result.zsbh;
                            }
                            _this.$toast(msg);
                        } else {
                            _this.xl.errorObj = {
                                flag: true,
                                errorMsg: res.result.errorMsg,
                                limitNum: res.result.limitNum
                            }
                        }
                    }
                });
            } else {
                this.$toast('操作过于频繁，请稍后再试');
            }
        },
        findXwSubmit: function() { //学位找找看提交
            var _this = this,
                zsbh = this.trimSpace(this.xw.zsbh);
            _this.xw.showErrMsg = false;
            if (zsbh == "") {
                this.$toast('证书编号不能为空');
                return;
            }
            if (zsbh.length > 20) {
                this.$toast('证书编号长度不能大于20');
                return;
            }
            var postData = {
                zsbh: zsbh, //证书编号
                'cprmcsrf': "83f7f15749b26770baf61a5f90943185"
            };
            if (_this.xw.bindBtnClick) {
                _this.xw.bindBtnClick = false;

                setTimeout(function() { //防止快速多次点击
                    _this.xw.bindBtnClick = true;
                }, 5000);
                _this.xw.bindBtnStatus = true; //按钮loading效果
                api.syncAjax('post', 'https://my.chsi.com.cn/archive/gdjy/xw/bind.action', {
                    data: postData
                }).then(function(res) {
                    _this.xl.errorObj.flag = false;
                    _this.xw.bindBtnStatus = false; //按钮loading效果
                    if (res.status == 0) {
                        if (res.result.bindResult == 0 || res.result.bindResult == 2) {
                            _this.$toast('绑定成功');
                            setTimeout(function() {
                                window.location.reload();
                            }, 1000)
                        } else {
                            if (res.result.bindResult == 4) {
                                _this.xw.showErrMsg = true;
                            } else {
                                _this.$toast(res.result.message);
                            }

                        }
                    } else {
                        _this.$toast(res.message);
                    }
                });
            } else {
                this.$toast('操作过于频繁，请稍后再试');
            }
        },
        bindCcConfirm: function(picker, value, index) {
            this.xj.cc = picker;
            this.bindCc.flag = false;
        },
        bindBynfConfirm: function(picker, value, index) {
            this.xl.bynf = picker;
            this.bindBynf.flag = false;
        }
    }
}

var myVue = new Vue({
    el: '#app',
    data: function() {
        return {
            activeBottom: 0,
            topText: '学信档案' //标题文字
        }
    },
    mixins: typeof mixin != 'undefined' ? [mixin] : {},
    created: function() {},
    methods: {
        onClickLeft: function() { //左上的返回按钮
            history.back(-1);
        },
        goToIndex: function() {
            if (window.xuexinNavigate) {
                window.xuexinNavigate('https://my.chsi.com.cn/archive/wap/index.action');
            } else {
                window.location.href = 'https://my.chsi.com.cn/archive/wap/index.action';
            }
        },
        getQueryString: function(name) { //获取地址栏参数
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        VoteGoToIndex: function() { //投票完成返回首页
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
        addCookie: function(name, value) { //设置cookie
            var cookieString = name + "=" + escape(value);
            document.cookie = cookieString;
            document.cookie.setSecure = true; //只允许在https环境下使用cookie
        },
        getCookie: function(name) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                if (arr[0] == name) return arr[1];
            }
            return "";
        },
        trimSpace: function(s) { //去掉左右空格
            return s.replace(/(^\s*)|(\s*$)/g, "");
        },
        showSfhyOrder: function() {
            //展示身份核验方式的序号，动态组合显示方式一、二、三
            var nodeList = document.getElementsByClassName('verify-list')[0].getElementsByTagName("li");
            var liLen = nodeList.length;
            for (var i = 0; i < liLen; i++) {
                nodeList[i].getElementsByTagName('div')[0].innerText = '方式 ' + (i + 1);
            }
        },
        noticeFace: function(from) {
            var _this = this;
            api.syncAjax('post', 'https://my.chsi.com.cn/archive/gdjy/check/face/notice.action', {
                data: {
                    from: from
                }
            }).then(function(res) {
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
(function() {
    var isPageHide = false;
    window.addEventListener('pageshow', function() {
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
    window.addEventListener('pagehide', function() {
        isPageHide = true;
    });
})();