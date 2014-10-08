/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Po.Document Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Po.Document= module provides methods for parsing and serializing GNU gettext [[https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html][PO files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Po.Document',
	required:[
		'Uize.Parse.Po.NameValue',
		'Uize.Parse.Code.PoundComment',
		'Uize.Parse.Code.Whitespace'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_Uize_Parse = Uize.Parse,
				_Uize_Parse_Code = _Uize_Parse.Code,

			/*** General Variables ***/
				_itemTypes = {
					comment:_Uize_Parse_Code.PoundComment,
					nameValue:_Uize_Parse.Po.NameValue,
					whitespace:_Uize_Parse_Code.Whitespace
				}
		;

		return Uize.mergeInto (
			function (_source,_index) {
				var m = this;
				m._items = m.items = [];
				m._currentItems = {};
				m.parse (_source,_index);
			},

			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:true,

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length,
							_items = m._items
						;
						_items.length = 0;
						m.index = _index || (_index = 0);
						while (_index < _sourceLength) {
							for (var _itemType in _itemTypes) {
								var _item =
									m._currentItems [_itemType] ||
									(m._currentItems [_itemType] = new _itemTypes [_itemType])
								;
								_item.parse (_source,_index);
								if (_item.isValid) {
									_items.push (_item);
									m._currentItems [_itemType] = null;
									_index += _item.length;
								}
								if (_item.isValid) break;
							}
						}
						m.length = _index - m.index;
					},

					serialize:function () {
						return this.isValid ? Uize.map (this._items,'value.serialize ()').join ('') : '';
					}
				}
			}
		);
	}
});

