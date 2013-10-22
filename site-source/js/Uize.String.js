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
		The =Uize.String= module is a deprecated module *(DEPRECATED 2013-10-21)*.
		
		*DEVELOPERS:* `Chris van Rensburg`

		Deprecated
			The =Uize.String= module has been deprecated in favor of various, smaller modules under the =Uize.Str= and =Uize.Array= namespaces.

			The Rationale
				The =Uize.String= module has been deprecated, with its various utility methods split amongst numerous smaller modules, in order to allow developers to deploy more compact code.

				With the new arrangement of smaller modules under the purely namespace =Uize.Str= module, it is now possible to use just some parts of the functionality without dragging along all of the baggage. Many of the methods in the =Uize.String= module were only infrequently used. The new arrangement of methods in mini modules provides a better strategy for making new functionality available in future without leading to bloat.

			Backwards Compatibility
				In order to maintain backwards compatibility while this module is still in the deprecated state, and before it is killed entirely, this module aggregates methods from the various newer modules contained under the =Uize.Str= and =Uize.Array= namespaces.

				All the static methods that have been migrated to other modules are still supported in this module and behave in exactly the same way as before.

			Update Your Code
				In order to update your code to prepare for the eventual expiration of this backwards compatibility provision, you should change all calls to the methods of the =Uize.String= module in your code, according to the following map...

				..........................................................................................
				Uize.String.hugJoin                  >> BECOMES >>  Uize.Array.Join.hugJoin

				Uize.String.limitLength              >> BECOMES >>  Uize.Str.Limit.limitLength
				Uize.String.joinUsingSuffixPriority  >> BECOMES >>  Uize.Str.Limit.joinUsingSuffixPriority

				Uize.String.contains                 >> BECOMES >>  Uize.Str.Has.has
				Uize.String.startsWith               >> BECOMES >>  Uize.Str.Has.hasPrefix
				Uize.String.endsWith                 >> BECOMES >>  Uize.Str.Has.hasSuffix

				Uize.String.toCamel                  >> BECOMES >>  Uize.Str.Camel.to

				Uize.String.repeat                   >> BECOMES >>  Uize.Str.Repeat.repeat

				Uize.String.split                    >> BECOMES >>  Uize_Str_Split.split
				Uize.String.splitInTwo               >> BECOMES >>  Uize_Str_Split.splitInTwo

				Uize.String.hasPadding               >> BECOMES >>  Uize.Str.Trim.hasPadding
				Uize.String.trim                     >> BECOMES >>  Uize.Str.Trim.trim
				Uize.String.trimLeft                 >> BECOMES >>  Uize.Str.Trim.trimLeft
				Uize.String.trimRight                >> BECOMES >>  Uize.Str.Trim.trimRight
				..........................................................................................

			New Modules
				In order to create homes for the various static methods that were migrated from the deprecated =Uize.String= module, the following new modules were created...

				- =Uize.Array.Join= - methods for joining array elements
				- =Uize.Str.Camel= - methods for working with CamelCase
				- =Uize.Str.Has= - methods for testing for presence of prefix, suffix, or substring
				- =Uize.Str.Limit= - methods for limiting the length of strings
				- =Uize.Str.Repeat= - methods for repeating strings
				- =Uize.Str.Split= - methods for splitting strings
				- =Uize.Str.Trim=- methods for dealing with whitespace padding

			Migrated Modules
				Because the =Uize.String= module has been deprecated, the following modules that were using it purely as a namespace, have been migrated to under the new =Uize.Str= namespace...

				....................................................................
				Uize.String.Builder          >> BECOMES >>  Uize.Str.Builder
				Uize.String.Discombobulator  >> BECOMES >>  Uize.Str.Discombobulator
				Uize.String.Lines            >> BECOMES >>  Uize.Str.Lines
				Uize.String.Replace          >> BECOMES >>  Uize.Str.Replace
				....................................................................
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
					/*?
						Static Methods
							Uize.String.hugJoin
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Array.Join.hugJoin= method implemented in the =Uize.Array.Join= module.
					*/

			/*** deprecated methods migrated to the Uize.Str.Has module ***/
				limitLength:_Uize_Str_Limit.limitLength,
					/*?
						Static Methods
							Uize.String.limitLength
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Limit.limitLength= method implemented in the =Uize.Str.Limit= module.
					*/

				joinUsingSuffixPriority:_Uize_Str_Limit.joinUsingSuffixPriority,
					/*?
						Static Methods
							Uize.String.joinUsingSuffixPriority
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Limit.joinUsingSuffixPriority= method implemented in the =Uize.Str.Limit= module.
					*/

			/*** deprecated methods migrated to the Uize.Str.Has module ***/
				contains:_Uize_Str_Has.has,
					/*?
						Static Methods
							Uize.String.contains
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Has.has= method implemented in the =Uize.Str.Has= module.
					*/

				startsWith:_Uize_Str_Has.hasPrefix,
					/*?
						Static Methods
							Uize.String.startsWith
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Has.hasPrefix= method implemented in the =Uize.Str.Has= module.
					*/

				endsWith:_Uize_Str_Has.hasSuffix,
					/*?
						Static Methods
							Uize.String.endsWith
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Has.hasSuffix= method implemented in the =Uize.Str.Has= module.
					*/

			/*** deprecated methods migrated to the Uize.Str.Camel module ***/
				toCamel:_Uize_Str.Camel.to,
					/*?
						Static Methods
							Uize.String.toCamel
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Camel.to= method implemented in the =Uize.Str.Camel= module.
					*/

			/*** deprecated methods migrated to the Uize.Str.Repeat module ***/
				repeat:_Uize_Str.Repeat.repeat,
					/*?
						Static Methods
							Uize.String.repeat
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Repeat.repeat= method implemented in the =Uize.Str.Repeat= module.
					*/

			/*** deprecated methods migrated to the Uize.Str.Split module ***/
				split:_Uize_Str_Split.split,
					/*?
						Static Methods
							Uize.String.split
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Split.split= method implemented in the =Uize.Str.Split= module.
					*/

				splitInTwo:_Uize_Str_Split.splitInTwo,
					/*?
						Static Methods
							Uize.String.splitInTwo
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Split.splitInTwo= method implemented in the =Uize.Str.Split= module.
					*/

			/*** deprecated methods migrated to the Uize.Str.Trim module ***/
				hasPadding:_Uize_Str_Trim.hasPadding,
					/*?
						Static Methods
							Uize.String.hasPadding
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Trim.hasPadding= method implemented in the =Uize.Str.Trim= module.
					*/

				trim:_Uize_Str_Trim.trim,
					/*?
						Static Methods
							Uize.String.trim
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Trim.trim= method implemented in the =Uize.Str.Trim= module.
					*/

				trimLeft:_Uize_Str_Trim.trimLeft,
					/*?
						Static Methods
							Uize.String.trimLeft
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Trim.trimLeft= method implemented in the =Uize.Str.Trim= module.
					*/

				trimRight:_Uize_Str_Trim.trimRight
					/*?
						Static Methods
							Uize.String.trimRight
								This method has been deprecated *(DEPRECATED 2013-10-21)* in favor of the new =Uize.Str.Trim.trimRight= method implemented in the =Uize.Str.Trim= module.
					*/
		});
	}
});

