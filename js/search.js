$('#searchPage').live('pageinit', function(event) {
    //---------------- reset search options ----------------
    myVar.arrayItemList.length = 0;
    myVar.searchOptions = {
        "addOptions" : "",
        "catSearch" : "",
        "pricedFrom" : "",
        "pricedTo" : "",
        "distance" : "",
        "myLat" : "",
        "myLng" : "",
		"ownerId" : ""
    };
    myVar.checkButton = {
        "sortPrice" : false,
        "sortDate" : false,
        "sortDistance" : false
    };
    
    $.validator.addMethod('lesserThan', function(value, element, param) {
        return ( parseInt(value,10) < parseInt($(param).val(),10) );
    }, "priced from should be lesser than priced to");
    
    $.validator.addMethod('greaterThan', function(value, element, param) {
        return ( parseInt(value,10) > parseInt($(param).val(),10) );
    }, "priced to should be greater than priced from");
    
    var validator = $('#searchOptionsForm').validate({
        //onkeyup: function(element) { $(element).valid(); },
        rules: {
            pricedFrom: {
                required: "#checkEnablePriced:checked",
                min: 0,
                lesserThan: "#pricedTo",
            },
            pricedTo: {
                required: "#checkEnablePriced:checked",
                greaterThan: "#pricedFrom",
            },
            distanceSearch: {
                required: "#checkEnableDistance:checked",
                min: 1,
            }
        },
        messages: {
            pricedFrom: {
                required: "Please enter a value greater than or equal to 0.",
                min: "Please enter a value greater than or equal to 0.",
            },
            pricedTo: {
                required: "Please enter a value greater than or equal to 1.",
                min: "Please enter a value greater than or equal to 1.",
            },
            distanceSearch: {
                required: "Please enter a value greater than or equal to 1.",
                min: "Please enter a value greater than or equal to 1."
            }
        }
    });
    
    //---------------- init priced form option ----------------
    if($("#checkEnablePriced").is(":checked")) {
        $("#divPricedFrom").show();
        $("#divPricedTo").show();
    } else {
        $("#divPricedFrom").hide();
        $("#divPricedTo").hide();
    }
    
    $("#checkEnablePriced").click(function() {
        if(this.checked) {
            $("#divPricedFrom").show();
            $("#divPricedTo").show();
        } else {
            $("#divPricedFrom").hide();
            $("#divPricedTo").hide();
            $("#pricedFrom").val("");
            $("#pricedTo").val("");
            $("#pricedFrom").siblings("label.error").remove();
            $("#pricedTo").siblings("label.error").remove();
        }
    });
    
    //---------------- init distance option ----------------
    if($("#checkEnableDistance").is(":checked")) {
        $("#divDistanceSearch").show();
    } else {
        $("#divDistanceSearch").hide();
    }
    
    $("#checkEnableDistance").click(function() {
       if(this.checked) {
           $("#divDistanceSearch").show();
       } else {
           $("#divDistanceSearch").hide();
           $("#distanceSearch").val("");
           $("#distanceSearch").siblings("label.error").remove();
       }
    });

    //---------------- keyup event handler ----------------
    $('#pricedTo').keyup(function(){
        if($('#pricedFrom').valid() && $('#pricedTo').valid()) {
            $('#searchOptionsInvalid').html("");
        }
    });
    $('#pricedFrom').keyup(function(){
        if($('#pricedFrom').valid() && $('#pricedTo').valid()) {
            $('#searchOptionsInvalid').html("");
        }
    });
    $("#distanceSearch").keyup(function() {
        if($("#distanceSearch").valid()) {
            $('#searchOptionsInvalid').html("");
        } 
    });
    
    //---------------- submit search ----------------
    $('#doSearch').click(function() {
        $('#searchOptionsInvalid').html("");
        if($("#checkEnablePriced").is(":checked")) {
            if(!$('#pricedFrom').valid() || !$('#pricedTo').valid()) {
                $('#searchOptionsInvalid').append('<h2><label class="error">Please correct your search priced form options</label></h2>');
                return false;
            } else {
                myVar.searchOptions.pricedFrom = $('#pricedFrom').val();
                myVar.searchOptions.pricedTo = $('#pricedTo').val();
            }
        }
        if($("#checkEnableDistance").is(":checked")) {
            if(!$("#distanceSearch").valid()) {
                $('#searchOptionsInvalid').append('<h2><label class="error">Please correct your search distance options</label></h2>');
                return false;
            } else {
                myVar.searchOptions.distance = $('#distanceSearch').val();
            }
        }
        myVar.searchOptions.catSearch = $('#categorySearch').val();
        myVar.searchOptions.addOptions = "1"; //show every item which match this search options.
        myVar.userEditable = false; //show every item which match this search options.
        
        //TEST ONLY
        //myVar.searchOptions.myLat = myVar.latVal;
        //myVar.searchOptions.myLng = myVar.lngVal;
        //$.mobile.changePage("searchResults.html", { transition: "slide"} );
        
        navigator.geolocation.getCurrentPosition(function(p) {
            myVar.latVal = p.coords.latitude;
            myVar.lngVal = p.coords.longitude;
            
            myVar.searchOptions.myLat = myVar.latVal;
            myVar.searchOptions.myLng = myVar.lngVal;
            
            $.mobile.changePage("searchResults.html", { transition: "slide"} );
        }, function() {
            alert("Failed to get location\nPlease check your internet connection");
            return false;
        });
    });
    
});