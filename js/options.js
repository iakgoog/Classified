$('#optionsPage').live('pageinit', function(event) {
    console.log("optionsPage has been initialized!!!");
//++++++++++++++++++++++++++++++++ CHANGE PASSWORD SECTION ++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++ DECLARE PASSWORD VALIDATION RULES ++++++++++++++++++++++++
    var changePasswordValidator = $('#changePasswordForm').validate({
        onkeyup: function(element) {
            $(element).valid();
        },
        rules: {
            ecurpass: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            epass: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            ecpass: {
                required: true,
                equalTo: "#epass"
            }
        },
        messages: {
            ecurpass: {
                required: "Current password is required.",
                minlength: "Requires 6-20 characters.",
                maxlength: "Requires 6-20 characters."
            },
            epass: {
                required: "Please enter your new password.",
                minlength: "Requires 6-20 characters.",
                maxlength: "Requires 6-20 characters."
            },
            ecpass: {
                required: "Password must match.",
                equalTo: "Password must match."
            },
        }
    });
    //++++++++++++++++++++++++ PASSWORD KEY EVENT ++++++++++++++++++++++++
    $('#ecurpass').keyup(function() {
        if($(this).siblings(".custom").length) { 
            $(this).siblings(".custom").remove();
        }
        if(!$(this).valid()) {
            myVar.currentPassword = false;
        }
    });
    
    $('#ecurpass').focusout(function() { //when Username field is focus-outed, do Username validation.
        if($(this).valid()) {
            if($(this).siblings(".custom").length) { 
                $(this).siblings(".custom").remove();
            }
            $.ajax({
                url: myVar.url+"/persons/validate-password/"+myVar.userId,
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({ "password": get.MD5($('#ecurpass').val())}),
                success: function(res){
                    console.log(res);
                    if(res.status == '0') { //show that the username is NOT available
                        myVar.currentPassword = false;
                        $('#ecurpass').focus();
                        $('#ecurpass').after('<label class="custom error" for="ecurpass">The password is incorrect.</label>');
                    } else {
                        myVar.currentPassword = true;
                        $('#ecurpass').after('<label class="custom success" for="ecurpass">The password is correct.</label>');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert('Username validation FAILED\nCheck your internet connection\ntextStatus: '+textStatus+'\nerrorThrown: '+errorThrown);
                },
                beforeSend: function() { $('#ecurpassLabel').after('<img class="ajax-load" src="img/ajax-loader-s.gif"/>'); }, //Show spinner
                complete: function() { $('#ecurpassLabel').siblings('.ajax-load').remove(); } //Hide spinner
            });
        }
    });
    
    $('#changePasswordCancel').click(function() {
        changePasswordValidator.resetForm();
        if($('#ecurpass').siblings(".custom").length) { 
            $('#ecurpass').siblings(".custom").remove();
        }
        $('#changePasswordForm').clearForm();
    });
    
    $('#changePasswordForm').submit(function() {
        if($(this).valid()) {
            changePassword();
        } else {
            return false;
        }
    });
//++++++++++++++++++++++++++++++++ EDIT PROFILE SECTION ++++++++++++++++++++++++++++++++
    $('#editProfile').click(function() {
        myVar.userEditable = true; //show user profile in register page.
        $.mobile.changePage("register.html", {transition: "slide"});
    });
//++++++++++++++++++++++++++++++++ LOGOUT SECTION ++++++++++++++++++++++++++++++++
    $('#logoutConfirmButton').click(function() {
        window.localStorage.removeItem("classifiedEmail");
        window.localStorage.removeItem("classifiedPassword");
        myVar.reset();
        $.mobile.changePage("index.html", { transition: "slide"});
    });
});
//++++++++++++++++++++++++++++++++ FUNCTION ++++++++++++++++++++++++++++++++
function changePassword() {
    $.ajax({
        url: myVar.url+"/persons/change-password/"+myVar.userId,
        type : 'POST',
        dataType: 'json',
        data: JSON.stringify({ "password": get.MD5($('#epass').val()) }),
        success: function(data, status) {
            alert("Your password has been changed");
            $.mobile.changePage( "options.html", {
                reloadPage: true
            });        },
        error: function(jqXHR, textStatus, errorThrown) {
            //alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
            alert('password change FAILED\ntextStatus: '+textStatus+'\nerrorThrown: '+errorThrown);
            $.mobile.changePage("options.html", {transition : "slide"});
        },
        beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
        complete: function() { $.mobile.hidePageLoadingMsg(); } //Hide spinner
    });
}