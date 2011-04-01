/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Options.FilterGroup.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Options.FilterGroup',required:['Uize.Widget.Button.Filter','Uize.Node.Classes'],builder:function(d_a){var d_b=d_a.subclass(),d_c=d_b.prototype;d_c.d_d=function(){var d_e=this;d_e.isWired&&Uize.Node.Classes.setState(d_e.getNode('options'),['',d_e.d_f],d_e.d_g);};d_c.d_h=function(){this.isWired&&this.setNodeInnerHtml('title',this.d_i)};d_c.updateUi=function(){var d_e=this;if(d_e.isWired){d_e.d_h();d_e.d_d();d_a.prototype.updateUi.call(d_e);}};d_b.registerProperties({d_g:{name:'expanded',onChange:d_c.d_d,value:false},d_f:{name:'expandedCssClass',onChange:d_c.d_d,value:''},d_i:{name:'title',onChange:d_c.d_h,value:''}});d_b.set({optionWidgetClass:Uize.Widget.Button.Filter});return d_b;}});