/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page.Home
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/*?
	Introduction
		A subclass of the =UizeDotCom.Page= class, designed exclusively for the very important homepage of the *uize.com* Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.Page.Home',
	required:[
		'Uize.Node.Event',
		'Uize.Widget.HoverFader',
		'Uize.Widget.Scrolly',
		'Uize.Widget.AutoTooltip',
		'Uize.Template',
		'Uize.Fx',
		'Uize.Fx.xShadows',
		'Uize.Curve',
		'Uize.Curve.Rubber'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add the demos scrolly ***/
							_this.addChild ('demosScrolly',Uize.Widget.Scrolly)
								.fade.set ({curve:Uize.Curve.Rubber.easeOutBounce (3,.5),duration:1000});

						/*** add the demo info auto tooltip behavior ***/
							_this.addChild ('demoInfoTooltip',Uize.Widget.AutoTooltip,{nodes:{className:/\bdemosItem\b/},html:true});

						/*** add hover fader for demos items and pod sections highlight effect ***/
							_this.addChild (
								'borderHoverFader',
								Uize.Widget.HoverFader,
								{
									nodes:{className:/\b(subPod|demosItem)\b/},
									defaultStyle:{borderColor:'788'},
									hoverStyle:{borderColor:'f'},
									fadeIn:{
										duration:800,
										curve:{
											borderColor:[
												Uize.Curve.easeOutPow (9),
												Uize.Curve.easeInPow (2),
												Uize.Curve.easeInPow (6)
											]
										}
									},
									fadeOut:{
										duration:1200,
										curve:{
											borderColor:[
												Uize.Curve.easeOutPow (4),
												null,
												Uize.Curve.easeInPow (3)
											]
										}
									}
								}
							);

						/*** add hover fader for pod heading highlight effect ***/
							_this.addChild (
								'podHeadingHoverFader',
								Uize.Widget.HoverFader,
								{
									nodes:{className:/\bpodHeading\b/},
									defaultStyle:{
										color:'fff',
										backgroundColor:'3a4950'
									},
									hoverStyle:{
										color:'000',
										backgroundColor:'fff'
									},
									fadeIn:{
										duration:500,
										curve:{
											color:Uize.Curve.easeInPow (2),
											backgroundColor:[
												Uize.Curve.easeInPow (3),
												Uize.Curve.easeOutPow (1.2),
												Uize.Curve.easeOutPow (2.3)
											]
										}
									},
									fadeOut:{
										duration:700,
										curve:{
											color:Uize.Curve.easeOutPow (7),
											backgroundColor:[
												Uize.Curve.easeOutPow (1.5),
												Uize.Curve.easeInPow (1.5),
												Uize.Curve.easeInPow (1.3)
											]
										}
									}
								}
							);
					}
				),
				_classPrototype = _class.prototype
			;

			/*** Public Instance Methods ***/
				_classPrototype.wireUi = function () {
					var _this = this;
					if (!_this.isWired) {
						_superclass.prototype.wireUi.call (_this);

						/*** reveal the mantle image ***/
							Uize.Fx.fadeStyle (
								page.getNode ('mantleImage'),
								{opacity:.01,clip:[50,450,50,450]},
								{opacity:1,clip:[0,900,100,0]},
								2000,
								{curve:Uize.Curve.easeInOutPow (4)}
							).wire (
								'Done',
								function () {_this.children.podHeadingHoverFader.tickle (350)}
							);
					}
				};

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				showFooter:false,
				showShareThisPanel:false
			});

		return _class;
	}
});

