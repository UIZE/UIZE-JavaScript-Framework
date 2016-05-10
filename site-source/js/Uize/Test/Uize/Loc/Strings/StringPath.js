/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Strings.StringPath Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Uize.Loc.Strings.StringPath= module defines a suite of unit tests for the =Uize.Loc.Strings.StringPath= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Strings.StringPath',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Strings.StringPath Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Strings.StringPath'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Strings.StringPath.to',[
						['A string path containing multiple elements can be serialized',
							[['foo/bar.properties','widgetName','stringKey',0]],
							'[\'foo/bar.properties\',\'widgetName\',\'stringKey\',0]'
						]
					]],
					['Uize.Loc.Strings.StringPath.from',[
						['A serialized string path containing multiple elements can be parsed',
							'[\'foo/bar.properties\',\'widgetName\',\'stringKey\',0]',
							['foo/bar.properties','widgetName','stringKey',0]
						]
					]]
				])
			]
		});
	}
});

