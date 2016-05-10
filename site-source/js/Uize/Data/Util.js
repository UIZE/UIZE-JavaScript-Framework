/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
				_filter
		;

		return Uize.package ({
			getColumn:function (_rows,_columnName,_onlyUniques) {
				var _result = [];
				if (_rows) {
					var _uniqueValuesMap = _onlyUniques ? {} : null;
					for (var _rowNo = -1, _rowsLength = _rows.length; ++_rowNo < _rowsLength;) {
						var _columnValueForRow = _rows [_rowNo] [_columnName];
						if (
							!_onlyUniques ||
							(!_uniqueValuesMap [_columnValueForRow] && (_uniqueValuesMap [_columnValueForRow] = 1))
						)
							_result.push (_columnValueForRow)
						;
					}
				}
				return _result;
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
			},

			findRecords:function (_records,_match) {
				var _matchingRecords = [];
				if (_records) {
					for (var _recordNo = -1, _recordsLength = _records.length, _record; ++_recordNo < _recordsLength;)
						Uize.recordMatches (_record = _records [_recordNo],_match) && _matchingRecords.push (_record)
					;
				}
				return _matchingRecords;
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
			},

			filter:_filter = function (_object,_propertyNames) {
				var _result = {};
				if (_object && _propertyNames) {
					for (
						var _propertyNameNo = -1, _propertyNamesLength = _propertyNames.length;
						++_propertyNameNo < _propertyNamesLength;
					) {
						var _propertyName = _propertyNames [_propertyNameNo];
						if (_propertyName in _object)
							_result [_propertyName] = _object [_propertyName]
						;
					}
				}
				return _result;
				/*?
					Static Methods
						Uize.Data.Util.filter
							Returns an object with only the properties of the source object that are specified by an array of property names.

							SYNTAX
							...................................................................
							filteredOBJ = Uize.Data.Util.filter (sourceOBJ,propertyNamesARRAY);
							...................................................................

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
			},

			sortKeys:function (_object,_sortFunction) {
				var _keys = Uize.keys (_object);
				return _filter (_object,_sortFunction ? _keys.sort (_sortFunction) : _keys.sort ());
				/*?
					Static Methods
						Uize.Data.Util.sortKeys
							Returns an object that is a copy of the specified source object, but with keys that are sorted.

							DIFFERENT USAGES

							`Create a Sorted Keys Copy of an Object, Using the Default Comparator Function`
							....................................................
							sortedKeysOBJ = Uize.Data.Util.sortKeys (sourceOBJ);
							....................................................

							`Create a Sorted Keys Copy of an Object, Specifying a Custom Comparator Function`
							...................................................................
							sortedKeysOBJ = Uize.Data.Util.sortKeys (sourceOBJ,comparatorFUNC);
							...................................................................

							Create a Sorted Keys Copy of an Object, Using the Default Comparator Function
								In the simplest use case, a copy of a source object but with sorted keys can be created by specifying the source object as the single argument.

								SYNTAX
								....................................................
								sortedKeysOBJ = Uize.Data.Util.sortKeys (sourceOBJ);
								....................................................

								With this usage, the default comparator function will be used for sorting the keys. Consider the following example...

								EXAMPLE
								..........................
								Uize.Data.Util.sortKeys ({
									hello:'world',
									foo:'bar',
									baz:'qux'
								});
								..........................

								With the above example, the following result would be produced...

								RESULT
								................
								{
									baz:'qux',
									foo:'bar',
									hello:'world'
								}
								................

							Create a Sorted Keys Copy of an Object, Specifying a Custom Comparator Function
								When the default comparator function is not suitable, a custom comparator function can be specified using the optional second argument.

								SYNTAX
								...................................................................
								sortedKeysOBJ = Uize.Data.Util.sortKeys (sourceOBJ,comparatorFUNC);
								...................................................................

								The comparator function that is specified should follow the rules for a comparator function supplied to JavaScript's built-in =sort= instance method of the =Array= object. Consider the following example...

								EXAMPLE
								....................................................................
								Uize.Data.Util.sortKeys (
									{
										file25:'foo.txt',
										file15:'bar.txt',
										file2:'baz.txt',
										file1:'qux.txt'
									},
									function (a,b) {return a.match (/\d+/) [0] - b.match (/\d+/) [0]}
								);
								....................................................................

								In the above example, the keys for the properties of the specified source object contain numerical suffixes. If we relied simply on the default comparator function, we would get a resulting object with ASCIIbetically sorted keys in the order "file1", "file15", "file2", "file25".

								Since we want the keys to be sorted by the value of the numerical suffix, we specify a custom comparator function that performs a regular expression match on the keys in order to obtain the numerical portion and then compare those in an expression that produces a numerical result by coercing the numerical portions to numbers.

								Using the custom comparator, this following result would be produced...

								RESULT
								....................
								{
									file1:'qux.txt',
									file2:'baz.txt',
									file15:'bar.txt',
									file25:'foo.txt'
								}
								....................

				*/
			}
		});
	}
});

