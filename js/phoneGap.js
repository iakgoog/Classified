var phoneGap = {
    getLocation: function(){
        var getSuccess = function(p) {
            myVar.latVal = p.coords.latitude;
            myVar.lngVal = p.coords.longitude;
            return false;
        };
        var getFail = function() {
            alert("Failed to get location");
            return false;
        };
        navigator.geolocation.getCurrentPosition(getSuccess, getFail);
    }
};