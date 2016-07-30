$(function(){



});
var geocoder;
var map;
var imageMarker;

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.380482, lng:11.01398},
        zoom: 2,
        minZoom: 2,
        disableDefaultUI: true,
        zoomControl: true
    });

    $.getJSON('data.json', function(result) {
            for (var i=0; i<result.offices.length; i++) {
                $("#overlayer").removeClass("hidden");
                getGeoCode(result.offices[i].address, result.offices.length, result.offices[i].city);
            }
    });

    imageMarker = {
        url : 'style/MapMarker_Bubble_Pink.png',
        size : new google.maps.Size(48, 48),
        origin: new google.maps.Point(0, 0)
    };

    var loader = document.getElementById("overlayer");
    var mapNode = document.getElementById("map");
    mapNode.appendChild(loader);


}

function getRadiusControllerEl() {

    var el = document.createElement('div');
    var minRadius = 1;
    var maxRadius = 100;
    el.setAttribute('id', 'controllerContainer');

    var html = '<div class="row">';
    html += '<div class="col-xs-12">';
    html += '<div class="row"><div class="col-xs-12">';
    html += '<h4>Radius controller</h4>';
    html += '<div class="dist-container">';
    html += '<span class="min range-value">min '+((minRadius*radius)/1000)+'km </span>';
    html += '<span class="current range-value">'+((minRadius*radius)/1000)+'km </span>';
    html += '<span class="max range-value">max '+((maxRadius*radius)/1000)+'km </span>';
    html += '</div>';
    html += '<input id="radiusRange" name="radiusRange" value="1" type="range" min="'+minRadius+'" max="'+maxRadius+'"/>';
    html += '</div></div>';
    html += '<div class="row"><div class="col-xs-8">';
    html += '<select id="offices" class="form-control"><option value="">Select city</option>';

    arrOffice.forEach(function(office, i){
        html += '<option value="' + i + '">' + office.city + '</option>';
    });

    html += '</select></div>';
    html += '<div class="col-xs-4 reset-container"><button class="btn btn-default" id="resetAll">Reset all</button></div></div>';
    html += '</div></div>';//closed col row

    el.innerHTML = html;

    el.getElementsByTagName('input')[0].addEventListener("change", function(ev){
        setCirlceByUsingRange($(this), $("#offices"));
    });

    el.getElementsByTagName('input')[0].addEventListener("input", function(ev){
        setCirlceByUsingRange($(this), $("#offices"));
    });


    el.getElementsByTagName('select')[0].addEventListener("change", function(ev) {
        setCirlceByUsingRange($("#radiusRange"), $(this));
    });


    el.getElementsByTagName('button')[0].addEventListener("click", function () {
        $('#radiusRange').val(minRadius);
        for (var i=0; i < arrOffice.length; i++) {
            arrOffice[i].circle.setRadius(radius);
        }
    });

    return el;

}


function setCirlceByUsingRange(rangeEl, select){

    var currentKm = parseInt(rangeEl.val(),10)*radius;
    $(".current.range-value").html((currentKm/1000)+"km");

    if (select.val() != "") {
        arrOffice[select.val()].circle.setRadius(currentKm);
    }
}


var arrInfoWindow = new Array();
var arrMarkers = new Array();
var arrOffice = new Array();
var counter = 0;
var radius = 10000;

function getGeoCode (address, numberOffices, city) {
    geocoder.geocode({'address' : address}, function(results, status) {
        //console.log(counter, status);
        if (status == 'OK') {
            counter++;
            drawMarks(results[0].geometry.location, address, city);
        }
        else{
            if ( status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
                //console.log(address);
                setTimeout(function(){
                    getGeoCode(address, numberOffices, city);
                }, 500);
            }
            else{
                console.log(address, status);
                counter++;
            }

        }

        $(".progress-bar span").css("margin-left", (-100+(counter*100/numberOffices))+"%");
        if(counter == numberOffices){
            setTimeout(function(){ $("#overlayer").addClass("hidden"); }, 1000);
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(getRadiusControllerEl());
        }

    });
}




function drawMarks(position, address, city){
    //console.log(city);
    var officeCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        editable: false,
        center: {lat: position.lat(), lng: position.lng()},
        radius: radius
    });

    arrOffice.push({circle: officeCircle, city: city});

    var marker = new google.maps.Marker({
        position: {lat: position.lat(), lng: position.lng()},
        map: map,
        icon : imageMarker
    });
    arrMarkers.push(marker);

    var contentLabel = '<div class="content-info"><h5>'+ city +'</h5><p>'+ address +'</p></div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentLabel,
        maxWidth: 250
    });
    arrInfoWindow.push(infowindow);


    marker.addListener('mouseover', function() {
        arrInfoWindow.forEach(function(infoW,i){ infoW.close(map); });
        infowindow.open(map, marker);
    });

    marker.addListener('mouseout', function() {
        infowindow.close(map, marker);
    });



}
