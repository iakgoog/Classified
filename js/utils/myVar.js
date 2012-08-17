var myVar = {
    //url : "http://localhost/api-classified",
    url : "http://iakgoog.comuv.com",
    photoData : "",
    latVal : null,
    lngVal : null,
    //latVal : 18.783157, //for test only (the office's latitude)
    //lngVal : 98.978807, //for test only (the office's longitude)
    windowH : null,
    windowW : null,
    userId : null,
    email : null,
    password : null,
    username : null,
    address : null,
    province : null,
    dataFullPath : null,
    dataPath : null,
    dataFileName : null,
    arrayItemList : [],
    getPhotoRes : false,
	userEditable : false,
	isChanged : false,
	nameAvailable : false,
	mailAvailable : false,
	currentPassword : false,
    searchOptions : {
        "addOptions" : "",
        "catSearch" : "",
        "pricedFrom" : "",
        "pricedTo" : "",
        "distance" : "",
        "myLat" : "",
        "myLng" : "",
		"ownerId" : ""
    },
    itemForm : {
        "itemId" : "",
        "itemNameUpload" : "",
        "itemCategoryUpload" : "",
        "itemPriceUpload" : "",
        "itemDescriptionUpload" : ""
    },
    checkButton : {
        "sortPrice" : false,
        "sortDate" : false,
        "sortDistance" : false
    },
    reset : function() {
        this.photoData = "";
        this.latVal = null;
        this.lngVal = null;
        //this.latVal = 18.783157; //for test only (the office's latitude)
        //this.lngVal = 98.978807; //for test only (the office's longitude)
        this.windowH = null;
        this.windowW = null;
        this.userId = null;
        this.email = null;
        this.password = null;
        this.username = null;
        this.address = null;
        this.province = null;
        this.dataFullPath = null;
        this.dataPath = null;
        this.dataFileName = null;
        this.arrayItemList = [];
        this.getPhotoRes = false;
        this.userEditable = false;
        this.isChanged = false;
        this.nameAvailable = false;
        this.mailAvailable = false;
        this.currentPassword = false;
        this.searchOptions = {
            "addOptions" : "",
            "catSearch" : "",
            "pricedFrom" : "",
            "pricedTo" : "",
            "distance" : "",
            "myLat" : "",
            "myLng" : "",
            "ownerId" : ""
        };
        this.itemForm = {
            "itemId" : "",
            "itemNameUpload" : "",
            "itemCategoryUpload" : "",
            "itemPriceUpload" : "",
            "itemDescriptionUpload" : ""
        };
        this.checkButton = {
            "sortPrice" : false,
            "sortDate" : false,
            "sortDistance" : false
        };        
    },
    prepareAjaxReload : function() { //RELOAD ajax in search results page
        this.arrayItemList.length = 0;
        this.searchOptions.addOptions = "2";
        this.isChanged = true;
    }
};

$.fn.clearForm = function() {
    return this.each(function() {
        var type = this.type, tag = this.tagName.toLowerCase();
        if (tag == 'form')
            return $(':input',this).clearForm();
        if (type == 'text' || type == 'password' || tag == 'textarea')
            this.value = '';
        else if (type == 'checkbox' || type == 'radio')
            this.checked = false;
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
};