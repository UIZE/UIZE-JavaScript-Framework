/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Comm.Script.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Comm.Script',required:'Uize.Url',builder:function(c_a){var c_b;var c_c=c_a.subclass(function(){for(this.c_d in{c_e:1});if(!c_c.c_e)c_c.c_e=[];}),c_f=c_c.prototype;c_f.performRequest=function(c_g,c_h){var c_i=this,c_e=c_c.c_e,c_j=c_i.c_k=='server',c_l=document.createElement('script');c_e.push(function(c_m){c_g['response'+Uize.capFirstChar(c_g.returnType)]=c_m;c_h();});var c_n='Uize.Comm.Script.'+c_i.c_d+'['+(c_e.length-1)+']';c_l.src=Uize.Url.resolve([c_g.url,{comm_mode:'script'},c_j?{callback:c_n}:c_b,c_g.cache=='never'?{rnd:Uize.Url.getCacheDefeatStr()}:c_b]);if(!c_j){var c_o=c_c.c_e[c_e.length-1];if(c_l.readyState)c_l.onreadystatechange=function(){if(c_l.readyState=='loaded'||c_l.readyState=='complete'){c_l.onreadystatechange=null;c_o();}};else c_l.onload=c_o;}document.body.appendChild(c_l);};c_c.registerProperties({c_k:{name:'callbackMode',value:'server'}});return c_c;}});