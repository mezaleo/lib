var Bg = new Class({
	Implements : Options,
	bg: null,
	initialize : function() {
		this.bg = new Element('div.bg.bg-close',{
				'events':{
					'show':function(){
						this.removeClass('bg-close');
						this.addClass('bg-open');
					},
					'hide':function(){
						this.removeClass('bg-open');
						this.addClass('bg-close');
						(function(){
							this.destroy();
						}).delay(500,this);
					}
				}
			}).injectInside(document.body);
	},
	open: function(){
		this.bg.removeClass('bg-close');
		this.bg.addClass('bg-open');
	},
	hide: function(){
		this.bg.removeClass('bg-open');
		this.bg.addClass('bg-close');
	},
	close: function(){
		this.hide();
	}
});
