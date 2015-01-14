/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Oop.mTreeInheritance Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Oop.mTreeInheritance= module is a mixin module that provides an implementation for tree inheritance features that can be mixed in to classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Oop.mTreeInheritance',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize
		;

		return function (_class) {
			_class.staticMethods ({
				treeInheritedStateProperties:function (_properties) {
					var _class = this;
					_Uize.forEach (
						_properties,
						function (_propertyProfile,_propertyPrivateName) {
							var
								_propertyPublicName = _propertyProfile.name || _propertyPrivateName,
								_propertyInheritedName = _propertyPublicName + 'Inherited',
								_defaultValue = _propertyProfile.value
							;
							function _checkInherited () {
								var
									m = this,
									_value = m [_propertyPrivateName]
								;
								if (_value == 'inherit' || _value === _undefined)
									_value = m.parent ? m.parent [_propertyInheritedName] : _defaultValue
								;
								if (_value === _undefined)
									_value = _defaultValue
								;
								if (_value != m [_propertyInheritedName])
									m.set (_propertyInheritedName,_value)
								;
							}
							_class.stateProperties (
								_Uize.pairUp (
									_propertyPrivateName,
									{
										name:_propertyPublicName,
										onChange:_checkInherited,
										value:'inherit'
									},
									_propertyInheritedName,
									{
										onChange:function () {_Uize.callOn (this.children,_checkInherited)},
										value:_defaultValue
									}
								)
							);
						}
					)
				}
			});

			_class.instanceMethods ({
				getProvider:function (_property) {
					var
						m = this,
						_value
					;
					while (((_value = m.get (_property)) === 'inherit' || _value === _undefined) && (m = m.parent));
					return m;
				},

				getInherited:function (_property) {
					var _provider = this.getProvider (_property);
					return _provider && _provider.get (_property);
				},

				setInherited:function (_properties) {
					var _provider;
					for (var _propertyName in _properties) {
						if (_provider = this.getProvider (_propertyName))
							_provider.set (_propertyName,_properties [_propertyName])
						;
					}
				},

				callInherited:function (_property) {
					var m = this;
					return (
						function () {
							var _provider = m.getProvider (_property);
							if (_provider) {
								var _inheritedMethod = _provider.get (_property);
								if (_Uize.isFunction (_inheritedMethod))
									return _inheritedMethod.apply (_provider,arguments)
								;
							}
						}
					);
				}
			});
		};
	}
});

