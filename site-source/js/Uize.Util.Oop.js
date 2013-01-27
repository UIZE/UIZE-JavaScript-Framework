/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Oop Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 80
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Util.Oop= package provides convenience methods for...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Oop',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined,
				_isFunction = Uize.isFunction
			;

		/*** General Variables ***/
			var
				_sacredEmptyArray = [],
				_typicalPackageFunction = function () {},
				_implicitMethodNames = {toString:1,valueOf:1}
			;

		/*** Public Static Methods ***/
			_package.getFeatures = function (_instanceOrClass) {
				var
					_class = _package.resolveToClass (_instanceOrClass),
					_features = []
				;
				if (_class) {
					var _getFeaturesForContext = function (_contextName) {
						var
							_contextIsSetGet = _contextName == 'state',
							_context = _contextIsSetGet
								? _class.get ()
								: _contextName == 'instance' ? _class.prototype : _class,
							_featureNamePrefix = _contextName == 'static' ? _package.getClassName (_class) + '.' : '',
							_contextNameCapped = Uize.capFirstChar (_contextName),
							_propertyValue,
							_featureIsPublic
						;
						for (var _propertyName in _context)
							(_featureIsPublic = _propertyName.indexOf ('_') < 0) &&
								_features.push (
									Uize.copyInto (
										_package.getFeatureInfo (_class,_contextName,_propertyName),
										{
											name:_featureNamePrefix + _propertyName,
											shortName:_propertyName,
											access:_featureIsPublic ? 'Public' : 'Private',
											context:_contextNameCapped,
											type:_contextIsSetGet || !_isFunction (_propertyValue = _context [_propertyName])
												? 'Property'
												: typeof _propertyValue.moduleName == 'string'
													? 'Module'
													: 'Method'
										}
									)
								)
						;
					};
					_getFeaturesForContext ('instance');
					_getFeaturesForContext ('static');
					_package.isUizeClass (_class) && _getFeaturesForContext ('state');

					/*** sort the features by the keys: access, context, type, name ***/
						var _compareTwo = function (_valueA,_valueB) {
							return _valueA < _valueB ? -1 : _valueA > _valueB ? 1 : 0;
						};
						_features.sort (
							function (_featureA,_featureB) {
								return (
									_compareTwo (_featureA.access,_featureB.access) ||
									_compareTwo (_featureA.context,_featureB.context) ||
									_compareTwo (_featureA.type,_featureB.type) ||
									_compareTwo (_featureA.name,_featureB.name)
								);
							}
						);
				}
				return _features;
				/*?
					Static Methods
						Uize.Util.Oop.getFeatures
							Returns an array, representing all of the features that can be automatically detected from the specified class (or the class of the specified instance).

							SYNTAX
							...............................................................
							featuresARRAY = Uize.Util.Oop.getFeatures (instanceOrClassOBJ);
							...............................................................

							Each element of the array returned by the =Uize.Util.Oop.getFeatures= method is an object that describes an individual feature, as would be returned by the related =Uize.Util.Oop.getFeatureInfo= static method.

							NOTES
							- see the related =Uize.Util.Oop.getFeatureInfo= static method
				*/
			};

			_package.inheritsFrom = function (_testInstanceOrClass,_baseInstanceOrClass) {
				if (_baseInstanceOrClass == _undefined) return _testInstanceOrClass == _undefined;
				if (_testInstanceOrClass == _undefined) return _baseInstanceOrClass == Object;
				var
					_testClass =
						_isClass (_testInstanceOrClass) ? _testInstanceOrClass : _testInstanceOrClass.constructor,
					_baseClass =
						_isClass (_baseInstanceOrClass) ? _baseInstanceOrClass : _baseInstanceOrClass.constructor
				;
				while (_testClass != _baseClass && _isFunction (_testClass = _testClass.superclass));
				return _testClass == _baseClass;
			};

			var _isClass = _package.isClass = function (_object) {
				return (
					_object != _undefined &&
					(
						_isFunction (_object) ||
						(
							typeof _object == 'object' && !_object.constructor
							/* NOTE:
								In Internet Explorer, certain DOM object "classes" like HTMLBodyElement are reported as object, rather than function, and the value of their constructor property is undefined. Normally, the value of the constructor property for a non-null object is the constructor function for that object. In the case of the document.body element in IE, the constructor is a reference to HTMLBodyElement. That's all fine and good, but HTMLBodyElement is not a function. Instead, it's an object, whose constructor is undefined. We use this as an indication that the object is really a "class", until a better test is worked out.
							*/
						)
					)
				);
			};

			_package.isPackage = function (_object) {
				if (!_isClass (_object)) return false;

				/*** object must be a function / constructor, so check to see if function has code ***/
					var
						_objectToString = _object.toString,
						_typicalPackageFunctionToString = _typicalPackageFunction.toString,
						_toStringOverridden = _objectToString != _typicalPackageFunctionToString
					;
					if (_toStringOverridden)
						delete _object.toString
					;
					var _hasAnyConstruction = _object.toString () != _typicalPackageFunction.toString ();
					if (_toStringOverridden)
						_object.toString = _objectToString
					;
					if (_hasAnyConstruction) return false;

				/*** check to see if function's prototype has anything beyond what's in typical package function ***/
					var
						_objectPrototype = _object.prototype,
						_typicalPackageFunctionPrototype = _typicalPackageFunction.prototype
					;
					for (var _propertyName in _objectPrototype)
						if (
							!_implicitMethodNames [_propertyName] &&
							(
								!(_propertyName in _typicalPackageFunctionPrototype) ||
								_objectPrototype [_propertyName] != _typicalPackageFunctionPrototype [_propertyName]
							)
						)
							return false
					;

				return true;
			};

			_package.isUizeClass = function (_object) {
				return (
					_isClass (_object) &&
					_isFunction (_object.subclass) &&
					_isFunction (_object.superclass) &&
					_isFunction (_object.set) &&
					_isFunction (_object.get)
				);
			};

			_package.isUizeClassInstance = function (_value) {
				return Uize.isObject (_value) && _package.isUizeClass (_value.constructor);
			};

			_package.getClassName = function (_class) {
				return (
					(_class != _undefined && _class.moduleName) ||
					(
						(
							(_class + '').match (
								typeof _class == 'object'
									? /\[object\s+([^\]]+)\]/
									: /^\s*function\s+([^\(]+)\s*\(/
							) || _sacredEmptyArray
						) [1]
					) || ''
				);
			};

			_package.getFeatureInfo = function (_class,_contextName,_featureName) {
				function _returnClass () {return _class}
				function _returnPrototype () {return _class.prototype}
				function _returnSetGetProperties () {return _class.get ()}
				var
					_isInstanceFeature = _contextName == 'instance',
					_isSetGetFeature = !_isInstanceFeature && _contextName == 'state',
					_getFeatureContext = _isInstanceFeature
						? _returnPrototype
						: _isSetGetFeature ? _returnSetGetProperties : _returnClass,
					_feature = _getFeatureContext () [_featureName],
					_featureContext,
					_introducedIn = _class,
					_overriddenIn = _class
				;
				while (
					(_class = _class.superclass) &&
					_class.superclass && // ignore the stub superclass of the Uize base class
					(_featureContext = _getFeatureContext ()) &&
					_featureName in _featureContext
				) {
					if (_introducedIn == _overriddenIn && _featureContext [_featureName] == _feature)
						_overriddenIn = _class
					;
					_introducedIn = _class;
				}
				return {introducedIn:_introducedIn,overriddenIn:_overriddenIn};
				/*?
					Static Methods
						Uize.Util.Oop.getFeatureInfo

							SYNTAX
							...................................................................................
							featureInfoOBJ = Uize.Util.Oop.getFeatureInfo (classOBJ,contextSTR,featureNameSTR);
							...................................................................................

							FEATURE INFO OBJECT
							.........................
							name      : nameSTR,
							shortName : shortNameSTR,
							access    : accessSTR,
							context   : contextSTR,
							type      : typeSTR
							.........................

							Properties of the feature object...

							- *name* -
							- *shortName* -
							- *access* -
							- *context* -
							- *type* -

							NOTES
							- see the related =Uize.Util.Oop.getFeatures= static method
				*/
			};

			_package.getInheritanceChain = function (_class) {
				var _inheritanceChain = [];
				if (_package.isUizeClass (_class)) {
					var _superclass = _class;
					while (_superclass.moduleName) {
						_inheritanceChain.unshift (_superclass);
						_superclass = _superclass.superclass;
					}
				}
				return _inheritanceChain;
			};

			_package.resolveToClass = function (_instanceOrClass) {
				return (
					_instanceOrClass == _undefined || _isFunction (_instanceOrClass)
						? _instanceOrClass || _undefined
						: _instanceOrClass.constructor
				);
			};

		return _package;
	}
});

