/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Log.InstanceEvents.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.Log.InstanceEvents.Widget= class implements a log interface for logging the instance events of an instance of a =Uize.Class= subclass.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Log.InstanceEvents.Widget= class...

			..........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Log.InstanceEvents.VisualSampler
			..........................................................

		In a Nutshell
			Logging an Instance's Events
				To log instance events for an instance of the =Uize.Widgets.Log.InstanceEvents.Widget= class, set the log instance's =instance= state property to be a reference to the instance whose events you want to log.

				That may sound like a mouthful, but it's a lot simpler than it may sound. Consider the following example...

				EXAMPLE
				...........................................................................................
				var slider = page.addChild ('slider',Uize.Widget.Bar.Slider);
				page.addChild ('sliderEventsLog',Uize.Widgets.Log.InstanceEvents.Widget,{instance:slider});
				...........................................................................................

				In the above example, a slider widget is being added as a child widget of the page widget (which is assumed to already exist). Then, an instance of the =Uize.Widgets.Log.InstanceEvents.Widget= class is also being added as a child widget of the page widget. To have the instance events from the slider widget logged to the instance events logger widget, its =instance= property is set to be a reference to the slider widget. It's really that simple. The above code snippet, of course, assumes that the page widget instance was created earlier, and that the HTML page in which this code runs has all the necessary HTML markup for the UI's of the slider and log widgets.

			All Instance Events Logged
				All instance events for an instance being watched are logged.

				This includes all custom instance events that are fired using the instance's =fire= method, as well as all =Changed.&#42;= property change events that result from values of the instance's various state properties being changed. This means that you can use a =Uize.Widgets.Log.InstanceEvents.Widget= instance to watch for changes in the state of some other instance.

				Custom Instance Events
					When a custom instance events is logged, the log message is prefixed with the value of the =customInstanceEvent= localizable string, and the name of the custom event is appended.

				Property Change Events
					When a =Changed.&#42;= property change event is logged, the log message is prefixed with the value of the =propertiesChangedEvent= localizable string, and the new values for all properties that have changed are appended to the message as a JSON formatted string.

			Watch Any Instance
				The instance for which instance events are logged can be an instance of any =Uize.Class= subclass - not just widget classes.

				Any =Uize.Class= subclass instance can have state properties and can have custom instance events, so logging instance events is applicable beyond just observing widget instance's (although widget instances can be quite compelling to watch).

			Dynamic Switching
				The =Uize.Widgets.Log.InstanceEvents.Widget= class supports dynamic switching of the instance for which events are being logged.

				The value of a log widget's =instance= state property can be changed at any time. If the value of the =instance= property is changed after the log widget's UI has already been wired up, then any logged instance events from a previous instance that was being watched will be cleared from the log.

			Nothing to Watch
				When a log widget's =instance= state property is set to the value =null= or =undefined=, then no instance will be watched.

				If the =instance= property is set to =null= or =undefined= after the log was already wired up and watching instance events for some instance, then the log will be cleared and no more messages will be displayed until the =instance= property is once again set to an instance of a =Uize.Class= subclass.
*/

Uize.module ({
	name:'Uize.Widgets.Log.InstanceEvents.Widget',
	superclass:'Uize.Widgets.Log.Widget',
	required:[
		'Uize.Json',
		'Uize.Str.Has'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined
		;

		return _superclass.subclass ({
			stateProperties:{
				_instance:{
					name:'instance',
					conformer:function (_value) {
						return (
							_value != _undefined &&
							typeof _value == 'object' &&
							Uize.isFunction (_value.wire) &&
							Uize.isFunction (_value.unwire)
								? _value
								: undefined
						);
					},
					onChange:function () {
						var
							m = this,
							_lastWiring = m._lastWiring,
							_instance = m._instance
						;

						/*** unwire event handlers of previously watched instance ***/
							_lastWiring && _lastWiring._instance.unwire (_lastWiring._eventsToHandlersMap);

						/*** clear log ***/
							m.clear ();
							m.log (m.localize (_instance ? 'startedWatching' : 'nothingToWatch'));

						/*** wire up handlers to watch all events of instance ***/
							m._lastWiring = _instance
								? {
									_instance:_instance,
									_eventsToHandlersMap:{
										'*':
											function (_event) {
												if (!Uize.Str.Has.hasPrefix (_event.name,'Changed.')) {
													m.log (
														m.localize ('customInstanceEvent') + ': ' + Uize.Json.to (_event,'mini')
													);
												}
											},
										'Changed.*':
											function (_event) {
												m.log (
													m.localize ('propertiesChangedEvent') + ': ' +
													Uize.Json.to (_event.properties,'mini')
												);
											}
									}
								}
								: _undefined
							;
							_instance && _instance.wire (m._lastWiring._eventsToHandlersMap);
					}
					/*?
						State Properties
							instance
								An object reference, specifying the instance of a =Uize.Class= subclass for which instance events should be logged.

								The value of the =instance= state property can be a reference to an instance of *any* =Uize.Class= subclass - not just widget classes (see `Watch Any Instance`). The value of the =instance= state property can be changed at any time - even after the log widget has already been wired up (see `Dynamic Switching`). When the =instance= property is set to the value =null= or =undefined=, then no instance will be watched (see `Nothing to Watch`).
					*/
				}
			},

			set:{
				localized:{
					customInstanceEvent:'INSTANCE EVENT',
					nothingToWatch:'No valid object to watch',
					propertiesChangedEvent:'PROPERTIES CHANGED',
					startedWatching:'Started watching events'
					/*?
						Localizable Strings
							customInstanceEvent
								A localizable string, that will be prepended to log messages for all `custom instance events`.

							nothingToWatch
								A localizable string, that will be logged as a log message whenever there is no valid object to watch events on (see `Nothing to Watch`).

								In order for the instance to have a valid object to watch events on, the value of the =instance= state property must be either a reference to an instance of a =Uize.Class= subclass, or a referece to a =Uize.Class= subclass.

							propertiesChangedEvent
								A localizable string, that will be prepended to log messages for all `property change events`.

							startedWatching
								A localizable string, that will be logged as a log message whenever the instance starts watching events on a new object.
					*/
				}
			}
		});
	}
});

