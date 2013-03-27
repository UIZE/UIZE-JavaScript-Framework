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

		*DEVELOPERS:* `Chris van Rensburg`
*/

/* TO DO
	- inserting UI should ensure that CSS is added to page
	- implement nodeId method
	- implement cssClass method
	- refactor buildHtml method to use new getHtml method
*/

Uize.module ({
	name:'Uize.WidgetV2',
	required:[
		'Uize.Json',
		'Uize.Node'
	],
	superclass:'Uize.Widget',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined = undefined;

		/*** Utility Functions ***/
			function _cssClassPrefixFromModuleName (_moduleName) {
				return _moduleName.replace (/\./g,'_');
			}

			function _cssClassPrefixFromModule (_module) {
				return _module._classPrefix || (_module._classPrefix = _cssClassPrefixFromModuleName (_module.moduleName));
			}

			function _cssClassNameGeneratorFromModules (_modules) {
				var _classNameGeneratorStr = '';
				for (var _moduleNo = -1, _modulesLength = _modules.length; ++_moduleNo < _modulesLength;)
					_classNameGeneratorStr +=
						(_classNameGeneratorStr && ' + \' \' + ') +
						'\'' + _cssClassPrefixFromModule (_modules [_moduleNo]) + '\' + classSuffix'
				;
				return new Function (
					'nodeName',
					'var classSuffix = (nodeName || \'\') && \'-\' + nodeName;' +
					'return ' + _classNameGeneratorStr + ';'
				);
			}

		var _class = _superclass.subclass ({
			instanceMethods:{
				childHtml:function (_properties) {
					var
						_this = this,
						_childName = _properties.name,
						_widgetClass = Uize.getModuleByName (_properties.widgetClass) || _class,
						_widgetClassName = _widgetClass.moduleName,
						_children = _this.children
					;

					delete _properties.name;
					delete _properties.widgetClass;

					var _suppliedState = Uize.copy (_properties);

					/*** if child name not specified, generate one using widget class module name ***/
						if (!_childName) {
							_this._generatedChildNames || (_this._generatedChildNames = 0);
							_childName = 'generatedChildName' + _this._generatedChildNames++;
						}

					var
						_html = '',
						_child = _children [_childName],
						_childExisted = !!_child
					;
					_child
						? _child.set (_properties)
						: (_child = _this.addChild (_childName,_widgetClass,_properties))
					;
					_html = _child.get ('built')
						? _child.getHtml ()
						: '<div id="' + _child.nodeId ('shell') + '"></div>'
					;
					_childExisted ||
						Uize.copyInto (_suppliedState,{widgetClass:_widgetClassName})
					;
					if (!Uize.isEmpty (_suppliedState))
						_html +=
							'<script type="text/javascript">\n' +
								'$' + _child.get ('idPrefix') + ' = ' +
									Uize.Json.to (_suppliedState) +
								';\n' +
							'</script>'
					;

					return _html;
				},

				nodeId:function (_nodeId) {
					return Uize.Node.joinIdPrefixAndNodeId (this.get ('idPrefix'),_nodeId || '');
				},

				cssClass:function (_className) {
					var _thisClass = this.Class;
					if (!_thisClass._cssClassNameGenerator) {
						var
							_inheritanceChain = [],
							_module = _thisClass
						;
						while (_module) {
							_inheritanceChain.unshift (_module);
							if (_module == _class) break;
							_module = _module.superclass;
						}
						_thisClass._cssClassNameGenerator = _cssClassNameGeneratorFromModules (_inheritanceChain);
					}
					return _thisClass._cssClassNameGenerator (_className);
				}
			}
		});

		return _class;
	}
});

