/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Classes Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Dom.Classes= module facilitates manipulation of the value of the =className= property of DOM nodes, with support for adding classes, removing classes, toggling classes, and more.

		*DEVELOPERS:* `Chris van Rensburg`

		Key Benefits
			The =Uize.Dom.Classes= module provides a number of key benefits.

			More Elegant, Easier to Read
				It is certainly possible to manipulate classes using regular expressions, but the methods of the =Uize.Dom.Classes= module make it easier to do and make one's code easier to read.

				An Example of Adding a Class
					To illustrate the ease of use of the =Uize.Dom.Classes= module, consider the following example of adding a CSS class to a node's =className= property...

					BEFORE
					..........................................................
					var node = Uize.Dom.Basics.getById ('recommendationsPod');
					if (!/\bpodPopulated\b/.test (node.className)) {
						node.className += ' podPopulated';
					}
					..........................................................

					AFTER
					................................................................
					Uize.Dom.Classes.addClass ('recommendationsPod','podPopulated');
					................................................................

					As you can see, the code using the =Uize.Dom.Classes.addClass= is much easier to read and understand.

				An Example of Toggling a Class
					In another illustration of the ease of use of the =Uize.Dom.Classes= module, consider the following example of toggling a CSS class in a node's =className= property...

					BEFORE
					...................................................................
					var node = Uize.Dom.Basics.getById ('recommendationsPod');
					if (/\bpodPopulated\b/.test (node.className)) {
						node.className = node.className.replace (/\bpodPopulated\b/,'');
					} else {
						node.className += ' podPopulated';
					}
					...................................................................

					AFTER
					...................................................................
					Uize.Dom.Classes.toggleClass ('recommendationsPod','podPopulated');
					...................................................................

			Powerful State Paradigm
				In addition to ease of use, the =Uize.Dom.Classes= module introduces a powerful, higher level construct called a state.

				The `state related methods` that support the state paradigm make it much easier to manage the classes in the =className= property of a node to reflect application state. Consider an example where you want the CSS class "selected" to be present in the =className= property of a node with the =id= of ='recommendationsPod'= when the application variable =podIsSelected= is set to =true=, and to be absent when the variable is set to =false=. Your application will have updater code to update the =className= of the node to reflect the state of the =podIsSelected= variable. This updater code may not know or trust what the current state of the =className= property of the node might be, so it may test first to see if the "selected" class should be added or removed. You might write the code as follows...

				BEFORE
				..................................................................
				if (podIsSelected) {
					Uize.Dom.Classes.addClass ('recommendationsPod','selected');
				} else {
					Uize.Dom.Classes.removeClass ('recommendationsPod','selected');
				}
				..................................................................

				Well, the =Uize.Dom.Classes.setState= static method makes this type of update operation a lot simpler. Instead of conditionally adding or removing the class, you simply set its state as follows...

				AFTER
				..........................................................................
				Uize.Dom.Classes.setState ('recommendationsPod','selected',podIsSelected);
				..........................................................................

				This is a very simple use case, but the `state related methods` of the =Uize.Dom.Classes= module also support more sophisticated cases.

		Adding a Class
			A CSS class can be added to a node's =className= property using the =Uize.Dom.Classes.addClass= static method.

			This method only adds the specified CSS class to the node's =className= property if the class isn't already present, so you will never have the same class occurring multiple times in the =className= as a result of calling this method.

			The =Uize.Dom.Classes.addClass= method follows these basic rules...

			+. If the =className= property is empty, then it will be set to the class being added.
			+. If the class being added is already present in the =className= property, then the value of the =className= property will be unchanged (see important note on `case sensitivity`).
			+. If the class being added is not present but there are other classes in the =className= property, then the class being added will be appended, with a single space separating it from the other classes (if present).

			To illustrate the above rules, consider the following example...

			HTML - BEFORE
			.........................................................................
			<!-- rule 1 example --> <div id="recommendationsPod"></div>
			<!-- rule 2 example --> <div id="commentsPod" class="podPopulated"></div>
			<!-- rule 3 example --> <div id="detailsPod" class="featured">
			.........................................................................

			JAVASCRIPT
			.....................................................
			Uize.Dom.Classes.addClass (
				['recommendationsPod','commentsPod','detailsPod'],
				'podPopulated'
			);
			.....................................................

			HTML - AFTER
			................................................................................
			<!-- rule 1 example --> <div id="recommendationsPod" class="podPopulated"></div>
			<!-- rule 2 example --> <div id="commentsPod" class="podPopulated"></div>
			<!-- rule 3 example --> <div id="detailsPod" class="featured podPopulated">
			................................................................................

		Removing a Class
			A CSS class can be removed from a node's =className= property using the =Uize.Dom.Classes.removeClass= static method.

			If the specified CSS class to remove isn't present in the node's =className= property, then calling this method will have no effect.

			The =Uize.Dom.Classes.removeClass= method follows these basic rules...

			+. If the =className= property is empty, then it will simply remain empty.
			+. If the class being removed is present in the =className= property, then it will be removed along with any surrounding whitespace, while leaving the trailing whitespace if the class was between two surrounding classes (see important note on `case sensitivity`).
			+. If the class being removed is not present but there are other classes in the =className= property, then calling this method will have no effect.

			To illustrate the above rules, consider the following example...

			HTML - BEFORE
			...........................................................................................
			<!-- rule 1 example --> <div id="recommendationsPod"></div>
			<!-- rule 2 example --> <div id="commentsPod" class="podPopulated selected featured"></div>
			<!-- rule 3 example --> <div id="detailsPod" class="podPopulated featured"></div>
			...........................................................................................

			JAVASCRIPT
			.....................................................
			Uize.Dom.Classes.removeClass (
				['recommendationsPod','commentsPod','detailsPod'],
				'selected'
			);
			.....................................................

			HTML - AFTER
			..................................................................................
			<!-- rule 1 example --> <div id="recommendationsPod"></div>
			<!-- rule 2 example --> <div id="commentsPod" class="podPopulated featured"></div>
			<!-- rule 3 example --> <div id="detailsPod" class="podPopulated featured"></div>
			..................................................................................

		Toggling a Class
			A CSS class can be toggled for a node's =className= property using the =Uize.Dom.Classes.toggleClass= static method.

			The =Uize.Dom.Classes.toggleClass= method follows these basic rules...

			+. If the =className= property is empty, then it will be set to the class being toggled.
			+. If the class being toggled is not present in the node's =className= property, but there are other classes in the =className= property, then the class being toggled will be appended, with a single space separating it from the other classes (see important note on `case sensitivity`).
			+. If the class being toggled is present in the =className= property, then it will be removed along with any surrounding whitespace, while leaving the trailing whitespace if the class was between two surrounding classes (see important note on `case sensitivity`).

			To illustrate the above rules, consider the following example...

			HTML - BEFORE
			..........................................................................................
			<!-- rule 1 example --> <div id="recommendationsPod"></div>
			<!-- rule 2 example --> <div id="commentsPod" class="podPopulated selected"></div>
			<!-- rule 3 example --> <div id="detailsPod" class="podPopulated selected featured"></div>
			..........................................................................................

			JAVASCRIPT
			...............................................................................
			Uize.Dom.Classes.toggleClass (['recommendationsPod','commentsPod'],'featured');
			...............................................................................

			HTML - AFTER
			...........................................................................................
			<!-- rule 1 example --> <div id="recommendationsPod" class="featured"></div>
			<!-- rule 2 example --> <div id="commentsPod" class="podPopulated selected featured"></div>
			<!-- rule 3 example --> <div id="detailsPod" class="podPopulated selected"></div>
			...........................................................................................

		Testing For a Class
			The presence of a CSS class in a node's =className= property can be tested for by using the =Uize.Dom.Classes.hasClass= static method.

			The =Uize.Dom.Classes.hasClass= method will return the value =true= if the class is present, and the value =false= if the class is not present (or if the specified node does not exist). When testing for the presence of a class, matching is case sensitive (see important note on `case sensitivity`)

			EXAMPLE HTML
			...........................................................
			<div id="recommendationsPod" class="podPopulated featured">
				<!-- stuff -->
			</div>
			...........................................................

			EXAMPLE JAVASCRIPT
			...............................................................................
			var
				podIsSelected = Uize.Dom.Classes.hasClass ('recommendationsPod','selected'),
				podIsFeatured = Uize.Dom.Classes.hasClass ('recommendationsPod','featured')
			;
			...............................................................................

			In the above example, after the above JavaScript code has executed, the value of the =podIsSelected= variable will be =false=, and the value of the =podIsFeatured= variable will be =true=.

		State Related Methods
			Beyond simply adding, removing, and toggling CSS classes in the =className= property of nodes, the =Uize.Dom.Classes= module introduces a powerful, higher level construct called a state.

			Presence or Absence State
				Typically, when you're adding, removing, or toggling CSS classes for a DOM node, what you're really trying to do is have the node reflect some state in your application.

				Often you will have a variable or a property of an object instance that will carry some important state, and you will want to update the =className= of a node (or multiple nodes) to reflect that state. Now, your code may not know or trust what the current state of the =className= property of a node might be, so it may test first to see if a class should be added or removed. You might write code as follows...

				CONDITIONALIZED TOGGLE
				...................................................................................
				if (podIsSelected != Uize.Dom.Classes.hasClass ('recommendationsPod','selected')) {
					Uize.Dom.Classes.toggleClass ('recommendationsPod','selected');
				}
				...................................................................................

				In the above example, whenever the value of the =podIsSelected= variable is =true=, then the CSS class called "selected" should be present in the node with the =id= of ='recommendationsPod'=. When =podIsSelected= is =false=, then the "selected" class should be absent. In order to synchronize the DOM node's =className= property to correctly reflect the application state, some code must perform an update. In the update code, the code is first testing to see if the presence of the CSS class called "selected" *does not* match what the desired state should be. If it doesn't, then something must be done to make it match the desired state, so the CSS class is toggled (because its presence is the opposite of what it should be).

				An alternative to the conditionalized toggling approach is a conditionalized add or remove approach, as shown below...

				CONDITIONALIZED ADD OR REMOVE
				..................................................................
				if (podIsSelected) {
					Uize.Dom.Classes.addClass ('recommendationsPod','selected');
				} else {
					Uize.Dom.Classes.removeClass ('recommendationsPod','selected');
				}
				..................................................................

				Of course, you could get even more fancy with conditionalizing which static method to call, using a ternary operator, as follows...

				FANCY CONDITIONALIZED ADD OR REMOVE
				...............................................................
				Uize.Dom.Classes [podIsSelected ? 'addClass' : 'removeClass'] (
					'recommendationsPod',
					'selected'
				);
				...............................................................

				Well, whichever way you might write it, the =Uize.Dom.Classes= module reduces the above pattern to a more concise and conceptually elegant form with the help of the =Uize.Dom.Classes.setState= static method, as follows...

				..........................................................................
				Uize.Dom.Classes.setState ('recommendationsPod','selected',podIsSelected);
				..........................................................................

				The =Uize.Dom.Classes.setState= method takes three parameters: the node (or nodes) for which state should be set, the state class or classes (see `Multiple State Classes`), and the state value. In the above usage, calling the =Uize.Dom.Classes.setState= method will set the presence of the "selected" CSS class, based upon the value of the =podIsSelected= variable. If the value of =podIsSelected= is =false=, then the class will be removed. If the value of =podIsSelected= is =true=, then the class will be added.

			Multiple State Classes
				The `state related methods` become far more compelling and powerful when you consider their support for multiple state classes and what that means for managing CSS classes for DOM nodes.

				In the simplest use of the =Uize.Dom.Classes.setState= method, the presence state of a single class can be controlled with a specified boolean value. This is in fact, however, a special case of a booean, two CSS class state where the first class (for the =false= value of the state) is an empty string and the second class (for the =true= value of the state) is the CSS class you specified. So, the following two statements are equivalent...

				EQUIVALENT STATEMENTS
				...............................................................................
				Uize.Dom.Classes.setState ('recommendationsPod','selected',podIsSelected);
				Uize.Dom.Classes.setState ('recommendationsPod',['','selected'],podIsSelected);
				...............................................................................

				So, what if a node should have one CSS class if a state's value is =false=, and a different CSS class if the state's value is =true=? This is accomplished quite easily. Consider an example where there is an =enabled= state variable in your application, whose value should be reflected in some node. When your =enabled= variable is =false=, then the node's =className= property should contain the CSS class "disabled". When your =enabled= variable is =true=, then the node's =className= property should contain the CSS class "enabled". Using the =Uize.Dom.Classes.setState= method's support for `multiple state classes`, the update code is made quite simple, as follows...

				STATE UPDATE WITH TWO STATE CLASSES
				................................................................................
				Uize.Dom.Classes.setState ('recommendationsPod',['disabled','enabled'],enabled);
				................................................................................

				In the above statement, the value of the =enabled= variable is being passed as the state value in the call to the =Uize.Dom.Classes.setState= method. The =false= and =true= values of the state are mapped to the state classes ='disabled'= and ='enabled'=. For the state value =false=, the class ='disabled'= should be present and the class ='enabled'= should be absent. For the state value =true=, the opposite should be the case. The =Uize.Dom.Classes.setState= method does whatever is necessary to ensure that the correct state class is in the =className= property, removing and adding classes as needed. To perform this same kind of update without the =Uize.Dom.Classes.setState= method would be a little bit more laborious, as follows...

				LABORIOUS APPROACH
				..................................................................
				if (enabled) {
					Uize.Dom.Classes.removeClass ('recommendationsPod','disabled');
					Uize.Dom.Classes.addClass ('recommendationsPod','enabled');
				} else {
					Uize.Dom.Classes.removeClass ('recommendationsPod','enabled');
					Uize.Dom.Classes.addClass ('recommendationsPod','disabled');
				}
				..................................................................

				You could reduce the above code down using some fancy tricks and avoid using the =Uize.Dom.Classes.setState= method, but the =Uize.Dom.Classes.setState= method makes things more semantically elegant.

				More Than Two State Classes
					The `state related methods` become even more compelling when you consider their support for more than two state classes.

					There may be situations where a state is not binary, and having two CSS classes mapped to the state will not suffice. Consider the example where a DOM node may need to be styled to reflect an error level, where the first error level is no error, the second level is a non-critical warning type error, and the third level is a critical, fatal, or blocking error. In this situation, your application may have a state variable called =errorLevel=, whose value can be =0=, =1=, or =2=, and where the value =0= should be mapped to the state class =''= (empty string), the value =1= should be mapped to the state class ='warning'=, and the value =2= should be mapped to the state class ='error'=.

					Fortunately, the `state related methods` support `multiple state classes` specified in array form. So, our updater code would look as follows...

					STATE UPDATE WITH THREE STATE CLASSES
					...................................................................................
					Uize.Dom.Classes.setState ('recommendationsPod',['','warning','error'],errorLevel);
					...................................................................................

					In another three state classes example, consider a text input element whose =className= property should contain a CSS class to reflect the validation status of the text entered by the user. The three levels for validation state are: 1) the text has not yet been validated, 2) the text has been validated and has failed validation, and 3) the text has been validated and has passed validation. The application may have a =validationStatus= variable, where the value =0= indicates not yet validated, the value =-1= indicates failed validation, and the value =1= indicates passed validation. We want the value =0= to map to the state class =''= (empty string), the value =-1= to map to the state class =valueBad=, and the value =1= to map to the state class =valueGood=. Our updater code would look as follows...

					STATE UPDATE WITH STATE VALUE OFFSET
					.....................................................................................
					Uize.Dom.Classes.setState ('phone',['valueBad','','valueGood'],validationStatus + 1);
					.....................................................................................

					Notice how we are adding =1= to the value of the =validationStatus= variable when calling the =Uize.Dom.Classes.setState= method and how the empty string state class is now in the middle of the state classes array.

			Setting State
				State can be reflected with CSS classes in the =className= property of one or more DOM nodes using the =Uize.Dom.Classes.setState= static method.

				EXAMPLE
				................................................................................
				Uize.Dom.Classes.setState ('recommendationsPod',['disabled','enabled'],enabled);
				................................................................................

				In the above example, the value of the =enabled= variable will determine whether the CSS class ='enabled'= or the CSS class ='disabled'= will be present in the =className= property of the node with the =id= of ='recommendationsPod'=. If the value of the =enabled= variable is =false=, then the ='enabled'= class will be removed and the ='disabled'= class will be added. Conversely, if the value of the =enabled= variable is =true=, then the ='disabled'= class will be removed and the ='enabled'= class will be added.

				The =Uize.Dom.Classes.setState= method, along with the other state related methods, supports `multiple state classes`.

			Getting State
				As with `setting state` for CSS classes using the =Uize.Dom.Classes.setState= static method, the current value for a state can be determined from the =className= property of a node using the =Uize.Dom.Classes.getState= static method.

				EXAMPLE
				......................................................................................
				var enabled = Uize.Dom.Classes.getState ('recommendationsPod',['disabled','enabled']);
				......................................................................................

				In the above example, the value of the =enabled= variable will be determined by whether the CSS class ='enabled'= or the CSS class ='disabled'= is present in the =className= property of the node with the =id= of ='recommendationsPod'=. If the =className= property contains the class ='disabled'=, then the =enabled= variable will be set to =false=. Conversely, if the =className= property contains the class ='enabled'=, then the =enabled= variable will be set to =true=.

				The =Uize.Dom.Classes.getState= method, along with the other state related methods, supports `multiple state classes`.

			Toggling State
				State that is reflected with CSS classes in the =className= property of one or more DOM nodes can be toggled (or cycled, for more than two state classes) using the =Uize.Dom.Classes.toggleState= static method.

				EXAMPLE
				...........................................................................
				Uize.Dom.Classes.toggleState ('recommendationsPod',['disabled','enabled']);
				...........................................................................

				In the above example, whichever of the two CSS classes ='disabled'= or ='enabled'= is present in the =className= property of the node with the =id= of ='recommendationsPod'= will be replaced with the other. So, if the =className= property contains the class ='disabled'=, then it will be replaced with the class ='enabled'=. Conversely, if the =className= property contains the class ='disabled'=, then it will be replaced with the class ='enabled'=. If the =className= property contains neither of the classes ='disabled'= or ='enabled'=, then the first of the state classes (i.e. ='disabled'=) will be added.

				The =Uize.Dom.Classes.toggleState= method, along with the other state related methods, supports `multiple state classes`.

				Toggling State With More Than Two State Classes
					When a state is represented by more than two state classes, then the =Uize.Dom.Classes.toggleState= method will cycle through the state classes.

					When cycling through `multiple state classes`, the =Uize.Dom.Classes.toggleState= method follows these basic rules...

					+. If none of the state classes are present in the node's =className= property, then the first of the state classes will be appended, with a single space separating it from the other classes (if present).
					+. If any of the state classes other than the last of the state classes is present in the node's =className= property, then it will be replaced with the next state class in the list.
					+. If the last of the state classes is present in the node's =className= property, then it will be replaced with the first state class in the list (i.e. wrapping around).

					To illustrate the above rules, consider the following example...

					HTML - BEFORE
					........................................................................
					<!-- rule 1 example --> <input id="input1" type="text"/>
					<!-- rule 2 example --> <input id="input2" type="text" class="warning"/>
					<!-- rule 3 example --> <input id="input3" type="text" class="error"/>
					........................................................................

					JAVASCRIPT
					...................................................................................
					Uize.Dom.Classes.toggleState (['input1','input2','input3'],['','warning','error']);
					...................................................................................

					HTML - AFTER
					........................................................................
					<!-- rule 1 example --> <input id="input1" type="text" class="warning"/>
					<!-- rule 2 example --> <input id="input2" type="text" class="error"/>
					<!-- rule 3 example --> <input id="input3" type="text"/>
					........................................................................

			Removing State
				State classes associated with a state can be removed from the =className= property of one or more DOM nodes using the =Uize.Dom.Classes.removeState= static method.

				Removing a state is distinct from `setting state` and `toggling state` - removing a state for a node makes it so that the state no longer applies for that node. When removing a state, the =Uize.Dom.Classes.removeState= method follows these basic rules...

				+. If the =className= property is empty, then it will simply remain empty.
				+. If the =className= property is not empty, but none of the state classes for the state being removed are present, then the =className= property will remain unchanged.
				+. If one of the state classes for the state being removed is present in the =className= property, then it will be removed along with any surrounding whitespace, while leaving the trailing whitespace if the class was between two surrounding classes.

				To illustrate the above rules, consider the following example...

				HTML - BEFORE
				.......................................................................................
				<!-- rule 1 example --> <input id="input1" type="text"/>
				<!-- rule 2 example --> <input id="input2" type="text" class="focused"/>
				<!-- rule 3 example --> <input id="input3" type="text" class="focused error required"/>
				.......................................................................................

				JAVASCRIPT
				...................................................................................
				Uize.Dom.Classes.removeState (['input1','input2','input3'],['','warning','error']);
				...................................................................................

				HTML - AFTER
				.................................................................................
				<!-- rule 1 example --> <input id="input1" type="text"/>
				<!-- rule 2 example --> <input id="input2" type="text" class="focused"/>
				<!-- rule 3 example --> <input id="input3" type="text" class="focused required"/>
				.................................................................................

				The =Uize.Dom.Classes.removeState= method, along with the other state related methods, supports `multiple state classes`.

		Important Considerations
			When working with CSS classes using the methods of the =Uize.Dom.Classes= module, there are some important considerations to keep in mind.

			Case Sensitivity
				When matching CSS classes against the value of a node's =className= property, the methods of the =Uize.Dom.Classes= module perform case sensitive matching.

				To illustrate this, consider the following example...

				HTML - BEFORE
				....................................................
				<div id="recommendationsPod" class="SELECTED"></div>
				<div id="commentsPod" class="SELECTED"></div>
				<div id="detailsPod" class="SELECTED">
				....................................................

				JAVASCRIPT
				............................................................
				Uize.Dom.Classes.addClass ('recommendationsPod','selected');
				Uize.Dom.Classes.removeClass ('commentsPod','selected');
				Uize.Dom.Classes.toggleClass ('detailsPod','selected');
				............................................................

				HTML - AFTER
				.............................................................
				<div id="recommendationsPod" class="SELECTED selected"></div>
				<div id="commentsPod" class="SELECTED"></div>
				<div id="detailsPod" class="SELECTED selected">
				.............................................................

				This case sensitivity rule applies equally to the `state related methods`.

			Whitespace Handling
				When adding, replacing, or removing classes from the =className= property of a node, the methods of the =Uize.Dom.Classes= module observe certain principles regarding whitespace.

				Minimal Whitespace Added When Adding Classes
					When a class needs to be added by a =Uize.Dom.Classes= method, it will be appended to the =className= property, with a single space separating it from the other classes (if present).

				Whitespace Respected When Replacing Classes
					When replacing classes in the =className= property of a node, the methods of the =Uize.Dom.Classes= module will respect existing whitespace separating classes.

					This means that if a class is separated from surrounding classes by tabs, newlines, or multiple spaces, then that whitespace separation will be retained when the class is replaced with a different class. The exception to this rule is where the new class is the empty string (see `No Whitespace Bloat When Removing Classes`).

				No Whitespace Bloat When Removing Classes
					In the case where a class is being removed by one of the =Uize.Dom.Classes= methods and the class is surrounded by other classes, the trailing whitespace that separates the class being removed from the next class will be retained, while the whitespace that separates it from the previous class will be lost.

					This behavior avoids whitespace bloat that might otherwise occur if all surrounding whitespace were retained when classes are repeatedly removed and added for a node.
