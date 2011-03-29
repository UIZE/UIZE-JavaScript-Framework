/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page.Index
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/*?
	Introduction
		A subclass of =UizeDotCom.Page= that provides additional functionality specific to the index pages (eg. examples index page, modules index page, explainers index page, etc.).

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.Page.Index',
	required:[
		'Uize.Widget.HoverFader',
		'Uize.Curve',
		'Uize.Curve.Mod',
		'Uize.Curve.Rubber'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add the hover fader widget ***/
							_this.addChild (
								'boxHoverFader',
								Uize.Widget.HoverFader,
								{
									nodes:{root:'page-index',tagName:'li'},
									defaultStyle:{borderColor:'f',backgroundColor:'cfd3d9'},
									hoverStyle:{borderColor:'0',backgroundColor:'f'},
									fadeInOut:{
										curve:{
											borderColor:[
												Uize.Curve.resolve (-2),
												null,
												Uize.Curve.resolve (3)
											],
											backgroundColor:[
												Uize.Curve.resolve (-6),
												null,
												Uize.Curve.resolve (4)
											]
										},
										reverse:true
									},
									fadeIn:{duration:400},
									fadeOut:{duration:800}
								}
								/*?
									Child Widgets
										hoverFader
											An instance of =Uize.Widget.HoverFader= that is used to provide a hover fade JavaScript animation effect when mousing over the various entries in the index.
								*/
							);

							_this.addChild (
								'linkHoverFader',
								Uize.Widget.HoverFader,
								{
									nodes:{root:'page-index',tagName:'a'},
									defaultStyle:{marginRight:0},
									hoverStyle:{marginRight:10},
									fadeIn:{
										duration:500,
										curve:Uize.Curve.Rubber.easeInOutBack (10)
									},
									fadeOut:{
										duration:700,
										curve:Uize.Curve.Rubber.easeOutBounce (3,1,1.8)
									}
								}
								/*?
									Child Widgets
										linkHoverFader
											An instance of =Uize.Widget.HoverFader= that is used to provide a throbbing hover fade JavaScript animation effect when mousing over the links for the various entries in the index.
								*/
							);
					}
				),
				_classPrototype = _class.prototype
			;

		return _class;
	}
});

