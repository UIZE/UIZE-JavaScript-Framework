/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page.Home
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of the =UizeSite.Page= class, designed exclusively for the very important homepage of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Page.Home',
	required:[
		'Uize.Widget.HoverFader',
		'Uize.Curve',
		'Uize.Fx',
		'UizeSite.Widgets.LikeThis.Widget',
		'UizeSite.Widgets.Follow.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var _this = this;

				/*** add the social panel widgets ***/
					_this.addChild ('likeThis',UizeSite.Widgets.LikeThis.Widget,{built:false});
					_this.addChild ('follow',UizeSite.Widgets.Follow.Widget,{built:false});

				/*** add hover fader for demos items and pod sections highlight effect ***/
					_this.addChild (
						'headerLinksFader',
						Uize.Widget.HoverFader,
						{
							nodes:{className:/\bheaderLink\b/},
							defaultStyle:{
								backgroundColor:'f',
								color:'0'
							},
							hoverStyle:{
								backgroundColor:'3f4854',
								color:'c'
							},
							fadeIn:{
								duration:800,
								curve:{
									backgroundColor:[
										Uize.Curve.easeOutPow (9),
										Uize.Curve.easeInPow (2),
										Uize.Curve.easeInPow (6)
									]
								}
							},
							fadeOut:{
								duration:1200,
								curve:{
									backgroundColor:[
										Uize.Curve.easeOutPow (4),
										null,
										Uize.Curve.easeInPow (3)
									]
								}
							}
						}
					);
			},

			instanceMethods:{
				wireUi:function () {
					var _this = this;
					if (!_this.isWired) {
						_superclass.doMy (_this,'wireUi');

						/*** reveal the mantle image ***/
							Uize.Fx.fadeStyle (
								page.getNode ('mantleImage'),
								{opacity:.01,clip:[50,450,50,450]},
								{opacity:1,clip:[0,900,100,0]},
								2000,
								{curve:Uize.Curve.easeInOutPow (4)}
							).wire (
								'Done',
								function () {_this.children.headerLinksFader.tickle (100)}
							);
					}
				}
			},

			set:{
				showSiteAssistant:false
			}
		});
	}
});

