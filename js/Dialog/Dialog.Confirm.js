Dialog.Confirm = new Class( {
	Extends: Dialog,
	Implements : Options,
	okText:'Aceptar',
	cancelText:'Cancelar',
	initialize : function(text,options) {
		options.text = text;
		options.autoClose= false;
		this.parent(options);

		this.addButton({text:this.cancelText,funcion:this.options.onCancel});
		this.addButton({text:this.okText,funcion:this.options.onOk});
		
	}
});