/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Templates.List.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Templates.List',required:'Uize.Xml',builder:function(){var _a=function(){},_b=Uize.Xml.toAttributeValue;_a.process=function(_c){var _d=typeof _c.indentChars=='string'?_c.indentChars:'\t',_e=[];function _f(_g){_e.push(_g)}function _h(_i,_j){var _k=(_i.items||'').length,_l=_i.link;_f(_j+'<li>'+(_l?('<a href="'+_i.link+'"'+(_i.description?(' title="'+_b(_i.description)+'"'):'')+'>'):'')+_i.title+(_l?'</a>':'')+(_k?'':'</li>'));if(_k){_m(_i,_j+_d);_f(_j+'</li>');}}function _m(_i,_j){var _n=_i.items;if(_n&&_n.length){_f(_j+'<ul'+(_i.expanded===false?' style="display:none;"':'')+'>');for(var _o= -1,_p=_n.length;++_o<_p;)_h(_n[_o],_j+_d);_f(_j+'</ul>');}}_m({items:_c.items},'');return _e.join('\n');};_a.input={indentChars:'string',items:'array'};return _a;}});