function customAjaxCall(_url, _method, _dataType, _data, _success, _serverError, _generalError) {
	
	$.ajax({
        url : _url,
        type : _method,           
        dataType : _dataType,
        contentType: "application/json; charset=utf-8",
        data : _data,
        success : function(data) {            
            if(data){
            	// SUCCESS
            	$.mobile.changePage( _success, {role: "dialog", transition: "slidedown"});
            } else {
            	// SERVER PROBLEMS
            	$.mobile.changePage( _serverError, {role: "dialog", transition: "slidedown"});
            }
        },
        error : function(xhr, type) { 
        	// NETWORK - I/O ERROR
        	$.mobile.changePage( _generalError, {role: "dialog", transition: "slidedown"});
        } 
  });

}