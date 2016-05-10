/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Oop.BasicClass Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Oop.BasicClass= module implements an abstract base class for lightweight class modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Oop.BasicClass',
	required:'Uize.Oop.mClassFeatureDeclaration',
	builder:function () {
		'use strict';

		return Uize.Oop.mClassFeatureDeclaration (function () {}).declare ({
			staticMethods:{
				subclass:function (_featuresByType) {
					var
						/*** Variables for Scruncher Optimization ***/
							_clone = Uize.clone,

						/*** General Variables ***/
							_superclass = this,
							_constructorProvided = _featuresByType && _featuresByType.hasOwnProperty ('constructor'),
							_class = _constructorProvided
								? _featuresByType.constructor
								: function () {return _superclass.apply (this,arguments)}
					;

					/*** Inherit static properties (excluding prototype) and methods from base class ***/
						for (var _property in _superclass)
							if (_property != 'prototype') _class [_property] = _clone (_superclass [_property])
						;

					/*** Inherit instance properties and methods from base class ***/
						Uize.map (_superclass.prototype,_clone,_class.prototype);
						_class.prototype.Class = _class;

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

