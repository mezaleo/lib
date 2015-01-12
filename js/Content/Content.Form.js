/****************************************
	Autor:	Leonardo Meza N.			*
	E-mail:	leonardo.meza09@gmail.com	*
	Version:	1.1.2					*
	Date:	2014						*
*****************************************/
Content.Form = new Class({
	Extends:Content,
	Implements : Options,
	formClass:'c-frm',
	buttonTag:'button',
	comboClass:'combo',
	validateRutClass:'validate-rut',
	validateEmailClass:'validate-email',
	validationFailedMessage:'Existen datos incorrectos',
	dateFieldClass:'date',
	addFieldExistError:'No se puede crear elementos con el mismo nombre.',
	elementArr:null,
	fieldProperties:['title','value','values','name','events','editable','required'],
	options:{
		top:20,
		draggable:true,
		destroyable:true,
		height:'auto',
		align:'center',
		editable:true,
		values:null,
		minWidth:900
	},
	initialize : function(opt) {
		this.parent(opt);
		this.content.addClass(this.formClass);
		this.elementArr = new Array();
	},
	setReadable:function(){
		this.fields.getElements('input').each(function(e){
			e.set('readonly',true);
		});
	},
	setWriteable:function(name){
		this.fields.getElements('input[name="' + name + '"]').set('readonly',false);
	},
	setAllWriteable:function(){
		this.fields.getElements('input').each(function(e){
			e.set('readonly',false);
		});
	},
	hideFields : function(){
		this.fields.hide();
	},
	hideButtons : function(){
		this.buttons.hide();
	},
	existElement:function(name){
		var el = this.getFieldByName(name);
		if(el == null){
			return false;
		}else{
			return true;
		}
	}.protect(),
	addImage : function(name,url){
		if(url != null){
			if(!this.existElement(url)){
				var img = new Element('div[name="'+name+'"].img_label',{
					styles:{
						'background-image': 'url('+url+')'
					}
				}).injectInside(this.fields);
				
				this.elementArr.push({
					element:img,
					setUrl:function(u){
						img.set('background-image','url('+u+')');
					}
				});
				console.log(this.addFieldExistError);
			}
		}else{
			console.log('Debe asignar un nombre al elemento');
		}
		
	},
	addTextLabel : function(text,name){
		if(name != null){
			if(!this.existElement(name)){
				var label = new Element('div.text_label[html="'+text+'"][name="'+name+'"]').injectInside(this.fields);
				this.elementArr.push({
					element:label,
					setText:function(text){
						label.set('html',text);
					},
					getValue:function(){
						return label.get('html');
					}
				});
			}else{
				console.log(this.addFieldExistError);
			}
		}else{
			console.log('Debe asignar un nombre al elemento');
		}
		
	},
	deleteElement:function(name){
		var el = (this.getFieldByName(name.trim().toLowerCase()));
		this.fields.getElements('*[name="'+name.trim().toLowerCase()+'"]').each(function(e){
			e.destroy();
		});
		this.buttons.getElements('*[name="'+name.trim().toLowerCase()+'"]').each(function(e){
			e.destroy();
		});
		this.elementArr.pop(el);
	},
	addField : function(props){
		//TODO HACER EFICIENTE LA CREACION DE FIELD
		var field = new Field(props);
		if(!this.existElement(props.name)){
			var me = this;
			
			if(props.type=='text' || props.type == 'password' || props.type == 'hidden'){
				if(props.name.test('rut')){
					field.addEvent('blur',function(){
						this.set('value',ArreglaRUT(this.value));
					});
					field.addClass(this.validateRutClass);
				}
				if(props.name.test('email')){
					field.addClass(this.validateEmailClass);
				}
			}else if(props.type == 'date'){
				new CalendarEightysix(field, {
	                'theme': 'vista',
	                'alignX':'middle',
	                'startMonday': true,
	                'format': '%Y-%m-%d',
	                'toggler': field,
	                'disallowUserInput': false
	            });
			}
			
			field.injectInside(this.fields);
			
			if(props.validate != null && props.validate.length > 0){
				props.validate.each(function(v){
					field.addClass('validate-'+v);
				});
			}
			if(props.value != null){
				field.set('value',props.value);
			}
			if(this.options.values != null){
				var fv = this.options.values[props.name];
				if(fv != null){
					field.set('value',fv);				
				}
			}
			this.elementArr.push({element:field});
		}else{
			//console.log(this.addFieldExistError);
		}
	},
	addCombo : function(props){
		if(!this.existElement(props.name)){
			if(this.options.editable){
				var me = this;
				var field;
				var values = Object.toQueryString(props.values);
				
				// var lbl = new Element('span').injectInside(this.fields);
				//var c = new Element('select[name="'+props.name.trim().toLowerCase()+'"]').injectInside(lbl);
				//new Element('option[value=""]').injectInside(c);
				
				// props.values.each(function(v){
					// new Element('option[html="'+v[props.valueName]+'"][value="'+v[props.indexName]+'"]').injectInside(c);
				// });
				
				
				field = new Element('input[type="text"][placeholder="'+props.title.trim()+'"][name="'+props.name.trim().toLowerCase()+'"][values="'+values+'"].'+this.comboClass).addClass(me.requiredClass);
				(props.required != null && props.required == false)?field.removeClass(me.requiredClass):null
				field.injectInside(this.fields);
				field.addEvents({
					focus:function(){
						var v = this.get('values');
						v = (v.parseQueryString());
						var a = Object.values(v);
						props.values = a;
						this.addClass('focus');
						me.setComboValues(props,this).showComboValues();
					},
					blur:function(){
						this.removeClass('focus');
					}
				});
				if(props.onChange != null){
					field.addEvent('change',function(){
						props.onChange(field);
						
					});
				}
				if(this.options.editable == false){
					field.set('readonly',true);
				}
				var ob = {element:field,
						updateValues:function(arr){
							field.set('values',Object.toQueryString(arr));
						},
						getText:function(){
							return field.get('value');
						},
						getValue:function(){
							return field.get('id');
						}};
				this.elementArr.push(ob);
				return ob;
			}else{
				props.type = 'text';
				//console.log(props.values);
				this.addField(props);
			}
			
		}else{
			console.log(this.addFieldExistError);
		}
	},
	getFormValues : function(){
		var me = this;
		var values = {};
		
		$(this.fields).getElements('input').each(function(e){
			var name = e.get('name');
			var value = e.get('value');
			if(e.hasClass(me.comboClass)){
				value = e.get('id');
			}
			values[name] = value;
		});
		return values;
	},
	getFieldByName:function(name){
		name = name.trim().toLowerCase();
		var el = null;
		try{
			this.elementArr.each(function(e){
				var elName = e.element.get('name');
				if(elName == name){
					el = e;
					throw "break";
				}
			});
		}catch(e){
		}
		return el;
	},
	addButton : function(props){
		if(!this.existElement(props.name)){
			if(props.skipValidation == null){
				props.skipValidation = false;
			}
			if(props.closeOnClick == null){
				props.closeOnClick = true;
			}
			var me = this;
			var b = new Element(this.buttonTag + '[type="button"][html="' + props.value + '"][name="' + props.name.trim().toLowerCase()+'"].' + props.type,{
				events:{
					click:function(ev){
						var myFormValidator = new Form.Validator.Inline(me.fields);
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
						if(props.skipValidation == false){
							if (myFormValidator.validate()) {
								me.showSpinner();
								me.showMessage('Espere un momento...');
								(function(a,b,c){
									props.onClick(me.getFormValues(),ev,me);
									a.hideMessage();
									a.hideSpinner();
								}).delay((props.delay != null) ? props.delay:500, this, me);
		
								me.hideMessage();
								if(props.closeOnClick){
									me.close();
								}
							}else{
								me.showErrorMessage(me.validationFailedMessage);	
							}
						}
						
						if(props.skipValidation == true){
							if(props.closeOnClick){
								me.close();
							}
							props.onClick(me.getFormValues(),ev,me);
						}
					}
				}
			}).injectInside(this.buttons);
			this.elementArr.push({element:b});
		}else{
			console.log(this.addFieldExistError);
		}
	}
});
