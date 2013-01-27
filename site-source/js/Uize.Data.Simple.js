/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Simple Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 90
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Data.Simple= package provides methods for parsing data represented in the *SIMPLE* format, an indentation based format for declaring data structures.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.Simple',
	required:[
		'Uize.String',
		'Uize.String.Lines'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_string = 'string',
				_package = function () {}
			;

		/*** General Variables ***/
			var
				_arrayDelimiter = '\\s*\\|\\s*',
				_arrayDelimiterRegExp = new RegExp (_arrayDelimiter),
				_arrayStartRegExp = new RegExp ('^' + _arrayDelimiter),
				_arrayEndRegExp = new RegExp (_arrayDelimiter + '$')
			;

		/*** Public Static Methods ***/
			var _getIndentationLevel = _package.getIndentationLevel = function (_line) {
				return _line.length - _line.replace (/^\s*/,'').length;
			};

			_package.parse = function (_params) {
				var
					_simple = _params.simple,
					_parseName = _params.parseName !== false,
					_ignoreWhitespaceLines = _params.ignoreWhitespaceLines,
					_multiLineValueRegExp = /^([\.,~`:])\1+$/,
					_commentBlockRegExp = /^\s*#(\(+|\)+|<+|>+|\[+|\]+|\{+|\}+)$/,
					_openerToCloser = {
						'<':'>',
						'>':'<',
						'(':')',
						')':'(',
						'[':']',
						']':'[',
						'{':'}',
						'}':'{'
					},
					_data = {
						name:'',
						value:'',
						children:[]
					},
					_lines = Uize.String.Lines.split (_simple),
					_linesLength = _lines.length,
					_linesLengthMinus1 = _linesLength - 1,
					_lineNo,
					_line,
					_currentLevelNo = 0,
					_currentLevel = {
						_parent:_data,
						_indenting:0,
						_nameRunningState:''
					},
					_levels = [_currentLevel]
				;

				function _scoopUpIndentedLines () {
					var
						_result = [],
						_parentIndenting = _getIndentationLevel (_line),
						_childrenIndenting = -1,
						_childLine
					;
					while (_lineNo < _linesLengthMinus1) {
						_lineNo++;
						if (_childLine = _lines [_lineNo]) {
							var _childLineIndenting = _getIndentationLevel (_childLine);
							if (_childrenIndenting < 0) _childrenIndenting = _childLineIndenting;
							if (_childLineIndenting <= _parentIndenting) {
								_lineNo--;
								break;
							} else {
								_result.push (_childLine.slice (_childrenIndenting));
							}
						} else {
							_result.push ('');
						}
					}
					_result.length && !_result [_result.length - 1] && _result.pop (); // remove last line, if empty

					return _result;
				}

				for (_lineNo = -1; ++_lineNo < _linesLength;) {
					if ((_line = _lines [_lineNo]) && (!_ignoreWhitespaceLines || Uize.String.trim (_line))) {
						if (_commentBlockRegExp.test (_line)) {
							/* support for multi-line comment blocks, as in the example...
								#[
								This is a commented section
									This is the guts of a commented section
									More guts of a commented section
									and yet some more guts
									just no end to the guts
								#]

								- the comment open marker line must start with a "#" character, followed by one or more of one of the valid opener characters - "(", "[", "{", "<"

								- the comment close marker line must start with a "#" character, followed by one or more of one of the valid closer characters - ")", "]", "}", ">"

								- the comment closer character used must be matched to the comment opener character (ie. "(" matches ")", "[" matches "]", "{" matches "}", and "<" matches ">")

								- the number of opener characters used must match the number of closer characters used (ie. the comment opener "#<<<" matches the comment closed "#>>>", but does not match the comment closer "#>>")
							*/
							var _openerChar = _line.charAt (_line.indexOf ('#') + 1);
							while (_lineNo < _linesLengthMinus1) {
								_lineNo++;
								var _commentedLine = _lines [_lineNo];
								if (
									_commentedLine.length == _line.length && _commentBlockRegExp.test (_commentedLine) &&
									_openerToCloser [_openerChar] == _commentedLine.charAt (_commentedLine.indexOf ('#') + 1)
								)
									break
								;
							}
						} else if (/^\s*###/.test (_line)) {
							/* support for commenting out a section and all children, as in...
								### People
									Person
										First Name : James
										Last Name  : Crutchley
									Person
										First Name : Paul
										Last Name  : Wellstone
									Person
										First Name : Azemumdon
										Last Name  : Buchakahli

								in this example, the entire key "People" is commented out using the "###" prefix
							*/
							_scoopUpIndentedLines ();
						} else {
							var
								_lineUnindented = _line.replace (/^\s*/,''),
								_indenting = _line.length - _lineUnindented.length
							;
							if (_indenting != _currentLevel._indenting) {
								if (_indenting > _currentLevel._indenting) {
									var _children = _currentLevel._parent.children;
									_currentLevelNo++;
									_currentLevel = _levels [_currentLevelNo] = {
										_parent:_children [_children.length - 1],
										_indenting:_indenting
									};
								} else {
									while (_currentLevelNo && _currentLevel._indenting > _indenting) {
										_currentLevelNo--;
										_currentLevel = _levels [_currentLevelNo];
									}
								}
							}
							var
								_children = _currentLevel._parent.children,
								_indexOfNewChild = _children.length,
								_name, _value
							;
							if (_parseName) {
								var _nameValue = _lineUnindented.match (/^([^:]*[^:\s])?(?:\s*:\s*(.*))?$/);
								_name = _nameValue [1] || '';
								_value = _nameValue [2] || '';
							} else {
								_name = '';
								_value = _lineUnindented;
							}
							if (_parseName && !_name && _indexOfNewChild) {
								/*
									the name can be ommitted on successive entries at a particular indentation level to give you a kind of running state (a convenient shorthand to avoid duplicating the same key)

									Fruit:
										name  : Strawberry
										color : red
										taste : tart
									:
										name  : Orange
										color : orange
										taste : tart, acidic, sweet
									:
										name  : Grapefruit
										color : pink
										taste : bitter

									In this example, the "Fruit" key does not need to be repeated for successive running entries.
								*/
								var _previousChild = _children [_indexOfNewChild - 1];
								_name = _previousChild.name;
								if (_name != _currentLevel._nameRunningState) {
									_currentLevel._nameRunningState = _name;
									!_previousChild.value && !_previousChild.children.length && _indexOfNewChild--;
									/*
										in the special case where the name running state changes and the first member of a particular name has an emptry string value and has no children, then that first member is essentially considered void, allowing a more elegant notation, as in the following...

										Fruit
										:
											name  : Strawberry
											color : red
											taste : tart
										:
											name  : Orange
											color : orange
											taste : tart, acidic, sweet
										:
											name  : Grapefruit
											color : pink
											taste : bitter

										So, the declaration for each "Fruit" member is consistent, and the first voided member serves merely to set up the member name running state. Without this special behavior, the above example would give you one "Fruit" member with no children and an empty string as its value.

										So, then, if your intention was to have an empty first "Fruit" member, it would have to be specified as...

										Fruit
										:
										:
											name  : Strawberry
											color : red
											taste : tart
										:
											name  : Orange
											color : orange
											taste : tart, acidic, sweet
										:
											name  : Grapefruit
											color : pink
											taste : bitter
									*/
								}
							}
							if (_multiLineValueRegExp.test (_value)) {
								/* support for multi-line values, as in the example...
									~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
									function addSeries (start,end,step) {
										num = start;
										var sum = 0;
										while (num <= end) {
											sum += num;
											num += step;
										}
										return sum;
									}
									~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

									This syntax is ideal for specifying blocks of sample code, or other blocks of text that should not be parsed according to the simple indentation structure.
								*/
								var _openerChar = _value.charAt (0);
								_value = '';
								while (_lineNo < _linesLengthMinus1) {
									if (
										_multiLineValueRegExp.test (
											_lineUnindented = (_line = _lines [++_lineNo]).slice (_indenting)
										) &&
										_lineUnindented.charAt (0) == _openerChar
									) {
										break;
									} else {
										_value += _lineUnindented + '\n';
									}
								}
							} else if (_value == ':') {
								/* support for multi-line values, as in the example...
									Key::
										This is an indent-based multi-line value.
										This is the second line of the multi-line value.
										And here's a third line.
								*/
								_value = _scoopUpIndentedLines ().join ('\n');
							} else if (_value == '>') {
								/* support for simple arrays listed below key and indented, as in the example...
									Array:>
										Element 1 Value
										Element 2 Value
										Element 3 Value
								*/
								_value = _scoopUpIndentedLines ();
							} else {
								if (_parseName && _value.charAt (0) == '|' && _value.slice (-1) == '|')
									/* support for array value syntax

										this provides a convenient way to declare simple arrays on a single line for a value, as in the example...

										My Array: | value 1 | value 2 | value 3 | value 4 |

									*/
									_value = Uize.String.split (
										_value.replace (_arrayStartRegExp,'').replace (_arrayEndRegExp,''),
										_arrayDelimiterRegExp
									)
								;
							}
							if (_parseName && !_name) {
								var _currentLevelParentValue = _currentLevel._parent.value;
								if (typeof _currentLevelParentValue == _string)
									_currentLevel._parent.value = _currentLevelParentValue ? [_currentLevelParentValue] : []
								;
								_currentLevel._parent.value.push (_value);
								/*
									if there is no non-empty running state member name, then add this child as an element of the value array for the parent. A special case which allows you to easily create array using the syntax...

									My Array : value 1
												: value 2
												: value 3
												: value 4

									In this example, this special case behavior is applying to the "value 2", "value 3", and "value 4" members

									Another form that is also permitted is...

									My Array
										: value 1
										: value 2
										: value 3
										: value 4

									Here, the special case behavior recognizes that the initial value of "My Array" is an empty string and omits it from the value array

									A value array is also augmented, as in the following example...

									My Array: | value 1 | value 2 |
										: value 3
										: value 4
								*/
							} else {
								_children [_indexOfNewChild] = {
									name:_name,
									value:_value,
									children:[]
								};
							}
						}
					}
				}
				_params.collapseChildren && _collapseChildren (_data);
				return _data;
			};

			var _collapseChildren = _package.collapseChildren = function (_data,_defaultForUndefinedValues) {
				var _dataChildren = _data.children;
				delete _data.name;
				delete _data.children;
				delete _data.value;
				if (_dataChildren) {
					var
						_properties = Uize.lookup (_undefined,0,true), // safe empty lookup object
						_totalProperties = 0
					;
					for (var _childNo = -1, _dataChildrenLength = _dataChildren.length; ++_childNo < _dataChildrenLength;) {
						var
							_child = _dataChildren [_childNo],
							_childName = _child.name || '',
							_childValue = _child.children && _child.children.length /*|| typeof _child.value != _string*/
								? _child
								: _child.value
						;
						if (_childValue === _undefined) _childValue = _defaultForUndefinedValues;
						_collapseChildren (_child,_defaultForUndefinedValues);
						if (_properties [_childName]) {
							if (_properties [_childName] == 1) _data [_childName] = [_data [_childName]];
							_data [_childName].push (_childValue);
							_properties [_childName]++;
						} else {
							_totalProperties++;
							_properties [_childName] = 1;
							_data [_childName] = _childValue;
						}
					}
					if (_totalProperties == 1 && _properties [''])
						/* NOTE:
							if all of the children of an item have an empty string for the name, then the item becomes an array of the values of its children
						*/
						_data = _properties [''] == 1 ? [_data ['']] : _data ['']
					;
				}
				return _data;
			};

		return _package;
	}
});
