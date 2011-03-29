/*
	UIZE JAVASCRIPT FRAMEWORK 2011-03-24

	http://www.uize.com/reference/Uize.Widget.Button.ValueDisplay.Selector.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Button.ValueDisplay.Selector',required:['Uize.Widget.ValueDisplay.Selector','Uize.Util.Coupler'],builder:function(e_a){var e_b=e_a.subclass(null,function(){var e_c=this,e_d=e_c.children.valueDisplay;new Uize.Util.Coupler({instances:[e_c,e_d],properties:['selected']});e_c.wire('Changed.state',function(){e_d.set({tentativeSelected:e_c.get('state')=='over'})});});e_b.set({valueDisplayWidgetClass:Uize.Widget.ValueDisplay.Selector});return e_b;}});