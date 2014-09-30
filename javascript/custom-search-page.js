/* 
 * Get the suburbs
 */

$(function() {

    /* check if the status is not set then default click the For sale*/
    var status = (typeof(Storage) !== "undefined") ? sessionStorage.getItem('status') : undefined;
    if (status === null || status === "" || status === undefined) {
        sessionStorage.setItem('status', 'fs');
    }

    $("#txtSuburb").click(function() {
        $("#txtSuburb").focus();
    });

    $("div.tabs ul.tabNavigation a").click(function(e) {
        //e.preventDefault();
        $('div.tabs ul.tabNavigation a').removeClass('selected');
        $(this).addClass('selected');
        switch ($(this).attr('id')) {
            case "tabFS":
                $('span.priceLabel').html('Price Range');
                setSalePriceMin();
                setSalePriceMax();
                $('.saleSpecific').show();
                $('.rentSpecific').hide();
                sessionStorage.setItem('status', 'fs');
                $("#txtSuburb").Watermark("Type in the Address / Suburb", "#47494c");
                getSuburb('fs');
                break;
            case "tabFR":
                $('span.priceLabel').html('Weekly Range');
                setRentPriceMin();
                setRentPriceMax();
                $('.rentSpecific').show();
                $('.saleSpecific').hide();
                sessionStorage.setItem('status', 'fr');
                $("#txtSuburb").Watermark("Type in the Address / Suburb", "#47494c");
                getSuburb('fr');
                break;
        }

    });
    /* Initialize the form input values and session Values with the sessionStorage Variable */
    var searchFormValues = {
        priceMin: "",
        priceMax: "",
        propType: "",
        beds: "",
        baths: "",
        parking: "",
        sortBy: "",
        status: "",
        surr: "",
        excUnderOffer: "",
        subID: "",
        subVal: "",
    };
    var sessionValues = {
        subVal: sessionStorage.getItem('subVal'),
        subID: sessionStorage.getItem('subID'),
        status: sessionStorage.getItem('status'),
        surr: sessionStorage.getItem('surr'),
        excUnderOffer: sessionStorage.getItem('excUnderOffer')
    };

    /*
     * Get the last updated session values
     */
    function getLastUpdatedsessionValues() {
        sessionValues = {
            subVal: sessionStorage.getItem('subVal'),
            subID: sessionStorage.getItem('subID'),
            status: sessionStorage.getItem('status'),
            surr: sessionStorage.getItem('surr'),
            excludeOffer: sessionStorage.getItem('excludeOffer')
        };
        return sessionValues;
    }

    /*
     * Get the suburb for the status having the properties 
     * @param string status (fs or fr)
     *
     */
    function getSuburb(status) {
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetSuburbjs?agency_no=14010' +
                    '&branch_no=0' +
                    '&propstatus=' + status,
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParser,
            error: ServiceError
        });
    }

    /* Success callback for the ajax request in getSuburb function  */
    function dataParser(data) {
        var availableTags = new Array();
        availableTags.push($.parseJSON('{"label" : "All Suburbs", "value" : "All Suburbs", "id" : "" }'));
        $(".ajaxLoaderContent").hide();
        $("#txtSuburb").show();
        $.each(data, function(i, item) {
            availableTags.push($.parseJSON('{"label": "' + item.suburb + '", "value": "' + item.suburb + '", "id": ' + item.suburb_id + '}'));
        });
        $("#txtSuburb").autocomplete({
            source: availableTags,
            appendTo: "#suburbContainer",
            change: function(event, ui) {
                if (ui.item != null) {
                    searchFormValues.subID = ui.item.id;
                    searchFormValues.subVal = ui.item.value;
                    sessionStorage.setItem('subID', searchFormValues.subID);
                    sessionStorage.setItem('subVal', searchFormValues.subVal);
                }

            },
        });
    }

    /* Error callback for the ajax requests */
    function ServiceError(xhr) {
        return;
    }


    function getSurrStatus() {
        if ($('#btnOnOffSurr').is(':checked')) {
            return "1";
        }
        else
        {
            return "0";
        }
    }


    function getExcludeOfferStatus() {
        if ($('#btnOnOffExOffer').is(':checked')) {
            return "yes";
        }
        else
        {
            return "no";
        }
    }

    function setRentPriceMin() {
        $('#ddlPriceMin').children().remove();
        $('#ddlPriceMin').append('<option value="Any">Min</option>');
        $('#ddlPriceMin').append('<option value="100">$100</option>');
        $('#ddlPriceMin').append('<option value="200">$200</option>');
        $('#ddlPriceMin').append('<option value="300">$300</option>');
        $('#ddlPriceMin').append('<option value="400">$400</option>');
        $('#ddlPriceMin').append('<option value="500">$500</option>');
        $('#ddlPriceMin').append('<option value="600">$600</option>');
        $('#ddlPriceMin').append('<option value="700">$700</option>');
        $('#ddlPriceMin').append('<option value="800">$800</option>');
        $('#ddlPriceMin').append('<option value="900">$900</option>');
        $('#ddlPriceMin').append('<option value="1000">$1000</option>');
        $('#ddlPriceMin').append('<option value="1100">$1100</option>');
        $('#ddlPriceMin').append('<option value="1200">$1200</option>');
        $('#ddlPriceMin').append('<option value="1300">$1300</option>');
        $('#ddlPriceMin').append('<option value="1400">$1400</option>');
        $('#ddlPriceMin').append('<option value="1500">$1500</option>');
        $('#ddlPriceMin').append('<option value="2000">$2000</option>');
    }

    function setRentPriceMax() {
        $('#ddlPriceMax').children().remove();
        $('#ddlPriceMax').append('<option value="Any">Max</option>');
        $('#ddlPriceMax').append('<option value="100">$100</option>');
        $('#ddlPriceMax').append('<option value="200">$200</option>');
        $('#ddlPriceMax').append('<option value="300">$300</option>');
        $('#ddlPriceMin').append('<option value="400">$400</option>');
        $('#ddlPriceMax').append('<option value="500">$500</option>');
        $('#ddlPriceMax').append('<option value="600">$600</option>');
        $('#ddlPriceMax').append('<option value="700">$700</option>');
        $('#ddlPriceMax').append('<option value="800">$800</option>');
        $('#ddlPriceMax').append('<option value="900">$900</option>');
        $('#ddlPriceMax').append('<option value="1000">$1000</option>');
        $('#ddlPriceMax').append('<option value="1100">$1100</option>');
        $('#ddlPriceMax').append('<option value="1200">$1200</option>');
        $('#ddlPriceMax').append('<option value="1300">$1300</option>');
        $('#ddlPriceMax').append('<option value="1400">$1400</option>');
        $('#ddlPriceMax').append('<option value="1500">$1500</option>');
        $('#ddlPriceMax').append('<option value="2000">$2000</option>');
        $('#ddlPriceMax').append('<option value="Any">$2000+</option>');
    }

    function setSalePriceMin() {
        $('#ddlPriceMin').children().remove();
        $('#ddlPriceMin').append('<option value="Any">Min</option>');
        $('#ddlPriceMin').append('<option value="250000">$250,000</option>');
        $('#ddlPriceMin').append('<option value="300000">$300,000</option>');
        $('#ddlPriceMin').append('<option value="450000">$450,000</option>');
        $('#ddlPriceMin').append('<option value="500000">$500,000</option>');
        $('#ddlPriceMin').append('<option value="550000">$550,000</option>');
        $('#ddlPriceMin').append('<option value="600000">$600,000</option>');
        $('#ddlPriceMin').append('<option value="650000">$650,000</option>');
        $('#ddlPriceMin').append('<option value="700000">$700,000</option>');
        $('#ddlPriceMin').append('<option value="750000">$750,000</option>');
        $('#ddlPriceMin').append('<option value="800000">$800,000</option>');
        $('#ddlPriceMin').append('<option value="850000">$850,000</option>');
        $('#ddlPriceMin').append('<option value="900000">$900,000</option>');
        $('#ddlPriceMin').append('<option value="950000">$950,000</option>');
        $('#ddlPriceMin').append('<option value="1000000">$1 mn</option>');
        $('#ddlPriceMin').append('<option value="2000000">$2 mn</option>');
        $('#ddlPriceMin').append('<option value="3000000">$3 mn</option>');
        $('#ddlPriceMin').append('<option value="5000000">$5 mn</option>');
        $('#ddlPriceMin').append('<option value="10000000">$10 mn</option>');
    }

    function setSalePriceMax() {
        $('#ddlPriceMax').children().remove();
        $('#ddlPriceMax').append('<option value="Any">Max</option>');
        $('#ddlPriceMax').append('<option value="250000">$250,000</option>');
        $('#ddlPriceMax').append('<option value="300000">$300,000</option>');
        $('#ddlPriceMax').append('<option value="450000">$450,000</option>');
        $('#ddlPriceMax').append('<option value="500000">$500,000</option>');
        $('#ddlPriceMax').append('<option value="550000">$550,000</option>');
        $('#ddlPriceMax').append('<option value="600000">$600,000</option>');
        $('#ddlPriceMax').append('<option value="650000">$650,000</option>');
        $('#ddlPriceMax').append('<option value="700000">$700,000</option>');
        $('#ddlPriceMax').append('<option value="750000">$750,000</option>');
        $('#ddlPriceMax').append('<option value="800000">$800,000</option>');
        $('#ddlPriceMax').append('<option value="850000">$850,000</option>');
        $('#ddlPriceMax').append('<option value="900000">$900,000</option>');
        $('#ddlPriceMax').append('<option value="950000">$950,000</option>');
        $('#ddlPriceMax').append('<option value="1000000">$1 mn</option>');
        $('#ddlPriceMax').append('<option value="2000000">$2 mn</option>');
        $('#ddlPriceMax').append('<option value="3000000">$3 mn</option>');
        $('#ddlPriceMax').append('<option value="5000000">$5 mn</option>');
        $('#ddlPriceMax').append('<option value="10000000">$10 mn</option>');
    }

    function SearchClick() {

        if ($("#txtSuburb").val() !== "") {
            if ($("#txtSuburb").val() === "Type in the Address / Suburb") {
                searchFormValues.subID = "";
                searchFormValues.subVal = "All Suburbs";
                sessionStorage.setItem('subID', "");
                sessionStorage.setItem('subVal', "All Suburbs");
            }
            if ($("#txtSuburb").val().toUpperCase() !== sessionStorage.getItem("subVal").toUpperCase() && $("#txtSuburb").val() !== "Type in the Address / Suburb") {
                alert("Please select a valid suburb");
                $("#txtSuburb").val("");
                $("#txtSuburb").Watermark("Type in the Address / Suburb", "#47494c");
                return false;
            }
            searchFormValues.priceMin = $("#ddlPriceMin").val();
            searchFormValues.priceMax = $("#ddlPriceMax").val();
            searchFormValues.propType = $("#ddlPropType").val();
            searchFormValues.beds = $("#ddlBedroom").val();
            searchFormValues.baths = $("#ddlBathroom").val();
            searchFormValues.parking = $("#ddlParking").val();
            searchFormValues.sortBy = $("#ddlSort").val();
            searchFormValues.status = sessionStorage.getItem("status");
            searchFormValues.surr = getSurrStatus();
            searchFormValues.excUnderOffer = getExcludeOfferStatus();

            if (sessionStorage.getItem('status') == 'fs')
                location.href = 'Listing.html?st=' + searchFormValues.status + '&subId=' + sessionStorage.getItem("subID") + '&subName=' + sessionStorage.getItem("subVal") + '&pl=' + searchFormValues.priceMin + '&ph=' + searchFormValues.priceMax + '&type=' + searchFormValues.propType + '&bed=' + searchFormValues.beds + '&bath=' + searchFormValues.baths + '&park=' + searchFormValues.parking + '&sort=' + searchFormValues.sortBy + '&surr=' + searchFormValues.surr + '&excOffer=' + searchFormValues.excUnderOffer + '';
            else if (sessionStorage.getItem('status') == 'fr') {
                location.href = 'Listing.html?st=' + searchFormValues.status + '&subId=' + sessionStorage.getItem("subID") + '&subName=' + sessionStorage.getItem("subVal") + '&pl=' + searchFormValues.priceMin + '&ph=' + searchFormValues.priceMax + '&type=' + searchFormValues.propType + '&bed=' + searchFormValues.beds + '&bath=' + searchFormValues.baths + '&park=' + searchFormValues.parking + '&sort=' + searchFormValues.sortBy + '&surr=' + searchFormValues.surr + '';
            }
        }
        else {
            alert("Please select a suburb");
        }
    }

    function bindSessionValues() {
        //comment below single line once the project is complete
        sessionValues = getLastUpdatedsessionValues();
        /*if (sessionValues.subID == null || sessionValues.subID == "" || sessionValues.subID == undefined) {
         $("#txtSuburb").Watermark("Type in the Address / Suburb", "#47494c");
         }
         
         else if (sessionValues.subVal != null || sessionValues.subVal != "" || sessionValues.subVal != undefined)
         document.getElementById("txtSuburb").value = sessionValues.subVal;*/
        if (sessionValues.status != null || sessionValues.status != "" || sessionValues.status != undefined) {
            if (sessionValues.status == "fs") {
                $('div.tabs ul.tabNavigation a#tabFS').click();

            }
            else if (sessionValues.status == "fr") {
                $('div.tabs ul.tabNavigation a#tabFR').click();
            }

        }
// surrounding suburb
        if (sessionValues.surr !== null || sessionValues.surr !== "" || sessionValues.surr !== undefined) {
            if (sessionValues.surr === "1")
                $('#btnOnOffSurr').attr('checked', 'checked');
            else
                $('#btnOnOffSurr').removeAttr('checked');
        }
// Exclude under offer
        if (sessionValues.excUnderOffer !== null || sessionValues.excUnderOffer !== "" || sessionValues.excUnderOffer !== undefined) {
            if (sessionValues.excUnderOffer === "yes")
                $('#btnOnOffExOffer').attr('checked', 'checked');
            else
                $('#btnOnOffExOffer').removeAttr('checked');
        }
    }


