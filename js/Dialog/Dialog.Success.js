Dialog.Success = new Class( {
	Extends: Dialog,
	Implements : Options,
	initialize : function(text) {
		var options = {text:text};
		options.text = text;
		options.title = 'Success';
		this.parent(options);
		this.content.addClass('sccss');
		
	}
});
