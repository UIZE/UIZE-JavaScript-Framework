/*______________
|       ______  |   B U I L T     O N     U I Z E     F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |   This JavaScript application is developed using the object
|   /    / /    |   oriented UIZE JavaScript framework as its foundation.
|  /    / /  /| |
| /____/ /__/_| |    ONLINE : http://www.uize.com
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page.Example.library Library Module
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		The =UizeDotCom.Page.Example.library= module is a library module that bundles together various JavaScript modules common to the example pages of the UIZE JavaScript Framework's Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	required:'UizeDotCom.Page.library',
	builder:function () {
		

Uize.module({name:'UizeDotCom.Page.Example',required:['Uize.Node','Uize.Url'],builder:function(e_a){var e_b=e_a.subclass(),e_c=e_b.prototype;e_c.wireUi=function(){var e_d=this;if(!e_d.isWired){e_d.injectNodeHtml('actions','<a id="'+e_d.get('idPrefix')+'-delve" href="javascript://" class="buttonLink" title="Launch the DELVE tool to inspect the inner workings of this page">DELVE</a>','inner bottom');e_d.wireNode('delve','click',function(){var e_e=window.screen,e_f=e_e.width-50,e_g=e_e.height-100,e_h=['<html>','<head><title>DELVE</title></head>','<body>','<script src="http://www.uize.com/js/Uize.js"></script>','<script type="text/javascript">','Uize.module ({','required:\'UizeDotCom.DelvePageWriter\',','builder:function () {','UizeDotCom.DelvePageWriter.initialize ();','}','});','</script>','</body>','</html>'].join('\n'),e_i=window.open('javascript:\''+e_h.replace(/'/g,'\\\'')+'\'','reportPopup',['width='+e_f,'height='+e_g,'left='+Math.max((e_e.width-e_f-10)>>1,0),'top='+Math.max((e_e.height-e_g-40)>>1,0),
'toolbar=no','location=no','directories=no','status=no','menubar=no','resizable=yes','scrollbars=no'].join(','));e_i.focus();});e_d.e_j&&e_d.wireNode(Uize.Node.find({tagName:'A',className:/\blinkedJs\b/}),'click',function(){e_d.e_j(this.title||this.innerHTML)});e_a.prototype.wireUi.call(e_d);var e_k=Uize.Url.fromParams(location.href).tour;e_k&&Uize.module({required:['UizeDotCom.Templates.Tour','Uize.Tooltip','Uize.Url','UizeDotCom.Examples'],builder:function(){Uize.Node.injectHtml(document.body,UizeDotCom.Templates.Tour.process({tour:e_k,pageUrl:location.href}));function e_l(e_m){var e_n=e_l.e_o;if(!e_n){e_n=e_l.e_o={};Uize.forEach(UizeDotCom.Examples(),function(e_p){e_n[Uize.Url.from(e_p.path).fileName]=e_p;});}return e_n[Uize.Url.from(e_m).fileName];}e_d.wireNode(Uize.Node.find({tagName:'a',className:/\b(tourPage|tourButton)\b/}),{mouseover:function(){var e_p=e_l(this.getAttribute('href'));e_d.setNodeValue('tourPageTooltip-title',e_p.title);e_d.setNodeValue('tourPageTooltip-description',e_p.description);
e_d.setNodeValue('tourPageTooltip-keywords',e_p.keywords||'-- NONE --');Uize.Tooltip.showTooltip('page-tourPageTooltip');},mouseout:function(){Uize.Tooltip.showTooltip('page-tourPageTooltip',false)}});}});}};e_b.registerProperties({e_j:'evaluator'});e_b.set({showFooter:false});return e_b;}});


Uize.module({name:'Uize.Tooltip',required:['Uize.Node','Uize.Fade'],builder:function(){var _a=function(){},_b=true,_c=false,_d,_e=Uize.Node;var _f=Uize.getGuid(),_g=[],_h,_i=16;function _j(_k){return _e.getById(Uize.isFunction(_k)?_k():_k);}function _l(){_m()}function _n(_o){if(_o!=_h){if(_o){if(_h){_p.stop();_q();}if(!_o._r){_e.wire(document.body,'scroll',_l,_f);_e.wire(document.documentElement,'mousemove',_l,_f);}_h=_o;_e.setStyle(_h._s,{position:'absolute',zIndex:5000,left:-50000,top:-50000});_e.display(_h._s);_m();}else{_p.get('duration')>0?_p.start():_q();}}else if(_o){_p.stop();_e.setOpacity(_h._s,1);}}_a.showTooltip=function(_k,_t,_r){if(_k=_j(_k)){if(_t!==_c){_g.push({_s:_k,_r:_r});}else{for(var _u=_g.length;--_u> -1;)if(_g[_u]._s==_k)break;_u> -1&&_g.splice(_u,1);}_n(_g[_g.length-1]);}};_a.hideTooltip=function(_k){_a.showTooltip(_k,_c)};var _m=_a.positionTooltip=function(_k,_v){_h&&(_k===_d?(_k=_h._s):_h._s==_j(_k))&&_e.setAbsPos(_k,_e.getEventAbsPos(_v),_i);};var _p=_a.fade=Uize.Fade({duration:0});
function _q(){_h._r||_e.unwireEventsByOwnerId(_f);_e.display(_h._s,_c);_e.setOpacity(_h._s,1);_h=null;}_p.wire({'Changed.value':function(){_e.setOpacity(_h._s,1-_p.get('progress'))},Done:_q});return _a;}});
		Uize.module ({name:'UizeDotCom.Page.Example.library'});
	}
});

