/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.MacStrings.String Class
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
		The =Uize.Parse.MacStrings.String= module provides methods for parsing and serializing strings in [[https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html][Mac OS / iOS Strings Files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.MacStrings.String',
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.Code.StringLiteral'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_StringKeyOrValue = Uize.Parse.Code.StringLiteral,

			/*** Variables for Performance Optimization ***/
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return _superclass.subclass ({
			constructor:function () {
				var m = this;
				m.stringKey = new _StringKeyOrValue;
				m.stringValue = new _StringKeyOrValue;
				_superclass.apply (m,arguments);
			},

			instanceMethods:{
				parse:function (_source,_index) {
					function _eatWhitespace () {
						_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
					}
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.isValid = false;
					m.index = _index || (_index = 0);
					m.length = 0;
					m.stringKey.parse (_source,_index);
					if (m.stringKey.isValid) {
						_index += m.stringKey.length;
						_eatWhitespace ();
						if (_source.charAt (_index) == '=') {
							_index++;
							_eatWhitespace ();
							m.stringValue.parse (_source,_index);
							if (m.stringValue.isValid) {
								_index += m.stringValue.length;
								_eatWhitespace ();
								if (_source.charAt (_index) == ';') {
									_index++;
									m.length = _index - m.index;
									m.isValid = true;
								}
							}
						}
					}
				},

				serialize:function () {
					return this.isValid ? this.stringKey.serialize () + ' = ' + this.stringValue.serialize () + ';' : '';
				}
			}
		});
	}
});

