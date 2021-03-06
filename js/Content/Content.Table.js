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
	jsonOkField: 'estado',
	jsonOkValue: 1,
	noElementChecked:'Debe seleccionar por lo menos un registro.',
	jsonMessageField: 'mensaje',
	refreshButtonText:'Recargar',
	refreshButtonClass:'refresh',
	headerValues:null,
	tableValues:null,
	paginatorDefined: false,
	searchInput:null,
	longTextLength:20,
	tmpDataSource:null,
	options: {
		jsonControllerPath:'controller/',
		jsonControllerPageExtension:'.php',
		jsonGetAction:'get',
		jsonGetParameter:'accion',
		dataSourceObjectsField:'campos',
		downloadList:false,
		downloadListText:'Descargar Lista',
		downloadListProperty:'excel_file',
		conditionalFields:null,
		lastRowButton:null,
		addClassIf:null,
		width:70,
		filter:{},
		height:'auto',
		tableHeight:250,
		tableHeading:'Table',
		comment:null,
		rowTitleField:null,
		basePath:'./',
		searchable:true,
		top:10,
		draggable:false,
		destroyable:false,
		table:null,
		title:null,
		mobileListTitle:'Lista de registros.',
		limite:100,
		check:false,
		radio:false,
		header:null,
		refreshButton:false,
		minimizable:true,
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
		this.fields.addClass(this.tableClass);
		
//		this.content = new Element('div').injectInside(this.options.content).addClass(this.tableClass);
		this.optionsLabel = new Element('div.ttitle',{html:tabla.options.tableHeading}).injectInside(this.fields);
		this.comentario = new Element('div.tcomentario').injectInside(this.fields).hide();
		this.tableHead = new Element('div.table-head').injectInside(this.fields);
		this.tableContent = new Element('div.table-content').injectInside(this.fields).addClass('scrolled').setStyle('height',this.options.tableHeight + 'px');
		this.tabla = new Element('table').injectInside(this.tableContent);
		this.thead = new Element('thead').injectInside(this.tabla);
		this.tbody = new Element('tbody').injectInside(this.tabla);
		this.tfoot = new Element('tfoot').injectInside(this.tabla);
		this.hidePaginator();
		
		if(this.options.comment != null){
			this.setComment(this.options.comment);
		}
		
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
		
		this.currentClass = 1;
		this.showRows(this.pagClass + this.currentClass);
		
		return this;
	},
	setComment : function(comentario) {
		if(this.comentario != null){
			this.comentario.set('html',comentario).show();
		}
	},
	hideHead : function(){
		this.thead.hide();
	},
	showHead : function(){
		this.thead.show();
		if(this.thead.getElements('tr > th').length == 0){
			this.addHead(this.tmpHeadValues);
		}
	},
	addHead : function(arr){
		var tabla = this;
		this.tmpHeadValues = arr;
		var tr = new Element('tr').injectInside(this.thead);
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
		
		if(this.options.expandable != null){
			var th = new Element('th.expandable-th').injectInside(tr);
		}
		
		if(this.options.radio){
			var th = new Element('th').injectInside(tr);
		}
		arr.each(function(v,k){
			if(v instanceof Object){
				if(v.type == 'boolean'){
					new Element('th').injectInside(tr);
				}else{
					var th = new Element('th',{html:v.text}).injectInside(tr);
					if(v.width != null){
						th.setStyle('width',v.width);
					}
				}
			}else{
				var th = new Element('th',{html:v}).injectInside(tr);
			}
			
		});
		if(this.options.lastRowButton != null){
			if(this.options.lastRowButton instanceof Array){
				this.options.lastRowButton.each(function(btn){
					var tmth = new Element('th').injectInside(tr);
					if(btn.width != null){
						tmth.setStyle('width',btn.width);
					}
				});
			}else{
				var tmth = new Element('th').injectInside(tr);
				if(this.options.lastRowButton.width != null){
					tmth.setStyle('width',this.options.lastRowButton.width+'px');
				}
			}
		}
	},
