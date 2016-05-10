/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Oop.mClassFeatureDeclaration Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 10
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Oop.mClassFeatureDeclaration= mixin lets you mix in a feature declaration mechanism into class constructor functions.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Oop.mClassFeatureDeclaration',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_appliedMixins = 'mClassFeatureDeclaration_appliedMixins',

			/*** references to utility methods of Uize ***/
				_copyInto = _Uize.copyInto,
				_forEach = _Uize.forEach
		;

		return function (_class) {
			function _overrideMethods (_methodsHost,_methods) {
				_forEach (
					_methods,
					function (_method,_methodName) {
						if (_method) {
							var _former = _methodsHost [_methodName] || _Uize.nop;
							if (_Uize.isArray (_method))
								_method = _method [0] (_former)
							;
							_method.former = _former;
						}
						_methodsHost [_methodName] = _method;
					}
				);
			}

			_class.instanceMethods = function (_instanceMethods) {
				_overrideMethods (this.prototype,_instanceMethods);
			};

			_class.instanceProperties = function (_instanceProperties) {
				_copyInto (this.prototype,_instanceProperties);
			};

			_class.staticMethods = function (_staticMethods) {
				_overrideMethods (this,_staticMethods);
			};

			_class.staticProperties = function (_staticProperties) {
				_copyInto (this,_staticProperties);
			};

			_class.dualContextMethods = _class.dualContextProperties = function (_dualContextFeatures) {
				_copyInto (this,_dualContextFeatures);
				_copyInto (this.prototype,_dualContextFeatures);
			};

			_class.declare = function (_featuresByType) {
				for (var _featureType in _featuresByType)
					this [_featureType] (_featuresByType [_featureType])
				;
				return this;
			};

			_class.mixins = function (_mixins) {
				var
					m = this,
					_appliedMixins = m [_appliedMixins] || (m [_appliedMixins] = [])
				;
				function _applyMixins (_mixins) {
					if (!_Uize.isIn (_appliedMixins,_mixins)) {
						_appliedMixins.push (_mixins);
						_Uize.isFunction (_mixins)
							/* TODO:
								What about the case where the mixin is a class, so that its type would be a function? Perhaps we should check for a method that performs the mixin of the features from the class, and where this method could be implemented in the Uize.Class base class with a base implementation that mixes in all the static and instance features.
							*/
							? _mixins (m)
							: _Uize.isArray (_mixins)
								? _forEach (_mixins,_applyMixins)
								: m.declare (_mixins)
						;
					}
				}
				_applyMixins (_mixins);
			};

			return _class;
		};
	}
});

