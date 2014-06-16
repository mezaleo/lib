var Settings = new Class( {
	Implements : Options,
	content : null,
	initialize : function(options) {
	
//		console.log(options.evento);
//		
//		var parent = options.elemento.getParent().getParent();
//		console.log(options.evento.client);
//		console.log(parent.getCoordinates());
//		console.log(parent.getOffsetParent());
//		console.log(parent.getScrollSize());
	
		if($('settings') == null){
			this.content = new Element('div#settings.scrolled').injectInside($(document.body));
		}else{
			this.content = $('settings');
		}
	},
	add : function(elemento){
		this.content.tween('right','0px');
		elemento.set('title',elemento.get('html'));
		if(this.content.getElements('[title="'+elemento.get('html')+'"]').length == 0){
			elemento.injectInside(this.content);
		}
		
		
	},
	clear : function(){
		this.content.empty();
	}
	
});