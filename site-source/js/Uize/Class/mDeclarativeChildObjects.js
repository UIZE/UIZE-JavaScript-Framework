/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class.mDeclarativeChildObjects Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Class.mDeclarativeChildObjects= mixin implements features to provide a declarative approach to adding child objects (such as child widgets or child models) to a =Uize.Class= subclass.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Class.mDeclarativeChildObjects',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,

				_pairUp = _Uize.pairUp
		;

		return function (_class) {
			_class.declare ({
				staticMethods:{
					declarativeChildObjects:function(_properties) {
						var
							_declarativeFunctionName = _properties.declaration,
							_addMethodName = _properties.addMethod,
							_childObjectClassKey = _properties.childObjectClassKey,
							_beforeAdd = _properties.beforeAdd,
							_beforeAddIsFunction = _Uize.isFunction(_beforeAdd),

							_declarativeStaticDataName = 'mDeclarativeChildObjects_' + _declarativeFunctionName,
							_getContainerInstanceMethodName = 'mDeclarativeChildObjects_' + _declarativeFunctionName + '_getContainer'
						;

						this.declare({
							staticProperties:_pairUp(_declarativeStaticDataName, {}),

							staticMethods:_pairUp(
								_declarativeFunctionName,
								function(_children) {
									var _declarativeChildObjects = this[_declarativeStaticDataName];

									for (var _childName in _children) {
										var
											_childDeclaration = _children[_childName],
											_childDeclarationIsFunction = _Uize.isFunction(_childDeclaration) && !_childDeclaration.declare, // is a function, but not a class (since classes are functions)
											_childDeclarationIsPlainObject = _Uize.isPlainObject(_childDeclaration),
											_childProperties = !_childDeclarationIsFunction && !_childDeclarationIsPlainObject ? _pairUp(_childObjectClassKey, _childDeclaration) : _childDeclaration,
											_childObjectClass = !_childDeclarationIsFunction && _childProperties[_childObjectClassKey]
										;

										// Need to strip out the object class from the objectProperties, which means we need to copy it just in case
										// it's a shared object
										if (!_childDeclarationIsFunction && _childObjectClassKey in _childProperties) {
											_childProperties = _Uize.copy(_childProperties);
											delete _childProperties[_childObjectClassKey];
										}

										// NOTE: support multiple calls to declaration that could potentially include the same object again w/ additional properties (for whatever reason)
										// As such we can't omit the objects that don't have object class set, yet, because the object class *could* be added in a subsequent call to declaration. Will handle in constructor.
										var _previousChildDeclaration = _declarativeChildObjects[_childName] || (_declarativeChildObjects[_childName] = {_properties:{}});
										_previousChildDeclaration._childObjectClass = _childObjectClass || _previousChildDeclaration._childObjectClass;
										_previousChildDeclaration._isFunction = _childDeclarationIsFunction;
										_childDeclarationIsFunction
											? (_previousChildDeclaration._properties = _childProperties)
											: _Uize.copyInto (_previousChildDeclaration._properties || {},_childProperties)
										;
									}
								}
							),

							omegastructor:function() {
								var
									m = this,
									_declarativeChildObjects = m.Class[_declarativeStaticDataName]
								;

								_Uize.forEach(
									_declarativeChildObjects,
									function (_declarativeChild, _childName) {
										function _addChild() {
											var
												_childObjectClass = _declarativeChild._childObjectClass,
												_childProperties = _declarativeChild._properties

											;

											// When value is a function call the function in the context of this widget
											if (_declarativeChild._isFunction)
												_childProperties = _childProperties.call(m, _childName);

											// Need to get the object class from the properties if it's there.
											// If it is there we need to remove it from the properties, so we gotta copy it.
											if (_childObjectClassKey in _childProperties) {
												_childProperties = _Uize.copy(_childProperties);
												_childObjectClass = _childProperties[_childObjectClassKey];
												delete _childProperties[_childObjectClassKey];
											}

											// NOTE: Filter out children w/o child object class. They will be deferred loaded by some other mechanism. They were there for feature detection.
											return _childObjectClass
												&& m[_getContainerInstanceMethodName](_childName)[_addMethodName](_childName, _childObjectClass, _childProperties)
											;
										}

										_beforeAddIsFunction
											? _beforeAdd.call(m, _childName, _addChild)
											: _addChild()
										;
									}
								);
							},

							instanceMethods:_pairUp(
								_getContainerInstanceMethodName,
								function() { return this }
							)
						});
						/*?
							Static Methods
								Uize.Class.mDeclarativeChildObjects.declarativeChildObjects
									Lets you conveniently declare the type of child objects declaration to declare on the class.

									SYNTAX
									.........................................
									MyClass.declarativeChildObjects (declarativeChildObjectsPropertiesOBJ);
									.........................................

									The sole =declarativeChildObjectsPropertiesOBJ= parameter supports the following properties...

									- =declaration= - the name of the actual child objects declaration =function= to create (such as ='children'= for =Uize.Widget.mDeclarativeChildren=)
									- =addMethod= - the name of the instance method that adds individual child objects (such as ='addChild'= for =Uize.Widget.mDeclarativeChildren=)
									- =childObjectClassKey= - the name of the key within the child object properties that would signify the child object class (such as ='widgetClass' for =Uize.Widget.mDeclarativeChildren=)
						*/
					}
				}
			});
		};
	}
});
