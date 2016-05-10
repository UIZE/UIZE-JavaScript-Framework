/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.FileFormats.QtTs Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
			/*** no contents ***/
				_stringsNoContents = {},
				_fileNoContents =
					'<?xml version="1.0" encoding="utf-8"?>\n' +
					'<!DOCTYPE TS>\n' +
					'<TS version="2.1" language="en">\n' +
					'</TS>\n',

			/*** empty context ***/
				_stringsEmptyContext = {
					'First Context':{}
				},
				_fileEmptyContext =
					'<?xml version="1.0" encoding="utf-8"?>\n' +
					'<!DOCTYPE TS>\n' +
					'<TS version="2.1" language="en">\n' +
					'	<context>\n' +
					'		<name>First Context</name>\n' +
					'	</context>\n' +
					'</TS>\n',

			/*** context with strings ***/
				_stringsContextWithStrings = {
					'First Context':{
						foo:'FOO',
						bar:'BAR'
					}
				},
				_fileOneContextWithStrings =
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

			/*** multiple contexts with multiple strings ***/
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
				_fileMultipleContextsWithMultipleStrings =
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
					'</TS>\n',

			/*** numerus forms ***/
				_stringsNumerusForms = {
					'First Context':{
						'{count} foo(s)':[
							'{count} foo',
							'{count} foos'
						]
					}
				},
				_fileNumerusForms =
					'<?xml version="1.0" encoding="utf-8"?>\n' +
					'<!DOCTYPE TS>\n' +
					'<TS version="2.1" language="en">\n' +
					'	<context>\n' +
					'		<name>First Context</name>\n' +
					'		<message numerus="yes">\n' +
					'			<source>{count} foo(s)</source>\n' +
					'			<translation>\n' +
					'				<numerusform>{count} foo</numerusform>\n' +
					'				<numerusform>{count} foos</numerusform>\n' +
					'			</translation>\n' +
					'		</message>\n' +
					'	</context>\n' +
					'</TS>\n',

			/*** type="unfinished" ***/
				_stringsUnfinishedStrings = {
					'First Context':{
						foo:''
					}
				},
				_fileUnfinishedStrings =
					'<?xml version="1.0" encoding="utf-8"?>\n' +
					'<!DOCTYPE TS>\n' +
					'<TS version="2.1" language="en">\n' +
					'	<context>\n' +
					'		<name>First Context</name>\n' +
					'		<message>\n' +
					'			<source>foo</source>\n' +
					'			<translation type="unfinished"></translation>\n' +
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
							_fileNoContents,
							Uize.clone (_stringsNoContents)
						],
						['A TS file may contain a context with no messages',
							_fileEmptyContext,
							Uize.clone (_stringsEmptyContext)
						],
						['A TS file may contain a context with multiple messages',
							_fileOneContextWithStrings,
							Uize.clone (_stringsContextWithStrings)
						],
						['A TS file may contain multiple contexts containing multiple messages each',
							_fileMultipleContextsWithMultipleStrings,
							Uize.clone (_stringsMultipleContextsWithMultipleStrings)
						],
						['A TS file may contain numerus form message nodes',
							_fileNumerusForms,
							Uize.clone (_stringsNumerusForms)
						],
						['A TS file may contain messages that are marked as being unfinished using the optional type attribute, and this information is ignored during parsing',
							_fileUnfinishedStrings,
							Uize.clone (_stringsUnfinishedStrings)
						]
					]],
					['Uize.Loc.FileFormats.QtTs.to',[
						['Serializing an empty strings object produces a valid resource TS file containing no message nodes',
							Uize.clone (_stringsNoContents),
							_fileNoContents
						],
						['A strings object containing a context with no strings is serialized to a TS file containing an empty context tag',
							Uize.clone (_stringsEmptyContext),
							_fileEmptyContext
						],
						['A strings object containing a context with multiple strings is serialized correctly',
							Uize.clone (_stringsContextWithStrings),
							_fileOneContextWithStrings
						],
						['A strings object containing a multiple contexts with multiple strings per context is serialized correctly',
							Uize.clone (_stringsMultipleContextsWithMultipleStrings),
							_fileMultipleContextsWithMultipleStrings
						],
						['A strings object containing strings with numerus forms is serialized correctly',
							Uize.clone (_stringsNumerusForms),
							_fileNumerusForms
						],
						['When the value for a string is empty, then the attribute type="unfinished" is added to the translation tag',
							Uize.clone (_stringsUnfinishedStrings),
							_fileUnfinishedStrings
						],
						['When the language is specified in the options, the language value is reflected in the language attribute of the root TS tag',
							[
								{},
								{language:'fr-CA'}
							],
							'<?xml version="1.0" encoding="utf-8"?>\n' +
							'<!DOCTYPE TS>\n' +
							'<TS version="2.1" language="fr-CA">\n' +
							'</TS>\n'
						]
					]]
				])
			]
		});
	}
});

