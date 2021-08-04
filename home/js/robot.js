const robot_call = $(".robot-call");
    // robot_call.mousedown(function(e){

    // });
    // robot_call.addEventListener("touchstart",function(e){
    //     alert("aaa")
    // });
    function getServiceReq(msg) {
        $.ajax({
            type: "GET",
            url: " /python_api/libroBot?q=" + msg,
            success: function (data) {
                var service_msg = "<div class=\"service-contain\"><div class=\"message-content service-msg\">" + data + "</div></div>"
                $(".message-box").append(service_msg);
                var scrollHeight = $(".message-box").prop("scrollHeight");
                $(".message-box").scrollTop(scrollHeight);
            },
            error: function (jqXHR) {
                console.log("Error: " + jqXHR.status);
            }
        });
    }
    var drag = function (obj) {
        if (!robot_call.hasClass("chatting")) {
            obj.bind("mousedown", start);

            function start(event) {
                if (event.button == 0) {
                    /*  
                     * clientX和clientY代表鼠标当前的横纵坐标  
                     * offset()该方法返回的对象包含两个整型属性：top 和 left，以像素计。此方法只对可见元素有效。  
                     * bind()绑定事件，同样unbind解绑定，此效果的实现最后必须要解绑定，否则鼠标松开后拖拽效果依然存在  
                     * getX获取当前鼠标横坐标和对象离屏幕左侧距离之差（也就是left）值，  
                     * getY和getX同样道理，这两个差值就是鼠标相对于对象的定位，因为拖拽后鼠标和拖拽对象的相对位置是不变的  
                     */
                    clearTimeout(window.timer);
                    obj.animate({ opacity: "1" }, 200);
                    gapX = event.clientX - obj.offset().left;
                    gapY = event.clientY - obj.offset().top;
                    $(document).bind("mousemove", move);
                    $(document).bind("mouseup", stop);
                    window._x = obj.offset().left;
                    window._y = obj.offset().top;
                }
                return false;
            }
            function move(event) {
                var left = (event.clientX - gapX);
                var top = (event.clientY - gapY);
                if (left < 0) left = 0;
                if (left > $(window).width() - obj.width()) left = $(window).width() - obj.width();
                if (top < 0) top = 0;
                if (top > $(window).height() - obj.height()) top = $(window).height() - obj.height();
                obj.css({
                    "left": left + "px",
                    "top": top + "px"
                });
                return false;
            }
            function stop() {

                $(document).unbind("mousemove", move);
                $(document).unbind("mouseup", stop);

                if (window._x == obj.offset().left && window._y == obj.offset().top) {
                    obj.unbind();
                    clearTimeout(window.timer);



                    var _left = (event.clientX - gapX);
                    var _top = (event.clientY - gapY);
                    if (_left < 0) _left = 0;
                    if (_left > $(window).width() - 350) _left = $(window).width() - 350;
                    if (_top < 0) _top = 0;
                    if (_top > $(window).height() - 500) _top = $(window).height() - 500;
                    obj.animate({
                        left: _left + "px",
                        top: _top + "px"
                    }, 100);
                    obj.addClass("chatting");
                    obj.animate({
                        height: "500px",
                        width: "350px",
                        opacity: "1",
                        background: "#34495e"
                    }, 300);
                } else {
                    let middle = ($(window).width() - obj.width()) / 2;
                    let left = obj.offset().left;
                    let newLeft;
                    if (left <= middle) {
                        newLeft = 0;
                    } else {
                        newLeft = $(window).width() - 60;
                    }
                    obj.animate({ left: newLeft }, 300, function () {

                    });
                    window.timer = setTimeout(() => {
                        obj.animate({ opacity: "0.3" }, 300);
                    }, 2000);

                }

            }
        }

    }
    drag(robot_call);
    $(".robot-call .chat-box .exit-btn").click(function () {
        robot_call.removeClass("chatting");
        robot_call.animate({
            height: "60px",
            width: "60px",
            opacity: "1",
            background: "#222a37"
        }, 300);
        window.timer = setTimeout(() => {
            robot_call.animate({ opacity: "0.3" }, 300);
        }, 2000);
        let middle = ($(window).width() - robot_call.width()) / 2;
        let left = robot_call.offset().left;
        let newLeft;
        if (left <= middle) {
            newLeft = 0;
        } else {
            newLeft = $(window).width() - 60;
        }
        robot_call.animate({ left: newLeft }, 300, function () {
            drag(robot_call);
        });


    });
    window.onresize = function () {
        if (robot_call.hasClass("chatting")) {
            let middle = ($(window).width() - robot_call.width()) / 2;
            let left = robot_call.offset().left;
            let newLeft;
            if (left <= middle) {
                newLeft = 0;
            } else {
                newLeft = $(window).width() - 350;
            }
            robot_call.css("left", newLeft + "px")

        } else {
            let middle = ($(window).width() - robot_call.width()) / 2;
            let left = robot_call.offset().left;
            let newLeft;
            if (left <= middle) {
                newLeft = 0;
            } else {
                newLeft = $(window).width() - 60;
            }
            robot_call.css("left", newLeft + "px")
        }
    }

    let shiftKeyOn = false;
    $(".robot-call .input-submit textarea").keydown(function (e) {
        var e = e || window.event;
        if (e.keyCode == 16) {
            shiftKeyOn = true;
        }
        if (shiftKeyOn) {
            return true;
        } else if (e.keyCode == 13 && $(".robot-call .input-submit textarea").val().trim() == '') {
            // console.log('发送内容不能为空');
            // setTimeout(function() {
            //     fadeIn(dialogueHint);
            //     clearTimeout(timerId)
            //     timer = setTimeout(function() {
            //         fadeOut(dialogueHint)
            //     }, 2000);
            // }, 10);
            // timerId = timer;
            return false;
        } else if (e.keyCode == 13) {
            var cusotomer_msg = "<div class=\"customer-contain\"><div class=\"message-content customer-msg\">" + $(".robot-call .input-submit textarea").val() + "</div></div>"
            //sent to sevice
            $(".message-box").append(cusotomer_msg);
            getServiceReq($(".robot-call .input-submit textarea").val());
            $(".robot-call .input-submit textarea").val(null);
            var scrollHeight = $(".message-box").prop("scrollHeight");
            $(".message-box").scrollTop(scrollHeight);
            if ($(".robot-call .input-submit textarea").val().trim() != "") {
                $(".chatting .send-btn").css("background-color", "#607992")
            } else {
                $(".chatting .send-btn").css("background-color", "#bdc3c7")
            }
            return false;
        }
    });
    $(".robot-call .input-submit textarea").keyup(
        function (e) {
            var e = e || window.event;
            if (e.keyCode == 16) {
                shiftKeyOn = false;
                return true;
            }
            if (!shiftKeyOn && e.keyCode == 13) {
                $(".robot-call .input-submit textarea").value = null;
            }
        });
    $(".robot-call .input-submit textarea").bind('input propertychange', function () {
        if ($(".robot-call .input-submit textarea").val().trim() != "") {
            $(".chatting .send-btn").css("background-color", "#607992")
        } else {
            $(".chatting .send-btn").css("background-color", "#bdc3c7")
        }
        // console.log(length);
    });
    $(".robot-call .send-btn").click(function () {
        if ($(".robot-call .input-submit textarea").val().trim() != '') {
            var cusotomer_msg = "<div class=\"customer-contain\"><div class=\"message-content customer-msg\">" + $(".robot-call .input-submit textarea").val() + "</div></div>"
            //sent to sevice
            $(".message-box").append(cusotomer_msg);
            getServiceReq($(".robot-call .input-submit textarea").val());
            $(".robot-call .input-submit textarea").val(null);
            var scrollHeight = $(".message-box").prop("scrollHeight");
            $(".message-box").scrollTop(scrollHeight);
            if ($(".robot-call .input-submit textarea").val().trim() != "") {
                $(".chatting .send-btn").css("background-color", "#607992")
            } else {
                $(".chatting .send-btn").css("background-color", "#bdc3c7")
            }
        }

    });