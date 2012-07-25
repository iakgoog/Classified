$('#logoutPage').live('pageinit', function(event) {
    $('#logoutConfirmButton').click(function() {
        window.localStorage.removeItem("classifiedEmail");
        window.localStorage.removeItem("classifiedPassword");
        myVar = myVarReset;
        $.mobile.changePage("index.html", { transition: "slide"} );
    });
});