/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page.Example.Test
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of =UizeSite.Page.Example= that provides additional functionality specific to test pages.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Page.Example.Test',
	required:'Uize.Widget.Button',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** add performTest child buttonm ***/
					var _performTestButton = m.addChild (
						'performTest',
						Uize.Widget.Button,
						{
							action:function () {
								_performTestButton.set ({busy:true});
								m.setNodeInnerHtml (
									'testResults',
									'<div style="font-size:30px; text-align:center;">BUSY PERFORMING TEST</div>' +
									'<div style="font-size:11px; text-align:center;">-- you get no progress bar because we don\'t want to pollute the results --</div>'
								);
								setTimeout (
									function () {
										m.performTest (
											function (_testResults) {
												m.setNodeInnerHtml ('testResults',_testResults);
												/*?
													DOM Nodes
														testResults
															A node whose innerHTML will be replaced with the test results HTML reported back from the call to the =performTest= instance method.
												*/
												_performTestButton.set ({busy:'inherit'});
												_performTestButton.setNodeInnerHtml ('','PERFORM TEST AGAIN');
											}
										);
									},
									500
								);
							}
						}
						/*?
							Child Widgets
								performTest
									A button that, when clicked, calls the =performTest= instance method that should be overrided by each test page.
						*/
					);
			},

			instanceMethods:{
				executeFunctionsWithPause:function (_functions,_pause,_callback) {
					function _executeNextFunction () {
						_functionNo++;
						_functionNo < _functionsLength
							?
								setTimeout (
									function () {
										var _startTime = new Date;
										_functions [_functionNo] ();
										_executionTimes.push (new Date - _startTime);
										_executeNextFunction ();
									},
									_pause
								)
							: _callback (_executionTimes)
						;
					}
					var
						_functionsLength = _functions.length,
						_executionTimes = [],
						_functionNo = -1
					;
					_executeNextFunction ();
				},

				performTest:function (_callback) {
					_callback ('');
					/*?
						Instance Methods
							performTest
								A method that performs the test for the test page.

								SYNTAX
								................................
								performTest (reportResultsFUNC);
								................................

								This method's implementation should be overrided by a particular test page, to perform the test specific to that page. Your implementation should expect to receive one parameter, =reportResultsFUNC=, being a function that should be called to report back the results of the test once it has completed. The =reportResultsFUNC= callback function expects one string parameter, being a report of the test's results in HTML format, which will be placed into the =testResults= DOM node.
					*/
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m.wireNode ('viewSource','click',function () {m.viewSource (window.location.href,document.title)});

						_superclass.doMy (m,'wireUi');
					}
				}
			}
		});
	}
});

