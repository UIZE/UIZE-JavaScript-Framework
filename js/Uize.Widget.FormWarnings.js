/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.FormWarnings.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.FormWarnings',required:'Uize.Template',builder:function(c_a){var c_b=c_a.subclass(),c_c=c_b.prototype;c_c.c_d=function(c_e){var c_f=this,c_g;function c_h(){if(c_f.isWired){c_f.unwireUi();c_f.get('html')!=c_g&&c_f.set({built:false});c_f.insertOrWireUi();}}c_e.wire({'Changed.warningShown':c_h,'Changed.warningMessage':c_h});};c_c.addWatchedElements=function(c_i){var c_f=this,c_j=c_f.c_j||[],c_k=Uize.isArray(c_i)?c_i:[c_i],c_l=c_k.length,c_m= -1;for(;++c_m<c_l;){var c_e=c_k[c_m];c_j.push(c_e);c_f.c_d(c_e);}c_f.c_j=c_j;c_f.fire('Changed.watchedElements');};c_b.registerProperties({c_n:{name:'shown',onChange:function(){this.isWired&&this.displayNode('',this.c_n)},value:false},c_j:{name:'watchedElements',onChange:function(){var c_f=this;Uize.forEach(c_f.c_j,function(c_e){c_f.c_d(c_e)});},value:[]}});return c_b;}});