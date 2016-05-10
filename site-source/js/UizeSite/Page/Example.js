/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page.Example
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
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
		'Uize.Dom.Basics',
		'Uize.Dom.Classes',
		'Uize.Url'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** add the DELVE button ***/
							m.injectNodeHtml (
								'actions',
								'<a id="' + m.get ('idPrefix') + '-delve" href="javascript://" class="buttonLink" title="Launch the DELVE tool to inspect the inner workings of this page">DELVE</a>',
								'inner bottom'
							);

						/*** wire up the DELVE link ***/
							m.wireNode (
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
							m._evaluator &&
								m.wireNode (
									Uize.Dom.Basics.find ({tagName:'A',className:/\blinkedJs\b/}),
									'click',
									function () {m._evaluator (this.title || this.innerHTML)}
								)
							;

						_superclass.doMy (m,'wireUi');

						/*** add tour interface, if necessary ***/
							var _tour = Uize.Url.fromParams (location.href).tour;
							if (_tour) {
								var _documentBody = document.body;
								Uize.Dom.Classes.addClass (_documentBody,'inTour');
								Uize.Dom.Basics.injectHtml (_documentBody,'<div id="page-tourBar"></div>');
								Uize.require (
									'UizeSite.Widgets.TourBar.Widget',
									function () {
										m.addChild (
											'tourBar',
											UizeSite.Widgets.TourBar.Widget,
											{
												tour:_tour,
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

