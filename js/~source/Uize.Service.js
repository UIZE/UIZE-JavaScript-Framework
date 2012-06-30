/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Service Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=b"*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Service= module defines a base class from which classes that define services can inherit.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Service',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_false = false,
				_true = true,

				/*** references to utility methods of Uize ***/
					_Uize = Uize,

				/*** constants ***/
					SERVICE_TAKING_TOO_LONG = 5000
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._warn = function (_message) {
				this.log('SERVICE WARNING: ' + _message);
			};

		/*** Public Static Methods ***/
			_class.declareServiceMethods = function (_serviceMethods) {

			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_adapter:{
					name:'adapter',
					conformer:function (_adapter) {
						if (typeof _adapter == 'string')
							_adapter = eval (_adapter)
						;
						if (_adapter != _undefined) {

						}
						return _adapter;
					},
					onChange:function () {
						var _this = this;
						_this.set ('initialized',_false);

					}
				},
				_initialized:{
					name:'initialized',
					value:false
				}
			});
	}
});

