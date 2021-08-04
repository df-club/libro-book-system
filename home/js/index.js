$.ajax({
    type: "POST",
    url: "/api/getAuth.php",
    data: "authority",
    success: function (result) {
        if (result == "wrong") {
            window.location.href = "/";
        }
        if (result == 1) {
            $(".settings").before("<li><a href='#'><i class='bx bxs-contact'></i><span class=\"link_name\">Admin</span></a></li>");
            $(".auth").html("admin");
        }else{
            $(".auth").html("ordinary user");
        }
    },
    error: function (e) {
        console.log(e.status);
        console.log(e.responseText);
    }
});
$.ajax({
    type: "POST",
    url: "/api/getUsername.php",
    data: "username",
    success: function (result) {
        if(result == 0) window.location.href = "/";
        else{
            if(result.length > 10)result = result.substring(0,10);
            $(".profile-name").html(result);
        }
    },
    error: function (e) {
        console.log(e.status);
        console.log(e.responseText);
    }
});
$(".logout").click(function(){
    $.ajax({
    type: "POST",
    url: "/api/logout.php",
    data: "logout",
    success: function (result) {
        if (result == "success") {
            window.location.href = "/";
        }
    },
    error: function (e) {
        console.log(e.status);
        console.log(e.responseText);
    }
});
});