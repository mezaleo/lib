//console.log(new Date());
window.addEvent('domready',function(){

Element.implement({
	setFocus: function(index) {
		this.setAttribute('tabIndex',index || 0);
		this.focus();
	}
});

var menu = new Menu( {
	title : 'Titulo',
	optionsLimit : 7
});
menu.setBlueStyle();
menu.add('Opcion 1');
menu.add('Opcion 2');
menu.add('Opcion 3');
menu.add('Opcion 3');
menu.add('Opcion 3');
menu.add('Opcion 3');

var form1 = new Content.Form({
	title:'Formulario de ingreso',
	width: 30,
	align:'left',
	minimizable:true,
	values:{
		field01:'Name',
		combo:'1'
	}
});

form1.addTextLabel('Nombre','l01');
form1.addField({
	title:'Nombre',
	name:'field01'
});

form1.addTextLabel('Items','l02');
form1.addCombo({
	name:'Combo',
	title:'Combo',
	values:	[
	{id:'1',text:'Item 01'},
	{id:'2',text:'Item 02'}],
	indexName:'id',
	valueName:'text'
});
form1.addTextLabel('Fecha','l03');
form1.addField({
	title:'Fecha',
	type:'date',
	name:'field03'
});
form1.addButton({closeOnClick:false,type:'success',name:'btnAceptar',value:'Aceptar',
	onClick:function(values,event,frm){
		var r = new RequestAjax('http://lbtvvosap03.cl.lan.com:9256/appdeferredWeb/deferral/admDeferral.do',{method:'validate-fullreg'});
		new Dialog(r.mensaje);
	}
});


var table1 = new Content.Table({
	title:'Lista 001',
	width: 37,
	draggable:true,
	check:true,
	header:[
		{
			alias:'Campo1'
		},
		{
			alias:'Editable'
		},
		{
			alias:'Select',
			editable:{
				onlyWhenEqualTo:1,
				type:'combo',
				handler:function(oldValue,newValue){
					new Dialog("old:" + oldValue + " new:" + newValue);
				}
			}
		}
	]
});
table1.addRow(['1','14-01-2015',1]);
table1.addRow(['1',null,2]);
table1.addRow(['1','14-01-2015',1]);
table1.showAllRows();
table1.show();


});

//c.injectInside(document.body);
