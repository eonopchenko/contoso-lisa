$(document).ready(function() {

    var mousePosition;
    var offset = [0,0];
    var isDown = false;
    var isMoving = false;

    $('#id_chat_button').mousedown(function(e) {
        isDown = true;
        isMoving = false;

        offset = [
            document.getElementById("id_chat_button").offsetLeft - e.clientX,
            document.getElementById("id_chat_button").offsetTop - e.clientY
        ];
    });

    $(document)
    .mousemove(function(e) {
        event.preventDefault();
        if (isDown) {
            isMoving = true;
            mousePosition = {
        
                x : e.clientX,
                y : e.clientY
        
            };
            document.getElementById("id_chat_button").style.left = (mousePosition.x + offset[0]) + 'px';
            document.getElementById("id_chat_button").style.top  = (mousePosition.y + offset[1]) + 'px';
        }
    })
    .mouseup(function() {
        if(isDown && !isMoving) {
            if (document.getElementById("id_chat_frame").style.display === "block") {
                document.getElementById("id_chat_frame").style.display = "none";
                document.getElementById("id_chat_header").style.display = "none";
                $("#id_chat_button").attr('src', '../resources/img/lisa-icon.png');
            } else {
                document.getElementById("id_chat_frame").style.display = "block";
                document.getElementById("id_chat_header").style.display = "block";
                $("#id_chat_button").attr('src', '../resources/img/lisa-icon-headset.png');
            }
        }
        isDown = false;
        isMoving = false;
    });
});