$('#detailsPage').live('pageshow', function(event) {
    var id = getUrlVars()["id"];
    console.log(id);
    //alert(id);
    var url = 'http://www.iakgoog.comuv.com/showDetails.php';
    var data = { "id": id };
    $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        data: data,
        timeout: 5000,
        success: dpSuccess,
        error: dpError,
        beforeSend: dpBeforeSend, 
        complete: dpComplete
    });
    
});

function dpBeforeSend() { $.mobile.showPageLoadingMsg(); } //Show spinner
function dpComplete() { $.mobile.hidePageLoadingMsg(); } //Hide spinner

function dpSuccess(dpRes) {
    console.log(dpRes)
    $.each(dpRes, function(index, item) {
        $('#itemPic').attr('src', item.path);
        $('#itemName').html("Name : " + item.item);
        $('#itemPrice').html("Price : " + item.price + " baht");
        $('#itemDescription').html("Details : " + item.description);
        $('#itemOwner').html("Owner : " + item.username);
    });
    return;
}

function dpError(xhr, ajaxOptions, thrownError) {
    alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+ajaxOptions+' - '+thrownError);
    return;
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