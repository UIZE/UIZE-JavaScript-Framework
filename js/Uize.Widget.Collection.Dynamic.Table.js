/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Collection.Dynamic.Table.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Collection.Dynamic.Table',builder:function(f_a){var f_b=f_a.subclass(),f_c=f_b.prototype;f_c.processItemTemplate=function(f_d){var f_e=this;return function(f_f){var f_g=document.createElement('DIV');f_g.innerHTML='<table><tbody>'+f_a.prototype.processItemTemplate.call(f_e,f_d)(f_f)+'</tbody></table>';return Uize.map(f_g.firstChild.firstChild.childNodes,'value');};};return f_b;}});