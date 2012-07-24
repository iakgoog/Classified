function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
}

var onDeviceReady = function() {
    //alert("onDeviceReady");
    /*document.getElementById("width").innerHTML = "screen width : " + screen.width;
    document.getElementById("height").innerHTML = "screen height : " + screen.height;
    document.getElementById("availwidth").innerHTML = "screen width available : " + screen.availWidth;
    document.getElementById("availheight").innerHTML = "screen height available : " + screen.availHeight;*/
    //alert("screee height : " + screen.height);
    //windowW = screen.width;
    //windowH = screee.height;
    //$("img.lazy").lazyload();
};

$('#indexPage').live('pageinit', function(event) {
    showLoginForm();
    //set margin-top to login form (place it on the middle of the page)
    //$('#divLoginForm').css("margin-top", windowHeight);
    var pageH = $('[data-role="page"]').first().height();
    //var windowHeight = (((screen.height - 100) / 2) - (pageH*2/3)  + "px");
    var windowHeight = (screen.height * 0.125) + "px";
    //var windowHeight = (((screen.height) / 2) - 240) + "px";
    //$('#divLoginForm').css("margin-top", windowHeight);
    //$('#divLoginForm').css("margin-top", "35%");
    
    //$('#divLoginForm').css("border", "2px solid red");
    //$('#divLogin').css("border", "2px solid blue");
    
    $('#loginForm').submit(function() {
        //showLoginWaiting();
        myVar.email = $('#lmail').val();
        myVar.password = $('#lpass').val();
        //handleLogin($('#lmail').val(), $('#lpass').val());
        handleLogin();
        return false;
    });
    
});

$('#indexPage').live('pageshow', function(event) {
    //$('#divLogin').css("margin-top",windowH);
    //++++++++++++++++ AUTO LOGIN ++++++++++++++++
    //checkPreAuth();
    //++++++++++++++++ AUTO LOGIN ++++++++++++++++
});

function checkPreAuth() {
    myVar.email = window.localStorage.getItem("classifiedEmail");
    myVar.password = window.localStorage.getItem("classifiedPassword");
    //alert('read => ' + email + ' : ' + password);
    if(myVar.email != undefined && myVar.password != undefined) {
        //showLoginWaiting();
        setTimeout('handleLogin()', 1000);
        //handleLogin(email, password);
    }
}

function handleLogin() {
    //disable the button so we can't resubmit while we wait
    //$("#submitLogin").attr("disabled","disabled");
    
    //alert(email + ' : ' + password);
    //console.log("click");
    if(myVar.email != '' && myVar.password!= '') {
        $('#divLogin').hide();
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
                            //alert("key = " + key);
                            myVar.username = value.username; 
                            myVar.id = value.person_id;
                            myVar.email = value.email;
                            myVar.address =  value.address;
                            myVar.province = value.province;
                        }
                    });
                    
                    //will be changed to be going to some page later
                    //$('#divLoginLoading').html("<h2 style='color: #008000'>Login Success</h2>");
                    $('#divLoginLoading').html("");
                    $.mobile.changePage("profile.html", { transition: "slide"} );
                } else {
                    alert("Your login failed");
                    showLoginForm();
                }
                //$("#submitLogin").removeAttr("disabled");
                return;
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
                //alert(jqXHR.status);
                //alert(textStatus);
                //alert(errorThrown);
                showLoginForm();
                return;
            },
            beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
            complete: function() { $.mobile.hidePageLoadingMsg(); } //Hide spinner
        });
        
    } else {
        //Thanks Igor!
        alert("You must enter a username and password", function() {});
        showLoginForm();
        //$("#submitLogin").removeAttr("disabled");
    }
    //this line has just been added for testing
    //$("#submitLogin").removeAttr("disabled"); 
    return false;
}

function showLoginForm() {
    //$('#divLoginWaiting').hide();
    $('#divLogin').show();
}

function showLoginWaiting() {
    $('#divLogin').hide();
    //$('#divLoginWaiting').show();
    
    //var loadingH = (screen.height * 0.25) + "px";
    //$('#divLoginLoading').css("margin-top", loadingH);
}