/********************************************
	Autor:	Leonardo Meza N.				*
	E-mail:	leonardo.meza09@gmail.com		*
	Version:	1.1.2						*
	Date:	2015							*
	Github:	https://github.com/mezaleo/lib	*
*********************************************/
var Combo = new Class({
	Implements : Options,
	requiredClass:'required',
	element:'select',
	options:{
		id:null,
		injectInside:null,
		name:'unnamed',
		title:'Untitled',
		values:{
			valueProperty:'id',
			textProperty:'text',
			arr:null
		},		//Array
		events:{},		//Object
		required:false,
		validators:[],	//Array
		readOnly:true,
		disabled:true
	},
	combo:null,
	initialize : function(opt) {
		var me = this;
		this.setOptions(opt);
		
		if(this.options.id == null){
			this.options.id = String.uniqueID();
		}
		this.combo = new Element('select#'+this.options.id
			+'[name="'+this.options.name.trim()+'"]');
		console.log(this.options);
		if(this.options.injectInside != null){
			this.combo.injectInside(this.options.injectInside);
		}
		this.combo.addEvents(this.options.events);
		
		if(this.options.readOnly == true){
			this.combo.set('readonly',true);
		}
		if(this.options.disabled == true){
			this.combo.set('disabled',true);
		}
		if(this.options.required){
			this.combo.addClass(this.requiredClass);
		}
		if(this.options.values != null){
			if(this.options.values instanceof Object){
				if(this.options.values.arr != null && this.options.values.arr.length > 0){
					this.options.values.arr.each(function(v){
						new Element('option[value="'+v[me.options.values.valueProperty]+'"][html="'+v[me.options.values.textProperty]+'"]').injectInside(me.combo);
					});
				}
			}
		}
		return this.combo;
	}
});