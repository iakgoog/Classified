$('#registerPage').live('pageinit', function(event) {
    showForm();

/*++++++++++++++++++++++++++++++++++++++++ CONFIG ++++++++++++++++++++++++++++++++++++++++*/
    var nameNull = '<span class="error error-rname">This field cannot be blank.</span>';
    var nameLength = '<span class="error error-rname">4-20 characters.</span>';
    var nameChar = '<span class="error error-rname">No special characters allowed.</span>';
    var passNull = '<span class="error error-rpass">This field cannot be blanked.</span>';
    var passLength = '<span class="error error-rpass">8-12 characters.</span>';
    var passMatch = '<span class="success success-rcpass">Password Match.</span>';
    var passNoMatch = '<span class="error error-rcpass">Passwords don\'t match.</span>';
    var mailInvalid = '<span class="error error-rmail">Enter a valid email address.</span>';
    var mailNull = '<span class="error error-rmail">Please enter your email address.</span>';
    var addressNull = '<span class="error error-raddress">Please enter your address.</span>';
    var provinceNull = '<span class="error error-rprovince">Please select your province.</span>';

/*++++++++++++++++++++++++++++++++++++++++ NAME VALIDATION ++++++++++++++++++++++++++++++++++++++++*/
    $('#rname').keyup(function() {
        $('#divRegName').children("span").remove();
        var nameVal = $('#rname').val();
        if(nameVal.length == 0) {
            $(this).before(nameNull);
            return false;
        }
        if(!checkNameChar(nameVal)) {
            $(this).before(nameChar);
            return false;
        }
        if(!checkNameLength(nameVal)) {
            $(this).before(nameLength);
            return false;
        }
        return false;
    }).change();
	
	$('#checkUserButton').click(function() {
	    $('#divRegName').children("span").remove();
        var username = $('#rname').val();
        if(username.length == 0) {
            $('#rname').before(nameNull);
            return false;
        }
        if(!checkNameChar(username)) {
            $('#rname').before(nameChar);
            return false;
        }
	    if(!checkNameLength(username)) {
	        $('#rname').before(nameLength);
	        return false;
        }
	    
	    var data = 'username='+ username;
	    
	    $.ajax({
	        url: "http://www.iakgoog.comuv.com/nameValidate.php?callback=?",
            type: 'GET',
            dataType: 'json',
            //jsonp: 'jsoncallback',
            data: data,
            timeout: 5000,
            success: function(res, status){
                console.log(res);
                var rec = $.parseJSON(res);
                //alert("rec.status = " + rec.status);
                if(rec.status == '0') { //show that the username is NOT available
                    $('#rname').before('<span class="error error-rname">' + username + ' is not Available</span>');
                } else { //show that the username is available
                    $('#rname').before('<span class="success success-rname">' + username + ' is Available</span>');
                }
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+ajaxOptions+' - '+thrownError);
            },
            beforeSend: function() { $('#rname').before('<img class="ajax-load" src="img/ajax-loader-s.gif"/>'); }, //Show spinner
            complete: function() { $('#rname').siblings(".ajax-load").remove(); } //Hide spinner
	    });
    });
	
/*++++++++++++++++++++++++++++++++++++++++ PASSWORD VALIDATION ++++++++++++++++++++++++++++++++++++++++*/
    $('#rpass').keyup(function() {
        $('#divRegPass').children("span").remove();
        $('#divRegCPass').children("span").remove();
        var pass = $('#rpass').val();
        if(pass.length == 0) {
            $(this).before(passNull);
            return false;
        }
        if(!checkPassLength(pass)) {
            $(this).before(passLength);
            return false;
        }
    }).change();
    
    $('#rcpass').keyup(function() {
        $('#divRegCPass').children("span").remove();
    });
    
    $('#rcpass').blur(function() {
        $('#divRegCPass').children("span").remove();
        var pass1 = $('#rpass').val();
        var pass2 = $('#rcpass').val();
        if(pass1 == pass2) {
            $(this).before(passMatch);
            return false;
        } else {
            $(this).before(passNoMatch);
            return false;
        }
    });
	
/*++++++++++++++++++++++++++++++++++++++++ EMAIL VALIDATION ++++++++++++++++++++++++++++++++++++++++*/
    $('#checkMailButton').click(function() {
        $('#divRegMail').children("span").remove();
        var mail = $('#rmail').val();
        if(mail.length == 0) {
            $('#rmail').before(mailNull);
            return false;
        }
        if(!checkValidMail(mail)) {
            $('#rmail').before(mailInvalid);
            return false;
        }
        
        var data = 'email='+ mail;
        
        $.ajax({
            url: "http://www.iakgoog.comuv.com/emailValidate.php?callback=?",
            type: 'GET',
            dataType: 'json',
            //jsonp: 'jsoncallback',
            data: data,
            timeout: 5000,
            success: function(res, status){
                console.log(res);
                var rec = $.parseJSON(res);
                //alert("rec.status = " + rec.status);
                if(rec.status == '0') { //show that the email is NOT available
                    $('#rmail').before('<span class="error error-rmail">' + mail + ' is not Available</span>');
                } else { //show that the email is available
                    $('#rmail').before('<span class="success success-rmail">' + mail + ' is Available</span>');
                }
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+ajaxOptions+' - '+thrownError);
            },
            beforeSend: function() { $('#rmail').before('<img class="ajax-load" src="img/ajax-loader-s.gif"/>'); }, //Show spinner
            complete: function() { $('#rmail').siblings(".ajax-load").remove(); } //Hide spinner
        });
        
    });

