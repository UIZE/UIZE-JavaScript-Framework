/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.QtTs Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Loc.FileFormats.QtTs= module defines a suite of unit tests for the =Uize.Loc.FileFormats.QtTs= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.FileFormats.QtTs',
	builder:function () {
		'use strict';

		var
			_stringsNoContents = {},
			_tsFileNoContents =
				'<?xml version="1.0" encoding="utf-8"?>\n' +
				'<!DOCTYPE TS>\n' +
				'<TS version="2.1" language="en">\n' +
				'</TS>\n',

			_stringsEmptyContext = {
				'First Context':{}
			},
			_tsFileEmptyContext =
				'<?xml version="1.0" encoding="utf-8"?>\n' +
				'<!DOCTYPE TS>\n' +
				'<TS version="2.1" language="en">\n' +
				'	<context>\n' +
				'		<name>First Context</name>\n' +
				'	</context>\n' +
				'</TS>\n',

			_stringsContextWithStrings = {
				'First Context':{
					foo:'FOO',
					bar:'BAR'
				}
			},
			_tsFileOneContextWithStrings =
				'<?xml version="1.0" encoding="utf-8"?>\n' +
				'<!DOCTYPE TS>\n' +
				'<TS version="2.1" language="en">\n' +
				'	<context>\n' +
				'		<name>First Context</name>\n' +
				'		<message>\n' +
				'			<source>foo</source>\n' +
				'			<translation>FOO</translation>\n' +
				'		</message>\n' +
				'		<message>\n' +
				'			<source>bar</source>\n' +
				'			<translation>BAR</translation>\n' +
				'		</message>\n' +
				'	</context>\n' +
				'</TS>\n',

			_stringsMultipleContextsWithMultipleStrings = {
				'First Context':{
					foo:'FOO',
					bar:'BAR'
				},
				'Second Context':{
					baz:'BAZ',
					qux:'QUX'
				}
			},
			_tsFileMultipleContextsWithMultipleStrings =
				'<?xml version="1.0" encoding="utf-8"?>\n' +
				'<!DOCTYPE TS>\n' +
				'<TS version="2.1" language="en">\n' +
				'	<context>\n' +
				'		<name>First Context</name>\n' +
				'		<message>\n' +
				'			<source>foo</source>\n' +
				'			<translation>FOO</translation>\n' +
				'		</message>\n' +
				'		<message>\n' +
				'			<source>bar</source>\n' +
				'			<translation>BAR</translation>\n' +
				'		</message>\n' +
				'	</context>\n' +
				'	<context>\n' +
				'		<name>Second Context</name>\n' +
				'		<message>\n' +
				'			<source>baz</source>\n' +
				'			<translation>BAZ</translation>\n' +
				'		</message>\n' +
				'		<message>\n' +
				'			<source>qux</source>\n' +
				'			<translation>QUX</translation>\n' +
				'		</message>\n' +
				'	</context>\n' +
				'</TS>\n'
		;

		return Uize.Test.resolve ({
			title:'Uize.Loc.FileFormats.QtTs Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.FileFormats.QtTs'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.FileFormats.QtTs.from',[
						['Parsing an empty resource TS file produces an empty strings object',
							_tsFileNoContents,
							Uize.clone (_stringsNoContents)
						],
						['A TS file may contain a context with no messages',
							_tsFileEmptyContext,
							Uize.clone (_stringsEmptyContext)
						],
						['A TS file may contain a context with multiple messages',
							_tsFileOneContextWithStrings,
							Uize.clone (_stringsContextWithStrings)
						],
						['A TS file may contain multiple contexts containing multiple messages each',
							_tsFileMultipleContextsWithMultipleStrings,
							Uize.clone (_stringsMultipleContextsWithMultipleStrings)
						]
					]]
					,
					['Uize.Loc.FileFormats.QtTs.to',[
						['Serializing an empty strings object produces a valid resource TS file containing no message nodes',
							Uize.clone (_stringsNoContents),
							_tsFileNoContents
						],
						['A strings object containing a context with no strings is serialized to a TS file containing an empty context tag',
							Uize.clone (_stringsEmptyContext),
							_tsFileEmptyContext
						],
						['A strings object containing a context with multiple strings is serialized correctly',
							Uize.clone (_stringsContextWithStrings),
							_tsFileOneContextWithStrings
						],
						['A strings object containing a multiple contexts with multiple strings per context is serialized correctly',
							Uize.clone (_stringsMultipleContextsWithMultipleStrings),
							_tsFileMultipleContextsWithMultipleStrings
						]
					]]
				])
			]
		});
	}
});

