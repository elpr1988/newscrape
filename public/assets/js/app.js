$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        window.location = "/saved"
    })
});

$("#addBtn").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .done(function(data) {
        console.log("Data: ", data);
        $("#comments").append(
            "<div class='col s6 right-align'>" +
            "<div class='card-panel'>" +
            "<h4>" + data.title + "</h4>" +
            "<input id='titleinput' name='title' >" +
            "<textarea id='bodyinput' name='body'></textarea>" +
            "<button type='button' class='addComment waves-effect waves-light btn blue lighten-1' id='addComment' data-id='" + data._id + "'>Save Comment</button>" +
            "<button type='button' class='deleteComment waves-effect waves-light btn blue lighten-1' id='addComment' data-id='" + data._id + "'>Delete Comment</button>");

        if (data.comments) {
            $("#titleinput").val(data.comments.title);
            $("#bodyinput").val(data.comments.body);
        }
    });
});

// $(".saveComment").on("click", function() {
//     var thisId = $(this).attr("data-id");
//     $.ajax({
//         method: "POST",
//         url: "/articles/" + thisId,
//         data: {
//             title: $("#titleinput").val(),
//             body: $("#bodyinput").val()
//         }
//     })
//     .done(function(data) {
//         $("comments").empty();
//     });
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
// });


// $(".deleteComment").on("click", function() {
//     var commentId = $(this).attr("data-comment-id");
//     var articleId = $(this).attr("data-article-id");
//     $.ajax({
//         method: "DELETE",
//         url: "/comments/delete/" + commentId + "/" + articleId
//     }).done(function(data) {
//         console.log(data)
//         $(".modal").modal("hide");
//         window.location = "/saved"
//     })
// });