/****************************************
	Autor:	Leonardo Meza N.			*
	E-mail:	leonardo.meza09@gmail.com	*
	Version:	1.3.0					*
	Date:	2014						*
*****************************************/

Content.Table = new Class({
	Extends:Content,
	Implements : Options,
	searchAfterEnter:false,
	pagClass : 'p_',
	tableClass : 'tabla',
	mobileRowClass:'m-tr',
	mobileRowLongTextClass:'lngtxtreg',
	tableIdPrefix:'id_',
	previousText:'<',
	nextText:'>',
	jsonControllerPath:'controller/',
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
	longTextLength:30,
	tmpDataSource:null,
	options: {
		jsonGetAction:'get',
		downloadList:false,
		downloadListText:'Descargar Lista',
		downloadListProperty:'excel_file',
		conditionalFields:null,
		lastRowButton:null,
		addClassIf:null,
		width:70,
		filter:{},
		height:'auto',
		open:false,
		basePath:'./',
		searchable:true,
		top:10,
		draggable:false,
		table:null,
		deleteButton:false,
		title:'Its a new table',
		mobileListTitle:'Lista de registros.',
		limite:100,
		check:false,
		radio:false,
		header:null,
		refreshButton:true,
		minimizable:false,
		onClick:function(obj){
		}
	},
	comentario: null,
	thead: null,
	tbody: null,
	currentClass: 1,
	checkboxSelectAll:null,
	minClass:1,
    initialize : function(o) {
		this.setOptions(o);
		o.onResize = this.onResize;
		this.parent(o);
		
		if(Content.Table.tablesArray == null){
			Content.Table.tablesArray = new Array();
		}
		Content.Table.tablesArray.push(this);
		
		this.headerValues = new Array();
		this.tableValues = new Array();
		var tabla = this;
		this.content.addClass(Content.Table.contentClass);
		this.fields.addClass(this.tableClass).addClass('scrolled').setStyle('height','300px');
		
//		this.content = new Element('div').injectInside(this.options.content).addClass(this.tableClass);
		this.optionsLabel = new Element('div.tol').injectInside(this.fields);
		this.comentario = new Element('div.tcomentario').injectInside(this.fields).hide();
		this.tabla = new Element('table').injectInside(this.fields);
		this.thead = new Element('thead').injectInside(this.tabla);
		this.tbody = new Element('tbody').injectInside(this.tabla);
		this.tfoot = new Element('tfoot').injectInside(this.tabla);
		
		this.setComment(this.options.comment);
		if(this.options.header != null && this.options.table != null){
//			this.getDataSource();
//			this.fillTable();
			//buscador
			if(this.options.searchable == true){
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
				}).injectInside(this.topPanelBody);
			}
		}else if(this.options.header != null){
			this.fillHeader();
		}
		
		this.buildPaginator();
		if(this.options.downloadList){
			this.addTopPanelButton(tabla.options.downloadListText, function() {
				tabla.downloadTable();
			});	
		}
		if(this.options.refreshButton){
			this.addTopPanelButton('reload',function(){
				tabla.refresh();
			});
		}
		
		if(this.options.deleteButton){
			this.addTopPanelButton('delete',function(){
				var selected = tabla.getChecked();
				var selected_count = selected.length;
				if(selected_count > 0){
					new Dialog.Confirm('Seguro desea eliminar los registros seleccionados?',{
						onOk:function(){
							selected.each(function(s){
								var obj = {};
								var id = tabla.tableIdPrefix+tabla.options.table;
								obj['accion']=tabla.jsonDeleteAction;
								obj[id] = s[id];
								new RequestAjax(tabla.jsonControllerPath + tabla.options.table+'.php',obj);
							});
							tabla.refresh();
							new Dialog(tabla.deleteSuccessText);
						}
					});
					
				}else{
					new Dialog(tabla.noElementChecked);
				}
				
				
			});
		}
		this.currentClass = 1;
		this.showRows(this.pagClass + this.currentClass);
		
		
	},
	setComment : function(comentario) {
		this.comentario.set('html',comentario);
	},
	addHead : function(arr){
		var tabla = this;
		this.tmpHeadValues = arr;
		var tr = new Element('tr').injectInside(this.thead);
		if(!this.isMobile()){
			if(this.options.check){
				var th = new Element('th.checkbox').injectInside(tr);
				tabla.checkboxSelectAll = new Element('input[type="checkbox"]#selectall',{
					events:{
						click:function(){
							if(this.get('checked') == true){
								tabla.tbody.getElements('[type="checkbox"]').set('checked',true).fireEvent('check');
							}else{
								tabla.tbody.getElements('[type="checkbox"]').set('checked',false).fireEvent('check');
							}
						}
					}
				}).injectInside(th);
			}
			if(this.options.radio){
				var th = new Element('th').injectInside(tr);
			}
			arr.each(function(v,k){
				if(v instanceof Object){
					var th = new Element('th',{html:v.text}).injectInside(tr);
					if(v.width != null){
						th.setStyle('width',v.width);
					}
				}else{
					var th = new Element('th',{html:v}).injectInside(tr);
				}
				
			});
			if(this.options.lastRowButton != null){
				var th = new Element('th').injectInside(tr);
			}
		}else{
			this.setComment(this.options.mobileListTitle);
		}
	},
	addRow : function(arr,props){
		var tabla = this;
		
		var tr = new Element('tr').injectInside(this.tbody);
		
		if(this.countAllByClass(this.pagClass+this.currentClass) == this.options.limite){
			tr.addClass(this.pagClass+(++this.currentClass));
			
		}else{
			tr.addClass(this.pagClass+(this.currentClass));
		}
		if(tabla.options.addClassIf != null){
			if (tabla.options.addClassIf instanceof Array) {
				tabla.options.addClassIf.each(function(cond){
					if(props[cond.field] == cond.equalTo){
						tr.addClass(cond.className);
					}
				});
            } else if(props[tabla.options.addClassIf.field] == tabla.options.addClassIf.equalTo){
				tr.addClass(tabla.options.addClassIf.className);
			}
		}
		
		if(this.isMobile()){
			var lngTd = new Element('td').injectInside(tr);
			var dc = new Element('div.drow').injectInside(lngTd);
			arr.each(function(v){
				var div = new Element('div').inject(dc,'top');
				if (v instanceof Object) {
	                v.injectInside(div);
	            } else {
	            	if(v.length >= tabla.longTextLength){
	            		div.addClass(tabla.mobileRowLongTextClass);
	            		dc.grab(div,'bottom');
	            	}
	                div.set('html', v);
	            }
				
			});
			
			if(this.options.onClick != null){
				tr.addEvent('click',function(){
					tabla.options.onClick(props);
				});
			}
		}else{
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
					},
					check:function(){
						if(this.checked){
							tr.addClass('checked');
						}else{
							tr.removeClass('checked');
						}
					},
					click:function(){
						this.fireEvent('check');
					}
				});
				if(this.options.onClick != null){
					tr.addEvent('click',function(){
						if(!ck.hasClass('ckhover')){
							tabla.options.onClick(props);
						}
					});
				}
			}else{
				if(this.options.onClick != null){
					tr.addEvent('click',function(){
						tabla.options.onClick(props);
					});
				}
			}
			
			arr.each(function(v){
				var div = new Element('td').injectInside(tr);
				if (v instanceof Object) {
	                v.injectInside(div);
	            } else {
	                div.set('html', v);
	            }
				
			});
			if(this.options.lastRowButton != null){
				if(this.options.lastRowButton.addIf == null
						|| props[this.options.lastRowButton.addIf.field] == this.options.lastRowButton.addIf.equalTo){
	
					var td = new Element('td').injectInside(tr);
					new Element('button[type="button"][html="'+ tabla.options.lastRowButton.text +'"].rowButton',{
						events:{
							click:function(){
								tabla.options.lastRowButton.onClick(props);
							}
						}
					}).injectInside(td);
				}else{
					var td = new Element('td').injectInside(tr);
				}
			}
		}
		return tr;
	},
	fillHeader:function(){
		var tabla = this;
		if(this.headerValues.length == 0){
			this.options.header.each(function(h){
				tabla.headerValues.push(h.alias);
			});
			this.addHead(this.headerValues);	
		}
	},
	fillBody:function(){},
	fillTable: function(){
		this.resetBody();
		var tabla = this;
		if(this.tmpDataSource[this.jsonOkField] == this.jsonOkValue){
			this.tmpDataSource = this.tmpDataSource.campos;
			if(this.tmpDataSource.length > 0){
				this.setComment('Se ha encontrado '+this.tmpDataSource.length + ((this.tmpDataSource.length > 1)?' registros.':' registro.'));
				
				var rows = new Array();
				//var head = new Array();
				//set header
				this.fillHeader();
				if(this.tmpDataSource.length <= this.options.limite){
					this.hidePaginator();
				}
				this.tmpDataSource.each(function(d,k){
					var arr = new Array();
					tabla.options.header.each(function(h){
						var val = d[h.field];
						if(tabla.options.conditionalFields != null
							&& tabla.options.conditionalFields.length > 0){
							tabla.options.conditionalFields.each(function(f){
								if(f.field == h.field){
									if(d[h.field] == f.equalTo){
										val = f.thenValue;
									}else{
										val = f.elseValue;
									}
								}
							});
						}
						if(val != null){
							arr.push(val);
						}else{
							console.log(h.field+' No existe en el objeto.');
							arr.push('');
						}
						
					});
					tabla.tableValues.push(arr);
					tabla.addRow(arr,d);
				});
				//this.addRow(rows);
				this.currentClass = 1;
				this.showRows(this.pagClass + this.currentClass);
				
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
	filter:function(searchValue){
		var tabla = this;
		if(tabla.dataSource != null && tabla.dataSource.campos.length > 0){
			var filter = new Array();
			tabla.dataSource.campos.each(function(d){
				try{
				Object.each(d,function(value,key){
					if(value.toUpperCase().test(searchValue.toUpperCase())){
						filter.push(d);
						throw 'brack';
					}
				});
				}catch(e){
				}
			});
			tabla.setDataSource(filter);
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
	showAllRows:function(){
		this.tbody.getElements('tr').setStyle('display','table-row');
		this.hidePaginator();
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
		return arr;
	},
	showPaginator: function(){
//		this.showNext();
//		this.showPrevious();
		this.tfoot.show();
	},
	hidePaginator: function(){
//		this.hideNext();
//		this.hidePrevious();
		this.tfoot.hide();
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
	setDataSource:function(arr){
		if(arr != null && arr.length > 0){
			this.tmpDataSource = {estado:1,mensaje:'Todo ok',campos:arr};
		}else{
			this.tmpDataSource = {estado:2,mensaje:'No se encontraron registros',campos:arr};
		}
	},
	getDataSource:function(){
		var tabla = this;
		var getObj = {accion:tabla.options.jsonGetAction};
		if(this.options.filter != null){
			getObj = Object.merge(getObj,this.options.filter);
		}
		
		this.dataSource = (new RequestAjax(this.options.basePath + this.jsonControllerPath + this.options.table+'.php',getObj));
		this.tmpDataSource = this.dataSource;
	},
	refresh:function(){
		this.getDataSource();
		this.currentClass = 1;
		this.hidePrevious();
		this.fillTable();
		if(this.checkboxSelectAll != null){
			this.checkboxSelectAll.set('checked',false);
		}
	},
	addButton:function(text,fn){
		new Element('input[type="button"][value="'+text+'"]',{
			events:{
				click:fn
			}
		}).injectInside(this.optionsLabel);
	},
	open : function() {
		if(this.options.table != null){
			this.refresh();
		}
		this.parent();
	},
	downloadTable : function(){
		window.location = this.options.basePath + 'tmp/'+this.dataSource[this.options.downloadListProperty];
	},
	hideComment:function(){
		this.comentario.hide();
	}
}).extend({
	contentClass:'cntnt-tb',
	tablesArray:null,
	hideAll:function(){
		Content.Table.tablesArray.each(function(t){
			t.close();
		});
		
	}
});
