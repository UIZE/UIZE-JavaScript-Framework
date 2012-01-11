/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Node.Util.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Node.Util',builder:function(){var _a=function(){},_b=Uize.Node;_a.getEffectiveBgColor=function(_c){var _d='';_c=_b.getById(_c);while((!_d||_d=='transparent'||_d=='none')&&_c){_d=_b.getStyle(_c,'backgroundColor');_c=_c.parentNode;}return _d;};var _e=_a.getOpacityProperties=function(_f){return(_b.isIe?{filter:'alpha(opacity='+Math.round(_f*100)+')'}:{opacity:_f+''});};_a.getOpacityStr=function(_f){return _g(_e(_f));};_a.showInLayoutFlow=function(_h,_i){_i=_i!==_j;_k(_h,{position:_i?'static':'absolute',visibility:_i?'inherit':_l});};var _g=_a.stylePropertiesAsStr=function(_m){var _n=[];for(var _o in _m)_n.push(_o,':',_m[_o],'; ');return _n.join('');};return _a;}});