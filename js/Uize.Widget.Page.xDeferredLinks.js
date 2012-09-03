/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Widget.Page.xDeferredLinks.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Page.xDeferredLinks',required:'Uize.Node',builder:function(_a){_a.prototype.wireDeferredLinks=function(){var _b=this,_c=_b.deferredLinks,_d=_c.length,_e=0;(function _f(){function _g(_h){var _i=Uize.Node.getById(_h[0]),_j=_h[1];if(typeof _j=='string')_b.setNodeProperties(_i,{href:_j});else _b.wireNode(_i,'click',function(){_b.launchPopup(Uize.copyInto({url:_j.href,name:_j.target},_j.popupParams))});}for(var _k=Math.min(_d,_e+_b.linkBatchSize);_e<_k;_e++)_g(_c[_e]);if(_e<_d)setTimeout(_f,0);})();};_a.registerProperties({deferredLinks:{name:'deferredLinks',value:[]},linkBatchSize:{name:'linkBatchSize',value:25}});}});