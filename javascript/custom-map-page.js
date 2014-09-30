/*
 * 
 * Custom javascript for the map page
 */


var favListingsStr = "";
var favListingsArr = new Array();
// Used to save the listing
var ListingArr = new Array();
var listSess = sessionStorage.getItem("list");
var listSplit = (listSess == null || listSess == undefined || listSess == '') ? [] : listSess.split(",");
var searchSess = sessionStorage.getItem("search");
var searchSplit = (searchSess == null || searchSess == undefined || searchSess == '') ? [] : searchSess.split(",");
var address = "", mainImageLink = "", bed = "", bath = "", car = "", price = "", listing_no = "";
var latitude = "";
var longitude = "";
var distArr = new Array();
var lastItem = -1;
// Array containing the address of near properties */
var destinationArr = new Array();
// Array containing the property id of near properties in the same squence of the property location in destinationArr */
var destinationListingArr = new Array();

/* Handle the list link on the map page */
$(".list").click(function(e) {
    e.preventDefault();
    if (searchSplit.length != 0) {
        location.href = 'Listing.html?list=' + searchSplit + '' + '&for=' + 'search';
    }
    else {
        location.href = 'Listing.html';
    }
});

/* Handle the toggle of Fav button with each property */
function togglefav(myID, listing_no) {
    /*Set the class on toggle to make fav on or off*/
    if (favListingsStr.indexOf(listing_no) > -1) {
        favListingsStr = favListingsStr.replace(listing_no + ",", "");
        //Remove the listing_no from fav array
        favListingsArr.splice($.inArray(listing_no, favListingsArr), 1);
        $("#" + myID + "").favOff();
    }
    else {
        favListingsStr += listing_no + ",";
        favListingsArr.push(listing_no);
        $("#" + myID + "").favOn();
    }
    /*Populate the fav button at footer with favourite count */
    if (favListingsArr.length > 0)
        $("#spnFavCount").html(favListingsArr.length);
    else
        $("#spnFavCount").html('');
// Set the session for favourites listing
    sessionStorage.setItem("fav", favListingsArr);
    // alert(sessionStorage.getItem("fav"));
}

/* Get the class of item */
function getFavClass(listing_no) {
    var retClass = "starFav";
    var favSess = sessionStorage.getItem("fav");
    if (favSess != null && favSess != undefined && favSess != "") {
        if (favSess.indexOf(listing_no) > -1)
            retClass = "starFav starFavOn";
    }
    return retClass;
}


/* Handles the favourites class in case the user has checked the favourite after the map is visible then it makes the favourites as marked on the another clicks */
function checkFavCss(contentVal) {
    currListNo = contentVal.substring(contentVal.indexOf("?pid=") + 5, contentVal.indexOf("\"><img"));
    var currClass = getFavClass(currListNo);
    if (currClass == "starFav starFavOn" && contentVal.indexOf("starFavOn") == -1)
        contentVal = contentVal.replace("starFav", "starFavOn");
    else if (currClass == "starFav")
        contentVal = contentVal.replace("starFavOn", "starFav");
    else
        contentVal = contentVal;
    return contentVal;
}


