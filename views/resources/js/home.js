$(document).ready(function() {
    $("#id_button_index_signin").click(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/login",
            type: "GET",
            dataType: "json",
            data: {
                username: $("#id_input_username").val(),
                password: MD5($("#id_input_password").val()),
            },
            contentType: "application/json",
            cache: true,
            timeout: 5000,
            complete: function() {
                console.log('process complete');
            },
            success: function(data) {
                console.log('process success');
                if(data.login == "success") {
                    window.location.href = "/botchat";
                } else {
                    $("#id_div_login_danger").fadeTo(2000, 500).slideUp(500, function(){
                        $("#id_div_login_danger").slideUp(500);
                    });
                }
            },
            error: function() {
                console.log('process error');
            },
        });
    });
});
