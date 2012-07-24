$('#shootPage').live('pageinit', function(event) {
    initShootPage();
});

$('#shootPage').live('pageshow', function(event) {
    
    $('#buttonShoot').click(function () {
        getImage();
        
        phoneGap.getLocation(); //get the exact location where the user shoot a photo
        //test area--------------
        //$('#divFormShoot').show();
        
        //getPhotoPath();
    });

    $('#buttonShootOK').click(function() {
        $('#divShoot').hide();
        $('#divFormShoot').show();
    });

    $('#buttonOK').click(function() {
        $('#contentDialog').hide();
        $('#divFormShoot').show();
    });

    $('#formShoot').submit(function() {
        var err = false;
        $('#divFormShoot').hide();
        
        //form validation
        //$('#name').removeClass("missing");
        $('#itemShootLabel').removeClass("missing");
        $('#categoryShootLabel').removeClass("missing");
        $('#priceShootLabel').removeClass("missing");
        $('#descriptionShootLabel').removeClass("missing");
        
        if($('#itemShoot').val()==null||$('#itemShoot').val()==""){   
            $('#itemShootLabel').addClass("missing");   
            err = true;
        }
        
        if($('#categoryShoot').val()==null||$('#categoryShoot').val()==""){   
            $('#categoryShootLabel').addClass("missing");   
            err = true;
        }
        
        if($('#priceShoot').val()==null||$('#priceShoot').val()==""||$('#priceShoot').val() < 1){   
            $('#priceShootLabel').addClass("missing");   
            err = true;
        }        
        
        if($('#descriptionShoot').val()==null||$('#descriptionShoot').val()==""){   
            $('#descriptionShootLabel').addClass("missing");   
            err = true;
        }
      
        // If validation fails, show Dialog content
        if(err == true){            
            $('#contentDialog').show();
            return false;
        }
        
        /*++++++++++++++++++++++++++++++++ UPLOAD CODE START FROM getPhotoPath ++++++++++++++++++++++++++++++++*/
        //getPhotoPath() if success -> uploadPhoto() if success -> uploadInfo()
        getPhotoPath();
        
        return false;
    });    
});

function initShootPage() {
    $('#searchSpin').hide();
    $('#buttonShootOK').hide();
    $('#divFormShoot').hide();
    $('#contentDialog').hide();
    $('#contentTransition').hide();
    $('#divShoot').show();
}

function clearImage() {
    $('#photo').attr('src', '');
}

function clearForm() {
    $('#name').val('');
    $('#itemShoot').val('');
    $('#descriptionShoot').val('');
}

function getImage() {
    // Successfully aquired image data -> base64 encoded string of the image file
    var getSuccess = function(imageURI) {
        myVar.photoData = imageURI;
        //$('#photo').attr('src', 'data:image/jpeg;base64,' + photoData);
        $('#photo').attr('src', imageURI);
        $('#buttonShootOK').show();
    };
    
    var getFail = function(message) {
        alert(message);
    };
    // Set the image source [library || camera]
    //src = (src == 'library') ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
    //var type = navigator.camera.DestinationType.DATA_URL;
    var type = navigator.camera.DestinationType.FILE_URI;
    var src = navigator.camera.PictureSourceType.CAMERA;
    
    // Aquire the image -> Phonegap API
    navigator.camera.getPicture(getSuccess, getFail, {
        quality: 50,
        destinationType: type,
        sourceType: src,
        correctOrientation: true
    });
}

function getPhotoPath() {
    $.ajax({
       url: 'http://www.iakgoog.comuv.com/getPhotoPath.php',
       dataType: 'jsonp',
       jsonp: 'jsoncallback',
       timeout: 5000,
       success: function(data, status){
           console.log(data);
           //alert("Got photo path successfully!!!");
           myVar.dataFullPath = data.fullPath;
           myVar.dataPath = data.path;
           myVar.dataFileName = data.fileName;
           
           uploadPhoto();
           //uploadInfo();
       },
       error: function(jqXHR, textStatus, errorThrown){
           console.log(jqXHR);
           console.log(textStatus);
           console.log(errorThrown);
           alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
           initShootPage();
           $('#buttonShootOK').show();
           $.mobile.hidePageLoadingMsg();
           return false;
       },
       beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
       complete: function() { /*$.mobile.hidePageLoadingMsg();*/ } //Hide spinner
    });
}

function uploadPhoto() {
    var sendSuccess = function(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        //alert(r.response);
        uploadInfo();
    }

    var sendFail = function(error) {
        alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n ' + error.code);
        initShootPage();
        $('#buttonShootOK').show();
        $.mobile.hidePageLoadingMsg();
        return false;
    }
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = myVar.dataFileName;
    options.mimeType = "image/jpeg";

    var params = new Object();
    params.path = myVar.dataPath;

    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(myVar.photoData, "http://www.iakgoog.comuv.com/uploadPhoto.php", sendSuccess, sendFail, options);
}

function uploadInfo() {
    $.ajax({
        url: 'http://www.iakgoog.comuv.com/uploadInfo.php',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 5000,
        data: {
            fullPath: myVar.dataFullPath,
            item: $('#itemShoot').val(),
            category: $('#categoryShoot').val(),
            price: $('#priceShoot').val(),
            description: $('#descriptionShoot').val(),
            id: id,
            latitude: myVar.latVal,
            longitude: myVar.lngVal
        },
        success: function(data, status){
            console.log(data);
            alert("Your item upload successfully");
            clearImage();
            clearForm();
            initShootPage();
            return false;
        },
        error: function(){
            //console.log(jqXHR);
            //console.log(textStatus);
            //console.log(errorThrown);
            //alert('An unknown error occurred while processing the request on the server. The status returned from the server was: \n '+textStatus+' - '+errorThrown);
            alert('An unknown error occurred while processing the request on the server.');
            initShootPage();
            $('#buttonShootOK').show();
            return false;
        },
        beforeSend: function() { /*$.mobile.showPageLoadingMsg();*/ }, //Show spinner
        complete: function() { $.mobile.hidePageLoadingMsg(); } //Hide spinner
     });
}