/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.HtmltCompiler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Widget.HtmltCompiler= module defines a suite of unit tests for the =Uize.Widget.HtmltCompiler= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/* TODO:
	- test value bindings to form elements
		- select (not yet supported)
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.HtmltCompiler',
	builder:function () {
		'use strict';

		/*** Utility Methods ***/
			function _htmlBindingsTest (_title,_widgetClassFeatures,_htmltSource,_expected) {
				return {
					title:_title,
					test:function () {
						var
							_WidgetClass = Uize.Widget.subclass ({
								mixins:Uize.Widget.mHtmlBindings,
								instanceMethods:{
									cssClass:function (_class) {return 'Widget-' + _class}
								}
							}).declare (_widgetClassFeatures),
							_template = Uize.Widget.HtmltCompiler.compile (
								_htmltSource,
								{widgetClass:_WidgetClass}
							),
							_widgetInstance = _WidgetClass ({idPrefix:'widget'})
						;
						return this.expect (
							_expected,
							_template.call (_widgetInstance,_widgetInstance.get ())
						);
					}
				};
			}

		return Uize.Test.resolve ({
			title:'Uize.Widget.HtmltCompiler Module Test',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Widget',
					'Uize.Widget.mHtmlBindings',
					'Uize.Widget.HtmltCompiler',
					'Uize.Util.Html.Encode',
					'Uize.Parse.Xml.NodeList'
				]),
				Uize.Test.staticMethodsTest ([
					['Uize.Widget.HtmltCompiler.compile',[
						{
							title:'The values of id attributes are prefixed with the idPrefix of the widget',
							test:[
								_htmlBindingsTest (
									'If the root node does not contain an id attribute, one is added and its value is set to the idPrefix of the widget',
									{},
									'<div></div>',
									'<div id="widget"></div>'
								),
								_htmlBindingsTest (
									'If the root node contains an id attribute with an empty value, its value is set to the idPrefix of the widget',
									{},
									'<div id=""></div>',
									'<div id="widget"></div>'
								),
								_htmlBindingsTest (
									'If the actual root node in the DOM has an id attribute that is not empty, then that node is not regarded as the widget root node and its existing id is preserved',
									{},
									'<div id="foo"></div>',
									'<div id="widget-foo"></div>'
								),
								_htmlBindingsTest (
									'The values of all id attributes are prefixed with the idPrefix of the widget',
									{},
									'<div>' +
										'<div id="div1">DIV 1</div>' +
										'<div id="div2">DIV 2</div>' +
										'<div>' +
											'<div id="nestedDiv">' +
												'<span id="aSpan">A SPAN</span>' +
											'</div>' +
											'<input id="textInput"/>' +
											'<textarea id="textArea">A TEXTAREA</textarea>' +
											'<select id="aSelect">' +
												'<option id="anOption">AN OPTION</option>' +
											'</select>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-div1">DIV 1</div>' +
										'<div id="widget-div2">DIV 2</div>' +
										'<div>' +
											'<div id="widget-nestedDiv">' +
												'<span id="widget-aSpan">A SPAN</span>' +
											'</div>' +
											'<input id="widget-textInput"/>' +
											'<textarea id="widget-textArea">A TEXTAREA</textarea>' +
											'<select id="widget-aSelect">' +
												'<option id="widget-anOption">AN OPTION</option>' +
											'</select>' +
										'</div>' +
									'</div>'
								)
							]
						},
						{
							title:'The values of class attributes are expanded by calling the cssClass method of the widget',
							test:[
								_htmlBindingsTest (
									'The values of class attributes for multiple nodes will be expanded',
									{},
									'<div>' +
										'<div class="foo1"></div>' +
										'<div class="foo2"></div>' +
										'<div>' +
											'<div class="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div class="Widget-foo1"></div>' +
										'<div class="Widget-foo2"></div>' +
										'<div>' +
											'<div class="Widget-foo3"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the values of class attributes contain multiple classes, each class will be expanded in separate calls to the cssClass method of the widget',
									{},
									'<div>' +
										'<div class="foo1A foo1B foo1C"></div>' +
										'<div class="foo2A foo2B"></div>' +
										'<div>' +
											'<div class="foo3A foo3B foo3C foo3D"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div class="Widget-foo1A Widget-foo1B Widget-foo1C"></div>' +
										'<div class="Widget-foo2A Widget-foo2B"></div>' +
										'<div>' +
											'<div class="Widget-foo3A Widget-foo3B Widget-foo3C Widget-foo3D"></div>' +
										'</div>' +
									'</div>'
								)
							]
						},
						{
							title:'The values of state properties can be bound to nodes to replace their contents',
							test:[
								_htmlBindingsTest (
									'A state property can be bound to replace the contents of the root node',
									{
										stateProperties:{
											foo:{value:'bar'}
										},
										htmlBindings:{
											foo:''
										}
									},
									'<div></div>',
									'<div id="widget">bar</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to replace the contents of a child node',
									{
										stateProperties:{
											foo:{value:'bar'}
										},
										htmlBindings:{
											foo:'foo'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo">bar</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to replace the contents of multiple nodes',
									{
										stateProperties:{
											foo:{value:'bar'}
										},
										htmlBindings:{
											foo:['foo1','foo2','foo3']
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1">bar</div>' +
										'<div id="widget-foo2">bar</div>' +
										'<div>' +
											'<div id="widget-foo3">bar</div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'The value of a state property is HTML encoded when it is bound to replace the contents of a node',
									{
										stateProperties:{
											foo:{value:'Characters that need to be HTML-encoded: <&"'}
										},
										htmlBindings:{
											foo:'foo'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo">Characters that need to be HTML-encoded: &lt;&amp;&quot;</div>' +
									'</div>'
								)
							]
						},
						{
							title:'The values of state properties can be bound to nodes to replace their inner HTML',
							test:[
								_htmlBindingsTest (
									'A state property can be bound to replace the inner HTML of the root node',
									{
										stateProperties:{
											foo:{value:'<div><span><b>bar</b></span></div>'}
										},
										htmlBindings:{
											foo:':innerHTML'
										}
									},
									'<div></div>',
									'<div id="widget"><div><span><b>bar</b></span></div></div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to replace the inner HTML of a child node',
									{
										stateProperties:{
											foo:{value:'<div><span><b>bar</b></span></div>'}
										},
										htmlBindings:{
											foo:'foo:innerHTML'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo"><div><span><b>bar</b></span></div></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to replace the inner HTML of multiple nodes',
									{
										stateProperties:{
											foo:{value:'<div><span><b>bar</b></span></div>'}
										},
										htmlBindings:{
											foo:['foo1:innerHTML','foo2:innerHTML','foo3:innerHTML']
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1"><div><span><b>bar</b></span></div></div>' +
										'<div id="widget-foo2"><div><span><b>bar</b></span></div></div>' +
										'<div>' +
											'<div id="widget-foo3"><div><span><b>bar</b></span></div></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'Replacement of the inner HTML of nodes is one pass only, so the replacement HTML content is not subsequently processed or affected by bindings',
									{
										stateProperties:{
											foo:{
												value:'<div id="foo2" class="foo2"><span id="widget-foo2"><b>bar</b></span></div>'
											}
										},
										htmlBindings:{
											foo:['foo1:innerHTML','foo2:innerHTML']
										}
									},
									'<div>' +
										'<div id="foo1" class="foo1"></div>' +
										'<div id="foo2" class="foo2"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" class="Widget-foo1">' +
											'<div id="foo2" class="foo2"><span id="widget-foo2"><b>bar</b></span></div>' +
										'</div>' +
										'<div id="widget-foo2" class="Widget-foo2">' +
											'<div id="foo2" class="foo2"><span id="widget-foo2"><b>bar</b></span></div>' +
										'</div>' +
									'</div>'
								)
							]
						},
						{
							title:'The values of state properties can be bound to various attributes of nodes',
							test:[
								_htmlBindingsTest (
									'A state property can be bound to an attribute of the root node',
									{
										stateProperties:{
											linkHref:{value:'http://www.uize.com'}
										},
										htmlBindings:{
											linkHref:':@href'
										}
									},
									'<a>uize.com</a>',
									'<a id="widget" href="http://www.uize.com">uize.com</a>'
								),
								_htmlBindingsTest (
									'A state property can be bound to an attribute of a child node',
									{
										stateProperties:{
											linkHref:{value:'http://www.uize.com'}
										},
										htmlBindings:{
											linkHref:'foo:@href'
										}
									},
									'<div>' +
										'<a id="foo">uize.com</a>' +
									'</div>',
									'<div id="widget">' +
										'<a id="widget-foo" href="http://www.uize.com">uize.com</a>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to an attribute of multiple nodes',
									{
										stateProperties:{
											linkHref:{value:'http://www.uize.com'}
										},
										htmlBindings:{
											linkHref:['foo1:@href','foo2:@href','foo3:@href']
										}
									},
									'<div>' +
										'<a id="foo1">uize.com</a>' +
										'<a id="foo2">uize.com</a>' +
										'<div>' +
											'<a id="foo3">uize.com</a>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<a id="widget-foo1" href="http://www.uize.com">uize.com</a>' +
										'<a id="widget-foo2" href="http://www.uize.com">uize.com</a>' +
										'<div>' +
											'<a id="widget-foo3" href="http://www.uize.com">uize.com</a>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'Multiple state properties can be bound to multiple different attributes of the same node',
									{
										stateProperties:{
											linkHref:{value:'http://www.uize.com'},
											linkTitle:{value:'The UIZE Web site'},
											linkTarget:{value:'_blank'}
										},
										htmlBindings:{
											linkHref:'foo:@href',
											linkTitle:'foo:@title',
											linkTarget:'foo:@target'
										}
									},
									'<div>' +
										'<a id="foo">uize.com</a>' +
									'</div>',
									'<div id="widget">' +
										'<a id="widget-foo" href="http://www.uize.com" title="The UIZE Web site" target="_blank">uize.com</a>' +
									'</div>'
								),
								_htmlBindingsTest (
									'If a state property is bound to an attribute of a node and that attribute already has a value specified, then the attribute\'s initial value is ignored and is replaced by the value from the state property binding',
									{
										stateProperties:{
											linkHref:{value:'http://www.uize.com'}
										},
										htmlBindings:{
											linkHref:'foo:@href',
										}
									},
									'<div>' +
										'<a id="foo" href="http://www.default.com">uize.com</a>' +
									'</div>',
									'<div id="widget">' +
										'<a id="widget-foo" href="http://www.uize.com">uize.com</a>' +
									'</div>'
								),
								_htmlBindingsTest (
									'If a state property is bound to an attribute of a node and that node already contains other attributes, those other attributes for which there are no bindings are retained',
									{
										stateProperties:{
											linkHref:{value:'http://www.uize.com'}
										},
										htmlBindings:{
											linkHref:'foo:@href',
										}
									},
									'<div>' +
										'<a id="foo" title="The UIZE Web site" target="_blank">uize.com</a>' +
									'</div>',
									'<div id="widget">' +
										'<a id="widget-foo" title="The UIZE Web site" target="_blank" href="http://www.uize.com">uize.com</a>' +
									'</div>'
								),
								_htmlBindingsTest (
									'The value of a state property is HTML encoded when it is bound to an attribute of a node',
									{
										stateProperties:{
											linkTitle:{value:'The "<UIZE>" Web site'}
										},
										htmlBindings:{
											linkTitle:'foo:@title',
										}
									},
									'<div>' +
										'<a id="foo" href="http://www.uize.com">uize.com</a>' +
									'</div>',
									'<div id="widget">' +
										'<a id="widget-foo" href="http://www.uize.com" title="The &quot;&lt;UIZE&gt;&quot; Web site">uize.com</a>' +
									'</div>'
								)
							]
						},
						{
							title:'The values of state properties can be bound to various types of form elements',
							test:[
								{
									title:'A state property can be bound to text input nodes',
									test:[
										_htmlBindingsTest (
											'A state property can be bound to a single text input node',
											{
												stateProperties:{
													foo:{value:'bar'}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<input id="foo" type="text"/>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo" type="text" value="bar"/>' +
											'</div>'
										),
										_htmlBindingsTest (
											'A state property can be bound to multiple text input nodes',
											{
												stateProperties:{
													foo:{value:'bar'}
												},
												htmlBindings:{
													foo:['foo1','foo2','foo3']
												}
											},
											'<div>' +
												'<input id="foo1" type="text"/>' +
												'<input id="foo2" type="text"/>' +
												'<div>' +
													'<input id="foo3" type="text"/>' +
												'</div>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo1" type="text" value="bar"/>' +
												'<input id="widget-foo2" type="text" value="bar"/>' +
												'<div>' +
													'<input id="widget-foo3" type="text" value="bar"/>' +
												'</div>' +
											'</div>'
										),
										_htmlBindingsTest (
											'Multiple state properties can be bound to multiple respective text input nodes',
											{
												stateProperties:{
													foo1:{value:'bar1'},
													foo2:{value:'bar2'},
													foo3:{value:'bar3'}
												},
												htmlBindings:{
													foo1:'foo1',
													foo2:'foo2',
													foo3:'foo3'
												}
											},
											'<div>' +
												'<input id="foo1" type="text"/>' +
												'<input id="foo2" type="text"/>' +
												'<div>' +
													'<input id="foo3" type="text"/>' +
												'</div>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo1" type="text" value="bar1"/>' +
												'<input id="widget-foo2" type="text" value="bar2"/>' +
												'<div>' +
													'<input id="widget-foo3" type="text" value="bar3"/>' +
												'</div>' +
											'</div>'
										),
										_htmlBindingsTest (
											'The value of a state property is HTML encoded when it is bound to a text input node',
											{
												stateProperties:{
													foo:{value:'Characters that need to be HTML-encoded: <&"'}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<input id="foo" type="text"/>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo" type="text" value="Characters that need to be HTML-encoded: &lt;&amp;&quot;"/>' +
											'</div>'
										),
										_htmlBindingsTest (
											'If a text input node to which a state property has been bound already has a value attribute, its initial value is ignored and is replaced by the value from the state property binding',
											{
												stateProperties:{
													foo:{value:'bar'}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<input id="foo" type="text" value="foo"/>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo" type="text" value="bar"/>' +
											'</div>'
										)
									]
								},
								{
									title:'A state property can be bound to textarea nodes',
									test:[
										_htmlBindingsTest (
											'A state property can be bound to a single textarea node',
											{
												stateProperties:{
													foo:{value:'bar'}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<textarea id="foo"></textarea>' +
											'</div>',
											'<div id="widget">' +
												'<textarea id="widget-foo">bar</textarea>' +
											'</div>'
										),
										_htmlBindingsTest (
											'A state property can be bound to multiple textarea nodes',
											{
												stateProperties:{
													foo:{value:'bar'}
												},
												htmlBindings:{
													foo:['foo1','foo2','foo3']
												}
											},
											'<div>' +
												'<textarea id="foo1"></textarea>' +
												'<textarea id="foo2"></textarea>' +
												'<div>' +
													'<textarea id="foo3"></textarea>' +
												'</div>' +
											'</div>',
											'<div id="widget">' +
												'<textarea id="widget-foo1">bar</textarea>' +
												'<textarea id="widget-foo2">bar</textarea>' +
												'<div>' +
													'<textarea id="widget-foo3">bar</textarea>' +
												'</div>' +
											'</div>'
										),
										_htmlBindingsTest (
											'Multiple state properties can be bound to multiple respective text input nodes',
											{
												stateProperties:{
													foo1:{value:'bar1'},
													foo2:{value:'bar2'},
													foo3:{value:'bar3'}
												},
												htmlBindings:{
													foo1:'foo1',
													foo2:'foo2',
													foo3:'foo3'
												}
											},
											'<div>' +
												'<textarea id="foo1"></textarea>' +
												'<textarea id="foo2"></textarea>' +
												'<div>' +
													'<textarea id="foo3"></textarea>' +
												'</div>' +
											'</div>',
											'<div id="widget">' +
												'<textarea id="widget-foo1">bar1</textarea>' +
												'<textarea id="widget-foo2">bar2</textarea>' +
												'<div>' +
													'<textarea id="widget-foo3">bar3</textarea>' +
												'</div>' +
											'</div>'
										),
										_htmlBindingsTest (
											'The value of a state property is HTML encoded when it is bound to a textarea node',
											{
												stateProperties:{
													foo:{value:'Characters that need to be HTML-encoded: <&"'}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<textarea id="foo"></textarea>' +
											'</div>',
											'<div id="widget">' +
												'<textarea id="widget-foo">Characters that need to be HTML-encoded: &lt;&amp;&quot;</textarea>' +
											'</div>'
										),
										_htmlBindingsTest (
											'If a textarea node to which a state property has been bound already contains content, this content is ignored and is replaced by the value from the state property binding',
											{
												stateProperties:{
													foo:{value:'bar'}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<textarea id="foo">foo</textarea>' +
											'</div>',
											'<div id="widget">' +
												'<textarea id="widget-foo">bar</textarea>' +
											'</div>'
										)
									]
								},
								{
									title:'A state property can be bound to checkbox input nodes',
									test:[
										_htmlBindingsTest (
											'A state property can be bound to a single checkbox input node',
											{
												stateProperties:{
													foo:{value:true}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<input id="foo" type="checkbox"/>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo" type="checkbox" checked="checked"/>' +
											'</div>'
										),
										_htmlBindingsTest (
											'A state property can be bound to multiple checkbox input nodes',
											{
												stateProperties:{
													foo:{value:'bar'}
												},
												htmlBindings:{
													foo:['foo1','foo2','foo3']
												}
											},
											'<div>' +
												'<input id="foo1" type="checkbox"/>' +
												'<input id="foo2" type="checkbox"/>' +
												'<div>' +
													'<input id="foo3" type="checkbox"/>' +
												'</div>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo1" type="checkbox" checked="checked"/>' +
												'<input id="widget-foo2" type="checkbox" checked="checked"/>' +
												'<div>' +
													'<input id="widget-foo3" type="checkbox" checked="checked"/>' +
												'</div>' +
											'</div>'
										),
										_htmlBindingsTest (
											'Multiple state properties can be bound to multiple respective checkbox input nodes',
											{
												stateProperties:{
													foo1:{value:true},
													foo2:{value:false},
													foo3:{value:true}
												},
												htmlBindings:{
													foo1:'foo1',
													foo2:'foo2',
													foo3:'foo3'
												}
											},
											'<div>' +
												'<input id="foo1" type="checkbox"/>' +
												'<input id="foo2" type="checkbox"/>' +
												'<div>' +
													'<input id="foo3" type="checkbox"/>' +
												'</div>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo1" type="checkbox" checked="checked"/>' +
												'<input id="widget-foo2" type="checkbox" />' +
												'<div>' +
													'<input id="widget-foo3" type="checkbox" checked="checked"/>' +
												'</div>' +
											'</div>'
										),
										_htmlBindingsTest (
											'When a state property is bound to a checkbox input node and the state property\'s value is false, the checked attribute will be absent',
											{
												stateProperties:{
													foo:{value:false}
												},
												htmlBindings:{
													foo:'foo'
												}
											},
											'<div>' +
												'<input id="foo" type="checkbox"/>' +
											'</div>',
											'<div id="widget">' +
												'<input id="widget-foo" type="checkbox" />' +
											'</div>'
										)
									]
								}
							]
						},
						{
							title:'The values of state properties can be bound to various style properties of nodes',
							test:[
								_htmlBindingsTest (
									'A state property can be bound to a style property of the root node',
									{
										stateProperties:{
											foo:{value:'15px'}
										},
										htmlBindings:{
											foo:':style.width'
										}
									},
									'<div></div>',
									'<div id="widget" style="width:15px;"></div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to a style property of a child node',
									{
										stateProperties:{
											foo:{value:'15px'}
										},
										htmlBindings:{
											foo:'foo:style.width'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="width:15px;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to a style property of multiple nodes',
									{
										stateProperties:{
											foo:{value:'15px'}
										},
										htmlBindings:{
											foo:['foo1:style.width','foo2:style.width','foo3:style.width']
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="width:15px;"></div>' +
										'<div id="widget-foo2" style="width:15px;"></div>' +
										'<div>' +
											'<div id="widget-foo3" style="width:15px;"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'Multiple state properties can be bound to multiple different style properties of the same node',
									{
										stateProperties:{
											left:{value:'5px'},
											top:{value:'6px'},
											right:{value:'7px'},
											bottom:{value:'8px'}
										},
										htmlBindings:{
											left:'foo:style.left',
											top:'foo:style.top',
											right:'foo:style.right',
											bottom:'foo:style.bottom'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="left:5px;top:6px;right:7px;bottom:8px;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the name of a style property in a style binding uses the DOM camelCase naming convention, it is resolved to the appropriate hyphenated form for CSS style properties',
									{
										stateProperties:{
											foo:{value:10}
										},
										htmlBindings:{
											foo:'foo:style.borderLeftWidth'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="border-left-width:10px;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the name of a style property in a style binding uses the appropriate hyphenated form for CSS style properties, it is used as is',
									{
										stateProperties:{
											foo:{value:10}
										},
										htmlBindings:{
											foo:'foo:style.border-left-width'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="border-left-width:10px;"></div>' +
									'</div>'
								),
								/*
								_htmlBindingsTest (
									'If state properties are bound to style properties of a node and those style properties already have values specified, then the style properties\' initial values are ignored and are replaced by the values from the state property bindings',
									{
										stateProperties:{
											width:{value:'100%'},
											height:{value:'100%'}
										},
										htmlBindings:{
											width:'foo:style.width',
											height:'foo:style.height'
										}
									},
									'<div>' +
										'<div id="foo" style="width:50%;height:50%;"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="width:100%;height:100%;"></div>' +
									'</div>'
								),
								*/
								_htmlBindingsTest (
									'If a state property is bound to a style property of a node and that node already contains other style properties, those other style properties for which there are no bindings are retained',
									{
										stateProperties:{
											foo:{value:'100%'}
										},
										htmlBindings:{
											foo:'foo:style.width'
										}
									},
									'<div>' +
										'<div id="foo" style="left:0;top:0;"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="left:0;top:0;width:100%;"></div>' +
									'</div>'
								),
								{
									title:'Number type values for state properties are resolved to string values, with the "px" being appended in certain cases',
									test:[
										_htmlBindingsTest (
											'When a state property with a number type value is bound to a style property that supports pixel units, the "px" suffix is appended by the binding',
											{
												stateProperties:{
													foo:{value:100}
												},
												htmlBindings:{
													foo:[
														':style.width',
														':style.height',
														':style.left',
														':style.top',
														':style.right',
														':style.bottom',
														':style.borderWidth'
													]
												}
											},
											'<div></div>',
											'<div id="widget" style="width:100px;height:100px;left:100px;top:100px;right:100px;bottom:100px;border-width:100px;"></div>'
										),
										_htmlBindingsTest (
											'When a state property with a string type value is bound to a style property that supports pixel units, the "px" suffix is not appended by the binding',
											{
												stateProperties:{
													foo:{value:'100%'}
												},
												htmlBindings:{
													foo:[
														':style.width',
														':style.height',
														':style.left',
														':style.top',
														':style.right',
														':style.bottom',
														':style.borderWidth'
													]
												}
											},
											'<div></div>',
											'<div id="widget" style="width:100%;height:100%;left:100%;top:100%;right:100%;bottom:100%;border-width:100%;"></div>'
										),
										_htmlBindingsTest (
											'When a state property with a number type value is bound to a style property that does\'t support pixel units, the "px" suffix is not appended by the binding',
											{
												stateProperties:{
													foo:{value:1}
												},
												htmlBindings:{
													foo:[
														':style.zIndex',
														':style.opacity'
													]
												}
											},
											'<div></div>',
											'<div id="widget" style="z-index:1;opacity:1;"></div>'
										)
									]
								}
							]
						},
						{
							title:'The values of state properties can be bound to the display of nodes using the "?" binding type',
							test:[
								_htmlBindingsTest (
									'A state property can be bound to the display of the root node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:':?'
										}
									},
									'<div></div>',
									'<div id="widget" style="display:block;"></div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to the display of a child node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:'foo:?'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="display:block;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to the display of multiple nodes',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:['foo1:?','foo2:?','foo3:?']
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:block;"></div>' +
										'<div id="widget-foo2" style="display:block;"></div>' +
										'<div>' +
											'<div id="widget-foo3" style="display:block;"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'Multiple state properties can be bound to the display of multiple respective nodes',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:false},
											foo3:{value:true}
										},
										htmlBindings:{
											foo1:'foo1:?',
											foo2:'foo2:?',
											foo3:'foo3:?'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:block;"></div>' +
										'<div id="widget-foo2" style="display:none;"></div>' +
										'<div>' +
											'<div id="widget-foo3" style="display:block;"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to the display of a node is truthy, then the style "display:block" will be used for displaying the node',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:1},
											foo3:{value:'foo'},
											foo4:{value:[]},
											foo5:{value:{}}
										},
										htmlBindings:{
											foo1:'foo1:?',
											foo2:'foo2:?',
											foo3:'foo3:?',
											foo4:'foo4:?',
											foo5:'foo5:?'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:block;"></div>' +
										'<div id="widget-foo2" style="display:block;"></div>' +
										'<div id="widget-foo3" style="display:block;"></div>' +
										'<div id="widget-foo4" style="display:block;"></div>' +
										'<div id="widget-foo5" style="display:block;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to the display of a node is falsy, then the style "display:none" will be used for displaying the node',
									{
										stateProperties:{
											foo1:{value:false},
											foo2:{value:0},
											foo3:{value:''},
											foo4:{value:null},
											foo5:{value:undefined}
										},
										htmlBindings:{
											foo1:'foo1:?',
											foo2:'foo2:?',
											foo3:'foo3:?',
											foo4:'foo4:?',
											foo5:'foo5:?'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:none;"></div>' +
										'<div id="widget-foo2" style="display:none;"></div>' +
										'<div id="widget-foo3" style="display:none;"></div>' +
										'<div id="widget-foo4" style="display:none;"></div>' +
										'<div id="widget-foo5" style="display:none;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to the display of a node together with other style bindings',
									{
										stateProperties:{
											display:{value:true},
											width:{value:'80%'},
											height:{value:'100%'}
										},
										htmlBindings:{
											display:':?',
											width:':style.width',
											height:':style.height'
										}
									},
									'<div></div>',
									'<div id="widget" style="display:block;width:80%;height:100%;"></div>'
								)
							]
						},
						{
							title:'The values of state properties can be bound to show nodes using the "show" binding type',
							test:[
								_htmlBindingsTest (
									'A state property can be bound to show the root node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:':show'
										}
									},
									'<div></div>',
									'<div id="widget" style="display:;"></div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to show a child node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:'foo:show'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="display:;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to show multiple nodes',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:['foo1:show','foo2:show','foo3:show']
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:;"></div>' +
										'<div id="widget-foo2" style="display:;"></div>' +
										'<div>' +
											'<div id="widget-foo3" style="display:;"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'Multiple state properties can be bound to the display of multiple respective nodes',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:false},
											foo3:{value:true}
										},
										htmlBindings:{
											foo1:'foo1:show',
											foo2:'foo2:show',
											foo3:'foo3:show'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:;"></div>' +
										'<div id="widget-foo2" style="display:none;"></div>' +
										'<div>' +
											'<div id="widget-foo3" style="display:;"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to show a node is truthy, then the style "display:" will be used for showing the node',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:1},
											foo3:{value:'foo'},
											foo4:{value:[]},
											foo5:{value:{}}
										},
										htmlBindings:{
											foo1:'foo1:show',
											foo2:'foo2:show',
											foo3:'foo3:show',
											foo4:'foo4:show',
											foo5:'foo5:show'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:;"></div>' +
										'<div id="widget-foo2" style="display:;"></div>' +
										'<div id="widget-foo3" style="display:;"></div>' +
										'<div id="widget-foo4" style="display:;"></div>' +
										'<div id="widget-foo5" style="display:;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to show a node is falsy, then the style "display:none" will be used for not showing the node',
									{
										stateProperties:{
											foo1:{value:false},
											foo2:{value:0},
											foo3:{value:''},
											foo4:{value:null},
											foo5:{value:undefined}
										},
										htmlBindings:{
											foo1:'foo1:show',
											foo2:'foo2:show',
											foo3:'foo3:show',
											foo4:'foo4:show',
											foo5:'foo5:show'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:none;"></div>' +
										'<div id="widget-foo2" style="display:none;"></div>' +
										'<div id="widget-foo3" style="display:none;"></div>' +
										'<div id="widget-foo4" style="display:none;"></div>' +
										'<div id="widget-foo5" style="display:none;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to show a node together with other style bindings',
									{
										stateProperties:{
											show:{value:true},
											width:{value:'80%'},
											height:{value:'100%'}
										},
										htmlBindings:{
											show:':show',
											width:':style.width',
											height:':style.height'
										}
									},
									'<div></div>',
									'<div id="widget" style="display:;width:80%;height:100%;"></div>'
								)
							]
						},
						{
							title:'The values of state properties can be bound to hide nodes using the "hide" binding type',
							test:[
								_htmlBindingsTest (
									'A state property can be bound to hide the root node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:':hide'
										}
									},
									'<div></div>',
									'<div id="widget" style="display:none;"></div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to hide a child node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:'foo:hide'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" style="display:none;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to hide multiple nodes',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:['foo1:hide','foo2:hide','foo3:hide']
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:none;"></div>' +
										'<div id="widget-foo2" style="display:none;"></div>' +
										'<div>' +
											'<div id="widget-foo3" style="display:none;"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'Multiple state properties can be bound to the display of multiple respective nodes',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:false},
											foo3:{value:true}
										},
										htmlBindings:{
											foo1:'foo1:hide',
											foo2:'foo2:hide',
											foo3:'foo3:hide'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:none;"></div>' +
										'<div id="widget-foo2" style="display:;"></div>' +
										'<div>' +
											'<div id="widget-foo3" style="display:none;"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to hide a node is truthy, then the style "display:none" will be used for hideing the node',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:1},
											foo3:{value:'foo'},
											foo4:{value:[]},
											foo5:{value:{}}
										},
										htmlBindings:{
											foo1:'foo1:hide',
											foo2:'foo2:hide',
											foo3:'foo3:hide',
											foo4:'foo4:hide',
											foo5:'foo5:hide'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:none;"></div>' +
										'<div id="widget-foo2" style="display:none;"></div>' +
										'<div id="widget-foo3" style="display:none;"></div>' +
										'<div id="widget-foo4" style="display:none;"></div>' +
										'<div id="widget-foo5" style="display:none;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to hide a node is falsy, then the style "display:" will be used for not hideing the node',
									{
										stateProperties:{
											foo1:{value:false},
											foo2:{value:0},
											foo3:{value:''},
											foo4:{value:null},
											foo5:{value:undefined}
										},
										htmlBindings:{
											foo1:'foo1:hide',
											foo2:'foo2:hide',
											foo3:'foo3:hide',
											foo4:'foo4:hide',
											foo5:'foo5:hide'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" style="display:;"></div>' +
										'<div id="widget-foo2" style="display:;"></div>' +
										'<div id="widget-foo3" style="display:;"></div>' +
										'<div id="widget-foo4" style="display:;"></div>' +
										'<div id="widget-foo5" style="display:;"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A state property can be bound to hide a node together with other style bindings',
									{
										stateProperties:{
											hide:{value:true},
											width:{value:'80%'},
											height:{value:'100%'}
										},
										htmlBindings:{
											hide:':hide',
											width:':style.width',
											height:':style.height'
										}
									},
									'<div></div>',
									'<div id="widget" style="display:none;width:80%;height:100%;"></div>'
								)
							]
						},
						_htmlBindingsTest (
							'There can be multiple different types of bindings to the same node',
							{
								stateProperties:{
									prop1:{value:'someClass'},
									title:{value:'Some Title'},
									text:{value:'Some Text'},
									color:{value:'#ccc'},
									dispaly:{value:false}
								},
								htmlBindings:{
									prop1:'foo:className',
									title:['foo:@title','foo:@alt'],
									text:'foo',
									color:'foo:style.color',
									display:'foo:?'
								}
							},
							'<div>' +
								'<a id="foo"></a>' +
							'</div>',
							'<div id="widget">' +
								'<a id="widget-foo" class="someClass" title="Some Title" alt="Some Title" style="color:#ccc;display:none;">Some Text</a>' +
							'</div>'
						),
						_htmlBindingsTest (
							'The className binding type is remapped to the "@class" binding type (i.e. a binding to the class attribute)',
							{
								stateProperties:{
									class1:{value:'enabled'},
									class2:{value:'selected'}
								},
								htmlBindings:{
									class1:[
										':className',
										'foo1:className'
									],
									class2:[
										'foo2:className',
										'foo3:className'
									]
								}
							},
							'<div>' +
								'<div id="foo1"></div>' +
								'<div id="foo2"></div>' +
								'<div>' +
									'<div id="foo3"></div>' +
								'</div>' +
							'</div>',
							'<div id="widget" class="enabled">' +
								'<div id="widget-foo1" class="enabled"></div>' +
								'<div id="widget-foo2" class="selected"></div>' +
								'<div>' +
									'<div id="widget-foo3" class="selected"></div>' +
								'</div>' +
							'</div>'
						),
						{
							title:'A special "readOnly" binding type is supported',
							test:[
								_htmlBindingsTest (
									'A "readOnly" type binding can be applied to the root node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:':readOnly'
										}
									},
									'<div></div>',
									'<div id="widget" readonly="readonly"></div>'
								),
								_htmlBindingsTest (
									'A "readOnly" type binding can be applied to a child node',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:'foo:readOnly'
										}
									},
									'<div>' +
										'<div id="foo"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo" readonly="readonly"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'A "readOnly" type binding can be applied to multiple nodes',
									{
										stateProperties:{
											foo:{value:true}
										},
										htmlBindings:{
											foo:['foo1:readOnly','foo2:readOnly','foo3:readOnly']
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" readonly="readonly"></div>' +
										'<div id="widget-foo2" readonly="readonly"></div>' +
										'<div>' +
											'<div id="widget-foo3" readonly="readonly"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'Multiple "readOnly" type bindings can be applied to multiple respective nodes',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:false},
											foo3:{value:true}
										},
										htmlBindings:{
											foo1:'foo1:readOnly',
											foo2:'foo2:readOnly',
											foo3:'foo3:readOnly'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div>' +
											'<div id="foo3"></div>' +
										'</div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" readonly="readonly"></div>' +
										'<div id="widget-foo2" ></div>' +
										'<div>' +
											'<div id="widget-foo3" readonly="readonly"></div>' +
										'</div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to a node using a "readOnly" type binding is truthy, then the "readonly" attribute is added to the node',
									{
										stateProperties:{
											foo1:{value:true},
											foo2:{value:1},
											foo3:{value:'foo'},
											foo4:{value:[]},
											foo5:{value:{}}
										},
										htmlBindings:{
											foo1:'foo1:readOnly',
											foo2:'foo2:readOnly',
											foo3:'foo3:readOnly',
											foo4:'foo4:readOnly',
											foo5:'foo5:readOnly'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" readonly="readonly"></div>' +
										'<div id="widget-foo2" readonly="readonly"></div>' +
										'<div id="widget-foo3" readonly="readonly"></div>' +
										'<div id="widget-foo4" readonly="readonly"></div>' +
										'<div id="widget-foo5" readonly="readonly"></div>' +
									'</div>'
								),
								_htmlBindingsTest (
									'When the value of a state property that is bound to a node using a "readOnly" type binding is falsy, then the "readonly" attribute is not added to the node',
									{
										stateProperties:{
											foo1:{value:false},
											foo2:{value:0},
											foo3:{value:''},
											foo4:{value:null},
											foo5:{value:undefined}
										},
										htmlBindings:{
											foo1:'foo1:readOnly',
											foo2:'foo2:readOnly',
											foo3:'foo3:readOnly',
											foo4:'foo4:readOnly',
											foo5:'foo5:readOnly'
										}
									},
									'<div>' +
										'<div id="foo1"></div>' +
										'<div id="foo2"></div>' +
										'<div id="foo3"></div>' +
										'<div id="foo4"></div>' +
										'<div id="foo5"></div>' +
									'</div>',
									'<div id="widget">' +
										'<div id="widget-foo1" ></div>' +
										'<div id="widget-foo2" ></div>' +
										'<div id="widget-foo3" ></div>' +
										'<div id="widget-foo4" ></div>' +
										'<div id="widget-foo5" ></div>' +
									'</div>'
								)
							]
						},
						{
							title:'HTML for child widgets can be inserted using the special "child" tag',
							test:[
								{
									title:'HTML for a child widget can be inserted using the "child" tag',
									test:function () {
										var
											_ChildWidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'ChildWidget-' + _class}
												}
											}),
											_WidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'Widget-' + _class}
												},
												omegastructor:function () {
													this.addChild ('foo',_ChildWidgetClass);
												}
											}),
											_template = Uize.Widget.HtmltCompiler.compile (
												'<div class="small">' +
													'<child name="foo"/>' +
												'</div>',
												{widgetClass:_WidgetClass}
											)
										;
										_ChildWidgetClass.set ({
											html:{
												process:Uize.Widget.HtmltCompiler.compile (
													'<div class="small"></div>',
													{widgetClass:_ChildWidgetClass}
												)
											}
										});
										var _widgetInstance = _WidgetClass ({idPrefix:'widget'});
										return this.expect (
											'<div class="Widget-small" id="widget">' +
												'<div class="ChildWidget-small" id="widget_foo"></div>' +
											'</div>',
											_template.call (_widgetInstance,_widgetInstance.get ())
										);
									}
								},
								{
									title:'When the value of the "name" attribute in a "child" tag does not correspond to the name of an existing child widget, then no HTML content is inserted for the child',
									test:function () {
										var
											_WidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'Widget-' + _class}
												}
											}),
											_template = Uize.Widget.HtmltCompiler.compile (
												'<div class="small">' +
													'<child name="foo"/>' +
												'</div>',
												{widgetClass:_WidgetClass}
											),
											_widgetInstance = _WidgetClass ({idPrefix:'widget'})
										;
										return this.expect (
											'<div class="Widget-small" id="widget"></div>',
											_template.call (_widgetInstance,_widgetInstance.get ())
										);
									}
								},
								{
									title:'When inserting HTML for a child widget using the "child" tag, values for the state properties of the child widget can be specified in attributes of the child tag that are named the same as the state properties',
									test:function () {
										var
											_ChildWidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'ChildWidget-' + _class}
												},
												stateProperties:{
													ptop1:{},
													prop2:{}
												},
												htmlBindings:{
													prop1:':@title',
													prop2:':value'
												}
											}),
											_WidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'Widget-' + _class}
												},
												omegastructor:function () {
													this.addChild ('foo',_ChildWidgetClass);
												}
											}),
											_template = Uize.Widget.HtmltCompiler.compile (
												'<div class="small">' +
													'<child name="foo" prop1="fooProp1" prop2="fooProp2"/>' +
												'</div>',
												{widgetClass:_WidgetClass}
											)
										;
										_ChildWidgetClass.set ({
											html:{
												process:Uize.Widget.HtmltCompiler.compile (
													'<div class="small"></div>',
													{widgetClass:_ChildWidgetClass}
												)
											}
										});
										var _widgetInstance = _WidgetClass ({idPrefix:'widget'});
										return this.expect (
											'<div class="Widget-small" id="widget">' +
												'<div class="ChildWidget-small" id="widget_foo" title="fooProp1">fooProp2</div>' +
											'</div>',
											_template.call (_widgetInstance,_widgetInstance.get ())
										);
									}
								},
								{
									title:'When a "child" tag contains a "class" or "extraClasses" attribute, the value of this attribute is split into separate class namespacer expressions (namespaced to the parent widget) and the concatenation of these is passed as the value of the "extraClasses" state property of the child widget',
									test:function () {
										var
											_ChildWidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'ChildWidget-' + _class}
												},
												stateProperties:{
													extraClasses:{value:''}
												},
												htmlBindings:{
													extraClasses:':@class'
												}
											}),
											_WidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'Widget-' + _class}
												},
												omegastructor:function () {
													this.addChild ('foo',_ChildWidgetClass);
													this.addChild ('bar',_ChildWidgetClass);
												}
											}),
											_template = Uize.Widget.HtmltCompiler.compile (
												'<div class="small">' +
													'<child name="foo" class="foo bar baz qux"/>' +
													'<child name="bar" extraClasses="foo bar baz qux"/>' +
												'</div>',
												{widgetClass:_WidgetClass}
											)
										;
										_ChildWidgetClass.set ({
											html:{
												process:Uize.Widget.HtmltCompiler.compile (
													'<div></div>',
													{widgetClass:_ChildWidgetClass}
												)
											}
										});
										var _widgetInstance = _WidgetClass ({idPrefix:'widget'});
										return this.expect (
											'<div class="Widget-small" id="widget">' +
												'<div id="widget_foo" class="Widget-foo Widget-bar Widget-baz Widget-qux"></div>' +
												'<div id="widget_bar" class="Widget-foo Widget-bar Widget-baz Widget-qux"></div>' +
											'</div>',
											_template.call (_widgetInstance,_widgetInstance.get ())
										);
									}
								},
								{
									title:'HTML for multiple child widget instances can be inserted in different places in the template, using multiple "child" tags',
									test:function () {
										var
											_ChildWidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'ChildWidget-' + _class}
												},
												stateProperties:{
													ptop1:{},
													prop2:{}
												},
												htmlBindings:{
													prop1:':@title',
													prop2:':value'
												}
											}),
											_WidgetClass = Uize.Widget.subclass ({
												mixins:Uize.Widget.mHtmlBindings,
												instanceMethods:{
													cssClass:function (_class) {return 'Widget-' + _class}
												},
												omegastructor:function () {
													this.addChild ('foo',_ChildWidgetClass);
													this.addChild ('bar',_ChildWidgetClass);
													this.addChild ('baz',_ChildWidgetClass);
												}
											}),
											_template = Uize.Widget.HtmltCompiler.compile (
												'<div class="small">' +
													'<child name="foo" prop1="fooProp1" prop2="fooProp2"/>' +
													'<div>' +
														'<child name="bar" prop1="barProp1" prop2="barProp2"/>' +
														'<div>' +
															'<child name="baz" prop1="bazProp1" prop2="bazProp2"/>' +
														'</div>' +
													'</div>' +
												'</div>',
												{widgetClass:_WidgetClass}
											)
										;
										_ChildWidgetClass.set ({
											html:{
												process:Uize.Widget.HtmltCompiler.compile (
													'<div class="small"></div>',
													{widgetClass:_ChildWidgetClass}
												)
											}
										});
										var _widgetInstance = _WidgetClass ({idPrefix:'widget'});
										return this.expect (
											'<div class="Widget-small" id="widget">' +
												'<div class="ChildWidget-small" id="widget_foo" title="fooProp1">' +
													'fooProp2' +
												'</div>' +
												'<div>' +
													'<div class="ChildWidget-small" id="widget_bar" title="barProp1">' +
														'barProp2' +
													'</div>' +
													'<div>' +
														'<div class="ChildWidget-small" id="widget_baz" title="bazProp1">' +
															'bazProp2' +
														'</div>' +
													'</div>' +
												'</div>' +
											'</div>',
											_template.call (_widgetInstance,_widgetInstance.get ())
										);
									}
								}
							]
						}
					]]
				])
			]
		});
	}
});

