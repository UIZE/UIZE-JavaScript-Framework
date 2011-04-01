/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Picker.FilteredInput.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Picker.FilteredInput',required:'Uize.Widget.ValueDisplay.Selector',builder:function(e_a){var e_b=e_a.subclass(null,function(){var e_c=this;e_c.wire('Changed.valueDetails',function(){e_c.e_d()});e_c.e_e=0;}),e_f=e_b.prototype;e_f.e_d=function(){var e_c=this;if(e_c.isWired){var e_g=e_c.children.selector.getNode('valueDisplayShell'),e_h=Uize.Node.getDimensions(e_g).width,e_e=e_c.e_e;if(e_e&&e_h<e_e)e_c.setNodeStyle(e_g,{minWidth:e_e});else if(e_h)e_c.e_e=e_h;}};e_f.getDialogWidgetProperties=function(){var e_i=this.children.selector.getNode()||this.getNode('input'),e_j;return{offsetX:'adjacent',offsetY:'adjacent',minWidth:e_i?Uize.Node.getDimensions(e_i).width:e_j};};e_f.updateUi=function(){var e_c=this;if(e_c.isWired){e_c.e_d();e_a.prototype.updateUi.call(e_c);}};e_b.registerProperties({e_k:'filter',e_l:'filters',e_m:'inputWidgetClass',e_n:'inputWidgetProperties'});e_b.set({pipedProperties:['inputWidgetClass','inputWidgetProperties','filter','filters'],
selectorButtonWidgetClass:Uize.Widget.ValueDisplay.Selector,dialogWidgetClass:'Uize.Widget.Dialog.Picker.FilteredInput'});return e_b;}});