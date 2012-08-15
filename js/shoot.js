$('#shootPage').live('pageinit', function(event) {
    $('#photo').prop('src', myVar.photoData);
    $('#buttonShootOK').hide();
    
    $('#buttonShoot').click(function () {
        getImage("shoot");
        //$('#divFormShoot').show();
        //getPhotoPath();
    });
    
    $('#buttonPick').click(function() {
        getImage("pick");
        //test area--------------
        //myVar.latVal = 18.783157;
        //myVar.lngVal = 98.978807;
        //$('#divFormShoot').show();
        //getPhotoPath();
        //$.mobile.changePage("itemForm.html", { transition: "slide"});
    });

    $('#buttonShootOK').click(function() {
        //$('#divShoot').hide();
        //$('#divFormShoot').show();
        $.mobile.changePage("itemForm.html", { transition: "slide"});
    });

});

function getImage(mode) {
    // Successfully aquired image data -> base64 encoded string of the image file
    var getSuccess = function(imageURI) {
        myVar.photoData = imageURI;
        //$('#photo').attr('src', 'data:image/jpeg;base64,' + photoData);
        $('#photo').attr('src', myVar.photoData);
        
        getLocation();
    };
    
    var getFail = function(message) {
        alert(message);
    };
    // Set the image source [library || camera]
    //var type = navigator.camera.DestinationType.DATA_URL;
    var type = navigator.camera.DestinationType.FILE_URI;
    var src = (mode == "pick") ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
    
    // Aquire the image -> Phonegap API
    navigator.camera.getPicture(getSuccess, getFail, {
        quality: 50,
        destinationType: type,
        sourceType: src,
        //targetWidth: 600,
        //targetHeight: 600,
        correctOrientation: true
    });
}

function getLocation() { // (2)
    var getSuccess = function(p) {
        myVar.latVal = p.coords.latitude;
        myVar.lngVal = p.coords.longitude;
        
        $('#buttonShootOK').show();
    };
    
    var getFail = function() {
        $.mobile.hidePageLoadingMsg(); //Hide spinner
        alert("Failed to get location");
        $('#divFormShoot').show();
        return false;
    };
    
    navigator.geolocation.getCurrentPosition(getSuccess, getFail);
}