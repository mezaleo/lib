var RequestAjax = new Class( {
	Implements : Options,
	initialize : function(url,object) {
		var obj = {
			estado:500,
			mensaje:'No se pudo realizar el Request a ' + url
		};
		try{
			var request = new Request.JSON( {
				async : false,
				url : url,
				onRequest : function() {
				},
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
			}).post(object);
			//request.setHeader('Last-Modified', 'Sat, 1 Jan 2005 05:00:00 GMT');		
			return obj;
		}catch(ex){
			console.log(ex);
			obj.exception = ex;
			return obj;
		}
	}
});
