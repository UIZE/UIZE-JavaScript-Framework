/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Matchers.Base Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Util.Matchers.Base= package implements an abstract

		provides a way to resolve an attribute matcher expression to an attribute matcher function.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Matchers.Base',
	builder:function () {
		'use strict';

		return Uize.package ({
			resolve:function () {return Uize.returnTrue},

			test:function (_value,_matcher) {
				return this.resolve (_matcher) (_value);
			},

			filter:function (_values,_matcher) {
				_matcher = this.resolve (_matcher);
				for (
					var _valueNo = -1, _valuesLength = _values.length, _value, _filteredValues = [];
					++_valueNo < _valuesLength;
				)
					_matcher (_value = _values [_valueNo]) && _filteredValues.push (_value)
				;
				return _filteredValues;
			},

			extend:function (_statics) {
				return Uize.copyInto (Uize.package (),this,_statics);
			}
		});
	}
});

