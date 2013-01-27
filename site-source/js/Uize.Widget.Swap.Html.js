/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.Html Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;
						/*** Private Instance Properties ***/
							_this._currentItemNo = 0;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** State Properties ***/
			_class.stateProperties ({
				_background:{
					name:'background',
					value:'#000'
				},
				_content:{
					name:'content|value',
					onChange:function () {
						var _this = this;
						if (_this.isWired) {
							var
								_currentItem = _this.getNode ('item' + _this._currentItemNo),
								_nextItemNo = 1 - _this._currentItemNo,
								_nextItem = _this.getNode ('item' + _nextItemNo)
							;
							_this.prepareForNextItem (_currentItem,_nextItem);
							_nextItem.innerHTML = _this._content;
							_this._currentItemNo = _nextItemNo;
							_this.setCurrentItem (_nextItem);
						}
					},
					value:''
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				html:{
					process:function (input) {
						var _shellSize = _Uize_Node.getDimensions (this.getNode ());
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
			});

		return _class;
	}
});

