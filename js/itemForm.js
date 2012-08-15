$('#itemFormPage').live('pageinit', function(event) {
    
    if(myVar.userEditable) {
        itemEditForm();
    }
    
    var itemValidator = $('#itemForm').validate({
        onkeyup: function(element) {
            $(element).valid();
        },
        rules: {
            itemNameUpload: {
                required: true
            },
            itemCategoryUpload: {
                required: true,
            },
            itemPriceUpload: {
                required: true,
                min: 1
            },
            itemDescriptionUpload: {
                required: true
            }
        },
        messages: {
            itemNameUpload: {
                required: "Please name your item."
            },
            itemCategoryUpload: {
                required: "Please categorize your item."
            },
            itemPriceUpload: {
                required: "Please evaluate your item.",
                min: "Price should not be less than &#3647;1."
            },
            itemDescriptionUpload: {
                required: "Please describe your item."
            }
        }        
    });
    
    //++++++++++++++++ select tag need to be refreshed after validation ++++++++++++++++
    $("#itemCategoryUpload").change(function () {
        $(this).selectmenu("refresh");
    });
    
    $('#uploadCancel').click(function() {
        itemValidator.resetForm();
        $('#itemForm').clearForm();
        //++++++++++++++++ select tag need to be refreshed its value is changed programmatically ++++++++++++++++
        $('#itemCategoryUpload :first-child').prop('selected','selected');
        $('#itemCategoryUpload').selectmenu("refresh");
    });
    
    $('#itemForm').submit(function() {
        if($(this).valid()) {
            myVar.itemForm.itemNameUpload = $('#itemNameUpload').val();
            myVar.itemForm.itemCategoryUpload = $('#itemCategoryUpload').val();
            myVar.itemForm.itemPriceUpload = $('#itemPriceUpload').val();
            myVar.itemForm.itemDescriptionUpload = $('#itemDescriptionUpload').val();
            
            $.mobile.changePage("itemUpload.html", { transition: "slidedown"});
        } else {
            return false;
        }
    });
    
});

function itemEditForm() {
    $('#itemNameUpload').val(myVar.itemForm.itemNameUpload);
    //++++++++++++++++ select tag need to be refreshed its value is changed programmatically ++++++++++++++++
    $('#itemCategoryUpload').children('option[value="'+myVar.itemForm.itemCategoryUpload+'"]').prop('selected','selected');
    $('#itemCategoryUpload').selectmenu("refresh");
    $('#itemPriceUpload').val(myVar.itemForm.itemPriceUpload);
    $('#itemDescriptionUpload').val(myVar.itemForm.itemDescriptionUpload);
}