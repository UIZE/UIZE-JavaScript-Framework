/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.Property Class
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
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.JavaProperties.Property= module provides methods for parsing and serializing properties in [[http://en.wikipedia.org/wiki/.properties][Java properties]] files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaProperties.Property',
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Str.CharClass',
		'Uize.Parse.JavaProperties.PropertyName',
		'Uize.Parse.JavaProperties.PropertyValue'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_separatorCharsLookup = _charsLookup ('=:'),
				_inlineWhitespaceCharClass = Uize.Str.CharClass (Uize.Str.Whitespace.inlineWhitespaceCharCodes)
		;

		/*** Utility Functions ***/
			function _charsLookup (_charsStr) {
				return Uize.lookup (_charsStr.split (''));
			}

		return _superclass.subclass ({
			constructor:function () {
				var m = this;
				m.name = new m.parserClassesByType.propertyName;
				m.value = new m.parserClassesByType.propertyValue;
				_superclass.apply (m,arguments);
			},

			instanceProperties:{
				parserClassesByType:{
					propertyName:Uize.Parse.JavaProperties.PropertyName,
					propertyValue:Uize.Parse.JavaProperties.PropertyValue
				}
			},

			instanceMethods:{
				parse:function (_source,_index) {
					function _eatInlineWhitespace () {
						_index =
							(_inlineWhitespaceCharClass.indexOfNonClassChar (_source,_index) + 1 || _sourceLength + 1) - 1
						;
					}
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					m.name.parse (_source,_index);
					if (m.name.isValid) {
						_index += m.name.length;
						_eatInlineWhitespace ();
						if (_separatorCharsLookup [_source.charAt (_index)]) {
							_index++;
							_eatInlineWhitespace ();
						}
						m.value.parse (_source,_index);
						_index += m.value.length;
					}
					m.isValid = !!(m.length = _index - m.index);
				},

				serialize:function () {
					return this.isValid ? this.name.serialize () + '=' + this.value.serialize () : '';
				}
			}
		});
	}
});

