(function() {
    var USER_KEY = "xuexin_user";
    var USERNAME_KEY = "xuexin_username";

    function safeParse(raw) {
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function getStoredUser() {
        return safeParse(localStorage.getItem(USER_KEY));
    }

    function getConfigUser() {
        if (!window.XUEXIN_CONFIG || !XUEXIN_CONFIG.accounts) return null;
        var username = localStorage.getItem(USERNAME_KEY) || "";
        if (username && XUEXIN_CONFIG.accounts[username]) {
            return XUEXIN_CONFIG.accounts[username];
        }
        var keys = Object.keys(XUEXIN_CONFIG.accounts);
        if (keys.length) return XUEXIN_CONFIG.accounts[keys[0]];
        return null;
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

    function toLogin() {
        if (window.location.pathname !== "/login.html" && window.location.pathname !== "/login") {
            navigate("./login.html");
        }
    }

    function resolveAuthProfile() {
        var configUser = getConfigUser();
        if (configUser) {
            localStorage.setItem(USER_KEY, JSON.stringify(configUser));
            localStorage.setItem(USERNAME_KEY, configUser.username || "");
            return configUser;
        }

        var stored = getStoredUser();
        if (stored && typeof stored === "object") {
            if (stored.username) {
                localStorage.setItem(USERNAME_KEY, stored.username);
            }
            return stored;
        }

        toLogin();
        return null;
    }

    window.__xuexinResolveProfile = resolveAuthProfile;
    window.api = window.api || {
        syncAjax: function() {
            return Promise.resolve({
                status: 0,
                message: "",
                result: {}
            });
        }
    };
})();

function pickValue(p, keys) {
    for (var i = 0; i < keys.length; i++) {
        var v = p[keys[i]];
        if (v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
    return "";
}

function buildResult1(p) {
    var item = {
        cc: pickValue(p, ["层次", "灞傛"]),
        xxxs: pickValue(p, ["学习形式", "瀛︿範褰㈠紡"]),
        zymc: pickValue(p, ["专业", "涓撲笟"]),
        yxmc: pickValue(p, ["学校名称", "瀛︽牎鍚嶇О"]),
    };
    return {
        result: {
            xj: {
                exist: true,
                amount: 1,
                xm: "",
                showZxsTips: false,
                zjhm: "",
                dataList: [Object.assign({
                    id: "kupksh8z5z90n98f"
                }, item)]
            },
            xl: {
                exist: true,
                amount: 1,
                xm: "",
                zjhm: "",
                dataList: [Object.assign({
                    id: "tt3wd2peoxft4pl8",
                    xlzms: false
                }, item)]
            },
            ky: {
                exist: false,
                amount: 0,
                dataList: []
            },
            xw: {
                exist: false,
                amount: 0,
                xm: pickValue(p, ["姓名", "濮撳悕"]),
                dataList: [],
                zjhm: pickValue(p, ["证件号码", "璇佷欢鍙风爜"])
            }
        },
        message: "",
        status: 0
    };
}

function buildResult2(p) {
    return {
        result: {
            xm: pickValue(p, ["姓名", "濮撳悕"]),
            xb: pickValue(p, ["性别", "鎬у埆"]),
            csrq: pickValue(p, ["出生日期", "鍑虹敓鏃ユ湡"]),
            mz: pickValue(p, ["民族", "姘戞棌"]),
            sfzh: pickValue(p, ["证件号码", "璇佷欢鍙风爜"]),
            yxmc: pickValue(p, ["学校名称", "瀛︽牎鍚嶇О"]),
            zymc: pickValue(p, ["专业", "涓撲笟"]),
            cc: pickValue(p, ["层次", "灞傛"]),
            xxxs: pickValue(p, ["学习形式", "瀛︿範褰㈠紡"]),
            xz: pickValue(p, ["学制", "瀛﹀埗"]),
            xllb: pickValue(p, ["学历类别", "瀛﹀巻绫诲埆"]),
            fy: pickValue(p, ["分院", "鍒嗛櫌"]),
            xsh: pickValue(p, ["系所", "绯绘墍"]),
            bh: pickValue(p, ["班级", "鐝骇"]),
            xh: pickValue(p, ["学号", "瀛﹀彿"]),
            rxrq: pickValue(p, ["入学日期", "鍏ュ鏃ユ湡"]),
            byrq: pickValue(p, ["毕业日期", "姣曚笟鏃ユ湡"]),
            xjzt: pickValue(p, ["学籍状态", "瀛︾睄鐘舵€?"]),
            mzItemName: "民族",
            byrqItemName: "预计毕业日期",
            id: "kupksh8z5z90n98f",
            xlzms: false,
            hasLqPic: !!pickValue(p, ["录取照片", "褰曞彇鐓х墖"]),
            hasXlPic: !!pickValue(p, ["学历照片", "瀛﹀巻鐓х墖"]),
            zpCollateVo: null,
            showZpCollated: false,
            showTxcjm: false,
            showZppj: false
        },
        message: "",
        status: 0
    };
}

function buildXueliResult(p) {
    return {
        result: {
            xl: {
                xm: pickValue(p, ["姓名", "濮撳悕"]),
                xb: pickValue(p, ["性别", "鎬у埆"]),
                csrq: pickValue(p, ["出生日期", "鍑虹敓鏃ユ湡"]),
                cc: pickValue(p, ["层次", "灞傛"]),
                yxmc: pickValue(p, ["学校名称", "瀛︽牎鍚嶇О"]),
                zymc: pickValue(p, ["专业", "涓撲笟"]),
                xxxs: pickValue(p, ["学习形式", "瀛︿範褰㈠紡"]),
                xz: pickValue(p, ["学制", "瀛﹀埗"]),
                xllb: pickValue(p, ["学历类别", "瀛﹀巻绫诲埆"]),
                rxrq: pickValue(p, ["入学日期", "鍏ュ鏃ユ湡"]),
                byrq: pickValue(p, ["毕业日期", "姣曚笟鏃ユ湡"]),
                bjyjl: pickValue(p, ["毕结业", "姣曠粨涓?", "毕业去向"]),
                zsbh: pickValue(p, ["证书编号", "璇佷功缂栧彿"]),
                xzm: pickValue(p, ["校（院）长姓名", "鏍￠暱濮撳悕"]),
                hasXlPic: !!pickValue(p, ["学历照片", "瀛﹀巻鐓х墖"]),
                xlzms: false,
                fzrq: "",
                fzzsbh: "",
                fzyxmc: "",
                id: "tt3wd2peoxft4pl8"
            },
            xlfyzyList: [],
            hasXlfzzy: false,
            type: "ypcwk"
        },
        message: "",
        status: 0
    };
}

function getProfile() {
    if (window.__xuexinProfileCache) {
        return window.__xuexinProfileCache;
    }
    if (typeof window.__xuexinResolveProfile === "function") {
        window.__xuexinProfileCache = window.__xuexinResolveProfile() || {};
        return window.__xuexinProfileCache;
    }
    return {};
}