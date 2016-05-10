/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.VirtualEvent Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Dom.VirtualEvent= package provides features to facilitate creation of virtual DOM events.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Dom.VirtualEvent= module is a package under the =Uize.Dom= namespace.

		Whet Your Appetite
			If you are not yet familiar with virtual DOM events, take a look at the [[../examples/virtual-dom-events.html][Virtual DOM Events]] example to get a sense of the range of virtual DOM events that are possible and what interactions trigger them.

			Once you are done checking out the example, return to this reference to get the full scoop on all the virtual DOM events defined by this module, and the facilities in this module that allow you to implement your own unique virtual events.

		What is a Virtual DOM Event?
			Put quite simply, a `virtual DOM event` is an event for a DOM node that is not part of the standard set of DOM events, but that is implemented in supplemental JavaScript code.

			While the DOM standard *does* provide a decent array of different events for different types of DOM nodes, there are still certain "events" that can occur during the user's interaction with a DOM node for which standard DOM events do not exist. A rather compelling and highly practical example is the `remain-in-state virtual DOM events`, which allow handlers to be executed when a node remains in a specific event state for a specified amount of time (e.g. the user rests the mouse over a node for more than half a second).

			For a more technical discussion on what makes up virtual DOM events, see the section `virtual DOM event`.

		Benefits of Virtual DOM Events
			Virtual DOM events offer the following key benefits...

			Encapsulation
				Virtual DOM events allow sophisticated interactions with a node to be encapsulated into an implementation, so that the interaction can then be expressed as a single event.

				Once a pattern of interaction is encapsulated into an implementation, you can then simply think of that interaction as an event. The section `What is a Virtual DOM Event?` discusses the classic example of the =mouseRest= virtual DOM event, which encapsulates wiring of handlers for the =mouseover=, =mousemove=, =mouseout= and =mousedown= real DOM events of a node, and also manages state for a timeout.

			Automatic Cleanup Upon Unwiring
				For some of the more sophisticated virtual DOM events, wiring a handler for a single virtual DOM event may result in wiring handlers for multiple real DOM events.

				That's because some virtual DOM events need to track more than one real DOM event as part of their implementation. Fortunately, the way that DOM event wiring is implemented in the UIZE JavaScript Framework, unwiring a handler for a virtual DOM event automatically results in the unwiring of all the real DOM event handlers it wired.

			Semantically Equivalent to Real DOM Events
				Virtual DOM events are semantically equivalent to real DOM events.

				This means that you can use them and think about them in your application code as if they *were* real DOM events. This means you can wire handlers for *virtual* DOM events along with *real* DOM events. Similarly, you can unwire them along with real DOM events.

			Customizable Using Parameters
				While a `virtual DOM event` itself does not take parameters, a `virtual DOM event maker` can accept parameters and produce different instances of the same "flavor" of virtual DOM event with slightly different behavior depending on the values supplied for the parameters that the `virtual DOM event maker` supports.

				This may sound a little abstract, but what it essentially means is that you can tune the behavior of a certain type of virtual DOM event through its parameters. Take the example of the =mouseRest= virtual DOM event, which lets you specify how long the mouse should be rested on the node before the event is fired. This parameter makes this type of virtual DOM event more versatile than if it only supported one rest duration (for a code example that illustrates this point well, see the section `Unique Parameters Translate To Unique Events`).

		Using Virtual DOM Events
			Because virtual DOM events are `semantically equivalent to real DOM events`, using virtual DOM events is really easy - handlers for virtual DOM events can be wired and unwired using the *same* methods you would use to wire handlers for real DOM events!

			This means that you can use the =Uize.Dom.Basics.wire= static method of the =Uize.Dom.Basics= module, as well as the =wireNode= instance method of the =Uize.Widget= class, to wire handlers for both real *and* virtual DOM events. Similarly, you can use the =Uize.Dom.Basics.unwire= and =Uize.Dom.Basics.unwireEventsByOwnerId= static methods of the =Uize.Dom.Basics= module, as well as the =unwireNode= and =unwireNodeEventsByMatch= instance methods of the =Uize.Widget= class, to unwire handlers for both real *and* virtual DOM events.

			Specifying Virtual DOM Events By Object Reference
				The preferred way to specify a virtual DOM event when wiring and unwiring handlers for it is to use a  reference to the virtual DOM event object.

				EXAMPLE
				.....................................................................................
				Uize.Dom.Basics.wire (
					'myNode',                                 // ID of node being wired
					Uize.Dom.VirtualEvent.mouseRest (2000),  // reference to virtual DOM event object
					function () {alert ('mouse rested!')}     // the handler for the mouseRest event
				);
				.....................................................................................

				In the above example, a handler is being wired for the virtual DOM event =Uize.Dom.VirtualEvent.mouseRest (2000)=. This call to the =Uize.Dom.VirtualEvent.mouseRest= static method, with the value =2000= specified for the method's =durationMsINT= parameter, returns a virtual DOM event object for an event that will be fired when the user rests the mouse over a node for two seconds.

				Specifying a virtual DOM event by object reference is preferred because it is clear from looking at the code what dependencies there are on modules that define virtual DOM events. Looking at the above example, it is clear that this code depends upon the =Uize.Dom.VirtualEvent= module, which is where the =Uize.Dom.VirtualEvent.mouseRest= `virtual DOM event maker` is defined. When `specifying virtual DOM events by registered name`, it is not obvious what module dependencies exist for virtual DOM events being used.

				Capturing a DOM Event Object Reference
					When using a `virtual DOM event maker`, it is perfectly acceptable to capture a reference to a returned `virtual DOM event`, and then to supply that virtual DOM event object by reference when wiring and unwiring handlers for one or more nodes.

					EXAMPLE
					.....................,,,,,,....................................................................
					var mouseRest2000 = Uize.Dom.VirtualEvent.mouseRest (2000);

					Uize.Dom.Basics.wire ('myNode1',mouseRest2000,function () {alert ('mouse rested on myNode1')});
					Uize.Dom.Basics.wire ('myNode2',mouseRest2000,function () {alert ('mouse rested on myNode2')});
					...............................................................................................

					In the above example, a virtual DOM event object is being created by calling the =Uize.Dom.VirtualEvent.mouseRest= static method, and the returned virtual DOM event object is being assigned to the variable =mouseRest2000=. Then, this variable is used in two statements to wire handlers for this event for two different nodes. This approach can be a useful way of optimizing both file size and performance for code that uses the same virtual DOM event many times over.

			Specifying Virtual DOM Events By Registered Name
				When a `virtual DOM event maker` is registered, as most are (see `Register Your Virtual DOM Event`), then instances of the virtual DOM event can be specified in a string, along with parameters that the `virtual DOM event maker` may support.

				EXAMPLE
				..................................................................................
				Uize.Dom.Basics.wire (
					'myNode',                              // ID of node being wired
					'mouseRest(2000)',                     // virtual DOM event name and parameters
					function () {alert ('mouse rested!')}  // the handler for the mouseRest event
				);
				..................................................................................

				In the above example, a handler is being wired for the =mouseRest= virtual DOM event, with a rest duration of =2000= milliseconds (2 seconds) specified. Because of the specific way that this `virtual DOM event maker` is registered, the event name ='mouseRest(2000)'= actually maps through to the method call =Uize.Dom.VirtualEvent.mouseRest (2000)=.

				Advantages
					Specifying virtual DOM events by registered name has the following advantages...

					- *More Versatile* - It's the only way to specify virtual DOM events when using the variation of the wiring and unwiring methods that take an =eventNamesToHandlersMapOBJ= parameter that specifies multiple wirings of events to handlers (for an example, see the section `Unique Parameters Translate To Unique Events`).

					- *More Concise* - It's more elegant and concise than providing a call to the event maker (i.e. =Uize.Dom.VirtualEvent.mouseRest (2000)=).

				Disadvantages
					Specifying virtual DOM events by registered name has the following disadvantages...

					- *Module Dependencies Not Obvious* - It's not obvious from looking at code that specifies virtual DOM events by registered name where the virtual DOM events are implemented and, therefore, what modules may be required by the code (in the =mouseRest= case, it wouldn't be clear that the =Uize.Dom.VirtualEvent= module is a dependency of the code).

					- *Slight Performance Impact* - When specifying virtual DOM events by registered name, the event wiring and unwiring code will have to parse event parameters from the event name string before calling the relevant registered `virtual DOM event maker` (=Uize.Dom.VirtualEvent.mouseRest= in the =mouseRest= case). This is not normally a consideration, unless you're wiring up handlers for an *incredibly* large number of virtual DOM events.

				Important Considerations
					When specifying virtual DOM events by registered name, you should keep in mind the following important considerations...

					- *Must End in a Close Parenthesis* - Virtual DOM events are distinguished from standard DOM events by the presence of a ")" (close parenthesis) character at the end of the event name - even for virtual DOM events that don't support any parameters. This is mostly a performance optimization that avoids costlier pattern matching approaches, but it also makes it clear when looking at code which events being wired (or unwired) are virtual DOM events, and which are standard DOM events.

					- *Event Plus Parameters* - When specifying virtual DOM events by registered name, you're always specifying a registered name for a `virtual DOM event maker` along with parameters for the creation of a specific `virtual DOM event` object. For virtual DOM event types that don't support parameters, the parentheses at the end of the event name will simply be left empty (but must still be present).

					- *Case and Space Insensitive* - When specifying a virtual DOM event by registered name, it is recommended that you omit spaces and maintain the same case as the registered name for the event. That said, the mechanism for resolving a virtual DOM event name to a `virtual DOM event maker` will forgive spaces and case differences (e.g. ='mouseRest(500)'=, ='mouse rest (500)'=, ='Mouse Rest (500)'=, ='MOUSEREST(500)'=, etc. are all considered equivalent). The presence of spaces or a case mismatch between how the virtual DOM event name is specified when wiring or unwiring handlers and how it was specified when it was registered will incur an additional one time cost to resolve the specified name to a virtual DOM event maker.

					- *Must Be Registered* - In order to be able to specify virtual DOM events by registered name, they must actually be registered (see `Register Your Virtual DOM Event`). All the virtual DOM events implemented in the =Uize.Dom.VirtualEvent= module are registered, so this is more of a consideration when `implementing virtual DOM events`.

			Unique Parameters Translate To Unique Events
				Different combinations of parameter values supplied to a `virtual DOM event maker` will produce unique `virtual DOM event` objects.

				As such, different handlers can be wired for virtual DOM events that only differ in their parameter values - for the same DOM node. Consider the following example...

				EXAMPLE
				.............................................................................................
				Uize.Dom.Basics.wire (
					'myNode',
					{
						'mouseRest(500)':function () {console.log ('mouse rested on myNode for .5 seconds')},
						'mouseRest(1000)':function () {console.log ('mouse rested on myNode for 1 second')},
						'mouseRest(1500)':function () {console.log ('mouse rested on myNode for 1.5 seconds')},
						'mouseRest(2000)':function () {console.log ('mouse rested on myNode for 2 seconds')}
					}
				);
				.............................................................................................

				In the above example, four event handlers are being wired. Each of the four virtual DOM events being wired up are created from the same =Uize.Dom.VirtualEvent.mouseRest= static method, but each is considered a different event. This allows different handlers to be registered for each.

				After the above code has executed, resting the mouse on the DOM node with the =id= of "myNode" for longer than two seconds will result in all four =mouseRest= events being fired, and all four handlers will be executed in order and at 500 millisecond intervals. The handler for the =mouseRest(500)= event will be executed after resting the mouse for 500 milliseconds, the handler for the =mouseRest(1000)= event will be executed after resting the mouse for 1000 milliseconds, the handler for the =mouseRest(1500)= event will be executed after resting the mouse for 1500 milliseconds, and the handler for the =mouseRest(2000)= event will be executed after resting the mouse for 2000 milliseconds.

				If you were to rest the mouse on the node for 1500 milliseconds, then only the handlers for the =mouseRest(500)=, =mouseRest(1000)=, and =mouseRest(1500)= events would be executed. If you were to rest the mouse on the node for 1000 milliseconds, then only the handlers for the =mouseRest(500)= and =mouseRest(1000)= events would be executed. If you were to rest the mouse on the node for 500 milliseconds, then only the handler for the =mouseRest(500)= event would be executed. And if you were to rest the mouse on the node for less than 500 milliseconds, then none of the handlers would be executed.

		Where Are Virtual DOM Events Implemented?
			Virtual DOM events can be implemented just about anywhere, but many are implemented in the =Uize.Dom.VirtualEvent= module.

			If you want to make use of the virtual DOM events implemented in the =Uize.Dom.VirtualEvent= module in your own code modules, then you will need to require this module in your modules. Beyond the base set of virtual DOM events that are supported by this module, more virtual DOM events can be implemented in their own separate modules. For very specialized virtual DOM events, you can even implement them exclusively in your application or module code, especially if you don't think such virtual DOM events are likely to be useful outside of a very specific use case.

		Why An Extension?
			The virtual DOM events mechanism is a useful, but reasonably esoteric feature that is not likely to be needed in most modules or applications.

			Therefore, the virtual DOM events functionality is offered in the form of this optional =Uize.Dom.VirtualEvent= module that can be loaded in when this feature is needed.

		What This Module Provides
			The =Uize.Dom.VirtualEvent= module provides a foundation and features (including static methods) to facilitate the creation of virtual DOM events.

	In More Detail
		Virtual DOM Event
			A virtual DOM event is represented by an object that must conform to the following simple syntax / interface...

			SYNTAX
			................................
			{
				virtualDomEvent:eventNameSTR,
				wire:wirerFUNC
			}
			................................

			A virtual DOM event object may contain more properties than those shown above, but must always have at least the =virtualDomEvent Property= and the =wire Property=.

			virtualDomEvent Property
				A string, identifying the combination of the event and its parameters, and that should always be the same for the same combination of parameter values.

				SYNTAX
				..............................
				[eventName]([eventParameters])
				..............................

				The value of the =virtualDomEvent Property= should consist of the name of the virtual DOM event, followed by parentheses that contain a serialization of the parameter values for the virtual DOM event. For virtual DOM events that don't support any parameters, the parentheses should still be present but should be empty.

				EXAMPLE 1
				...............
				mouseRest(1000)
				...............

				The =mouseRest= virtual DOM event can accept a single =durationMsINT= parameter. For a 1000 millisecond =mouseRest= event, the value of the =virtualDomEvent Property= in the event object would be ='mouseRest(1000)'=, representing the registered name of the event's `virtual DOM event maker`, combined with the serialization of the parameter values inside parentheses.

				EXAMPLE 2
				...........
				ctrlClick()
				...........

				The =ctrlClick= virtual DOM event does *not* take any parameters, and so the value of the =virtualDomEvent Property= is simply the registered name of the event's `virtual DOM event maker` followed by empty parentheses.

			wire Property
				A function, that will be called at the time that the `virtual DOM event` is wired up for a specific node, and that is responsible for performing the more complex wiring logic in order to implement the virtual DOM event for the node.

				A function reference that you specify for this property should expect to receive three parameters and have the following basic structure...

				SYNTAX
				..........................................................................
				function (nodeOBJ,handlerFUNC,subWiringsOwnerIdSTR) {
					// wire up the logic and DOM events to implement this virtual DOM event
				}
				..........................................................................

				nodeOBJ
					An object, being a reference to the DOM node for which the virtual DOM event is being wired.

					The implementation of your function can wire up handlers for one or more real DOM events of this node in order to support the implementation of the virtual DOM event, provided that the wirings are associated with the owner specified in the =subWiringsOwnerIdSTR= parameter (see below).

				handlerFUNC
					A function, being the handler that is being wired for the virtual DOM event.

					Because the function specified by the =wire Property= will implement the wiring of the virtual DOM event, and because firing of the virtual DOM event will be governed by logic that exists inside this function, it will be the responsibility of this function to execute the actual handler for the virtual DOM event, when it is deemed appropriated to fire the event. When the =wire Property= function executes the handler function specified by the =handlerFUNC= parameter, it should do so by calling the handler function as an instance method on the DOM node specified by the =nodeOBJ= parameter, and it should pass a reference to a DOM event object as the single parameter. For an example of how this should be done, see the section `A Basic Virtual DOM Event`.

				subWiringsOwnerIdSTR
					A string, specifying an owner ID that should be used for subwirings that are needed in order to support the implementation of the virtual DOM event.

					Basically, any event handler that is wired up in the implementation of the function specified in the =wire Property= should be wired with the value of the =subWiringsOwnerIdSTR= parameter being specified as the owner ID in the =wiringOwnerId= parameter of the =Uize.Dom.Basics.wire= static method. This owner ID is stored along with the wiring of the virtual DOM event for a specific node, and all such wirings will be automatically unwired when the virtual DOM event is unwired. If the =subWiringsOwnerIdSTR= value is not specified as the owner ID when wiring subwirings for a virtual DOM event, then the virtual DOM event will not be cleanly unwired.

			A Basic Virtual DOM Event
				To gain a better understanding of the virtual DOM event object's interface, let's take a look at a basic example...

				EXAMPLE
				..............................................................................................
				var myCtrlClick = {
					virtualDomEvent:'myCtrlClick()',
					wire:function (_node,_handler,_subWiringsOwnerId) {
						Uize.Dom.Basics.wire (
							_node,
							'click',
							function (_event) {
								if (_event.ctrlKey && !_event.shiftKey && !_event.altKey && !_event.metaKey)
									_handler.call (_node,_event)
								;
							}
						);
					}
				};

				Uize.Dom.Basics.wire ('myNode1',myCtrlClick,function () {alert ('myNode1 was ctrl-clicked')});
				Uize.Dom.Basics.wire ('myNode2',myCtrlClick,function () {alert ('myNode2 was ctrl-clicked')});
				..............................................................................................

				In the above example, a virtual DOM event object is being defined and then assigned to the local variable =myCtrlClick=. Any handler wired for this event will be executed when the user clicks on the node for which the event is wired, while holding down the ctrl modifier key and no other modifier keys. This somewhat basic virtual DOM event is not parameterized like the =mouseRest= event that was mentioned earlier. To learn how to implement parameterized virtual DOM events, consult the more advanced section `Implementing Virtual DOM Events`.

				Looking at the function specified for the =wire Property=, you'll notice that it wires up a handler for the real "click" DOM event for the node, and this handler tests to see if only the ctrl modifier key is pressed by checking the values of the =ctrlKey=, =shiftKey=, =altKey=, and =metaKey= properties of the DOM event object. If only the ctrl modifier key is pressed, then the handler supplied when calling the =wire Property= function will be called as an instance method on the node for which the virtual DOM event is wired. This is done by calling the =call= method on the handler function, and supplying a reference to the DOM node as the first parameter (the =this= context) and a reference to the "click" DOM event as the second parameter (the single parameter that the handler function will receive).

				Once the virtual DOM event object has been defined, it can then be used to wire DOM nodes. In this example, the =myCtrlClick= virtual DOM event is being wired for the two nodes with the =id= values of "myNode1" and "myNode2". This is done simply by specifying =myCtrlClick= as the event when calling the =Uize.Dom.Basics.wire= static method. Here you can clearly see a major benefit of virtual DOM events: once a particular interaction is expressed and encapsulated in the form of a virtual DOM event, that event can then be applied against any number of DOM nodes. A virtual DOM event is an elegant vehicle for code reuse when it comes to DOM event driven user interaction patterns.

		Virtual DOM Event Maker
			A virtual DOM event maker is, quite simply, a function or method that returns a `virtual DOM event` object.

			Parameterized Virtual DOM Event Makers
				To allow virtual DOM events to be `customizable using parameters`, a virtual DOM event maker can accept parameters.

				For virtual DOM event makers that *do* accept parameters, different combinations of parameter values should result in different `virtual DOM event` objects being returned, but the same object should always be returned for the same combination of parameter values. This is partly for performance reasons, to reduce the number of virtual DOM event objects created when using virtual DOM events extensively, but a more important reason is to allow handlers wired for a particular virtual DOM event to be matched during unwiring. Consider the following example...

				EXAMPLE
				.........................................................................
				Uize.Dom.Basics.wire (
					'myNode',
					Uize.Dom.VirtualEvent.mouseRest (1000),
					function () {alert ('Mouse rested on myNode for one second!')}
				);

				Uize.Dom.Basics.unwire ('myNode',Uize.Dom.VirtualEvent.mouseRest (1000));
				.........................................................................

				In the above example, a handler is wired for a 1000 millisecond =mouseRest= event on the DOM node with the =id= of "myNode". The =mouseRest= virtual DOM event is specified in this case by object reference (see `Specifying Virtual DOM Events By Object Reference`). Now, when unwiring handlers for the 1000 millisecond =mouseRest= event on the DOM node, the =Uize.Dom.VirtualEvent.mouseRest= method is called again, with the same =1000= value for the method's =durationMsINT= parameter. Because the =Uize.Dom.VirtualEvent.mouseRest= method always returns a reference to the same object when the same parameter values are specified, the `virtual DOM event` object specified when unwiring is the same object as was specified when wiring the node, and the =Uize.Dom.Basics.unwire= method can successfully find the matching event wiring and unwire it.

				To make it easy for virtual DOM event makers to return the same virtual DOM event object for the same parameter values, the =Uize.Dom.VirtualEvent.getCached= static method can be used in the implementation of a virtual DOM event maker (see `Implementing Virtual DOM Events` for further detail).

		Performance Considerations
			When using virtual DOM events extensively, one should keep in mind that wiring a handler for each virtual DOM event will result in wiring a handler for at least one real DOM event.

			Virtual DOM events offer a convenient way of expressing certain kinds of event logic. An example would be wiring different handlers for the =click=, =ctrlClick=, =shiftClick=, and =altClick= virtual DOM events of a node, using the =Uize.Dom.VirtualEvents.ModClick= module. Using virtual DOM events, these different click-with-modifier virtual DOM events can be regarded as discrete events.

			A performance implication of using this approach is that multiple handlers will be wired for the real "click" DOM event for the node, with each one being executed when the node is clicked. So there are more handlers being wired to the "click" event, and there are more handler functions being executed each time the node is clicked. In most practical cases, this will not be any kind of issue, but it could become a performance consideration if very large numbers of DOM nodes are being wired up with many of these click-with-modifier virtual DOM events. In such cases, performance could be improved by using a traditional approach of wiring a single handler for the real "click" DOM event, that then uses conditional logic to test the values of =ctrlKey=, =shiftKey=, and =altKey= properties of the DOM event object in order to handle the different modifier key combinations differently.

	Implementing Virtual DOM Events
		If there's not already a virtual DOM event that's built for our exact needs, then the extensibility of the virtual DOM events system allows us to implement your own.

		Three Basic Steps
			Implementing your own virtual DOM events is not terribly complicated, and can be broken down into three main steps, as follows...

			+. `Find a Home For Your Virtual DOM Event`
			+. `Implement a Maker Method For Your Virtual DOM Event`
			+. `Register Your Virtual DOM Event`

		Find a Home For Your Virtual DOM Event
			You need a home for the implementation of your virtual DOM event.

			If you only plan to use the virtual DOM event in a very specific application or use case, then you could implement your virtual DOM event inside the very module that will be using it. However, if you see potential for reusing the virtual DOM event in other applications, then you'd be best served by implementing the virtual DOM event in a separate module that can be utilized outside of the code for which the virtual DOM event was originally intended.

			Which module you use will depend on your anticipated pattern of reuse. One approach would be to create a module specifically for your own virtual DOM events. If you are doing developement on the UIZE JavaScript Framework, itself, then a module under the =Uize.Dom.VirtualEvent= namespace would be a good candidate. Once you've figured out where to implement your virtual DOM event, you can proceed to the next step: `implement a maker method for your virtual DOM event`.

		Implement a Maker Method For Your Virtual DOM Event
			While it's not essential to have a maker method for a virtual DOM event, implementing a maker method allows the virtual DOM event to be registered so that it can be specified using a string in the forms of the node wiring and unwiring methods that take string event names.

			For the purposes of this discussion, it is assumed that you are already familiar with the definition of a `virtual DOM event`, and the definition of a `virtual DOM event maker`.

			Hypothetical Example
				For the purposes of illustrating various points about implementing virtual DOM events, let's consider a hypothetical example of a =myRemainFocused= virtual DOM event.

				A handler wired for this event should be executed when the node for which the event is wired becomes focused and remains focused for a specified amount of time. This virtual DOM event is, therefore, parameterized, since its maker method should accept a single duration parameter. And, because the implementation of the event requires a timer, each wiring of this event for a specific node will need to maintain its own state.

				Now, there *is* a =remainFocused= virtual DOM event implemented in the =Uize.Dom.VirtualEvent= module, but the implementation for this event is a little more complicated and abstract because the maker method for this event is actually "manufactured" using a more generalized implementation approach that is used to manufacture all of the `remain-in-state virtual DOM events` offered in this module. So, instead, we will focus solely on implementing a dedicated =myRemainFocused= event and not get too tricky just yet.

			The Basic Skeleton
				Before we get deep into looking at the implementation of the wiring logic for the =myRemainFocused= virtual DOM event, let's first take a look at the basic skeleton for defining this event's maker method.

				EXAMPLE
				...........................................................
				MyVirtualDomEvents.myRemainFocused = function (_duration) {
					return Uize.Dom.VirtualEvent.getCached (
						'myRemainFocused(' + _duration + ')',
						function (_node,_handler,_subWiringsOwnerId) {
							// ... ... ...
							// IMPLEMENTATION GOES HERE
							// ... ... ...
						}
					);
				};
				...........................................................

				The first thing you should notice from the above example is that the maker method is being assigned as the =MyVirtualDomEvents.myRemainFocused= static method of the hypothetical =MyVirtualDomEvents= namespace. The maker accepts a single parameter, being the duration that the wired node needs to remain focused before the handler for the event is executed.

				The maker method returns a `virtual DOM event` object, but it does so using the =Uize.Dom.VirtualEvent.getCached= static method. This method ensures that the same object is always returned for the same duration parameter value. The first parameter for the =Uize.Dom.VirtualEvent.getCached= method is the cache key, which is formed using the event name combined with the serialized parameter values inside parentheses.

				The second parameter for the =Uize.Dom.VirtualEvent.getCached= method is the wiring function, which corresponds to the =wire= property of the `virtual DOM event` object. While we won't get into implementation of the wiring logic just yet, you will notice that the wiring function accepts three parameters: a node that should be wired, the handler for the event, and an ID that should be used to associate subwirings to the master virtual DOM event wiring (more on all that later).

			State Management
				Virtual DOM events that are parameterized, or that manage complex interactions where event patterns need to be discerned, will need to maintain state.

				There are two key levels at which state is important for virtual DOM events, `state management at the instance level` and `state management at the wiring level`, which are covered in more detail below...

			State Management at the Instance Level
				Parameterized virtual DOM events, such as the many `remain-in-state virtual DOM events`, can have many instances per type.

				With our own `hypothetical example`, the =myRemainFocused= virtual DOM event can have many different instances - one for each unique value of the maker method's =durationMsINT= parameter. Within the scope of each different instance of this event type, the value for the =durationMsINT= parameter needs to maintain its integrity. This can be accomplished using a [[http://en.wikipedia.org/wiki/Closure_%28computer_science%29][closure]].

				If you refer back to the example shown in the section `The Basic Skeleton`, you'll notice that the wiring function (the one with the "IMPLEMENTATION GOES HERE" comment in it) is a closure inside the scope that has the =_duration= parameter. This means that for any instance of the =myRemainFocused= event for a specific duration, the wiring function can access the value of the =_duration= parameter and count on it remaining the same for that instance of the =myRemainFocused= event - no matter how many nodes are wired for the same instance.

				Defaulting Event Parameter Values
					Because `state management at the instance level` can be accomplished through the use of a closure, defaulting of event parameter values is best done in the wiring function's containing scope.

					To illustrate this point, consider the following example...

					EXAMPLE
					...........................................................
					MyVirtualDomEvents.myRemainFocused = function (_duration) {
						if (_duration == null) _duration = 500;
						return Uize.Dom.VirtualEvent.getCached (
							'myRemainFocused(' + _duration + ')',
							function (_node,_handler,_subWiringsOwnerId) {
								// ... ... ...
								// IMPLEMENTATION GOES HERE
								// ... ... ...
							}
						);
					};
					...........................................................

					The code in the above example is only different from the code shown in the section `The Basic Skeleton` in that the =_duration= parameter is now being defaulted to the value =500= if its value is equivalent to =null= (i.e. if its value is =null= or =undefined=). The defaulting is done in the statement just above the =return= statement. For performance reasons, it is best to do defaulting like this outside the wiring function. You *could*, of course, perform the defaulting logic inside the wiring function, but keep in mind that the same virtual DOM event instance could be wired against multiple different DOM nodes. Since the defaulting applies to the instance of the DOM node and is *not* unique to each individual wiring of a specific instance, one may as well perform the defaulting only once per instance, rather than every time an instance is wired for a node.

			State Management at the Wiring Level
				Beyond `state management at the instance level`, wiring logic for more sophisticated virtual DOM events may involve state management at the wiring level.

				This is especially true for virtual DOM events that require a pattern of interaction over time. In such cases, a specific wiring of such a virtual DOM event will need to keep track of where the user is in a pattern of interaction, in order to determine when the user either completes or terminates the interaction. To this end, the power of closures once again comes to our aid.

				By completing the implementation of the wiring logic for the =myRemainFocused= virtual DOM event from our `hypothetical example`, we can demonstrate how state can be maintained by using the wiring function as a closure for other functions that can then use the wiring function's scope as a store for event state. Consider the following example...

				EXAMPLE
				....................................................................
				MyVirtualDomEvents.myRemainFocused = function (_duration) {
					if (_duration == null) _duration = 500;
					return Uize.Dom.VirtualEvent.getCached (
						'myRemainFocused(' + _duration + ')',
						function (_node,_handler,_subWiringsOwnerId) {
							var _timeout;
							Uize.Dom.Basics.wire (
								_node,
								{
									focus:function (_event) {
										var _eventCopy = Uize.copy (_event);
										_timeout = setTimeout (
											function () {_handler.call (_node,_eventCopy)},
											_duration
										);
									},
									blur:function () {_timeout = clearTimeout (_timeout)}
								},
								_subWiringsOwnerId
							);
						}
					);
				};
				....................................................................

				In the implementation of our =myRemainFocused= event, we are maintaining state for a =_timeout= variable. This variable is declared inside the wiring function's scope - a scope that is common to the handlers that are wired for the =focus= and =blur= real DOM events of the node that is being wired for the =myRemainFocused= virtual DOM event. This allows the =blur= event handler to access and modify the same state that is shared by the =focus= event handler. So, they're both seeing the same =_timeout= variable.

				Now, when the =myRemainFocused= virtual DOM event is wired for a specific node, the =focus= and =blur= real DOM events are wired for the node, so that focusing the node sets a timeout to execute the =myRemainFocused= event's handler once a period of time (specified by the =_duration= parameter) has elapsed. If the node loses its focus before that period of time has elapsed, then the timeout is canceled. One instance of the =myRemainFocused= virtual DOM event (e.g. =MyVirtualDomEvents.myRemainFocused (1000)=) can be used in multiple different wirings, and each wiring will maintain its own state for the =_timeout= variable during user interaction with the wired node.

				More complex virtual DOM event implementations may involve maintaining much more state at the wiring level than this simple example, but the fundamental principle remains the same.

		Register Your Virtual DOM Event
			Registering a virtual DOM event's maker method allows the virtual DOM event - along with values for any parameters it may support - to be specified using a string (see `Specifying Virtual DOM Events By Registered Name`).

			Therefore, once you are satisfied with your virtual DOM event's implementation, you might like to register it so that a potential user of the event has more flexibility in how they can specify it when wiring or unwiring DOM nodes.

			Using the Uize.Dom.VirtualEvent.register Static Method
				Registering a virtual DOM event is easy and is done using the =Uize.Dom.VirtualEvent.register= static method.

				Using the =myRemainFocused= virtual DOM event from our `hypothetical example`, the statement for registering the event would be as follows...

				EXAMPLE
				...............................................................................
				Uize.Dom.VirtualEvent.register (
					'myRemainFocused',                  // registered name (without parentheses)
					MyVirtualDomEvents.myRemainFocused  // virtual DOM event maker method
				);
				...............................................................................

				The first parameter for the =Uize.Dom.VirtualEvent.register= method is the registered name of the virtual DOM event, and the second parameter is a reference to the maker method. The registered name for a virtual DOM event *does not* have to match the naming of the event's maker method. By convention, however, it usually does. In our case, the maker method is =MyVirtualDomEvents.myRemainFocused=, and the registered name of the event is "myRemainFocused". Notice that the registered name for the event does not contain the trailing parentheses and parameter set that would be used when specifying the event in the node wiring and unwiring methods.

			Shared Namespace
				When registering virtual DOM events, it must be kept in mind that the names of all virtual DOM events effectively exist in the same namespace when they are registered.

				This means that you registering a virtual DOM event by a name that's already in use will result in the event previously registered by that name being "unseated". Consider the following example...

				EXAMPLE
				.....................................................................................
				Uize.Dom.VirtualEvent.register ('remainFocused',MyVirtualDomEvents.myRemainFocused);
				.....................................................................................

				In the above example, we're registering the virtual DOM event we used in our `hypothetical example` by the name "remainFocused". Unfortunately, the =Uize.Dom.VirtualEvent= module defines its own =remainFocused= virtual DOM event. So, in this case, our own implementation will override the implementation of the =remainFocused= event that is registered by this module.

				When specifying virtual DOM events by name in the node wiring and unwiring methods, not having to dereference off a namespace makes things more concise, but using a shared namespace brings with it the peril of naming collisions.

			Unregistered Virtual DOM Events
				While there are benefits to registering virtual DOM events, it should be noted that registering them is not absolutely necessary.

				When a virtual DOM event's maker method is not registered, then it will not be possible to specify the event and its parameters using a string form - it will only be possible to get a reference to a virtual DOM event object by calling the maker method. It will also not be possible to specify the event when using the variation of the wiring and unwiring methods that take an =eventNamesToHandlersMapOBJ= parameter that specifies multiple wirings of events to handlers (for an example of this, see the section `Unique Parameters Translate To Unique Events`).

				Depending on the application for a particular virtual DOM event, registering it may or may not be compelling.

		Use Your Virtual DOM Event
			Once you've completed the `three basic steps` for implementing a virtual DOM event, your event will be ready to use.

			For a refresher on how to use virtual DOM events, see the section `Using Virtual DOM Events`. Once you have a maker method, you can call this method to make instances of the virtual DOM event and then specify these instances by object reference (see `Specifying Virtual DOM Events By Object Reference`). Once you've registered your virtual DOM event, then you can also specify it using a string form (see `Specifying Virtual DOM Events By Registered Name`).

			The example below uses the =myRemainFocused= virtual DOM event from our `hypothetical example` and demonstrates the two different ways that handlers for the event can be wired up...

			EXAMPLE
			............................................................................................
			// wire handler for virtual DOM event, by calling maker method

			Uize.Dom.Basics.wire (
				'myNode1',
				MyVirtualDomEvents.myRemainFocused (1000),
				function () {alert ('myNode1 remained focused for a second')}
			);


			// wire handler for virtual DOM event, by using registered name

			Uize.Dom.Basics.wire (
				'myNode2',
				{
					'myRemainFocused(1000)':function () {alert ('myNode2 remained focused for a second')},
					mouseover:function () {console.log ('moused over myNode2')},
					mouseout:function () {console.log ('moused out of myNode2')}
				}
			);
			............................................................................................

		Inspiration
			Beyond the basic virtual DOM events that are provided in the =Uize.Dom.VirtualEvent=, more exotic events can be conceived.

			Some of the more sophisticated kinds of user interactions that could be expressed using the event paradigm wander into the territory of gestures. For example, one might implement virtual DOM events such as "shake", "flick", "whack", "crossOut", etc. A "shake" gesture may involve clicking on a node, holding down the mouse key, and then vigorously moving the mouse back and forth. A "flick" gesture may involve clicking on a node, holding down the mouse key, rapidly moving the mouse in one direction, and then quickly releasing the mouse button before the motion is completed. A "whack" gesture may involve rapidly moving the mouse over a node at one edge, and then rapidly moving the mouse in the opposite direction and out of the node, as if to whack it on one of its edges in order to budge it. A "crossOut" gesture may involve moving the mouse diagonally from top right to bottom left, and then from top left to bottom right, without too much of a pause between the two diagonal motions.

			As you can see, there's a whole universe of potentially interesting (and complex) user interactions that could be expressed using the construct of the virtual DOM event. Many of these gestures may involve tracking mouse movements over time and detecting patterns of movement. Needless to say, implementing such gestures so that they are not easy to accidentally trigger during other interactions might require some sophisticated code. Regardless, the virtual DOM event construct provides a foundation to make such implementations reusable in application logic.
