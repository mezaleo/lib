/****************************************
	Autor:	Leonardo Meza N.			*
	E-mail:	leonardo.meza09@gmail.com	*
	Version:	1.3.0					*
	Date:	2014						*
*****************************************/

Content.Uploader = new Class( {
	Extends:Content.Form,
	Implements : Options,
	inputFileName:'file',
    options: {
		width:30,
		height:'auto',
		top:20,
		title:'Subir Imagen'
	},
	initialize : function(opt) {
		this.parent(opt);
		var me = this;
		
		this.fields.set('method','post');
		this.fields.set('action','index.php');
		this.fields.set('enctype','multipart/form-data');
		
		this.addTextLabel('Seleccione la imagen a cargar');
		
		this.uploadInput = new Element('input[type="file"][name="'+this.inputFileName+'"].required').injectInside(this.fields);
		this.imageUploaded = new Element('input[type="hidden"][name="inputFileName"][value="'+this.inputFileName+'"]').injectInside(this.fields);
		this.addButton({type:'success',name:'btn_aceptar',value:'Subir Imagen',
			delay:0,
			onClick:function(v,event,frm){
				me.fields.submit()
			}
		});
		if(document.body.get('uploaded') == '1'){
			new Dialog("Archivo cargado exitosamente.");
		}
	}
}).extend({
	uploaded:false,
    builded:false,
	add:function(image){
		if(image == null){
			image = {};
		}
		var post = image;
		post.accion = 'add';

		var response = new RequestAjax("controller/image.php",post);
        
        new Dialog(response.mensaje);
        
		return response;
	},
	demo:function(){
		console.log('demo');
	},
	get:function(image){
		if(image == null){
			image = {};
		}
		var post = image;
		post.accion = 'get';
		
		var response = new RequestAjax("controller/image.php",post);
		
		return response;
	},
    openImageViewer:function(modelo){
        if(Image.builded == false){
            Image.build();
        }
        Image.open();
    },
    build:function(){
        if(Image.builded == false){
            Image.builded = true;
            Image.content = new Element('div.image-content').injectInside(document.body);
            Image.title = new Element('div.image-title',{
            	html:'Seleccionar Imagen'
            }).injectInside(Image.content);
            
            Image.uploadBtn = new Element('input[type="button"].image-btn-up.btn_aceptar',{
            	value:'Subir Imagen',
            	events: {
            		click:function(){
            			Image.showUploader();
            		}
            	}
            }).injectInside(Image.title); 
            
            
            Image.images_content = new Element('div.images.scrolled').injectInside(Image.content);
            Image.upload_content = $('upload_content');
            Image.hideUploader();
            
            Image.fill();
        }
    },
    showUploader: function(){
        Image.upload_content.show();
    },
    showViewer: function(){
        Image.content.show();
    },
    hideUploader: function(){
        Image.upload_content.hide();
        console.log(Image.upload_content);
    },
    hideViewer: function(){
        Image.content.hide();
    },
    reload:function(){
    	if(Image.defined){
            Image.images_content.empty();
            Image.fill();
    	}else{
    		Image.build();
    	}
    },
    fill : function(){
        var req = Image.get();
                
        if(req.estado == 1){
            if(req.campos != null && req.campos.length > 0){
                req.campos.each(function(i){
                    var img = new Element('div.image',{
                        styles:{
                            'background-image':'url('+i.path+')'
                        }
                    }).injectInside(Image.images_content);
                });
            }
        }
    }
});
