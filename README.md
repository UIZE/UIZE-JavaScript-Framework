UIZE JavaScript Framework
=========================

UIZE is pronounced "you eyes", and is a FREE, powerful, open source, OOP JavaScript framework for browsers, NodeJS, and other JavaScripty places.

FREE and Open Source
--------------------

UIZE is free to use and all the source is available for all to view and fork on GitHub.

- *Free to Use* - UIZE is absolutely free to use - no catches, no one time purchase fees, no per seat developer licenses.
- *Dual License* - The UIZE JavaScript Framework - including all code and examples - is available under either the [MIT License](http://en.wikipedia.org/wiki/MIT_License) or the [GNU General Public License](http://en.wikipedia.org/wiki/GNU_General_Public_License) - you choose. [Dual licensing](http://en.wikipedia.org/wiki/Dual_license) means you get to choose the licensing terms that are right for your project or application. There is nothing special for you to do - simply [download]([Using the Documentation]download.html) the UIZE JavaScript Framework, and start using it under the licensing terms of your choice. Go ahead and use UIZE with complete peace of mind.
- *Open Source* - UIZE is proudly contributed to the OpenSource community and is available for forking on [GitHub](https://github.com/uize/uize-javascript-framework). Being on GitHub means that you can conveniently fork the project and control your destiny by adapting things when needed.

For more information, consult the [license page](http://www.uize.com/license.html).

Modules & Dependency Resolution
-------------------------------

UIZE implements an elegant and clean system for defining JavaScript modules of many different varieties.

Defining a module in UIZE is as simple as calling the `Uize.module` method, as follows...

	Uize.module ({
		name:'MyNamespace.MyModule',
		required:[
			'Uize.Color',
			'Uize.Data.Matches',
			'MyNamespace.MyOtherModule'
		],
		builder:function () {
			var myModule;

			// do stuff to initialize myModule
			// ... ... ... ... ... ... ...
			// ... ... ... ... ... ... ...

			return myModule
		}
	});

### Dependency Resolution

The way that the module system works, any modules that are declared as direct dependencies in the `required` property of the module definition are loaded first.

The `builder` function for the module is called only once all dependencies - direct or indirect - are loaded. This means that you never have to worry about dependencies of other modules and figuring out comprehensive lists of all the code that a page might need. If you follow the practice of always declaring just your own direct dependencies for the module you're working on, then UIZE does all the recursive dependency tracing for you and the module loader takes care of loading what's still needed (not already loaded because something else had needed it).

### Built Into the Base Module

The system for loading module dependencies is built into the base `Uize.js` file, so all that's needed to bootstrap a page for basic development is to add a script tag to load that file.

	<script src="http://www.uize.com/js/Uize.js"></script>

	<script type="text/javascript">
		Uize.require (
			'Uize.Widgets.Calculator.Widget',
			function () {Uize.Widgets.Calculator.Widget ().insertUi ()}
		);
	</script>

If you copy-and-paste the above code into some HTML page (maybe you've got one you're working on), you will see a glorious calculator widget added to the page. Because of the highly modular nature of the UIZE codebase, there's actually a bunch of individual modules that will be loaded. All this is taken care of for you.

### Packaging

Rest assured, when it comes time to get a project ready for production, UIZE provides ways to build JavaScript packages using the same dependency resolution system so that you can reduce the number of HTTP requests made by your application and thereby improve its load time.

You can either rely on the built-in UIZE support for building JavaScript library files, or you can craft your own more sophisticated packager using the raw build methods for tracing dependencies of modules. And, because UIZE supports all kinds of modules, you can even build your HTML templates and CSS templates for UI widgets into the same JavaScript package as your JavaScript logic.

### All Kinds of Modules

Because UIZE's module mechanism is very generic in nature (you can define anything in your `builder` function), it lends itself to being used as a wrapper for all types of content.

In the UIZE widgets, for example, JavaScript modules are used to wrap HTML templates and CSS templates, allowing all the materials needed by a widget to be packaged into the same file (even the images if you implement [base64 encoding](http://en.wikipedia.org/wiki/Base64) for inlining of images in the wrapped CSS modules).

Different flavors of JavaScript modules include...

- class modules
- package modules
- JSON / data modules
- CSS template modules
- HTML template modules
- JavaScript library modules

What's more, using the powerful build system and the development server, you can create your own URL handlers for new types of source files that should be ultimately wrapped in the form of JavaScript modules.

Basic Utility Belt Features
---------------------------

UIZE provides a bunch of utility belt features right in the `Uize` base module, so you get that in addition to the modules & dependency resolution system.

Utility belt features include...

- *value testing methods*, like `Uize.isArray`, `Uize.isList`, `Uize.isPlainObject`, `Uize.isPrimitive`, `Uize.inRange`, and many more...
- *basic data utility methods*, like `Uize.clone`, `Uize.copy`, `Uize.copyList`, `Uize.indexIn`, `Uize.isIn`, `Uize.keys`, `Uize.lookup`, `Uize.merge`, `Uize.reverseLookup`, `Uize.value`, and many more...
- *iterator methods*, like `Uize.forEach` and `Uize.callOn`
- *value transformer methods*, like `Uize.capFirstChar`, `Uize.constrain`, `Uize.substituteInto`, and more...
- *dummy functions*, like `Uize.nop`, `Uize.returnFalse`, `Uize.returnTrue`, and `Uize.returnX`
- *general utility methods*, like `Uize.eval`, `Uize.global`, `Uize.noNew`, `Uize.now`, `Uize.quarantine`, etc.

### Avoiding Bloat

While it's nice to have some of these types of utility methods always close at hand, we don't want the `Uize` base module to become bloatware and so we haven't added some of the more esoteric utilities that you might find in some other popular toolbelt JavaScript libraries.

The utility methods that make their way into the `Uize` base module are given careful consideration, and are often given the greenlight because they are needed by other core modules that are very likely to be used, so why not make them public for all to use.

### Util Namespaces

Instead of throwing everything including the kitchen sink into the `Uize` base module, utilities for other kinds of situations are organized into other namespaces in the framework, such as the `Uize.Util`, `Uize.Node.Util`, `Uize.Color.xUtil`, `Uize.Build.Util`, and `Uize.Array.Util` namespaces.

Classes, Inheritance, OOP
-------------------------

UIZE makes it dead easy to create classes that come with support for events (thanks to a built-in event infrastructure) and state properties and binding.

### Creating a Class

Making a class in UIZE is as easy as calling the `subclass` static method of a class that you want to extend, as follows...

	var MyWidgetClass = Uize.Widget.V2.subclass ();

In the above example, `MyWidgetClass` is now a subclass of UIZE's V2 (version 2) widget base class. The new `MyWidgetClass` class inherits all of the instance methods and property, state properties, and inheritable static methods and properties from the `Uize.Widget.V2` base class.

### Declaring Features

Declaring features for a newly created class can be done in a number of different ways, but by far the simplest and most elegant is to declare all the new features or overridden features in an optional features declaration object that is passed to the `subclass` method, as follows...

	var MyClass = Uize.Class.subclass ({
		instanceMethods:{
			someInstanceMethod1:function () {
				// do some stuff
			},
			someInstanceMethod2:function () {
				// do some stuff
			}
		},
		staticMethods:{
			someStaticMethod1:function () {
				// do some stuff
			},
			someStaticMethod2:function () {
				// do some stuff
			}
		}
	});

For a more detailed discussion of the UIZE approach to OOP, consult the [Classes and Inheritance](http://www.uize.com/guides/classes-and-inheritance.html) guide.

State Properties and Binding
----------------------------

UIZE offers a mature and powerful state properties system so that classes can expose a state interface for their instances.

The state properties system goes beyond regular object properties, and even beyond the newer [properties capabilities of ECMAScript 5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty), providing powerful constructs like conformers, optimized onChange handlers, aliases (for deprecating old names), and value changed events using the built-in event infrastructure.

EXAMPLE

	function calculateVolume () {
		this.set ({volume:this.get ('width') * this.get ('depth') * this.get ('height')});
	}

	var Room = Uize.Class.subclass ({
		stateProperties:{
			width:{
				value:10,
				conformer:function (newValue) {return Uize.constrain (newValue,10,50)},
				onChange:calculateVolume
			},
			depth:{
				value:10,
				conformer:function (newValue) {return Uize.constrain (newValue,10,50)},
				onChange:calculateVolume
			},
			height:{
				value:10,
				conformer:function (newValue) {return Uize.constrain (newValue,9,25)},
				onChange:calculateVolume
			},
			volume:{
				onChange:function () {
					// code to display volume info in UI
				}
			}
		}
	});

In this example we're creating a `Room` class with the state properties `width`, `depth`, `height`, and `volume`.

### Range Type Conformers

The `width` and `depth` properties both have a conformer that constrains their value to a range of `10` to `50`, while the `height` property has a conformer that constrains its value to a range of `9` to `25`.

### Optimized onChange Handler

All three of these properties share the same reference to the `calculateVolume` function, which gets called only once during a set if any or all of the properties change value during the set (this is a smart optimization of UIZE).

The `calculateVolume` function gets called as though an instance method (ie. with the instance as context), so it can use the `this` keyword. It uses the `get` instance method to obtain the current values of the three dimension properties to calculate the volume of the room and then sets a new value on the `volume` state property, making this property effectively a derived property.

### Looking at Some Outcomes

Now let's take a look at what happens when we try setting the values of the state properties in a few different situations.

	var livingRoom = Room ({width:15,depth:20,height:19}); // initialized with values for properties
	alert (livingRoom.get ('volume'));              // alerts 5700

	livingRoom.set ({width:15,depth:20,height:19}); // no change in properties, volume unchanged
	alert (livingRoom.get ('volume'));              // alerts 5700

	livingRoom.set ({width:18,depth:18,height:22}); // volume is only calculated once
	alert (livingRoom.get ('volume'));              // alerts 7128

	livingRoom.set ({width:55,depth:60,height:30}); // property values are constrained at upper bounds
	alert (livingRoom.get ('width'));               // alerts 50
	alert (livingRoom.get ('depth'));               // alerts 50
	alert (livingRoom.get ('height'));              // alerts 25
	alert (livingRoom.get ('volume'));              // alerts 62500

	livingRoom.set ({width:99,depth:99,height:99}); // properties remain constrained, volume unchanged
	alert (livingRoom.get ('width'));               // alerts 50
	alert (livingRoom.get ('depth'));               // alerts 50
	alert (livingRoom.get ('height'));              // alerts 25
	alert (livingRoom.get ('volume'));              // alerts 62500

There are effectively five different places where we're setting values for the state properties: once as part of instance creation, and then on four subsequent occasions...

1. Immediately after the `livingRoom` instance is created, the value of the `volume` state property is `5700`, being calculated during construction of the instance from the values set for the `width`, `depth`, and `height` properties.
2. Next, the `set` method is called in an attempt to set the values of the dimension properties to their exact current values. This results in no change in the dimension property values, the `calculateVolume` function is not called for any of the `onChange` handlers, and the value of the `volume` property remains unchanged.
3. Next, the `set` method is called and different values are specified for each of the dimension properties. This results in the shared `calculateVolume` change handler function being called only once, and the value of the `volume` property is now set to `7128`.
4. Next, the `set` method is called and values are specified for the dimension properties that are all outside of the range bounds enforced by their `conformer` functions. This results in the values being constrained at the upper limits of the ranges and there is a change in the values of all the properties. The shared `calculateVolume` change handler function is still called only once, and the value of the `volume` property is now set to `62500`.
5. Finally, the `set` method is called once again in an attempt to set values for the dimension properties that are above the upper range bounds enforced by their `conformer` functions. This results in the values being constrained at the upper limits of the ranges, but this time there is no change in the values of the properties because they were already constrained at their upper limits. The shared `calculateVolume` change handler function is not called (none of the properties' values have changed), and the value of the `volume` property remains unchanged at `62500`.

### Changed Events

Every state property that is declared for a class gets the benefit of changed events that fire automatically when the value of the state property changes.

EXAMPLE

	var MyClass = Uize.Class.subclass ({
		stateProperties:{
			foo:{value:'bar'}
		}
	});

	var myClassInstance = MyClass ();

	myClassInstance.wire (
		'Changed.foo',
		function () {alert (myClassInstance.get ('foo'))}
	);

	myClassInstance.set ({foo:'qux'});

In this example, we've created the class `MyClass` and declared that it has a state property named `foo` with an initial value of `'bar'`. After creating an instance of this class, `myClassInstance`, we wire a handler for the `Changed.foo` event, which is an event that will automatically be fired by UIZE whenever the value of the `foo` state property changes. After wiring the handler, we use the `set` method to set the `foo` property to the new value `'qux'`. This causes the `Changed.foo` event to be fired and the `alert` statement is hit, which alerts the new value `'qux'`.

### Binding Properties Together

UIZE providers numerous utility modules for conveniently binding state properties together in straightforward or more elaborate ways.

Property binding utility modules include...

- `Uize.Util.Coupler` - lets you couple two or more instances (of any class) together, synchronizing a set of any number of their state properties between all instances (eg. synchronizing the `width`, `depth`, and `height` properties across any number of different `Room` instances)
- `Uize.Util.PropertyAdapter` - lets you connect any two properties of any two instance so that they remain synchronized bi-directionally, with an optional value transformer that can allows for the value to be transformed in different ways for each direction (eg. synchronizing two color properties where the color is stored in different formats in each of the properties)

For a more detailed discussion of the state properties system, consult the [State Properties](http://www.uize.com/guides/state-properties.html) guide.

Event Infrastructure
--------------------

The JavaScript language does not provide a built-in system for event-driven programming, so UIZE provides an event system.

Such events can be fired (aka published, dispatched, triggered, emitted, etc.) from anywhere in the code in an ad hoc fashion, and listenable events do not need to be registered formally. Multiple handlers can be registered for the same event. Handlers can be registered for events that are never fired, without ill effects. Conversely, events can be dispatched that are never listened for, without ill effects.

EXAMPLE

	var myWidget = Uize.Widget ();
	myWidget.wire (
		'My Arbitrary Event',
		function (event) {alert (event.message)}
	);
	myWidget.fire ({name:'My Arbitrary Event',message:'Hello, world!'});

In the above example, an instance of the `Uize.Widget` class is created, a handler is registered on an arbitrarily named event (`'My Arbitrary Event'`), and then the `fire` instance method is called on the widget in order to fire that event. The event object contains an additional `message` property, whose value is alerted in the handler that was registered for the event.

The event system implemented by the UIZE JavaScript Framework is orthogonal to the event model of Web browsers that is provided as part of the standardized Document Object Model, and can be used outside of the context of Web browsers and other host environments for the JavaScript language that may implement their own proprietary event systems. As an example of this, the framework's event system can be utilized within Windows Script Host by scripts that use the `Uize.Class` base class.

The `Uize.Class` base class provides a convenient infrastructure for supporting both static and instance events. Events can conveniently be fired for a class or an instance of a class, and methods are provided to every class that subclasses the `Uize.Class` base class to allow code to manage the wiring and unwiring of event handlers for static and instance events. This provides all `Uize.Class` subclasses with a consistent event model.

For a more in-depth discussion on events, consult the guide [JavaScript Event System](http://www.uize.com/guides/javascript-event-system.html).

Conditions, Barriers, Needs
---------------------------

UIZE implements the useful programming constructs of conditions, barriers, and needs.

- *conditions* - define conditions that are derived from one or more state properties using a properties derivation, and register code that is to be executed once a condition is met, each time a condition is met, or whenever a condition changes state
- *barriers* - register code that is to be executed once a condition is met, or immediately if the condition is already met - this can help with code that might be vulnerable to race conditions because of unpredictable asynchronous processes
- *needs* - register provider code that is to be executed the first time something is needed and that will provide that need, and register code that has a need and that should invoke an associated provider to be executed - register needs and providers optionally and in any order - this can help to manage loosely coupled code that needs to cooperate but can't agree on timing

The conditions, barriers, and needs / providers mechanisms make it possible to manage tricky timing situations in applications where code is distributed and where it may not be feasible to enforce / orchestrate the desired sequencing. These mechanisms make it possible to explicitly define the state dependencies.

Ajax / Asynchronous Processes
-----------------------------

UIZE provides features to enable Web applications to more easily perform asynchronous communication with a Web server, a technique that is often referred to broadly as [Ajax](http://www.wikipedia.org/Ajax_(programming)).

The `Uize.Comm` base class provides a foundation for supporting asynchronous communication regardless of the mechanism employed, which could be a hidden `iframe`, the `XMLHttpRequest` object, or script tags (see [AJAST](http://www.wikipedia.org/AJAST_(Programming))). This base class provides a caching mechanism for requests, a queueing mechanism in order to sequence successive asynchronous requests through a single communication object, and a standard interface for issuing requests. Various subclasses of the `Uize.Comm` base class implement support for different communication mechanisms.

EXAMPLE

	Uize.Comm.Ajax ().request ({
		url:[
			'/service/search',
			{
				productFilter:'movies',
				genre:'comedy',
				sort:'popular',
				results:100
			}
		],
		returnType:'json',
		callback:function (searchResults) {
			// do something with the search results
		}
	});

In the above example, an instance of the `Uize.Comm.Ajax` class is created and immediately used to perform an asynchronous request to a hypothetical search service using the `XMLHttpRequest` object. The anonymous function specified for the callback property is executed once the request has successfully executed, and the result from the server is passed as a parameter to the callback function as a JSON object.

For a more in-depth discussion of AJAX programming, consult the reference for the `Uize.Comm` base class.

DOM Manipulation
----------------

While a design goal of the UIZE JavaScript Framework is to support multiple different host environments that support the JavaScript language, a key application of the framework is to facilitate the development of Rich Internet Applications that run with a web browser as the host environment for client-side functionality.

As such, there exist a number of modules designed specifically to assist with inspection of and manipulation of a Web page's Document Object Model. Among other things, these modules provide static methods for: iterating across a range HTML elements and performing operations on each, finding a set of HTML elements by means of a match expression, getting and setting Cascading Style Sheet (CSS) style properties, insertion of HTML markup, management of DOM event listeners, and querying and modifying coordinates.

EXAMPLE

	Uize.Node.setStyle (
		['myNode1','myNode2','myNode3'],
		{
			width:'100px',
			height:'20px',
			backgroundColor:'#000',
			fontFamily:'Times'
		}
	);

The above example demonstrates how the `Uize.Node.setStyle` static method of the `Uize.Node` module is used to set the `width`, `height`, `backgroundColor`, and `fontFamily` CSS style properties for the three nodes with the ids "myNode1", "myNode2", and "myNode3".

For a more in-depth discussion of DOM manipulation, consult the reference for the `Uize.Node` module.

Widgets Framework
-----------------

UIZE provides a system to facilitate the development of widgets that can be embedded in HTML pages.

Functionality that can be inherited by widget classes is implemented in the `Uize.Widget` base class. The framework's widget system allows widgets to be arranged in a hierarchical tree structure, where each widget can have one parent widget and any number of child widgets. In this relationship, parent widgets can provide services to child widgets on their tree, and child widgets can inherit state from widgets higher up in the parent chain.

Examples of widgets include: buttons, sliders for selecting continuous values, progress bars, calendar / date pickers, color pickers, sortable collections, tabbed interfaces, modal dialogs, slide shows, data table sorters, tree list controls, and hierarchical menus.

For a more in-depth discussion of UIZE's widget framework, consult the guide [JavaScript Widgets](http://www.uize.com/guides/javascript-widgets.html).

HTML & CSS Templating
---------------------

The versatile templating system employed by UIZE is relied upon heavily for the HTML templates and CSS templates that are used by encapsulated widgets.

### HTML Templates

HTML templates are JST templates (`.js.jst` files) that are compiled to efficient JavaScript functions and wrapped in JavaScript modules so that they can be required as dependencies.

HTML template functions are called as instance methods of widget instances and can, therefore, call the widget's public instance methods as part of process of generating the HTML string for a widget. For instance, a widget's template can call the `childHtml` instance method on the widget in order to get the HTML for a child widget so that it can be added to the HTML in the desired place.

Below is an example of an HTML template taken from the progress bar (`Uize.Widgets.ProgressBar.Widget`) widget...

EXAMPLE

	<div id="<%= this.nodeId () %>" class="<%= this.rootNodeCssClasses () %>">
		<div id="<%= this.nodeId ('track') %>" class="<%= this.cssClass ('track') %>">
			<div class="<%= this.cssClass ('trackBg') %>"></div>
			<div id="<%= this.nodeId ('full') %>" class="<%= this.cssClass ('trackFull') %>"></div>
			<div id="<%= this.nodeId ('empty') %>" class="<%= this.cssClass ('trackEmpty') %>"></div>
			<div id="<%= this.nodeId ('statusText') %>" class="<%= this.cssClass ('statusText') %>"></div>
		</div>
	</div>

### CSS Templates

CSS templates are JavaScript templates that are compiled to CSS files by the build system, and additionally wrapped as CSS modules that can be required as dependencies of widget modules.

CSS templates can require JavaScript modules through use of the `@required` directive. This allows CSS templates to declare dependencies on modules that define shared values for styles that are to be common across multiple different CSS files, as well as functions from CSS utility modules. While not the same as systems like [LESS](http://lesscss.org) and [SASS](http://sass-lang.com), UIZE's CSS templates system can be used to accomplish a lot of the same objectives of factoring out shared theme-wide styles and creating reusable functions for simplifying the creation of more complex style rules.

Below is an example of a CSS template taken from the color swatch (Uize.Widgets.ColorSwatch.Widget) widget...

EXAMPLE

	<%@ required ('Uize.Widgets.CssUtil'); %>
	<%
		var
			_cssUtil = Uize.Widgets.CssUtil,
			_borderWidth = _cssUtil.box.border.width
		;
	%>
	.`` {
		display: inline-block;
		border-width: <%= _borderWidth %>px;
		border-style: solid;
		border-color: #ccc #999 #999 #ccc;
		width: 20px;
		height: 20px;
	}

	/*** different sizes ***/
	<%
		var _sizes = _cssUtil.sizes;
		function _sizeStyleProperties (_sizeName,_horizontalPadding) {
			var
				_size = _sizes [_sizeName],
				_widthHeight = _size.outer - _borderWidth * 2
			;
			%>
			width: <%= _widthHeight %>px;
			height: <%= _widthHeight %>px;
			<%
		}
	%>
		.`tiny` {
			<% _sizeStyleProperties ('tiny') %>
		}

		.`small` {
			<% _sizeStyleProperties ('small') %>
		}

		.`medium` {
			<% _sizeStyleProperties ('medium') %>
		}

		.`large` {
			<% _sizeStyleProperties ('large') %>
		}

Lots of Built-in Widgets
------------------------

To help you get started with Web app development, UIZE comes bundled with lots of built-in widgets.

Included in the built-in widgets are: auto suggest, tooltip, slider, progress bar, various buttons, calculator, calendar, collection and collection item (for grids and lists), color picker, color info, resizable and draggable dialog / window, egg timer, form and form input, image port, drop list, scrolly, table sorter, tree, toggler button, and more.

The built-in widget modules are divided into two main groups...

- *widget abstract classes* - these are contained under the `Uize.Widget` namespace and do not have any associated HTML or CSS
- *encapsulated widgets* - these are contained under the `Uize.Widgets` namespace and are self-contained with their own associated HTML, CSS, and assets (and they usually subclass one of the widget abstract classes)

To preview some of the many built-in widgets, you can take a look at...

- [Widget Visual Samplers](http://www.uize.com/examples/widget-visual-samplers.html?namespace=Uize.Widgets) - this provides a way to get a quick sample of some of the features of the encapsulated widgets (the ones with their own HTML and CSS)
- [Widget Tour](http://www.uize.com/javascript-feature-tours.html?tour=widget) - this will take you on a page-by-page tour of many of the widget example pages included as part of the extensive documentation

### Make Your Own

If no built-in widget meets your exact needs you can easily build your own custom widgets - either from scratch by subclassing the `Uize.Widget.V2` base class, or by subclassing one of the existing built-in widget classes.

For a detailed discussion of UIZE widgets with guidelines on how to make your own, consult the [JavaScript Widgets](http://www.uize.com/guides/javascript-widgets.html) guide.

Internationalization / Localization
-----------------------------------

UIZE provides facilities (in `Uize.Widget`) to ease [i18n](http://en.wikipedia.org/wiki/I18n) (internationalization) and [L10n](http://en.wikipedia.org/wiki/I18n) (localization) of JavaScript code.

The `localized` state property allows an arbitrary number of localized string templates to be specified in an object hash, and these string templates are then available to the widget and all its child widgets. The `localize` instance method allows a string template to be retrieved and will process the string, as necessary, to replace substitution tokens with dynamic data.

EXAMPLE

	myWidget = Uize.Widget ({
		localized:{welcomeMessage:'Welcome, {firstName} of {state}, {country}'}
	});
	alert (
		myWidget.localize (
			'welcomeMessage',
			{firstName:'Chris',state:'California',country:'USA'}
		)
	);

In the above example, an instance of the `Uize.Widget` class is created, specifying a `localized` hash that contains just one localized string template named `welcomeMessage`. This string contains the substitution tokens `{firstName}`, `{state}`, and `{country}`. The `localize` instance method is called on the widget instance, with parameters specifying the name of the localized string to retrieve and dynamic data that should be substituted into its tokens. The result is then displayed to the user with the `alert` statement. Typically, localization will occur inside the implementation for a widget class, so this example is purely for illustrating the syntax.

*TIP*: To aid in internationalizing legacy code, a script is provided that can be run in Windows Script Host and that will recurse through the folders of a Web site project in order to compile a report of all the string literals contained inside JavaScript files, using a heuristic algorithm to bucket them according to their likelihood of being internationalizable strings (see [JavaScript Build Scripts](http://www.uize.com/guides/javascript-build-scripts.html)).

For a more in-depth discussion of internationalization and localization, consult the guide [JavaScript Localization](http://www.uize.com/guides/javascript-localization.html).

Testing Framework
-----------------

UIZE provides a robust testing framework to support writing unit tests, functional tests, and performance tests.

The testing framework has the following key benefits...

- *runs in any JavaScript environment* - tests written for the UIZE testing framework can be run in any JavaScript environment, including NodeJS, WSH (Windows Script Host), a Web browser, etc.
- *synchronous and asynchronous test cases* - the testing framework supports both synchronous as well as asynchronous tests, while not adding undue burden in the common case of writing synchronous tests
- *nesting, arbitrarily deep* - any test can contain child tests, so tests can inherently be hierarchical in nature - any test suite can aggregate other test suites, so there's no limit to how you can structure test suites for more complex projects
- *declarative syntax* - for convenience, tests can be defined using a declarative syntax
- *test run monitoring through events* - the running of any test or test suite can be monitored through events that are fired as the test progresses
- *events for live logging* - in addition to monitoring test running using the test events, these events can be used to log output to one or more logging systems
- *tests are atomic* - every test is atomic and is only responsible for returning / reporting a success/fail result - there are no asserts
- *expectations based* - the testing framework was designed from the beginning to be expectations based - some action is performed by a test and there is an expected result, and various methods in the `Uize.Test` base class provide convenient ways to test for different types of expectations being met
- *test result retention* - after a test tree is run, all the instances created for running the test tree are retained, so the times taken and other information can be evaluated / analyzed afterwards - the data isn't all lost in some cryptic, text-based log file
- *multi-instantiation* - because every test is a class, and every test run is an instance of a test class, an entire test suite can theoretically be multi-instantiated, and test suites like this that include asynchronous tests could even be multi-instantiated and run concurrently (at the very least, results from different runs can be compared from the different instances)

For more information on the testing framework, consult the guide [JavaScript Testing Framework](http://www.uize.com/guides/javascript-testing-framework.html).

Templating System
-----------------

UIZE implements a system for templating that allows the JavaScript language to be leveraged within templates, such templates being referred to as JavaScript templates.

This system allows for the use of programmatic logic and JavaScript control structures within a template for the purpose of rendering a result document. It's format and approach will be immediately familiar to anyone who has used the templating systems of other languages, such as Ruby's `.erb` templates, .NET's `.aspx` templates, Java's `.jsp` templates, etc.

The template engine is implemented in the `Uize.Template` module, which provides a means for compiling a source template into a more performant JavaScript function. Once compiled into JavaScript functions, JavaScript templates can be used to generate text output for a variety of purposes, including, for example, the generation of HTML markup for widgets, the generation of complete HTML documents as part of a Web project build process, and the generation of RSS documents from a data source.

EXAMPLE

	var helloWorldTemplate = Uize.Template.compile (
		'<% for (var i = 0; i < input.repeats; i++) { %>' +
		'<p><% .message %></p>\n' +
		'<% } %>'
	);

	var myTemplateOutput = helloWorldTemplate ({repeats:5,message:'Hello World !'});

	/* myTemplateOutput will now have the value...

	<p>Hello World !</p>
	<p>Hello World !</p>
	<p>Hello World !</p>
	<p>Hello World !</p>
	<p>Hello World !</p>

	*/

In the above example, a JavaScript template in a string literal is being compiled to a JavaScript function, and then that function is being called with input data that is supplied to the template function. The result is assigned to a variable.

In practice, JavaScript templates are contained inside separate files with the extension `.jst` in order that the template source not be subject to a further level of escaping within JavaScript string literals.

AS A JST FILE

	<% for (var i = 0; i < input.repeats; i++) { %>
	<p><% .message %></p>
	<% } %>

JavaScript template files can be compiled into JavaScript modules with the use of JavaScript build scripts, and such modules can then be required as dependencies and treated as regular JavaScript modules. Alternatively, JavaScript template source can be embedded in non-visible elements of a Web page, such as a hidden `textarea` tag or a `script` tag with a mime type of `text/jst`, and then retrieved and compiled by client code when the document loads.

For a more in-depth discussion, consult the guide [JavaScript Templates](http://www.uize.com/guides/javascript-templates.html).

Effects / Animation
-------------------

UIZE provides powerful features to support slick animation effects, with easing, bounce, elasticity, pulsing, and much more.

Effects and animation in the UIZE JavaScript Framework are achieved through use of a suite of associated modules. The `Uize.Fade` module provides the underpinnings of time-based animation and compound value interpolation, the `Uize.Fade.xFactory` extension module extends the `Uize.Fade` class with factory methods for creating, starting, and managing fades in a fade pool, and the `Uize.Fx` module provides static methods for initiating fades of CSS style properties.

EXAMPLE

	// fade from thin border/thick padding to thick border/thin padding over 1/4 second
	Uize.Fx.fadeStyle ('myNode',{borderWidth:1,padding:20},{borderWidth:20,padding:1},250);

	// fade from current colors to white text on black background over two seconds
	Uize.Fx.fadeStyle ('myNode',null,{color:'#fff',backgroundColor:'#000'},2000);

	// fade font size from 30px back to current size over a half second
	Uize.Fx.fadeStyle ('myNode',{fontSize:30},null,500);

To add some pizazz to animations, the UIZE JavaScript Framework provides the `Uize.Curve`, `Uize.Curve.Mod`, and `Uize.Curve.Rubber` modules that let you stray from the bland world of linear animations and into an exotic world of animations driven by arbitrary curve functions, with built-in support for easing curves as well as curves that emulate the complex properties of motion, letting you achieve effects like bounce, springiness, wobble, elasticity, etc. Beyond the built-ins, you have the freedom to roll your own curve functions in order to achieve some of the craziest motion effects you could imagine.

For a more in-depth discussion, consult the guide [JavaScript Animation and Effects](http://www.uize.com/guides/javascript-animation-and-effects.html).

Documentation System
--------------------

UIZE implements a system for building HTML from documentation that is written in a Wikitext like format called Simple Doc.

Document structure in this format is controlled through indentation, much like program structure can be governed by indentation in the [Python programming language](http://www.wikipedia.org/Python_(programming_language)). A documentation builder script is provided that can run in Windows Script Host. This build script can recurse through all the folders of a Web site project, building HTML files from all Simple Doc files it finds, and extracting Simple Doc formatted documentation from specially flagged comments inside JavaScript module files and synthesizing these Simple Doc fragments together into Simple Doc documents for conversion into HTML documentation files.

The following example shows the documentation for the `to` instance method of the `Uize.Color` module. Notice how the documentation comment is indicated with the question mark immediately following the comment begin characters `/*`.

EXAMPLE

	/*?
		Instance Methods
			to
				Returns the current color of the instance, encoded to the specified format.

				SYNTAX
				.........................................
				encodedColor = colorOBJ.to (encodingSTR);
				.........................................

				The `encodingSTR` parameter supports a wide variety of different `color encodings`.

				EXAMPLES
				.............................................................................
				var fuchsia = Uize.Color ('fuchsia');
				fuchsia.to ('color');       // produces a new Uize.Color object
				fuchsia.to ('hex');         // produces 'ff00ff'
				fuchsia.to ('#hex');        // produces '#ff00ff'
				fuchsia.to ('name');        // produces 'fuchsia'
				fuchsia.to ('RGB array');   // produces [255,0,255]
				fuchsia.to ('RGB int');     // produces 16711935
				fuchsia.to ('RGB object');  // produces {red:255,green:0,blue:255}
				fuchsia.to ('RGB string');  // produces 'rgb(255,0,255)'
				fuchsia.to ('HSL array');   // produces [300,100,50]
				fuchsia.to ('HSL object');  // produces {hue:300,saturation:100,lightness:50}
				fuchsia.to ('HSL string');  // produces 'hsl(300,100,50)'
				.............................................................................

				NOTES
				- see the related `Uize.Color.to` static method
	*/

For a more in-depth discussion of this documentation system, consult the guide [JavaScript Documentation System](http://www.uize.com/guides/javascript-documentation-system.html).

Powerful Build System
---------------------

UIZE provides a robust and extremely versatile and configurable build system that allows multi-level build relationships to be set up.

### Responsibilities of the Build System

The build system takes care of the following responsibilities...

- `compiling from source` - the build system can be configured to support any number of different source file formats, including UIZE source file formats like `.js.jst` (JavaScript templates), `.csst` (CSS templates), `.simple` (SimpleDoc), along with popular Open Source formats like `.less` for which JavaScript based processing code is available
- `compressing code` - the build system can be configured to compress any number of different types of files (such as JavaScript and CSS), using any compressors that are implemented in JavaScript (such as UIZE's built-in JavaScript Scruncher, or other Open Source minifiers like [UglifyJS](https://github.com/mishoo/UglifyJS))
- `gzipping code` - along with compressing code, the build system can also be configured to create gzipped versions of any number of different types of files
- `building packages` - the build system can be configured to create packages in order to bundle multiple files into a single file to reduce HTTP requests when you deploy a project to production
- `lots of other crazy stuff` - that you make it do, since you can configure and extend the build system to do just about anything (it might even brew coffee for you, if you are a powerful enough JavaScript ninja)

### Key Features of the Build System

The build system has the following compelling features...

- `integrated with development server` - the build system integrates with the development server that runs in NodeJS and takes care of automatically rebuilding any files that have become invalidated by changes made to any source files from which they may be derived - directly or indirectly
- `builds incrementally` - the build system can build files incrementally as needed and based upon changes that may invalidate one or more built files
- `dependency based` - the build system is entirely dependency based, so there's no more worries about things being out-of-date because you couldn't remember the right set of build steps - all the dependencies for a build product are known and can be traced recursively, so all build steps necessary to update a file are performed in the correct order, and only as much work as is necessary is done
- `one-to-many, many-to-one` - the build system supports one-to-many and many-to-one build relationships, so one file can be involved as a dependency in building many other files (eg. a source JavaScript file is used for building a compressed JavaScript file, a reference documentation file, a source code viewer HTML file, etc.), and many files can be used in building a single file (eg. a JavaScript source file and a documentation template file are involved in building a reference documentation HTML file)
- `entirely written in JS` - the build system is written entirely in JavaScript, which means you can leverage all your JavaScript skills in configuring and extending it. It also means that any of the UIZE modules or modules from your own project can be loaded during the build process so you can use them in writing your build processes
- `works in NodeJS as well as WSH (Windows Script Host)` - because the build system uses a file system service that abstracts the environment's file system API, the build system can be run in NodeJS, WSH (Windows Script Host), or any environment for which an adapter has been written for the file system service
- `blazingly fast` - the build system is written from the ground up to be highly efficient and blazingly fast, and its incremental build characteristic means you don't waste time rebuilding stuff that's entirely unrelated to what you've modified or stuff that may already be completely current

For more information on the build system, consult the [JavaScript Build Scripts](http://www.uize.com/guides/javascript-build-scripts.html) guide.

Code Compression
----------------

UIZE provides a system for scrunching (minifying) JavaScript code - primarily to reduce its size, but also to obfuscate it.

While the network bandwidth that is used to transfer JavaScript code to the client can be reduced in order to reduce transfer time through the use of HTTP compression methods such as gzip, further code size reduction as well as a degree of code obfuscation can be achieved with the use of the Scruncher, a code minification utility that is provided as part of the UIZE JavaScript Framework. This utility can be accessed for individual use through a Web page interface, but can be more conveniently utilized as part of a build script that recurses through the folders of a Web site project and generates compressed and obfuscated code from all the JavaScript files it encounters.

Among the operations that are performed by the Scruncher are:

- remove unnecessary whitespace, such as line indentation, unnecessary whitespace between tokens, and linebreaks
- remove comments, including documentation comments
- rename private identifiers to shortened, cryptic forms

Obfuscation that is provided by the Scruncher is an artifact of the code compression process, and the Scruncher is not designed to provide robust obfuscation.

The two examples below show first an extract of JavaScript code, and second the compressed and obfuscated form of that code. Notice how, in the compressed version of the code, private identifiers that were prefixed with an underscore in the source code have been reduced down to enumerated forms (eg. `_a`, `_b`, `_c`). For the sake of readability in this example, the `LineCompacting` setting is turned off for the compressed code.

SOURCE CODE

	/*ScruncherSettings Mappings="`" LineCompacting="FALSE"*/

	_package.toAbsolute = function (_baseUrl,_url) {
		if (_package.from (_url).fullDomain) return _url;
			// return early with URL to resolve against base, if URL is absolute

		var _result = _baseUrl.slice (0,_baseUrl.search (/[\/\\][^\/\\]*$/) + 1);
			// remove everything after the last slash, but keep the last slash
		while (_url) {
			var
				_slashPos = (_url.search (/[\/\\]/) + 1 || _url.length + 1) - 1,
				_folderName = _url.slice (0,_slashPos)
			;
			_result = _folderName == '..'
				? _result.slice (0,_result.search (/[\/\\][^\/\\]*[\/\\]$/) + 1) // remove end folder
				: _result + _folderName + _url.charAt (_slashPos)
			;
			_url = _url.slice (_slashPos + 1);
		}
		return _result;
	};

SCRUNCHED CODE

	_a.toAbsolute=function(_b,_c){
	if(_a.from(_c).fullDomain)return _c;
	var _d=_b.slice(0,_b.search(/[\/\\][^\/\\]*$/)+1);
	while(_c){
	var
	 _e=(_c.search(/[\/\\]/)+1||_c.length+1)-1,
	_f=_c.slice(0,_e)
	;
	_d=_f=='..'
	?_d.slice(0,_d.search(/[\/\\][^\/\\]*[\/\\]$/)+1)
	:_d+_f+_c.charAt(_e)
	;
	_c=_c.slice(_e+1);
	}
	return _d;};

For a more in-depth discussion of the Scruncher code compression system, consult the guide [All About Scrunching](http://www.uize.com/guides/all-about-scrunching.html).

Dev Server (NodeJS)
-------------------

UIZE provides a NodeJS based development server that allows a project that involves many different types of built files to be developed without having to constantly run build scripts between changes.

The development server utilizes the powerful build system to build derived files whenever they are requested and are not current (ie. some of their dependencies have been modified since the last time they were built). The development server is used in the development of the UIZE framework, itself, and it can be used for any project for which static files will be generated as part of a build process.

With the right configuration of your application server, you can pull all the static files that would be built as part of your build process from the development server running on your localhost. That way, you get the best of both worlds - you can keep using your existing server platform while using the UIZE development server for pre-processing of source code for static files.

Extensive Documentation
------------------------

UIZE comes with extensive documentation, thanks in large parts to the built-in SimpleDoc documentation system and the powerful build system.

The UIZE documentation includes...

- [reference documentation for every module](http://www.uize.com/javascript-modules-index.html), containing at least generated implementation informtion and top quality hand written documentation in many of the more important / critical modules
- [in-depth guides](http://www.uize.com/javascript-guides.html) on numerous topics, such as modules, inheritance, the state properties system, the event system, widgets, localization, templating, animation and effects, build scripts, the testing framework, etc.
- [new announcements](http://www.uize.com/latest-news.html) for almost every new feature that is introduced
- [tons of examples](http://www.uize.com/javascript-examples.html) that demonstrate how to use UIZE, and that are available in tours and are linked to from reference documentation
- [numerous tools](http://www.uize.com/javascript-tool-examples.html) to aid in development
- [UIZE unit tests runner](http://www.uize.com/examples/uize-unit-tests.html) so the unit tests can be run in a browser
- [widget visual samplers](http://www.uize.com/examples/widget-visual-samplers.html?namespace=Uize.Widgets) to allow widgets to be browsed and sampled by namespace
- [widget visual tests](http://www.uize.com/examples/widget-visual-tests.html) to allow visual tests for widgets to be run in a browser
- and, of course, more good stuff

For more info, consule the guide [Using the Documentation](http://www.uize.com/guides/using-the-documentation.html).

