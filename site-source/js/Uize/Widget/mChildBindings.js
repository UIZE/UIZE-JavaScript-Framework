/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mChildBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 5
	codeCompleteness: 95
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.mChildBindings= mixin implements features to provide a declarative approach to binding the state properties of a widget to those of its children.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.mChildBindings',
	required:'Uize.Class.mChildObjectBindings',
	builder:function () {
		'use strict';

		return function (_class) {
			_class.declare ({
				mixins:Uize.Class.mChildObjectBindings,

				childObjectBindings:{
					declaration:'childBindings',
						/*?
							Static Methods
								Uize.Widget.mChildBindings.childBindings
									Lets you conveniently bind the state of a widget to that of its child widgets.

									SYNTAX
									.........................................
									MyWidgetClass.childBindings (bindingsOBJ);
									.........................................

									VERBOSE EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mChildBindings.subclass ({
										childBindings:{
											size:{
												child:'sizeWidget',
												property:'value',
												direction:'<->' // bi-directional changes (default),
												valueAdapter:{
													aToB:function(value) { return value * value },
													bToA:function(value) { return Math.sqrt(value) }
												},
												when:'!busyInherited,enabledInherited'
											},
											value:[ // parent-to-many-children
												{
													child:'valueWidget',
													direction:'->',
													valueAdapter:{
														aToB:'value * value' // via Uize.resolveValueTransformer
													},
													when:function() { }
												},
												{
													child:'valueWidget2',
													direction:'<-',
													valueAdapter:{
														bToA:'Math.sqrt(value)' // via Uize.resolveValueTransformer
													}
												}
											]
										}
									});
									......................................................

									SHORT-HAND EXAMPLE
									......................................................
									MyNamespace.MyWidgetClass = Uize.Widget.mChildBindings.subclass ({
										childBindings:{
											size:'<->sizeWidget.value:!busyInherited,enabledInherited',  // bi-directional changes with "value" state proprety in "sizeWidget" child
											value:[ // parent-to-many-children
												'->valueWidget:!busyInherited,enabledInherited', // changes to child only
												'<-valueWidget2' // changes from child only
											],
											values:'valuesWidget' // bi-directional changes with same-named state proprety in "valuesWidget" child
										}
									});
									......................................................
						*/
					instanceProperty:'children',
					addedInstanceProperty:'addedChildren',
					stateProperty:'children'
				}
			});
		};
	}
});
