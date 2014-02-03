/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.Loc Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Services.Loc= module defines a class for a project localization service.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.Loc',
	superclass:'Uize.Service',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_false = false,
				_true = true
			;

		return _superclass.subclass ({
			serviceMethods:{
				import:{
					async:_true
					/*?
						Instance Methods
							import
								Imports language specific resource strings into the project, creating language specific resource files in the appropriate places, as needed.

								NOTES
								- see the companion =export= service method
								- this service method is asynchronous
					*/
				},

				export:{
					async:_true
					/*?
						Instance Methods
							export
								Exports resource strings from the project, gathering resource strings from resource files located through the project's codebase.

								NOTES
								- see the companion =import= service method
								- this service method is asynchronous
					*/
				},

				metrics:{
					async:_true
					/*?
						Instance Methods
							metrics
								Produces a report containing key metrics about a project's resource strings, such as number of individual resource files, estimated word count, estimated character count.

								NOTES
								- this service method is asynchronous
					*/
				},

				pseudoLocalize:{
					async:_true
					/*?
						Instance Methods
							pseudoLocalize
								Performs pseudo-localization for all of a project's resource strings, generating strings for a pseudo-locale that can then be imported into the project using the =import= method.

								NOTES
								- this service method is asynchronous
					*/
				},

				init:{
					async:_true
					/*?
						Instance Methods
							init
								Initializes the localization service.

								NOTES
								- this service method is asynchronous
					*/
				}
			}
		});
	}
});

