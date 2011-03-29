/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page.Example
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of =UizeDotCom.Page= that provides additional functionality specific to example/demo pages.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Page.Example',
	required:[
		'Uize.Node',
		'Uize.Url'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** add the DELVE button ***/
						_this.injectNodeHtml (
							'actions',
							'<a id="' + _this.get ('idPrefix') + '-delve" href="javascript://" class="buttonLink" title="Launch the DELVE tool to inspect the inner workings of this page">DELVE</a>',
							'inner bottom'
						);

					/*** wire up the DELVE link ***/
						_this.wireNode (
							'delve',
							'click',
							function () {
								var
									_screen = window.screen,
									_width = _screen.width - 50,
									_height = _screen.height - 100,
									_html =
										[
											'<html>',
												'<head><title>DELVE</title></head>',
												'<body>',
													'<script src="http://www.uize.com/js/Uize.js"></script>',
													'<script type="text/javascript">',
														'Uize.module ({',
															'required:\'UizeDotCom.DelvePageWriter\',',
															'builder:function () {',
																'UizeDotCom.DelvePageWriter.initialize ();',
															'}',
														'});',
													'</script>',
												'</body>',
											'</html>'
										].join ('\n'),
									_window = window.open (
										'javascript:\'' + _html.replace (/'/g,'\\\'') + '\'',
										'reportPopup',
										[
											'width=' + _width,
											'height=' + _height,
											'left=' + Math.max ((_screen.width - _width - 10) >> 1,0),
											'top=' + Math.max ((_screen.height - _height - 40) >> 1,0),
											'toolbar=no',
											'location=no',
											'directories=no',
											'status=no',
											'menubar=no',
											'resizable=yes',
											'scrollbars=no'
										].join (',')
									)
								;
								_window.focus ();
							}
						);

					/*** wire programmatic links ***/
						_this._evaluator &&
							_this.wireNode (
								Uize.Node.find ({tagName:'A',className:/\blinkedJs\b/}),
								'click',
								function () {_this._evaluator (this.title || this.innerHTML)}
							)
						;

					_superclass.prototype.wireUi.call (_this);

					/*** add tour interface, if necessary ***/
						var _tour = Uize.Url.fromParams (location.href).tour;
						_tour &&
							Uize.module ({
								required:[
									'UizeDotCom.Templates.Tour',
									'Uize.Tooltip',
									'Uize.Url',
									'UizeDotCom.Examples'
								],
								builder:function () {
									/*** inject tour UI ***/
										Uize.Node.injectHtml (
											document.body,
											UizeDotCom.Templates.Tour.process ({tour:_tour,pageUrl:location.href})
										);

									/*** wire up tour page tooltip behavior ***/
										function _getTourExampleByUrl (_url) {
											var _tourExamplesMap = arguments.callee._map;
											if (!_tourExamplesMap) {
												_tourExamplesMap = arguments.callee._map = {};
												for (
													var
														_tourExampleNo = -1,
														_tourExamples = UizeDotCom.Examples (),
														_tourExamplesLength = _tourExamples.length
													;
													++_tourExampleNo < _tourExamplesLength;
												) {
													var _tourExample = _tourExamples [_tourExampleNo];
													_tourExamplesMap [Uize.Url.from (_tourExample.path).fileName] = _tourExample;
												}
											}
											return _tourExamplesMap [Uize.Url.from (_url).fileName];
										}

										_this.wireNode (
											Uize.Node.find ({tagName:'a',className:/\b(tourPage|tourButton)\b/}),
											{
												mouseover:function () {
													var _tourExample = _getTourExampleByUrl (this.getAttribute ('href'));

													/*** update nodes to reflect tour page being moused over ***/
														_this.setNodeValue ('tourPageTooltip-title',_tourExample.title);
														_this.setNodeValue ('tourPageTooltip-description',_tourExample.description);
														_this.setNodeValue (
															'tourPageTooltip-keywords',
															_tourExample.keywords || '-- NONE --'
														);

													Uize.Tooltip.showTooltip ('page-tourPageTooltip');
												},
												mouseout:function () {Uize.Tooltip.showTooltip ('page-tourPageTooltip',false)}
											}
										);
								}
							})
						;
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_evaluator:'evaluator'
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				showFooter:false
			});

		return _class;
	}
});

