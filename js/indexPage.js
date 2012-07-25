function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
    delete init;
}

var onDeviceReady = function() {
    
};

$('#indexPage').live('pageinit', function(event) {
    $('#loginForm').submit(function() {
        myVar.email = $('#lmail').val();
        myVar.password = $('#lpass').val();
        handleLogin();
        return false;
    });
    
});

$('#indexPage').live('pageshow', function(event) {
    //++++++++++++++++ AUTO LOGIN ++++++++++++++++
    checkPreAuth();
    //++++++++++++++++ AUTO LOGIN ++++++++++++++++
});

function checkPreAuth() {
    myVar.email = window.localStorage.getItem("classifiedEmail");
    myVar.password = window.localStorage.getItem("classifiedPassword");
    if(myVar.email != undefined && myVar.password != undefined) {
        setTimeout('handleLogin()', 1000);
    }
}

function handleLogin() {
    //disable the button so we can't resubmit while we wait
    //$("#submitLogin").attr("disabled","disabled");
    
    //alert(email + ' : ' + password);
    //console.log("click");
    if(myVar.email != '' && myVar.password!= '') {
        $.ajax({
            url: 'http://www.iakgoog.comuv.com/checkLogin.php',
            type : 'GET',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            data: { email: myVar.email, password: myVar.password },
            timeout: 10000,
            success: function(data, status){
                console.log(data);
                if(data.status == 1) { //show that the username is NOT available
                    window.localStorage.setItem("classifiedEmail", myVar.email);
                    window.localStorage.setItem("classifiedPassword", myVar.password);
                    delete data[status];
                    $.each(data, function(key, value) {
                        if(key != 'status') {
                            myVar.username = value.username; 
                            myVar.id = value.person_id;
                            myVar.email = value.email;
                            myVar.address =  value.address;
                            myVar.province = value.province;
                        }
                    });
                    
                    $('#divLoginLoading').html("");
                    $.mobile.changePage("profile.html", { transition: "slide"} );
                } else {
                    alert("Your login failed");
                }
                return;
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
                //alert(jqXHR.status);
                //alert(textStatus);
                //alert(errorThrown);
                //showLoginForm();
                return;
            },
            beforeSend: function() {
                $('#submitLogin').prop("disabled", true);
                $.mobile.showPageLoadingMsg();
            }, //Show spinner
            complete: function() {
                $('#submitLogin').prop("disabled",false);
                $.mobile.hidePageLoadingMsg();
            } //Hide spinner
        });
        
    } else {
        alert("You must enter a username and password", function() {});
    }
    return false;
}