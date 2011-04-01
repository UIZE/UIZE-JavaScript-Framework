/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.String.Builder.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.String.Builder',builder:function(){var _a=function(_b){this._c=[];this.setValue(arguments.length?_b:'');},_d=_a.prototype;_d.equals=function(_b){if(!arguments.length)_b='';else if(typeof _b!='string')_b+='';return _b.length==this.length&&(!_b.length||_b==this.valueOf());};_d.getValue=_d.toString=_d.valueOf=function(){this._c.length>1&&this.setValue(this._c.join(''));return this._c[0];};_d.append=function(_e){this.length+=(this._c[this._c.length]=typeof _e=='string'?_e:(_e+='')).length;};_d.prepend=function(_e){this._c.unshift(typeof _e=='string'?_e:(_e+=''));this.length+=_e.length;};_d.setValue=_d.clear=function(_b){this._c.length=1;this.length=(this._c[0]=arguments.length?_b+'':'').length;};for(var _f in{charAt:1,charCodeAt:1,concat:1,indexOf:1,lastIndexOf:1,match:1,replace:1,search:1,slice:1,split:1,substr:1,substring:1,toLowerCase:1,toUpperCase:1,anchor:1,big:1,blink:1,bold:1,fixed:1,fontcolor:1,fontsize:1,italics:1,link:1,small:1,strike:1,sub:1,sup:1})_d[_f]=String.prototype[_f];
return _a;}});