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
    
    $('#sortPrice').prop("checked", myVar.checkButton.sortPrice).checkboxradio("refresh");
    
    if(!myVar.userEditable) {
		$('#sortDistance').prop("checked", myVar.checkButton.sortDistance).checkboxradio("refresh");
    } else {
        $('#divSortDistance').hide();
    }
    $('#sortDate').prop("checked", myVar.checkButton.sortDate).checkboxradio("refresh");
    
    $('#searchResultsBack').click(function() {
        if(myVar.userEditable) {
            $.mobile.changePage("profile.html", { transition: "slide"} );
        } else {
            $.mobile.changePage("search.html", { transition: "slide"} );
        }
    });
});

$('#searchResultsPage').live('pageshow', function(event) {
    
    if(myVar.searchOptions.addOptions == 1 || myVar.searchOptions.addOptions == 2) {
        ajaxListItem(myVar.url+'/get-items', $.param(myVar.searchOptions));
    } else {
        showItem(myVar.arrayItemList);
    }
    
    $('#sortPrice').click(function() {
        myVar.checkButton.sortPrice = !myVar.checkButton.sortPrice;
        sortByPrice(myVar.checkButton.sortPrice);
        showItem(myVar.arrayItemList);
    });
    
    $('#sortDate').click(function() {
        myVar.checkButton.sortDate = !myVar.checkButton.sortDate;
        sortByDate(myVar.checkButton.sortDate);
        showItem(myVar.arrayItemList);
    });
    
    $('#sortDistance').click(function() {
        myVar.checkButton.sortDistance = !myVar.checkButton.sortDistance;
        sortByDistance(myVar.checkButton.sortDistance);
        showItem(myVar.arrayItemList);
    });
    
});

function ajaxListItem(sendURL, sendData) {
    console.log(sendData);
    $.ajax({
        url: sendURL,
        type: 'GET',
        dataType: 'json',
        data: sendData,
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
    console.log(searchResultsData);
    if(searchResultsData.status == 1) {
        myVar.searchOptions.addOptions = "0"; //CACHE page (will not send AJAX request again if back from itemDetailsPage)
        myVar.isChanged = false;
        $.each(searchResultsData, function(index, item) {
            if(/[\d]/.test(index)) {
                //++++++++++++++++++++++++ convert mysql timestamp to javascript date object ++++++++++++++++++++++++ 
                var t = item.created_date.split(/[- :]/);
                var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                item.created_date = d;
                
                myVar.arrayItemList.push(item);
            }
        });
        showItem(myVar.arrayItemList);
    } else {
        $('#itemNotFound').html("<h2>item not found</h2>");
        return;
    }
}

function srError(jqXHR, textStatus, errorThrown) {
    alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
    return;
}

function pageShowItem(itemID) {
    $.mobile.changePage("itemDetails.html?id="+itemID, { transition: "slide"} );
}

function showItem(listData) {
    $('#itemList').html("");
    $('#itemList').append('<li data-role="list-divider" role="heading">Item List</li>');
    $.each(listData, function(index, item) {
        var showItem = '<li data-theme="c" onClick="pageShowItem('+item.id+');"><a href="">';
        //showItem += '<img src="'+myVar.url+item.path+'" sytle="max-width: 80px; max-height: 80px" />';
        showItem += '<h3>'+item.item_name+'</h3>';
        if(!myVar.userEditable) {
            showItem += '<p>'+parseFloat(item.distance).toFixed(2)+' kms. away</p>';
        }
        showItem += '<span class="ui-li-aside mini"><span class="mini-inner">'+item.created_date.toISOString().replace(/[T]/g," ").replace(/[Z]/g,"")+'</span></span>';
        showItem += '<span class="ui-li-count">&#3647; '+item.price+'</span>';
        showItem += '</a></li>';
        $('#itemList').append(showItem);
    });
    $('#itemList').listview('refresh');
}

function sortByPrice(check) {
    myVar.arrayItemList.sort(function(a,b){
        if(check) {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
        /*if(a.price == b.price)
            return 0;
        if(a.price < b.price)
            return -1;
        if(a.price > b.price)
            return 1;*/
    });
}

function sortByDate(check) {
    myVar.arrayItemList.sort(function(a,b){
        if(check) {
            return b.created_date - a.created_date;
        } else {
            return a.created_date - b.created_date;
        }
    });
}

function sortByDistance(check) {
    myVar.arrayItemList.sort(function(a,b){
        if(check) {
            return a.distance - b.distance;
        } else {
            return b.distance - a.distance;
        }
    });
}