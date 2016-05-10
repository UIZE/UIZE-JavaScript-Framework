/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.Html Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Swap.Html= class supports swapping between two chunks of HTML, with an accompanying, highly configurable JavaScript animation effect.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Swap.Html',
	required:'Uize.Dom.Pos',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			alphastructor:function () {
				this._currentItemNo = 0;
			},

			stateProperties:{
				_background:{
					name:'background',
					value:'#000'
				},
				_content:{
					name:'content|value',
					onChange:function () {
						var m = this;
						if (m.isWired) {
							var
								_currentItem = m.getNode ('item' + m._currentItemNo),
								_nextItemNo = 1 - m._currentItemNo,
								_nextItem = m.getNode ('item' + _nextItemNo)
							;
							m.prepareForNextItem (_currentItem,_nextItem);
							_nextItem.innerHTML = m._content;
							m._currentItemNo = _nextItemNo;
							m.setCurrentItem (_nextItem);
						}
					},
					value:''
				}
			},

			set:{
				html:{
					process:function (input) {
						var _shellSize = Uize.Dom.Pos.getDimensions (this.getNode ());
						function _getItemTag (_itemNo) {
							return (
								'<div id="' + input.idPrefix + '-item' + _itemNo +
								'" style="position:absolute; margin:0px; padding:0px; left:0px; top:0px; width:' + _shellSize.width +
								'px; height:' + _shellSize.height + 'px; background:' + input.background +
								'; overflow:hidden;"></div>'
							);
						}
						return _getItemTag (0) + _getItemTag (1);
					}
				}
			}
		});
	}
});

