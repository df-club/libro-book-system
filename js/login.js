var nc_flag = false;
var ajax_token;
var ajax_csessionid;
var ajax_sig;
var ajax_scene = "nc_login";
var nc_token = ["FFFF0N0000000000A0D6", (new Date()).getTime(), Math.random()].join(':');
var NC_Opt =
{
    renderTo: "#libro_nc_id",
    appkey: "FFFF0N0000000000A0D6",
    scene: "nc_login",
    token: nc_token,
    customWidth: 260,
    trans: { "key1": "code0" },
    elementID: ["usernameID"],
    is_Opt: 0,
    language: "cn",
    isEnabled: true,
    timeout: 3000,
    times: 5,
    apimap: {
        // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
        // 'get_captcha': '//b.com/get_captcha/ver3',
        // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3'
        // 'get_img': '//c.com/get_img',
        // 'checkcode': '//d.com/captcha/checkcode.jsonp',
        // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
        // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
        // 'umid_serUrl': 'https://g.com/service/um.json'
    },
    callback: function (data) {
        nc_flag = true;
        ajax_token = nc_token;
        ajax_csessionid = data.csessionid;
        ajax_sig = data.sig;
    }
}
var nc = new noCaptcha(NC_Opt)
nc.upLang('cn', {
    _startTEXT: "Drag the slider to the far right.",
    _yesTEXT: "Verification Passed",
    _error300: "Error,click<a href=\"javascript:__nc.reset()\">refresh</a>",
    _errorNetwork: "The network suck up,click<a href=\"javascript:__nc.reset()\">refresh</a>",
})
$(".loginbox input[type=\"submit\"]").click(function () {

    var usrname = $(".loginbox input[name=\"username\"]").val();
    var password = $(".loginbox input[name=\"password\"]").val();
    usrname = $.trim(usrname);

    var flag = true;
    var err_code = 0;

    var usr_len = usrname.length;
    var usr_wrong = /[`~!#$%^&*()+<>?:"{},\/;'[\]]/im;
    var err_msg = new Array("Illegal length of username.", "Illegal characters in username.", "Illegal password length.", "Empty password.", "Empty username.", "Please perform slide verification.");

    if (usr_len < 4 || usr_len > 20) {
        flag = false;
        err_code = 1;
    }
    if (usr_wrong.test(usrname)) {
        flag = false;
        err_code = 2;
    }
    var pwd_len = password.length;
    if (pwd_len < 6 || pwd_len > 30) {
        flag = false;
        err_code = 3;
    }

    if (pwd_len == 0) err_code = 4;
    if (usr_len == 0) err_code = 5;
    if (!nc_flag){
        flag = false;
        err_code = 6;
    }

    password = $.md5(password);

    if (flag) {

        $(function () {

            $.ajax({
                type: "POST",
                url: "/api/login_request.php",
                data: "username=" + usrname + "&password=" + password+ "&session_id=" + ajax_csessionid+ "&token=" + ajax_token + "&sig=" + ajax_sig + "&scene=" + ajax_scene,
                success: function (result) {
                    if (result == 0) {
                        $(".loginbox .libro-logo").fadeOut();
                        $(".loginSuccess").addClass("logged");
                        setTimeout(() => {
                            window.location.href = "/home";
                        }, 1100);
                    } else {
                        var ajax_err_code = result;
                        if (ajax_err_code == 1) {
                            $(".err_msg").text("Wrong username or password.");
                            $(".loginbox input[type=\"submit\"]").css("margin-top", "5px");
                        }
                        if (ajax_err_code == 2) {
                            $(".err_msg").text("Illegal length of username or password.");
                            $(".loginbox input[type=\"submit\"]").css("margin-top", "5px");
                        }
                        if (ajax_err_code == 3) {
                            $(".err_msg").text("Have already logged in.");
                            $(".loginbox input[type=\"submit\"]").css("margin-top", "5px");
                            setTimeout(() => {
                                window.location.href = "/home";
                            }, 10);
                        }
                        if (ajax_err_code == 4) {
                            $(".err_msg").text("Please perform slide verification.");
                            $(".loginbox input[type=\"submit\"]").css("margin-top", "5px");
                            __nc.reset();
                        }
                    }
                },
                error: function (e) {
                    console.log(e.status);
                    console.log(e.responseText);
                }
            });
        });
    } else {
        $(".err_msg").text(err_msg[err_code - 1]);
        $(".loginbox input[type=\"submit\"]").css("margin-top", "5px");
    }
    return false;
});