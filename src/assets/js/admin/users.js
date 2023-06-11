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
            text: '',
            link: '',
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
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );

    let token = $.cookie("token");

    let image = ''

    let role = urlParam('role');
    
    if (!role) {
        role = 'all'
    }


    let action = urlParam('action');
    let userId = urlParam('userId');
    
    if (action == 'editUser') {
        if (userId) {
            fetch('/admin/users/get', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify({
                    userId: userId
                })
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {} else {

                        if (json.data.role == 'admin' || json.data.role == 'superadmin') {
                            $('#age').attr('disabled', '');
                            $('#about').attr('disabled', '');
                            $('#country').attr('disabled', '');
                            $('#zipcode').attr('disabled', '');
                            $('#state').attr('disabled', '');
                            $('#city').attr('disabled', '');
                            $('#weight').attr('disabled', '');
                            $('#speed').attr('disabled', '');
                            $('#time').attr('disabled', '');

                            $('#ageContainer').attr('hidden', '');
                            $('#aboutContainer').attr('hidden', '');
                            $('#countryContainer').attr('hidden', '');
                            $('#zipcodeContainer').attr('hidden', '');
                            $('#stateContainer').attr('hidden', '');
                            $('#weightContainer').attr('hidden', '');
                            $('#levelContainer').attr('hidden', '');
                        } else {
                            $('#age').removeAttr('disabled');
                            $('#about').removeAttr('disabled');
                            $('#country').removeAttr('disabled');
                            $('#zipcode').removeAttr('disabled');
                            $('#state').removeAttr('disabled');
                            $('#city').removeAttr('disabled');
                            $('#weight').removeAttr('disabled');
                            $('#speed').removeAttr('disabled');
                            $('#time').removeAttr('disabled');

                            $('#ageContainer').removeAttr('hidden');
                            $('#aboutContainer').removeAttr('hidden');
                            $('#countryContainer').removeAttr('hidden');
                            $('#zipcodeContainer').removeAttr('hidden');
                            $('#stateContainer').removeAttr('hidden');
                            $('#weightContainer').removeAttr('hidden');
                            $('#levelContainer').removeAttr('hidden');
                        }


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

                        image = json.data.profile.picture;
                        $('#imgPhotoProfile').attr('src', image);
                        $('#email').val(json.data.email);
                        $('#username').val(json.data.username);
                        $('#role').val(json.data.role);
                        $('#gender').val(json.data.profile.gender);
                        $('#name').val(json.data.profile.name);
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



                    }
                });

            });



            $("#editForm").validate({
                rules: {
                    username: {
                        required: true,
                        minlength: 6,
                        maxlength: 16
                    },
                    role: {
                        required: true
                    },
                    gender: {
                        required: true
                    },
                    zipcode: {
                        required: true
                    },
                    name: {
                        required: true,
                        minlength: 4
                    },
                    password: {
                        required: false,
                        minlength: 8,
                        regex: /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!"/$%?&*()]).*$/
                    }
                },

                messages: {

                    password: {
                        required: "Required input",
                        regex: jQuery.validator.format("Password must be at least 8 characters At least 1 number, 1 lowercase, 1 uppercase letter At least 1 special character from @#$%&!\"/$%?&*()")
                    }

                },
                submitHandler: function() {
                    


                    $('#saveUser').attr('disabled', '')
                    $('#saveUser').append(`<span id='saveUserLoader' class="loading dots"></span>`);
                    const user = {
                        userId: userId,
                        photo: image,
                        email: $('#email').val(),
                        username: $('#username').val(),
                        password: $('#password').val(),
                        role: $('#role').val(),
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
                    /*    if (user.password) {
                        var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;

                        if (pattern.test(user.password)) {} else {
                            $("#error").html(`<div class="alert alert-danger col-sm-12">
                            Password must be at least 8 characters
        At least 1 number, 1 lowercase, 1 uppercase letter
        At least 1 special character from @#$%&
                            
                            </div>`);
                            return;
                        }
                    }*/

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



                                
                                fetch('/admin/users/edit', {
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
                                                text: "User edited",
                                                type: "success"
                                            }, function() {
                                                redirect(window.location.origin + window.location.pathname + '?action=showUser&userId=' + json.data);
                                            });

                                            /* const geocoder = new google.maps.Geocoder();

                                             geocoder.geocode({
                                                 address: user.zipcode
                                             }, (results, status) => {
                                                 if (status === "OK") {
                                                     if (results[0]) {
                                                         
                                                         
                                                         

                                                         fetch('/admin/update/location', {
                                                             credentials: 'same-origin',
                                                             headers: {
                                                                 'content-type': 'application/json',
                                                                 'authorization': 'bearer ' + token
                                                             },
                                                             method: 'POST',
                                                             body: JSON.stringify({
                                                                 userId: json.data,
                                                                 lat: results[0].geometry.location.lat(),
                                                                 lng: results[0].geometry.location.lng(),
                                                             })
                                                         }).then(function (response) {

                                                             response.json().then(function (json1) {
                                                                 

                                                                 if (json1.error) {
                                                                     $("#error").html(`<div class="alert alert-danger col-sm-12">${json1.message}</div>`);
                                                                 } else {
                                                                     $("#error").html('');

                                                                     swal({
                                                                         title: "Good job!",
                                                                         text: "User edited",
                                                                         type: "success"
                                                                     }, function () {
                                                                         redirect(window.location.origin + window.location.pathname + '?action=showUser&userId=' + json.data);
                                                                     });
                                                                 }
                                                             });

                                                         });

                                                     } else {
                                                         window.alert("No results found");
                                                     }
                                                 } else {
                                                     window.alert("Geocoder failed due to: " + status);
                                                 }
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

        }

    }



    $('#' + role).attr('checked', '');
    $('#address').attr('disabled', '');
    $('#nbrEmp').attr('disabled', '');
    $('#tax').attr('disabled', '');
    $('#AddressContainer').attr('hidden', '');
    $('#companyInfoContainer').attr('hidden', '');


    /*   $(document).on("click", ".client-link", function(e) {
        e.preventDefault()
        $(".selected .tab-pane").removeClass('active');
        $($(this).attr('href')).addClass("active");
    });*/



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

    $(document).on("ifChanged", ".btn-role", function(e) {
        e.preventDefault();
        role = $(this).attr('data-role');
        
        redirect(window.location.origin + window.location.pathname + '?role=' + role);
    });

    $(document).on("click", "#deleteUser", function(e) {
        e.preventDefault();
        const id = $(this).attr('data-id');
        
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this user!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function() {

            fetch('/admin/users/delete', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify({
                    userId: id
                })
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {
                        $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                    } else {

                        swal({
                            title: "Deleted!",
                            text: "User Deleted",
                            type: "success"
                        }, function() {
                            redirect(window.location.origin + window.location.pathname);
                        });
                    }
                });

            });

        });


    });


    $("#role").change(function(e) {
        e.preventDefault();
        const theRole = $('#role').val();
        

        if (theRole == 'admin' || theRole == 'superadmin') {
            $('#age').attr('disabled', '');
            $('#about').attr('disabled', '');
            $('#country').attr('disabled', '');
            $('#zipcode').attr('disabled', '');
            $('#state').attr('disabled', '');
            $('#city').attr('disabled', '');
            $('#weight').attr('disabled', '');
            $('#speed').attr('disabled', '');
            $('#time').attr('disabled', '');

            $('#ageContainer').attr('hidden', '');
            $('#aboutContainer').attr('hidden', '');
            $('#countryContainer').attr('hidden', '');
            $('#zipcodeContainer').attr('hidden', '');
            $('#stateContainer').attr('hidden', '');
            $('#weightContainer').attr('hidden', '');
            $('#levelContainer').attr('hidden', '');
        } else {
            $('#age').removeAttr('disabled');
            $('#about').removeAttr('disabled');
            $('#country').removeAttr('disabled');
            $('#zipcode').removeAttr('disabled');
            $('#state').removeAttr('disabled');
            $('#city').removeAttr('disabled');
            $('#weight').removeAttr('disabled');
            $('#speed').removeAttr('disabled');
            $('#time').removeAttr('disabled');

            $('#ageContainer').removeAttr('hidden');
            $('#aboutContainer').removeAttr('hidden');
            $('#countryContainer').removeAttr('hidden');
            $('#zipcodeContainer').removeAttr('hidden');
            $('#stateContainer').removeAttr('hidden');
            $('#weightContainer').removeAttr('hidden');
            $('#levelContainer').removeAttr('hidden');
        }


        if (theRole == 'company') {
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
    });

    $("#form").validate({
        rules: {
            username: {
                required: true,
                minlength: 6,
                maxlength: 16
            },
            password: {
                required: true,
                minlength: 8,
                regex: /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!"/$%?&*()]).*$/
            },
            role: {
                required: true
            },

            zipcode: {
                required: true
            },
            gender: {
                required: true
            },
            name: {
                required: true,
                minlength: 4
            },
        },

        messages: {

            password: {
                required: "Required input",
                regex: jQuery.validator.format("Password must be at least 8 characters At least 1 number, 1 lowercase, 1 uppercase letter At least 1 special character from @#$%&!\"/$%?&*()")
            }

        },
        submitHandler: function() {
            
            $('#saveUser').attr('disabled', '')
            $('#sharePost').append(`<span id='saveUserLoader' class="loading dots"></span>`);
            const user = {
                photo: image,
                email: $('#email').val(),
                username: $('#username').val(),
                password: $('#password').val(),
                role: $('#role').val(),
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
            /*   if (user.password) {
                var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
                if (pattern.test(user.password)) {} else {
                    $("#error").html(`<div class="alert alert-danger col-sm-12">
                    Password must be at least 8 characters
At least 1 number, 1 lowercase, 1 uppercase letter
At least 1 special character from @#$%&
                    
                    </div>`);
                    return;
                }
            }*/

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


                        fetch('/admin/users/add', {
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
                                        text: "User added",
                                        type: "success"
                                    }, function() {
                                        redirect(window.location.origin + window.location.pathname + '?action=showUser&userId=' + json.data);
                                    });

                                    /*   const geocoder = new google.maps.Geocoder();

                                       geocoder.geocode({ address: user.zipcode }, (results, status) => {
                                           if (status === "OK") {
                                               if (results[0]) {
                                                   
                                                   
                                                   

                                                   fetch('/admin/update/location', {
                                                       credentials: 'same-origin',
                                                       headers: {
                                                           'content-type': 'application/json',
                                                           'authorization': 'bearer ' + token
                                                       },
                                                       method: 'POST',
                                                       body: JSON.stringify({
                                                           userId: json.data,
                                                           lat: results[0].geometry.location.lat(),
                                                           lng: results[0].geometry.location.lng(),
                                                       })
                                                   }).then(function(response) {

                                                       response.json().then(function(json1) {
                                                           

                                                           if (json1.error) {
                                                               $("#error").html(`<div class="alert alert-danger col-sm-12">${json1.message}</div>`);
                                                           } else {
                                                               $("#error").html('');

                                                               swal({
                                                                   title: "Good job!",
                                                                   text: "User added",
                                                                   type: "success"
                                                               }, function() {
                                                                   redirect(window.location.origin + window.location.pathname + '?action=showUser&userId=' + json.data);
                                                               });
                                                           }
                                                       });

                                                   });

                                               } else {
                                                   window.alert("No results found");
                                               }
                                           } else {
                                               window.alert("Geocoder failed due to: " + status);
                                           }
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

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });




    $('.dataTables-example').DataTable({
        pageLength: 25,
        responsive: true,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [{
                extend: 'copy'
            },
            {
                extend: 'csv',
                title: role + '(s) users Ellipsis'
            },
            {
                extend: 'excel',
                title: role + '(s) users Ellipsis'
            },
            {
                extend: 'pdfHtml5',
                title: role + '(s)usersEllipsis',
                customize: doLink,
                orientation: 'landscape',
                pageSize: 'LEGAL'
            },

            {
                extend: 'print',
                customize: function(win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]

    });


});