*/

Uize.module ({
	name:'Uize.Dom.Classes',
	required:'Uize.Dom.Basics',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_isNode = _Uize_Dom_Basics.isNode,
				_getById = _Uize_Dom_Basics.getById,
				_doForAll = _Uize_Dom_Basics.doForAll,

			/*** references to static methods used internally ***/
				_getState,
				_setState,

			/*** General Variables ***/
				_classesProfiles = {},
				_arrayWithEmptyString = ['']
		;

		/*** Utility Functions ***/
			function _getClassesProfile (_classes) {
				var
					_classesProfileKey = _classes + '',
					_classesProfile = _classesProfiles [_classesProfileKey]
				;
				if (!_classesProfile && _classesProfileKey) {
					(_classes = _classesProfileKey.split (',')).length == 1 && _classes.unshift ('');
					var
						_classesRegExpStr =
							'\\b(?:' + _classes.join ('|').replace (/\|{2,}/g,'|').replace (/^\||\|$/g,'') + ')\\b',
						_classToStateMap = {'':-1},
						_classesLength = _classes.length
					;
					for (var _classNo = _classesLength; --_classNo > -1;)
						_classToStateMap [_classes [_classNo]] = _classesLength > 2 ? _classNo : !!_classNo
					;
					_classesProfile = _classesProfiles [_classesProfileKey] = {
						_classes:_classes,
						_matchClassRegExp:new RegExp (_classesRegExpStr),
						_matchClassAndPaddingRegExp:new RegExp ('(\\s*)' + _classesRegExpStr + '(\\s*)'),
						_classToStateMap:_classToStateMap
					};
				}
				return _classesProfile;
			}

			function _toggleState (_nodeBlob,_classes) {
				var _classesProfile = _getClassesProfile (_classes);
				if (_classesProfile) {
					_classes = _classesProfile._classes;
					_doForAll (
						_nodeBlob,
						function (_node) {
							_setState (_node,_classes,(_getState (_node,_classes) + 1) % _classes.length);
						}
					);
				}
			}

		return Uize.package ({
			getState:_getState = function (_node,_classes) {
				var _result = -1;
				if (_isNode (_node = _getById (_node))) {
					var _classesProfile = _getClassesProfile (_classes);
					if (_classesProfile)
						_result = _classesProfile._classToStateMap [
							(_node.className.match (_classesProfile._matchClassRegExp) || _arrayWithEmptyString) [0]
						]
					;
				}
				return _result;
				/*?
					Static Methods
						Uize.Dom.Classes.getState
							Returns a boolean or integer (a value of the type =stateBOOLorINT=), indicating the current state for the specified state classes.

							SYNTAX
							.................................................................................
							stateBOOLorINT = Uize.Dom.Classes.getState (nodeSTRorOBJ,stateClassesSTRorARRAY);
							.................................................................................

							For a more detailed discussion and to see examples, see the section `Getting State`.

							NOTES
							- see the companion =Uize.Dom.Classes.setState=, =Uize.Dom.Classes.toggleState=, and =Uize.Dom.Classes.removeState= static methods
				*/
			},

			hasClass:function (_node,_class) {
				return _getState (_node,_class) == 1;
				/*?
					Static Methods
						Uize.Dom.Classes.hasClass
							Returns a boolean, indicating whether or not the specified node's =className= property contains the specified CSS class.

							SYNTAX
							.................................................................
							hasClassBOOL = Uize.Dom.Classes.hasClass (nodeSTRorOBJ,classSTR);
							.................................................................

							For a more detailed discussion and to see examples, see the section `Testing For a Class`.

							NOTES
							- see the related =Uize.Dom.Classes.addClass=, =Uize.Dom.Classes.toggleClass=, and =Uize.Dom.Classes.removeClass= static methods
							- see also the =Uize.Dom.Classes.getState= static method
				*/
			},

			setState:_setState = function (_nodeBlob,_classes,_state) {
				var _classesProfile = _getClassesProfile (_classes);
				if (!_classesProfile) return;
				var
					_newClass = (_classes = _classesProfile._classes) [+_state] || '',
					_nodeClassName
				;
				_doForAll (
					_nodeBlob,
					function (_node) {
						if ((_nodeClassName = _node.className) != _newClass) {
							if (_nodeClassName) {
								_node.className = _newClass
									? (
										_nodeClassName.replace (
											_classesProfile._matchClassRegExp,
											function () {return _newClass + (_newClass = '')}
										) + (_newClass && (' ' + _newClass))
									) : (
										_nodeClassName.replace (
											_classesProfile._matchClassAndPaddingRegExp,
											function (_match,_leadingWhitespace,_trailingWhitespace) {
												return _leadingWhitespace && _trailingWhitespace;
											}
										)
									)
								;
							} else {
								_node.className = _newClass;
							}
						}
					}
				);
				/*?
					Static Methods
						Uize.Dom.Classes.setState
							Updates the =className= property of the specified node(s), to contain the one CSS class out of the specified state classes that corresponds to the specified state.

							SYNTAX
							...........................................................................
							Uize.Dom.Classes.setState (nodeBLOB,stateClassesSTRorARRAY,stateBOOLorINT);
							...........................................................................

							For a more detailed discussion and to see examples, see the section `Setting State`.

							NOTES
							- see the companion =Uize.Dom.Classes.getState=, =Uize.Dom.Classes.toggleState=, and =Uize.Dom.Classes.removeState= static methods
				*/
			},

			removeState:function (_nodeBlob,_classes) {
				_setState (_nodeBlob,_classes,-1);
				/*?
					Static Methods
						Uize.Dom.Classes.removeState
							Updates the =className= property of the specified node(s), to no longer contain one of the specified state classes.

							SYNTAX
							...............................................................
							Uize.Dom.Classes.removeState (nodeBLOB,stateClassesSTRorARRAY);
							...............................................................

							For a more detailed discussion and to see examples, see the section `Removing State`.

							NOTES
							- see the companion =Uize.Dom.Classes.getState=, =Uize.Dom.Classes.setState=, and =Uize.Dom.Classes.toggleState= static methods
				*/
			},

			addClass:function (_nodeBlob,_class) {
				_setState (_nodeBlob,_class,1);
				/*?
					Static Methods
						Uize.Dom.Classes.addClass
							Adds the specified CSS class to the =className= property of the specified node(s), provided that the class name is not already present.

							SYNTAX
							..............................................
							Uize.Dom.Classes.addClass (nodeBLOB,classSTR);
							..............................................

							For a more detailed discussion and to see examples, see the section `Adding a Class`.

							NOTES
							- see the companion =Uize.Dom.Classes.removeClass= static method
							- see the related =Uize.Dom.Classes.hasClass= and =Uize.Dom.Classes.toggleClass= static methods
							- see also the =Uize.Dom.Classes.setState= static method
				*/
			},

			removeClass:function (_nodeBlob,_class) {
				_setState (_nodeBlob,_class,0);
				/*?
					Static Methods
						Uize.Dom.Classes.removeClass
							Removes the specified CSS class from the =className= property of the specified node(s), provided that the class is present.

							SYNTAX
							.................................................
							Uize.Dom.Classes.removeClass (nodeBLOB,classSTR);
							.................................................

							For a more detailed discussion and to see examples, see the section `Removing a Class`.

							NOTES
							- see the companion =Uize.Dom.Classes.addClass= static method
							- see the related =Uize.Dom.Classes.hasClass= and =Uize.Dom.Classes.toggleClass= static methods
							- see also the =Uize.Dom.Classes.setState= static method
				*/
			},

			toggleClass:_toggleState,
				/*?
					Static Methods
						Uize.Dom.Classes.toggleClass
							Toggles the presence of the specified CSS class in the =className= property of the specified node(s).

							SYNTAX
							.................................................
							Uize.Dom.Classes.toggleClass (nodeBLOB,classSTR);
							.................................................

							For a more detailed discussion and to see examples, see the section `Toggling a Class`.

							NOTES
							- see the related =Uize.Dom.Classes.addClass=, =Uize.Dom.Classes.hasClass=, and =Uize.Dom.Classes.removeClass= static methods
							- see the related =Uize.Dom.Classes.toggleState= static method
				*/

			toggleState:_toggleState
				/*?
					Static Methods
						Uize.Dom.Classes.toggleState
							Updates the =className= property of the specified node(s), to contain the one CSS class out of the specified state classes that corresponds to the state that is obtained from the specified node(s) and then advanced by one.

							SYNTAX
							...............................................................
							Uize.Dom.Classes.toggleState (nodeBLOB,stateClassesSTRorARRAY);
							...............................................................

							For a more detailed discussion and to see examples, see the section `Toggling State`.

							NOTES
							- see the companion =Uize.Dom.Classes.getState= and =Uize.Dom.Classes.setState= static methods
							- see the related =Uize.Dom.Classes.toggleClass= static method
				*/

			/*?
				Value Types
					For the sake of not redundantly describing the value types for certain method parameters and return values repeatedly, some common value types are described here.

					classSTR
						A string, specifying the name of a single CSS class.

						A =classSTR= value should be a valid CSS class name for a single class - it may not be a space separated list of multiple classes. Values of this type can be accepted by the =Uize.Dom.Classes.hasClass=, =Uize.Dom.Classes.addClass=, =Uize.Dom.Classes.removeClass=, and =Uize.Dom.Classes.toggleClass= static methods.

					stateBOOLorINT
						A boolean or integer, specifying a state that maps to one of the CSS classes specified in a =stateClassesSTRorARRAY= value.

						Values of this type can be accepted by the =Uize.Dom.Classes.setState= static method. Values of this type are returned by the =Uize.Dom.Classes.getState= static method. When a =stateBOOLorINT= value is specified along with a =stateClassesSTRorARRAY= value when calling the =Uize.Dom.Classes.setState= method, it can be a boolean or an integer, where the boolean value =false= is equivalent to the integer value =0=, and where the boolean value =true= is equivalent to the integer value =1=. The =stateClassesSTRorARRAY= value should not exceed the number of classes specified in a =stateClassesSTRorARRAY= value. If it does, then it will be "wrapped" around to become a value that is within range.

					stateClassesSTRorARRAY
						A comma-separated string or an array of strings, specifying a list of CSS classes that are to be mapped to a =stateBOOLorINT= type value.

						Values of this type can be accepted by the `state related methods` (=Uize.Dom.Classes.setState=, =Uize.Dom.Classes.getState=, =Uize.Dom.Classes.toggleState=, and =Uize.Dom.Classes.removeState=). A =stateClassesSTRorARRAY= value should generally specify two or more state classes, typically specifying just two (e.g. ='disabled,enabled'= or =['disabled','enabled']=).

						In the special case where only one state class is specified (e.g. ='enabled'= or =['enabled']=), it is implicit that the class specified is the second of two state classes where the first class is an empty string. Therefore, the string value ='enabled'= and the array value =['enabled']= would be equivalent to the values =',enabled'= and =['','enabled']=, respectively. This behavior provides a convenient shorthand for simple `presence or absence state` cases, where a specified single CSS class is to be mapped to the =true= value of a binary state (such as an enabled or selected state, for example), and where the =false= value is represented by the absence of that class.
			*/
		});
	}
});