/*++++++++++++++++++++++++++++++++++++++++ VALIDATE ON SUBMIT ++++++++++++++++++++++++++++++++++++++++*/
    $('#registerForm').submit(function() {
        showWaiting();
        //---------------- CHECK NAME ----------------//
        $('#divRegName').children("span").remove();
        $('#divRegPass').children("span").remove();
        $('#divRegCPass').children("span").remove();
        $('#divRegMail').children("span").remove();
        $('#divRegAddress').children("span").remove();
        $('#divRegProvince').children("span").remove();
        
        var nameVal = $('#rname').val();
        var pass1 = $('#rpass').val();
        var pass2 = $('#rcpass').val();
        var mail = $('#rmail').val();
        var addressVal = $('#raddress').val();
        var provinceVal = $('#rprovince').val();
        
        if(nameVal.length == 0) {
            $('#rname').before(nameNull);
            showForm();
            $('#rname').focus();
            return false;
        }
        if(!checkNameChar(nameVal)) {
            $('#rname').before(nameChar);
            showForm();
            $('#rname').focus();
            return false;
        }
        if(!checkNameLength(nameVal)) {
            $('#rname').before(nameLength);
            showForm();
            $('#rname').focus();
            return false;
        }
        $.post("http://www.iakgoog.comuv.com/nameValidate.php",
            { username: nameVal }, function(data) {
                if(data.charAt(0) == 0) { //show that the username is available
                    $('#rname').before('<span class="error error-rname">' + username + ' is not Available</span>');
                    showForm();
                    $('#rname').focus();
                    return false;
                }
        });
        
        //---------------- CHECK PASSWORD ----------------//
        if(pass1.length == 0) {
            $('#rpass').before(passNull);
            showForm();
            $('#rpass').focus();
            return false;
        }
        if(!checkPassLength(pass1)) {
            $('#rpass').before(passLength);
            showForm();
            $('#rpass').focus();
            return false;
        }
        if(pass1 != pass2) {
            $('#rcpass').before(passNoMatch);
            showForm();
            $('#rcpass').focus();
            return false;
        }
        //---------------- CHECK EMAIL ----------------//
        if(mail.length == 0) {
            $('#rmail').before(mailNull);
            showForm();
            $('#rmail').focus();
            return false;
        }
        if(!checkValidMail(mail)) {
            $('#rmail').before(mailInvalid);
            showForm();
            $('#rmail').focus();
            return false;
        }
        $.post("http://www.iakgoog.comuv.com/emailValidate.php",
            { email: mail }, function(data) {
                if(data.charAt(0) == 0) { //show that the username is NOT available
                    $('#rmail').before('<span class="error error-rmail">' + mail + ' is not Available</span>');
                    showForm();
                    $('#rmail').focus();
                    return false;
                }
        });

        //---------------- CHECK ADDRESS ----------------//
        if(addressVal.length == 0){
            $('#raddress').before(addressNull);
            showForm();
            $('#raddress').focus();
            return false;
        }
        
        //---------------- CHECK PROVINCE ----------------//
        if(provinceVal.length == 0){
            $('#rprovince').before(provinceNull);
            showForm();
            $('#rprovince').focus();
            return false;
        }
        
        //---------------- SUBMIT FORM ----------------//
        //sql string must define exact value before sending to server
        //var sql = "INSERT INTO person (username, password, email, address, province) ";
        //sql + = "VALUES ('$username','$password','$email','$address','$province')";
        
        $.ajax({
            url: "http://www.iakgoog.comuv.com/register.php",
            type: "POST",
            dataType: "json",
            data: 
            {
                name: nameVal,
                password: pass1,
                email: mail,
                address: addressVal,
                province: provinceVal
            },
            success: function(data, status) {
                //showSuccess();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                /*alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
                showForm();*/
            },
            complete: function(jqXHR, textStatus) {
                showSuccess();
            }
        });
        return false;
    });
    
    $('#regCancel').click(function() {
        history.back();
        return false; 
    });
    
});

$('#registerPage').live('pageshow', function(event) {
    showForm();
});

/*++++++++++++++++++++++++++++++++++++++++ FUNCTION ++++++++++++++++++++++++++++++++++++++++*/
//return true if name is 4-20 characters long
function checkNameLength(nameLength) {
	if(nameLength.length < 4 || nameLength.length > 20) {
		return false;
	} else {
		return true;
	}
}

//return true if name does not contain any special character
function checkNameChar(name) {
    /*characterReg = /^\s*[a-zA-Z0-9,\s]+\s*$/;*/
    var characterReg = /^[a-zA-Z0-9]+$/;
    return characterReg.test(name);
}

//return true if password length is 8-12 characters long
function checkPassLength(nameLength) {
    if(nameLength.length < 8 || nameLength.length > 12) {
        return false;
    } else {
        return true;
    }
}

//return true if mail is valid
function checkValidMail(email) {
    //var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    var filter = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return filter.test(email);
}

function showForm() {
    $('#registerSuccess').hide();
    $('#registerWating').hide();
    $('#divRegForm').show();
}

function showWaiting() {
    $('#divRegForm').hide();
    $('#registerSuccess').hide();
    $('#registerWating').show();
}

function showSuccess() {
    $('#divRegForm').hide();
    $('#registerWating').hide();
    $('#registerSuccess').show();
}