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
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.VisualSamplersViewer.Html',
		'Uize.Widgets.VisualSamplersViewer.Css',
		'Uize.Data.Matches',
		'Uize.Str.Has',
		'Uize.Widgets.Container.Widget',
		'Uize.Flo'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_selectorPlaceholderText = '-- NO NAMESPACE SELECTED --'
		;

		return _superclass.subclass ({
			hasLoc:true,

			staticProperties:{
				cssModule:Uize.Widgets.VisualSamplersViewer.Css
			},

			set:{
				html:Uize.Widgets.VisualSamplersViewer.Html
			},

			stateProperties:{
				_modules:{
					name:'modules',
					onChange:function () {
						var m = this;

						/*** build visual sampler namespaces ***/
							var
								_modulesLookup = Uize.lookup (m._modules),
								_visualSamplerDirectNamespaces = Uize.Data.Matches.values (
									m._modules,
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
							var _visualSamplerNamespacesTree = Uize.Data.PathsTree.fromList (_visualSamplerNamespaces);
							function _processNode (_path,_node) {
								var _totalKeys = Uize.totalKeys (_node);
								if (_totalKeys) {
									_totalKeys > 1 && _visualSamplerNamespaces.push (_path);
									for (var _subNode in _node)
										_processNode (_path + (_path && '.') + _subNode,_node [_subNode])
									;
								}
							}
							_processNode ('',_visualSamplerNamespacesTree);
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

						/*** populate selector ***/
							m.whenever (
								'wired',
								function () {
									var
										_selector = m.getNode ('selector'),
										_selectorOptions = _selector.options
									;
									_selectorOptions [0] = new Option (_selectorPlaceholderText,_selectorPlaceholderText);
									for (
										var
											_visualSamplerNamespaceNo = -1,
											_visualSamplerNamespacesLength = _visualSamplerNamespaces.length,
											_namespace
										;
										++_visualSamplerNamespaceNo < _visualSamplerNamespacesLength;
									)
										_selectorOptions [_selectorOptions.length] = new Option (
											(
												(_namespace = _visualSamplerNamespaces [_visualSamplerNamespaceNo]) ||
												'ALL NAMESPACES'
											) +
											' (' + _visualSamplerModulesByNamespace [_namespace].length + ')',
											_namespace
										)
									;
								}
							);
					}
				},
				_selectedNamespace:{
					name:'selectedNamespace',
					onChange:function () {
						var m = this;
						m.once (
							'wired',
							function () {
								var
									_selectedNamespace = m._selectedNamespace,
									_visualSamplers = m.children.visualSamplers
								;
								if (_visualSamplers) {
									m.removeChild ('visualSamplers');
									m.setNodeInnerHtml ('visualSamplersShell','');
									_visualSamplers = null;
								}
								if (_selectedNamespace != _selectorPlaceholderText) {
									(
										_visualSamplers = m.addChild (
											'visualSamplers',
											Uize.Widgets.Container.Widget,
											{
												built:false,
												container:m.getNode ('visualSamplersShell')
											}
										)
									).insertUi ();
									var _visualSamplerProperties = {
										built:false,
										container:_visualSamplers.getNode (),
										insertionMode:'inner bottom'
									};
									Uize.Flo.forEach (
										function (_next) {_next (m._visualSamplerModulesByNamespace [_selectedNamespace])},
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
						);
					}
				}
			},

			eventBindings:{
				'#selector':{
					change:function () {
						this.set ({_selectedNamespace:this.getNodeValue ('selector')});
					}
				}
			},

			htmlBindings:{
				loc_selectorLabel:'selectorLabel:value'
			}
		});
	}
});

