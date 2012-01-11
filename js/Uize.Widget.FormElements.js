/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.FormElements.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.FormElements',required:'Uize.Widget.FormElement',builder:function(c_a){var c_b=c_a.subclass();c_b.prototype.addChild=function(c_c,c_d,c_e){var c_f=this,c_g=c_f.parent,c_h=c_a.prototype.addChild.call(c_f,c_c,c_d||Uize.Widget.FormElement,Uize.copyInto({value:c_g?(c_f.parent.get('value')||{})[c_c]:null},c_e));c_f.fire({name:'Element Added',element:c_h});return c_h;};return c_b;}});