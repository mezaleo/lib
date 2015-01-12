//console.log(new Date());
window.addEvent('domready',function(){

var form1 = new Content.Form({
	title:'New Form'
});

form1.addTextLabel('Nombre','l01');
form1.addField({
	title:'Nombre',
	name:'field01'
});

form1.addCombo({
	name:'Combo',
	title:'Combo',
	values:	[{id:'1',text:'Leonardo'},
	{id:'2',text:'Meza'},
	{id:'3',text:'Nunez'},
	{id:'4',text:'Nunez'},
	{id:'5',text:'Nunez'},
	{id:'6',text:'Nunez'},
	{id:'7',text:'Nunez'},
	{id:'8',text:'Nunez'},
	{id:'9',text:'Nunez'},
	{id:'10',text:'Nunez'}],
	indexName:'id',
	valueName:'text'
});


//new Field();


});


