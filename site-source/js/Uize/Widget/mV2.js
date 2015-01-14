/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mV2 Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
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
		'Uize.Widget.mChildrenLinked',
		'Uize.Widget.mEventBindings',
		'Uize.Widget.mChildBindings',
		'Uize.Widget.mDeclarativeChildren',
		'Uize.Widget.mLoc'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_Uize_Widget = _Uize.Widget
		;

		return function (_class) {
			_class.declare ({
				mixins:[
					_Uize_Widget.mHtmlBindings,
					_Uize_Widget.mCssBindings,
					_Uize_Widget.mChildrenLinked,
					_Uize_Widget.mEventBindings,
					_Uize_Widget.mChildBindings,
					_Uize_Widget.mDeclarativeChildren,
					_Uize_Widget.mLoc
				],

				instanceMethods:{
					childHtml:function (_properties) {
						var
							m = this,
							_childName =
								_properties.name ||
								('generatedChildName' + (m.mV2_generatedChildNames = (m.mV2_generatedChildNames || 0) + 1)),
							_widgetClass = _Uize.getModuleByName (_properties.widgetClass),
							_child = m.children [_childName],
							_html = ''
						;
						if (_child || _widgetClass) {
							_properties = _Uize.copy (_properties);
							delete _properties.name;
							delete _properties.widgetClass;
							_child
								? _child.set (_properties)
								: (_child = m.addChild (_childName,_widgetClass,_properties))
							;
							_html = _child.get ('built')
								? _child.getHtml ()
								: '<div id="' + m.nodeId (_childName) + '"></div>'
							;
						}
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
					html:''
				}
			});
		};
	}
});

