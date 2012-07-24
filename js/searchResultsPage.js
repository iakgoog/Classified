$('body').on('pageinit', '#searchResultsPage', function( evt, ui ) {
    /*++++++++++++++++++++++++++++++++++++++++ begin initialize lazyloader  ++++++++++++++++++++++++++++++++++++++++*/
    // Initialize the lazyloader widget
    $("#searchResultsPage").lazyloader();
    /* Set some default options for the lazyloader
     *   the first three set the timeout value for when the widget should check
     *   the current scroll position relative to page height to decide whether
     *   or not to load more yet.  The showprogress option is to specify the
     *   duration of the fadeIn animation for the lazyloaderProgressDiv.
     */
    $.mobile.lazyloader.prototype.timeoutOptions.mousewheel = 300;
    $.mobile.lazyloader.prototype.timeoutOptions.scrollstart = 700;
    $.mobile.lazyloader.prototype.timeoutOptions.scrollstop = 100;
    $.mobile.lazyloader.prototype.timeoutOptions.showprogress = 100;
    /*++++++++++++++++++++++++++++++++++++++++ end initialize lazyloader ++++++++++++++++++++++++++++++++++++++++*/
    $('#sortPrice').prop("checked", myVar.checkButton.sortPrice).checkboxradio("refresh");;
    $('#sortDistance').prop("checked", myVar.checkButton.sortDistance).checkboxradio("refresh");;
});

$('#searchResultsPage').live('pageshow', function(event) {
    if(myVar.searchOptions.addOptions == 1) {
        //alert("(LOAD) add options = " + myVar.searchOptions.addOptions);
        ajaxListItem('http://www.iakgoog.comuv.com/search.php', myVar.searchOptions);
    } else {
        //alert("(CACHE) add options = " + myVar.searchOptions.addOptions);
        showItem(myVar.arrayItemList);
    }
    
    $('#sortPrice').click(function() {
        myVar.checkButton.sortPrice = !myVar.checkButton.sortPrice;
        sortByPrice(myVar.checkButton.sortPrice);
        showItem(myVar.arrayItemList);
    });
    
    $('#sortDistance').click(function() {
        myVar.checkButton.sortDistance = !myVar.checkButton.sortDistance;
        sortByDistance(myVar.checkButton.sortDistance);
        showItem(myVar.arrayItemList);
    });
    
});

function ajaxListItem(sendURL, sendData) {
    $.ajax({
        url: sendURL,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        data: sendData,
        timeout: 5000,
        success: srSuccess,
        error: srError,
        beforeSend: srBeforeSend, 
        complete: srComplete
    });
}

function srBeforeSend() {
    $.mobile.showPageLoadingMsg();
} //Show spinner

function srComplete() {
    $.mobile.hidePageLoadingMsg();
} //Hide spinner

function srSuccess(searchResultsData) {
    //console.log(searchResultsData);
    //alert(searchResultsData.sql);
    if(searchResultsData.status == 1) {
        myVar.searchOptions.addOptions = "0"; //my cache page
        //alert("success => add options = " + myVar.searchOptions.addOptions);
        $.each(searchResultsData, function(index, item) {
            if(index != 'status' && index != 'sql') {
                myVar.arrayItemList.push(item);
            }
        });
        //alert(JSON.stringify(myVar.arrayItemList));
        showItem(myVar.arrayItemList);
    } else {
        $('#itemNotFound').html("<h2>item not found.</h2>");
        return;
    }
}

function srError(jqXHR, textStatus, errorThrown) {
    alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
    return;
}

function pageShowItem(itemID) {
    $.mobile.changePage("itemDetails.html?id=" + itemID, { transition: "slide"} );
}

function showItem(listData) {
    $('#itemList').html("");
    $('#itemList').append('<li data-role="list-divider" role="heading">Item List</li>');
    $.each(listData, function(index, item) {
        if(index != 'status' && index != 'sql') {
            var showItem = '<li data-theme="c" onClick="pageShowItem('+item.item_id+');"><a href="">';
            showItem += '<img src="' + item.path + '" sytle="max-width: 80px; max-height: 80px" />';
            showItem += '<h4>' + item.item + '</h4>';
            showItem += '<p>' + item.category + '</p>';
            //if(myVar.searchOptions.distance != "") {
                showItem += '<span class="ui-li-aside mini">is <span class="mini-inner">' + parseFloat(item.distance).toFixed(2) + '</span> kilometres away</span>';
            //}
            showItem += '<span class="ui-li-count">' + item.price + ' baht</span>';
            showItem += '</a></li>';
            $('#itemList').append(showItem).listview('refresh');
            //$('#itemList').listview('refresh'); //This is fucking important for showing jQuery mobile list
        }
    });
}

function sortByPrice(check) {
    myVar.arrayItemList.sort(function(a,b){
        if(check)
            return a.price - b.price;
        else
            return b.price - a.price;
        /*if(a.price == b.price)
            return 0;
        if(a.price < b.price)
            return -1;
        if(a.price > b.price)
            return 1;*/
    });
}

function sortByDistance(check) {
    myVar.arrayItemList.sort(function(a,b){
        if(check)
            return a.distance - b.distance;
        else
            return b.distance - a.distance;
    });
}