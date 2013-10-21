/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.String Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.String= module eases working with strings, and supports trimming, camel-casing, multi-line indenting, starts-with / ends-with tests, and more.

		*DEVELOPERS:* `Chris van Rensburg`

		The deprecated =Uize.String= module aggregates methods from various modules in order to provide backwards compatibility for the static methods that have been migrated into separate modules under the =Uize.Str= and =Uize.Array= namespaces. For full details, consult the [[../news/2013-??-??-Uize.String-module-deprecated.html][news announcement]] for this change.

*/

Uize.module ({
	name:'Uize.String',
	required:[
		'Uize.Array.Join',
		'Uize.Str.Camel',
		'Uize.Str.Has',
		'Uize.Str.Limit',
		'Uize.Str.Repeat',
		'Uize.Str.Split',
		'Uize.Str.Trim'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Str = Uize.Str,
				_Uize_Str_Has = _Uize_Str.Has,
				_Uize_Str_Limit = _Uize_Str.Limit,
				_Uize_Str_Split = _Uize_Str.Split,
				_Uize_Str_Trim = _Uize_Str.Trim
		;

		return Uize.package ({
			/*** deprecated methods migrated to the Uize.Array.Join module ***/
				hugJoin:Uize.Array.Join.hugJoin,

			/*** deprecated methods migrated to the Uize.Str.Has module ***/
				limitLength:_Uize_Str_Limit.limitLength,
				joinUsingSuffixPriority:_Uize_Str_Limit.joinUsingSuffixPriority,

			/*** deprecated methods migrated to the Uize.Str.Has module ***/
				contains:_Uize_Str_Has.has,
				startsWith:_Uize_Str_Has.hasPrefix,
				endsWith:_Uize_Str_Has.hasSuffix,

			/*** deprecated methods migrated to the Uize.Str.Camel module ***/
				toCamel:_Uize_Str.Camel.to,

			/*** deprecated methods migrated to the Uize.Str.Repeat module ***/
				repeat:_Uize_Str.Repeat.repeat,

			/*** deprecated methods migrated to the Uize.Str.Split module ***/
				split:_Uize_Str_Split.split,
				splitInTwo:_Uize_Str_Split.splitInTwo,

			/*** deprecated methods migrated to the Uize.Str.Trim module ***/
				hasPadding:_Uize_Str_Trim.hasPadding,
				trim:_Uize_Str_Trim.trim,
				trimLeft:_Uize_Str_Trim.trimLeft,
				trimRight:_Uize_Str_Trim.trimRight
		});
	}
});

