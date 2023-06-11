$(document).ready(function() {
    const token = $.cookie("token");
    const _id = $.cookie("_id");
    const postUri = location.pathname.split('/').filter(a => a).length > 1 ? location.pathname.split('/').filter(a => a)[1] : null;


    const lat = Number($.cookie("lat"));
    const lng = Number($.cookie("lng"));
    $('#googleMaps').hide();
    $('.hided-comments').hide();
    $('.add-comment').hide();
    $('.comments-footer').hide();

    let pos;
    let isMyPos = false;
    let selectedPos;
    let markers = [];
    let post = {};
    let pos1, pos2;
    post.type = 't';


    $(document).on("click", ".likeButton", function(e) {
        e.preventDefault();
        
        
        
        const postLike = {
            postId: e.target.dataset.post,
            userId: _id
        };
        fetch('/add/like', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(postLike)
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    $('#likes_' + json.data.postId).html(json.data.likesHTML);
                    $('#likeButtons_' + json.data.postId).html(json.data.likeButtonsHTML);
                    $('#likeButtons_' + json.data.postId).removeClass('likeButton');
                    $('#likeButtons_' + json.data.postId).addClass('dislikeButton');
                }
            });

        });

    });

    $(document).on("click", ".dislikeButton", function(e) {
        e.preventDefault();
        
        
        
        const postLike = {
            postId: e.target.dataset.post,
            userId: _id
        };
        fetch('/delete/like', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(postLike)
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    $('#likes_' + json.data.postId).html(json.data.likesHTML);
                    $('#likeButtons_' + json.data.postId).html(json.data.likeButtonsHTML);
                    $('#likeButtons_' + json.data.postId).removeClass('dislikeButton');
                    $('#likeButtons_' + json.data.postId).addClass('likeButton');
                }
            });

        });

    });



    $(document).on("click", ".deleteComment", function(e) {
        e.preventDefault();
        
        
        
        
        const postComment = {
            postId: e.target.dataset.post,
            commentId: e.target.dataset.comment
        };

        fetch('/delete/comment', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(postComment)
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    $('#comments_' + json.data.postId).html(json.data.commentsHtml);
                }
            });

        });
    });
    $(document).on("click", ".likePostComment", function(e) {
        e.preventDefault();
        
        
        
        
        const postLikeComment = {
            postId: e.target.dataset.post,
            commentId: e.target.dataset.comment,
            userId: _id
        };

        fetch('/add/like/comment', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(postLikeComment)
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    $('#comments_' + json.data.postId).html(json.data.commentsHtml);
                }
            });

        });

    });

    $(document).on("click", ".dislikePostComment", function(e) {
        e.preventDefault();
        
        
        
        
        const postLikeComment = {
            postId: e.target.dataset.post,
            commentId: e.target.dataset.comment,
            userId: _id
        };

        fetch('/delete/like/comment', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(postLikeComment)
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    $('#comments_' + json.data.postId).html(json.data.commentsHtml);
                }
            });

        });

    });


    $(document).on("click", ".seeComments", function(e) {
        e.preventDefault();
        
        
        
        
        const postLikeComment = {
            postId: e.target.dataset.post
        };

        getComments(postLikeComment)

    });


    function getComments(postLikeComment) {
        fetch('/all/comments', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(postLikeComment)
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    $('#comments_' + json.data.postId).html(json.data.commentsHtml);
                    $('#comments_' + json.data.postId).show();
                    $('#addComment_' + json.data.postId).show();
                    $('#comments_footer_' + json.data.postId).show();
                    $('#text_comment_' + json.data.postId).focus();
                }
            });

        });
    }

    $(document).on("click", ".deletePost", function(e) {
        e.preventDefault();
        
        
        
        
        const postLikeComment = {
            postId: e.target.dataset.post
        };

        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this post!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function() {



            fetch('/delete/post', {
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'bearer ' + token
                },
                method: 'POST',
                body: JSON.stringify(postLikeComment)
            }).then(function(response) {

                response.json().then(function(json) {
                    

                    if (json.error) {} else {
                        
                        
                        
                        if (json.data.res == 'success') {
                            $('#post_' + json.data.postId).remove();

                            swal("Deleted!", "Your post has been deleted.", "success");
                        }

                    }
                });

            });
        });

    });

    let markers2 = [],
        directionsRenderer22;

    $(document).on("click", ".openMapModal", function(e) {
        e.preventDefault();
        
        
        
        
        
        
        const loc0 = e.target.dataset.location0;
        const loc1 = e.target.dataset.location1;
        const loc2 = e.target.dataset.location2;
        const loc3 = e.target.dataset.location3;

        const latLng = {
            lat: Number(loc0),
            lng: Number(loc1)
        };
        const latLng2 = {
            lat: Number(loc2),
            lng: Number(loc3)
        };
        const mapOptions1 = {
            zoom: 13,
            center: new google.maps.LatLng(latLng.lat, latLng.lng),
            // Style for Google Maps
            styles: [{
                "featureType": "water",
                "stylers": [{
                    "saturation": 43
                }, {
                    "lightness": -11
                }, {
                    "hue": "#0088ff"
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{
                    "hue": "#ff0000"
                }, {
                    "saturation": -100
                }, {
                    "lightness": 99
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#808080"
                }, {
                    "lightness": 54
                }]
            }, {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ece2d9"
                }]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ccdca1"
                }]
            }, {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#767676"
                }]
            }, {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#ffffff"
                }]
            }, {
                "featureType": "poi",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "color": "#b8cb93"
                }]
            }, {
                "featureType": "poi.park",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi.sports_complex",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi.medical",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi.business",
                "stylers": [{
                    "visibility": "simplified"
                }]
            }]
        };
        const mapElement = document.getElementById('mapFullScreen');
        let directionsRenderer2 = new google.maps.DirectionsRenderer();
        const directionsService2 = new google.maps.DirectionsService();

        const mapp = new google.maps.Map(mapElement, mapOptions1);




        const myMarker2 = new google.maps.Marker({
            position: latLng,
            mapp,
            icon: {
                url: '/assets/img/myposa.png',
                scaledSize: new google.maps.Size(50, 50)
            },
            title: "1st Position",
            draggable: false,
            zIndex: 99999999
        });
        markers2.push(myMarker2);

        const myMarker3 = new google.maps.Marker({
            position: latLng2,
            mapp,
            icon: {
                url: '/assets/img/myposb.png',
                scaledSize: new google.maps.Size(50, 50)
            },
            title: "2nd Position",
            draggable: false,
            zIndex: 99999999
        });

        directionsRenderer2.setMap(mapp);

        markers2.push(myMarker3);


        directionsService2.route({
                origin: latLng,
                destination: latLng2,
                // Note that Javascript allows us to access the constant
                // using square brackets and a string value as its
                // "property."
                travelMode: google.maps.TravelMode.WALKING,
            },
            (response, status) => {
                if (status == "OK") {
                    
                    
                    
                    directionsRenderer2.setDirections(response);
                    directionsRenderer22 = directionsRenderer2;

                    $('#fullScreenMap').append(`<div id="travelTime">
                      Distance:  ${response.routes[0].legs[0].distance.text}, Duration:   ${response.routes[0].legs[0].duration.text}                     
                </div>`);
                    //    mapp.setCenter(13);
                    $('#fullScreenMap').show();
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );


    });

    $(document).on("click", ".openImageModal", function(e) {
        e.preventDefault();
        
        
        
        $('#fullImage').attr('src', e.target.dataset.image);
        $('#fullScreenImage').show();

    });

    $(document).on("click", "#closeImage", function(e) {
        e.preventDefault();
        $('#fullScreenImage').hide();
        $('#fullImage').removeAttr('src');

    });

    $(document).on("click", "#closeMap", function(e) {
        e.preventDefault();


        $('#fullScreenMap').hide();

        if ($('#travelTime')) {
            $('#travelTime').remove();
        }

        directionsRenderer22.setMap(null);
        markers2.forEach(marker => {
            marker.setMap(null);
        });

        markers2 = [];
    });



    function getPost() {
        fetch('/get/post', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify({
                postId: postUri
            })
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {

                    
                    
                    
                    const post = json.data.post;
                    const user = json.data.user;
                    let htmlContent = '';

                    
                    
                    


                    const postCreationDate = new Date(post.createdAt);

                    htmlContent = htmlContent + `<div class="social-feed-box post" id="post_${post._id}">`;

                    if (post.postOwner) {
                        htmlContent = htmlContent + `<div class="float-right social-action dropdown">
                        <button data-toggle="dropdown" class="dropdown-toggle btn-white">
                    </button>
                        <ul class="dropdown-menu m-t-xs">
                            <li><a href="" data-post="${post._id}" class="deletePost"><i class="fa fa-trash"></i>
                                Delete</a></li>
                        </ul>
                    </div>`;

                    }

                    if (post.theOwner && post.theOwner.profile) {
                        htmlContent = htmlContent + `   <div class="social-avatar">
                            <a href="/profile/${post.theOwner.username}" class="float-left">
                                <img alt="image" src="${post.theOwner.profile.picture}">
                            </a>
                                    <div class="media-body">
                                        <a href="/profile/${post.theOwner.username}">
                                        ${post.theOwner.profile.name}
                                        </a>
                                        <small class="text-muted">
                                    ${postCreationDate.getDate()}/${postCreationDate.getMonth()+1 <= 9?'0'+(postCreationDate.getMonth()+1):postCreationDate.getMonth()+1}/${postCreationDate.getFullYear()}  ${postCreationDate.getHours() <= 9 ? '0'+postCreationDate.getHours(): postCreationDate.getHours()}:${postCreationDate.getMinutes()<= 9 ?'0'+postCreationDate.getMinutes():postCreationDate.getMinutes()}
                                </small>
                                    </div>
                                </div>`;

                    }
                    htmlContent = htmlContent + ` <div class="social-body">`;

                    if (post.text) {
                        htmlContent = htmlContent + ` <p>
                            ${post.text}
                        </p>`;
                    }

                    if (post.type == 'p') {
                        htmlContent = htmlContent + `<div style=" text-align: center; ">


                            <a class="openImageModal" data-image="${post.content}">
                    <img  data-image="${post.content}" style="max-height: 500px!important;" src="${post.content}" class="img-fluid">
                </a>

                        </div>`;
                    }

                    if (post.type == 'v') {
                        htmlContent = htmlContent + ` <video style="width: 100%!important; max-height: 500px!important;" class="img-fluid" controls>
                            <source
                                src="${post.content}"
                                type="${post.contentType}">
                            Your browser does not support the
                            video tag.
                        </video>`;
                    }

                    if (post.type == 'm') {
                        htmlContent = htmlContent + `   <div style=" text-align: center; ">
                            <a class="openMapModal" data-location0="${post.locations[0]}" data-location1="${post.locations[1]}" data-location2="${post.locations[2]}" data-location3="${post.locations[3]}"> 
                        <img
                        data-location0="${post.locations[0]}" data-location1="${post.locations[1]}" data-location2="${post.locations[2]}" data-location3="${post.locations[3]}"
                            style="max-height: 500px!important;"
                            src="${post.content}"
                            class="img-fluid"></a>
                        </div>`;
                    }

                    htmlContent = htmlContent + `<div id="likes_${post._id}">`;



                    if (post.likes && post.likes.length) {
                        htmlContent = htmlContent + `<a href="#" class="small likesNumber">
                            ${post.likes.length} Like this!
                        </a>`;
                    }
                    htmlContent = htmlContent + `</div>
                        </div>
                        <div class="row">
                            <div class="btn-group col-md-12">
                        `;


                    if (!post.liked) {
                        htmlContent = htmlContent + `<button class="btn btn-default btn-outline btn-sm likeButton" id="likeButtons_${post._id}" data-post="${post._id}"><i
                            class="fa fa-thumbs-up"
                            data-post="${post._id}"></i>
                        Like</button>`;
                    } else {
                        htmlContent = htmlContent + `     <button class="btn btn-default btn-outline btn-sm dislikeButton" id="likeButtons_${post._id}" data-post="${post._id}"><i
                            class="fa fa-thumbs-down"
                            data-post="${post._id}"></i>
                        Dislike</button>`;
                    }
                    htmlContent = htmlContent + `<button class="btn btn-default btn-outline btn-sm seeComments" data-post="${post._id}"><i
                        class="fa fa-comment"
                        data-zone="comment_${post._id}"></i>
                    Comment</button>
        </div>
    </div>
    <div class="social-footer comments-footer" style="display: none;" id="comments_footer_${post._id}">

        <div id="comments_${post._id}">

        </div>`;

                    if (user && user.profile) {
                        htmlContent = htmlContent + ` <div class="social-comment add-comment" id="addComment_${post._id}" style="display: none;">
            <a href="" class="float-left">
        <img alt="image"
            src="${user.profile.picture}">
    </a>
            <form class="commentForm" id="commentForm">
                <div class="media-body">
                    <textarea class="form-control" id="text_comment_${post._id}" data-post="${post._id}" name="comment" placeholder="Write comment..."></textarea>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-primary btn-xs pull-right">Add
                    comment</button>
                    </div>
                </div>
            </form>
        </div>`;
                    }
                    htmlContent = htmlContent + `</div>

                        </div>`;


                    //                        $('#postsContainer').append(htmlContent);



                    //  
                    //  
                    //  
                    $('#loader').remove();
                    $('#postsContainer').html(htmlContent);

                    const postLikeComment = {
                        postId: post._id
                    };

                    getComments(postLikeComment)


                    $('#commentForm').validate({
                        rules: {
                            comment: {
                                required: true
                            }
                        },
                        submitHandler: function() {
                            
                            
                            
                            

                            const self = $(this);
                            const postComment = {
                                postId: self[0].currentForm.elements.comment.dataset.post,
                                comment: self[0].currentForm.elements.comment.value,
                                userId: _id
                            };

                            
                            
                            

                            fetch('/add/comment', {
                                credentials: 'same-origin',
                                headers: {
                                    'content-type': 'application/json',
                                    'authorization': 'bearer ' + token
                                },
                                method: 'POST',
                                body: JSON.stringify(postComment)
                            }).then(function(response) {

                                response.json().then(function(json) {
                                    

                                    if (json.error) {} else {
                                        self[0].currentForm.reset()
                                        
                                        
                                        
                                        $('#comments_' + json.data.postId).html(json.data.commentsHtml);
                                    }
                                });

                            });
                        }
                    });

                }
            });

        });
    }


    getPost()

    //dev
    const socket = io.connect('/');

    //prod
    //const socket = io.connect('https://ellipsis.neutronslab.com/');

    socket.on('refresh' + postUri, function(data) {
        getPost()
    });
});