var Visor = new Class( {
	Implements : Options,
	content : null,
	pause : false,
	count:0,
	options: {
		auto:true,
		minWidth:700,
		frec:4000,//1000 = 1s
		title:'Nombre Proyecto',
		subTitle:'Descripcion imagen'
	},
	initialize : function(options) {
		this.setOptions(options);
		var visor = this;
	
		this.content = new Element('div.visor-content').injectInside(document.body);
		this.sig = new Element('span.visor-next',{
			html:'>',
			events:{
				click:function(){
					visor.next();
					visor.pause = true;
				},
				mouseleave:function(){
					visor.pause = false;
				}
			}
		}).injectInside(this.content);
		this.ant = new Element('span.visor-previous',{
			html:'<',
			events:{
				click:function(){
					visor.previous();
					visor.pause = true;
				},
				mouseleave:function(){
					visor.pause = false;
				}
			}
		}).injectInside(this.content);
//		this.
		
		
		
		if(this.options.auto == false){
			this.pause = true;
		}
		window.addEvent('resize',function(){
			var width = this.getWidth();
			if(width <= visor.options.minWidth || isPhoneBrowser()){
				visor.content.addClass('mini-browser-visor');
			}else{
				visor.content.removeClass('mini-browser-visor');
			}
		});
		if(isPhoneBrowser() || window.getWidth()<= visor.options.minWidth){
			this.content.addClass('mini-browser-visor');
		}


	},
	add : function(obj){
		var visor = this;
//		var obj = {
//			textColor:'white',
//			title:'Titulo',
//			subTitle:'Sub Titulo',
//			buttons:[{
//				name:'btn1',
//				value:'Boton 1',
//				onClick:function(){
//					new Dialog({text:'Hola Mundo!'});
//				}
//			}]
//		};
		
		var a_item = new Element('div.visor-item',{
			events:{
				mouseenter:function(){
					visor.pause = true;
				},
				mouseleave:function(){
					visor.pause = false;
				}
			}
		}).injectInside(this.content);
		
		if(obj.background != null){
			a_item.setStyle('background',obj.background);
		}
		if(obj.color != null){
			a_item.setStyle('color',obj.color);
		}
		
//		if(this.content.getElements('.visor-item').length == 1){
//			a_item.addClass('current');
//		}
		
		var a_titulo = new Element('h1.visor-item-title',{
			text:obj.title
		}).injectInside(a_item);
		var a_subtitulo = new Element('p.visor-item-sub-title',{
			text:obj.subTitle
		}).injectInside(a_item);
		
		if(obj.buttons != null && obj.buttons.length > 0){
			obj.buttons.each(function(e){
				new Element('input[type="button"][value="'+e.value+'"]',{
					events:{
						click:function(){
							e.onClick();
							//visor.previous();
						}
					}
				}).injectInside(a_item);
			});
		}
	},
	next : function(){
		var c = this.content.getElement('div.current');
		var n = c.getNext('div');
		
		if(n == null){
			n = this.content.getFirst('div');
			n.getNext('div').removeClass('left');
		}
		this.ant.show();
		c.removeClass('current');
		c.addClass('left');
		
//		n.removeClass('left');
		n.addClass('current');
		if(n.getNext('div') == null){
//			this.content.getFirst().removeClass('left');
		}else{
//			n.getNext().removeClass('left');
		}
	},
	previous : function(){
		var c = this.content.getElement('div.current');
		var n = c.getPrevious('div');
		
		if(n == null){
			n = this.content.getLast('div');
			n.addClass('left');
			//n.getPrevious().removeClass('left');
		}
		c.removeClass('current');
		//c.addClass('left');
		
		n.removeClass('left');
		n.addClass('current');
		if(n.getPrevious('div') == null){
			this.content.getLast('div').removeClass('left');
		}else{
			n.getPrevious('div').addClass('left');
		}
	},
	start : function(){
		var visor = this;
		this.content.getElement('div').addClass('current');
		//console.log(this.content.getLast().addClass('prev'));
		//console.log(this.content.getFirst().getNext().addClass('next'));
		setInterval(function() {
			if(visor.pause == false){
				visor.next();	
			}
		}, this.options.frec);
	},
	stop:function(){
		this.pause = true;
	}
});
