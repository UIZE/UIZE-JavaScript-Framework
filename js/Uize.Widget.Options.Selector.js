/*
	UIZE JAVASCRIPT FRAMEWORK 2011-03-24

	http://www.uize.com/reference/Uize.Widget.Options.Selector.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Options.Selector',required:'Uize.Widget.Button.ValueDisplay.Selector',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this;d_c.wire('Changed.value',function(){d_c.set({d_d:d_c.get('values')[d_c.get('valueNo')]})});});d_b.registerProperties({d_e:{name:'filter',onChange:function(){},value:[]},d_d:'valueDetails'});d_b.set({optionWidgetClass:Uize.Widget.Button.ValueDisplay.Selector});return d_b;}});