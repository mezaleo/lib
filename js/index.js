window.addEvent('domready', function() {
	MooTools.lang.setLanguage("es-ES");

	// var div_menu = new Element('div#menu_head');
	
	
	var visor = new Visor();
	visor.add({
		title:'ideas nuevas',
		subTitle:'Soluciones Informaticas, desarrollos integrales.',
		color:'#fafafa',
		background:'url(css/bg3.png)',
		buttons:[{value:'Contactanos',onClick:function(){
			new Dialog({text:'Boton #3!'});
		}}]
	});
	visor.add({
		background:'url(css/bg3.png)'
	});
	visor.add({
		background:'url(css/bg3.png)'
	});

	visor.start();

	
	var menu = new Menu({
		optionsLimit:2,
		logo:'url(css/logo.png)',
		style:'blue',
		minWidth:700
	});
	
	menu.setBlueStyle();
	
	menu.add('Home',{
		onClick:function(){
			new Dialog({text:'Opcion en desarrollo'});
		}
	});
	menu.add('Nuestro Equipo',{
		onClick:function(){
			
		}
	});
	var form_setTitle = new Formulario({
		titulo:'Contacto',
		hide: false,
		mobile: true,
		legend:'Ingresa los datos necesarios',
		items: [{
			type: 'text',
			size: 'big',
			title: 'Razon Social',
			name: 'razon_social',
			required: true,
			editable : true
		},{
			type: 'text',
			size: 'big',
			title: 'Correo',
			name: 'correo',
			required: true,
			editable : true
		},{
			type: 'text',
			size: 'big',
			title: 'Asunto',
			name: 'razon_social',
			required: true,
			editable : true
		},{
			type: 'textarea',
			size: 'big',
			title: 'Mensaje',
			name: 'mensaje',
			required: true,
			editable : true
		}],
		buttons: [{
			type: 'ok',
			value: 'Aceptar',
			onClick : function(obj){
				menu.setTitle(obj.titulo);
			}
		},{
			type: 'cancel',
			value: 'Cancelar',
			onClick : function(){
				form_setTitle.close();
			}
		}]
	});
	
	// form_setTitle.open();
	
	menu.add('Que hacemos',{
		onClick:function(){
			
		}
	});
	
	menu.add('Contacto',{
		onClick:function(){
			form_setTitle.open();
		}
	});

});