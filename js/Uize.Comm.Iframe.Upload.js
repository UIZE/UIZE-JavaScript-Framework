/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Comm.Iframe.Upload.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Comm.Iframe.Upload',required:['Uize.Node','Uize.Url'],builder:function(d_a){var d_b=d_a.subclass(),d_c=d_b.prototype;d_c.performRequest=function(d_d,d_e){var d_f=this,d_g=Uize.Node.getById(d_f.iframeId),d_h=d_d.uploadForm,d_i=d_h.target,d_j=d_d.returnType,d_k=d_j=='object';handleResponse=function(d_l){if(d_k||d_j=='json')d_d.responseJson=Uize.clone(d_l);Uize.Node.isIe&&d_g.contentWindow.history.go(-1);d_h.target=d_i;d_e();};d_h.action=Uize.Url.resolve(d_h.action,{comm_mode:'iframe',output:'js',rnd:Uize.Url.getCacheDefeatStr()});d_h.target=d_g.name;d_h.submit();};return d_b;}});