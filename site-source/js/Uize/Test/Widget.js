/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Test.Widget= module provides convenience methods for writing test cases against =Uize.Widget= subclass modules.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Test.Widget',
	superclass:'Uize.Test.Class',
	required:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		var
			_Uize = Uize,

			_superclass_getInstance = _superclass.getInstance,
			_document,
			_getMockDomNode
		;

		return _superclass.subclass({
			staticMethods:{
				getDocument:function() {
					return _document
						|| (_document =
							this.getMockDomNode(
								'document',
								{
									tagName:undefined,
									nodeType:9,
									body:_getMockDomNode('body', {tagName:'BODY'}),
									documentElement:_getMockDomNode('html', {tagName:'HTML'})
								},
								{
									getElementById:function(_id) {
										throw {
											name:'Mock DOM node Exception',
											message:'Trying to get DOM node #' + _id
											+ '. Create a mock node or use a method spy.'
										};
									}
								}
							)
						)
					;
				},
				getInstance:function(_instanceProperties, _nodes) {
					var _testClass = this;
					return _superclass_getInstance.call (
						_testClass,
						_Uize.copyInto(
							{
								idPrefix:'widget',
								nodeMap:_Uize.map(
									_nodes,
									function(_properties, _nodeName) {
										return _getMockDomNode(_nodeName, _properties);
									}
								)
							},
							_instanceProperties
						)
					);
				},
				getMockDomNode:_getMockDomNode = function (_name, _nodeProperties, _nodeMethods) {
					return _Uize.Class.subclass({
						alphastructor:function() {
							var m = this;

							m.style = {};

							m._events = {};
							m._attributes = {};
						},
						instanceProperties:_Uize.copyInto(
							{
								tagName:'DIV',
								nodeType:1
							},
							_nodeProperties
						),
						instanceMethods:_Uize.copyInto(
							{
								addEventListener:function(_eventName, _handler) {
									(this._events[_eventName] || (this._events[_eventName] = [])).push(_handler);
								},
								setAttribute:function(_key, _value) { this._attributes[_key] = _value },
								triggerEvent:function(_event) {
									var m = this;
									m._events[_event.name]
										&& _Uize.applyAll(m, m._events[_event.name], [_event]);
								}
							},
							_nodeMethods
						),
						stateProperties:{
							_name:'name'
						}
					}) ({name:_name});
				}
			},

			instanceMethods:{
				setInstance:function(_widgetProperties, _nodes) {
					var
						m = this,
						_widget = m.Class.getInstance(_widgetProperties, _nodes)
					;

					m.set('instance', _widget);

					return _widget;
				}
			}
		});
	}
});
