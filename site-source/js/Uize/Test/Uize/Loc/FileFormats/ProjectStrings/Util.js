/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Util Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Util= module defines a suite of unit tests for the =Uize.Loc.FileFormats.ProjectStrings.Util= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Util',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.FileFormats.ProjectStrings.Util Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.ProjectStrings.Util'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.ProjectStrings.Util.flatten',[
						['When a hierarchical resources object is flattened, a flat hash object is produced where the keys are a JSON serialization of the path arrays of the various strings',
							{
								messages:{
									newMessages:{
										one:'You have {count} new message.',
										other:'You have {count} new messages.'
									},
									confirmDelete:{
										one:'Are you sure you would like to delete the {count} selected file?',
										other:'Are you sure you would like to delete the {count} selected files?'
									}
								},
								welcome:'Welcome to the Foo Bar messenger application',
								errors:{
									fileNotFound:'The file you specified could not be found.',
									requestFailed:'Your request could not be processed at this time.'
								}
							},
							{
								'[\'messages\',\'newMessages\',\'one\']':'You have {count} new message.',
								'[\'messages\',\'newMessages\',\'other\']':'You have {count} new messages.',
								'[\'messages\',\'confirmDelete\',\'one\']':'Are you sure you would like to delete the {count} selected file?',
								'[\'messages\',\'confirmDelete\',\'other\']':'Are you sure you would like to delete the {count} selected files?',
								'[\'welcome\']':'Welcome to the Foo Bar messenger application',
								'[\'errors\',\'fileNotFound\']':'The file you specified could not be found.',
								'[\'errors\',\'requestFailed\']':'Your request could not be processed at this time.'
							}
						]
					]],
					['Uize.Loc.FileFormats.ProjectStrings.Util.unflatten',[
						['When a flattened resources object is unflattened, the JSON-serialized path array keys of the various strings are parsed and an equivalent hierarchical resources object is produced',
							{
								'[\'messages\',\'newMessages\',\'one\']':'You have {count} new message.',
								'[\'messages\',\'newMessages\',\'other\']':'You have {count} new messages.',
								'[\'messages\',\'confirmDelete\',\'one\']':'Are you sure you would like to delete the {count} selected file?',
								'[\'messages\',\'confirmDelete\',\'other\']':'Are you sure you would like to delete the {count} selected files?',
								'[\'welcome\']':'Welcome to the Foo Bar messenger application',
								'[\'errors\',\'fileNotFound\']':'The file you specified could not be found.',
								'[\'errors\',\'requestFailed\']':'Your request could not be processed at this time.'
							},
							{
								messages:{
									newMessages:{
										one:'You have {count} new message.',
										other:'You have {count} new messages.'
									},
									confirmDelete:{
										one:'Are you sure you would like to delete the {count} selected file?',
										other:'Are you sure you would like to delete the {count} selected files?'
									}
								},
								welcome:'Welcome to the Foo Bar messenger application',
								errors:{
									fileNotFound:'The file you specified could not be found.',
									requestFailed:'Your request could not be processed at this time.'
								}
							}
						]
					]]
				])
			]
		});
	}
});

