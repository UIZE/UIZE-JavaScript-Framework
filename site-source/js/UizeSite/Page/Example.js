/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page.Example
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of =UizeSite.Page= that provides additional functionality specific to example/demo pages.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Page.Example',
	required:[
		'Uize.Node',
		'Uize.Node.Classes',
		'Uize.Url'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				wireUi:function () {
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
										_urlParts = Uize.Url.from (window.location.href),
										_html =
											[
												'<html>',
													'<head><title>DELVE</title></head>',
													'<body>',
														'<script src="' + (_urlParts.protocol == 'file:' ? 'http://www.uize.com' : _urlParts.fullDomain) + '/js/Uize.js"></script>',
														'<script type="text/javascript">',
															'Uize.require (',
																'\'UizeSite.DelvePageWriter\',',
																'function (_DelvePageWriter) {',
																	'_DelvePageWriter.initialize ();',
																'}',
															');',
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

						_superclass.doMy (_this,'wireUi');

						/*** add tour interface, if necessary ***/
							var _tour = Uize.Url.fromParams (location.href).tour;
							if (_tour) {
								var _documentBody = document.body;
								Uize.Node.Classes.addClass (_documentBody,'inTour');
								Uize.Node.injectHtml (_documentBody,'<div id="page-tourBarShell"></div>');
								Uize.require (
									'UizeSite.Widgets.TourBar.Widget',
									function () {
										_this.addChild (
											'tourBar',
											UizeSite.Widgets.TourBar.Widget,
											{
												tour:_tour,
												container:_this.getNode ('tourBarShell'),
												built:false
											}
										).insertUi ();
									}
								);
							}
					}
				}
			},

			stateProperties:{
				_evaluator:'evaluator'
			}
		});
	}
});

