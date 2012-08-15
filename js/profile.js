$('#profilePage').live('pageinit', function(event) {
    //$('#showUserName').html(myVar.username.toUpperCase());
    $('#listMyItems').click(function() {
        myVar.arrayItemList.length = 0; //clear CACHE
        myVar.searchOptions.addOptions = "2"; //show only items belong to this profile's owner.
        myVar.searchOptions.ownerId = myVar.userId;
        myVar.checkButton = {
            "sortPrice" : false,
            "sortDate" : false
        };
        myVar.userEditable = true; //show only items belong to this profile's owner.
        $.mobile.changePage("searchResults.html", { transition: "slide"} );
    });
});