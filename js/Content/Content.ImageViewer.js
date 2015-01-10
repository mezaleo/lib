/****************************************
	Autor:	Leonardo Meza N.			*
	E-mail:	leonardo.meza09@gmail.com	*
	Version:	1.3.0					*
	Date:	2014						*
*****************************************/

Content.ImageViewer = new Class( {
	Extends:Content,
	Implements : Options,
    options: {
		width:30,
		height:'auto',
		top:20,
		title:'Subir Imagen'
	},
	initialize : function(opt) {
		this.parent(opt);
		
	}
});
