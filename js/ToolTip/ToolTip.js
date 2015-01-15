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
						mouseenter:function(){
							me.isHover = true;
						},
						mouseleave:function(){
							me.isHover = false;
						}
					}
				}).injectInside(document.body);
				me.isHover = true;
				
			},
			'mouseleave':function(){
				me.isHover = false;
				if(me.content != null && me.isHover == false){
					$(me.content).destroy();
				}
			}
		});
	},
	open: function(){
		this.content.show();
	}
	
});
