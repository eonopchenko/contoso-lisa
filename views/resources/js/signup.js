$(document).ready(function() {
    $("#button-submit").click(function(e) {
        e.preventDefault();

        var username = $("#username-text-input").val();
        var firstname = $("#firstname-text-input").val();
        var lastname = $("#lastname-text-input").val();
        var email = $("#email-input").val();
        var tel = $("#tel-input").val();
        var password1 = $("#password1-input").val();
        var password2 = $("#password2-input").val();
        var birthdate = $("#birthdate-input").val();

        if(
            (username == "") || 
            (firstname == "") || 
            (lastname == "") || 
            (email == "") || 
            (tel == "") || 
            (password1 == "") || 
            (password2 == "") || 
            (password1 != password2)) {
            $("#submit-danger").fadeTo(2000, 500).slideUp(500, function() {
                $("#submit-danger").slideUp(500);
            });
        } else {
            $.ajax({
                url: "/submit",
                type: "GET",
                dataType: "json",
                data: {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    tel: tel,
                    password: MD5(password1),
					birthdate: birthdate
                },
                contentType: "application/json",
                cache: true,
                timeout: 5000,
                complete: function() {
                    console.log('process complete');
                },
                success: function(data) {
                    console.log('process success');
                    document.location.href="/";
                },
                error: function() {
                    console.log('process error');
                    document.getElementById("submit-danger").style.display="block";
                },
            });
        }
    });

    // $("#id_a_goback").click(function(e) {
    //     e.preventDefault();
    //     window.location.replace("/");
    // })
});
