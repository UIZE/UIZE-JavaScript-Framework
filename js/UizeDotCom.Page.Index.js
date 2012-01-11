/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.Page.Index.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Page.Index',required:['Uize.Widget.HoverFader','Uize.Curve','Uize.Curve.Mod','Uize.Curve.Rubber'],builder:function(e_a){var e_b=e_a.subclass(null,function(){var e_c=this;e_c.addChild('boxHoverFader',Uize.Widget.HoverFader,{nodes:{root:'page-index',tagName:'li'},defaultStyle:{borderColor:'f',backgroundColor:'cfd3d9'},hoverStyle:{borderColor:'0',backgroundColor:'f'},fadeInOut:{curve:{borderColor:[Uize.Curve.resolve(-2),null,Uize.Curve.resolve(3)],backgroundColor:[Uize.Curve.resolve(-6),null,Uize.Curve.resolve(4)]},reverse:true},fadeIn:{duration:400},fadeOut:{duration:800}});e_c.addChild('linkHoverFader',Uize.Widget.HoverFader,{nodes:{root:'page-index',tagName:'a'},defaultStyle:{marginRight:0},hoverStyle:{marginRight:10},fadeIn:{duration:500,curve:Uize.Curve.Rubber.easeInOutBack(10)},fadeOut:{duration:700,curve:Uize.Curve.Rubber.easeOutBounce(3,1,1.8)}});}),e_d=e_b.prototype;return e_b;}});