var locationsArr = new Array();
/* Load the map on the page */
function loadmap() {
    var locations = locationsArr;
    var map = new google.maps.Map(document.getElementById('map'),
            {
                zoom: 14,
                center: new google.maps.LatLng(locations[0][1], locations[0][2]),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    for (i = 0; i < locations.length; i++) {

        marker = new google.maps.Marker({icon: new google.maps.MarkerImage('images/' + locations[i][0]), position: new google.maps.LatLng(locations[i][1], locations[i][2]), map: map});
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.open(map, marker);
                var contentVal = "";
                contentVal += locations[i][3];
                contentVal = checkFavCss(contentVal);
                infowindow.setContent(contentVal);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

$(function() {
    if ($.parseParams()) {
        var queryParams = $.parseParams(document.location.search);
    }
    bindFavSessionValues();
    mapController();
    /* Define Custom jquery function to switch on/off the fav button */
    $.fn.favOff = function() {
        return this.each(function() {
            if ($(this).hasClass('starFavOn')) {
                $(this).removeClass('starFavOn');
                $(this).addClass('starFav');
            }
        });
    };
    $.fn.favOn = function() {
        return this.each(function() {
            $(this).addClass('starFav');
            $(this).addClass('starFavOn');
        });
    };


    /* Populate the fav button with session values */
    function bindFavSessionValues() {
        var favSess = sessionStorage.getItem("fav");
        //var referrer = document.referrer;
        //alert(favSess);
        if (favSess != null && favSess != undefined && favSess != "") {
            var favSplit = favSess.split(",");
            //printArr(favSplit);
            for (var i = 0; i < favSplit.length; i++) {
                favListingsStr += favSplit[i] + ",";
            }
            favListingsArr = favSess.split(",");
            $("#spnFavCount").html(favSess.split(",").length);
        }
    }

    /* Route the request according to the url requested */
    function mapController() {
        if (getProcessedParamVal(queryParams.for ) !== "" && getProcessedParamVal(queryParams.for ) === "list") {
            if (listSplit.length == 0) {
                $("#ajaxLoader").hide();
                alert("Sorry, No property to show on the map");
                $("#mapHeading").html("Sorry, No property to show on the map");
                return false;
            }
            else {
                //Showing the prev list on map;
                funcShowPrevListPropPos();  // Share the current position to the callback function as mentioned in parameter
            }
        }
        else if (getProcessedParamVal(queryParams.for ) !== "" && getProcessedParamVal(queryParams.for ) === "property" && getProcessedParamVal(queryParams.pid) !== "") {
            //Show the property on map 
            listSplit = queryParams.pid;
            funcShowPrevListPropPos();  // Share the current position to the callback function as mentioned in parameter
        }
        else if (getProcessedParamVal(queryParams.for ) !== "" && getProcessedParamVal(queryParams.for ) === "near") {
            //Show the nearby properties on map
            getPositions(funcShowNearPropPos);  // Share the current position to the callback function as mentioned in parameter
        }
        else if (getProcessedParamVal(queryParams.for ) !== "" && getProcessedParamVal(queryParams.for ) === "nearest") {
            /* Redirect to nearest property page */
            // Share the current position to the callback function as mentioned in parameter
            getPositions(funcGetNearestPropPos);
        }
        else {
            alert("Invalid Page");
            $("#mapHeading").html("Invalid Page");
            $("#ajaxLoader").hide();
            return false;
        }
    }

    /* Share the current position to the callback function as mentioned in parameter */
    function getPositions(callbackFunc) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(callbackFunc);
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    }


    /* callback to get the near by Properties */
    function funcShowNearPropPos(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        /* latitude = -31.973061;
         longitude = 115.781987;*/
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetNearestPropLocationjs' +
                    '?propstatus=fs' +
                    '&radius=5&lati=' + latitude +
                    '&longi=' + longitude +
                    '&agency_no=14010' +
                    '&branch_no=0' + '',
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserNear,
            error: ServiceError
        });

    }

    /* Success callback for the ajax request in funcShowNearPropPos function  */
    function dataParserNear(data) {
        console.log(data);
        var lastItem = populateMap(data, 'near'); //lastItem can be used later 
        $("#ajaxLoader").hide();
        if (lastItem == -1) {
            alert("Sorry, no property is available near your location");
            $("#mapHeading").html("Sorry, no property is available near your location");
        }
        else {
            loadmap();
            var totalProp = lastItem + 1;
            if (totalProp > 1)
                propStr = " Properties";
            else
                propStr = " Property";
            headMsg = lastItem + 1 + propStr + ' for sale near you';
            $("#mapHeading").html(headMsg);
        }
    }

    /* callback to get the nearest Properties */
    function funcGetNearestPropPos(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        /* latitude = -31.973061;
         longitude = 115.781987;*/
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetNearestPropLocationjs' +
                    '?propstatus=fs' +
                    '&radius=1&lati=' + latitude +
                    '&longi=' + longitude +
                    '&agency_no=14010' +
                    '&branch_no=0' + '',
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserGetNearest,
            error: ServiceError
        });

    }


    /*
     * Success callback for the ajax request in funcShowNearPropPos function 
     * Parse the near data to get the nearest We need to get the listing number 
     * of nearest prioperty then redirect to property page
     */
    function dataParserGetNearest(data) {
        var origin = new google.maps.LatLng(latitude, longitude);
        $.each(data, function(i, item) {
            var destination = new google.maps.LatLng(item.latitude, item.longitude);
            destinationArr.push(destination);
            destinationListingArr.push(item.listing_no);
            lastItem = i;
        });

        if (lastItem == -1) {
            $("#ajaxLoader").hide();
            alert("Sorry, no property is available nearest your location in 1km distance.");
            $("#mapHeading").html("Sorry, no property is available nearest your location in 1km distance");
            return false;
        }
        else {
            getDistance(origin, destinationArr);
        }
    }



    /* Get distance between two points on map */
    function getDistance(origin, destinationArr) {
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: destinationArr,
                    travelMode: google.maps.TravelMode.DRIVING,
                    avoidHighways: false,
                    avoidTolls: false
                },
        callbackGetDistance
                );

    }

    /* Callback to get the distance . Get the distarr and sort ascendingly and then redirect to property page */
    function callbackGetDistance(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
        } else {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    distvalue = results[j].distance.value;
                    var diststr = destinationListingArr[j] + ":" + distvalue;
                    distArr.push(diststr);
                }
            }
        }


        distArr.sort(function(a, b) {
            var keyEndIndexA = a.indexOf(":") + 1; //  dist array is in the form oflisting_no:distance_value
            var keyEndIndexB = b.indexOf(":") + 1;
            return  a.substr(keyEndIndexA + 1) - b.substr(keyEndIndexB + 1);
        });

        var firstElm = distArr[0];
        var keyEndIndexFirstElm = firstElm.indexOf(":");
        var nearestPropListNo = firstElm.substr(0, keyEndIndexFirstElm);
        //Redirect to the property page
        location.href = 'Property.html?pid=' + nearestPropListNo;

    }



    /* callback to get the Properties in previous list or show a single property in the map page as mentioned in listSplit variable*/
    function funcShowPrevListPropPos() {
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetPropertiesjs?listing_no=' + listSplit + '',
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserPrevList,
            error: ServiceError
        });

    }

    /* Success callback for the ajax request in funcShowPrevListPropPos function  */
    function dataParserPrevList(data) {
        var lastItem = populateMap(data, 'list'); //lastItem can be used later 
        $("#ajaxLoader").hide();
        if (lastItem == -1) {
            alert("Sorry, No property to show on the map");
            $("#mapHeading").html("Sorry, No property to show on the map");
        }
        else {
            loadmap();
            var totalProp = lastItem + 1;
            if (totalProp > 1)
                propStr = " Properties";
            else
                propStr = " Property";
            headMsg = lastItem + 1 + propStr;
            $("#mapHeading").html(headMsg);
        }
    }


    /* Populate with Properties as passed in the data */
    function populateMap(data, mapFor) {
        var lastItem = -1;
        $.each(data, function(i, item) {
            /* We had to put the conditions as near by property service and other is returning value as different params */
            if (mapFor == 'near') {
                address = item.suburb + ',<br />' +
                        item.street;
                mainImageLink = item.MainImageLink;
                bed = getBedBathCar(item.bed, "i_bed.png", 'bed');
                bath = getBedBathCar(item.bath, "i_bath.png", 'bath');
                car = getBedBathCar(item.car, "i_car.png", 'car');
                price = getProcessedParamVal(item.price);
                listing_no = item.listing_no;
            } else {
                address = item.suburb + ',<br />' +
                        +item.street_no + ', ' + item.street_name;
                mainImageLink = item.MainImageLink;
                bed = getBedBathCar(item.bedrooms, "i_bed.png", 'bed');
                bath = getBedBathCar(item.bathrooms, "i_bath.png", 'bath');
                car = getBedBathCar(item.parking, "i_car.png", 'car');
                price = getProcessedParamVal(item.price_text);
                listing_no = item.listing_no;
            }

            var Strvalue = "";
            Strvalue += '<div class="boxMapProperty" onclick="javascript:window.location.href = \'#\'">' +
                    '<div class="iconsBB">' +
                    bed + bath + car +
                    '</div>' +
                    '<div class="starBB">' +
                    '<a href="javascript:void(0);" id="fav' + i + '" onclick="togglefav(this.id,' + listing_no + ');" title="favourite" class="' + getFavClass(item.listing_no) + '"></a>' +
                    '</div>' +
                    '<br />' +
                    '<div class="boxMapPropertyL">' +
                    '<a href="Property.html?pid=' + listing_no + '"><img src="' + mainImageLink + '" /></a>' +
                    '</div>' +
                    '<div class="boxMapPropertyR">' +
                    address +
                    '<div class="font12">From ' + price + '</div>' +
                    '</div>' +
                    '<br />' +
                    '</div>';
            var latlongArr = new Array();
            //latlongArr.push(GetMapIcon(item.propertytype));
            latlongArr.push("t_map.png");
            latlongArr.push(item.latitude);
            latlongArr.push(item.longitude);
            latlongArr.push(Strvalue);
            locationsArr.push(latlongArr);
            lastItem = i;
            ListingArr.push(item.listing_no);
        });
        return lastItem;

    }


    /* Get the number Bedroom or Bathroom or Parking of a property acording to the value passed */
    function getBedBathCar(itemValue, itemImg, altvalue) {
        if (itemValue != null && itemValue != "" && itemValue != "null")
            return itemValue + ' <img src="images/' + itemImg + '" alt="' + altvalue + '" />';
        else
            return "";
    }

    /* Error callback for the ajax requests */
    function ServiceError(xhr) {
        alert("Sorry, no properties avaliable at this time.");
        $("#mapHeading").html('Sorry, no property is available near your location');
        $("#ajaxLoader").hide();
        if (xhr.responseText) {
            var err = xhr.responseText;
            if (err)
                error(err);
            else
                error({Message: "Unknown server error."})
        }
        return;
    }

    /* Return blank string if the passed value is null or undefined else trim the passVal and return the same */
    function getProcessedParamVal(passVal) {
        if (passVal == null || passVal == "" || passVal == undefined)
            return "";
        else {
            passVal = $.trim(passVal);
            return passVal;
        }
    }

    /* Set the height of the page */
    setMapHeight();
    function setMapHeight() {
        var scrHeight = $(document).height();
        scrHeight = parseInt(scrHeight) - 110;
        scrHeight = parseInt($(window).height()) - 200;
        $(".mapParam").height(scrHeight);
    }



});