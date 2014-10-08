var Formulario = new Class( {
	Implements : Options,
	content : null,
	elements : null,
	okButtonClass:'btn_aceptar',
	bg:null,
	options:{
		minWidth:600
	},
	initialize : function(options) {
		this.elements = new Array();
		this.bg = new Bg();
		this.bg.hide();
		var F = this;
		this.content = new Element('div.rohka-content')
				.injectInside($(document.body));
		
		window.addEvent('resize',function(){
			var width = this.getWidth();
			if(width <= F.options.minWidth || isPhoneBrowser()){
				F.content.addClass('mini-browser-form');
			}else{
				F.content.removeClass('mini-browser-form');
			}
		});
		
		
		if(isPhoneBrowser() || window.getWidth()<= F.options.minWidth){
			this.content.addClass('mini-browser-form');
		}
		
		//this.open();
		
		this.titulo = new Element('div.rohka-titulo', {
			html : options.titulo,
			events : {
				mouseenter : function() {
					// F.content.attach();
				},
				mouseleave : function() {
					// F.content.detach();
				}
			}
		}).injectInside(this.content);
		this.form = new Element('form#form.rohka-form').injectInside(this.content);

		if (options.items != null && options.items.length > 0) {
			options.items.each(function(item) {
				var props = {};
				if (item.title != null && item.title != '') {
					props.placeholder = item.title;
				}
				if (item.editable != null && item.editable == false) {
					props.readonly = 'readonly';
					props.disabled = 'disabled';
				}
				props.value = (item.value != null) ? item.value : '';
				props.name = item.name;

				if (item.type == 'text' || item.type == 'password' || item.type == 'hidden') {
                    

					var i = new Element('input[type="' + item.type + '"]',
							props).injectInside(F.form);
					if(item.events != null){
						i.addEvents(item.events);
					}

					if (item.value != null) {
						i.set('value',item.value);
					}
					if (item.size != null && item.size != '') {
						i.addClass(item.size);
					}
					if (item.required != null && item.required == true) {
						i.addClass('required');
					}
					if (item.name.test('rut')) {
						i.addClass('validate-rut');
						i.addEvent('blur',function(){
							this.set('value',ArreglaRUT(this.value));
						});
					}
					if (item.maxValue != null) {
						i.set('maxValue',item.maxValue);
						i.addClass('validate-maxValue');
					}
					if (item.name.test('email') || item.name.test('correo')) {
						i.addClass('validate-email');
					}
					if(item.validate != null && item.validate.length > 0){
						item.validate.each(function(val){
							i.addClass('validate-'+val);
						});
					}
					if (item.events != null) {
						i.addEvents(item.events);
					}
					F.elements.push( {
						name : item.name,
						element : i
					});
                    
                    
                } else if(item.type == 'color'){
                    var id = Math.random().toString(36).substring(7);
                    var name = Math.random().toString(36).substring(3);
					var color = new Element('input[type="text"][name="color-'+name+'"]#color-'+id,props).injectInside(F.form);
					//new Element("div#cpicker").injectInside(document.body);
					if (item.required != null && item.required == true) {
						color.addClass('required');
					}
					if (item.size != null && item.size != '') {
						color.addClass(item.size);
					}
                    
                    var r = new MooRainbow('color-'+id, {
                        startColor: [0, 0, 0],
                        imgPath: '../lib/js/CBeloch-mooRainbow-bac1a43/Assets/images/',
                        onChange: function(color) {
                            this.element.value = color.hex;
                            //Slick.find(document, "h2").setStyle("color", color.hex);
                        }
                    });
					
					F.elements.push( {
						name : item.name,
						element : color
					});    
                    
				} else if (item.type == 'textarea') {	
					var i = new Element('textarea',
							props).injectInside(F.form);
					if(item.events != null){
						i.addEvents(item.events);
					}

					if (item.size != null && item.size != '') {
						i.addClass(item.size);
					}
					if (item.required != null && item.required == true) {
						i.addClass('required');
					}
					if(item.validate != null && item.validate.length > 0){
						item.validate.each(function(val){
							i.addClass('validate-'+val);
						});
					}
					
					F.elements.push( {
						name : item.name,
						element : i
					});
				} else if (item.type == 'enabled_disabled') {
					var en = new EnableDisable( {
						parent : F.form,
						yes_value : item.value1,
						not_value : item.value2
					});
					F.elements.push( {
						name : item.name,
						element : en.valor
					});
					//new Element('br').injectInside(F.form);
				} else if(item.type == 'date'){
					var date = new Element('input[type="text"]',props).injectInside(F.form);
					if(item.events != null){
						date.addEvents(item.events);
					}
					
					if (item.required != null && item.required == true) {
						date.addClass('required');
					}
					if (item.size != null && item.size != '') {
						date.addClass(item.size);
					}
					date.addClass('date');
					
					new CalendarEightysix(date, {
                        'theme': 'vista',
                        'draggable': true,
                        'startMonday': true,
                        'format': '%Y-%m-%d %H:%M:%S',
                        'defaultDate': null,
                        'toggler': 'txtFechaContador',
                        'disallowUserInput': false,
                        'pickable': true
                    });
					F.elements.push( {
						name : item.name,
						element : date
					});
				}else if(item.type == 'datalist') {
					var i = new Element('input[autocomplete="off"][list="'+item.name+'"][type="text"][name="'+item.name+'"][placeholder="'+item.title+'"]').injectInside(F.form);
					if(item.events != null){
						i.addEvents(item.events);
					}
					var datalist = new Element('datalist#'+item.name).injectInside(F.form);
					item.values.each(function(v){
						var opt = new Element('option',{
							value:v.name,
							valor:v.id
//							'value':v.id,
//							'label':v.name
						}).injectInside(datalist);
//						console.log(v);
						if (v.extra != null) {
							opt.setProperties(v.extra);
							
						}
						
					});
					
					if (item.required != null && item.required == true) {
						i.addClass('required');
					}
					if (item.size != null && item.size != '') {
						i.addClass(item.size);
					}
					if (item.events != null) {
						i.addEvents(item.events);
					}
					F.elements.push( {
						name : item.name,
						element : i
					});
				}else if(item.type == 'combo') {
					var i = new Element('select[name="'+item.name+'"][placeholder="'+item.title+'"]').injectInside(F.form);
					if(item.events != null){
						i.addEvents(item.events);
					}
					//var datalist = new Element('datalist#'+item.name).injectInside(F.form);
					new Element('option',{
						'value':'',
						'html':item.title
					}).injectInside(i);
					if(typeof(item.values) == 'object' && (item.values)instanceof(Array) == false){
						item.values.source.each(function(e){
							var v = "";
							if(item.values.textField.test(" ")){
								var vls = (item.values.textField).split(" ");
								
								if(vls.length > 0){
									vls.each(function(a){
										v = v + " " + e[a];
									});
								}
							}else{
								v = e[item.values.textField];
							}
							
							new Element('option',{
								'value':e[item.values.idField],
								'html':v
							}).injectInside(i);
						});
					}else{
						item.values.each(function(v){
							new Element('option',{
								'value':v.id,
								'html':v.name
							}).injectInside(i);
						});	
					}
					if (item.required != null && item.required == true) {
						i.addClass('required');
					}
					if (item.size != null && item.size != '') {
						i.addClass(item.size);
					}
					F.elements.push( {
						name : item.name,
						element : i
					});
				}
			});
			new Element('br').injectInside(this.form);
			new Element('br').injectInside(this.form);
		}
		if (options.buttons != null && options.buttons.length > 0) {
			options.buttons.each(function(boton) {
				var i = new Element('input[type="button"]', {
					value : boton.value
				}).injectInside(F.form).addClass('half');
				if(boton.name != null){
					i.set('name',boton.name);
				}
				if (boton.type == 'ok') {
					i.addClass(F.okButtonClass);
					if (boton.onClick != null) {
						i.addEvent('click', function() {
							
							var myFormValidator = new Form.Validator.Inline($(F.form));
							
							myFormValidator.add('validate-rut', {
							    errorMsg: 'Rut invalido.',
							    test: function(element){
									element.set('value',ArreglaRUT(element.value));
							        if (element.value.length > 0){
							        	return checkRutField(element.value);
							        }
							    }
							});
							
							myFormValidator.add('validate-maxValue', {
							    //errorMsg: 'Valor invalido.',
							    test: function(element){
									var valor_maximo = element.get('maxValue').toInt();
									this.errorMsg = 'Valor maximo '+valor_maximo+'.';
									//element.set('value',ArreglaRUT(element.value));
							        if (element.value.toInt() > valor_maximo){
							        	return false;
							        }else{
							        	return true;
							        }
							    }
							});
							
							if (myFormValidator.validate()) {
								
								boton.onClick(F.getFormValues());
								//F.close();
							}else{
							}
						});
					}

				} else if (boton.type == 'cancel') {
					i.addClass('btnCancelar');
					if(boton.onClick == null){
						boton.onClick = function(){
							F.close();
						}
					}
					i.addEvent('click', function() {
						boton.onClick();
					});
				}else if (boton.type == 'link'){
					i.addClass('btn_link');
					i.addEvent('click', function() {
						boton.onClick();
					});
				}
			});
			new Element('br').injectInside(this.form);
		}
		
		if (options.hide != null && options.hide == true) {
			this.close();
		}

	},
	clean : function() {
		this.elements.each(function(e) {
			e.element.set('value','');
		});
	},
	open : function() {
		//this.bg = new Bg();
		this.bg.open();
		this.content.addClass('f-open');
	},
	hide : function() {
		this.bg.close();
		this.content.removeClass('f-open');
	},
	close : function() {
		this.hide();
		this.clean();
	},
	get : function(name){
		var el = this.form.getElement('[name="'+name+'"]');
//		if(el.get('list') != null){
//			return $(el.get('list'))
//		}else{
		return el;
//		}
		
	},
	getValue : function(name){
		var field = this.get(name);
		var valor = '';
		if(field.get('list') != null && field.get('value') != null && field.get('value') != ''){
			var el = $(field.get('list'));
			if(el != null){
				return el.getElement('[value="'+field.get('value')+'"]').get('valor');//.capitalize()
			}else{
				return null;
			}
		}else{
			return field.get('value');
		}
		
	},
	setValue : function(obj){
		this.get(obj.name).set('value',obj.value);
	},
	getFormValues : function(){
		var obj = {};
		this.elements.each(function(e) {
			if(e.element.get('list') != null){
				obj[e.name] = $(e.element.get('list')).getElement('[value="'+e.element.get('value')+'"]').get('valor');//.capitalize()
			}else{
				obj[e.name] = e.element.get('value');//.capitalize()
			}
		});
		//	console.log(obj);
		return obj;
	}
	
});
