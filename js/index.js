function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
    //delete init;
}

var onDeviceReady = function() {
    
};

$('#indexPage').live('pageinit', function(event) {
    $('#loginForm').submit(function() {
        myVar.email = $('#lmail').val();
        myVar.password = get.MD5($('#lpass').val());
        handleLogin();
        return false;
    });
});

$('#indexPage').live('pageshow', function(event) {
    //++++++++++++++++ AUTO LOGIN ++++++++++++++++
    //checkPreAuth();
    //++++++++++++++++ AUTO LOGIN ++++++++++++++++
    $('#divLoginForm').show();
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
    
    //alert(myVar.email + ' : ' + myVar.password);
    //console.log("click");
    if(myVar.email != '' && myVar.password!= '') {
        $.ajax({
            url: myVar.url+'/persons/login',
            type : 'POST',
            dataType: 'json',
            data: JSON.stringify({
                "email": myVar.email,
                "password": myVar.password
            }),
            success: function(data, status){
                console.log(data);
                if(data.status == 1) { //show that the username is NOT available
                    window.localStorage.setItem("classifiedEmail", myVar.email);
                    window.localStorage.setItem("classifiedPassword", myVar.password);
                    
                    myVar.username = data.username; 
                    myVar.userId = data.id;
                    myVar.email = data.email;
                    myVar.address =  data.address;
                    myVar.province = data.province;

                    $('#divLoginLoading').html("");
                    $.mobile.changePage("profile.html", { transition: "slide"});
                } else {
                    alert("Your login failed");
                    $('#divLoginForm').show();
                }
                return;
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
                //alert(jqXHR.status);
                //alert(textStatus);
                //alert(errorThrown);
                $('#divLoginForm').show();
            },
            beforeSend: function() {
                $('#divLoginForm').hide();
                $.mobile.showPageLoadingMsg();
            }, //Show spinner
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            } //Hide spinner
        });
        
    } else {
        alert("You must enter a username and password", function() {});
    }
    return false;
}