$('#optionsPage').live('pageinit', function(event) {
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