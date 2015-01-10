/********************************************
	Autor:	Leonardo Meza N.				*
	E-mail:	leonardo.meza09@gmail.com		*
	Version:	1.1.2						*
	Date:	2015							*
	Github:	https://github.com/mezaleo/lib	*
*********************************************/
var Field = new Class({
	Implements : Options,
	requiredClass:'required',
	/*formClass:'c-frm',
	buttonTag:'button',
	comboClass:'combo',
	validateRutClass:'validate-rut',
	validateEmailClass:'validate-email',
	validationFailedMessage:'Existen datos incorrectos',
	dateFieldClass:'date',
	addFieldExistError:'No se puede crear elementos con el mismo nombre.',
	elementArr:null,
	fieldProperties:['title','value','values','name','events','editable','required'],*/
	options:{
		/*top:20,
		draggable:true,
		destroyable:true,
		height:'auto',
		align:'center',
		editable:true,
		values:null*/
		id:null,
		element:'input',
		name:'unnamed',
		title:'Untitled',
		value:'',
		type:'text',
		events:{},
		required:true,
		validators:[],
		maxValue:null,
		minValue:null,
		editable:true,
		disabled:false
	},
	field:null,
	initialize : function(opt) {
		this.setOptions(opt);
		if(this.options.id == null){
			this.options.id = String.uniqueID();
		}
		if(this.options.type == 'date'){
			this.options.type = 'text';
		}
		this.field = new Element(this.options.element+'#'+this.options.id
			+'[type="'+this.options.type+'"]'
			+'[name="'+this.options.name.trim()+'"]'
			+'[placeholder="'+this.options.title+'"]'
			//+'[readonly="'+this.options.editable+'"]'
			//+'[disabled="'+this.options.disabled+'"]'
			+'[value="'+this.options.value.trim()+'"]');
			
		if(this.options.editable == false){
			this.field.set('readonly',true);
		}
		if(this.options.disabled == true){
			this.field.set('disabled',true);
		}
		if(this.options.required){
			this.field.addClass(this.requiredClass);
		}
		if(this.options.maxValue != null){
			this.field.set('maxValue',this.options.maxValue);
		}
		if(this.options.minValue != null){
			this.field.set('minValue',this.options.minValue);
		}
		//console.log(this.field);
		return this.field;
	}
});