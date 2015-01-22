var RequestAjax = new Class( {
	Implements : Options,
	initialize : function(url,object,cross) {
		var obj = {
			estado:500,
			mensaje:'No se pudo realizar el Request a ' + url
		};
		try{
			var options = {
				async : false,
				url : url,
				data:object,
				onSuccess : function(response) {
					if(response != null && 
						response instanceof Object == true &&
						response instanceof Array == false){
						obj = response;
					}

				},
				onFailure : function(xhr) {
					obj = {
						estado: 600,
						mensaje: xhr.statusText,
						obj: xhr
					}
				}
			};
			var request = null;
			if(cross != null){
				console.log('jsonp');
				request = new Request.JSONP(options).send();
			}else{
				console.log('json');
				request = new Request.JSON(options).post();
			}
			
			return obj;
		}catch(ex){
			obj.exception = ex;
			return obj;
		}
	}
});
