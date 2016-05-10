/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.ParserTest Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.ParserTest= module defines a base class for parser test classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.ParserTest',
	superclass:'Uize.Test',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_isPlainObject = Uize.isPlainObject
		;

		/*** Utility Functions ***/
			function _mergeSourceIntoTarget (_target,_source) {
				var
					_targetPropertyValue,
					_sourcePropertyValue
				;
				for (var _property in _source)
					(
						_isPlainObject (_sourcePropertyValue = _source [_property]) &&
						(_targetPropertyValue = _target [_property]) &&
						typeof _targetPropertyValue == 'object'
					)
						? _mergeSourceIntoTarget (_targetPropertyValue,_sourcePropertyValue)
						: (_target [_property] = _sourcePropertyValue)
				;
			}

		return _superclass.subclass ({
			staticMethods:{
				parserTest:function (_title,_arguments,_expectedInstanceState) {
					return {
						title:_title,
						test:function () {
							var
								m = this,
								_parser = new (Uize.getModuleByName (m.Class.parserClass)),
								_result = true
							;
							function _expectObjectProperties (_expectedProperties,_actualProperties) {
								for (var _property in _expectedProperties) {
									var
										_expectedProperty = _expectedProperties [_property],
										_actualProperty = _actualProperties [_property]
									;
									if (Uize.isPlainObject (_expectedProperty)) {
										_expectObjectProperties (_expectedProperty,_actualProperty);
									} else {
										_result = m.expect (_expectedProperty,_actualProperty);
									}
									if (!_result) break;
								}
							}
							_parser.parse.apply (_parser,_arguments);
							_expectObjectProperties (_expectedInstanceState,_parser);
							return _result;
						}
					};
				},

				serializerTest:function (_title,_instanceStateOrSourceText,_expected) {
					return {
						title:_title,
						test:function () {
							var _parser = new (Uize.getModuleByName (this.Class.parserClass));
							typeof _instanceStateOrSourceText == 'string'
								? _parser.parse (_instanceStateOrSourceText)
								: _mergeSourceIntoTarget (_parser,_instanceStateOrSourceText)
							;
							return this.expect (_expected,_parser.serialize ());
						}
					};
				}
			},

			staticProperties:{
				parserClass:null  // this should be overridden by subclasses
			}
		});
	}
});

