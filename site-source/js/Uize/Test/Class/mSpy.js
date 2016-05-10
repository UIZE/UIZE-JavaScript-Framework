/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Class.mSpy Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.Class.mSpy= module provides spying convenience methods for writing test cases against =Uize.Class= subclass modules.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Class.mSpy',
	required:[
		'Uize.Util.Spy',
		'Uize.Data.Compare',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		var
			_Uize = Uize
		;

		return function (_class) {
			_class.declare({
				instanceMethods:{
					expectToHaveBeenCalled:function(_spyObject) {
						var
							_methodName = _spyObject.get('methodName'),
							_called = _methodName + ' method called'
						;
						return this.expect(
							_called,
							_spyObject.get('hasBeenCalled')
								? _called
								: _methodName + ' method NOT called'
						);
					},
					expectToHaveBeenCalledWith:function(_spyObject, _expectedArgs) {
						var
							_methodName = _spyObject.get('methodName'),
							_expectedArgsLength = _expectedArgs.length,
							_expectedArgsSerialized = _Uize.Json.to(_expectedArgs, 'mini'),
							_matchingCalls = _Uize.map(
								_spyObject.get('calls'),
								function(_call) {
									return _Uize.Data.Compare.identical(
										_expectedArgs,
										_call.args.slice(0, _expectedArgsLength)
									);
								}
							),
							_called = _methodName + ' method was called with expected args: ' + _expectedArgsSerialized
						;
						return this.expect( // compare with subset of args
							_called,
							_Uize.isIn(_matchingCalls, true)
								? _called
								: _methodName + ' method was NOT called with expected args: ' + _expectedArgsSerialized
						);
					},
					expectToNotHaveBeenCalled:function(_spyObject) {
						var
							_methodName = _spyObject.get('methodName'),
							_notCalled = _methodName + ' method not called'
						;
						return this.expect(
							_notCalled,
							!_spyObject.get('hasBeenCalled')
								? _notCalled
								: _methodName + ' method WAS called'
						);
					},
					expectToNotHaveBeenCalledWith:function(_spyObject, _expectedArgs) {
						var
							_methodName = _spyObject.get('methodName'),
							_expectedArgsLength = _expectedArgs.length,
							_expectedArgsSerialized = _Uize.Json.to(_expectedArgs, 'mini'),
							_matchingCalls = _Uize.map(
								_spyObject.get('calls'),
								function(_call) {
									return _Uize.Data.Compare.identical(
										_expectedArgs,
										_call.args.slice(0, _expectedArgsLength)
									);
								}
							),
							_notCalled = _methodName + ' method was NOT called with expected args: ' + _expectedArgsSerialized
						;
						return this.expect( // compare with subset of args
							_notCalled,
							!_Uize.isIn(_matchingCalls, true)
								? _notCalled
								: _methodName + ' method was called with expected args: ' + _expectedArgsSerialized
						);
					},
					spyOn:function() {
						var
							_arguments = arguments,
							_argumentsLength = _arguments.length,
							_spyObject = _Uize.Util.Spy(
								_argumentsLength == 2
									? {object:_arguments[0], methodName:_arguments[1]}
									: _arguments[0]
							)
						;

						return _spyObject;
					}
				}
			});
		};
	}
});
