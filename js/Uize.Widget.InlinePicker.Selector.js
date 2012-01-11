/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.InlinePicker.Selector.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.InlinePicker.Selector',required:['Uize.Widget.Options.Selector','Uize.Widget.Button.ValueDisplay.Selector','Uize.Util.Coupler'],builder:function(e_a){var e_b=e_a.subclass(null,function(){Uize.Util.Coupler({instances:[this,this.children.value],properties:['valueNo','tentativeValueNo']})});e_b.registerProperties({e_c:{name:'tentativeValueNo',value:-1},e_d:{name:'valueNo',value:-1},e_e:{name:'values',value:[]}});e_b.set({pipedProperties:['values'],valueDisplayWidgetClass:Uize.Widget.Button.ValueDisplay.Selector,valueWidgetClass:Uize.Widget.Options.Selector});return e_b;}});