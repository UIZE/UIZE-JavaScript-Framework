/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Cookie.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Cookie',builder:function(){var _a,_b=null,_c=function(){};_c.setCookie=function(_d,_e,_f,_g){if(_e===_a||_e==_b){_e='';_g='Mon, 1 Jan 1990 12:00:00 UTC';}else{if(_g===_a){var _h=new Date;_h.setFullYear(_h.getFullYear()+1);_g=_h.toGMTString();}}document.cookie=escape(_d)+'='+escape(_e)+';'+((_f!==_a&&_f!=_b)?('path='+_f+';'):'')+((_g!==_b)?('expires='+_g+';'):'');};_c.getCookie=function(_d){var _e='',_i=document.cookie;if(typeof _i=='string'){_i=_i.replace(/ /g,'');for(var _j= -1,_k=_i.split(';'),_l=_k.length;++_j<_l;){var _m=_k[_j].split('=');if(unescape(_m[0])==_d){_e=(typeof _m[1]=='string')?unescape(_m[1]):'';break;}}}return _e;};return _c;}});