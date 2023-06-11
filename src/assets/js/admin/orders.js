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

    $("#user").change(function(e) {
        e.preventDefault();
        const theUser = $('#user').val();
        

        fetch('/admin/subscriptions/role', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify({ userId: theUser })
        }).then(function(response) {
            let subs = `<option value="" selected disabled>Select product</option>`;
            response.json().then(function(json) {
                

                if (json.error) {} else {
                    for (let index = 0; index < json.data.length; index++) {
                        const element = json.data[index];
                        subs += `<option value="${element._id}">${element.name}</option>`;
                    }
                    
                    document.getElementById("product").innerHTML = subs;
                }
            });

        });
    });

    let action = urlParam('action');
    let orderId = urlParam('orderId');
    
    if (action == 'editOrder') {
        if (orderId) {
            $('select').attr('readonly', '');
            $('#saveCoupon').attr('disabled', '');
            fetch('/admin/orders/get', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify({ orderId: orderId })
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {} else {
                        $('#coupon').val(json.data.coupon);
                        $('#user').val(json.data.user);
                        if (json.data.user) {
                            fetch('/admin/subscriptions/role', {
                                credentials: 'same-origin',
                                headers: {
                                    'content-type': 'application/json',
                                    'authorization': 'bearer ' + token
                                },
                                method: 'POST',
                                body: JSON.stringify({ userId: json.data.user })
                            }).then(function(response2) {
                                let subs = `<option value="" selected disabled>Select product</option>`;
                                response2.json().then(function(json2) {
                                    

                                    if (json.error) {} else {
                                        for (let index = 0; index < json2.data.length; index++) {
                                            const element = json2.data[index];
                                            subs += `<option value="${element._id}">${element.name}</option>`;
                                        }
                                        
                                        document.getElementById("product").innerHTML = subs;

                                        setTimeout(() => {
                                            $('select').removeAttr('readonly');
                                            $('#saveCoupon').removeAttr('disabled');
                                            $('#product').val(json.data.product);
                                        }, 1000);
                                    }
                                });

                            });
                        } else {
                            $('select').removeAttr('readonly');
                            $('#saveCoupon').removeAttr('disabled');
                        }

                    }
                });

            });



            $("#editForm").validate({
                rules: {

                    user: {
                        required: true
                    },
                    product: {
                        required: true
                    }
                },
                submitHandler: function() {
                    
                    const order = {
                        orderId: orderId,
                        user: $('#user').val(),
                        product: $('#product').val(),
                        coupon: $('#coupon').val()
                    };
                    



                    fetch('/admin/orders/edit', {
                        credentials: 'same-origin',
                        headers: {
                            'content-type': 'application/json',
                            'authorization': 'bearer ' + token
                        },
                        method: 'POST',
                        body: JSON.stringify(order)
                    }).then(function(response) {
                        
                        response.json().then(function(json) {
                            

                            if (json.error) {
                                $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                            } else {
                                $("#error").html('');

                                swal({
                                    title: "Good job!",
                                    text: "Order Edited",
                                    type: "success"
                                }, function() {
                                    redirect(window.location.origin + window.location.pathname + '?action=showOrder&orderId=' + json.data);
                                });
                            }
                        });

                    });


                }
            });

        }

    }

    $(document).on("click", "#deleteOrder", function(e) {
        e.preventDefault();
        const id = $(this).attr('data-id');
        
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this order!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function() {

            fetch('/admin/orders/delete', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify({ orderId: id })
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {
                        $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                    } else {

                        swal({
                            title: "Deleted!",
                            text: "Order Deleted",
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
            user: {
                required: true
            },
            product: {
                required: true
            }
        },
        submitHandler: function() {
            
            
            const order = {
                user: $('#user').val(),
                product: $('#product').val(),
                coupon: $('#coupon').val()
            };
            


            fetch('/admin/orders/add', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify(order)
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {
                        $("#error").html(`<div class="alert alert-danger col-sm-12">${json.message}</div>`);
                    } else {
                        $("#error").html('');

                        swal({
                            title: "Good job!",
                            text: "Order added",
                            type: "success"
                        }, function() {
                            redirect(window.location.origin + window.location.pathname + '?action=showOrder&orderId=' + json.data);
                        });
                    }
                });

            });


        }
    });


    $('.dataTables-example').DataTable({
        pageLength: 25,
        responsive: true,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'csv', title: 'Orders Ellipsis' },
            { extend: 'excel', title: 'Orders Ellipsis' },
            {
                extend: 'pdfHtml5',
                title: 'Orders Ellipsis',
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