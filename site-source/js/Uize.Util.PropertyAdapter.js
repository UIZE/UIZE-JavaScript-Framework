/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.PropertyAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.PropertyAdapter= class implements a mechanism for connecting `two state properties` together, with optional bi-directional value adapter code.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Util.PropertyAdapter= class makes it easy to connect `two state properties` in a synchronization relationship, where a change in the value of one of the properties results in the value of the other property being synchronized to the new value of the property that changed.

			Any two state properties can be connected to each other using a property adapter instance. It can be two properties of the same instance, or it can be properties of two different instances. The properties being connected can belong to widget instances (ie. instances of =Uize.Widget= subclasses), but the instances owning the properties do not have to be widgets. The instances owning the two properties being connected do not even have to be of the same class. And the two properties do not even have to be of the same type or have the same value range - the =Uize.Util.PropertyAdapter= class provides a way to specify a `value adapter` that should be used to adapt the value in either direction.

			A Basic Example
				To connect two properties of any two instances together through a property adapter is as easy as creating an instance of the =Uize.Util.PropertyAdapter= class.

				EXAMPLE
				................................
				Uize.Util.PropertyAdapter ({
					propertyA:{
						instance:sliderA,
						property:'minValue'
					},
					propertyB:{
						instance:sliderB,
						property:'minValue'
					}
				});
				................................

				In the above example, the =minValue= state properties of two sliders (instances of the =Uize.Widget.Bar.Slider= class) are being connected through a property adapter, so that if the value of the =minValue= property is modified in =sliderA=, the value of the =minValue= property of =sliderB= is automatically synchronized to that new value, and vice versa.

			Features
				While elegant in its simplicity (and not involving all that much code), the =Uize.Util.PropertyAdapter= class is quite powerful and versatile with the small set of features it has.

				Two State Properties
					Each instance of the =Uize.Util.PropertyAdapter= class can connect two state properties together: `property A` and `property B`.

					Property A
						Property A is one of the `two state properties` that can be connected together via an instance of the =Uize.Util.PropertyAdapter= class.

						To set the instance and property for `property A`, set the value of the =propertyA= state property of the =Uize.Util.PropertyAdapter= instance to a valid `property specifier` (see `A Basic Example`).

						Property A Is Primary
							While both `property A` and `property B` are kept synchronized by a property adapter, and affecting any one will affect the other, `property A` is given special treatment and is regarded as the primary property of the pair.

							In practical terms, what this means is that whenever `initial connection` is established between two properties, the value of `property B` is initially synchronized to the value of `property A`. If the values of the two properties were already in agreement (taking into account also the optional `value adapter`), then there will be no change in the value of `property B`. If they are not in agreement at the time of `initial connection`, then the value of `property B` will change - the value of `property A` will never change upon connecting the two properties.

					Property B
						Property B is one of the `two state properties` that can be connected together via an instance of the =Uize.Util.PropertyAdapter= class.

						To set the instance and property for `property B`, set the value of the =propertyB= state property of the =Uize.Util.PropertyAdapter= instance to a valid `property specifier` (see `A Basic Example`).

						Property B Is Secondary
							While `property A is primary`, `property B` is secondary in the connection of two properties (for an explanation of what this means in practical terms, refer to the section `Property A is Primary`).

					Property Specifier
						Specifying the instance and property for either `property A` or `property B` is done using a property specifier.

						A property specifier can take one of several forms, as outlined below...

						Property Specifier Object Form
							The canonical form of a `property specifier` is an object, containing the properties =instance= and =property=.

							SYNTAX
							......................................................................................
							{
								instance : instanceOBJ,     // reference to an instance of a Uize subclass
								property : propertyNameSTR  // name of a state property on the specified instance
							}
							......................................................................................

							The value of the =instance= property should be a reference to an instance of a =Uize.Class= subclass, and the value of the =property= property should be a string specifying the name of a state property on the instance specified by the =instance= property. If the value of the =property= property is =null= or =undefined=, then the property name will be defaulted to ='value'=.

							Because the `property specifier object form` is the canonical form for a `property specifier`, when a property is specified using either the `property specifier array form` or the `property specifier instance form`, the property specifier is resolved to the object form.

						Property Specifier Array Form
							As a convenience, a property can be specified using the concise array form, in which a property is specified as a two element array.

							SYNTAX
							...........................................................................
							[
								instanceOBJ,     // reference to an instance of a Uize subclass
								propertyNameSTR  // name of a state property on the specified instance
							]
							...........................................................................

							The value of the first element of the array should be a reference to an instance of a =Uize.Class= subclass, and the value of the second element of the array should be a string specifying the name of a state property on the instance specified by the =instance= property. If the value of the second element is =null= or =undefined=, then the property name will be defaulted to ='value'=.

						Property Specifier Instance Form
							In the special case where one wishes to specify the =value= property of an instance of a =Uize.Class= subclass, the property can be specified simply by specifying a reference to the instance.

							SYNTAX
							...........................................................
							instanceOBJ  // reference to an instance of a Uize subclass
							...........................................................

							It is a fairly common use case to connect the =value= property of two instances to one another using a property adapter. For such cases, specifying just the instances for each of the properties is a convenient shorthand.

						Versatile Conformer
							When using a `property specifier` to specify a value for either of the =propertyA= or =propertyB= state properties, the `property specifier` is resolved to the canonical `property specifier object form` using a versatile conformer.

							Because the values of the =propertyA= or =propertyB= state properties are conformed, a `property specifier` expressed in either the `property specifier array form` or the `property specifier instance form` will not be stored internally in those alternate forms, but will instead be conformed to the canonical `property specifier object form`.

				Value Adapter
					A powerful feature of the =Uize.Util.PropertyAdapter= class is its support for a value adapter, which allows transformation of the values of `property A` and `property B` in both directions.

					A value adapter is an object of the following form...

					STRUCTURE
					.........................................................................................
					{
						aToB : aToBValueTransformerFUNC,  // transforms property A value into property B value
						bToA : bToAValueTransformerFUNC   // transforms property B value into property A value
					}
					.........................................................................................

					aToB
						The =aToB= property of a value adapter object specifies a `value transformer` function that should be used to transform a value for `property A` to produce a value for `property B`.

					bToA
						The =bToA= property specifies a `value transformer` function that should be used to transform a value for `property B` to produce a value for `property A`.

					Value Transformer
						A value transformer specified for either of the properties =aToB= or =bToA= should be a function that expects to receive a single parameter representing the value to be transformed, and that should return the transformed value.

						EXAMPLE
						...................................................
						{
							aToB:function (value) {return value * value},
							bToA:function (value) {return Math.sqrt (value)}
						}
						...................................................

						In the above example, a `value adapter` is defining a mathematical relationship between a value A and a value B, where value B is the square of value A and, conversely, where value A is the square root of value B. The =aToB= property specifies the function that is use to convert value A to value B, which takes a value parameter and returns its square. The =bToA= property specifies the function that is use to convert value B to value A, which takes a value parameter and returns its square root.

					Use Cases for a Value Adapter
						A value adapter allows the values of the `two state properties` that are connected through a property adapter to be encoded or serialized differently, or to have some other form of relationship to one another (such as a mathematical relationship, for example).

						Value Adapter for Mathematical Relationships
							A `value adapter` can be used in the context of a property adapter to maintain a mathematical relationship between `two state properties`.

							EXAMPLE
							..........................................................................
							Uize.Util.PropertyAdapter ({
								propertyA:numberTextInput,         // instance of Uize.Widget.TextInput
								propertyB:numberSquaredTextInput,  // instance of Uize.Widget.TextInput
								valueAdapter:{
									aToB:function (value) {return value * value},
									bToA:function (value) {return Math.sqrt (value)}
								}
							});
							..........................................................................

							In the above example, a property adapter is being used to connect the =value= state properties of two text input widgets (instances of the =Uize.Widget.TextInput= class): =numberTextInput= and =numberSquaredTextInput=. A value adapter is specified to maintain a relationship where the value of the =numberSquaredTextInput= instance is the square of the value of the =numberTextInput= instance and, conversely, where the value of the =numberTextInput= instance is the square root of the =numberSquaredTextInput= instance.

						Value Adapter for Different Encodings
							A `value adapter` can be used in the context of a property adapter to maintain an encoding relationship between `two state properties`.

							EXAMPLE
							........................................................
							Uize.Util.PropertyAdapter ({
								propertyA:colorAsHexTextInput,
								propertyB:colorAsRgbTextInput,
								valueAdapter:Uize.Color.adapter ('#hex','RGB string')
							});
							........................................................

							In the above example, a property adapter is being used to connect the =value= state properties of two text input widgets (instances of the =Uize.Widget.TextInput= class): =colorAsHexTextInput= and =colorAsRgbTextInput=. A value adapter is specified to maintain a relationship where the values of the =colorAsHexTextInput= and =colorAsRgbTextInput= instances represent the same color, but where the value of the =colorAsHexTextInput= instance is the color encoded in hex format (eg. =#ffa500= for orange), and the value of the the =colorAsRgbTextInput= instance is the color encoded in RGB tuple format (eg. =rgb(255,165,0)= for orange). In this example, we're fortunate enough to be able to use the =Uize.Color.adapter= static method of the =Uize.Color= object to generate a `value adapter` that will adapt a color value between the two encodings ='#hex'= and ='RGB string'=.

					How a Value Adapter is Used
						If a `value adapter` is specified for a property adapter instance, it is used whenever `synchronization` needs to be performed between the state properties that are connected through the property adapter.

						When `property A to property B synchronization` is performed, the `value transformer` function specified by the =aToB= property of the value adapter object is applied to the value of `property A` to produce a new value for `property B`. Conversely, when `property B to property A synchronization` is performed, the `value transformer` function specified by the =bToA= property of the value adapter object is applied to the value of `property B` to produce a new value for `property A`.

				Connection and Disconnection
					The `two state properties` specified for an instance of the =Uize.Util.PropertyAdapter= class are connected and disconnected under different conditions.

					Initial Connection
						Initial connection is when the `two state properties` are either connected for the very first time, or are reconnected after having been disconnected.

						Specifically, initial connection occurs when...

						- the value of the =connected= state property becomes =true=, and the value of neither the =propertyA= nor =propertyB= state property is =null= or =undefined=

						- immediately after either of `property A` or `property B` are changed or the `value adapter` is changed, and the value of neither the =propertyA= nor =propertyB= state property is =null= or =undefined=

						Whenever `initial connection` occurs, the propery adapter instance performs `property A to property B synchronization`, and value change event handlers are wired on the instances that own the `two state properties` in order to ensure that the appropriate `synchronization` is performed when the value of either `property A` or `property B` is modified.

					Disconnection
						Disconnection is when `two state properties` that were previously connected through a property adapter instance become disconnected so that their values are no longer kept synchronized.

						Specifically, disconnection occurs when two state properties were previously connected and then ...

						- the value of the =connected= state property becomes =false=

						- the value of any of the =propertyA=, =propertyB=, or =valueAdapter= state properties is changed (if the value of neither the =propertyA= nor =propertyB= state property is =null= or =undefined= after the change, then disconnection will occur right before the `initial connection` that occurs for the new configuration of connected properties and/or `value adapter`)

				Synchronization
					Synchronization is when the value of one of the `two state properties` that are connected through a property adapter instance changes, and the value of the other property in the pair is updated in order to keep it synchronized with the one that changed.

					When `two state properties` are specified for a property adapter instance, but that instance's =connected= state property is set to =false=, then synchronization will not be performed if the value of either of the `two state properties` is modified. Whenever synchronization is performed, the value of the =valueAdapter= state property is taken into consideration (see `How a Value Adapter is Used`).

					Property A to Property B Synchronization
						Once `initial connection` has occured between `two state properties` specified for a property adapter instance, a change in the value of `property A` will result in the value of `property B` being synchronized to the new value of `property A`.

						When the value of `property B` is synchronized to the value of `property A`, any `value adapter` specified for the property adapter instance is taken into account (see `How a Value Adapter is Used`).

						Property A to Property B Synchronization on Initial Connection
							Unlike `property B to property A synchronization`, synchronization from property A to property B is also performed upon `initial connection` of the `two state properties`.

							This ensures that the values of `property A` and `property B` are in agreement immediately upon connecting the two properties through the property adapter.

					Property B to Property A Synchronization
						Once `initial connection` has occured between `two state properties` specified for a property adapter instance, a change in the value of `property B` will result in the value of `property A` being synchronized to the new value of `property B`.

						When the value of `property A` is synchronized to the value of `property B`, any `value adapter` specified for the property adapter instance is taken into account (see `How a Value Adapter is Used`).

				Dynamically Updatable
					The =Uize.Util.PropertyAdapter= class supports dynamic updating of all of its state properties.

					This means that one can `dynamically connect and disconnect` the properties connected through an instance, one can `dynamically change the properties` connected through an instance, and one can `dynamically change the value adapter` being used by an instance.

					Dynamically Connect and Disconnect
						The =Uize.Util.PropertyAdapter= class supports dynamically connecting and disconnecting the `two state properties` that are connected through a property adapter instance.

						The properties can be connected or disconneced at any time, simply by setting the value of the property adapter instance's =connected= state property.

					Dynamically Change the Properties
						Any or both of the `two state properties` that are connected through a property adapter instance can be changed midstream, simply by setting the value of either or both of the property adapter instance's =propertyA= and =propertyB= state properties.

						When dynamically changing the properties that are connected through a property adapter, `disconnection` will occur for any previously connected properties, after which `initial connection` will occur for the new configuration of properties.

					Dynamically Change the Value Adapter
						The =Uize.Util.PropertyAdapter= class supports dynamically changing the `value adapter` that is used to transform values when performing `synchronization` from `property A` to `property B`, and vice versa.

						Changing the `value adapter` that is used by a property adapter instance is as simple as setting the value of the instance's =valueAdapter= state property. When dynamically changing the `value adapter`, `disconnection` will occur for any previously connected properties, after which `initial connection` will occur for the new configuration of properties and value adapter.

				Infinite Loop Protection
					The =Uize.Util.PropertyAdapter= class implements infinite loop protection, to prevent runaway looping that may otherwise occur as a result of `non-settling property values` or a `divergent value adapter`.

					Non-settling Property Values
						Non-settling property values is a problem that could occur if a `value adapter` is specified where a value for `property B` that is generated from `property A` using the =aToB= transformer function cannot be converted back to the exact original value for `property A` using the =bToA= tranformer function, and the same is also true for transforming with `property B` as the original value.

						The actual cause of non-settling property values could be a `value adapter` whose transformer functions involve mathematical calculations that suffer from insufficient precision.

						Divergent Value Adapter
							A specific type of issue of `non-settling property values` occurs when the two transformer functions of a `value adapter` produce infinitely diverging values for `property A` and `property B`.

							EXAMPLE
							...............................................
							Uize.Util.PropertyAdapter ({
								propertyA:sliderA,
								propertyB:sliderB,
								valueAdapter:{
									aToB:function (value) {return value + 1},
									bToA:function (value) {return value + 1}
								}
							});
							...............................................

							In the above example, both the =aToB= and =bToA= transformer functions of the `value adapter` increment the value they're given. If synchronization was allowed to be a runaway process, both the value for `property A` and `property B` would continue incrementing ad infinitum.

					How Looping is Prevented
						Fortunately, the =Uize.Util.PropertyAdapter= class implements a simple mechanism to prevent infinite loops that could otherwise occur with `non-settling property values`.

						In simple terms, while value change event handlers are wired for both `property A` and `property B` in order to support `synchronization` in both directions, a change in the value of one of the properties that is synchronized to the other property blocks the change in the value of the other property from causing synchronization back to the property that originally changed and initiated the synchronization in the first place. Simple. Nipped in the bud.

				Uize.Util.PropertyAdapter vs Uize.Util.Coupler
					While the =Uize.Util.PropertyAdapter= and =Uize.Util.Coupler= classes are similar in spirit, there are some key differences to note.

					- the =Uize.Util.PropertyAdapter= class supports connecting any two state properties of any two instances (eg. the =textColor= property of some instance with the =bgColor= property of some other instance), while the =Uize.Util.Coupler= class supports connecting the same set of any number of state properties across two or more instances (eg. the =minValue= and =maxValue= properties of three different slider widget instances)

					- the =Uize.Util.Coupler= class supports only exact synchronization of the values of the various connected properties, while the =Uize.Util.PropertyAdapter= class supports an optional `value adapter` object that allows for the connected properties to have different value ranges or encodings

					For Simple Cases, They're Equivalent
						In the most simple case of connecting the same named property of two instances, without any value adapting between the properties, either of the =Uize.Util.PropertyAdapter= and =Uize.Util.Coupler= classes could be used to the same effect.

						USING A COUPLER...
						...................................
						Uize.Util.Coupler ({
							instances:[instanceA,instanceB],
							properties:['someProperty']
						});
						...................................

						USING A PROPERTY ADAPTER...
						........................................
						Uize.Util.PropertyAdapter ({
							propertyA:[instanceA,'someProperty'],
							propertyA:[instanceB,'someProperty']
						});
						........................................
*/

Uize.module ({
	name:'Uize.Util.PropertyAdapter',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** State Properties ***/
			function _updateConnection () {
				var
					_this = this,
					_wirings = _this._wirings
				;

				function _wireOrUnwireWirings (_wiringMethodName) {
					for (var _wiringNo = -1, _wiringsLength = _wirings.length, _wiring; ++_wiringNo < _wiringsLength;)
						(_wiring = _wirings [_wiringNo])._instance [_wiringMethodName] (_wiring._eventName,_wiring._handler)
					;
				}

				/*** unwire wirings from any previous connection ***/
					if (_wirings)
						_wirings = _this._wirings = _wireOrUnwireWirings ('unwire')
					;

				if (_this._connected) {
					var
						_propertyA = _this._propertyA,
						_propertyB = _this._propertyB,
						_valueAdapter = _this._valueAdapter,
						_driver,
						_synchronize = function (_aToB) {
							var
								_source = _aToB ? _propertyA : _propertyB,
								_target = _aToB ? _propertyB : _propertyA
							;
							if (_driver != _target) {
								var _sourcePropertyValue = _source.instance.get (_source.property);
								_driver = _source;
								_target.instance.set (
									_target.property,
									_valueAdapter
										? _valueAdapter [_aToB ? 'aToB' : 'bToA'] (_sourcePropertyValue)
										: _sourcePropertyValue
								);
								_driver = null;
							}
						}
					;
					if (_propertyA && _propertyB) {
						/*** synchronize A to B ***/
							_synchronize (true);

						/*** wire events for connecting properties ***/
							_wirings = _this._wirings = [
								{
									_instance:_propertyA.instance,
									_eventName:'Changed.' + _propertyA.property,
									_handler:function () {_synchronize (true)}
								},
								{
									_instance:_propertyB.instance,
									_eventName:'Changed.' + _propertyB.property,
									_handler:function () {_synchronize ()}
								}
							];
							_wireOrUnwireWirings ('wire');
					}
				}
			}
			function _conformPropertySpecifier (_value) {
				if (_value) {
					var _valueIsArray = Uize.isArray (_value);
					if (_valueIsArray || Uize.isInstance (_value))
						_value = _valueIsArray ? {instance:_value [0],property:_value [1]} : {instance:_value}
					;
					_value.property || (_value.property = 'value');
				}
				return _value;
			}
			_class.stateProperties ({
				_connected:{
					name:'connected',
					onChange:_updateConnection,
					value:true
					/*?
						State Properties
							connected
								A boolean, indicating whether or not the connection is active and the properties specified by the =propertyA= and =propertyB= state properties are connected together.

								If this property is set to =false= after properties have already been connected, then they will be disconnected. They can be reconnected again later by setting the value of this property back to =true=. Whenever the value of this property changes from =false= to =true= and properties are specified for both `property A` and `property B`, then `initial connection` will be established.

								NOTES
								- the initial value is =true=
					*/
				},
				_propertyA:{
					name:'propertyA',
					conformer:_conformPropertySpecifier,
					onChange:_updateConnection
					/*?
						State Properties
							propertyA
								A `property specifier`, specifying the instance and the property for `property A`.

								If the value of this property is changed after properties have already been connected, then the previously connected properties will be disconnected and `initial connection` will be established for the new pair of properties.

								NOTES
								- see the companion =propertyB= state property
								- the initial value is =undefined=
					*/
				},
				_propertyB:{
					name:'propertyB',
					conformer:_conformPropertySpecifier,
					onChange:_updateConnection
					/*?
						State Properties
							propertyB
								A `property specifier`, specifying the instance and the property for `property B`.

								If the value of this property is changed after properties have already been connected, then the previously connected properties will be disconnected and `initial connection` will be established for the new pair of properties.

								NOTES
								- see the companion =propertyA= state property
								- the initial value is =undefined=
					*/
				},
				_valueAdapter:{
					name:'valueAdapter',
					onChange:_updateConnection
					/*?
						State Properties
							valueAdapter
								An object, specifying a `value adapter` that should be used to translate the value of `property A` to a value for `property B`, or vice versa.

								If the value of this property is changed after properties have already been connected, then `initial connection` will be re-established for the previously connected properties, using the newly specified `value adapter` to synchronize `property B` to `property A`.

								NOTES
								- see the related =propertyA= and =propertyB= state properties
								- the initial value is =undefined=
					*/
				}
			});

		return _class;
	}
});

