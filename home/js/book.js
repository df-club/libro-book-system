var navAnimation = $(".content nav a");
var choice = "title";
if (choice == "title") {
    $(".search-txt").attr("placeholder", "Search a book by Title...");
}
navAnimation.click(function () {
    var tab = $(this).html();
    choice = tab;
    tab = "start-" + tab;
    $(".animation").removeClass().addClass("animation").addClass(tab);
    if (choice == "title") {
        $(".search-txt").attr("placeholder", "Search a book by Title...");
    }
    if (choice == "author") {
        $(".search-txt").attr("placeholder", "Search a book by Author...");
    }
    if (choice == "isbn") {
        $(".search-txt").attr("placeholder", "Search a book by ISBN \(without Hyphen\)...");
    }
    if (choice == "publisher") {
        $(".search-txt").attr("placeholder", "Search a book by Publisher...");
    }
});
$(".search-btn").click(function () {
    if ($(".search-txt").val().trim() != "") {
        $(function () {
            $.ajax({
                type: "post",
                url: "/api/searchBook.php",
                data: { index: choice, q: $(".search-txt").val().trim() },
                dataType: "json",
                success: function (msg) {
                    $(".bookTable").remove();
                    var bookTable = "<table class = 'bookTable'><tr><th>TITLE</th><th>AUTHOR</th><th>ISBN</th><th>PUBLISHER</th><th>STATUS</th></tr>";
                    if (msg != "") {
                        for (var i = 0; i < msg.length; i++) {
                            var rest = msg[i]['total'] - msg[i]["current"];
                            if(rest > 0){
                                bookTable += "<tr class = 'available'><td>" + msg[i]["title"] + "</td><td>" + msg[i]["author"] + "</td><td>" + msg[i]["isbn"] + "</td><td>" + msg[i]["publisher"] + "</td><td class= 'status' bookId = '"+msg[i]["id"]+"'>Available</td></tr>";
                            }else{
                                bookTable += "<tr class = 'unavailable'><td>" + msg[i]["title"] + "</td><td>" + msg[i]["author"] + "</td><td>" + msg[i]["isbn"] + "</td><td>" + msg[i]["publisher"] + "</td><td class= 'status' bookId = '"+msg[i]["id"]+"'>NO SURPLUS</td></tr>";
                            }
                        }
                    }else{
                        bookTable += "<tr class = \"tbNoData\"><td colspan='4'>NO DATA</td></tr>";
                    }

                    bookTable += "</table>";
                    $(".content").append(bookTable);
                },
                error: function () {
                    console.log("AJAX ERROR!")
                }
            });
        });
        $(".content").addClass("with-result");
    }


});