function redirect(url) {
    let element = document.createElement('a');
    element.setAttribute('href', url);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
$(document).ready(function() {
    const token = $.cookie("token");
    const _id = $.cookie("_id");
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
    // Google maps API 
    function initMap() {
        const latLng = { lat: lat, lng: lng };
        const zoom = 5;
        const mapOptions1 = {
            zoom: zoom,
            center: new google.maps.LatLng(latLng.lat, latLng.lng),
            // Style for Google Maps
            styles: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }]
        };
        const mapElement = document.getElementById('map');
        if (mapElement) {

            return new google.maps.Map(mapElement, mapOptions1);
        }
        return null;
    }

    //init google maps
    const map = initMap();

    if (map) {



        let directionsRenderer = new google.maps.DirectionsRenderer();
        const directionsService = new google.maps.DirectionsService();



        directionsRenderer.setMap(map);

        function addMarkers(myLatLng) {
            pos1 = myLatLng;
            pos2 = myLatLng;
            
            
            
            const myMarker = new google.maps.Marker({
                position: myLatLng,
                map,
                icon: {
                    url: '/assets/img/myposa.png',
                    scaledSize: new google.maps.Size(50, 50)
                },
                title: "1st Position",
                draggable: false,
                zIndex: 99999999
            });

            google.maps.event.addListener(myMarker, 'dragend', function() {
                
                
                


                pos1 = { lat: myMarker.getPosition().lat(), lng: myMarker.getPosition().lng() }
                    //calculateAndDisplayRoute(directionsService, directionsRenderer, pos1, pos2)

            });
            markers.push(myMarker);

            const myMarker1 = new google.maps.Marker({
                position: myLatLng,
                map,
                icon: {
                    url: '/assets/img/myposb.png',
                    scaledSize: new google.maps.Size(50, 50)
                },
                title: "2nd Position",
                draggable: true,
                zIndex: 99999999
            });

            google.maps.event.addListener(myMarker1, 'dragend', function() {
                
                
                


                pos2 = { lat: myMarker1.getPosition().lat(), lng: myMarker1.getPosition().lng() }
                calculateAndDisplayRoute(directionsService, directionsRenderer, pos1, pos2)

            });
            markers.push(myMarker1);
        }


        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(13);
        addMarkers({ lat: lat, lng: lng });

        function calculateAndDisplayRoute(directionsService, directionsRenderer, posi1, posi2) {

            directionsService.route({
                    origin: posi1,
                    destination: posi2,
                    // Note that Javascript allows us to access the constant
                    // using square brackets and a string value as its
                    // "property."
                    travelMode: google.maps.TravelMode.WALKING,
                },
                (response, status) => {
                    if (status == "OK") {
                        
                        
                        
                        directionsRenderer.setDirections(response);

                        $('#attachementMap').append(`<div id="travelTime">
                          Distance:  ${response.routes[0].legs[0].distance.text}, Duration:   ${response.routes[0].legs[0].duration.text}                     
                    </div>`);
                    } else {
                        window.alert("Directions request failed due to " + status);
                    }
                }
            );
        }


        function deleteAllMarkers() {
            directionsRenderer.setMap(null);
            markers.forEach(marker => {
                marker.setMap(null);
            });

            markers = [];
            directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
        }



        //initPosts();
        $(document).on("click", "#sharePost", function(e) {
            e.preventDefault();
            $('#sharePost').attr('disabled', '');
            $('#sharePost').append(`<span id='sharePostLoader' class="loading dots"></span>`);
            if (post.type === 'm') {
                html2canvas(document.getElementById('attachementMap'), {
                    useCORS: true,
                    //                        allowTaint:true,
                    onrendered: function(canvas) {
                        
                        
                        
                        var dataURL = canvas.toDataURL();
                        
                        
                        

                        post.content = dataURL;
                        post.locations = []
                        post.locations.push(pos1.lat);
                        post.locations.push(pos1.lng);
                        post.locations.push(pos2.lat);
                        post.locations.push(pos2.lng);
                        post.text = $('#textPost').val();
                        post.userId = _id;
                        post.contentName = Date.now() + '.png';
                        post.contentType = 'image/png';

                        fetch('/add/post', {
                            credentials: 'same-origin',
                            headers: {
                                'content-type': 'application/json',
                                'authorization': 'bearer ' + token
                            },
                            method: 'POST',
                            body: JSON.stringify(post)
                        }).then(function(response) {

                            response.json().then(function(json) {
                                

                                if (json.error) {} else {
                                    $('#textPost').val('');
                                    $('#sharePost').removeAttr('disabled');
                                    $('#sharePostLoader').remove();
                                    post.type = 't';
                                    delete post.locations
                                    delete post.content;
                                    delete post.contentType;
                                    delete post.contentName;
                                    $('#attachement').html(``);
                                    $('#photoPost').val('');
                                    $('#videoPost').val('');
                                    $('#googleMaps').hide();
                                    // initPosts()

                                    location.reload();

                                }
                            });

                        });
                    }
                });
            } else {
                post.text = $('#textPost').val();
                post.userId = _id;
                if (!post.text && !post.content && !post.contentType) {
                    $('#sharePost').removeAttr('disabled');
                    $('#sharePostLoader').remove();
                    return;
                }
                fetch('/add/post', {
                    credentials: 'same-origin',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'bearer ' + token
                    },
                    method: 'POST',
                    body: JSON.stringify(post)
                }).then(function(response) {

                    response.json().then(function(json) {
                        

                        if (json.error) {} else {
                            $('#textPost').val('');
                            $('#sharePost').removeAttr('disabled');
                            $('#sharePostLoader').remove();
                            post.type = 't';
                            delete post.locations
                            delete post.content;
                            delete post.contentType;
                            delete post.contentName;
                            $('#attachement').html(``);
                            $('#photoPost').val('');
                            $('#videoPost').val('');
                            $('#googleMaps').hide();
                            // initPosts()

                            location.reload();

                        }
                    });

                });
            }



        });

        $(document).on("click", "#addPhoto", function(e) {
            e.preventDefault();
            $('#attachement').html(``);
            $('#googleMaps').hide();
            if ($('#travelTime')) {
                $('#travelTime').remove();
            }
            const myPosMap = { lat: lat, lng: lng };
            deleteAllMarkers();
            addMarkers(myPosMap);
            map.setCenter(new google.maps.LatLng(myPosMap.lat, myPosMap.lng));
            map.setZoom(13);
            delete post.locations;

            $('#photoPost').trigger('click');
        });

        $(document).on("click", "#addVideo", function(e) {
            e.preventDefault();
            $('#attachement').html(``);
            $('#googleMaps').hide();
            if ($('#travelTime')) {
                $('#travelTime').remove();
            }
            const myPosMap = { lat: lat, lng: lng };
            deleteAllMarkers();
            addMarkers(myPosMap);
            map.setCenter(new google.maps.LatLng(myPosMap.lat, myPosMap.lng));
            map.setZoom(13);
            delete post.locations;

            $('#videoPost').trigger('click');
        });

        $(document).on("click", "#addRoute", function(e) {
            e.preventDefault();
            $('#attachement').html(``);
            if ($('#googleMaps').css('display') == 'none') {
                $('#googleMaps').toggle();
                post.type = 'm';
                map.setZoom(13);
                delete post.locations
                delete post.content;
                delete post.contentType;
                delete post.contentName;


            } else {
                $('#googleMaps').toggle();
                post.type = 't';
                delete post.locations
                delete post.content;
                delete post.contentType;
                delete post.contentName;
                if ($('#travelTime')) {
                    $('#travelTime').remove();
                }
                const myPosMap = { lat: lat, lng: lng };
                deleteAllMarkers();
                addMarkers(myPosMap);
                map.setCenter(new google.maps.LatLng(myPosMap.lat, myPosMap.lng));
                map.setZoom(13);
            }
        });






        $(document).on("click", "#deleteContent", function(e) {
            e.preventDefault()
            
            
            

            $('#attachement').html(``);
            $('#photoPost').val('');
            $('#videoPost').val('');
            post.type = 't';
            delete post.content;
            delete post.contentType;
        });



        $(document).on("change", "#photoPost", function(e) {
            e.preventDefault()
            $('#attachement').html(``);
            $('#videoPost').val('');
            
            
            

            const file = e.target;
            
            
            
            if (file.files && file.files[0]) {




                if (file.files[0]['type'].split('/')[0] === 'image') {



                    const reader = new FileReader();
                    reader.onload = (function(e) {
                        $('#attachement').html(`
                    
                    <ul class="list-unstyled file-list">
                    <li><i class="fa fa-file-picture-o"></i> ${file.files[0].name}<span class="pull-right" id="deleteContent">x</span></li>
                    
                    <li>
                    <div style="background-image:url(${reader.result}); width: 100%; height: 400px; background-size: contain; background-repeat: no-repeat;background-position: center;"></div>
                    </li>
                </ul>`);
                        image = reader.result;
                        post.content = reader.result;
                        post.contentType = file.files[0]['type'];
                        post.type = 'p';
                        post.contentName = (Date.now()) + file.files[0].name;
                    });
                    reader.readAsDataURL(file.files[0]);
                } else {
                    swal({
                        title: "Warning",
                        text: "Please select an image",
                        type: "warning"
                    });
                }
            }
        });

        $(document).on("change", "#videoPost", function(e) {
            e.preventDefault();
            $('#attachement').html(``);
            $('#photoPost').val('');

            
            
            

            const file = e.target;

            
            
            
            const fileSize = file.files[0].size;
            if (fileSize <= 10485760) {
                if (file.files[0]['type'].split('/')[0] === 'video') {

                    const reader = new FileReader();
                    reader.onload = (function(e) {
                        $('#attachement').html(`
                    
                    <ul class="list-unstyled file-list">
                    <li><i class="fa fa-file-video-o"></i> ${file.files[0].name}<span class="pull-right" id="deleteContent">x</span></li>
                    <li><video style="width: 100%!important; height: 400px!important;" controls>
                    <source src="${reader.result}" type="${file.files[0]['type']}" >
                    Your browser does not support the video tag.
                  </video></li>

                    
                </ul>`);
                        post.content = reader.result;
                        post.contentType = file.files[0]['type'];
                        post.type = 'v';
                        post.contentName = (Date.now()) + file.files[0].name;
                    });
                    reader.readAsDataURL(file.files[0]);
                } else {
                    swal({
                        title: "Warning",
                        text: "Please select a video",
                        type: "warning"
                    });
                }

            }
        });

    }

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

    });

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

        const latLng = { lat: Number(loc0), lng: Number(loc1) };
        const latLng2 = { lat: Number(loc2), lng: Number(loc3) };
        const mapOptions1 = {
            zoom: 13,
            center: new google.maps.LatLng(latLng.lat, latLng.lng),
            // Style for Google Maps
            styles: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }]
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


    $(".commentForm").each(function() {

        $(this).validate({
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
    });

    $(document).on("click", "#addRequest", function(e) {
        e.preventDefault();


        fetch('/addRequest', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify({
                id: e.target.dataset.id
            })
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    if (json.data) {
                        
                        
                        
                        location.reload();
                        //$('#addRequest').replaceWith(json.data)
                    }

                }
            });

        });
    });

    $(document).on("click", "#acceptRequest", function(e) {
        e.preventDefault();


        fetch('/acceptRequest', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify({
                id: e.target.dataset.id
            })
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    if (json.data) {
                        
                        
                        
                        location.reload();
                        //$('#addRequest').replaceWith(json.data)
                    }

                }
            });

        });
    });

    $(document).on("click", "#cancelHisRequest", function(e) {
        e.preventDefault();


        fetch('/cancelHisRequest', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify({
                id: e.target.dataset.id
            })
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    if (json.data) {
                        
                        
                        
                        location.reload();
                        //$('#addRequest').replaceWith(json.data)
                    }

                }
            });

        });
    });

    $(document).on("click", "#cancelRequest", function(e) {
        e.preventDefault();


        fetch('/cancelRequest', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify({
                id: e.target.dataset.id
            })
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    if (json.data) {
                        
                        
                        
                        location.reload();
                        //$('#addRequest').replaceWith(json.data)
                    }

                }
            });

        });
    });

    $(document).on("click", "#removeFriend", function(e) {
        e.preventDefault();


        fetch('/removeFriend', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify({
                id: e.target.dataset.id
            })
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {
                    
                    
                    
                    if (json.data) {
                        
                        
                        
                        location.reload();
                        //$('#addRequest').replaceWith(json.data)
                    }

                }
            });

        });
    });


    $("#newMessageFrom").validate({
        rules: {
            userId: {
                required: true
            },
            message: {
                required: true
            }
        },
        submitHandler: function() {
            
            const user = {
                users: [$('#userId').val(), _id],
                text: $('#message').val()
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
                        $('#message').val('');
                        redirect('/messages/' + json.data);
                    }
                });
            });
        }



    });
});