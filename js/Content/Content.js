/****************************************
	Autor:	Leonardo Meza N.			*
	E-mail:	leonardo.meza09@gmail.com	*
	Version:	1.1.1					*
	Date:	2014						*
*****************************************/

Content = new Class({
	Implements : Options,
	content: null,
	spinner:null,
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
	options:{
		contentElement:null,
		open:true,
		debug:false,
		title:'<Sin Titulo>',
		top:10,
		width:20,
		align:'center',
		draggable:true,
		minimizable:true,
		destroyable:false,
		closeable:true
	},
	initialize : function(opt) {
		var me = this;
		if(this.options.contentElement == null){
			this.options.contentElement = document.body;
		}
		if(Content.mnmiceContent == null){
			Content.mnmiceContent = new Element('div.'+this.mnmiceContentClass).injectInside(this.options.contentElement);
		}
		/*if(Content.topContent == null){
			Content.topContent = new Element('div#'+this.topContentId).injectInside(this.options.contentElement);
		}
		if(Content.bottomContent == null){
			Content.bottomContent = new Element('div#'+this.bottomContentId).injectInside(this.options.contentElement);
		}
		if(Content.leftContent == null){
			Content.leftContent = new Element('div#'+this.leftContentId).injectInside(this.options.contentElement);
		}
		if(Content.rightContent == null){
			Content.rightContent = new Element('div#'+this.rightContentId).injectInside(this.options.contentElement);
		}*/
		
		this.setOptions(opt);
		this.content = new Element('div.'+this.contentClass,{
			events:{
				click:function(){
					$$('.' + me.contentClass).removeClass(me.focusClass);
					this.addClass(me.focusClass);
				}
			}
		}).injectInside(this.options.contentElement).setStyle('top',me.options.top+'%');
		if(this.options.draggable){
			this.content.addClass(this.draggableClass);
		}
		
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
		
		this.spinner = new Spinner(this.content);
		this.spinner.hide();
		
		//setting width and align
		this.content.setStyle('width',this.options.width+'%');
		if(this.options.align == 'center'){
			this.content.setStyle('left',((100 - this.options.width)/2)+'%');
		}else if(this.options.align == 'right'){
			this.content.setStyle('right',this.minimalBorderDistance);
		}else if(this.options.align == 'left'){
			this.content.setStyle('left',this.minimalBorderDistance);
		}
		
		this.closeBar = new Element('div.'+this.closeBarClass,{
			events:{
				mousedown:function(){
					//draggableClass
					if(me.options.draggable){
						if(me.content.hasClass(me.mnmicedClass) == false){
							var drag = new Drag.Move(me.content, {
								container: me.options.contentElement,
								//droppables: $$('.drop'),
								onStart: function(element, droppable){
								  $$('.' + me.contentClass).removeClass(me.focusClass);
								},
								onDrag: function(element, droppable){
									element.addClass(me.draggingClass);
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
						me.close();
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
		
		//this.tabContent = new Element('div.'+this.tabContentClass).injectInside(this.content);

		//Title
		this.title = new Element('div.'+this.titleClass).injectInside(this.content);
		if(this.options.title != null){
			this.setTitle(this.options.title);
		}
		this.topPanel = new Element('div.'+this.topPanelClass).injectInside(this.content);
		this.topPanelBody= new Element('div.'+this.topPanelBodyClass).injectInside(this.topPanel);
		this.topPanelButtonContent = new Element('div.'+this.topPanelButtonContentClass).injectInside(this.topPanel);
		this.messageLabel = new Element('div.'+this.messageLabelClass).injectInside(this.content);
		//this.showMessage('Hola Mundo...');
		
		this.hide();
		if(this.options.open == true){
			this.open();
		}

		this.fields = new Element('form.'+this.fieldsClass).injectInside(this.content);
		this.buttons = new Element('div.'+this.buttonsClass).injectInside(this.content);
		//debug trace
		if(this.options.debug == true){
			console.log('\n\n<Debugging>');
			console.log(this);
			console.log(this.content);
			console.log('</Debugging>\n\n');
		}
	},
	setComboValues : function(props,el){
		this.comboValues.empty();
		var me = this;
		if(el != null){		
			props.values.each(function(v){
				new Element('div[html="'+v[props.valueName]+'"]',{
					events:{
						click:function(){
							el.set('id',v[props.indexName]);
							el.set('value',v[props.valueName]);
							me.hideComboValues();
							this.addClass('selected');
							if(props.onChange!=null){
								console.log('change');
								props.onChange(me);
							}
						}
					}
				}).injectInside(me.comboValues);
			});
		}
		return this;
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
	},
	hideBody : function(){
		this.fields.addClass('hidden');
		this.buttons.addClass('hidden');
	},
	showBody : function(){
		this.fields.removeClass('hidden');
		this.buttons.removeClass('hidden');
	},
	hideMessage : function(message){
		this.messageLabel.hide();
	},
	setTitle : function(text){
		this.title.set('html',text);
		this.setResumeTitle(text);
	},
	setResumeTitle : function(text){
		this.resumeTitle.set('html',text.toString().substring(0, this.resumeTitleLength) + ' ...');
	},
	maximice : function(){
		var me = this;
		this.content.removeClass(this.mnmicedClass);
		//this.content.addClass(this.mxmicedClass);
		this.mnmiceBtn.set('html','_');
		this.options.contentElement.adopt(me.content);
	},
	minimice : function(){
		this.content.removeClass(this.mxmicedClass);
		this.content.addClass(this.mnmicedClass);
		this.mnmiceBtn.set('html','&#915;');
		Content.mnmiceContent.grab(this.content,'top');
	},
	showSpinner : function(){
		this.content.addClass('loading');
		this.spinner.show();
	},
	hideSpinner : function(){
		this.content.removeClass('loading');
		this.spinner.hide();
	},
	open: function(){
		this.content.removeClass(this.hiddenClass);
		this.content.addClass(this.openedClass);
	},
	show:function(){
		this.open();
	},
	hide: function(){
		this.content.removeClass(this.openedClass);
		this.content.addClass(this.hiddenClass);
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
		var b = new Element('div.panel-btn').injectInside(this.topPanelButtonContent).addClass(type).addEvent('click',fn);
		if(type == 'add'){
			b.set('html','+');
		}
	}
}).extend({
	/*topContent:null,
	bottomContent:null,
	leftContent:null,
	rightContent:null,*/
	mnmiceContent : null
});