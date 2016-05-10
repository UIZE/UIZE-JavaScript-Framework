/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mEventBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 7
	codeCompleteness: 100
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mEventBindings= mixin implements features to provide a declarative approach to wiring Uize events on widgets and their children, as well as DOM events on DOM nodes.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.mEventBindings',
	required:'Uize.Class.mChildObjectEventBindings',
	builder:function () {
		'use strict';

		return function (mClass) {
			mClass.declare ({
				mixins:Uize.Class.mChildObjectEventBindings,
				childObjectEventBindings:{
					declaration:'eventBindings',
						/*?
							Static Methods
								Uize.Widget.mEventBindings.eventBindings
									Lets you conveniently wire events on the widget instance, its children and its DOM nodes.

									SYNTAX
									.........................................
									MyWidgetClass.eventBindings (bindingsOBJ);
									.........................................

									VERBOSE EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mEventBindings.subclass ({
										eventBindings:{
											'#menu':{ // DOM node
												click:function (event, sourceNode) { },
												mouseover:{
													handler:function(_event, sourceNode) { },
													fireIf:'busyInherited'
												}
											},
											'sliderG':{ // child widget
												'Changed.value':function (event, sourceWidget) { },
												Update:function(_event, sourceWidget) { }
											},
											'':{ // self
												'Changed.value':function (event) { },
												Update:{
													handler:function(_event) { },
													required:'sliderG'
												}
											}
										}
									});
									......................................................

									SHORT-HAND EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mEventBindings.subclass ({
										eventBindings:{
											'#menu:click':function(event, sourceNode) { },
											'#menu:mouseover':{
												handler:function(event, sourceNode) { },
												fireIf:'busyInherited'
											},
											'sliderG:Changed.value':function (_event, sourceWidget) { },
											'sliderG:Update':function(event, sourceWidget) { },
											':Changed.value':function (event) { },
											':Update':{
												handler:function(event) { },
												required:['sliderG']
											}
										}
									});
									......................................................

									NOTES
									- You cannot use =Uize.Widget.mEventBindings.eventBindings= to wire events that have colons (=:=) in their names
						*/
					instanceProperty:'children',
					addedInstanceProperty:'addedChildren',
					additionalTypes:{
						dom:{
							namePrefix:'#',
							wireWhenever:'wired',
							getObjectMethod:'getNode',
							wireObjectMethod:'wireNode',
							defaultFireIf:'enabledInherited,!busyInherited'
						}
					}
				}
			});
		};
	}
});
