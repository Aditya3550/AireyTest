
var favListingsStr = "";
var favListingsArr = new Array();
var ListingArr = new Array();
var homeOpen = "";



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

/* Handle the toggle of Fav button with each property  on Fav Listing*/
function togglefavInFavPage(myID, listing_no) {
    /*Set the class on toggle to make fav on or off*/
    if (favListingsStr.indexOf(listing_no) > -1) {
        favListingsStr = favListingsStr.replace(listing_no + ",", "");
        //Remove the listing_no from fav array
        favListingsArr.splice($.inArray(listing_no, favListingsArr), 1);
        $("#" + myID + "").closest('.PropBox').hide();
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

$(function() {
    bindFavSessionValues();
    if ($.parseParams) {
        var queryParams = $.parseParams(document.location.search);
    }
    listingController();
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
    function listingController() {
        if (getProcessedParamVal(queryParams.list) !== "") {
            //Showing lists by Id;
            getListings();
        }
        else if (getProcessedParamVal(queryParams.subID) === "" && getProcessedParamVal(queryParams.ho) !== "") {
            //In Home Open Listing
            getHomeOpenListings();
        }
        else {
            // In search Listing;
            getSearchListings();
        }
    }

    /* Get the listings for the search criteria */
    function getSearchListings() {
        // set initial value
        if (queryParams.st == "" || queryParams.st == undefined)
            queryParams.st = sessionStorage.getItem("status");
        if (queryParams.pgno == "" || queryParams.pgno == undefined)
            queryParams.pgno = "0";
        if (queryParams.propCat == "" || queryParams.propCat == undefined)
            queryParams.propCat = "";
        if (queryParams.subId == "" || queryParams.subId == undefined)
            queryParams.subId = sessionStorage.getItem("subID");
        if (queryParams.subName == "" || queryParams.subName == undefined)
            queryParams.subName = sessionStorage.getItem("subVal");
        if (queryParams.surr == "" || queryParams.surr == undefined)
            queryParams.surr = sessionStorage.getItem("surr");
        if (queryParams.ho == "" || queryParams.ho == undefined)
            queryParams.ho = "False";
        if (queryParams.st == null || queryParams.st == "" || queryParams.st == undefined) {
            window.location = './Search.html';
        }


        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetPropertiesjs' +
                    '?pageSize=1000' +
                    '&agency_no=14010' +
                    '&branch_no=0' +
                    '&pagenumber=' + queryParams.pgno +
                    '&propertycategory=' + queryParams.propCat +
                    '&propstatus=' + getProcessedParamVal(queryParams.st) +
                    '&suburbids=' + getProcessedParamVal(queryParams.subId) +
                    '&fromprice=' + getProcessedParamVal(queryParams.pl) +
                    '&toprice=' + getProcessedParamVal(queryParams.ph) +
                    '&propertytypes=' + getProcessedParamVal(queryParams.type) +
                    '&NumbedroomFrom=' + getProcessedParamVal(queryParams.bed) +
                    '&NumbathroomFrom=' + getProcessedParamVal(queryParams.bath) +
                    '&NumgarageFrom=' + getProcessedParamVal(queryParams.park) +
                    '&sortedby=' + getProcessedParamVal(queryParams.sort) +
                    '&surr=' + getProcessedParamVal(queryParams.surr) +
                    '&excUnderOffer=' + getProcessedParamVal(queryParams.excOffer) +
                    '&hashomeopen=' + getProcessedParamVal(queryParams.ho)
                    ,
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserSearch,
            error: ServiceError
        });
    }

    /* Success callback for the ajax request in  getSearchListings function  */
    function dataParserSearch(data) {
        var lastItem = populateListings(data, 'search');
        $("#ajaxLoader").hide();
        var headMsg = getHeadMsg(lastItem);
        $("#listingHeading").html(headMsg);
    }


    /* Get the Home Open listings */
    function getHomeOpenListings() {
        if (queryParams.list != "") {
            $.ajax({
                url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetPropertiesjs' +
                        '?pageSize=1000' +
                        '&agency_no=14010' +
                        '&branch_no=0' +
                        '&propstatus=' + getProcessedParamVal(queryParams.st) +
                        '&hashomeopen=' + getProcessedParamVal(queryParams.ho),
                dataType: 'jsonp',
                jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
                success: dataParserHomeOpen,
                error: ServiceError
            });
        }

    }

    /* Success callback for the ajax request in  getHomeOpenListings function  */
    function dataParserHomeOpen(data) {
        var lastItem = populateListings(data, 'homeopen'); //lastItem can be used later 
        $("#ajaxLoader").hide();
        if (lastItem == -1) {
            alert("Sorry, No Property has home open.")
            $("#listingHeading").html('Sorry, No Property has home open');
            return false;
        }
        homeOpen = " Home Open ";
        var headMsg = getHeadMsg(lastItem);
        $("#listingHeading").html(headMsg);
    }

    /* Get the property listings by list id */
    function getListings() {
        if (queryParams.list != "") {
            $.ajax({
                url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetPropertiesjs?listing_no=' + queryParams.list + '',
                dataType: 'jsonp',
                jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
                success: dataParserList,
                error: ServiceError
            });
        }

    }

    /* Success callback for the ajax request in  getListings function  */
    function dataParserList(data) {
        if (queryParams.for == null || queryParams.for == undefined || queryParams.for == '') {
            var lastItem = populateListings(data, 'fav'); //lastItem can be used later 
            $("#ajaxLoader").hide();
            $("#listingHeading").html('Favourites');
        }
        else if (getProcessedParamVal(queryParams.for ) == 'search') {//Handling the List link on the map page
            var lastItem = populateListings(data, 'searchlist'); //lastItem can be used later 
            $("#ajaxLoader").hide();
            var headMsg = getHeadMsg(lastItem);
            $("#listingHeading").html(headMsg);
        }
        else {

        }
    }


    /* Populate with Properties as passed in the data */
    function populateListings(data, dataFor) {
        var lastItem = -1;
        //We need to put the conditions as on favourite listing click on fav behave differently than the other listings */
        if (dataFor == "fav") {
            $.each(data, function(i, item) {
                $(".main").append('' +
                        '<div class="PropBox clearfix">' +
                        '<div class="third"><a href="Property.html?pid=' + item.listing_no + '"><img src="' + item.MainImageLink + '" /></a></div>' +
                        '<div class="two-third"><div class="halfAddress"><h3>' + item.suburb + '</h3></div>' +
                        '<div class="halfPrice"><h3>' + item.price_text + '</h3></div><br/>' +
                        '<a href="Property.html?pid=' + item.listing_no + '"><span class="font12">' + getUnitNo(item.unit_no) + item.street_no + ' ' + item.street_name + '</span></a>' +
                        '<br /><div class="iconsBB">' + getBedBathCar(item.bedrooms, "i_bed.png", 'bed') + getBedBathCar(item.bathrooms, "i_bath.png", 'bath') + getBedBathCar(item.parking, "i_car.png", 'car') + '</div>' +
                        '<div class="starBB"><a href="javascript:void(0);" id="fav' + i + '" onclick="togglefavInFavPage(this.id,' + item.listing_no + ');" title="favourite" class="' + getFavClass(item.listing_no) + '"></a></div>' +
                        '<br/><div class="inspectTime">' + getHomeOpenDetails(item.home_open_date, item.home_open_text) + '</div>' +
                        '</div></div>' + ''
                        );
                ListingArr.push(item.listing_no);
                lastItem = i;
            });
        }
        else {
            $.each(data, function(i, item) {
                $(".main").append('' +
                        '<div class="PropBox clearfix">' +
                        '<div class="third"><a href="Property.html?pid=' + item.listing_no + '"><img src="' + item.MainImageLink + '" /></a></div>' +
                        '<div class="two-third"><div class="halfAddress"><h3>' + item.suburb + '</h3></div>' +
                        '<div class="halfPrice"><h3>' + item.price_text + '</h3></div><br/>' +
                        '<a href="Property.html?pid=' + item.listing_no + '"><span class="font12">' + getUnitNo(item.unit_no) + item.street_no + ' ' + item.street_name + '</span></a>' +
                        '<br /><div class="iconsBB">' + getBedBathCar(item.bedrooms, "i_bed.png", 'bed') + getBedBathCar(item.bathrooms, "i_bath.png", 'bath') + getBedBathCar(item.parking, "i_car.png", 'car') + '</div>' +
                        '<div class="starBB"><a href="javascript:void(0);" id="fav' + i + '" onclick="togglefav(this.id,' + item.listing_no + ');" title="favourite" class="' + getFavClass(item.listing_no) + '"></a></div>' +
                        '<br/><div class="inspectTime">' + getHomeOpenDetails(item.home_open_date, item.home_open_text) + '</div>' +
                        '</div></div>' + ''
                        );
                ListingArr.push(item.listing_no);
                lastItem = i;
            });
        }
        sessionStorage.setItem('list', ListingArr);
        if (dataFor === 'search') {
            sessionStorage.setItem('search', ListingArr);
        }
        return lastItem;
    }

    /**
     * Get the Home Open details . Helper function for the dataParserProperty
     * @param string home_open_date
     * @param string home_open_text
     * @returns string
     */
    function getHomeOpenDetails(home_open_date, home_open_text) {
        if ($.trim(home_open_date) != "") {
            var inspectArr = home_open_date.split(",");
            var inspectStr = "";
            for (var i = 0; i < inspectArr.length; i++) {
//                     //alert($.format.date("2009-12-18 10:54:50.546", "Test: dd/MM/yyyy"));
                inspectArr[i] = inspectArr[i].substring(0, inspectArr[i].indexOf("00"));
                inspectStr += inspectArr[i];
                if (i !== inspectArr.length - 1)
                    inspectStr += ', ';
            }
            return "Home Open : " + inspectStr + " - " + home_open_text;
        }
        else {
            return "";
        }
    }

    /* Get processed Param value */
    function getProcessedParamVal(passVal) {
        if (passVal == null || passVal == "" || passVal == undefined)
            return "";
        else {
            passVal = $.trim(passVal);
            return passVal;
        }
    }

    /** 
     * Get the head message
     * @param integer lastItem
     * @returns String
     */
    function getHeadMsg(lastItem) {
        var headMsg = "";
        var homeType = "";
        var totalProp = lastItem + 1;
        var propStr = "";
        var subNameStr = " in All Suburbs";
        if (totalProp > 1)
            propStr = " Properties";
        else
            propStr = " Property";
        if (totalProp == 0) {
            headMsg = "No Property found";
        }
        else if (getProcessedParamVal(queryParams.st) != "") {
            if (getProcessedParamVal(queryParams.subName) != "") {
                var subName = queryParams.subName.replace(/\%20/g, ' ');
                var subNameStr = " in " + subName;
            }
            if (queryParams.st == "fs" || queryParams.st == "sa")
                homeType = propStr + " For Sale";
            else if (queryParams.st == "fr" || queryParams.st == "ra")
                homeType = propStr + " For Rent";
            if (queryParams.surr == 1)
                headMsg = totalProp + homeOpen + homeType + subNameStr + " and it's surrounding";
            else
                headMsg = totalProp + homeOpen + homeType + subNameStr;
        }
        else {
            headMsg = totalProp + homeOpen + propStr;
        }
        return headMsg;

    }


    /* Get the number Bedroom or Bathroom or Parking of a property acording to the value passed */
    function getBedBathCar(itemValue, itemImg, altvalue) {
        if (itemValue != null && itemValue != "" && itemValue != "null")
            return itemValue + ' <img src="images/' + itemImg + '" alt="' + altvalue + '" />';
        else
            return "";
    }

    /* Get the Unit No*/
    function getUnitNo(itemValue) {
        if (itemValue != null && itemValue != "" && itemValue != "null")
            return itemValue + '/';
        else
            return "";
    }



    /* Error callback for the ajax requests */
    function ServiceError(xhr) {
        alert(xhr.responseText);
        if (xhr.responseText) {
            var err = xhr.responseText;
            if (err)
                error(err);
            else
                error({Message: "Unknown server error."})
        }
        return;
    }





    /*  function getFavClass(listing_no) {
     var retClass = "starFav";
     var favSess = sessionStorage.getItem("fav");
     if (favSess != null && favSess != undefined && favSess != "") {
     if (favSess.indexOf(listing_no) > -1)
     retClass = "starFavOn";
     }
     return retClass;
     }*/

});
