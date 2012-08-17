$('#registerPage').live('pageinit', function(event) {
//++++++++++++++++++++++++++++++++ INITIALIZE CAPTCHA ++++++++++++++++++++++++++++++++
    newShape();
    
//++++++++++++++++++++++++++++++++read provinces.xml and display select menu provinces list
    $.get('xml/provinces.xml', function(provinces){
        $(provinces).find('province').each(function(){
            var province = $(this).text();
            $('#rprovince').append("<option value='"+province+"'>"+province+"</option>");
        });
//++++++++++++++++ do whatever you want after province listing ++++++++++++++++
        
        if(myVar.userEditable) {
            registerEditForm();
            setEditableField();
        }
        $('#rprovince').selectmenu("refresh");
    });
    
//++++++++++++++++++++++++++++++++ DECLARE VALIDATION RULES ++++++++++++++++++++++++++++++++
    $.validator.addMethod('specialChar', function(value, element, param) {
        return /[\w]/.test(value);
    }, "Username should not contain any special character.");    

    var registerValidator = $('#registerForm').validate({
        onkeyup: function(element) {
            $(element).valid();
        },
        rules: {
            rname: {
                required: true,
                specialChar: true,
                minlength: 4,
                maxlength: 20
            },
            rpass: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            rcpass: {
                required: true,
                equalTo: "#rpass"
            },
            rmail: {
                required: true,
                email: true
            },
            raddress: {
                required: true
            },
            rprovince: {
                required: true
            }
        },
        messages: {
            itemNameUpload: {
                required: "Please name your item."
            },
            itemCategoryUpload: {
                required: "Please categorize your item."
            },
            itemPriceUpload: {
                required: "Please evaluate your item.",
                min: "Price should not be less than &#3647;1."
            },
            itemDescriptionUpload: {
                required: "Please describe your item."
            },
            rname: {
                required: "Please provide your username",
                minlength: "Requires 4-20 characters",
                maxlength: "Requires 4-20 characters"
            },
            rpass: {
                required: "Please provide your password",
                minlength: "Requires 6-20 characters",
                maxlength: "Requires 6-20 characters"
            },
            rcpass: {
                required: "Password must match",
                equalTo: "Password must match"
            },
            rmail: {
                required: "Please provide your email",
                email: "Invalid email format"
            },
            raddress: {
                required: "Please provide your address"
            },
            rprovince: {
                required: "Please provide your province"
            }
        }        
    });
//++++++++++++++++++++++++++++++++ select tag need to be refreshed after validation ++++++++++++++++++++++++++++++++
    $("#rprovince").change(function() {
        $(this).selectmenu("refresh");
    });
//++++++++++++++++++++++++++++++++ EVENT VALIDATION AND CUSTOM VALIDATION ++++++++++++++++++++++++++++++++
    $('#rname').keyup(function() {
        if($(this).siblings(".custom").length) { 
            $(this).siblings(".custom").remove();
        }
        if(!$(this).valid()) {
            myVar.nameAvailable = false;
        }
    });
    
    $('#rname').focusout(function() { //when Username field is focus-outed, do Username validation.
        if($(this).valid()) {
            if($(this).siblings(".custom").length) { 
                $(this).siblings(".custom").remove();
            }
            $.ajax({
                url: myVar.url+"/persons/validate-username",
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({ "username": $('#rname').val() }),
                success: function(res, status){
                    console.log(res);
                    if(res.status == '0') { //show that the username is NOT available
                        myVar.nameAvailable = false;
                        $('#rname').focus();
                        $('#rname').after('<label class="custom error" for="rname">'+$('#rname').val()+' is not available.</label>');
                    } else {
                        myVar.nameAvailable = true;
                        $('#rname').after('<label class="custom success" for="rname">'+$('#rname').val()+' is available.</label>');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert('Username validation FAILED\nCheck your internet connection\ntextStatus: '+textStatus+'\nerrorThrown: '+errorThrown);
                },
                beforeSend: function() { $('#rnameLabel').after('<img class="ajax-load" src="img/ajax-loader-s.gif"/>'); }, //Show spinner
                complete: function() { $('#rnameLabel').siblings('.ajax-load').remove(); } //Hide spinner
            });
        }        
    });
    
    $('#rmail').keyup(function() {
        if($(this).siblings(".custom").length) { 
            $(this).siblings(".custom").remove();
        }
        if(!$(this).valid()) {
            myVar.mailAvailable = false;
        }
    });
    
    $('#rmail').focusout(function() { //when E-mail field is focus-outed, do E-mail validation.
        if($(this).valid()) {
            if($(this).siblings(".custom").length) { 
                $(this).siblings(".custom").remove();
            }
            $.ajax({
                url: myVar.url+"/persons/validate-email",
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({ "email": $('#rmail').val() }),
                success: function(res, status){
                    console.log(res);
                    if(res.status == '0') { //show that the email is NOT available
                        myVar.mailAvailable = false;
                        $('#rmail').focus();
                        $('#rmail').after('<label class="custom error" for="rname">'+$('#rmail').val()+' is not available.</label>');
                    } else { //show that the email is available
                        myVar.mailAvailable = true;
                        $('#rmail').after('<label class="custom success" for="rname">'+$('#rmail').val()+' is available.</label>');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert('Email validation FAILED\nCheck your internet connection\ntextStatus: '+textStatus+'\nerrorThrown: '+errorThrown);
                },
                beforeSend: function() { $('#rmailLabel').after('<img class="ajax-load" src="img/ajax-loader-s.gif"/>'); }, //Show spinner
                complete: function() { $('#rmailLabel').siblings('.ajax-load').remove(); } //Hide spinner
            });
        }
    });
/*++++++++++++++++++++++++++++++++++++++++ VALIDATE ON SUBMIT ++++++++++++++++++++++++++++++++++++++++*/
    $('#registerForm').submit(function() {
        if(!myVar.userEditable) { // Register mode
            if($(this).valid()) {
                if(!myVar.nameAvailable) {
                    $('#rname').focus();
                    return false;
                }
                if(!myVar.mailAvailable) {
                    $('#rmail').focus();
                    return false;
                }
                myVar.username = $('#rname').val();
                myVar.password = get.MD5($('#rpass').val());
                myVar.email = $('#rmail').val();
                myVar.address =  $('#raddress').val();
                myVar.province = $('#rprovince').val();
                
                uploadProfileForm();
            } else {
                return false;
            }
        } else { //Edit mode
            if($('#raddress').valid() && $('#rprovince').valid()) {
                myVar.address =  $('#raddress').val();
                myVar.province = $('#rprovince').val();
                
                uploadProfileForm();
            } else {
                return false;
            }
        }
		return false;
    });
/*++++++++++++++++++++++++++++++++++++++++ RESET FORM ++++++++++++++++++++++++++++++++++++++++*/    
    $('#regReset').click(function() {
        registerValidator.resetForm();
        //$('#registerForm').clearForm(); //clear all fields
        if(!myVar.userEditable) {
            if($('#rname').siblings('.custom').length) { 
                $('#rname').siblings('.custom').remove();
            }
            if($('#rmail').siblings('.custom').length) { 
                $('#rmail').siblings('.custom').remove();
            }
            $('#rname').clearForm();
            $('#rmail').clearForm();
            $('#rpass').clearForm();
            $('#rcpass').clearForm();
        }
        $('#raddress').clearForm();
//++++++++++++++++ select tag need to be refreshed if option's value is changed programmatically ++++++++++++++++        
        $('#rprovince :first-child').prop('selected', 'selected');
        $('#rprovince').selectmenu('refresh');
/*++++++++++++++++++++++++++++++++++++++++ RESET CAPTCHA ++++++++++++++++++++++++++++++++++++++++*/    
        newShape();
        $('#registerForm').find('input[type=submit]').prop('disabled', 'disabled');
        $('#registerForm').find('input[type=submit]').button('refresh');
    });
    
});

/*++++++++++++++++++++++++++++++++++++++++ FUNCTION ++++++++++++++++++++++++++++++++++++++++*/
function uploadProfileForm() {
    if(myVar.userEditable) {
        var userData = JSON.stringify({
            "address": myVar.address,
            "province": myVar.province
        });
        var userDataPath = "/persons/update/"+myVar.userId;
    } else {
        var userData = JSON.stringify({
            "username": myVar.username,
            "password": myVar.password,
            "email": myVar.email,
            "address": myVar.address,
            "province": myVar.province
        });
        var userDataPath = "/persons/register";
    }
    $.ajax({
        url: myVar.url+userDataPath,
        type : 'POST',
        dataType: 'json',
        data: userData,
        success: function(data, status) {
            if(myVar.userEditable) {
                alert("Your profile has been saved");
                $.mobile.changePage("options.html", { transition : "slide", reverse: true });
            } else {
                alert("Register success");
                $.mobile.changePage("index.html", { transition : "slide", reverse: true });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
            alert('data upload FAILED\ntextStatus: '+textStatus+'\nerrorThrown: '+errorThrown);
            if(myVar.userEditable) {
                $.mobile.changePage("options.html", {transition : "slide", reverse: true });
            } else {
                return false;
            }
        },
        beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
        complete: function() { $.mobile.hidePageLoadingMsg(); } //Hide spinner
    });
}

function registerEditForm() {
    $('#rname').val(myVar.username);
    $('#rmail').val(myVar.email);
    $('#raddress').val(myVar.address);
    //++++++++++++++++ select tag need to be refreshed its value is changed programmatically ++++++++++++++++
    $('#rprovince').children('option[value="'+myVar.province+'"]').prop('selected','selected');
}

function setEditableField() {
    $('#divRegPass').hide();
    $('#divRegCPass').hide();
    $('#rname').prop('disabled','disabled');
    $('#rname').addClass("disabled");
    $('#rmail').prop('disabled','disabled');
    $('#rmail').addClass("disabled");
}
/*++++++++++++++++++++++++++++++++++++++++ INITIALIZED CAPTCHA ++++++++++++++++++++++++++++++++++++++++*/    
function newShape() {
    $('#registerForm').motionCaptcha({
        shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'zigzag', 'arrow', 'delete', 'pigtail', 'star']
    });    
    var shapes = ['triangle', 'x', 'rectangle', 'circle', 'check', 'zigzag', 'arrow', 'delete', 'pigtail', 'star'];
    $('#mc-canvas').prop('class', shapes[Math.floor(Math.random()*10)]);
}