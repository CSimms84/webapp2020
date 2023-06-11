$(document).ready(function() {

    $(document).on("click", "#logout-btn", function(e) {
        
        e.preventDefault();
        const token = $.cookie("token");
        

        fetch('/logout', {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + token
            },
            method: 'POST'
        }).then(function(response) {

            response.json().then(function(json) {
                

                if (json.error) {} else {


                    $.removeCookie("token", {
                        path: '/',
                        expires: 90
                    });
                    $.removeCookie("_id", {
                        path: '/',
                        expires: 90
                    });

                    $.removeCookie("username", {
                        path: '/',
                        expires: 90
                    });

                    $.removeCookie("lat", {
                        path: '/',
                        expires: 90
                    });

                    $.removeCookie("lng", {
                        path: '/',
                        expires: 90
                    });

                    redirect(window.location.origin + window.location.pathname);
                }
            });

        });
    });

});

function redirect(url) {
    let element = document.createElement('a');
    element.setAttribute('href', url);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}