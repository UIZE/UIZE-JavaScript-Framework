/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.UnitTests.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =UizeSite.Widgets.UnitTests.Widget= module implements a widget class for a unit tests runner.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.UnitTests.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.UnitTests.VisualSampler
			.....................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.UnitTests.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'UizeSite.Widgets.UnitTests.Html',
		'UizeSite.Widgets.UnitTests.Css',
		'Uize.Widgets.Form.Input.Select.Widget',
		'Uize.Widgets.Button.Widget',
		'Uize.Widgets.ProgressBar.Widget',
		'Uize.Widgets.Log.Widget',
		'UizeSite.ModulesTree',
		'Uize.Data.Matches',
		'Uize.Data.PathsTree',
		'Uize.Url',
		'Uize.Test.Runner'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** General Variables ***/
				_runAllModuleTests = 'RUN ALL MODULE TESTS',
				_modulesTree = UizeSite.ModulesTree (),
				_modules = Uize.Data.PathsTree.toList (_modulesTree).sort (),
				_modulesLookup = Uize.lookup (_modules),
				_testModulesLookup = Uize.lookup (
					Uize.Data.Matches.retain (_modules,Uize.Util.ModuleNaming.isTestModule)
				)
		;

		/*** build values for test selector ***/
			var _testSelectorValues = [
				{
					name:_runAllModuleTests,
					displayName:_runAllModuleTests
				}
			];
			Uize.forEach (
				_modules,
				function (_moduleName) {
					if (
						!Uize.Util.ModuleNaming.isTestModule (_moduleName) &&
						!/\.library$/.test (_moduleName) // ignore .library modules
					)
						_testSelectorValues.push ({
							name:_moduleName,
							displayName:
								_moduleName +
								(_testModulesLookup [Uize.Util.ModuleNaming.getTestModuleName (_moduleName)] ? '' : ' *')
						})
					;
				}
			);

		/*** Private Instance Methods ***/
			function _prepareToRunTests (m) {
				var _children = m.children;
				m.set ({children:{progressBar:{value:m._currentTestNo = 0}}});
				_children.log && _children.log.clear ();
			}

		return _superclass.subclass ({
			set:{
				html:UizeSite.Widgets.UnitTests.Html
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.UnitTests.Css
			},

			alphastructor:function () {
				this._currentTestNo = 0;
			},

			stateProperties:{
				test:{
					conformer:function (_value) {return _value || _runAllModuleTests},
					value:_runAllModuleTests,
					onChange:function () {
						var m = this;
						m.once (
							'wired',
							function () {
								function _setButtonsEnabled (_mustEnable) {
									var _enabled = _mustEnable ? 'inherit' : false;
									m.set ({
										children:{
											startTests:{enabled:_enabled},
											stopTests:{enabled:_enabled}
										}
									});
								}

								var _children = m.children;
								m._testSuite && m._testSuite.stop ();
								_setButtonsEnabled (false);
								_prepareToRunTests (m);

								var _testName = m.test;
								Uize.Test.Runner.resolve (
									{
										module:_testName == _runAllModuleTests ? '*' : _testName,
										console:'verbose'
									},
									function () {return _modules},
									function (_moduleName) {return _modulesLookup [_moduleName]},
									function (_message) {_children.log.log (_message)},
									function (_reasonForFailure) {_reasonForFailure && alert (_reasonForFailure)},
									function (_test) {
										m._testSuite = _test;
										_setButtonsEnabled (true);
										_children.progressBar.set ({maxValue:m._testSuite.getTotalTests ()});
										_prepareToRunTests (m);
										m._testSuite.wire ({
											Done:function (e) {_children.progressBar.set ({value:++m._currentTestNo})}
										});
										m.test != _runAllModuleTests &&
											m.once ('wired',function () {m._testSuite.run ()})
										;
									}
								);
							}
						);
					}
				}
			},

			children:{
				testSelector:{
					widgetClass:Uize.Widgets.Form.Input.Select.Widget,
					values:_testSelectorValues
				},
				progressBar:{
					widgetClass:Uize.Widgets.ProgressBar.Widget,
					statusText:function (_input) {
						var _totalSteps = _input.totalSteps;
						return _totalSteps ? _input.stepsCompleted + ' of ' + _totalSteps + ' tests completed' : '';
					}
				},
				startTests:{
					widgetClass:Uize.Widgets.Button.Widget,
					text:'START',
					flavor:'positive',
					enabled:false,
					action:function () {
						var m = this.parent;
						_prepareToRunTests (m);
						m._testSuite.run ();
					}
				},
				stopTests:{
					widgetClass:Uize.Widgets.Button.Widget,
					text:'STOP',
					flavor:'negative',
					enabled:false,
					action:function () {this.parent._testSuite.stop ()}
				},
				log:{
					widgetClass:Uize.Widgets.Log.Widget,
					title:'TEST LOG'
				}
			},

			childBindings:{
				test:'testSelector.value'
			}
		});
	}
});

