var nc_flag = false;
var ajax_token;
var ajax_csessionid;
var ajax_sig;
var ajax_scene = "nc_register";
var nc_token = ["FFFF0N0000000000A0D6", (new Date()).getTime(), Math.random()].join(':');
var NC_Opt =
{
    renderTo: "#libro_nc_id",
    appkey: "FFFF0N0000000000A0D6",
    scene: "nc_register",
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
$(".signupBox input[type=\"submit\"]").click(function () {
    var username = $(".signupBox input[name='username']").val();
    var password = $(".signupBox input[name='password']").val();
    var confirm = $(".signupBox input[name='confirm']").val();
    var email = $(".signupBox input[name='email']").val();
    username = $.trim(username);
    email = $.trim(email);
    var usr_len = username.length;
    var usr_wrong = /[`~!#$%^&*()+<>?:"{},\/;'[\]]/im;
    var err_code = 0;
    var err_msg = new Array("Illegal length of username.", "Illegal characters in username.", "Illegal length of password.", "Empty password.", "Empty username.", "Empty confirm password.", "Empty e-mail.", "Illegal length of confirm password.", "Unequal password and confirmation password.", "Illegal e-mail.","Please perform slide verification.");
    if (usr_len < 4 || usr_len > 20) {
        err_code = 1;
    }
    if (usr_wrong.test(username)) {
        err_code = 2;
    }
    var pwd_len = password.length;
    if (pwd_len < 6 || pwd_len > 30) {
        err_code = 3;
    }
    if (pwd_len == 0) err_code = 4;
    if (usr_len == 0) err_code = 5;
    var confirm_len = confirm.length;
    var email_len = email.length;
    if (confirm_len == 0) err_code = 6;
    if (email_len == 0) err_code = 7;
    if (confirm_len < 6 || confirm_len > 30) {
        err_code = 8;
    }
    if (confirm != password) err_code = 9;
    var email_reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (!email_reg.test(email)) {
        err_code = 10;
    }
    if(!nc_flag){
        err_code = 11;
    }
    password = $.md5(password);
    if (err_code == 0) {
        $(function () {

            $.ajax({
                type: "POST",
                url: "/api/signup_request.php",
                data: "username=" + username + "&password=" + password + "&email=" + email +"&session_id=" + ajax_csessionid+ "&token=" + ajax_token + "&sig=" + ajax_sig + "&scene=" + ajax_scene,
                success: function (result) {
                    if (result == 0) {
                        $(".signupBox .libro-logo").fadeOut();
                        $(".signupSuccess").addClass("logged");
                        setTimeout(() => {
                            window.location.href = "/home";
                        }, 1100);
                    } else {
                        $(".err_msg").text(result);
                        $(".signupBox input[type=\"submit\"]").css("margin-top", "5px");
                        if(result == "Have logged in."){
                            setTimeout(() => {
                                window.location.href = "/home";
                            }, 50);
                        }
                        if(result == "Please perform slide verification."){
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
        $(".signupBox input[type=\"submit\"]").css("margin-top", "5px");
    }

    return false;
});