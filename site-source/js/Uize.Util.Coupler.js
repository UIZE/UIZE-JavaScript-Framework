/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Coupler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.Coupler= class implements a mechanism for coupling two or more instances of any =Uize.Class= subclass by synchronizing values of state properties.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Util.Coupler= class makes it easy to keep desired state synchronized between two or more instances.

			Coupled instances can be widget instances (ie. instances of =Uize.Widget= subclasses), but they do not have to be widgets. Coupled instances do not have to be of the same class - they only need to provide the same state properties that are to be synchronized between them.

		An Example
			Using the =Uize.Util.Coupler= class is easy: all you have to do is create an instance of it, specifying which properties of which instances you would like to be coupled together. Consider the following example...

			EXAMPLE
			......................................................................................
			// create subclass of Uize.Widget.CollectionItem.Zooming, for common property values

				var CollectionItemZoomingSubclass = Uize.Widget.CollectionItem.Zooming.subclass ();
				CollectionItemZoomingSubclass.set ({
					previewZoomUrl:function () {
						return this.get ('previewUrl').replace ('100x75','400x300');
					},
					zoomPower:4
				});


			// create some zooming collection item widgets

				var
					item0 = page.addChild ('item0',CollectionItemZoomingSubclass),
					item1 = page.addChild ('item1',CollectionItemZoomingSubclass),
					item2 = page.addChild ('item2',CollectionItemZoomingSubclass)
				;


			// couple the alignX, alignY, inUse properties between the collection items

				var coupler = Uize.Util.Coupler ({
					instances:[item0,item1,item2],
					properties:['alignX','alignY','inUse']
				});
			......................................................................................

			In the above example, a custom subclass of the =Uize.Widget.CollectionItem.Zooming= widget class is being created. This is done purely as a convenience, in order to capture some common state property values, and so that all instances of this subclass that are created will have those same initial values. Then, three instances of this custom subclass are added as child widgets to the page widget (which we assume in this example to already be defined).

			Finally, an instance of the =Uize.Util.Coupler= class is created in order to couple the three instances together by keeping the values of their =alignX=, =alignY=, and =inUse= state properties synchronized across the three of them. This has the effect of making the instance that the user is currently interacting with drive the other two instances - any instance can drive the other two. When the user rests the mouse over one of the instances, the zoom in effect will be activated for all three. And when the user moves the mouse over one in order to pan horizontally and vertically around the zoomed image, the two other instances will follow the lead of the one the user is mousing over.
*/

Uize.module ({
	name:'Uize.Util.Coupler',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		/*** General Variables ***/
			var _syncFunctions = {};

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** State Properties ***/
			function _updateCoupling () {
				var
					_this = this,
					_wirings = _this._wirings
				;

				/*** unwire wirings from any previous coupling ***/
					if (_wirings) {
						for (var _wiringNo = -1, _wiringsLength = _wirings.length, _wiring; ++_wiringNo < _wiringsLength;)
							(_wiring = _wirings [_wiringNo])._instance.unwire (_wiring._eventName,_wiring._handler)
						;
						_wirings = _this._wirings = null;
					}

				if (_this._coupled) {
					var
						_instances = _this._instances,
						_properties = _this._properties
					;
					if (_instances && _properties) {
						/*** synchronize all other instances to first instance ***/
							Uize.callOn (_instances,'set',[_instances [0].get (_properties)]);

						var
							_propertiesLength = _properties.length,
							_propertiesSignature = _properties.concat ().sort () + '',
							_syncFunction = _syncFunctions [_propertiesSignature]
						;
						/*** build sync function (if it's not already built), or use previously built one ***/
							if (!_syncFunction) {
								var _functionChunks = ['if (target.UIZE_UTIL_COUPLER_driver) return;'];
								if (_propertiesLength > 1) {
									_functionChunks.push ('var properties, changedMap = eventObj.properties;');
									for (var _propertyNo = -1; ++_propertyNo < _propertiesLength;) {
										var _propertyNameQuoted = '\'' + _properties [_propertyNo] + '\'';
										_functionChunks.push (
											'if (' + _propertyNameQuoted + ' in changedMap) (properties || (properties = {})) [' + _propertyNameQuoted + '] = changedMap [' + _propertyNameQuoted + '];'
										);
									}
									_functionChunks.push ('if (!properties) return;');
								} else {
									var _propertyNameQuoted = '\'' + _properties [0] + '\'';
									_functionChunks.push (
										'var properties = {' + _propertyNameQuoted + ':eventObj.source.get (' + _propertyNameQuoted + ')};'
									);
								}
								_functionChunks.push (
									'var source = eventObj.source;',
									'source.UIZE_UTIL_COUPLER_driver = 1;',
									'target.set (properties);',
									'delete source.UIZE_UTIL_COUPLER_driver;'
								);
								_syncFunction = _syncFunctions [_propertiesSignature] =
									Function ('eventObj,target',_functionChunks.join (''))
								;
							}

						/*** wire events for coupling instances together ***/
							_wirings = _this._wirings = [];
							var
								_eventName = 'Changed.' + (_propertiesLength > 1 ? '*' : _properties [0]),
								_wireCouplingHandler = function (_controllingInstance,_controlledInstance) {
									var _handler = function (_event) {_syncFunction (_event,_controlledInstance)};
									_wirings.push ({_instance:_controllingInstance,_eventName:_eventName,_handler:_handler});
									_controllingInstance.wire (_eventName,_handler);
								}
							;
							for (
								var _instanceNo = -1, _instancesLength = _instances.length;
								++_instanceNo < _instances.length;
							)
								_wireCouplingHandler (
									_instances [_instanceNo],
									_instances [(_instanceNo + 1) % _instancesLength]
								)
							;
					}
				}
			}
			_class.stateProperties ({
				_coupled:{
					name:'coupled',
					onChange:_updateCoupling,
					value:true
					/*?
						State Properties
							coupled
								A boolean, indicating whether or not the coupling is active and the instances specified by the =instances= state property are coupled together.

								If this property is set to =false= after instances have already been coupled, then they will be uncoupled. They can be recoupled again later by setting the value of this property back to =true=.

								NOTES
								- the initial value is =true=
					*/
				},
				_instances:{
					name:'instances',
					onChange:_updateCoupling
					/*?
						State Properties
							instances
								An array, specifying the instances that should be coupled together and whose properties, as specified by the =properties= state property, should be kept synchronized.

								If the value of this property is changed after instances have already been coupled, then the previously coupled instances will be uncoupled and the newly specified instances will be coupled.

								NOTES
								- see the companion =properties= state property
								- the initial value is =undefined=
					*/
				},
				_properties:{
					name:'properties',
					onChange:_updateCoupling
					/*?
						State Properties
							properties
								An array, specifying the properties that should be kept synchronized across all instances, as specified in the =instances= state property.

								If the value of this property is changed after instances have already been coupled, then the previously coupled instances will be uncoupled and the current =instances= will be recoupled using the newly specified properties.

								NOTES
								- see the companion =instances= state property
								- the initial value is =undefined=
					*/
				}
			});

		return _class;
	}
});

