//console.log(new Date());
window.addEvent('domready',function(){

Element.implement({
	setFocus: function(index) {
		this.setAttribute('tabIndex',index || 0);
		this.focus();
	}
});
var tb1 = new Content.Table({
		title:'Administrar Trabajos Diferidos',
		jsonGetParameter:'method',
		jsonGetAction:'get',
		crossDomain:true,
		jsonControllerPath:'deferral/',
		basePath:'../',
		jsonControllerPageExtension:'.do',
		dataSourceObjectsField:'rows',
		table:'admDeferral',
//		searchable:false,
		width:40,
		tableHeight:330,
		tableHeading:'Lista de diferidos generados.',
		comment:'La siguiente lista despliega los diferidos generados hasta la fecha.',
		top: 24,
		closeable:false,
		addClassIf:{
			field:'incompleto',
			className:'warn',
			equalTo:true
		},
		expandable:{
			onClick:function(content,obj){
//				content.set('html',new Date());
			}
		},
		lastRowButton:[{
			text:'Ver',
			onClick:function(o){
				//updateDW(o.dw_nmr_moc,o.dewo_hub);
			}
		},{
			text:'Ver2',
			onClick:function(o){
				//updateDW(o.dw_nmr_moc,o.dewo_hub);
			}
		},{
			text:'Ver',
			onClick:function(o){
				//updateDW(o.dw_nmr_moc,o.dewo_hub);
			}
		}],
		header:[{
			field:'dw_nmr_moc',
			alias:'N MOC',
			editable:{
				handler:function(a,b,c){
					console.info(a);
					console.info(b);
					console.info(c);
					return true;
				}
			}
		},{
			field:'sd',
			alias:'Date',
			editable:{
				type:'date',
				handler:function(a,b,c){
					console.info(a);
					console.info(b);
					console.info(c);
					return true;
				}
			}
		}],
		filter:{
			paginaActual:1
		}
	});

	tb1.open();

});