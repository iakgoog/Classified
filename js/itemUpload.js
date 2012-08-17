$('#itemUploadPage').live('pageshow', function(event) {
    processUploadItem();
});

function processUploadItem() {
    $.mobile.showPageLoadingMsg();
    if(!myVar.userEditable) { //if user upload new item
        // 1. get photo path then (client side processing)
        // 2. upload photo using Phonegap filetransfer API if success do (4) if not return
        // 3. INSERT item details to the database via web-service PHP Slim backend if not success return
        getPhotoPath();
    } else { //if user update his/her item
        uploadInfo();
    }
}

function getPhotoPath() { // (1) if success do (2)
    var d = new Date();
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    myVar.dataPath = "upload/"+d.getFullYear()+"/"+monthName[d.getMonth()]+"/";
    myVar.dataFileName = get.MD5(d.toISOString().replace(/[T]/g," ").replace(/[Z]/g,""))+".jpg";
    myVar.dataFullPath = "/"+myVar.dataPath+myVar.dataFileName;
    
    console.log("Finish get photo path !!!");
    uploadPhoto();
    //uploadInfo();
}

function uploadPhoto() { // (2) if success do (3)
    var sendSuccess = function(r) {
        myVar.photoData = "";
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        
        uploadInfo();
    };
    
    var sendFail = function(error) {
        $.mobile.hidePageLoadingMsg(); //Hide spinner
        alert('uploadPhoto FAILED\nerror.code: '+error.code);
        $.mobile.changePage("itemForm.html", { transition: "slide", reverse: true });
    };
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = myVar.dataFileName;
    options.mimeType = "image/jpeg";

    var params = new Object();
    params.path = myVar.dataPath;

    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(myVar.photoData, myVar.url+"/upload-photo", sendSuccess, sendFail, options);
}

function uploadInfo() { // (3) last item upload process
    if(myVar.userEditable) {
        var itemData = JSON.stringify({
            "itemName": myVar.itemForm.itemNameUpload,
            "category": myVar.itemForm.itemCategoryUpload,
            "price": myVar.itemForm.itemPriceUpload,
            "description": myVar.itemForm.itemDescriptionUpload
        });
        var itemDataPath = '/update-item/'+myVar.itemForm.itemId;
    } else {
        var itemData = JSON.stringify({
            "fullPath": myVar.dataFullPath,
            "itemName": myVar.itemForm.itemNameUpload,
            "category": myVar.itemForm.itemCategoryUpload,
            "price": myVar.itemForm.itemPriceUpload,
            "description": myVar.itemForm.itemDescriptionUpload,
            "latitude": myVar.latVal,
            "longitude": myVar.lngVal,
            "personId": myVar.userId
        });
        var itemDataPath = '/upload-item';
    }
    console.log("<<<< LOG uploadData >>>> : "+itemData);
    console.log("<<<< LOG record >>>> : "+itemDataPath);
    $.ajax({
        url: myVar.url+itemDataPath,
        type: 'POST',
        dataType: 'json',
        data: itemData,
        success: function(data){
            console.log(data);
            if(myVar.userEditable) {
                myVar.prepareAjaxReload();
                alert("Item ["+myVar.itemForm.itemNameUpload+"] has been updated");
                $.mobile.changePage("itemDetails.html?id="+myVar.itemForm.itemId, { transition: "slide", reverse: true });
            } else {
                console.log(">>>>>>>>>>>>>>>>>>>>>> DONE UPLOAD");
                myVar.getPhotoRes = false;
                alert("Item ["+myVar.itemForm.itemNameUpload+"] has been uploaded");
                $.mobile.changePage("shoot.html", { transition: "slide", reverse: true });
            }            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('item upload FAILED\ntextStatus: '+textStatus+'\nerrorThrown: '+errorThrown);
            $.mobile.changePage("itemForm.html", { transition: "slide", reverse: true });
        },
        beforeSend: function() { },
        complete: function() { $.mobile.hidePageLoadingMsg(); } //Hide spinner
    });
}