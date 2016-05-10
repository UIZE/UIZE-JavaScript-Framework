/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.Text Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Xml.Text= module provides methods for parsing and serializing text nodes of XML documents.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.Text',
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Str.Replace',
		'Uize.Util.Html.Encode'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_htmlEncode = Uize.Str.Replace.replacerByLookup ({
					'&':'&amp;',
					'<':'&lt;',
					'>':'&gt;'
				}),
				_htmlDecode = Uize.Util.Html.Encode.decode
		;

		return _superclass.subclass ({
			instanceProperties:{
				text:''
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					if (m.isValid = _source.charAt (_index) != '<') {
						var _endPos = ((_source.indexOf ('<',_index + 1)) + 1 || _sourceLength + 1) - 1;
						m.text = _htmlDecode (_source.slice (_index,_endPos));
						m.length = _endPos - _index;
					} else {
						m.text = '';
						m.length = 0;
					}
				},

				serialize:function () {
					return _htmlEncode (this.text);
				}
			}
		});
	}
});

