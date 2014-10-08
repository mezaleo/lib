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
	dateFieldClass:'date',
	fieldProperties:['title','value','values','name','events','editable','required'],
	options:{
		top:20
	},
	initialize : function(opt) {
		this.parent(opt);
		this.content.addClass(this.formClass);
	},
	hideFields : function(){
		this.fields.hide();
	},
	hideButtons : function(){
		this.buttons.hide();
	},
	addTextLabel : function(text){
		new Element('div.text_label[html="'+text+'"]').injectInside(this.fields);
	},
	addField : function(props){
		var me = this;
		//var cntnt =  new Element('div').injectInside(this.fields);
		var field;
		if(props.type=='text' || props.type == 'password'){
			field = new Element('input[type="'+props.type+'"][placeholder="'+props.title+'"][name="'+props.name+'"]');
			
			
			if(props.name.test('rut')){
				field.addEvent('blur',function(){
					this.set('value',ArreglaRUT(this.value));
				});
				field.addClass(this.validateRutClass);
			}
		}else if(props.type == 'date'){
			field = new Element('input[type="text"][placeholder="'+props.title+'"][name="'+props.name+'"].'+this.dateFieldClass);
			new CalendarEightysix(field, {
                'theme': 'vista',
                'alignX':'middle',
                'startMonday': true,
                'format': '%Y-%m-%d %H:%M:%S',
                'toggler': field,
                'disallowUserInput': false,
            });
		}
		(props.required != null && props.required == true)?field.addClass(me.requiredClass):null
		field.injectInside(this.fields);
		if(props.validate != null && props.validate.length > 0){
			props.validate.each(function(v){
				field.addClass('validate-'+v);
			});
		}
	},
	addCombo : function(props){
		var me = this;
		//var cntnt =  new Element('div').injectInside(this.fields);
		var field;
		//parse arr to string
		var values = Object.toQueryString(props.values);
		field = new Element('input[type="text"][placeholder="'+props.title+'"][name="'+props.name+'"][values="'+values+'"].'+this.comboClass);
		field.injectInside(this.fields);
		field.addEvents({
			focus:function(){
				//parset string to object arr
				var v = this.get('values');
				v = (v.parseQueryString());
				//var a = (Array.from(v));
				var a = Object.values(v);
				//read each element of the object as arr
				//Object.each(v,function(i){
					//console.log(i);
				//});
				//a.each(function(c,x){
					//console.log(c+x);
				//});
				props.values = a;
				this.addClass('focus');
				me.setComboValues(props,this).showComboValues();
			},
			blur:function(){
				this.removeClass('focus');
			}
		});
		return {element:field,updateValues:function(arr){
			field.set('values',Object.toQueryString(arr));
		}};
	},
	getFormValues : function(){
		var me = this;
		var values = {};
		
		this.fields.getElements('input').each(function(e){
			var name = e.get('name');
			var value = e.get('value');
			if(e.hasClass(me.comboClass)){
				value = e.get('id');
			}
			values[name] = value;
		});
		return values;
	},
	addButton : function(props){
		var me = this;
		var b = new Element(this.buttonTag + '[type="button"][html="' + props.value + '"][name="' + props.name+'"].' + props.type,{
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
						
						//boton.onClick(F.getFormValues());
						//F.close();
						me.showSpinner();
						me.showMessage('Espere un momento...');
						(function(a,b,c){
							props.onClick(me.getFormValues(),ev,me)
							a.hideMessage();
							a.hideSpinner();
						}).delay(1000,this,me);
					//}else{
					}
					
					
					
					if(props.closeOnClick){
						me.close();
					}

					
//					(function(a,b,c){
//						
//					}).delay(3000,this,me);
				}
			}
		}).injectInside(this.buttons);
	}
});