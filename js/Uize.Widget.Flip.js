/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Flip.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Flip',required:'Uize.Fade',builder:function(c_a){var c_b=c_a.subclass(function(){this.c_c='idle';this.fade=Uize.Fade({duration:400});}),c_d=c_b.prototype;c_d.changeContent=function(c_e,c_f){var c_g=this;if(c_e!=c_g.c_h){c_g.c_h=c_e;c_g.c_c='out';c_g.set({c_f:c_f});c_g.fade.start({startValue:0,endValue:c_g.c_f=='down'?0-c_g.c_i:c_g.c_i-0,curve:Uize.Fade.celeration(1,0)});}};c_d.wireUi=function(){var c_g=this;if(!c_g.isWired){var c_j=c_g.getNode();c_g.fade.wire({'Changed.value':function(){c_g.setNodeStyle('',{top:Math.round(c_g.fade)})},Done:function(){if(c_g.c_c=='out'){c_g.setNodeInnerHtml(c_j,c_g.c_h);c_g.fade.set({startValue:c_g.c_f=='down'?c_g.c_i-0:0-c_g.c_i,endValue:0,curve:Uize.Fade.celeration(0,1)});c_g.c_c='in';c_g.fade.start();c_g.fire('Content Changed');}else if(c_g.c_c=='in'){c_g.c_c='idle';c_g.fire('Updated');}}});if(c_j)c_g.c_h=c_j.innerHTML;c_a.prototype.wireUi.call(c_g);}};c_b.registerProperties({c_f:{name:'direction',value:'down'},c_i:{name:'offset',value:'20'}
});return c_b;}});