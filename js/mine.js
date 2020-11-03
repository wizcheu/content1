function OwO_show() {
    // var element = document.getElementById('OwO-container');
    if ($("#OwO-container").css("display") == 'none') {
        // document.getElementById('OwO-container').style.display = 'block';
        $("#OwO-container").slideDown();
    } else {
        // document.getElementById('OwO-container').style.display = '';
        $("#OwO-container").slideUp();
    }
}

/**
 * ajax 提交评论
 */
function ajax_comment() {
    var replyTo = '',   //回复评论时候的ID
        submitButton = $(".submit").eq(0),  //提交评论按钮
        commentForm = $("#comment-form"),   //评论表单
        newCommentId = "";   //新评论的ID
    var bindButton = function () {
        $(".comment-reply a").click(function () {
            replyTo = $(this).parent().parent().parent().attr("id");
        });
        $(".cancel-comment-reply a").click(function () { replyTo = ''; });
    };
    bindButton();

    /**
     * 发送前的处理
     */
    function beforeSendComment(commentData) {
        $("#comment-loading").fadeIn();
        $(".submit").fadeOut();
        $("#OwO-container").slideUp();
        // 处理表情
        reg = /\:\&\((.+?)\)/g;
        commentText = commentData[3].value;
        match_res = commentText.match(reg);
        match_res.forEach(element => {
            commentText = commentText.replace(element, OwO_entity[element]);
        });
        commentData[3].value = commentText;
        return commentData;
    }

    /**
     * 发送后的处理
     * @param {boolean} ok
     */
    function afterSendComment(ok) {
        if (ok) {
            $("#textarea").val('');
            replyTo = '';
        }
        bindButton();
    }
    $("#comment-form").submit(function () {
        commentData = $(this).serializeArray();
        commentData = beforeSendComment(commentData);
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: commentData,
            error: function (e) {
                console.log('Ajax Comment Error');
                window.location.reload();
            },
            success: function (data) {
                window.location.reload();
            },
            error: function () {
                $("#comment-loading").fadeOut();
                $(".submit").fadeIn();
            },
            complete: function () {
                $("#comment-loading").fadeOut();
                $(".submit").fadeIn();
            }
        });
        return false;
    });
}