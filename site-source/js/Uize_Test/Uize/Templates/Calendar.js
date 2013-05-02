/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Templates.Calendar Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Templates.Calendar= module defines basic unit tests for the =Uize.Templates.Calendar= JavaScript template module.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Test.Uize.Templates.Calendar= module defines the =Uize.Test.Uize.Templates.Calendar= class, a subclass of the =Uize.Test= class.
*/

Uize.module ({
	name:'Uize.Test.Uize.Templates.Calendar',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Test for Uize.Templates.Calendar JavaScript Template',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Templates.Calendar'),
				{
					title:'Test that calling the process static method produces a non-empty string',
					test:function () {
						return this.expectNonEmptyString (Uize.Templates.Calendar.process ({idPrefix:'page_widget'}));
					}
				}
			]
		});
	}
});

