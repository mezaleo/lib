var EnableDisable = new Class( {
	Implements : Options,
	content : null,
	initialize : function(opt) {
		this.content = new Element('div.enabled_disabled', {
			events : {
				click : function() {
					var ch = this.getElement('input[type="button"]');
					if(ch.hasClass('enabled')){
						ch.set('class','disabled');
						ch.set('value',opt.not_value);
						this.set('leo',opt.not_value);
					}else{
						ch.set('class','enabled');
						ch.set('value',opt.yes_value);
						this.set('leo',opt.yes_value);
					}
				}
			}
		}).injectInside(opt.parent);
		this.valor = new Element('input[value="'+opt.yes_value+'"][type="button"].enabled').injectInside(this.content);
		/*new Element('div',{
			html:opt.yes_value
		}).injectInside(this.content);*/
	},
	getValue:function(){
		return this.valor.get('value');
	}
});