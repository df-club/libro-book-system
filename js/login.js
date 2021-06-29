$(".loginbox input[type=\"submit\"]").click(function () {
    var usrname = $(".loginbox input[name=\"username\"]").val();
    var password = $(".loginbox input[name=\"password\"]").val();
    usrname = $.trim(usrname);

    var flag = true;
    var err_code = 0;

    var usr_len = usrname.length;
    var usr_wrong = /[`~!#$%^&*()+<>?:"{},\/;'[\]]/im;
    var err_msg = new Array("Illegal length of username.", "Illegal characters in username.", "Illegal password length.", "Empty password.", "Empty username.");

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

    password = $.md5(password);

    if (flag) {

        $(function () {

            $.ajax({
                type: "POST",
                url: "/api/login_request.php",
                data: "username=" + usrname + "&password=" + password,
                success: function (result) {
                    if (result == 0) {
                        $(".loginbox .libro-logo").fadeOut();
                        $(".loginSuccess").addClass("logged");
                        setTimeout(() => {
                            window.location.href="/home";
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
                                window.location.href="/home";
                            }, 10);
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