/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Options.Selector.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Options.Selector',required:'Uize.Widget.Button.ValueDisplay.Selector',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this;d_c.wire('Changed.value',function(){d_c.set({d_d:d_c.children['option'+d_c.get('valueNo')].get('valueDetails')})});});d_b.prototype.getOptionProperties=function(d_e,d_f){return Uize.copyInto(d_a.prototype.getOptionProperties.call(this,d_e,d_f)||{},{value:d_f.name,valueDetails:d_f.valueDetails})};d_b.registerProperties({d_g:{name:'filter',onChange:function(){},value:[]},d_d:'valueDetails'});d_b.set({optionWidgetClass:Uize.Widget.Button.ValueDisplay.Selector});return d_b;}});