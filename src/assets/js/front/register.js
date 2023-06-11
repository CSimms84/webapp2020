$(document).ready(function() {
    let image = '';

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    $('#address').attr('disabled', '');
    $('#nbrEmp').attr('disabled', '');
    $('#tax').attr('disabled', '');
    $('#AddressContainer').attr('hidden', '');
    $('#companyInfoContainer').attr('hidden', '');


    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );


    const formSteps = $("#form").steps({
        bodyTag: "fieldset",
        onStepChanging: function(event, currentIndex, newIndex) {
            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex) {
                return true;
            }

            var form = $(this);

            // Clean up if user went backward before
            if (currentIndex < newIndex) {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            form.validate().settings.ignore = ":disabled,:hidden";

            // Start validation; Prevent going forward if false
            return form.valid();
        },
        onStepChanged: function(event, currentIndex, priorIndex) {
            if (currentIndex > 1) {



            }

        },
        onFinishing: function(event, currentIndex) {



            var form = $(this);

            // Disable validation on fields that are disabled.
            // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
            form.validate().settings.ignore = ":disabled";

            // Start validation; Prevent form submission if false
            return form.valid();
        },
        onFinished: function(event, currentIndex) {
            var form = $(this);

            // Submit form input
            form.submit();
        }
    }).validate({
        errorPlacement: function(error, element) {
            element.before(error);
        },
        rules: {
            confirmpassword: {
                equalTo: "#password"
            },

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
            zipcode: {
                required: true
            }
        },

        messages: {

            password: {
                required: "Required input",
                regex: jQuery.validator.format("Password must be at least 8 characters At least 1 number, 1 lowercase, 1 uppercase letter At least 1 special character from @#$%&!\"/$%?&*()")
            }

        },
        submitHandler: function() {

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

            if ($('#acceptTerms').is(':checked')) {
                user.acceptTerms = true;
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

                        fetch('/register', {
                            credentials: 'same-origin',
                            headers: {
                                'content-type': 'application/json; charset=utf-8'
                            },
                            method: 'POST',
                            body: JSON.stringify(user)
                        }).then(function(response) {

                            response.json().then(function(json) {


                                if (json.error || json.message) {
                                    $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                                } else {
                                    $("#error").html('');


                                    $.cookie("token", json.token, { path: '/', expires: 90 });
                                    $.cookie("_id", json._id, { path: '/', expires: 90 });
                                    $.cookie("username", json.username, { path: '/', expires: 90 });
                                    $.cookie("picture", json.picture, { path: '/', expires: 90 });
                                    $.cookie("lat", results[0].geometry.location.lat(), { path: '/', expires: 90 });
                                    $.cookie("lng", results[0].geometry.location.lng(), { path: '/', expires: 90 });
                                    location.reload();
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
                        $("#error").html(`<div class="alert alert-danger col-sm-12">No results found</div>`);
                        $('#form').steps('previous');

                    }
                } else {
                    // window.alert("Geocoder failed due to: " + status);

                    if (status == 'ZERO_RESULTS') {
                        swal({
                            title: "Zip Code",
                            text: "Zip Code invalid",
                            type: "error"
                        });
                        $("#error").html(`<div class="alert alert-danger col-sm-12">Zip Code invalid</div>`);
                        $('#form').steps('previous');
                    } else {
                        swal({
                            title: "Zip Code",
                            text: "Geocoder failed due to: " + status,
                            type: "error"
                        });
                        $("#error").html(`<div class="alert alert-danger col-sm-12">Geocoder failed due to: ${status}</div>`);
                        $('#form').steps('previous');
                    }
                }
            });


        }
    });

    document.getElementById('photoProfile').addEventListener("change", function(e) {
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

    document.getElementById('role').addEventListener('change', function(e) {
        e.preventDefault();
        const theRole = $('#role').val();



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


});