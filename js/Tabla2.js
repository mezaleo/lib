var Tabla = new Class({
	Implements : Options,
	searchAfterEnter:false,
	pagClass : 'p_',
	tableClass : 'tabla',
	tableIdPrefix:'id_',
	previousText:'<',
	nextText:'>',
	jsonControllerPath:'controller/',
	jsonGetAction: 'get',
	jsonDeleteAction: 'delete',
	jsonOkField: 'estado',
	jsonOkValue: 1,
	noElementChecked:'Debe seleccionar por lo menos un registro.',
	jsonMessageField: 'mensaje',
	deleteButtonText:'Eliminar',
	deleteSuccessText:'Registros eliminados exitosamente!',
	refreshButtonText:'Recargar',
	refreshButtonClass:'refresh',
	headerValues:null,
	tableValues:null,
	paginatorDefined: false,
	searchInput:null,
	tmpDataSource:null,
	tmpDataSource:null,
	options: {
		table:null,
		deleteButton:false,
		content:document.body,
		comment:'Its a new table',
		limite:10,
		check:false,
		refreshButton:true,
		onClick:function(obj){
		}
	},
	contenedor: null,
	comentario: null,
	thead: null,
	tbody: null,
	currentClass: 1,
	minClass:1,
    initialize : function(o) {
		this.setOptions(o);
		this.headerValues = new Array();
		this.tableValues = new Array();
		var tabla = this;
		
		this.contenedor = new Element('div').injectInside(this.options.content).addClass(this.tableClass);
		this.optionsLabel = new Element('div.tol').injectInside(this.contenedor);
		
		this.comentario = new Element('div.tcomentario').injectInside(this.contenedor);
		this.tabla = new Element('table').injectInside(this.contenedor);
		this.thead = new Element('thead').injectInside(this.tabla);
		this.tbody = new Element('tbody').injectInside(this.tabla);
		this.tfoot = new Element('tfoot').injectInside(this.tabla);
		
		this.setComment(this.options.comment);
		
		if(this.options.header!=null && this.options.table != null){
			this.getDataSource();
			this.fillTable();
			//buscador
			this.searchInput = new Element('input[type="text"][placeholder="Busqueda..."]',{
				events:{
					keyup:function(ev){
						if(tabla.searchAfterEnter){
							if(ev.key == 'enter'){
								tabla.filter(this.get('value'));
							}
						}else{
							tabla.filter(this.get('value'));
						}
						
					}
				}
			}).injectInside(this.optionsLabel);
		}
		this.buildPaginator();
		if(this.options.refreshButton){
			this.addButton(this.refreshButtonText,function(){
				tabla.refresh();
			});
		}
		
		if(this.options.deleteButton){
			this.addButton(this.deleteButtonText, function(){
				var selected = tabla.getChecked();
				var selected_count = selected.length;
				if(selected_count > 0){
					selected.each(function(s){
						var obj = {};
						var id = tabla.tableIdPrefix+tabla.options.table;
						obj['accion']=tabla.jsonDeleteAction;
						obj[id] = s[id];
						new RequestAjax(tabla.jsonControllerPath + tabla.options.table+'.php',obj);
					});
					tabla.refresh();
					new Dialog(tabla.deleteSuccessText);
				}else{
					new Dialog(tabla.noElementChecked);
				}
				
				
			});
		}
		
	},
	setComment : function(comentario) {
		//console.log(comentario);
		this.comentario.set('html',comentario);
	},
//	setComponentLabel : function() {
//		//console.log(comentario);
//		this.comentario.set('html',comentario);
//	},
	addHead : function(arr){
		var tabla = this;
		var tr = new Element('tr').injectInside(this.thead);
		if(this.options.check){
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
		var tabla = this;
		var tr = new Element('tr').injectInside(this.tbody);
		
		if(this.countAllByClass(this.pagClass+this.currentClass) == this.options.limite){
			tr.addClass(this.pagClass+(++this.currentClass));
			
		}else{
			tr.addClass(this.pagClass+(this.currentClass));
		}
		
		if(this.options.check){
			var td = new Element('td.checkbox').injectInside(tr);
			var ck = new Element('input[type="checkbox"]',{
				object:Object.toQueryString(props)
			}).injectInside(td);
			ck.addEvents({
				mouseenter:function(){
					this.addClass('ckhover');
				},
				mouseleave:function(){
					this.removeClass('ckhover');
				}
			});
			if(this.options.onClick != null){
				tr.addEvent('click',function(){
					if(!ck.hasClass('ckhover')){
						tabla.options.onClick(props);
					}
				});
			}
			
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
	fillTable: function(){
		this.resetBody();
		var tabla = this;
		//this.tmpDataSource = this.dataSource;
		//this.dataSource = (new RequestAjax(this.jsonControllerPath + this.options.table+'.php',{accion:tabla.jsonGetAction}));
		if(this.tmpDataSource[this.jsonOkField] == this.jsonOkValue){
			this.tmpDataSource = this.tmpDataSource.campos;
			if(this.tmpDataSource.length > 0){
				this.setComment('Se ha encontrado '+this.tmpDataSource.length + ((this.tmpDataSource.length > 1)?' registros.':' registro.'));
				
				var rows = new Array();
				//var head = new Array();
				//set header
				if(this.headerValues.length == 0){
					this.options.header.each(function(h){
						tabla.headerValues.push(h.alias);
					});
					//add table header
					this.addHead(this.headerValues);	
				}
				if(this.tmpDataSource.lengtj <= this.options.limite){
					this.hidePaginator();
				}
				this.tmpDataSource.each(function(d,k){
					var arr = new Array();
					tabla.options.header.each(function(h){
						var val = d[h.field];
						if(val != null){
							arr.push(val.capitalize());
						}else{
							console.log(h.field+' No existe en el objeto.');
							arr.push('');
						}
						
					});
					tabla.tableValues.push(arr);
					tabla.addRow(arr,d);
				});
				this.currentClass = 1;
				this.showRows(this.pagClass + this.currentClass);
				//this.addRow(rows);
				if(this.countAllByClass(this.pagClass + (this.minClass+1)) == 0){
					this.hideNext();
				}	
			}else{
				//this.hidePaginator();
				//this.setComment('No existen registros.');
				//console.log('No existen registros.');
			}
		}else{
			//console.log(this.tmpDataSource[this.jsonMessageField]);
			this.setComment(this.tmpDataSource[this.jsonMessageField]);
		}
	},
	buildPaginator: function(){
		if(!this.paginatorDefined){
			this.paginatorDefined = true;
			var tabla = this;
			var cols = tabla.thead.getElements('tr');
			if(cols != null){
				cols = cols.getElements('th');
				if(cols[0]!=null){
					cols = cols[0].length;
				}
			}else{
				cols = 0;
			}
			
			var tr = new Element('tr').injectInside(this.tfoot);
			var td = new Element('td',{
				'colspan':cols
			}).injectInside(tr);
			this.tfoot = td;
			
			
			this.tfootPrevious = new Element('div.tfoot_previous',{
				text:tabla.previousText,
				events:{
					click:function(){
						if(tabla.countAllByClass(tabla.pagClass+(tabla.currentClass-1)) > 0){
							tabla.showRows(tabla.pagClass+(--tabla.currentClass));
							if(tabla.countAllByClass(tabla.pagClass+(tabla.currentClass-1)) == 0){
								tabla.hidePrevious();
							}
							tabla.showNext();
							//tabla.tfootNext.show();
						}
					}
				}
			}).injectInside(this.tfoot);
			this.hidePrevious();
			
			this.tfootNext = new Element('div.tfoot_next',{
				text:tabla.nextText,
				events:{
					click:function(){
						if(tabla.countAllByClass(tabla.pagClass+(tabla.currentClass+1)) > 0){
							tabla.showRows(tabla.pagClass+(++tabla.currentClass));
							if(tabla.countAllByClass(tabla.pagClass+(tabla.currentClass+1)) == 0){
								tabla.hideNext();
							}
							tabla.showPrevious();
						}
					}
				}
			}).injectInside(this.tfoot);
			
		}
	},
	clearFilter:function(){
		this.searchInput.set('value','');
		this.tmpDataSource = this.dataSource;
		this.fillTable();
	},
	filter:function(val){
		var tabla = this;
		if(tabla.dataSource != null && tabla.dataSource.campos.length > 0){
			console.log();
			var filter = new Array();
			tabla.dataSource.campos.each(function(d){
				var str = Object.toQueryString(d);
				if((str.toUpperCase()).test(val.toUpperCase())){
					filter.push(d);
				}
			});
			tabla.setDataSource(filter);
			//console.log(filter);
			tabla.fillTable();
			
		}
	},
	vaciar : function(){
		this.resetHead();
		this.resetBody();
	},
	hideRows:function(){
		this.tbody.getElements('tr').hide();
	},
	showRows:function(c){
		this.hideRows();
		this.getByClass(c).setStyle('display','table-row');
	},
	resetHead : function(){
		this.tabla.getElement('thead').empty();
	},
	resetBody : function(){
		this.tabla.getElement('tbody').empty();
	},
	countAllByClass : function(c){
		return this.getByClass(c).length; 
	},
	getByClass : function(c){
		return this.tbody.getElements('tr.'+c); 
	},
	countAll : function(){
		return this.tbody.getElements('tr').length;
	},
	countChecked : function(){
		return this.tbody.getElements('input[type="checkbox"]:checked').length; //$('')
	},
	getChecked : function(){
		var slctd = this.tbody.getElements('input[type="checkbox"]:checked');
		var arr = new Array();
		slctd.each(function(s){
			arr.push(s.get('object').parseQueryString());
		});
		//console.log(arr);
		return arr;
	},
	showPaginator: function(){
		this.showNext();
		this.showPrevious();
	},
	hidePaginator: function(){
		this.hideNext();
		this.hidePrevious();
	},
	showNext: function(){
		if(!this.paginatorDefined){
			this.buildPaginator();
		}
		this.tfootNext.setStyle('visibility','visible');
	},
	showPrevious: function(){
		if(!this.paginatorDefined){
			this.buildPaginator();
		}
		this.tfootPrevious.setStyle('visibility','visible');
	},
	hideNext: function(){
		if(!this.paginatorDefined){
			this.buildPaginator();
		}
		this.tfootNext.setStyle('visibility','hidden');
	},
	hidePrevious: function(){
		if(!this.paginatorDefined){
			this.buildPaginator();
		}
		this.tfootPrevious.setStyle('visibility','hidden');
	},
	show: function(){
		Tabla.hideAll();
		this.clearFilter();
		this.contenedor.show();
	},
	hide:function(){
		this.contenedor.hide();
	},
	setDataSource:function(arr){
		if(arr != null && arr.length > 0){
			this.tmpDataSource = {estado:1,mensaje:'Todo ok',campos:arr};
		}else{
			this.tmpDataSource = {estado:2,mensaje:'No se encontraron registros',campos:arr};
		}
	},
	getDataSource:function(){
		var tabla = this;
		this.dataSource = (new RequestAjax(this.jsonControllerPath + this.options.table+'.php',{accion:tabla.jsonGetAction}));
		this.tmpDataSource = this.dataSource;
	},
	refresh:function(){
		this.getDataSource();
		this.currentClass = 1;
		this.hidePrevious();
		this.fillTable();
	},
	addButton:function(text,fn){
		new Element('input[type="button"][value="'+text+'"]',{
			events:{
				click:fn
			}
		}).injectInside(this.optionsLabel);
	}
}).extend({
	hideAll:function(){
		$$('.tabla').hide();
	}
});
