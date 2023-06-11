function urlParam(name) {
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    
    if (results && results[1]) {
        return results[1];
    }
}

function redirect(url) {
    let element = document.createElement('a');
    element.setAttribute('href', url);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function doLink(doc) {
    

    let rows = doc.content[1].table.body;
    for (let row = 0; row < rows.length; row++) {

        
        rows[row][0] = { text: rows[row][0].text, link: rows[row][0].text, style: { decoration: 'underline' } };

        /*rows[row][2] = [];
        Object.keys(resources).forEach(function(res, j) {
            rows[row][2].push({ text: res, link: resources[res] });
        })*/
    }
}

$(document).ready(function() {

    let image;

    let userId = $.cookie("token");
    

    if (userId) {
        fetch('/admin/users/get/profile', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + userId
            },
            method: 'POST',
        }).then(function(response) {

            response.json().then(function(json) {
                
                image = json.data.profile.picture;
                
                $('#imgPhotoProfile').attr('src', image);
                $('#email').val(json.data.email);
                $('#username').val(json.data.username);
                $('#name').val(json.data.profile.name);
                $('#phone').val(json.data.profile.phone);
            });

        });



        $("#editForm").validate({
            rules: {

                name: {
                    required: true,
                    minlength: 4
                },
                phone: {
                    required: true
                },
            },
            submitHandler: function() {
                
                $('#saveUser').attr('disabled', '')
                $('#saveUser').append(`<span id='saveUserLoader' class="loading dots"></span>`);
                const user = {
                    photo: image,
                    name: $('#name').val(),
                    phone: $('#phone').val(),
                };


                fetch('/admin/user/edit', {
                    credentials: 'same-origin',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'bearer ' + userId
                    },
                    method: 'POST',
                    body: JSON.stringify(user)
                }).then(function(response) {

                    response.json().then(function(json) {
                        

                        if (json.error) {
                            $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                        } else {
                            $("#error").html('');
                            $('#saveUser').removeAttr('disabled')
                            $('#saveUserLoader').remove();

                            swal({
                                title: "Good job!",
                                text: "Edited",
                                type: "success"
                            }, function() {
                                location.reload();
                            });
                        }
                    });

                });


            }
        });

        $("#editPasswordForm").validate({
            rules: {

                oldPass: {
                    required: true,
                    minlength: 8
                },
                newPassword: {
                    required: true,
                    minlength: 8
                },
                newPassword_confirm: {
                    required: true,
                    minlength: 8,
                    equalTo: "#newPassword"
                }
            },
            submitHandler: function() {
                
                const user = {
                    password: $('#oldPass').val(),
                    newPassword: $('#newPassword').val()
                };


                fetch('/admin/user/password', {
                    credentials: 'same-origin',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'bearer ' + userId
                    },
                    method: 'POST',
                    body: JSON.stringify(user)
                }).then(function(response) {

                    response.json().then(function(json) {
                        

                        if (json.error) {
                            $("#error1").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                        } else {
                            $("#error1").html('');

                            swal({
                                title: "Good job!",
                                text: "Edited",
                                type: "success"
                            }, function() {
                                location.reload();
                            });
                        }
                    });

                });


            }
        });

    }


    $("#photoProfile").change(function(e) {
        e.preventDefault()
        
        
        

        const file = e.target;

        if (file.files && file.files[0]) {
            
            
            

            const reader = new FileReader();
            reader.onload = (function(e) {
                $('#imgPhotoProfile').attr('src', reader.result);
                image = reader.result;
            });
            reader.readAsDataURL(file.files[0]);

        }
    });
});