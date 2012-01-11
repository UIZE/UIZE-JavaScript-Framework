/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Page.xDeferredLinks Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c_a" LineCompacting="TRUE"*/

Uize.module ({
	name:'Uize.Widget.Page.xDeferredLinks',
	required:'Uize.Node',
	builder:function (_class) {
		_class.prototype.wireDeferredLinks = function() {
			var
				_this = this,
				_links = _this._deferredLinks,
				_numLinks = _links.length,
				_linkNo = 0
			;

			(function _wireLinks() {
				function _wireLink(_link) {
					var
						_linkNode = Uize.Node.getById(_link[0]),
						_linkInfo = _link[1]
					;

					if (typeof _linkInfo == 'string')
						_this.setNodeProperties(_linkNode, {href:_linkInfo});
					else
						_this.wireNode(
							_linkNode,
							'click',
							function() {
								_this.launchPopup(
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

				for (var _endNo = Math.min(_numLinks, _linkNo + _this._linkBatchSize); _linkNo < _endNo; _linkNo++)
					_wireLink(_links[_linkNo])
				;

				if (_linkNo < _numLinks)
					setTimeout(_wireLinks, 0)
				;
			}) ();
		};

		/*** Register Properties ***/
			_class.registerProperties ({
				_deferredLinks:{
					name:'deferredLinks',
					value:[]
				},
				_linkBatchSize:{
					name:'linkBatchSize',
					value:25
				}
			});
	}
});
