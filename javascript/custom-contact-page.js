/** 
 * For the contact Page
 */


$(function() {

    setWaterMark();
    /* Initialize parameterts to be sent in contact request */
    var emailParams = {
        to: "",
        from: "",
        subject: "Contact Request",
        body: "",
        success: ""
    }
    /* Declare agencyEmail globally so that it can be set when the agency Details are received */
    var agencyEmail = "";
    getAgencyDetails();


    /* Set the watermark for the inputs on the form */
    function setWaterMark() {
        $("#txtName").Watermark("Name", "#47494c");
        $("#txtEmail").Watermark("E-mail", "#47494c");
        $("#txtMessage").Watermark("Message", "#47494c");
    }

    /* Validate the Contact Form  */
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

    $("#btnContact").click(function() {
        if (validateForm("txtName", "Name") && validateForm("txtEmail", "E-mail") && isValidEmailAddress("txtEmail") && validateForm("txtMessage", "Message")) {
            emailParams.to = agencyEmail;
            emailParams.from = $("#txtEmail").val();
            emailParams.body = $("#txtMessage").val();
            emailParams.body = emailParams.body.replace("\n", "<br />") + "<br/><br/>" + "Regards," + "<br/>" + "" + $("#txtName").val() +
                    "<br/>" + $("#txtEmail").val();
            //$(this).attr("href", "mailto:" + toEmail + "?subject=" + subject + "&body=" + body + "");
            emailParams.success = "Thanks for sending email to us. We will contact you shortly."
            sendEmail(emailParams);
        }
        else
            return false;
    });

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

    /* Get the agency details */
    function getAgencyDetails() {
        $.ajax({
            url: 'http://mobservice.reiwa.com.au/AHCProperty.svc/GetAgencyJs' +
                    '?agency_no=545',
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback', // specify the callback name if you're hard-coding it
            success: dataParserGetAgency,
            error: ServiceError
        });
    }


    /* Success callback for the ajax request in getAgencyDetails function  */
    function dataParserGetAgency(data) {
        $.each(data, function(i, item) {
            var mapAddress = "" + item.STREET_NO + " " + item.STREET_NAME + ", " + item.suburb + ", " + item.STATE;
            var staticMapUrl = "http://maps.googleapis.com/maps/api/staticmap?center=" + mapAddress + "&zoom=13&size=300x130&markers=color:blue|label:R|" + mapAddress + "&sensor=false";
            $("#staticMap").attr("src", staticMapUrl);
            agencyEmail = item.EMAIL;
            var fullAddresss = getAddressLine(item.address_line) + item.STREET_NO + " " + item.STREET_NAME + "<br/>" + item.suburb + ", "
                    + item.state + " " + item.postcode;
            $('#address').html(fullAddresss);
            $('#phone').html(item.agency_phone_no);
            $('#fax').html(item.agency_fax_no);

        });


    }

    /* Get the address line for the agency . We need use a function as it can return null values */
    function getAddressLine(itemValue) {
        if (itemValue != null && itemValue != "" && itemValue != "null")
            return itemValue + '/';
        else
            return "";
    }

    /* Error callback for the ajax requests */
    function ServiceError(xhr) {
        if (xhr.responseText) {
            var err = xhr.responseText;
            if (err)
                error(err);
            else
                error({Message: "Unknown server error."})
        }
        return;
    }


});