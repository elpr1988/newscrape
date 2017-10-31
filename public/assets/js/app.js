$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
    console.log(this)
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

$(".saveComment").on("click", function() {
    var thisId = $(this).attr("data-id");
    if (!$("#commentText" + thisId).val()) {
        alert("please enter a comment to save");
    }else {
      $.ajax({
            method: "POST",
            url: "/comments/save/" + thisId,
            data: {
              text: $("#commentText" + thisId).val()
            }
          }).done(function(data) {
             
              console.log(data);
       
              $("#commentText" + thisId).val("");
              $(".modal").modal("hide");
              window.location = "/saved"
          });
        }
    });

$(".deleteComment").on("click", function() {
    var commentId = $(this).attr("data-comment-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/comments/delete/" + commentId + "/" + articleId
    }).done(function(data) {
        console.log(data)
        $(".modal").modal("hide");
        window.location = "/saved"
    })
});