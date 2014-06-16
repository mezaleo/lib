window.addEvent('domready', function() {
	MooTools.lang.setLanguage("es-ES");
	
	
	var funcion = function(obj){
		console.log(obj);
	};
	
	
	var form = new Form({
		titulo:'Formulario de muestra',
		hide: true,
		legend:'Ingresa los datos necesarios',
		items: [{
			type: 'text',
			size: 'big',
			//value: 'Nombre de Usuario',
			title: 'Nombre de Usuario',
			name: 'nombre_usuario',
			editable : false
		},{
			type: 'text',
			size: 'big',
			//value: 'Nombre de Usuario',
			title: 'Numero Telefonico',
			name: 'telefono',
			editable : true,
			required : true
		},{
			type: 'password',
			size: 'big',
			//value: 'Password',
			name: 'password',
			title: 'Password',
			editable : true
		},{
			type: 'text',
			size: 'big',
			//value: 'Password',
			name: 'igor_roman',
			title: 'Igor Roman',
			editable : true
		}],
		buttons: [{
			type: 'ok',
			value: 'Ingresar',
			onClick : funcion
		},{
			type: 'cancel',
			value: 'Cancelar',
			onClick : funcion
		}]
	});
	
	form.open();
	

});