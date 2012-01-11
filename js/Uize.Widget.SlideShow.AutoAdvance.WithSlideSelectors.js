/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.SlideShow.AutoAdvance.WithSlideSelectors.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.SlideShow.AutoAdvance.WithSlideSelectors',required:'Uize.Widget.Options',builder:function(e_a){var e_b=e_a.subclass(null,function(){var e_c=this;var e_d=e_c.addChild('options',Uize.Widget.Options);e_c.wire({'Changed.slideNo':function(){e_c.children.options.set({value:e_c.get('slideNo')})},'Changed.totalSlides':function(){e_c.e_e()}});e_d.wire('Changed.value',function(){var e_f=e_d.get('value');if(e_f!=e_c.get('slideNo')){e_c.stopThenResume();e_c.set({slideNo:e_f});}});e_c.wire('Changed.slideNo',function(){e_c.wipeDone()});e_c.e_e();e_c.set({slideNo:e_c.e_g});}),e_h=e_b.prototype;e_h.e_e=function(){this.children.options.set({value:this.get('slideNo'),values:Uize.map(this.get('totalSlides'),'key')});};e_b.registerProperties({e_g:'startSlideNo'});return e_b;}});