*/

Uize.module ({
	name:'Uize.Dom.VirtualEvent',
	required:'Uize.Dom.Basics',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_virtualDomEventsByName = {}
		;

		/*** Utility Functions ***/
			function _getCondensedEventName (_eventName) {
				return _eventName.toLowerCase ().replace (/\s+/g,'');
			}

		return Uize.package ({
			resolve:function (_eventName) {
				/* NOTE:
					This is a hook method that is used by Uize.Dom.Basics, when the name of an event being wired or unwired ends with a ")" (i.e. looks like a virtual DOM event), and when the Uize.Dom.VirtualEvent module is loaded. This method is NOT a public method that is intended to be used by an application developer.
				*/
				var
					_paramsStartDelimPos = _eventName.indexOf ('('),
					_params = Uize.eval ('([' + _eventName.slice (_paramsStartDelimPos + 1,-1) + '])')
				;
				return (
					_virtualDomEventsByName [_eventName = _eventName.slice (0,_paramsStartDelimPos)] ||
					_virtualDomEventsByName [_getCondensedEventName (_eventName)]
				).apply (0,_params);
			},

			getCached:function (_eventName,_wire) {
				return (
					_virtualDomEventsByName [_eventName] ||
					(
						_virtualDomEventsByName [_eventName] = {
							virtualDomEvent:_eventName,
							wire:_wire
						}
					)
				)
				/*?
					Static Methods
						Uize.Dom.VirtualEvent.getCached
							Returns a `virtual DOM event` object, that is either retrieved from a cache of `virtual DOM event` objects using the specified event name as a key, or that is created and then stored in the cache using the specified event name as a key.

							SYNTAX
							....................................................................................
							virtualDomEventOBJ = Uize.Dom.VirtualEvent.getCached (eventNameSTR,eventWirerFUNC);
							....................................................................................

							This method can be useful in the implementation of `virtual DOM event maker` methods.
				*/
			},

			register:function (_eventName,_maker) {
				return _virtualDomEventsByName [_eventName] =
					_virtualDomEventsByName [_getCondensedEventName (_eventName)] = _maker
				;
				/*?
					Static Methods
						Uize.Dom.VirtualEvent.register
							Registers the specified `virtual DOM event maker` function under the specified name.

							SYNTAX
							...............................................................................
							eventMakerFUNC = Uize.Dom.VirtualEvent.register (eventNameSTR,eventMakerFUNC);
							...............................................................................

							When a `virtual DOM event maker` function has been registered using this method, then it will be possible to specify it by name when wiring handlers for events of nodes. Without registering the maker function, it will only be possible to wire handlers for the virtual DOM event by calling the maker function (for more info on wiring handlers for virtual DOM events, see the section `Using Virtual DOM Events`).

							For a more in-depth discussion of how to implement your own virtual DOM events and how to use the =Uize.Dom.VirtualEvent.register= method in this process, consult the section `Implementing Virtual DOM Events`.
				*/
			}
		});
	}
});

