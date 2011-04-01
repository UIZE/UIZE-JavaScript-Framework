/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Comm.Ajax.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Comm.Ajax',required:'Uize.Url',builder:function(c_a){var c_b=c_a.subclass(),c_c=c_b.prototype;var c_d=new Function;c_c.performRequest=function(c_e,c_f){var c_g=this,c_h=c_e.returnType,c_i=c_h=='object',c_j=Uize.Url.resolve(c_e.url,{comm_mode:'ajax',output:'js',rnd:c_e.cache=='never'?Uize.Url.getCacheDefeatStr():null}),c_k=c_e.data||'',c_l=c_e.requestMethod,c_m=c_l=='POST';if(!c_g.c_n)c_g.c_n=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject('Microsoft.XMLHTTP');c_g.c_n.onreadystatechange=function(){if(c_g.c_n.readyState==4){c_g.c_n.onreadystatechange=c_d;if(c_g.c_n.status==200){var c_o=c_g.c_n.responseText;if(c_i||c_h=='xml')c_e.responseXml=c_g.c_n.responseXML;if(c_i||c_h=='text')c_e.responseText=c_o;if(c_i||c_h=='json')c_e.responseJson=c_o?(new Function('var a=['+c_o+'];return a.pop()'))():null;c_g.c_n.abort();c_f();}else{c_g.c_n.abort();}}};if(c_m&& !c_k){var c_p=c_j.indexOf('?');c_k=c_j.substr(c_p+1);c_j=c_j.slice(0,c_p);}c_g.c_n.open(c_l,c_j,true);if(c_m){
c_g.c_n.setRequestHeader('Content-type','application/x-www-form-urlencoded');c_g.c_n.setRequestHeader('Content-length',c_k.length);}c_g.c_n.send(c_k);};return c_b;}});