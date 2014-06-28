/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.VisualSamplersViewer.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.VisualSamplersViewer.Widget= class implements a widget for selecting and viewing visual samplers from a list of namespaces that contain visual samplers.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.VisualSamplersViewer.Widget',
	superclass:'Uize.Widgets.WidgetViewer.Widget',
	required:[
		'Uize.Data.Matches',
		'Uize.Str.Has',
		'Uize.Widgets.Container.Widget',
		'Uize.Flo'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			stateProperties:{
				_visualSamplerNamespaces:{
					name:'visualSamplerNamespaces',
					derived:function (modules) {
						var m = this;

						/*** build visual sampler namespaces ***/
							var
								_modulesLookup = Uize.lookup (modules),
								_visualSamplerDirectNamespaces = Uize.Data.Matches.values (
									modules,
									function (_moduleName) {
										return _modulesLookup [_moduleName + '.Widget'] && _modulesLookup [_moduleName + '.VisualSampler'];
									}
								),
								_visualSamplerNamespaces = _visualSamplerDirectNamespaces.concat ()
							;

						/*** add namespaces that aggregate more than one visual sampler namespace ***/
							/* EXAMPLE
								MyNamespace.Widgets.Button
								MyNamespace.Widgets.ProgressBar
								MyNamespace.Widgets.CoolWidgets.Foo
								MyNamespace.Widgets.CoolWidgets.More.Bar

								With the above example of widget namespaces for widgets that have visual samplers, the following namespaces would also be added, because they clump / aggregate more than one namespace underneath them that contain visual samplers...

								MyNamespace.Widgets
								MyNamespace.Widgets.CoolWidgets

								Note that the MyNamespace namespace would not be added, because it is redundant. In other words, selecting the MyNamespace namespace would show no more visual samplers than selecting the MyNamespace.Widgets namespace. The same applies to the MyNamespace.Widgets.CoolWidgets.More namespace.
							*/
							function _processNode (_path,_node) {
								var _totalKeys = Uize.totalKeys (_node);
								if (_totalKeys) {
									_totalKeys > 1 && _visualSamplerNamespaces.push (_path);
									for (var _subNode in _node)
										_processNode (_path + (_path && '.') + _subNode,_node [_subNode])
									;
								}
							}
							_processNode ('',Uize.Data.PathsTree.fromList (_visualSamplerNamespaces));
							_visualSamplerNamespaces.sort ();

						/*** build lookup for visual sampler modules per namespace ***/
							var _visualSamplerModulesByNamespace = m._visualSamplerModulesByNamespace = {};
							Uize.forEach (
								_visualSamplerNamespaces,
								function (_namespace) {
									_visualSamplerModulesByNamespace [_namespace] = Uize.map (
										Uize.Data.Matches.values (
											_visualSamplerDirectNamespaces,
											function (_visualSamplerNamespace) {
												return (
													!_namespace ||
													_visualSamplerNamespace == _namespace ||
													Uize.Str.Has.hasPrefix (_visualSamplerNamespace,_namespace + '.')
												);
											}
										),
										'value + ".VisualSampler"'
									);
								}
							);

						return _visualSamplerNamespaces;
					}
				},
				_displayedSelectorOptions:{
					name:'displayedSelectorOptions',
					derived:function (visualSamplerNamespaces,loc_allNamespaces,loc_noSelectionText) {
						return [loc_noSelectionText,loc_allNamespaces].concat (visualSamplerNamespaces);
					}
				}
			},

			htmlBindings:{
				displayedSelectorOptions:function (_displayedSelectorOptions) {
					var
						m = this,
						_selector = m.getNode ('selector'),
						_selectorOptions = _selector.options
					;
					_selectorOptions.length = 0;
					_selectorOptions [0] = new Option (_displayedSelectorOptions [0] || '','-');
					for (
						var
							_displayedSelectorOptionNo = 1,
							_displayedSelectorOptionsLength = _displayedSelectorOptions.length
						;
						++_displayedSelectorOptionNo < _displayedSelectorOptionsLength;
					) {
						var _namespace = _displayedSelectorOptions [_displayedSelectorOptionNo];
						_selectorOptions [_selectorOptions.length] = new Option (
							(_namespace || _displayedSelectorOptions [1] || '') +
							' (' + m._visualSamplerModulesByNamespace [_namespace].length + ')',
							_namespace
						);
					}
					m.setNodeValue (_selector,m.get ('value'));
				},
				value:function (_value) {
					var
						m = this,
						_visualSamplers = m.children.visualSamplers
					;
					if (_visualSamplers) {
						m.removeChild ('visualSamplers');
						m.setNodeInnerHtml ('viewer','');
						_visualSamplers = null;
					}
					if (_value != '-') {
						(
							_visualSamplers = m.addChild (
								'visualSamplers',
								Uize.Widgets.Container.Widget,
								{
									built:false,
									container:m.getNode ('viewer')
								}
							)
						).insertUi ();
						var _visualSamplerProperties = {
							built:false,
							container:_visualSamplers.getNode (),
							insertionMode:'inner bottom'
						};
						Uize.Flo.forEach (
							function (_next) {_next (m._visualSamplerModulesByNamespace [_value])},
							function (_next) {
								Uize.require (
									_next.flo.value,
									function (_visualSamplerModule) {
										_visualSamplers.addChild (
											'visualSampler' + _next.flo.key,
											_visualSamplerModule,
											_visualSamplerProperties
										).insertUi ();
										_next ();
									}
								);
							}
						) ({breatheAfter:500});
					}
				}
			}
		});
	}
});

