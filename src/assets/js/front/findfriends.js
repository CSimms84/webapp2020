$(document).ready(function() {
    //page js

    const token = $.cookie("token");
    const _id = $.cookie("_id");
    const lat = Number($.cookie("lat"));
    const lng = Number($.cookie("lng"));
    let filter = {};
    filter.id = _id;
    filter.radius = 0;
    $('#radiusContainer').hide();

    let pos;
    let isMyPos = false;
    let selectedPos;

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
        return new google.maps.Map(mapElement, mapOptions1);
    }

    //init google maps
    const map = initMap();
    let markers = [];
    let circle;

    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(13);

    const myPosMap = { lat: lat, lng: lng }
    addMyPostion(myPosMap)
    filter.lat = lat;
    filter.long = lng;

    function addMyPostion(myPostion) {

        const myMarker = new google.maps.Marker({
            position: myPostion,
            map,
            icon: {
                url: '/assets/img/mypos.png',
                scaledSize: new google.maps.Size(25, 25),
                labelOrigin: new google.maps.Point(15, 25)
            },
            label: {
                text: 'My position',
                color: "black",
                fontWeight: "bold",
                fontSize: "12px"
            },
            title: "My Position",
            draggable: false
        });
    }

    getNearByUsersByZip(filter)

    function addUserMarker(user) {

        if (user.profile && user.profile.location && user.profile.location.coordinates && user.profile.location.coordinates.length) {



            const latLngUsers = { lat: user.profile.location.coordinates[0], lng: user.profile.location.coordinates[1] }

            let contentString = `
            <h3 style=" text-align: center; "> <a href="/profile/${user.username}">${user.profile.speed} / ${user.profile.time}</a></h3>
            <div> <a href="/profile/${user.username}"><img src="${user.profile.picture}" height="100" width="100"></a></div>
            <div>
            Name: <a href="/profile/${user.username}">${user.profile.name}</a>
            </div>
            `;



            if (user.distance) {
                contentString = contentString + `
                <p>
                Distance: ${Number(user.distance).toFixed(2)} KM
                </p>
                `
            }
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            const marker = new google.maps.Marker({
                position: latLngUsers,
                map,
                title: user.profile.name,
                icon: {
                    url: '/assets/img/nothing.png',
                    scaledSize: new google.maps.Size(45, 20),
                    labelOrigin: new google.maps.Point(22, 9)
                },
                label: {
                    text: user.profile.speed + "/" + user.profile.time,
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "16px"
                },
                zIndex: 99999999
            });


            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });
            markers.push(marker);

        }
    }



    function deleteAllMarkers() {
        markers.forEach(marker => {
            marker.setMap(null);
        });

        markers = [];
    }

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $(document).on("ifChanged", "#myfriend", function(e) {
        e.preventDefault();
        if ($('#myfriend').is(':checked')) {


            filter.friendsOnly = true;
        } else {
            filter.friendsOnly = false;
        }
        selectUsers(filter)
    });

    function selectUsers(fff) {
        if ($('#byradius').is(':checked')) {
            getNearByUsers(fff)
        } else {
            getNearByUsersByZip(fff)
        }
    }

    $(document).on("change", "#byName", function(e) {
        e.preventDefault();
        const value = $('#byName').val();
        if (value == '') {
            delete filter.search;
        } else {
            filter.search = value;
        }

        if ($('#byradius').is(':checked')) {
            getNearByUsers(filter)
        } else {
            getNearByUsersByZip(filter)
        }
    });

    $(document).on("change", "#bySpeed", function(e) {
        e.preventDefault();
        const value = $('#bySpeed').val();
        if (value == '') {
            delete filter.speed;
        } else {
            filter.speed = value;
        }

        if ($('#byradius').is(':checked')) {
            getNearByUsers(filter)
        } else {
            getNearByUsersByZip(filter)
        }
    });

    $(document).on("change", "#byTime", function(e) {
        e.preventDefault();
        const value = $('#byTime').val();
        if (value == '') {
            delete filter.time;
        } else {
            filter.time = value;
        }

        if ($('#byradius').is(':checked')) {
            getNearByUsers(filter)
        } else {
            getNearByUsersByZip(filter)
        }
    });

    $(document).on("change", "#byZip", function(e) {
        e.preventDefault();
        const value = $('#byZip').val();
        if (value == '') {
            delete filter.zipcode;
        } else {
            filter.zipcode = value;
        }

        if ($('#byradius').is(':checked')) {
            getNearByUsers(filter)
        } else {
            getNearByUsersByZip(filter)
        }
    });

    function getNearByUsers(filter) {
        fetch('/getNearByUsers', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(filter)
        }).then(function(response) {

            response.json().then(function(json) {


                if (json.error) {} else {
                    const myPosMap = { lat: filter.lat, lng: filter.long }



                    let data = [];
                    if (json.data && json.data.length) {
                        data = json.data
                    }
                    deleteAllMarkers();
                    data.forEach(user => {
                        addUserMarker(user);
                    });
                    //  initMap(myPosMap, filter.radius, data);
                    addUsers(data);
                }
            });

        });


    }

    function getNearByUsersByZip(filter) {
        fetch('/getNearByUsersByZip', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST',
            body: JSON.stringify(filter)
        }).then(function(response) {

            response.json().then(function(json) {


                if (json.error) {} else {
                    const myPosMap = { lat: filter.lat, lng: filter.long }
                    let data = [];
                    if (json.data && json.data.length) {
                        data = json.data
                    }
                    deleteAllMarkers();
                    data.forEach(user => {
                        addUserMarker(user);
                    });
                    addUsers(data);
                }
            });

        });
    }

    function addUsers(users) {
        $("#users").html(``);



        if (users && users.length) {
            users.forEach(element => {
                let user = `
                <div class="ibox-content">
                    <div class="row">
                        <div class="col-md-2 photoProfile">
                           <a href="/profile/${element.username}"> <img src="${element.profile.picture}" alt="" height="100" width="100"></a>
                        </div>
    
                        <div class="col-md-10">
                            <small class="stats-label">Name</small>
                            <h4><a href="/profile/${element.username}">${element.profile.name}</a></h4>
                            `

                user = user + `   <div>
                            <small class="stats-label">Level: Speed/Time</small>
                            <h4>${element.profile?.speed ? element.profile?.speed:0}/ ${element.profile?.time ? element.profile?.time : 0}</h4>
                        </div>`;

                if (element.distance) {
                    user = user + `   <div>
                                <small class="stats-label">Distance</small>
                                <h4>${Number(element.distance).toFixed(2)} KM</h4>
                            </div>`;
                }


                user = user + `  </div>
                        </div>
                    </div>`;
                $("#users").append(user);

            });
        } else {

            $("#users").append(`<div class="ibox-content">
            <div class="row">
            <h1 style="text-align: center;width: 100%;color: #a6a6a6;">No user</h1>
            </div>
            </div>`);
        }

    }



});