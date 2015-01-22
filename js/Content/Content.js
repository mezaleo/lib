/****************************************
	Autor:	Leonardo Meza N.			*
	E-mail:	leonardo.meza09@gmail.com	*
	Version:	1.1.1					*
	Date:	2014						*
*****************************************/

var Content = new Class({
	Implements : Options,
	content: null,
	spinner:null,
	mimicClass:'mimic',
	contentClass:'content',
	openedClass:'opened',
	hiddenClass:'hidden',
	closeBarClass:'close-bar-class',
	closeBtnClass:'btn_close',
	mnmiceBtnClass:'btn_mnmice',
	mnmicedClass:'mnmiced',
	mxmicedClass:'mxmiced',
	resumeTitleClass:'resume-title',
	resumeTitleLength:10,
	mnmiceContentClass:'mnmice-content',
	messageLabelClass:'message-label',
	messageLabelErrorClass:'error-message',
	tabContentClass:'tab-content',
	comboValuesContentClass:'combo-values-content',
	draggableClass:'draggable',
	draggingClass:'dragging',
	focusClass:'focus',
	fieldsClass:'fields',
	titleClass:'title',
	buttonsClass:'buttons',
	topContentId:'top-c',
	bottomContentId:'bottom-c',
	leftContentId:'left-c',
	rightContentId:'right-c',
	requiredClass:'required',
	topPanelClass:'top-panel',
	topPanelButtonContentClass:'top-panel-btn-content',
	topPanelBodyClass:'top-panel-body',
	minimalBorderDistance:20,//px
	/*new properties for resize*/
	mobileClass:'c-mini',
	colorsArr:['#375BBD','#D3417C','#D34152','#41A3D3','#6BD341','#F3E629','#F37029','#F32929'],
	options:{
		contentElement:null,
		buttonsOnTop:false,
		debug:false,
		title:'<Sin Titulo>',
		top:10,
		//left:10,
		width:20,
		height:'auto',
		align:'center',
		draggable:true,
		minimizable:false,
		destroyable:false,
		closeable:true,
		confirmCloseText:'Seguro desea cerrar?',
		confirmClose:false,
		onClose:null,
		/*new*/
		minWidth:900,
		mimic:false
	},
	initialize : function(opt) {
		var me = this;
		this.options.minimizable = false;	//on evaluation
		if(this.options.contentElement == null){
			this.options.contentElement = document.body;
		}
		if(Content.mnmiceContent == null){
			Content.mnmiceContent = new Element('div.'+this.mnmiceContentClass);
		}
		
		this.setOptions(opt);
		this.content = new Element('div.'+this.contentClass).injectInside(this.options.contentElement).setStyle('top',me.options.top+'%');
		if(this.options.mimic){
			this.content.addClass(this.mimicClass);
			this.options.draggable=false;
			this.options.closeable=false;
			this.options.minimizable=false;
		}
		if(this.options.draggable){
			this.content.addClass(this.draggableClass);
		}
		
		//width listener to know if is mobile or not
		if(isPhoneBrowser() || window.getWidth() <= this.options.minWidth){
			this.content.addClass(this.mobileClass);
		}
		
		window.addEvent('resize',function(){
			me.onResize();
		});
		
		
		this.comboValuesContent = new Element('div.'+this.comboValuesContentClass).injectInside(this.content);
		new Element('div[html="Seleccione un elemento"]').injectInside(this.comboValuesContent);
		this.comboValues = new Element('div').injectInside(this.comboValuesContent);
		new Element('div[html="Volver"]',{
			events:{
				click:function(){
					me.hideComboValues();
				}
			}
		}).injectInside(this.comboValuesContent);
		
		// this.spinner = new Spinner(this.content);
		// this.spinner.hide();
		
		//setting width and align
		this.content.setStyle('width',this.options.width+'%');
		if(this.options.height == 'auto'){
			this.content.setStyle('height',this.options.height);	
		}else{
			this.content.setStyle('height',this.options.height+'%');
		}
		if(this.options.align == 'center'){
			this.content.setStyle('left',((100 - this.options.width)/2)+'%');
		}else if(this.options.align == 'right'){
			this.content.setStyle('right',this.minimalBorderDistance);
		}else if(this.options.align == 'left'){
			this.content.setStyle('left',this.minimalBorderDistance);
		}
		if('left' in this.options){
			this.content.setStyle('left',this.options.left);
		}
		
		this.closeBar = new Element('div.'+this.closeBarClass,{
			events:{
				mousedown:function(){
					//draggableClass
					if(me.options.draggable){
						if(me.content.hasClass(me.mnmicedClass) == false){
							var drag = new Drag.Move(me.content, {
								container: me.options.contentElement,
								onStart: function(element, droppable){
								},
								onDrag: function(element, droppable){
									element.addClass(me.draggingClass);
									me.focus();
								},
								onSnap: function(element, droppable){
									drag.detach();
									element.removeClass(me.draggingClass);
								},
								onLeave: function(element, droppable){
									drag.detach();
									element.removeClass(me.draggingClass);
								},
								onDrop: function(element, droppable){
									drag.detach();
									element.removeClass(me.draggingClass);
								},
								onCancel: function(element, droppable){
									drag.detach();
									element.removeClass(me.draggingClass);
								}
							});
						}
					}
				}
			}
		}).injectInside(this.content);
		if(this.options.closeable){
			this.closeBtn = new Element('div[text="x"].'+this.closeBtnClass,{
				events:{
					click:function(){
						if(me.options.confirmClose){
							new Dialog.Confirm(me.options.confirmCloseText,{
								onOk:function(){
									if(me.options.onClose != null){
										me.options.onClose();
									}
									me.close();
								}
							});
						}else{
							if(me.options.onClose != null){
								me.options.onClose();
							}
							me.close();
						}
					}
				}
			}).injectInside(this.closeBar);
		}
		if(this.options.minimizable){
			this.mnmiceBtn = new Element('div[html="_"].'+this.mnmiceBtnClass,{
				events:{
					click:function(){
						if(me.content.hasClass(me.mnmicedClass)){
							//MAXIMICE
							me.maximice();
						}else{
							//MINIMICE
							me.minimice();
						}	
					}
				}
			}).injectInside(this.closeBar);
		}
		
		
		this.resumeTitle = new Element('div.'+this.resumeTitleClass).injectInside(this.closeBar);

		//Title
		this.title = new Element('div.'+this.titleClass,{
			events:{
				click:function(){
					me.focus();
				}
			}
		}).injectInside(this.content);
		if(this.options.title != null){
			this.setTitle(this.options.title);
		}
		this.topPanel = new Element('div.'+this.topPanelClass).injectInside(this.content);
		this.topPanelBody= new Element('div.'+this.topPanelBodyClass).injectInside(this.topPanel);
		this.topPanelButtonContent = new Element('div.'+this.topPanelButtonContentClass).injectInside(this.topPanel);
		this.messageLabel = new Element('div.'+this.messageLabelClass).injectInside(this.content);
		
		this.hide();
		

		this.fields = new Element('form.'+this.fieldsClass).injectInside(this.content);
		this.buttons = new Element('div.'+this.buttonsClass);
		if(this.options.buttonsOnTop == true){
			this.buttons.inject(this.fields,'before');
		}else{
			this.buttons.injectInside(this.content);
		}
		//debug trace
		if(this.options.debug == true){
			console.log('\n\n<Debugging>');
			console.log(this);
			console.log(this.content);
			console.log('</Debugging>\n\n');
		}
		
//		if(this.options.open == true){
//			this.open();
//		}
	},
	showComboValues : function(){
		this.comboValuesContent.addClass('showing');
		this.hideBody();
	},
	hideComboValues : function(){
		this.comboValuesContent.removeClass('showing');
		this.showBody();
	},
	showMessage : function(message){
		this.messageLabel.set('html',message).show();
		this.messageLabel.removeClass(this.messageLabelErrorClass);
	},
	showErrorMessage : function(message){
		this.showMessage(message);
		this.messageLabel.addClass(this.messageLabelErrorClass);
	},
	hideBody : function(){
		this.fields.addClass('hidden');
		this.buttons.addClass('hidden');
	},
	showBody : function(){
		this.fields.removeClass('hidden');
		this.buttons.removeClass('hidden');
	},
	hideMessage : function(){
		$(this.messageLabel).hide();
	},
	setTitle : function(text){
		this.title.set('html',text);
		this.setResumeTitle(text);
	},
	setResumeTitle : function(text){
		this.resumeTitle.set('html',text.toString().substring(0, this.resumeTitleLength) + ' ...');
	},
	maximice : function(){
//		var me = this;
//		this.content.set('class',this.tmpClass);
//		this.mnmiceBtn.set('html','_');
//		this.options.contentElement.adopt(me.content);
////		this.content.removeEvent('click');
//		this.minimiceElement.destroy();
//		console.log('mmmmmmmmmmmmmmmmm');
//		this.content.show();
		this.content.show();
	},
	minimice : function(){
		var me = this;
		this.content.hide();

		this.minimiceElement = new Element('div[html="'+me.title.get('html')+'"]',{
			events:{
				click:function(){
					me.content.show();
					this.destroy();
				}
			}
		}).injectInside(Content.mnmiceContent);
	},
	showSpinner : function(){
		this.content.addClass('loading');
		// this.spinner.show();
	},
	hideSpinner : function(){
		$(this.content).removeClass('loading');
		// this.spinner.hide();
	},
	open: function(){
		if(this.isMinimiced()){
			this.maximice();
		}else{
			this.content.show();
		}
		this.focus();
	},
	show:function(){
		this.open();
		return this;
	},
	hide: function(){
//		this.content.removeClass(this.openedClass);
//		this.content.addClass(this.hiddenClass);
		this.content.hide();
	},
	close: function(){
		if(this.options.destroyable){
			this.content.destroy();	
		}else{
			this.hide();
		}
	},
	addTopPanelButton:function(type,fn){
		this.topPanel.show();
		var b;
		if(type == 'add' || type == 'reload' || type == 'delete'){
			var title = null;
			if(type == 'add'){
				title = 'Ingresa nuevo registro';
			}else if(type == 'reload'){
				title = 'Actualizar lista';
			}else if(type == 'delete'){
					title = 'Eliminar registro';	
			}
			b = new Element('div.panel-btn[title="'+title+'"]').injectInside(this.topPanelButtonContent).addClass(type).addEvent('click',fn);
			if(type == 'add'){
				b.set('html','+');
			}
		}else{
			b = new Element('button.panel-btn[html="'+type+'"]').injectInside(this.topPanelButtonContent).addEvent('click',fn);
		}
		return b;
	},
	focus:function(){
		var me = this;
		$$('.' + me.contentClass).removeClass(me.focusClass);
		this.content.addClass(me.focusClass);
	},
	blur:function(){
		var me = this;
		(function(){
			me.content.removeClass(me.focusClass);
		}).delay(500, this);
	},
	isMobile : function(){
//		if(this.content.hasClass(this.mobileClass)){
//			return true;
//		}else{
			return false;
//		}
	},
	isMinimiced : function(){
		return this.content.hasClass(this.mnmicedClass);
	},
	onResize: function(){
		var width = window.getWidth();
		if(width <= this.options.minWidth || isPhoneBrowser()){
			this.content.addClass(this.mobileClass);
		}else{
			this.content.removeClass(this.mobileClass);
		}
	}
}).extend({
	mnmiceContent : null,
	closeAll:function(){
		$$('.content').hide();
	}
});