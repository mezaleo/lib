/****************************************
	Autor:	Leonardo Meza N.			*
	E-mail:	leonardo.meza09@gmail.com	*
	Version:	1.1.1					*
	Date:	2014						*
*****************************************/

Spinner = new Class({
	Implements : Options,
	spinner: null,
	spinnerClass:'spinner',
	initialize : function(el) {
		this.spinner = new Element('div.'+this.spinnerClass).injectInside(el);
		new Element('div').injectInside(this.spinner);
	},
	show : function(){
		$(this.spinner).show();
	},
	hide : function(){
		$(this.spinner).hide();
	}
});