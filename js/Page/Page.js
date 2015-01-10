var Page = new Class( {
	Implements : Options,
	options:{
		minWidth: 700,
		title:'Titulo',
		subTitle:'Sub titulo',
		hashUrl:'Pagina 1',
		bodyText:'Hola Mundo',
        footerText:'No date'
	},
	initialize : function(options) {
		//console.log(typeof(options));
		this.setOptions(options);
		var Me = this;
		this.content = new Element('div.page_content').injectInside(document.body);
		
		
		window.addEvent('resize',function(){
			var width = this.getWidth();
			if(width <= Me.options.minWidth || isPhoneBrowser()){
				Me.content.addClass('mini-browser-page');
			}else{
				Me.content.removeClass('mini-browser-page');
			}
		});
		
		
		if(isPhoneBrowser() || window.getWidth()<= this.options.minWidth){
			this.content.addClass('mini-browser-page');
		}
		
        this.content_bg = new Element('div.page_bg').injectInside(this.content);
		this.title = new Element('div.page_title').injectInside(this.content_bg);
		this.sub_title = new Element('div.page_sub_title').injectInside(this.content_bg);
		this.setTitle(this.options.title);
        this.setTitleColor(this.options.titleColor);
		this.setSubTitle(this.options.subTitle);
		
		/*this.closeButton = new Element('div.page_close_button',{
			events:{click:function(){Me.close();}}
		}).injectInside(this.title);*/
		
		this.textContent = new Element('p.page_text_content').injectInside(this.content_bg);
		this.setText(this.options.bodyText);
        this.footerLegend = new Element('p.page_footer').injectInside(this.content);
        this.setFooter(this.options.footerText);
		
		this.buttons = new Array();
		//this.addButton({text:'Aceptar'});
		//this.addButton({text:'Cancelar'});
		//this.open();
	},
	close: function(){
		this.content.hide();
	},
	open: function(){
        //Page.closeAll();
		//window.location='#'+this.options.hashUrl;
		//this.content.set('morph',{duration:200, transition: 'linear'});
		this.content.show();
		/*this.content.morph({
			top:'170',
			opacity: 1
		});*/
	},
	setText: function(text){
		this.textContent.set('html',text);
	},
    setFooter: function(text){
		this.footerLegend.set('html',text);
	},
	setTitle: function(text){
		this.title.set('html',text);
	},
    setTitleColor: function(color){
		this.title.setStyle('color',color);
	},
	setSubTitle: function(text){
		this.sub_title.set('html',text);
	},
	addButton: function(button){
		var Me = this;
		var btn = new Element('input[type="button"][value="'+button.text+'"]').injectInside(this.content);
		btn.addEvent('click',function(){
			if(button.funcion != null){
				button.funcion();	
			}
			Me.close();
		});
		this.buttons.push(btn);
	}
	
}).extend({
	get:function(modelo){
		if(modelo == null){
			modelo = {};
		}
		var post = modelo;
		post.accion = 'get';
		
		var response = new RequestAjax("/eventos/controller/page.php",post);
		//console.log(response);
		
		return response;
		
	},
	add:function(pagina){
		if(pagina == null){
			pagina = {};
		}
		var post = pagina;
		post.accion = 'add';

		var d = new Dialog({text:'Espere por favor...'});
		(function(){
            var response = new RequestAjax("/eventos/controller/page.php",post);
			d.setText(response.mensaje,{});
			
			return response;
			
		}).delay(1000,this);
		

	},
	closeAll: function(){
        //console.log('closeAll Method was called.');
		//$$('.page_content').hide();
	}
});
