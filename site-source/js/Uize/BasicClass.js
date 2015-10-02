/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.BasicClass Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 8
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.BasicClass= module implements an abstract base class for lightweight class modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.BasicClass',
	required:'Uize.mClassFeatureDeclaration',
	builder:function () {
		'use strict';

		return Uize.mClassFeatureDeclaration (function () {}).declare ({
			staticMethods:{
				subclass:function (_featuresByType) {
					var
						_superclass = this,
						_constructorProvided = _featuresByType && _featuresByType.hasOwnProperty ('constructor'),
						_class = _constructorProvided
							? _featuresByType.constructor
							: function () {return _superclass.apply (this,arguments)}
					;

					Uize.copyInto (_class,Uize.map (Uize.copy (_superclass),Uize.clone));
					Uize.copyInto (_class.prototype,Uize.clone (_superclass.prototype));

					if (_featuresByType) {
						if (_constructorProvided)
							delete _featuresByType.constructor
						;
						_class.declare (_featuresByType);
					}

					return _class;
				}
			}
		});
	}
});

