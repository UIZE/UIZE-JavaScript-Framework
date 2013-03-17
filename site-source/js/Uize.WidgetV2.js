/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.WidgetV2 Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.WidgetV2= class implements the next generation widget base class and is currently under development.

		*DEVELOPERS:* `Chris van Rensburg`, `Ben Ilegbodu`, `Vinson Chuong`
*/

/* TO DO
	- inserting UI should ensure that CSS is added to page
	- implement a getHtml method that would...
		- provide methods, as part of template input, to support...
			- recursive inclusion of HTML from child widgets
			- adding namespace to CSS class names
			- adding id prefix to DOM node id's
	- refactor buildHtml method to use new getHtml method
*/

Uize.module ({
	name:'Uize.WidgetV2',
	superclass:'Uize.Widget',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined = undefined;

		var _class = _superclass.subclass ({
			instanceMethods:{
				childHtml:function (_properties) {
					var
						_this = this,
						_childName = _properties.name,
						_widgetClass = _properties.widgetClass || _class,
						_widgetClassName = Uize.getModuleByName (_widgetClass).moduleName,
						_children = _this.children
					;

					delete _properties.name;
					delete _properties.widgetClass;

					var _suppliedState = Uize.copyInto ({},_properties);

					/*** if child name not specified, generate one using widget class module name ***/
						if (!_childName) {
							var _generatedChildNamesPerModule =
								_this._generatedChildNamesPerModule || (_this._generatedChildNamesPerModule = {})
							;
							if (_generatedChildNamesPerModule [_widgetClassName] == _undefined)
								_generatedChildNamesPerModule [_widgetClassName] = 0
							;
							_childName =
								_widgetClassName.replace (/\./g,'_') + '_' + _generatedChildNamesPerModule [_widgetClassName]++
							;
						;

					var
						_html = '',
						_child = _children [_childName],
						_childExisted = !!_child
					;
					_child
						? _child.set (_properties)
						: (_child = _this.addChild (_childName,_widgetClass,_properties))
					;
					if (_child.get ('built')) {
						_html = '<div id="' + _child.nodeId ('shell') + '"></div>';
					} else {
						_html = _child.getHtml ();
					}
					if (_childExisted) {
						if (!Uize.isEmpty (_suppliedState))
							_html +=
								'<script type="text/javascript">\n' +
									'// declarative syntax for widget properties code\n' +
								'</script>'
						;
					} else {
						_html +=
							'<script type="text/javascript">\n' +
								'// widget adoption declaration\n' +
							'</script>'
						;
					}

					return _html;
				},

				nodeId:function (_nodeName) {
				},

				cssClass:function (_className) {
				}
			}
		});

		return _class;
	}
});

