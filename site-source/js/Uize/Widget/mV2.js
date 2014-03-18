/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mV2 Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 8
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.mV2= class implements the next generation widget base class and is currently under development.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mV2',
	required:[
		'Uize.Widget.mHtmlBindings',
		'Uize.Widget.mCssBindings',
		'Uize.Widget.mLoc'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize
		;

		return function (_class) {
			_class.declare ({
				mixins:[
					Uize.Widget.mHtmlBindings,
					Uize.Widget.mCssBindings,
					Uize.Widget.mLoc
				],

				instanceMethods:{
					addChildren:function (_children,_commonProperties) {
						for (var _childName in _children) {
							var
								_childProperties = _Uize.copy (_children [_childName],_commonProperties),
								_widgetClass = _childProperties.widgetClass
							;
							delete _childProperties.widgetClass;
							this.addChild (_childName,_widgetClass,_childProperties);
						}
						/*?
							Instance Methods
								addChildren
									Lets you conveniently add multiple child widgets in a single method call, by specifying the children in an object that maps child names to child properties.

									DIFFERENT USAGES

									`Add Multiple Child Widgets`
									.....................................
									myInstance.addChildren (childrenOBJ);
									.....................................

									`Add Multiple Child Widgets, Specifying Properties That Are Common to All`
									.........................................................
									myInstance.addChildren (childrenOBJ,commonPropertiesOBJ);
									.........................................................

									Add Multiple Child Widgets
										Multiple child widgets can be added in a single call, by specifying a single =childrenOBJ= parameter.

										SYNTAX
										.....................................
										myInstance.addChildren (childrenOBJ);
										.....................................

										The value of the =childrenOBJ= parameter should be an object, where the name of a property should be the name of a child widget, and where the value of a property should be an object specifying values for a child widget's state properties. The widget class for a child widget should be specified using the special =widgetClass= widget property.

										EXAMPLE
										......................................
										this.addChildren ({
											ok:{
												text:'OK',
												widgetClass:Uize.Widgets.Button,
												size:'small'
											},
											cancel:{
												text:'CANCEL',
												widgetClass:Uize.Widgets.Button,
												size:'small'
											},
											reset:{
												text:'RESET',
												widgetClass:Uize.Widgets.Button,
												size:'small'
											}
										});
										......................................

										In the above example, the =addChildren= method is being used to add three button child widgets.

									Add Multiple Child Widgets, Specifying Properties That Are Common to All
										Multiple child widgets can be added in a single call, without repeating widget property values that are common to all children being added, by specifying the common property values in the optional =commonPropertiesOBJ= parameter.

										SYNTAX
										.........................................................
										myInstance.addChildren (childrenOBJ,commonPropertiesOBJ);
										.........................................................

										EXAMPLE
										......................................
										this.addChildren (
											{
												ok:{text:'OK'},
												cancel:{text:'CANCEL'},
												reset:{text:'RESET'}
											},
											{
												widgetClass:Uize.Widgets.Button,
												size:'small'
											}
										);
										......................................

										In the above example, the =addChildren= method is being used to add three button child widgets of the same =Uize.Widgets.Button= widget class and with the same ='small'= value for their =size= state property. Because the widget class and size are the same for all the buttons being added, these values can be specified using the optional =commonPropertiesOBJ= parameter so that the values don't need to be repeated in the child properties object for each of the child widgets.

									More Concise
										Using the =addChildren= method can produce more concise code in situations where you are adding multiple child widgets that share some common properties.

										Consider the following example of adding multiple button child widgets...

										INSTEAD OF...
										.......................
										this.addChild (
											'ok',
											Uize.Widgets.Button,
											{
												text:'OK',
												size:'small'
											}
										);

										this.addChild (
											'cancel',
											Uize.Widgets.Button,
											{
												text:'CANCEL',
												size:'small'
											}
										);

										this.addChild (
											'reset',
											Uize.Widgets.Button,
											{
												text:'RESET',
												size:'small'
											}
										);
										.......................

										USE...
										......................................
										this.addChildren (
											{
												ok:{text:'OK'},
												cancel:{text:'CANCEL'},
												reset:{text:'RESET'}
											},
											{
												widgetClass:Uize.Widgets.Button,
												size:'small'
											}
										);
										......................................

										In the above example, we are adding multiple button child widgets of the same widget class and of the same size (as specified in the =size= state property). Rather than calling the =addChild= method multiple times, each time passing the same common property values, we can use the =addChildren= method and tale advantage of its optional =commonPropertiesOBJ= parameter to avoid having to repeat the property values that are common to all the button child widgets.

									NOTES
									- compare to the companion =addChild= instance method
						*/
					},

					childHtml:function (_properties) {
						var
							m = this,
							_childName =
								_properties.name ||
								(
									'generatedChildName' +
									(m.mV2_generatedChildNames == _undefined ? (m.mV2_generatedChildNames = 0) : m.mV2_generatedChildNames++)
								),
							_widgetClass = _Uize.getModuleByName (_properties.widgetClass) || _class,
							_widgetClassName = _widgetClass.moduleName,
							_children = m.children
						;

						delete _properties.name;
						delete _properties.widgetClass;

						var
							_inlineState = _Uize.copy (_properties),
							_html = '',
							_child = _children [_childName],
							_childExisted = !!_child
						;
						_child
							? _child.set (_properties)
							: (_child = m.addChild (_childName,_widgetClass,_properties))
						;
						_html = _child.get ('built')
							? _child.getHtml ()
							: '<div id="' + _child.nodeId ('shell') + '"></div>'
						;
						_childExisted ||
							_Uize.copyInto (_inlineState,{widgetClass:_widgetClassName})
						;
						if (!_Uize.isEmpty (_inlineState))
							_child.inlineState = _inlineState
						;
						return _html;
						/*?
							Instance Methods
								childHtml
									Returns the HTML for a child widget that can then be inserted into the HTML for the widget.

									SYNTAX
									......................................................
									childHtml = myInstance.childHtml (childPropertiesOBJ);
									......................................................

									The =childHtml= method is intended primarily for use within the HTML generator (usually a JST template) for a widget.
						*/
					},

					superHtml:function (_input,_extraInput) {
						return this.Class.superclass.get ('html').process.call (this,_Uize.copy (_input,_extraInput));
					}
				},

				treeInheritedStateProperties:{
					size:{value:'medium'}
				},

				cssBindings:{
					sizeInherited:'value'
				},

				set:{
					html:{
						process:function () {
							var
								m = this,
								_children = m.children,
								_htmlChunks = [],
								_htmlChunksLength = 0
							;
							for (var _childName in _children)
								_htmlChunks [_htmlChunksLength++] = _children [_childName].getHtml ()
							;
							return '<div id="' + m.nodeId () + '">' + _htmlChunks.join ('') + '</div>';
						}
					}
				}
			});
		};
	}
});

