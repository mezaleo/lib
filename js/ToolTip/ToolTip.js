var ToolTip = new Class( {
	Implements : Options,
	initialize : function(text,el) {
		var me = this;
		this.content;
		el.addEvents({
			'mouseenter':function(ev){
//				console.log(ev);
//				console.log(this.getCoordinates());
//				console.log(ev.target.offsetLeft);
//				console.log(ev.target.offsetTop);
				me.content = new Element('div.lmtooltip',{
					html:text,
					styles:{
						top:this.getCoordinates().top + this.getCoordinates().height,
						left:this.getCoordinates().left
					},
					events:{
						mouseleave:function(){
							me.close();
						}
					}
				}).injectInside(document.body);
				
			},
			'mouseleave':function(){
				me.close();
			},
			'click':function(){
				me.close();
			}
		});
	},
	close: function(){
		$(this.content).destroy();
	},
	open: function(){
		this.content.show();
	}
	
});
