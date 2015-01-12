var Menu = new Class( {
	Implements : Options,
	content : null,
	mobile:false,
	currentOptions:0,
	titleMaxLength:30,
	styles:{
		blue:'dark-blue',
		green:'dark-green'
	},
	options: {
		title:'Nombre Proyecto',
		logo:'none',
		optionsLimit:3,
		minWidth:300
	},
	initialize : function(options) {
		this.setOptions(options);
	
		var menu = this;
		
		this.content = new Element('div.menu_head',{
			events:{
				mouseleave:function(){
					this.set('enter',false);
				},
				mouseenter:function(){
					this.set('enter',true);
				}
			}
		}).injectInside(document.body);
		
		this.title = new Element('div.menu-title').injectInside(this.content);
		this.logo = new Element('div.menu-logo').injectInside(this.content);

		this.sub_cfg = new Element('div.menu-sub.scrolled',{
			open:false,
			events:{
				mouseleave:function(){
					this.set('enter',false);
				},
				mouseenter:function(){
					this.set('enter',true);
				}
			}
		}).injectInside(document.body);
		
		
		this.cfgButton = new Element('div.menu-compact',{
			open:'false',
			enter:'false',
			events:{
				click:function(){
					if(menu.sub_cfg.get('open') == 'false'){
						menu.sub_cfg.addClass('menu-sub-open');
						menu.sub_cfg.set('open','true');
					}else{
						menu.sub_cfg.removeClass('menu-sub-open');
						menu.sub_cfg.set('open','false');
					}
				},
				mouseleave:function(){
					this.set('enter',false);
					if(menu.content.get('enter') == 'false' && menu.sub_cfg.get('enter') == 'false'){
						menu.sub_cfg.hide();
					}
				}
			}
		}).injectInside(this.content);
		
		this.setTitle(options.title);
		this.setLogo(options.logo);
		
		this.moreButton = new Element('div.menu-more',{
			events:{
				click:function(){
					menu.cfgButton.fireEvent('click');
				}
			}
		}).injectInside(this.content);
		
		window.addEvent('resize',function(){
			var width = this.getWidth();
			if(width <= menu.options.minWidth || isPhoneBrowser()){
				if(menu.cfgButton.get('open') == 'false'){
					menu.cfgButton.set('open','true');
					menu.cfgButton.show();	
					menu.moreButton.hide();
					
					menu.content.getElements('.menu-item').each(function(el){
						menu.sub_cfg.grab(el);
					});
					
					menu.sub_cfg.getElements('.sub-menu-item').each(function(sub){
						menu.sub_cfg.grab(sub);
					});
					
					menu.sub_cfg.addClass('menu-mobile');
					menu.content.addClass('mini-browser-menu');
					
				}
			}else{
				if(menu.cfgButton.get('open') == 'true'){
					
					menu.cfgButton.set('open','false');
					menu.cfgButton.hide();
					
					if(menu.currentOptions > menu.options.optionsLimit){
						menu.moreButton.show();
					}
					
					
					menu.sub_cfg.getElements('.menu-item').sort().each(function(el){
						menu.content.grab(el);
					});
					
					menu.content.removeClass('mini-browser-menu');
					menu.sub_cfg.removeClass('menu-mobile');
				}
			}
		});
		
		
		if(window.getWidth() <= menu.options.minWidth || isPhoneBrowser()){
			window.fireEvent('resize');
			this.content.addClass('mini-browser-menu');
		}
		
		
	},
	setTitle:function(text){
		console.log(text);
//		if(text.length > this.titleMaxLength){
//			text = text.substring(0,this.titleMaxLength);
//		}
		this.title.set('html',text);
	},
	add:function(text,props){
		var menu = this;
		var op = new Element('a', {
			html : text,
			events : {
				click : function(){
//                    if(props.closeAll == null || props.closeAll == true){
//                        Page.closeAll();
//                    }
					
					if(props != null){
						if(props.page != null){
							var page = props.page;
							page.open();
							window.location='#'+text;
						}else{
							props.onClick();					
						}	
					}
					
					menu.sub_cfg.removeClass('menu-sub-open');
					menu.sub_cfg.set('open','false');
				}
			}
		});

		if(props != null){
			if(props.href != null){op.set('href',props.href);}
			if(props.tel != null){op.set('tel',props.tel);}
		}
		
		if(this.currentOptions >= this.options.optionsLimit || window.getWidth() <= this.options.minWidth || isPhoneBrowser()){
			this.makeMoreButton();
			if(this.currentOptions >= this.options.optionsLimit){
				op.injectInside(this.sub_cfg);
				op.addClass('sub-menu-item');
			}else{
				op.injectInside(this.sub_cfg);
				op.addClass('menu-item');
			}
		}else{
			op.injectInside(this.content);
			op.addClass('menu-item');
		}
		
		this.currentOptions++;
	},
	makeMoreButton:function(){
		var menu = this;
		if(window.getWidth()>menu.options.minWidth && isPhoneBrowser() == false){
			//new Dialog({text:'entra'});
			this.moreButton.show();	
		}
	},
	isMobile: function(){
		return this.mobile;
	},
	setTitle : function(texto){
		if(texto.length > this.titleMaxLength){
			texto = texto.substring(0,this.titleMaxLength);
		}
		this.title.set('text',texto);
	},
	setLogo: function(logo){
		if(logo != 'none'){
			this.logo.setStyle('background-image',logo);
			this.logo.show();
		}else{
			this.logo.hide();	
		}
	},
	setBlueStyle : function(){
		this.resetStyle();
		this.content.addClass(this.styles.blue);
	},
	setGreenStyle : function(){
		this.resetStyle();
		this.content.addClass(this.styles.green);
	},
	resetStyle : function(){
		this.content.removeClass(this.styles.blue);
		this.content.removeClass(this.styles.green);
	}
});
