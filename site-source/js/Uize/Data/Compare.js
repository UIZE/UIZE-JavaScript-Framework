/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Compare Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Data.Compare= module provides various utility methods for comparing the contents of data objects.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.Compare',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Data = Uize.Data
		;

		return Uize.package ({
			identical:_Uize_Data.identical,
				// implementation remains in the Uize.Data module until end of the deprecation grace period
				/*?
					Static Methods
						Uize.Data.Compare.identical
							Returns a boolean, indicating whether or not the two specified objects are identical in their contents.

							SYNTAX
							.......................................................................
							areIdenticalBOOL = Uize.Data.Compare.identical (object1OBJ,object2OBJ);
							.......................................................................

							This method recurses through the two objects specified by the =object1OBJ= and =object2OBJ= parameters, testing that they have the same structure and property values. The two parameters can be arbitrarily complex data trees, or simple type values (i.e. string, number, boolean). In order to be considered identical, the two objects must have the same structure and the same values at all levels of their structure.

							VARIATION
							..................................................................................
							areIdenticalBOOL = Uize.Data.Compare.identical (object1OBJ,object2OBJ,optionsOBJ);
							..................................................................................

							When the optional =optionsOBJ= parameter is specified, comparison options can be specified to determine the criteria this method uses when comparing the two objects.

							optionsOBJ
								An object, with multiple optional properties, specifying the criteria this method should use when comparing the two objects.

								The value of the =optionsOBJ= parameter should be an object of the form...

								...............................................................................
								{
									equality : equalitySTR,             // 'type' | 'loose' | 'strict' (default)
									allowConjoined : allowConjoinedBOOL // false | true (default)
								}
								...............................................................................

								equality
									A string, specifying how the values of properties at any level of the objects' structure should be tested for equality.

									The optional =equality= property of the =optionsOBJ= parameter can have the following values...

									- ='type'= - When the value ='type'= is specified, the values of properties do not need to be equal - only be of the same type. This setting is useful when merely trying to determine if two objects have the same structure, but not that their values match. This could be used to determine if an object being interrogated conforms to some reference structure that might indicate the type of data it contains, but where the specific values are not important.

									- ='loose'= - When the value ='loose'= is specified, then the values of all properties must be equal only according to a loose equality comparison, where strict type matching is not performed. According to this setting, the number value =1= would equal the string value ='1'=, or the number value =0= would equal the string value =''= (empty string) and the boolean value =false=.

									- ='strict'= - When the value ='strict'= is specified (or when no value is specified for the =equality= property, or when no =optionsOBJ= parameter is specified), then the values of all properties must be equal according to a strict equality comparison, where strict type matching is performed. According to this setting, the number value =1= would *NOT* equal the string value ='1'=, the number value =0= would *NOT* equal the string value =''= (empty string), and so on.

								allowConjoined
									A boolean, specifying whether or not the two objects being compared may reference the same shared sub-object at any level of their structure.

									By default (when no value is specified for the =allowConjoined= property, or when no =optionsOBJ= parameter is specified), two objects being compared will be considered identical even if they are conjoined and reference the same shared sub-object at some level of their structure. Therefore, the statement =Uize.Data.Compare.identical (myObjectOBJ,myObjectOBJ)= will return the value =true=.

									Specifying the value =false= for this property will require that object references at any level of the structure of the two objects being compared are unique to each object. So, the statement =Uize.Data.Compare.identical (myObjectOBJ,myObjectOBJ,{allowConjoined:false})= would produce the result =false=.

									IMPORTANT
									It should be noted that the two objects being compared could still have references to shared objects at different levels in their structure. To reliably test that two objects are identical and yet completely discrete, one can use the =Uize.Data.Compare.clones= static method.

							NOTES
							- see also the =Uize.Data.Compare.clones= and =Uize.Data.Compare.conjoined= static methods
				*/

			conjoined:_Uize_Data.conjoined,
				// implementation remains in the Uize.Data module until end of the deprecation grace period
				/*?
					Static Methods
						Uize.Data.Compare.conjoined
							Returns a boolean, indicating whether or not the two specified objects share any object references.

							SYNTAX
							.......................................................................
							areConjoinedBOOL = Uize.Data.Compare.conjoined (object1OBJ,object2OBJ);
							.......................................................................

							NOTES
							- =Uize.Data.Compare.conjoined (myObjectOBJ,myObjectOBJ)= will return =true=, since they are one and the same (i.e. conjoined at the root).
				*/

			clones:_Uize_Data.clones,
				// implementation remains in the Uize.Data module until end of the deprecation grace period
				/*?
					Static Methods
						Uize.Data.Compare.clones
							Returns a boolean, indicating whether or not the two specified objects are identical clones of one another.

							SYNTAX
							.................................................................
							areClonesBOOL = Uize.Data.Compare.clones (object1OBJ,object2OBJ);
							.................................................................

							Identical clones have identical structure, possess all the same values for corresponding simple valued properties, but may not share objects (so, object type properties' values may not be shared, either at a corresponding place in their structure, or at different places in their structure).

							NOTES
							- =Uize.Data.Compare.clones (myObjectOBJ,myObjectOBJ)= will return =false=, since they are one and the same and not clones.
				*/

			intersection:_Uize_Data.intersection
				// implementation remains in the Uize.Data module until end of the deprecation grace period
				/*?
					Static Methods
						Uize.Data.Compare.intersection
							Returns an object that represents the key-value intersection / commonality between the two specified objects.

							SYNTAX
							.........................................................................
							intersectionOBJ = Uize.Data.Compare.intersection (object1OBJ,object2OBJ);
							.........................................................................

							EXAMPLE
							..........................................................................
							var
								employee1 = {
									firstName:'John',
									lastName:'Wilkey',
									startYear:'2008',
									department:'engineering'
								},
								employee2 = {
									firstName:'John',
									lastName:'Henderson',
									startYear:'2008',
									department:'finance'
								},
								employeeInCommon = Uize.Data.Compare.intersection (employee1,employee2)
							;
							..........................................................................

							In the above example, the variable =employeeInCommon= would have the value ={firstName:'John',startYear:'2008'}=.
				*/
		});
	}
});

