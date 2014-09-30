/** 
 * For the property page
 */

function showFullDesc() {
    $("#publicDescShort").hide();
    $("#publicDesc").show();
}
function showLessDesc() {
    $("#publicDescShort").show();
    $("#publicDesc").hide();
}

$(function() {
    /* Get the params */
    if ($.parseParams) {
        var queryParams = $.parseParams(document.location.search);
    }

    /* We need to set the position as absolute as fixed footer diturb the form filling */
    $('.footerInner').css({
        'position': 'absolute',
    });

    var emailParams = {
        to: "",
        from: "",
        subject: "",
        body: "",
        success: ""
    }


    var realtor_no = "";
    var agentEmail = ""
    var fullAddresss = "";
    var shareLink = "http://m.reiwa.com.au/property.aspx?pid=" + queryParams.pid + "&flag=1&ty=sr";
    setWaterMark();
    getPropertyData();

    function setWaterMark() {
        $("#txtNameF").Watermark("Friend Name", "#47494c");
        $("#txtEmailF").Watermark("Friend Email Address", "#47494c");
        $("#txtName1").Watermark("Your Name", "#47494c");
        $("#txtEmail1").Watermark("Your Email Address", "#47494c");
        $("#txtEnquiry1").Watermark("Your Comments", "#47494c");
        $("#txtName").Watermark("Name", "#47494c");
        $("#txtEmail").Watermark("E-mail", "#47494c");
        $("#txtEnquiry").Watermark("Message", "#47494c");
    }

    $("#shareEF").click(function(event) {
        event.preventDefault();
        $(this).hide("5000", function() {
            $("#shareEFDiv").slideDown("slow");
        });
    });
    $("#shareEF1").click(function() {
        $("#shareEFDiv").slideUp("slow", function() {
            $("#shareEF").show();
        });
    });


    /* View the property on map */
    $(".map").click(function(e) {
        e.preventDefault();
        if (getProcessedParamVal(queryParams.pid) !== "") {
            location.href = 'Map.html?for=property' + '&pid=' + queryParams.pid;
        }

    });

    $(".share_facebook").click(function() {
        window.open("http://www.facebook.com/sharer.php?u=" + shareLink + "", '_system');
    });
    $(".share_twitter").click(function() {
        window.open("https://twitter.com/share?url=" + shareLink + "", '_system');
    });


    /* Handle the Share with friend request */
    $("#btnShare").click(function() {
        if (validateForm("txtNameF", "Friend Name") && validateForm("txtEmailF", "Friend Email Address") && isValidEmailAddress("txtEmailF") && validateForm("txtName1", "Your Name") && validateForm("txtEmail1", "Your Email Address") && isValidEmailAddress("txtEmail1") && validateForm("txtEnquiry1", "Your Comments")) {
            emailParams.to = $("#txtEmailF").val();
            emailParams.from = $("#txtEmail1").val();
            emailParams.subject = "Have you seen " + fullAddresss + " on airey.com.au";
            emailParams.body = "Hi " + $("#txtNameF").val() + "," + "<br/><br/>"
                    + "" + $("#txtEnquiry1").val().replace("\n", "<br />") + "<br/><br/>"
                    + "Property Url: " + encodeURIComponent(shareLink)
                    + "<br/><br/>" + "Regards,"
                    + "<br/>" + "" + $("#txtName1").val();
            emailParams.success = "Property is shared to your friend.";
            sendEmail(emailParams);
        }
        else
            return false;
    });

    /* Handle the send Enquiry request */
    $("#btnSendEnq").click(function() {
        if (validateForm("txtName", "Name") && validateForm("txtEmail", "E-mail") && isValidEmailAddress("txtEmail") && validateForm("txtEnquiry", "Message")) {
            emailParams.to = agentEmail;
            emailParams.from = $("#txtEmail").val();
            emailParams.subject = "I saw your property on airey app . The Property ID is " + listing_no;
            emailParams.body = $("#txtEnquiry").val();
            emailParams.body = emailParams.body.replace("\n", "<br />") +
                    "<br/><br/>" +
                    "Property Url: " + encodeURIComponent(shareLink) +
                    "<br/><br/>" + "Regards," +
                    "<br/>" +
                    "" + $("#txtName").val();
            emailParams.success = "Thanks for sending enquiry. We will contact you soon.";
            sendEmail(emailParams);
        }
        else
            return false;
    });

    /* Validate the Form  */
    function validateForm(ctrlName, defaultVal) {
        if ($("#" + ctrlName + "").val() == "" || $("#" + ctrlName + "").val() == defaultVal) {
            alert("Please enter " + defaultVal + "");
            $("#" + ctrlName + "").focus();
            return false;
        }
        return true;
    }

    /* Validate the Email  */
    function isValidEmailAddress(ctrlName) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        $('#txtEmailF').val()
        if (pattern.test($("#" + ctrlName + "").val()) == false) {
            alert("Please enter a valid email address");
            $("#" + ctrlName + "").focus();
            return false;
        }
        return true;
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


    /* Get the property data */
    function getPropertyData() {
        if (getProcessedParamVal(queryParams.pid) !== "") {
            $.ajax({
                url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetPropertiesjs?listing_no=' + queryParams.pid,
                dataType: 'jsonp',
                jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
                success: dataParserProperty,
                error: ServiceError
            });
        }
        else {
            alert("Invalid Page");
            window.history.back();
            return false;
        }
    }

    /* Success callback for the ajax request in getPropertyData function  */
    function dataParserProperty(data) {
        $.each(data, function(i, item) {
            listing_no = item.listing_no;
            fullAddresss = "" + item.street_no + " " + item.street_name + ", " + item.suburb + ", WA";
            var staticMapUrl = "http://maps.googleapis.com/maps/api/staticmap?center=" + fullAddresss + "&zoom=13&size=300x130&markers=color:blue|label:R|" + fullAddresss + "&sensor=false";
            $("#map-loader").hide();
            $("#staticMap").attr("src", staticMapUrl);
            $("#address").html(item.suburb + ', ' + item.street_no + ' ' + item.street_name + '');
            var htmlBedBathCar = getBedBathCar(item.bedrooms, "i_bed.png", 'bed') + getBedBathCar(item.bathrooms, "i_bath.png", 'bath') + getBedBathCar(item.parking, "i_car.png", 'car');
            $('.iconsBB').html(htmlBedBathCar);
            $(".PropPrice").html(item.price_text);
            agentEmail = item.Agent_Email;
            realtor_no = item.realtor_no;
            getPropImages();
            var public_descFull = item.public_descr;
            public_descFull = item.public_descr.replace("\n", "<br\>") + '<span class="read-more" onclick="showLessDesc();">- hide text</span>';
            $("#publicDesc").html(public_descFull);
            var public_desc = item.public_descr;
            public_desc = public_desc.replace("\n", "<br\>");
            public_desc = public_desc.substring(0, 200);
            public_desc = public_desc + '<span class="read-more" onclick="showFullDesc();">+ read more</span>';
            $("#publicDescShort").html(public_desc);
            if ($.trim(item.home_open_date) != "") {
                var homeOpenString = getHomeOpenDetails(item.home_open_date, item.home_open_text);
                $('#inspectTime').html(homeOpenString);
                $('#inspectTime').css({
                    'color': 'red',
                });
            }
            realtor_no = item.realtor_no;
            //getAgentImage(item.realtor_no); // We cant call that function as its causing to restrict the data parser property 
            $("#agentName").html(item.Agent_Name);
            $("#agencyPhone").html("(08) " + item.agency_Phone);
            $("#agencyPhone").attr("href", "tel:" + '08' + item.agency_Phone);
            $("#agentMobileNo").html(item.Agent_Mobile_No);
            $("#agentMobileNo").attr("href", "tel:" + item.Agent_Mobile_No);
        });
    }


    /**
     * Get the Home Open details . Helper function for the dataParserProperty
     * @param string home_open_date
     * @param string home_open_text
     * @returns string
     */
    function getHomeOpenDetails(home_open_date, home_open_text) {
        var inspectArr = home_open_date.split(",");
        var inspectStr = "";
        for (var i = 0; i < inspectArr.length; i++) {
            //alert($.format.date("2009-12-18 10:54:50.546", "Test: dd/MM/yyyy"));
            inspectArr[i] = inspectArr[i].substring(0, inspectArr[i].indexOf("00"));
            inspectStr += inspectArr[i];
            if (i !== inspectArr.length - 1)
                inspectStr += ', ';
        }
        return inspectStr + " - " + home_open_text;
    }

    /*
     * Get the property images .Helper function for the dataParserProperty
     * 
     */
    function getPropImages() {
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetPropImageJs?listing_no=' + queryParams.pid + '',
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserPropImages,
            error: ServiceError
        });
    }

    /* 
     * Success Call back for the getPropImages 
     * */
    function dataParserPropImages(data) {
        $("#slider-loader").hide();
        $.each(data, function(i, item) {
            $(".slides").append('<li><img src="' + item.PropImage + '" /><p class="flex-caption">' + parseInt(i + 1) + ' of ' + data.length + '</p></li>');
        });
        if ($.flexslider) {
            $('.flexslider').flexslider({
                animation: "slide",
                directionNav: false,
                controlNav: false,
                prevText: "",
                nextText: ""

            });
        }
        //Get the agent images
        getAgentImage();
    }

    /* Get the agent images */
    function getAgentImage() {
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/GetAgentPicJs?realtor_no=' + realtor_no + '',
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserAgentImage,
            error: ServiceError
        });
    }

    /* Success Call back for the getAgentImage */
    function dataParserAgentImage(data) {
        $("#agentImg-loader").hide();
        $.each(data, function(i, item) {
            $("#agentImage").attr("src", item.AgentImage);
        });
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


    /* 
     * Send email with details as mentioned in the emailParams
     */
    function sendEmail(emailParams) {
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/ReiwaProperty.svc/SendEmailJs' +
                    '?body=' + emailParams.body +
                    '&to=' + emailParams.to +
                    '&from=' + emailParams.from +
                    '&subject=' + emailParams.subject,
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserSendEmail,
            error: ServiceError
        });
    }

    /* 
     Success callback for the ajax request in sendEmail function  
     */
    function dataParserSendEmail(data) {
        if (data.length == 1) {
            $.each(data, function(i, item) {
                if (item.body == "success") {
                    alert(emailParams.success);
                }
                else {

                }
            });
        }
    }


    /*$("body").append('<style>.footerInner{visibility:hidden}@media(min-height:' + (($(window).height()) - 10) + 'px){.footerInner{visibility:visible}}</style>');
     
     $(window).on("resize", function(event) {
     $("body").append('<style>.footerInner{visibility:hidden}@media(min-height:' + (($(window).height()) - 10) + 'px){.footerInner{visibility:visible}}</style>');
     });*/

    /* Set the position fixed for footer inner when focuus id removed from input */
    /*$(document).scroll(function() {
     if (!($("input").is(":focus"))) {
     if ($('.footerInner').css('position') == 'absolute' && $('.footerInner').css('position') !== '') {
     $('.footerInner').css({
     'position': 'fixed',
     });
     }
     }
     });*/


});



