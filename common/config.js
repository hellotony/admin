// weblogin config 

var en_platform_hosts = {};
if (location.host.indexOf("pre.jk.cn") != -1 || location.host.indexOf("pre.pajk-ent.com") != -1) {
    //预发环境
    en_platform_hosts = {
        "weblogin_host": "pre.pajk-ent.com",
        "member_host": "pre.pajk-ent.com"
    };
} else if (location.host.indexOf("jk.cn") != -1 || location.host.indexOf("pajk-ent.com") != -1) {
    //正式环境
    en_platform_hosts = {
        "weblogin_host": "pajk-ent.com",
        "member_host": "pajk-ent.com",
    };
} else if (location.host.indexOf("test.pajkdc.com") != -1) {
    // 测试环境
    en_platform_hosts = {
        "weblogin_host": "test.pajkdc.com",
        "member_host": "test.pajkdc.com",
    };
} else {
    //开发环境
    en_platform_hosts = {
        "weblogin_host": "dev.pajkdc.com",
        "member_host": "dev.pajkdc.com",
    };
}



var en_platform_app_id = 9002;

var en_platform_apis = null;
var en_platform_need_login_error = [-103, -205];

function en_platform_need_login(errorCode) {
    for (var i=0; i<en_platform_need_login_error.length; i++) {
        if (errorCode === en_platform_need_login_error[i]) {
            return true;
        }
    }
    return false;
}

function genPlatform_Apis() {
    en_platform_apis = {
        "staff_status_api": "http://" + en_platform_hosts.member_host + "/login/staff/status",
        "staff_info_api": "http://" + en_platform_hosts.member_host + "/login/staff/info",
        "weblogin_login": "http://" + en_platform_hosts.weblogin_host + "/login?appId=" + en_platform_app_id + "&returnUrl=",
        "weblogin_logout": "http://" + en_platform_hosts.weblogin_host + "/login/logout?appId=" + en_platform_app_id + "&returnUrl=",
        "auth_urls": "http://" + en_platform_hosts.weblogin_host + "/login/staff/authorized_urls"
    };
}
genPlatform_Apis();