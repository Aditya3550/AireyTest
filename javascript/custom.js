/*
 * Manage the search page tabs.
 * 
 */

        $(function() {

    $('.open').click(function() {
        $('.dumbBoxWrap').show();
    });

    $('.dumbBox a').click(function() {
        $('.dumbBoxWrap').hide();
    });

    //Hide modal box         
    $('#closeModal').click(function() {
        $('.dumbBoxWrap').hide();
    });

    $('input').click(function() {
        $(window).scrollTop($(this).offset().top);
    });

    var bookmark = location.href.substr(location.href.lastIndexOf('#'));
    if (bookmark == "e") {
        $('div.tabs ul.tabNavigation a:first').click();
    } else {
        $('.tabNavigation a[href="' + bookmark + '"]').click();
    }

    /* Make navigation menu item on click */
    $('#navigation li').click(function() {
        $('#navigation li').removeClass('selected');
        $(this).addClass('selected');
    });
    /* Set the session as fs on For Sale click */
    $('.forsale').click(function() {
        //alert("for sale called");
        sessionStorage.setItem('status', 'fs');
    });
    /* Set the session as fs on For Rent click */
    $('.forrent').click(function() {
        //alert("for rent called");
        sessionStorage.setItem('status', 'fr');
    });

    $('.outside').click(function(e) {
        e.preventDefault();
        location.href = 'Map.html?for=nearest';
    });

    $("#favLink, .favourites").click(function(e) {
        //alert("clciking favourite prop");
        e.preventDefault();
        var favSess = sessionStorage.getItem("fav");
        var favSplit = (favSess == null || favSess == undefined || favSess == '') ? [] : favSess.split(",");
        if (favSplit.length != 0)
            location.href = 'Listing.html?list=' + favSplit + '';
        else
            alert("No property selected as favourite.");
    });


    function printArr(arr) {
        $.each(arr, function(index, value) {
            alert(index + ': ' + value);
        });
    }

    function log(str) {
        $('<p></p>')
                .text(str)
                .appendTo('body');
    }

    /* Property Page */
    /*if ($.flexslider) {
     $('.flexslider').flexslider({
     animation: "slide",
     directionNav: false,
     controlNav: false,
     prevText: "",
     nextText: ""
     
     });
     }*/

    /*$(".read-more").click(function() {
     //var offsetPropDesc = $("#propDesc").offset().top;
     var $elem = $(this).parent().find(".text");
     if ($elem.hasClass("short"))
     {
     $elem.removeClass("short").addClass("full");
     $(this).text('- hide text');
     }
     else
     {
     $elem.removeClass("full").addClass("short");
     $(this).text('+ read more');
     $('html, body').animate({
     scrollTop: offsetPropDesc
     }, 200);
     
     }
     
     
     });*/


    /* $('.starFav').click(function() {
     var iteration = $(this).data('iteration') || 1
     switch (iteration) {
     case 1:
     $(this).addClass("starFavOn");
     break;
     case 2:
     $(this).removeClass("starFavOn").addClass("starFav");
     
     break;
     }
     iteration++;
     if (iteration > 2)
     iteration = 1;
     $(this).data('iteration', iteration);
     return false;
     })*/


});
