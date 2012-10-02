/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Needs Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Util.Needs= class implements a mechanism for expressing needs/provides relationships in a semantically elegant way.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Needs',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		/*** General Variables ***/
			var _needConditionPrefix = 'NEEDED_';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.need = function (_needs,_needer) {
				var _this = this;
				_this.once (_needs,_needer);
				typeof _needs == 'string'
					? _this.met (_needConditionPrefix + _needs)
					: Uize.forEach (_needs,function (_need) {_this.met (_needConditionPrefix + _need)})
				;
			};

			_classPrototype.provide = function (_need,_provider) {
				var _this = this;
				_this.once (
					_needConditionPrefix + _need,
					function () {_provider (function (_provided) {_this.met (_need,_provided)})}
				);
			};

		return _class;
	}
});

