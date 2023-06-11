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

        
        rows[row][0] = {
            text: rows[row][0].text,
            link: rows[row][0].text,
            style: {
                decoration: 'underline'
            }
        };

        /*rows[row][2] = [];
        Object.keys(resources).forEach(function(res, j) {
            rows[row][2].push({ text: res, link: resources[res] });
        })*/
    }
}

$(document).ready(function() {

    let image;

    let token = $.cookie("token");
    const _id = $.cookie("_id");
    

    fetch('/users/get/profile', {
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer ' + token
        },
        method: 'POST',
    }).then(function(response) {

        response.json().then(function(json) {
            
            image = json.data.profile.picture;
            


            if (json.data.role == 'company') {
                $('#age').attr('disabled', '');
                $('#about').attr('disabled', '');
                $('#gender').attr('disabled', '');
                $('#weight').attr('disabled', '');
                $('#speed').attr('disabled', '');
                $('#time').attr('disabled', '');

                $('#ageContainer').attr('hidden', '');
                $('#aboutContainer').attr('hidden', '');
                $('#genderContainer').attr('hidden', '');
                $('#weightContainer').attr('hidden', '');
                $('#levelContainer').attr('hidden', '');

                $('#address').removeAttr('disabled');
                $('#AddressContainer').removeAttr('hidden');

                $('#nbrEmp').removeAttr('disabled');
                $('#tax').removeAttr('disabled');
                $('#companyInfoContainer').removeAttr('hidden');
            } else {
                $('#age').removeAttr('disabled');
                $('#about').removeAttr('disabled');
                $('#state').removeAttr('disabled');
                $('#weight').removeAttr('disabled');
                $('#speed').removeAttr('disabled');
                $('#time').removeAttr('disabled');

                $('#ageContainer').removeAttr('hidden');
                $('#aboutContainer').removeAttr('hidden');
                $('#genderContainer').removeAttr('hidden');
                $('#weightContainer').removeAttr('hidden');
                $('#levelContainer').removeAttr('hidden');

                $('#address').attr('disabled', '');
                $('#AddressContainer').attr('hidden', '');

                $('#nbrEmp').attr('disabled', '');
                $('#tax').attr('disabled', '');
                $('#companyInfoContainer').attr('hidden', '');
            }

            $('#imgPhotoProfile').attr('src', image);
            $('#email').val(json.data.email);
            $('#username').val(json.data.username);
            $('#name').val(json.data.profile.name);
            $('#phone').val(json.data.profile.phone);
            $('#gender').val(json.data.profile.gender);
            $('#role').val(json.data.role);
            $('#age').val(json.data.profile.age);
            $('#about').val(json.data.profile.about);
            $('#country').val(json.data.profile.country);
            $('#zipcode').val(json.data.profile.zipcode);
            $('#state').val(json.data.profile.state);
            $('#city').val(json.data.profile.city);
            $('#phone').val(json.data.profile.phone);
            $('#birthday').val(json.data.profile.birthday);
            $('#weight').val(json.data.profile.weight);
            $('#speed').val(json.data.profile.speed);
            $('#time').val(json.data.profile.time);
            $('#address').val(json.data.profile.address);
            $('#nbrEmp').val(json.data.profile.nbrEmp);
            $('#tax').val(json.data.profile.tax);
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
            zipcode: {
                required: true
            },
        },
        submitHandler: function() {
            
            $('#saveUser').attr('disabled', '')
            $('#saveUser').append(`<span id='saveUserLoader' class="loading dots"></span>`);
            const user = {
                photo: image,
                gender: $('#gender').val(),
                name: $('#name').val(),
                age: $('#age').val(),
                about: $('#about').val(),
                country: $('#country').val(),
                zipcode: $('#zipcode').val(),
                state: $('#state').val(),
                city: $('#city').val(),
                phone: $('#phone').val(),
                weight: $('#weight').val(),
                speed: $('#speed').val(),
                time: $('#time').val(),
                address: $('#address').val(),
                nbrEmp: $('#nbrEmp').val(),
                tax: $('#tax').val()
            };

            if ($('#role').val() == 'company') {
                delete user.gender;
                delete user.weight;
                delete user.speed;
                delete user.time;
                delete user.about;
                delete user.age;
            } else {
                delete user.address;
                delete user.nbrEmp;
                delete user.tax;
            }

            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                address: user.zipcode
            }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        
                        
                        


                        user.location = {
                            type: "Point",
                            coordinates: [results[0].geometry.location.lat(), results[0].geometry.location.lng()]
                        };

                        fetch('/user/edit', {
                            credentials: 'same-origin',
                            headers: {
                                'content-type': 'application/json',
                                'authorization': 'bearer ' + token
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

                                    /*    fetch('/update/user/location', {
                                            credentials: 'same-origin',
                                            headers: {
                                                'content-type': 'application/json'
                                            },
                                            method: 'POST',
                                            body: JSON.stringify({
                                                userId: _id,
                                                lat: results[0].geometry.location.lat(),
                                                lng: results[0].geometry.location.lng(),
                                            })
                                        }).then(function(response) {

                                            response.json().then(function(json1) {
                                                

                                                if (json1.error) {
                                                    $("#error").html(`<div class="alert alert-danger col-sm-12">${json1.message}</div>`);
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

                                        });*/
                                }
                            });

                        });



                    } else {
                        // window.alert("No results found");
                        swal({
                            title: "Zip Code",
                            text: "No results found",
                            type: "error"
                        });

                        $('#saveUser').removeAttr('disabled')
                        $('#saveUserLoader').remove();
                        $("#error").html(`<div class="alert alert-danger col-sm-12">No results found</div>`);
                    }
                } else {
                    // window.alert("Geocoder failed due to: " + status);

                    if (status == 'ZERO_RESULTS') {
                        swal({
                            title: "Zip Code",
                            text: "Zip Code invalid",
                            type: "error"
                        });

                        $('#saveUser').removeAttr('disabled')
                        $('#saveUserLoader').remove();
                        $("#error").html(`<div class="alert alert-danger col-sm-12">Zip Code invalid</div>`);
                    } else {
                        swal({
                            title: "Zip Code",
                            text: "Geocoder failed due to: " + status,
                            type: "error"
                        });

                        $('#saveUser').removeAttr('disabled')
                        $('#saveUserLoader').remove();
                        $("#error").html(`<div class="alert alert-danger col-sm-12">Geocoder failed due to: ${status}</div>`);
                    }
                }
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


            fetch('/user/password', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
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