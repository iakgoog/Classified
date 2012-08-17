$('#detailsPage').live('pageinit', function(event) {
    if(!myVar.userEditable) {
        $('#userOwn').hide();
    }
});

$('#detailsPage').live('pageshow', function(event) {
    var id = getUrlVars()["id"];
    console.log(id);
    //alert(id);
    $.ajax({
        url: myVar.url+'/get-items/'+id,
        type: 'GET',
        dataType: 'json',
        success: dpSuccess,
        error: dpError,
        beforeSend: dpBeforeSend, 
        complete: dpComplete
    });

    //++++++++++++++++ user's events section ++++++++++++++++
    $('#deleteConfirmButton').click(function() {
        console.log("delete confirm button was pressed");
        $.ajax({
            url: myVar.url+'/delete-items/'+id,
            //type: 'DELETE',
            type: 'POST',
            success: deleteSuccess,
            error: dpError,
            beforeSend: dpBeforeSend, 
            complete: dpComplete
        });
    });
    
    $('#editItem').click(function() {
        $.mobile.changePage("itemForm.html", { transition: "slide"});
    });
});

function dpBeforeSend() { $.mobile.showPageLoadingMsg(); } //Show spinner
function dpComplete() { $.mobile.hidePageLoadingMsg(); } //Hide spinner

function dpError(xhr, ajaxOptions, thrownError) {
    //alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+ajaxOptions+' - '+thrownError);
    alert('get item details FAILED\ntextStatus: '+textStatus+'\nerrorThrown: '+errorThrown);
    $.mobile.changePage("searchResults.html", { transition: "slide"} );
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function dpSuccess(dpRes) {
    console.log(dpRes)
    var dItem = dpRes;
    
    if(myVar.userEditable) {
        myVar.itemForm.itemId = dItem.id;
        myVar.itemForm.itemNameUpload = dItem.item_name;
        myVar.itemForm.itemCategoryUpload = dItem.category;
        myVar.itemForm.itemPriceUpload = dItem.price;
        myVar.itemForm.itemDescriptionUpload = dItem.description;
    }
    
    $('#itemPic').attr('src', myVar.url+dItem.path);
    $('#itemName').html("Name : " + dItem.item_name);
    $('#itemPrice').html("Price : &#3647;" + dItem.price);
    $('#itemDescription').html("Details : " + dItem.description);
    $('#itemOwner').html("Owner : " + dItem.username);
}

function deleteSuccess(deleteRes) {
    //history.back();
    console.log("delete Success ajax callback");
    myVar.prepareAjaxReload();
    alert("Item ["+myVar.itemForm.itemNameUpload+"] has been deleted");
    $.mobile.changePage("searchResults.html", { transition: "slide"});
}