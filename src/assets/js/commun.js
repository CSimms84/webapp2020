$(document).ready(function() {
    const _id = $.cookie("_id");
    const token = $.cookie("token");


    fetch('/setTimezone', {
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            _id: _id,
            timezone: new Date().getTimezoneOffset()
        })
    }).then(function(response) {

        response.json().then(function(json) {
            

            if (json.error) {} else {
                
                
                
                $('#comments_' + json.data.postId).html(json.data.commentsHtml);
            }
        });

    });

    if (token) {

        
        
        
        if (document.getElementById('notifcationsButton')) {
            function getNotNumbers() {
                fetch('/getNotificationsNumber', {
                    credentials: 'same-origin',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'bearer ' + token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        userId: _id
                    })
                }).then(function(response) {

                    response.json().then(function(json) {
                        

                        if (json.error) {} else {
                            
                            
                            
                            if (json.data > 0) {
                                $('#notifcationsButton').append(`<span class="label label-primary" id="notificationNumber">${json.data}</span>`);
                                $('#notifcationsButton2').append(`<span class="label label-primary" id="notificationNumber2">${json.data}</span>`);


                            } else {

                                $('#notificationNumber').remove();
                                $('#notificationNumber2').remove();
                            }

                        }
                    });

                });
            }


            function getMessagesNumbers() {
                fetch('/get/messages/unread', {
                    credentials: 'same-origin',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'bearer ' + token
                    },
                    method: 'POST'
                }).then(function(response) {

                    response.json().then(function(json) {
                        

                        if (json.error) {} else {
                            
                            
                            
                            if (json.data > 0) {
                                $('#messagesNumber').remove();
                                $('#messagesMenu').append(`<span class="label label-primary" id="messagesNumber">${json.data}</span>`);


                            } else {

                                $('#messagesNumber').remove();
                            }

                        }
                    });

                });
            }
            getMessagesNumbers()
            getNotNumbers()

            //dev
            const socket = io.connect('/');

            //prod
            //const socket = io.connect('https://ellipsis.neutronslab.com/');


            
            
            


            let toast2 = $('.toast2');
            toast2.toast({
                delay: 15000,
                animation: true
            });

            $(window).bind("scroll", function() {
                let toast = $('.toast2');
                toast.css("top", window.pageYOffset + 60);

            });



            socket.on(_id + 'newmessage', function(data) {
                const notif = JSON.parse(data);
                const finalDate = new Date();
                $('#time').html(`${finalDate.getDate()}/${finalDate.getMonth()+1 <= 9?'0'+(finalDate.getMonth()+1):finalDate.getMonth()+1}/${finalDate.getFullYear()}  ${finalDate.getHours() <= 9 ? '0'+finalDate.getHours(): finalDate.getHours()}:${finalDate.getMinutes()<= 9 ?'0'+finalDate.getMinutes():finalDate.getMinutes()}`);
                $('#notifContent').html(`<a href="${notif.url}">${notif.text}</a>`);

                if (location.pathname.indexOf(notif.url) == -1) {

                    toast2.toast('show');
                }
                getMessagesNumbers()
            });

            socket.on(_id + 'messageseen', function(data) {
                getMessagesNumbers()

            });

            socket.on(_id + 'notifs', function(data) {
                
                
                

                $('#right-sidebar').removeClass('sidebar-open')
                if (data != 'removeNotif') {



                    const notif = JSON.parse(data);
                    const finalDate = new Date(notif.createdAt);

                    $('#time').html(`${finalDate.getDate()}/${finalDate.getMonth()+1 <= 9?'0'+(finalDate.getMonth()+1):finalDate.getMonth()+1}/${finalDate.getFullYear()}  ${finalDate.getHours() <= 9 ? '0'+finalDate.getHours(): finalDate.getHours()}:${finalDate.getMinutes()<= 9 ?'0'+finalDate.getMinutes():finalDate.getMinutes()}`);
                    $('#notifContent').html(`<a href="${notif.url}">${notif.text}</a>`);
                    
                    
                    
                    toast2.toast('show');

                    if (notif.type == 'addFriendRequest') {
                        if (document.getElementById('addRequest')) {

                            const userId = $('#addRequest').data("id")
                            
                            
                            
                            $('#addRequest').replaceWith(` <button type="button" class="btn btn-success btn-sm" id="acceptRequest" data-id="${userId}">Accept</button>
    <button type="button" class="btn btn-warning btn-sm" id="cancelHisRequest" data-id="${userId}">Cancel</button>`);
                        }

                    }
                }


                getNotNumbers()

            });




            $(document).on('click', '#notifcationsButton', function(e) {
                fetchNotifications();
            });
            $(document).on('click', '#notifcationsButton2', function(e) {
                fetchNotifications();
            });

            function fetchNotifications() {
                fetch('/getNotifications', {
                    credentials: 'same-origin',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'bearer ' + token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        userId: _id
                    })
                }).then(function(response) {

                    response.json().then(function(json) {
                        

                        if (json.error) {} else {
                            
                            
                            
                            let htmlContent = '';
                            for (let index = 0; index < json.data.length; index++) {
                                const notification = json.data[index];
                                const finalDate = new Date(notification.createdAt);
                                
                                
                                
                                if (notification.seen) {

                                    htmlContent = htmlContent + ` <div class="sidebar-message">`;
                                } else {

                                    htmlContent = htmlContent + ` <div class="sidebar-message new-notification">`;
                                }
                                htmlContent = htmlContent + ` <a href="${notification.url}">
                                <div class="media-body">
        
                                    ${notification.text}
                                    <br>
                                    <small class="text-muted">${finalDate.getDate()}/${finalDate.getMonth()+1 <= 9?'0'+(finalDate.getMonth()+1):finalDate.getMonth()+1}/${finalDate.getFullYear()}  ${finalDate.getHours() <= 9 ? '0'+finalDate.getHours(): finalDate.getHours()}:${finalDate.getMinutes()<= 9 ?'0'+finalDate.getMinutes():finalDate.getMinutes()}</small>
                                </div>
                            </a>
                        </div>`;


                            }

                            $('#notificationsSidebar').html(htmlContent);
                            $('#notificationNumber').remove();
                            $('#notificationNumber2').remove();
                        }
                    });

                });
            }


        }

    }

});