/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Page.xDeferredLinks Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 4
	codeCompleteness: 100
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Page.xDeferredLinks= module extends the =Uize.Widget.Page= base class by adding functionality for defer wiring links on the page.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		Instead of relying on search engines or scrapers to adhere to rel="nofollow", you can include link tags in the page with dummy =href= attributes (such as ="javascript://"=), and set the =href= in the JavaScript.
*/

Uize.module ({
	name:'Uize.Widget.Page.xDeferredLinks',
	required:'Uize.Dom.Basics',
	builder:function (_class) {
		'use strict';

		_class.prototype.wireDeferredLinks = function () {
			var
				m = this,
				_links = m.deferredLinks,
				_numLinks = _links.length,
				_linkNo = 0
			;

			(function _wireLinks() {
				function _wireLink(_link) {
					var
						_linkNode = Uize.Dom.Basics.getById(_link[0]),
						_linkInfo = _link[1]
					;

					if (typeof _linkInfo == 'string')
						m.setNodeProperties(_linkNode, {href:_linkInfo});
					else
						m.wireNode(
							_linkNode,
							'click',
							function () {
								m.launchPopup(
									Uize.copyInto(
										{
											url:_linkInfo.href,
											name:_linkInfo.target
										},
										_linkInfo.popupParams
									)
								)
							}
						);
				}

				for (var _endNo = Math.min(_numLinks, _linkNo + m.linkBatchSize); _linkNo < _endNo; _linkNo++)
					_wireLink(_links[_linkNo])
				;

				if (_linkNo < _numLinks)
					setTimeout(_wireLinks, 0)
				;
			}) ();
		};

		/*** State Properties ***/
			_class.stateProperties ({
				deferredLinks:{
					name:'deferredLinks',
					value:[]
				},
				linkBatchSize:{
					name:'linkBatchSize',
					value:25
				}
			});
	}
});
