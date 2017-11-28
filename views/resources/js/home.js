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
                anonymous: document.getElementById('id_checkbox_anonymous').checked
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
    
    $('#id_form_anonymous :checkbox').change(function() {
        if (this.checked) {
            document.getElementById("id_input_username").readOnly = true;
            document.getElementById("id_input_password").readOnly = true;
        } else {
            document.getElementById("id_input_username").readOnly = false;
            document.getElementById("id_input_password").readOnly = false;
        }
    });
});
