/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Csv Class
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
		The =Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Csv= module defines a suite of unit tests for the =Uize.Loc.FileFormats.ProjectStrings.Csv= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.ProjectStrings.Csv',
	builder:function () {
		'use strict';

		var
			/*** no strings ***/
				_stringsNoStrings = {},
				_fileNoStrings = '',

			/*** one file ***/
				_stringsOneFile = {
					'foo/bar.properties':{
						widget1:{
							TITLE:'widget 1 title',
							DESCRIPTION:'the first widget'
						},
						widget2:{
							TITLE:'widget 2 title',
							DESCRIPTION:'the second widget'
						}
					}
				},
				_fileOneFile = [
					'"[\'foo/bar.properties\',\'widget1\',\'TITLE\']",widget 1 title',
					'"[\'foo/bar.properties\',\'widget1\',\'DESCRIPTION\']",the first widget',
					'"[\'foo/bar.properties\',\'widget2\',\'TITLE\']",widget 2 title',
					'"[\'foo/bar.properties\',\'widget2\',\'DESCRIPTION\']",the second widget'
				].join ('\n'),

			/*** multiple files ***/
				_stringsMultipleFiles = {
					'foo/bar.properties':{
						widget1:{
							TITLE:'widget 1 title',
							DESCRIPTION:'the first widget'
						}
					},
					'baz/qux.properties':{
						widget2:{
							TITLE:'widget 2 title',
							DESCRIPTION:'the second widget'
						}
					}
				},
				_fileMultipleFiles = [
					'"[\'foo/bar.properties\',\'widget1\',\'TITLE\']",widget 1 title',
					'"[\'foo/bar.properties\',\'widget1\',\'DESCRIPTION\']",the first widget',
					'"[\'baz/qux.properties\',\'widget2\',\'TITLE\']",widget 2 title',
					'"[\'baz/qux.properties\',\'widget2\',\'DESCRIPTION\']",the second widget'
				].join ('\n'),

			/*** string arrays ***/
				_stringsStringArrays = {
					'foo/bar.properties':{
						widget1:{
							OPTIONS:[
								'Option 1',
								'Option 2'
							]
						},
						widget2:{
							OPTIONS:[
								'foo',
								'bar'
							]
						}
					}
				},
				_fileStringArrays = [
					'"[\'foo/bar.properties\',\'widget1\',\'OPTIONS\',0]",Option 1',
					'"[\'foo/bar.properties\',\'widget1\',\'OPTIONS\',1]",Option 2',
					'"[\'foo/bar.properties\',\'widget2\',\'OPTIONS\',0]",foo',
					'"[\'foo/bar.properties\',\'widget2\',\'OPTIONS\',1]",bar'
				].join ('\n')
		;

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.FileFormats.ProjectStrings.Csv Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.ProjectStrings.Csv'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.ProjectStrings.Csv.to',[
						['An empty object is serialized to an empty CSV file',
							Uize.clone (_stringsNoStrings),
							_fileNoStrings
						],
						['An object containing multiple resource strings for a file can be serialized to CSV format',
							Uize.clone (_stringsOneFile),
							_fileOneFile
						],
						['An object containing resource strings for multiple files can be serialized to CSV format',
							Uize.clone (_stringsMultipleFiles),
							_fileMultipleFiles
						],
						['An object containing string arrays for a file can be serialized to CSV format',
							Uize.clone (_stringsStringArrays),
							_fileStringArrays
						]
					]],
					['Uize.Loc.FileFormats.ProjectStrings.Csv.from',[
						['An empty CSV file is parsed to an empty object',
							_fileNoStrings,
							Uize.clone (_stringsNoStrings)
						],
						['A CSV file containing multiple strings for a single file can be parsed',
							_fileOneFile,
							Uize.clone (_stringsOneFile)
						],
						['A CSV file containing resource strings for multiple files can be parsed',
							_fileMultipleFiles,
							Uize.clone (_stringsMultipleFiles)
						],
						['A CSV file containing string array resource strings can be parsed',
							_fileStringArrays,
							Uize.clone (_stringsStringArrays)
						]
					]]
				])
			]
		});
	}
});

