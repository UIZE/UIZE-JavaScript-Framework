/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.FlavoredMessage.VisualTests Class
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
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.FlavoredMessage.VisualTests= class implements a set of visual tests for the =Uize.Widgets.FlavoredMessage.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.FlavoredMessage.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:[
		'Uize.Widgets.FlavoredMessage.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.Widgets.StateValues.size;
		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateTestCase ({
					flavor:'info',
					message:'A new version of your application is available for download.'
				});
				this.addStateTestCase ({
					flavor:'warning',
					message:'The credit card registered with your account is set to expire within the next 90 days.'
				});
				this.addStateTestCase ({
					flavor:'error',
					message:'Your request cannot be processed at this time. Please contact account services.'
				});
				this.addStateTestCase ({
					flavor:'success',
					message:'Your files have been successfully uploaded to your account.'
				});
				this.addStateTestCase ({
					flavor:'confirm',
					message:'Are you sure you would like to delete the selected 5 images?'
				});
				this.addStateCombinationTestCases ({
					flavor:'info',
					message:'A new version of your application is available for download.',
					size:_allSizes
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.FlavoredMessage.Widget
			}
		});
	}
});

