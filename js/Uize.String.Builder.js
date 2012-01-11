/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.String.Builder.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.String.Builder',builder:function(){var _a=Uize.noNew(function(_b){this._c=[];this.setValue(arguments.length?_b:'');}),_d=_a.prototype;_d.equals=function(_b){if(!arguments.length)_b='';else if(typeof _b!='string')_b+='';return _b.length==this.length&&(!_b.length||_b==this.valueOf());};_d.getValue=_d.toString=_d.valueOf=function(){this._c.length>1&&this.setValue(this._c.join(''));return this._c[0];};_d.append=function(_e){this.length+=(this._c[this._c.length]=typeof _e=='string'?_e:(_e+='')).length;};_d.prepend=function(_e){this._c.unshift(typeof _e=='string'?_e:(_e+=''));this.length+=_e.length;};_d.setValue=_d.clear=function(_b){this._c.length=1;this.length=(this._c[0]=arguments.length?_b+'':'').length;};var _f=String.prototype;Uize.forEach([
'charAt','charCodeAt','concat','indexOf','lastIndexOf','match','replace','search','slice','split','substr','substring','toLowerCase','toUpperCase','anchor','big','blink','bold','fixed','fontcolor','fontsize','italics','link','small','strike','sub','sup'],function(_g){_d[_g]=_f[_g]});return _a;}});