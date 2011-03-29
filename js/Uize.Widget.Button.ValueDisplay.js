/*
	UIZE JAVASCRIPT FRAMEWORK 2011-03-24

	http://www.uize.com/reference/Uize.Widget.Button.ValueDisplay.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Button.ValueDisplay',required:['Uize.Widget.ValueDisplay','Uize.Util.Coupler'],builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this,d_d=d_c.addChild('valueDisplay',d_c.d_e||Uize.Widget.ValueDisplay,d_c.d_f);new Uize.Util.Coupler({instances:[d_c,d_d],properties:['value','valueDetails']});});d_b.registerProperties({d_g:'value',d_h:'valueDetails',d_e:'valueDisplayWidgetClass',d_f:'valueDisplayWidgetProperties'});return d_b;}});