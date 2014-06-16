var Usuario = new Class( {
	Implements : Options,
	content : null,
	currentElements:0,
	options: {
		limit:10,
		minWidth:600
	},
	initialize : function(options) {
	}
}).extend({
	controllerUrl:'controller/usuario.php',
	login:function(usuario){
		return (new RequestAjax(Usuario.controllerUrl,{accion:'login'}));
	},
	getCurrentIdUsuario:function(usuario){
		return (new RequestAjax(Usuario.controllerUrl,{accion:'get_id_usuario'}));
	},
	get:function(usuario){
		if(usuario == null)
			usuario = {};
		usuario.accion = 'get';
		return (new RequestAjax(Usuario.controllerUrl,usuario));
	},
	add:function(usuario){
		usuario.accion = 'add';
		var rq = new RequestAjax(Usuario.controllerUrl,usuario);
		new Dialog(rq.mensaje);
		return rq;
	},
	del:function(usuario){
		return (new RequestAjax(Usuario.controllerUrl,{accion:'delete'}));
	},
	getForm : function(fn){
		var frm = new Formulario({
			titulo:'Nuevo Usuario',
			hide: false,
			mobile: true,
			legend:'Ingresa los datos necesarios',
			items: [{
				type: 'text',
				size: 'big',
				title: 'Rut Usuario',
				name: 'rut',
				required: true,
				editable : true
			},{
				type: 'text',
				size: 'big',
				name: 'nombre',
				title: 'Nombre',
				required: true,
				editable : true
			},{
				type: 'text',
				size: 'big',
				name: 'apellido',
				title: 'Apellido',
				required: true,
				editable : true
			},{
				type: 'text',
				size: 'big',
				name: 'email',
				title: 'Correo',
				required: true,
				editable : true
			},{
				type: 'password',
				size: 'big',
				name: 'password',
				title: 'Password',
				required: true,
				editable : true			
			},{
				type: 'combo',
				size: 'big',
				name: 'id_perfil',
				title: 'Perfil',
				values:{source:Perfil.get().campos,idField:'id_perfil',textField:'nombre'},
				required: true,
				editable : true			
			}],
			buttons: [{
				type: 'ok',
				value: 'Ingresar',
				onClick : function(c){
					var res = Usuario.add(c);
					if(res.estado == 1 && fn != null){
						fn();
					}
					frm.close();
				}
			},{
				type: 'cancel',
				value: 'Cancelar',
				onClick : function(){
					frm.close();
				}
			}]
		});
	
		return frm;
	}
	
});
