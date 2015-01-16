/*******************************************************************************
 * Autor: Leonardo Meza N. * E-mail: leonardo.meza09@gmail.com * Version: 1.1.1 *
 * Date: 2014 *
 ******************************************************************************/

Content.Form.Page = new Class( {
	Extends:Content.Form,
	Implements : Options,
	options : {
		buttonsOnTop:true,
		width:70,
		height:'auto',
		open:false,
		top:10,
		draggable:true,
		title:'Titulo de pagina',
		minimizable:true,
		onClick:function(obj){
		}
	},
	initialize : function(o) {
		this.setOptions(o);
		this.parent(o);
		var me = this;
		
		var rute = '<div id="rute-content"><div id="map_canvas"></div>';
		rute += '<div id="directionsPanel" class="scrolled"></div><div style="display:none	!important;"><input id="address" type="hidden" value="Vitacura 2939, Santiago"></div>';
		
		this.fields.set('html',rute);
//		this.fields.addClass('scrolled');
		this.addButton( {
			closeOnClick : false,
			type : 'success',
			name : 'btnImprimirRuta',
			value : 'Imprimir',
			onClick : function(v, event, frm) {
				var myWindow = window.open('', '',
				'width=400,height=800');
				myWindow.document.write(me.fields.get('html'));
				myWindow.focus();
				myWindow.print();
			}
		});
		
		
	}
});