// Call the method to get suburb
    //getSuburb(sessionValues.status);
    bindSessionValues();

    $("#SearchIndex").click(function(e) {
        e.preventDefault();
        SearchClick();
    });
    $("#btnOnOffSurr").click(function(e) {
        if ($('#btnOnOffSurr').is(':checked')) {
            sessionStorage.setItem("surr", "1");
        }
        else
        {
            sessionStorage.setItem("surr", "0");
        }

    });
    $("#btnOnOffExOffer").click(function(e) {
        if ($('#btnOnOffExOffer').is(':checked')) {
            sessionStorage.setItem("excUnderOffer", "yes");
        }
        else
        {
            sessionStorage.setItem("excUnderOffer", "no");
        }
    });

    $("#btnReset").click(function(e) {
        e.preventDefault();
        $("#txtSuburb").val("");
        $("#txtSuburb").Watermark("Type in the Address / Suburb", "#47494c");
        $("#ddlPriceMin").val("Any");
        $("#ddlPriceMax").val("Any");
        $("#ddlPropType").val("Any");
        $("#ddlBedroom").val("Any");
        $("#ddlBathroom").val("Any");
        $("#ddlParking").val("Any");
        $("#btnOnOffSurr").prop('checked', false);
        $("#btnOnOffExOffer").prop('checked', false);
        $("#ddlSort").val("recent");
        sessionStorage.setItem('subID', '');
        sessionStorage.setItem('subVal', '');
    });

    $("#btnCancel").click(function(e) {
        e.preventDefault();
        location.href = 'index.html';
    });



});
