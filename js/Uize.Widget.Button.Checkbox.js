/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Button.Checkbox.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Button.Checkbox',builder:function(d_a){var d_b=d_a.subclass(function(){var d_c=this;d_c.wire('Click',function(){d_c.toggle('selected')});});d_b.set({clickToDeselect:true});return d_b;}});