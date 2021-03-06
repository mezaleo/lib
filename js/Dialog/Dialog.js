var Dialog = new Class( {
	Implements : Options,
	options:{
		minWidth: 600,
		title:'Mensaje',
		text:'Dialog: No se ha definido mensaje.',
		autoClose:false,
		autoCloseDelay:3000,
		onOk:function(){
	
		},
		onCancel:function(){
			
		}
	},
	initialize : function(options) {
		//console.log(typeof(options));
	
		if(typeof(options) == 'object'){
			this.setOptions(options);
		}else if(typeof(options) == 'string'){
			this.options.text = options;
		}

		var Dlog = this;
		this.content = new Element('div.dialog_content').injectInside(document.body);
		
		
		window.addEvent('resize',function(){
			var width = this.getWidth();
			if(width <= Dlog.options.minWidth || isPhoneBrowser()){
				Dlog.content.addClass('mini-browser-dialog');
			}else{
				Dlog.content.removeClass('mini-browser-dialog');
			}
		});
		
		
		if(isPhoneBrowser() || window.getWidth()<= this.options.minWidth){
			this.content.addClass('mini-browser-dialog');
		}
		
		this.title = new Element('div.dialog_title').injectInside(this.content);
		this.setTitle(this.options.title);
		
		this.closeButton = new Element('div.dialog_close_button',{
			events:{click:function(){Dlog.close();}}
		}).injectInside(this.title);
		
		this.textContent = new Element('p.dialog_text_content').injectInside(this.content);
		this.setText(this.options.text);
		
		this.buttons = new Array();
		//this.addButton({text:'Aceptar'});
		//this.addButton({text:'Cancelar'});
		this.open();
	},
	close: function(){
		this.content.destroy();
	},
	open: function(){
		var me = this;
		
		this.content.set('morph',{duration:200, transition: 'linear'});
		this.content.morph({
//			dtop:'170',
			opacity: 1
		});
		
		if(this.options.autoClose){
			(function(){
				me.close()
				
			}).delay(me.options.autoCloseDelay,this)
		}
	},
	setText: function(text){
		this.textContent.set('html',text);
	},
	setTitle: function(text){
		this.title.set('html',text);
	},
	addButton: function(button){
		var Dlog = this;
		var btn = new Element('input[type="button"][value="'+button.text+'"]').injectInside(this.content);
		btn.addEvent('click',function(){
			if(button.funcion != null){
				button.funcion();	
			}
			Dlog.close();
		});
		this.buttons.push(btn);
	}
	
});
