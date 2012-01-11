/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Log.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Log',required:['Uize.Widget.Button','Uize.Xml','Uize.Date.Formatter'],builder:function(c_a){var c_b=c_a.subclass(null,function(){var c_c=this;c_c.addChild('clear',Uize.Widget.Button).wire('Click',function(){c_c.clear()});c_c.c_d();}),c_e=c_b.prototype;c_e.c_d=function(){var c_f=this.children.clear;c_f&&c_f.set({enabled:this.c_g?false:'inherit'});};c_e.clear=function(){var c_c=this;c_c.isWired?c_c.setNodeInnerHtml('messages',''):(c_c.c_h=null);c_c.set({c_g:true});};c_e.log=function(c_i){var c_c=this,c_j=(c_c.c_k?(Uize.Date.Formatter.format(null,c_c.c_l)+' : '):'')+Uize.Xml.toAttributeValue(c_i)+'<br/>';if(c_c.isWired){c_c.injectNodeHtml('messages',c_j);c_c.setNodeProperties('messages',{scrollTop:1000000});}else{(c_c.c_h||(c_c.c_h=[])).push(c_j);}c_c.set({c_g:false});};c_e.wireUi=function(){var c_c=this;if(!c_c.isWired){c_a.prototype.wireUi.call(c_c);c_c.setNodeInnerHtml('messages',(c_c.c_h||[]).join(''));c_c.setNodeProperties('messages',{scrollTop:1000000});c_c.c_h=null;}};
c_b.registerProperties({c_g:{name:'isEmpty',onChange:c_e.c_d,value:true},c_k:{name:'showTimestamp',value:true},c_l:{name:'timestampFormat',value:'{hh}:{mm}:{ss}.{zzz}'}});return c_b;}});