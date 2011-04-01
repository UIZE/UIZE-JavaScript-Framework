/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Button.ValueDisplay.Selector.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Button.ValueDisplay.Selector',required:'Uize.Widget.ValueDisplay.Selector',builder:function(e_a){var e_b=e_a.subclass(null,function(){var e_c=this,e_d=e_c.children.valueDisplay;function e_e(){e_d.set({selected:e_c.get('selected')})}function e_f(){var e_g=e_c.get('state');e_d.set({tentativeSelected:e_g=='over'||e_g=='down'})}e_c.wire({'Changed.selected':e_e,'Changed.state':e_f});e_e();e_f();});e_b.set({valueDisplayWidgetClass:Uize.Widget.ValueDisplay.Selector});return e_b;}});