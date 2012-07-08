/*
	UIZE JAVASCRIPT FRAMEWORK 2012-07-07

	http://www.uize.com/reference/Uize.Widget.Collection.Dynamic.Table.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Collection.Dynamic.Table',builder:function(e_a){var e_b=e_a.subclass(),e_c=e_b.prototype;e_c.processItemTemplate=function(e_d){var e_e=this;return function(e_f){var e_g=document.createElement('DIV');e_g.innerHTML='<table><tbody>'+e_a.prototype.processItemTemplate.call(e_e,e_d)(e_f)+'</tbody></table>';return Uize.map(e_g.firstChild.firstChild.childNodes,'value');};};return e_b;}});