//	addLargeRow:function(text){
//		var me = this;
//		var tr = new Element('tr.large-row').injectInside(me.tbody);
//		new Element('td',{
//			html:text,
//			colspan:(me.tbody.getFirst().getChilds('td').length)
//		}).injectInside(tr);
//		return tr;
//	},
	addBodyHead:function(arr,props){
		var me = this;
		var tr = new Element('tr.b-head').injectInside(me.tbody);
		arr.each(function(a){
			new Element('td',{
				html:a
			}).injectInside(tr);
		});
	},
	addRow : function(arr,props){
		var tabla = this;
		
		var tr = new Element('tr').injectInside(this.tbody);
		if(props != null && this.options.rowTitleField != null && props[this.options.rowTitleField] != ''){
			new ToolTip(props[this.options.rowTitleField],tr);
		}
		
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
						tabla.options.onClick(props,tr);
					}
				});
			}
		}else{
			if(this.options.onClick != null){
				tr.addEvent('click',function(){
					tabla.options.onClick(props,tr);
				});
			}
		}
		
		if(this.options.expandable != null){
			var t = new Element('td.expandable-td',{
				events:{
					click:function(){
						if(tabla.options.expandable.onClick != null){
							if(this.getParent().getNext() == null || this.getParent().getNext().hasClass('tmp-tr') == false){
								$$('.tmp-tr').destroy();
								
								var tmptr = new Element('tr.tmp-tr').inject(tr,'after');
								var tmptd = new Element('td[colspan="'+tr.getElements('td').length+'"]').injectInside(tmptr);
								(function(){
									tmptd.addClass('opn')
								}).delay(50,this);
								(function(){
									tabla.options.expandable.onClick(props,tmptd);
								}).delay(500,this);
							}
						}
					}
				}
			}).injectInside(tr);
			new Element('div').injectInside(t);
		}
		
		//var count
		arr.each(function(v){
			var div = new Element('td').injectInside(tr);
			if (v instanceof Object) {
                v.injectInside(div);
            } else {
            	if(tabla.options.header != null){
					var a = tr.getElements('td[class!="checkbox"][class!="expandable-td"]');
					var b = a.length - 1;
					var c = tabla.options.header[b];
					if(c != null && c.editable != null ){
						var add = false;
						
						if(!('onlyWhenEqualTo' in c.editable)){
							add = true;
						}else if(c.editable.onlyWhenEqualTo == v){
							add = true;
						}
						if(add){
							var inp = null;
							if(c.editable.type == null || c.editable.type == 'date'){
								inp = new Element('input[type="text"][readonly="true"][old-value="'+v+'"].tbletxt',{
									events:{
										click:function(){
											this.set('readonly',false);
											div.addClass('focus');
											this.set('title','Press entero to go on');
											this.select();
										},
										keyup:function(ev){
											if(ev.key == 'enter'){
												if(c.editable.allowEmpty != null && c.editable.allowEmpty == false){
													if(inp.get('value') == '' || inp.get('value') == null){
														new Dialog('No se permiten valores vacios.');
														return;
													}
												}
											
												inp.set('readonly',true);
												inp.set('new-value',inp.get('value'));
												var old = inp.get('old-value');
												var nw = inp.get('new-value');
												
												if(nw != old){
													if(c.editable.handler != null){
														if(c.editable.handler(old,nw,props) == true){
															if(('onlyWhenEqualTo' in c.editable)){
																div.empty();
																div.set('html',nw);
															}else{
																inp.set('value',nw);
																inp.set('old-value',nw);
															}
															div.removeClass('focus');
														}else{
															inp.set('value',v);
														}
													}
												}
											}
										},
										blur:function(ev){
											this.set('readonly',true);
											div.removeClass('focus');
											this.set('title',null);
										}
									}
								}).injectInside(div);
							}else if(c.editable.type == 'combo'){
								inp = new Combo({
									values:{
										arr:[{id:'1',text:'Uno'},{id:'2',text:'Dos'}]
									}
								});
								inp.addClass('tbleslct');
								inp.set('old-value',v);
								inp.injectInside(div);
								div.set('nowrap','nowrap');
							}
							div.addClass('editable-td');
							if(c.alias != null && c.alias.width != null){
								div.setStyle('width',c.alias.width);
							}
							if(c.editable.maxLength != null){
								inp.set('maxlength',c.editable.maxLength);
							}
//								var btn = new Element('input[type="button"].toedit',{
//									events:{
//										click:function(){
//											
//										}
//									}
//								}).injectInside(div);
							if(c.editable.type != null){
								if(c.editable.type == 'date'){
									new Picker.Date(inp, {
										positionOffset: {x: 5, y: 0},
										format: (c.editable.format != null)?c.editable.format:'%d/%m/%Y',
										pickerClass: 'datepicker_bootstrap',
										useFadeInOut: !Browser.ie
									});
								}
							}
							inp.set('value',v);						
						}else{
							div.set('html', v);
						}
					}else if(c != null){
						if(c.alias != null && c.alias.type != null && c.alias.type == 'boolean'){
							var cls = '';
							if(c.alias.trueValue == v){
								cls = 'row-true';
							}else{
								cls = 'row-false';
							}
							new Element('button[type="button"].row-boolean').injectInside(div).addClass(cls);
						}else{
							div.set('html', v);
						}
					}else{
						div.set('html', v);
					}
					if(div != null && v != null && v != ''){
						if(c != null && c.truncate != null && v.length > c.truncate.length){
							var nv = v.substr(0,c.truncate.length);
							div.set('html', nv);
							new ToolTip(v,div);
						}
					}
				}else{
					div.set('html', v);
				}
            }
		});
		if(this.options.lastRowButton != null){
			if(this.options.lastRowButton.length == undefined){
				if(this.options.lastRowButton.addIf == null
						|| props[this.options.lastRowButton.addIf.field] == this.options.lastRowButton.addIf.equalTo){
	
					var td = new Element('td').injectInside(tr);
					var bt = new Element('button[type="button"][html="'+ tabla.options.lastRowButton.text +'"].rowButton',{
						events:{
							click:function(){
								tabla.options.lastRowButton.onClick(props,tr);
							}
						}
					}).injectInside(td);
					
					if(this.options.lastRowButton.addClass != null){
						bt.addClass(this.options.lastRowButton.addClass);
					}
				}else{
					var td = new Element('td').injectInside(tr);
				}
			}else if(this.options.lastRowButton.length > 0){
				this.options.lastRowButton.each(function(btn){
					var td = new Element('td').injectInside(tr);
					var bt = new Element('button[type="button"][html="'+ btn.text +'"].rowButton',{
						events:{
							click:function(){
								btn.onClick(props,tr);
							}
						}
					}).injectInside(td);
					
					if(btn.addClass != null){
						bt.addClass(btn.addClass);
					}
				});
			}else{
				var td = new Element('td').injectInside(tr);
			}
		}
		return tr;
	},
	fillHeader:function(){
		var tabla = this;
		if(this.headerValues != null && this.headerValues.length == 0){
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
			this.tmpDataSource = this.tmpDataSource[this.options.dataSourceObjectsField];
			if(this.tmpDataSource.length > 0){
//				this.setComment('Se ha encontrado '+this.tmpDataSource.length + ((this.tmpDataSource.length > 1)?' registros.':' registro.'));
				
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
			}
		}else{
			this.setComment(this.tmpDataSource[this.jsonMessageField]);
		}
	},
	buildPaginator: function(){
		if(!this.paginatorDefined && this.thead != null){
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
	setFilter:function(obj){
		this.options.filter = obj;
	},
	clearFilter:function(){
		this.searchInput.set('value','');
		this.tmpDataSource = this.dataSource;
		this.fillTable();
	},
	filter:function(searchValue){
		var tabla = this;
		if(tabla.dataSource != null && tabla.dataSource[tabla.options.dataSourceObjectsField].length > 0){
			var filter = new Array();
			tabla.dataSource[tabla.options.dataSourceObjectsField].each(function(d){
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
		if(this.tabla != null && this.tabla.getElement('tbody')){
			this.tabla.getElement('tbody').empty();
		}
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
		this.tfoot.show();
	},
	hidePaginator: function(){
		if(this.tfoot != null)
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
		if(this.tfootPrevious != null){
			this.tfootPrevious.setStyle('visibility','hidden');
		}
		
	},
	setDataSource:function(arr){
		if(arr != null && arr.length > 0){
			this.tmpDataSource = {estado:1,mensaje:'Todo ok'};
			this.tmpDataSource[this.options.dataSourceObjectsField] = arr;
		}else{
			this.tmpDataSource = {estado:2,mensaje:'No se encontraron registros'};
			this.tmpDataSource[this.options.dataSourceObjectsField] = arr;
		}
	},
	getDataSource:function(){
		var tabla = this;
//		var getObj = {accion:tabla.options.jsonGetAction};
		var getObj = {};
		getObj[tabla.options.jsonGetParameter] = tabla.options.jsonGetAction;
		
		if(this.options.filter != null){
			getObj = Object.merge(getObj,this.options.filter);
		}
		
		this.dataSource = (new RequestAjax(this.options.basePath + this.options.jsonControllerPath + this.options.table + this.options.jsonControllerPageExtension,getObj));
		this.tmpDataSource = this.dataSource;
		
		return this.dataSource;
	},
	refresh:function(){
		var ds = this.getDataSource();
		this.currentClass = 1;
		this.hidePrevious();
		this.fillTable();
		if(this.checkboxSelectAll != null){
			this.checkboxSelectAll.set('checked',false);
		}
		return ds;
	},
	open : function() {
		var me = this;
		this.parent();
		if(this.options.table != null){
			this.refresh();
		}
		return this;
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
