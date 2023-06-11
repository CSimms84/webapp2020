 $(document).ready(function() {
     const token = $.cookie("token");
     const _id = $.cookie("_id");
     const roomUri = location.pathname.split('/').filter(a => a).length > 1 ? location.pathname.split('/').filter(a => a)[1] : null;



     //dev
     const socket = io.connect('/');

     //prod
     // const socket = io.connect('https://ellipsis.neutronslab.com/');



     socket.on(_id + 'message' + roomUri, function(data) {

         getMessages(roomUri, true, (height) => {



             $('#chat-box').animate({
                 scrollTop: height,
                 complete: function() {
                     //Hide your button here
                 }
             }, 0);
         });

     });

     socket.on(_id + 'messageseen' + roomUri, function(data) {
         getRooms(roomUri, '');

         getMessages(roomUri, false, (height) => {



             $('#chat-box').animate({
                 scrollTop: height,
                 complete: function() {
                     //Hide your button here
                 }
             }, 0);
         });

     });

     socket.on(_id + 'newmessage', function(data) {
         getRooms(roomUri, '');
     });

     getRooms(roomUri, '');
     if (roomUri) {
         seeMessages(roomUri, (data) => {




             getMessages(roomUri, false, (height) => {



                 $('#chat-box').animate({
                     scrollTop: height,
                     complete: function() {
                         //Hide your button here
                     }
                 }, 200);
             });
         })


         $(document).on('click', '#sendMessage', function(e) {
             e.preventDefault();



             seeMessages(roomUri, (data) => {



                 addMessage(roomUri);
             });
         });

         $(document).on('click', '#chat-box', function(e) {
             e.preventDefault();




             seeMessages(roomUri, (data) => {});
         });

         $(document).on('click', '#searchButton', function(e) {
             e.preventDefault();



             getRooms(roomUri, $('#searchText').val());
         });
     }


     function seeMessages(roomId, cb) {
         fetch('/see/message/room', {
             credentials: 'same-origin',
             headers: {
                 'content-type': 'application/json',
                 'authorization': 'bearer ' + token
             },
             method: 'POST',
             body: JSON.stringify({
                 roomId: roomId
             })
         }).then(function(response) {

             response.json().then(function(json) {


                 if (json.error) {} else {
                     cb(json.data)
                 }
             });
         });
     }




     function addMessage(roomId) {
         if ($('#message').val().trim()) {
             fetch('/add/message', {
                 credentials: 'same-origin',
                 headers: {
                     'content-type': 'application/json',
                     'authorization': 'bearer ' + token
                 },
                 method: 'POST',
                 body: JSON.stringify({
                     roomId: roomId,
                     text: $('#message').val().trim()
                 })
             }).then(function(response) {

                 response.json().then(function(json) {


                     if (json.error) {} else {
                         $('#message').val('');
                         getRooms(roomUri, '');
                         getMessages(json.data, false, (height) => {



                             $('#chat-box').animate({
                                 scrollTop: height,
                                 complete: function() {
                                     //Hide your button here
                                 }
                             }, 0);
                         });
                     }
                 });
             });
         }
     }


     function getMessages(roomId, lastreadBool, cb) {
         fetch('/get/messages/room', {
             credentials: 'same-origin',
             headers: {
                 'content-type': 'application/json',
                 'authorization': 'bearer ' + token
             },
             method: 'POST',
             body: JSON.stringify({
                 roomId: roomId
             })
         }).then(function(response) {

             response.json().then(function(json) {


                 if (json.error) {} else {

                     let messagesHtml = ``;






                     messagesHtml = messagesHtml + `<div class="selected-user">`;

                     if (json.data.room.roomName) {
                         messagesHtml = messagesHtml + `<span style=" font-size: 15px; font-weight: bold; ">${json.data.room.roomName}: </span>`
                     }
                     for (let index1 = 0; index1 < json.data.room.usersInfo.length; index1++) {
                         const userInfo = json.data.room.usersInfo[index1];
                         if (userInfo._id != _id) {
                             messagesHtml = messagesHtml + `
                            <span id="selected-user-name" class="name"><a target="_blank" href="/profile/${userInfo.username}">${userInfo.profile.name}</a>${(json.data.room.usersInfo.length -1 == index1) || (json.data.room.usersInfo.length == 2)? '':', '}</span>
                        `;
                         }
                     }

                     messagesHtml = messagesHtml + `</div>`;
                     messagesHtml = messagesHtml + `<div class="chat-container">
                         <ul class="chat-box chatContainerScroll" id="chat-box">`;

                     for (let index1 = 0; index1 < json.data.messages.length; index1++) {
                         const message = json.data.messages[index1];
                         const messageDate = new Date(message.message.createdAt);

                         let lastread = "";



                         if (lastreadBool && json.data.lastMessage._id == message.message._id) {
                             lastread = 'last-read'
                         } else {
                             lastread = "";
                         }

                         if (message.messageUser._id != _id) {

                             messagesHtml = messagesHtml + ` <li class="chat-left chat-component ${lastread}">
                                <div class="chat-avatar">
                                    <img src="${message.messageUser.profile.picture}" alt="">
                    
                                </div>
                                <div class="chat-text">${message.message.text}
                                <br>
                                <span> <small>${messageDate.getDate()}/${messageDate.getMonth()+1 <= 9?'0'+(messageDate.getMonth()+1):messageDate.getMonth()+1}/${messageDate.getFullYear()}  ${messageDate.getHours() <= 9 ? '0'+messageDate.getHours(): messageDate.getHours()}:${messageDate.getMinutes()<= 9 ?'0'+messageDate.getMinutes():messageDate.getMinutes()}</small>
                                </span>
                                <span>
                                <small>   ${message.isSeen? '<i class="fa fa-check-circle"></i>':'<i class="fa fa-check-circle-o"></i>'}</small> 
                                </span>
                                </div>
                    
                            </li>`;
                         } else {
                             messagesHtml = messagesHtml + ` <li class="chat-right  chat-component ${lastread}">

                                 <div class="chat-text">${message.message.text}
                                 <br>
                                 <span> <small>${messageDate.getDate()}/${messageDate.getMonth()+1 <= 9?'0'+(messageDate.getMonth()+1):messageDate.getMonth()+1}/${messageDate.getFullYear()}  ${messageDate.getHours() <= 9 ? '0'+messageDate.getHours(): messageDate.getHours()}:${messageDate.getMinutes()<= 9 ?'0'+messageDate.getMinutes():messageDate.getMinutes()}</small>
                                 </span>
                                 <span>
                                 <small>   ${message.isSeen? '<i class="fa fa-check-circle"></i>':'<i class="fa fa-check-circle-o"></i>'}</small> 
                                 </span>
                                 </div>
                            </li>`;
                         }
                     }

                     messagesHtml = messagesHtml + `</ul>
                         <div class="form-group mt-3 mb-0">
                             <textarea class="form-control" rows="3" placeholder="Type your message here..." id="message"></textarea>
                             <div class="row">
                                 <div class="col-md-12">
                                     <button type="submit" class="btn btn-primary btn-xs pull-right" id="sendMessage"><i class="fa fa-send"></i></button>
                                 </div>
                             </div>
                         </div>
                     </div>`;




                     $('#list-messages').html(messagesHtml);

                     let scrollHeight = 0;

                     for (let index = 0; index < $('.chat-component').length; index++) {
                         const element = $('.chat-component').eq(index);
                         scrollHeight = scrollHeight + element.height();
                     }

                     cb(scrollHeight + 1000000)

                 }
             });
         });
     }

     function getRooms(roomURL, searchText) {
         fetch('/get/rooms', {
             credentials: 'same-origin',
             headers: {
                 'content-type': 'application/json',
                 'authorization': 'bearer ' + token
             },
             method: 'POST',
             body: JSON.stringify({
                 text: searchText
             })
         }).then(function(response) {

             response.json().then(function(json) {


                 if (json.error) {} else {

                     let roomHtml = ``;
                     for (let index = 0; index < json.data.length; index++) {
                         const rooms = json.data[index];
                         const lastMessageDate = new Date(rooms.lastMessageDate);






                         roomHtml = roomHtml + `   
                                     
                            <a href="/messages/${rooms._id}" class="chat-room ${rooms.isLastMessageSeenByUser? '':'unread-message'} ">
                                <li class="person ${roomURL == rooms._id? 'selected-room-chat':''}" data-chat="${rooms._id}">
                                <div class="user">`;

                         let xx = 0;
                         for (let index1 = 0; index1 < rooms.usersInfo.length; index1++) {
                             const userInfo = rooms.usersInfo[index1];






                             if (userInfo._id != _id) {
                                 if (rooms.roomType == 'd') {
                                     roomHtml = roomHtml + `   
                                                  
                                                        <img src="${userInfo.profile.picture}" alt="">
                                                    <!-- <span class="status offline"></span>-->                                    
                                                    
                                    `;

                                 } else {
                                     const yyy = index1 - xx;

                                     roomHtml = roomHtml + `   
                                        <img src="${userInfo.profile.picture}" alt="${yyy}"  style="${yyy>0 && yyy<3 ? 'position: absolute; left:'+(yyy*5)+'px;':''}">
                                    <!-- <span class="status offline"></span>-->                                    
                    `;
                                 }
                             } else {
                                 xx = 1;
                             }



                         }

                         roomHtml = roomHtml + ` </div><small class="time pull-right">${lastMessageDate.getDate()}/${lastMessageDate.getMonth()+1 <= 9?'0'+(lastMessageDate.getMonth()+1):lastMessageDate.getMonth()+1}/${lastMessageDate.getFullYear()}  ${lastMessageDate.getHours() <= 9 ? '0'+lastMessageDate.getHours(): lastMessageDate.getHours()}:${lastMessageDate.getMinutes()<= 9 ?'0'+lastMessageDate.getMinutes():lastMessageDate.getMinutes()}</small>
                         <p class="name-time"><span class="name">`;
                         let tt = 0;
                         let names = '';
                         if (rooms.roomName) {
                             names = names + rooms.roomName;
                         } else {
                             for (let index1 = 0; index1 < rooms.usersInfo.length; index1++) {
                                 const userInfo = rooms.usersInfo[index1];

                                 if (userInfo._id != _id) {
                                     const yyy = index1 - tt;

                                     names = names + `${userInfo.profile.name}${((rooms.usersInfo.length - 1 - tt) == yyy) || (rooms.usersInfo.length ==2) ? '':', '} `;


                                 } else {
                                     tt = 1;
                                 }



                             }
                         }


                         roomHtml = roomHtml + names.substr(0, 20) + (names.length > 20 ? ' ...' : '');
                         roomHtml = roomHtml + `    
                         </span><br><small>
                             ${rooms.lastMessageUser._id == _id ? 'You: ': ''}
                             ${rooms.lastMessage.text.substr(0,20)}
                             ${rooms.lastMessage.text.length > 20 ? '...':''}
                             </small>
                         </p>
                         </li>
                             </a>
                         `;







                     }



                     $('#rooms').html(roomHtml);



                 }
             });

         });
     }


     $("#users").select2({
         theme: 'bootstrap4',
         width: '100%',
         allowClear: true,
         placeholder: 'Select user(s)',
         templateResult: formatUser
     });

     function formatUser(user) {



         if (!user.id) {
             return '';
         }
         var $user = $(
             '<span><img style=" -webkit-border-radius: 50px; -moz-border-radius: 50px; border-radius: 50px; width: 48px; height: 48px; " src="' + user.element.dataset.image + '" class="img-flag" /> ' + user.text + '</span>'
         );
         return $user;
     };
     $("#newMessageFrom").validate({
         rules: {
             users: {
                 required: true
             },
             message2: {
                 required: true
             }
         },
         submitHandler: function() {



             const user = {
                 users: [...$('#users').val(), _id],
                 text: $('#message2').val()
             };

             fetch('/add/message', {
                 credentials: 'same-origin',
                 headers: {
                     'content-type': 'application/json',
                     'authorization': 'bearer ' + token
                 },
                 method: 'POST',
                 body: JSON.stringify(user)
             }).then(function(response) {

                 response.json().then(function(json) {


                     if (json.error) {} else {
                         $('#message2').val('');
                         redirect('/messages/' + json.data);
                     }
                 });
             });


         }

     });

 });