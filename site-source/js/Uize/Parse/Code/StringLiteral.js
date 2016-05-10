/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Code.StringLiteral Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Parse.Code.StringLiteral= module defines a parser class for string literals.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Code.StringLiteral',
	superclass:'Uize.Parse.Base',
	required:'Uize.Str.Replace',
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_escapeReplacer = Uize.Str.Replace.replacerByLookup ({
					'\\':'\\\\',
					'\n':'\\n',
					'\r':'\\r',
					'"':'\\"'
				}),
				_unescapeReplacer = Uize.Str.Replace.replacerByLookup ({
					'\\\\':'\\',
					'\\n':'\n',
					'\\r':'\r',
					'\\"':'"',
					'\\\'':'\''
				})
		;

		return _superclass.subclass ({
			instanceProperties:{
				value:''
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					m.isValid = false;
					var _currentChar = _source.charAt (_index);
					if (_currentChar == '"' || _currentChar == '\'') {
						_index++;
						var
							_inEscape = false,
							_quoteChar = _currentChar
						;
						while (_index < _sourceLength) {
							var _char = _source.charAt (_index);
							if (_char == _quoteChar && !_inEscape) {
								m.isValid = true;
								m.value = _unescapeReplacer (_source.slice (m.index + 1,_index));
								m.length = ++_index - m.index;
								break;
							} else {
								_inEscape = _inEscape ? false : _char == '\\';
								_index++;
							}
						}
					} else {
						m.value = '';
						m.length = 0;
					}
				},

				serialize:function () {return this.isValid ? '"' + _escapeReplacer (this.value) + '"' : ''}
			}
		});
	}
});

