Dialog.Error = new Class( {
	Extends: Dialog,
	Implements : Options,
	btnText: 'Aceptar',
	initialize : function(text) {
		var options = {text:text};
		options.text = text;
		options.title = 'Error';
		this.parent(options);
		this.content.addClass('err');
		
		this.addButton({text:this.btnText});
		
	}
});
