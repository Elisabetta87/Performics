$(function(){



});
var geocoder;
var map;

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.380482, lng:11.01398},
        zoom: 2,
        minZoom: 2
    });

    $.getJSON('data.json', function(result) {
            result.offices.forEach(function(office){
              //  console.log(office);
                if (!!office.address) {
                    drawMarks (office.address);
                }
            })
    });





}


function drawMarks (address) {

    geocoder.geocode({'address' : address}, function(results, status) {
        if (status == 'OK') {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            //console.log(results);
            var officeCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},
                radius: 10000
            })

            var marker = new google.maps.Marker({
                position: {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},
                map: map,
                title: 'buhh'
            });

            var contentLabel = '<div class="content-info">' + address + '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentLabel,
                maxWidth: 250
            });


            marker.addListener('mouseover', function() {
                infowindow.open(map, marker);
            });

            marker.addListener('mouseout', function() {
                infowindow.close(map, marker);
            });
        }
    });
}
