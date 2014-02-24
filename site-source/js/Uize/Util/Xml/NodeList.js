/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.NodeList Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 1
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Util.Xml.NodeList= module provides methods for parsing and serializing XML nodes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.NodeList',
	required:[
		'Uize.Util.Xml.Tag',
		'Uize.Util.Xml.Cdata',
		'Uize.Util.Xml.Comment',
		'Uize.Util.Xml.Text'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Util_Xml = Uize.Util.Xml,

			/*** General Variables ***/
				_currentNodes = {}
		;

		return Uize.mergeInto (
			function (_source,_index) {
				var m = this;
				m._nodes = m.nodes = [];
				m.parse (_source,_index);
			},

			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:true,

					parse:function (_source,_index) {
						function _tryParseNode (_nodeType) {
							var _node =
								_currentNodes [_nodeType] ||
								(_currentNodes [_nodeType] = new _Uize_Util_Xml [_nodeType])
							;
							_node.parse (_source,_index);
							if (_node.isValid) {
								_nodes.push (_node);
								_currentNodes [_nodeType] = null;
								_index += _node.length;
							}
							return _node.isValid;
						}
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length,
							_nodes = m._nodes
						;
						_nodes.length = 0;
						m.index = _index || (_index = 0);
						while (
							_index < _sourceLength &&
							(
								_tryParseNode ('Tag') ||
								_tryParseNode ('Comment') ||
								_tryParseNode ('Cdata') ||
								_tryParseNode ('Text')
							)
						);
						m.length = _index - m.index;
					},

					serialize:function () {
						return this.isValid ? Uize.map (this._nodes,'value.serialize ()').join ('') : '';
					}
				}
			}
		);
	}
});

