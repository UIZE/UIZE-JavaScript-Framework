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
		'Uize.Widget.mEventBindings',
		'Uize.Widget.mDeclarativeChildren',
		'Uize.Widget.mLoc'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_Uize_Widget = _Uize.Widget
		;

		return function (_class) {
			_class.declare ({
				mixins:[
					_Uize_Widget.mHtmlBindings,
					_Uize_Widget.mCssBindings,
					_Uize_Widget.mEventBindings,
					_Uize_Widget.mDeclarativeChildren,
					_Uize_Widget.mLoc
				],

				instanceMethods:{
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
				}
			});
		};
	}
});

