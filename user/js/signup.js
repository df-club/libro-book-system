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
    var err_msg = new Array("Illegal length of username.", "Illegal characters in username.", "Illegal length of password.", "Empty password.", "Empty username.", "Empty confirm password.", "Empty e-mail.", "Illegal length of confirm password.", "Unequal password and confirmation password.", "Illegal e-mail.");
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
    password = $.md5(password);
    if (err_code == 0) {
        $(function () {

            $.ajax({
                type: "POST",
                url: "/api/signup_request.php",
                data: "username=" + username + "&password=" + password + "&email=" + email,
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