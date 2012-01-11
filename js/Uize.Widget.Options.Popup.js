/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Options.Popup.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Options.Popup',required:'Uize.Widget.PopupPalette',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this,d_d=d_c.d_d=d_c.addChild('popupPalette',Uize.Widget.PopupPalette,{idPrefixConstruction:'same as parent'});d_d.fade.set({duration:0});d_d.wire('Palette Shown',function(){if(d_c.get('valueNo')> -1){var d_e=d_c.d_f();d_e&&d_d.setNodeProperties('Palette',{scrollLeft:d_e.offsetLeft,scrollTop:d_e.offsetTop});}});d_c.wire('Changed.value',function(){d_c.updateUi()});}),d_g=d_b.prototype;d_g.d_f=function(){var d_h=this.children['option'+this.get('valueNo')];return d_h?d_h.getNode():null;};d_g.updateUi=function(){var d_c=this;if(d_c.isWired){d_a.prototype.updateUi.call(d_c);d_c.d_d.updateUi();var d_i=d_c.d_d.children.selector;d_i&&d_i.set({enabled:d_c.get('values').length>1?'inherit':false});d_c.setNodeInnerHtml('label',Uize.Node.getText(d_c.d_f())||d_c.d_j);}};d_b.registerProperties({d_j:{name:'emptyLabel',value:''}});return d_b;}});