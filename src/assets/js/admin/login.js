$(document).ready(function() {

    $("#loginForm").validate({
        rules: {
            username: {
                required: true,
                minlength: 6
            },
            password: {
                required: true,
                minlength: 8
            }
        },
        submitHandler: function() {
            
            const user = {
                username: $('#username').val(),
                password: $('#password').val()
            };

            fetch('/admin/login', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json; charset=utf-8'
                },
                method: 'POST',
                body: JSON.stringify(user)
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {
                        $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                    } else {
                        $("#error").html('');

                        $.cookie("token", json.token, { path: '/', expires: 90 });
                        $.cookie("_id", json._id, { path: '/', expires: 90 });
                        location.reload();
                    }



                });

            });


        }
    });

});