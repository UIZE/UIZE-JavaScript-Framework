/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Spy Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
	docCompleteness: 75
*/

/*?
	Introduction
		The =Uize.Util.Spy= class provides utility functionality for "spying" on methods of objects or classes, primarily useful as part of unit testing.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Util.Spy',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		var
			_Uize = Uize,

			_spy = function() {
				var
					m = this,
					_object = m._object,
					_methodName = m._methodName
				;

				if (_object && _methodName) {
					var _originalMethod = m.originalMethod = _object[_methodName];

					_object[_methodName] = function() {
						var
							_arguments = _Uize.copyList(arguments),
							_call = {
								args:_arguments
							}
						;

						m.set({_calls:m._calls.concat([_call])});

						m.fire({
							name:'Call',
							call:_call
						});

						if (_Uize.isFunction(m._mockMethod))
							return m._mockMethod.apply(_object, _arguments);
						else if (m._callThrough && _Uize.isFunction(_originalMethod))
							return _originalMethod.apply(_object, _arguments);
					};
				}

				m.reset();
			}
		;

		return _superclass.subclass({
			stateProperties:{
				_calls:'calls',
				_callCount:{
					name:'callCount',
					derived:'calls:calls.length'
				},
				_callThrough:{
					name:'callThrough',
					value:false
				},
				_hasBeenCalled:{
					name:'hasBeenCalled',
					derived:'callCount:callCount>0'
				},
				_methodName:{
					name:'methodName',
					onChange:_spy
				},
				_mockMethod:'mockMethod',
				_object:{
					name:'object',
					onChange:_spy
				},
				_recentCall:{
					name:'recentCall',
					derived:{
						properties:['calls'],
						derivation:function(_calls) {
							return _calls.length
								? _calls[_calls.length-1]
								: undefined
							;
						}
					}
				}
			},

			alphastructor:function() { this.reset() },

			instanceMethods:{
				reset:function() { this.set({_calls:[]}) }
			},

			instanceProperties:{
				originalMethod:null
			}
		});
	}
});
