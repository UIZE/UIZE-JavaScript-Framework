/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Data.Util= module provides miscellaneous utility methods for working with data objects.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.Util',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Data = Uize.Data
		;

		return Uize.package ({
			getColumn:_Uize_Data.getColumn,
				// implementation remains in the Uize.Data module until end of the deprecation grace period
				/*?
					Static Methods
						Uize.Data.Util.getColumn
							Returns an array of the values for the specified column of the specified record set.

							SYNTAX
							.......................................................................
							columnValuesARRAY = Uize.Data.Util.getColumn (rowsARRAY,columnNameSTR);
							.......................................................................

							EXAMPLE
							...............................................................
							var
								peopleNames = [
									{first:'John',last:'Wilkey'},
									{first:'Marie',last:'Stevenson'},
									{first:'Craig',last:'Pollack'}
								],
								firstNames = Uize.Data.Util.getColumn (peopleNames,'first'),
								lastNames = Uize.Data.Util.getColumn (peopleNames,'last')
							;
							...............................................................

							In the above example, the variable =firstNames= would be an array with the value =['John','Marie','Craig']= and the variable =lastNames= would be an array with the value =['Wilkey','Stevenson','Pollack']=.

							The records / rows in the record set do not need to be objects - they can also be arrays.

							EXAMPLE
							.........................................................
							var
								peopleNames = [
									['John','Wilkey'],
									['Marie','Stevenson'],
									['Craig','Pollack']
								],
								firstNames = Uize.Data.Util.getColumn (peopleNames,0),
								lastNames = Uize.Data.Util.getColumn (peopleNames,1)
							;
							.........................................................

							In the above example, the =firstNames= and =lastNames= variables would have the same values as in the previous example.

							VARIATION
							.......................................................................................
							columnValuesARRAY = Uize.Data.Util.getColumn (rowsARRAY,columnNameSTR,onlyUniquesBOOL);
							.......................................................................................

							When the value =true= is specified for the optional =onlyUniquesBOOL= parameter, then this method will only return the unique values for the specified column.

							EXAMPLE
							.......................................................................
							var
								employees = [
									{firstName:'John',lastName:'Wilkey',department:'engineering'},
									{firstName:'Marie',lastName:'Stevenson',department:'finance'},
									{firstName:'Craig',lastName:'Pollack',department:'finance'},
									{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
									{firstName:'Mark',lastName:'Strathley',department:'engineering'}
								],
								departments = Uize.Data.Util.getColumn (employees,'department',true)
							;
							.......................................................................

							In the above example, the variable =departments= would be an array with the value =['engineering','finance']=.
				*/

			findRecords:_Uize_Data.findRecords,
				// implementation remains in the Uize.Data module until end of the deprecation grace period
				/*?
					Static Methods
						Uize.Data.Util.findRecords
							Returns an array of records from the specified record set that match the specified criteria.

							SYNTAX
							..........................................................................
							matchingRecordsARRAY = Uize.Data.Util.findRecords (recordsARRAY,matchOBJ);
							..........................................................................

							EXAMPLE
							...................................................................................
							var
								employees = [
									{firstName:'John',lastName:'Wilkey',department:'engineering'},
									{firstName:'Marie',lastName:'Stevenson',department:'finance'},
									{firstName:'Craig',lastName:'Pollack',department:'finance'},
									{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
									{firstName:'Mark',lastName:'Strathley',department:'engineering'}
								],
								financeEmployees = Uize.Data.Util.findRecords (employees,{department:'finance'})
							;
							...................................................................................

							In the above example, the variable =financeEmployees= would be an array with the value...

							.................................................................
							[
								{firstName:'Marie',lastName:'Stevenson',department:'finance'},
								{firstName:'Craig',lastName:'Pollack',department:'finance'}
							]
							.................................................................

							If the records in your record set are arrays, rather than objects, then you can specify a match object where the keys are numerical indexes representing the array element index / column index, as in...

							EXAMPLE
							..........................................................................
							var
								employees = [
									['John','Wilkey','engineering'],
									['Marie','Stevenson','finance'],
									['Craig','Pollack','finance'],
									['Nick','Arendsen','engineering'],
									['Mark','Strathley','engineering']
								],
								financeEmployees = Uize.Data.Util.findRecords (employees,{2:'finance'})
							;
							..........................................................................

							In the above example, the =financeEmployees= variable would have the same value as in the previous example.

							NOTES
							- see also the =Uize.findRecord=, =Uize.findRecordNo=, and =Uize.recordMatches= static methods of the =Uize.Class= base class
				*/

			filter:_Uize_Data.filter
				// implementation remains in the Uize.Data module until end of the deprecation grace period
				/*?
					Static Methods
						Uize.Data.Util.filter
							Returns an object with only the properties of the source object that are specified by an array of property names.

							SYNTAX
							.........................................................................
							filteredOBJ = Uize.Data.Util.filter (sourceObjectOBJ,propertyNamesARRAY);
							.........................................................................

							This method can be useful when receiving an info package of which only a subset needs to be stored or passed on to a subsequent process.

							EXAMPLE
							........................................................................................
							var someNodeStyle = {
								color:'#fff',
								left:'10px',
								top:'-50px',
								position:'absolute',
								display:'none',
								width:'200px',
								height:'300px',
								overflow:'hidden'
							};
							Uize.Dom.Basics.setStyle (
								'someOtherNode',Uize.Data.Util.filter (someNodeStyle,['left','top','width','height'])
							);
							........................................................................................

							In this example, a node style object that is being used for some node is being filtered for just its dimensions and positioning properties, to then be applied to some other node.

							Without this method, the =setStyle= method call would look like...
							.................................
							Uize.Dom.Basics.setStyle (
								'someOtherNode',
								{
									left:someNodeStyle.left,
									top:someNodeStyle.top,
									width:someNodeStyle.width,
									height:someNodeStyle.height
								}
							);
							.................................
				*/
		});
	}
});

