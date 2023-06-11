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
    let token = $.cookie("token");

    $(document).on("ifChanged", "#promo", function(e) {
        e.preventDefault();
        if ($('#promo').is(':checked')) {
            $('#starts').removeAttr('readonly');
            $('#ends').removeAttr('readonly');
            $('#pricePromo').removeAttr('readonly');
            $('#starts').attr('required', '');
            $('#ends').attr('required', '');
            $('#pricePromo').attr('required', '');
        } else {
            $('#starts').attr('readonly', '');
            $('#ends').attr('readonly', '');
            $('#pricePromo').attr('readonly', '');
            $('#starts').removeAttr('required');
            $('#ends').removeAttr('required');
            $('#pricePromo').removeAttr('required');
        }
    });



    let action = urlParam('action');
    let subscriptionId = urlParam('subscriptionId');
    
    if (action == 'editSubscription') {

        if (subscriptionId) {
            fetch('/admin/subscriptions/get', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify({ subscriptionId: subscriptionId })
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {} else {
                        $('#name').val(json.data.name);
                        $('#role').val(json.data.role);
                        $('#price').val(json.data.price);
                        $('#recursion').val(json.data.recursion);
                        
                        
                        if (json.data.public) {

                            $('#public').iCheck('check');
                        } else {

                            $('#public').iCheck('uncheck');
                        }


                        if (json.data.promo) {

                            $('#promo').iCheck('check');
                            $('#pricePromo').val(json.data.pricePromo);
                            $('#starts').val(moment(json.data.starts).format('MM/DD/YYYY'));
                            $('#ends').val(moment(json.data.ends).format('MM/DD/YYYY'));
                        } else {

                            $('#promo').iCheck('uncheck');
                        }
                    }
                });

            });



            $("#editForm").validate({
                rules: {
                    name: {
                        required: true
                    },
                    role: {
                        required: true
                    },
                    price: {
                        required: true
                    },
                    recursion: {
                        required: true
                    }
                },
                submitHandler: function() {
                    
                    const subscription = {
                        subscriptionId: subscriptionId,
                        name: $('#name').val(),
                        role: $('#role').val(),
                        price: $('#price').val(),
                        recursion: $('#recursion').val(),
                        description: $('#description').val()
                    };

                    if ($('#public').is(':checked')) {
                        subscription.public = true;
                    }

                    if ($('#promo').is(':checked')) {
                        subscription.promo = true;
                        subscription.starts = $('#starts').val();
                        subscription.ends = $('#ends').val();
                        subscription.pricePromo = $('#pricePromo').val();
                    }

                    fetch('/admin/subscriptions/edit', {
                        credentials: 'same-origin',
                        headers: {
                            'content-type': 'application/json',
                            'authorization': 'bearer ' + token
                        },
                        method: 'POST',
                        body: JSON.stringify(subscription)
                    }).then(function(response) {

                        response.json().then(function(json) {
                            

                            if (json.error) {
                                $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                            } else {
                                $("#error").html('');

                                swal({
                                    title: "Good job!",
                                    text: "Subscription Edited",
                                    type: "success"
                                }, function() {
                                    redirect(window.location.origin + window.location.pathname + '?action=showSubscription&subscriptionId=' + json.data);
                                });
                            }
                        });

                    });
                }
            });

        }

    }

    $(document).on("click", "#deleteSubscription", function(e) {
        e.preventDefault();
        const id = $(this).attr('data-id');
        
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this subscription!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function() {

            fetch('/admin/subscriptions/delete', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify({ subscriptionId: id })
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {
                        $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                    } else {

                        swal({
                            title: "Deleted!",
                            text: "Subscription Deleted",
                            type: "success"
                        }, function() {
                            redirect(window.location.origin + window.location.pathname);
                        });
                    }
                });

            });

        });


    });


    $("#form").validate({
        rules: {
            name: {
                required: true
            },
            role: {
                required: true
            },
            price: {
                required: true
            },
            recursion: {
                required: true
            }
        },
        submitHandler: function() {
            
            const subscription = {
                name: $('#name').val(),
                role: $('#role').val(),
                price: $('#price').val(),
                recursion: $('#recursion').val(),
                description: $('#description').val()
            };

            if ($('#public').is(':checked')) {
                subscription.public = true;
            }

            if ($('#promo').is(':checked')) {
                subscription.promo = true;
                subscription.starts = $('#starts').val();
                subscription.ends = $('#ends').val();
                subscription.pricePromo = $('#pricePromo').val();
            }

            fetch('/admin/subscriptions/add', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify(subscription)
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {
                        $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                    } else {
                        $("#error").html('');

                        swal({
                            title: "Good job!",
                            text: "Subscription added",
                            type: "success"
                        }, function() {
                            redirect(window.location.origin + window.location.pathname + '?action=showSubscription&subscriptionId=' + json.data);
                        });
                    }
                });

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
        buttons: [
            { extend: 'copy' },
            { extend: 'csv', title: 'Subscriptions Ellipsis' },
            { extend: 'excel', title: 'Subscriptions Ellipsis' },
            {
                extend: 'pdfHtml5',
                title: 'Subscriptions Ellipsis',
                customize: doLink,
                orientation: 'landscape'
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