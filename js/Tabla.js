var Tabla = new Class({
	options: null,
	tabla: null,
	contenedor: null,
	comentario: null,
	thead: null,
	tbody: null,
	check: false,
    initialize : function(o) {
		console.log(o);
		this.check = o.check;
		this.contenedor = o.contenedor.addClass('tabla');
		this.comentario = new Element('div').injectInside(this.contenedor);
		this.tabla = new Element('table').injectInside(this.contenedor);
		this.thead = new Element('thead').injectInside(this.tabla);
		this.tbody = new Element('tbody').injectInside(this.tabla);
	},
	setComment : function(comentario) {
		console.log(comentario);
		this.comentario.set('html',comentario);
	},
	addHead : function(arr){
		var tabla = this;
		var tr = new Element('tr').injectInside(this.thead);
		if(this.check){
			var th = new Element('th.checkbox').injectInside(tr);
			new Element('input[type="checkbox"]#selectall',{
				events:{
					click:function(){
						if(this.get('checked') == true){
							tabla.tbody.getElements('[type="checkbox"]').set('checked',true);
						}else{
							tabla.tbody.getElements('[type="checkbox"]').set('checked',false);
						}
					}
				}
			}).injectInside(th);
		}
		arr.each(function(v,k){
			var th = new Element('th',{html:v}).injectInside(tr);
		});
	},
	addRow : function(arr,props){
		
		var tr = new Element('tr').injectInside(this.tbody);
		if(this.check){
			var td = new Element('td.checkbox').injectInside(tr);
			new Element('input[type="checkbox"]',props).injectInside(td);
		}
		
		arr.each(function(v){
			var td = new Element('td').injectInside(tr);
			if (typeof(v) == 'object' && v != null) {
                v.injectInside(td);
            } else {
                td.set('html', v);
            }
			
		});
	},
	vaciar : function(){
		this.resetHead();
		this.resetBody();
	},
	resetHead : function(){
		this.tabla.getElement('thead').empty();
	},
	resetBody : function(){
		this.tabla.getElement('tbody').empty();
	},
	count : function(){
		//console.log(this.tbody.getElements('input[type="checkbox"]')); //$('')
		return this.tbody.getElements('input[type="checkbox"]:checked').length; //$('')
	},
	getChecked : function(){
		return this.tbody.getElements('input[type="checkbox"]:checked');
	}
});
