/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.Text.Table Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Templates.Text.Table= module is a JavaScript Template module, used for generating a text-based table layout of data that can be used when outputting to logs, consoles, terminals, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Templates.Text.ProgressBar= module is a simple template module that can be useful in situations where you need to display a set of data in table format using purely text characters.

			For instance, you may wish to display a summary of results from a build script in table form in the console, or output such a table to a log file. There are several build scripts in the UIZE JavaScript Framework, for example, that make use of this template module to generate text tables for output to the console.

			To illustrate how this module is used, consider the following example of a text table that is being generated to display some price inflation data for the United Kingdom...

			EXAMPLE
			..........................................................................................
			Uize.Templates.Text.Table.process ({
				title:'Price Inflation in the United Kingdom',
				columns:[
					{title:'Description'},
					{
						title:'Price in 1973',
						align:'right',
						formatter:'value < 1 ? (value * 100).toFixed (0) + "p" : "£" + value.toFixed (2)'
					},
					{
						title:'Price in 2013',
						align:'right',
						formatter:'value < 1 ? (value * 100).toFixed (0) + "p" : "£" + value.toFixed (2)'
					},
					{
						title:'Price Increase',
						align:'right',
						formatter:'value + "%"'
					}
				],
				rows:[
					['Pint of lager',.14,2.87,1948],
					['Loaf of bread',.11,1.30,1082],
					['Apples, per kg',.28,2.02,622],
					['Pint of milk',.06,.46,667],
					['Sausages, per kg',.58,4.84,735],
					['Butter per 250g',.13,1.42,992],
					['Carrots, per kg',.11,.91,723],
					['Sugar, per kg',.11,.93,787],
					['Coffee, per 100g',.28,2.67,853],
					['Dozen eggs',.33,2.78,743],
					['Flour, per 1.5kg',.15,1.19,724],
					['Diesel, per litre',.08,1.41,1727],
					['Average detached house',16980,305391,1699],
					['Gold: troy ounce',34,1051,2952]
				]
			});
			..........................................................................................

			The above statement, when executed, will produce the following multi-line string as its output...

			OUTPUT
			...........................................................................
			+-------------------------------------------------------------------------+
			|                  Price Inflation in the United Kingdom                  |
			+-------------------------------------------------------------------------+
			|      Description       | Price in 1973 | Price in 2013 | Price Increase |
			|------------------------+---------------+---------------+----------------|
			| Pint of lager          |           14p |         £2.87 |          1948% |
			|------------------------+---------------+---------------+----------------|
			| Loaf of bread          |           11p |         £1.30 |          1082% |
			|------------------------+---------------+---------------+----------------|
			| Apples, per kg         |           28p |         £2.02 |           622% |
			|------------------------+---------------+---------------+----------------|
			| Pint of milk           |            6p |           46p |           667% |
			|------------------------+---------------+---------------+----------------|
			| Sausages, per kg       |           58p |         £4.84 |           735% |
			|------------------------+---------------+---------------+----------------|
			| Butter per 250g        |           13p |         £1.42 |           992% |
			|------------------------+---------------+---------------+----------------|
			| Carrots, per kg        |           11p |           91p |           723% |
			|------------------------+---------------+---------------+----------------|
			| Sugar, per kg          |           11p |           93p |           787% |
			|------------------------+---------------+---------------+----------------|
			| Coffee, per 100g       |           28p |         £2.67 |           853% |
			|------------------------+---------------+---------------+----------------|
			| Dozen eggs             |           33p |         £2.78 |           743% |
			|------------------------+---------------+---------------+----------------|
			| Flour, per 1.5kg       |           15p |         £1.19 |           724% |
			|------------------------+---------------+---------------+----------------|
			| Diesel, per litre      |            8p |         £1.41 |          1727% |
			|------------------------+---------------+---------------+----------------|
			| Average detached house |     £16980.00 |    £305391.00 |          1699% |
			|------------------------+---------------+---------------+----------------|
			| Gold: troy ounce       |        £34.00 |      £1051.00 |          2952% |
			+-------------------------------------------------------------------------+
			...........................................................................

			Table Data
				Table data is specified using the =rows= property of the input object passed to the =Uize.Templates.Text.ProgressBar.process= method.

				The value specified for the =rows= property should be an array of column arrays. That is to say, each value in the =rows= array should be a column array that contains values for each of the columns in the table. Therefore, each row array should have the same number of column value elements.

				EXAMPLE
				...........................................................................
				Uize.Templates.Text.Table.process ({
					columns:[
						{title:'Column 1'},
						{title:'Column 2'}
					],
					rows:[
						['foo','bar'],  // values for column 1 and column 2 of the first row
						['baz','qux']   // values for column 1 and column 2 of the second row
					]
				});
				...........................................................................

				In the above example, we are generating a text table with two rows and two columns. The first row contains the values ='foo'= and ='bar'= for the two columns, while the second row contains the values ='baz'= and ='qux'= for the two columns.

				OUTPUT
				.......................
				+---------------------+
				| Column 1 | Column 2 |
				|----------+----------|
				| foo      | bar      |
				|----------+----------|
				| baz      | qux      |
				+---------------------+
				.......................

			Table Title
				The =Uize.Templates.Text.ProgressBar= module allows a title to be specified in the =title= property of the input object passed to the =Uize.Templates.Text.ProgressBar.process= method.

				Title is Optional
					Text tables generated by the =Uize.Templates.Text.ProgressBar= module do not need to contain a title.

					A table without a table can be generated by specifying no =title= property in the input object, or by specifying the value =''= (empty string), =null=, or =undefined= for the =title= property.

					EXAMPLE
					....................................
					Uize.Templates.Text.Table.process ({
						columns:[
							{title:'Column 1'},
							{title:'Column 2'}
						],
						rows:[
							['foo','bar'],
							['baz','qux']
						]
					});
					....................................

					OUTPUT
					.......................
					+---------------------+
					| Column 1 | Column 2 |
					|----------+----------|
					| foo      | bar      |
					|----------+----------|
					| baz      | qux      |
					+---------------------+
					.......................

				Title is Center-aligned
					When a title is specified, it is always center-aligned in the generated text table.

					EXAMPLE
					....................................
					Uize.Templates.Text.Table.process ({
						title:'Foo Table',
						columns:[
							{title:'Column 1'},
							{title:'Column 2'}
						],
						rows:[
							['foo','bar'],
							['baz','qux']
						]
					});
					....................................

					OUTPUT
					.......................
					+---------------------+
					|      Foo Table      |
					+---------------------+
					| Column 1 | Column 2 |
					|----------+----------|
					| foo      | bar      |
					|----------+----------|
					| baz      | qux      |
					+---------------------+
					.......................

			Column Descriptions
				.

				Column Titles
					- column titles are specified using the =title= property of the column description object
					- column titles are required
					- column titles are center-aligned

				Column Alignment
					- by default, column values are left-aligned
					- column alignment can be specified optionally per column
					- column alignment for a column is specified using the =align= property in the column description
					- column values can be left-aligned, center-aligned, right-aligned, or fractionally aligned

				Column Formatters
					- column formatter is called as an instance method on the column description object
					- column formatter is resolved as a value transformer, so a value transformer string expression can be specified

			Column minValue and maxValue
				- minValue and maxValue can optionally be specified explicitly
				- if minValue or maxValue are not explicitly specified, they are calculated

			Column Width
				- column width for a column is calculated as the maximum of the column title width and the width of all the column values
*/

Uize.module ({
	name:'Uize.Templates.Text.Table',
	required:[
		'Uize.Data.Util',
		'Uize.Array.Util',
		'Uize.Str.Repeat'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_repeat = Uize.Str.Repeat.repeat
		;

		return Uize.package ({
			process:function (_input) {
				function _pad (_sourceStr,_length,_align) {
					var
						_totalPadding = _length - _sourceStr.length,
						_leftPadding = Math.floor (
							_totalPadding * (typeof _align == 'string' ? {left:0,center:.5,right:1} [_align] : +_align || 0)
						)
					;
					return _repeat (' ',_leftPadding) + _sourceStr + _repeat (' ',_totalPadding - _leftPadding);
				}

				var
					_title = _input.title,
					_columns = _input.columns,
					_rows = _input.rows
				;

				/*** resolve column information ***/
					Uize.forEach (
						_columns,
						function (_column,_columnNo) {
							var _columnValues = Uize.Data.Util.getColumn (_rows,_columnNo);
							if (!('minValue' in _column)) _column.minValue = Uize.min (_columnValues);
							if (!('maxValue' in _column)) _column.maxValue = Uize.max (_columnValues);
							_column.formatter = Uize.resolveTransformer (_column.formatter);
						}
					);

				/*** format column data and get max width for each column ***/
					var
						_columnMaxWidths = Uize.map (_columns,'value.title.length'),
						_formattedRows = Uize.map (
							_rows,
							function (_row) {
								return Uize.map (
									_columns,
									function (_column,_columnNo) {
										var _formattedValue = _column.formatter (_row [_columnNo]) + '';
										_columnMaxWidths [_columnNo] = Math.max (
											_columnMaxWidths [_columnNo],
											_formattedValue.length
										);
										return _formattedValue;
									}
								);
							}
						)
					;

					/*** distribute extra padding to columns, if title width expands table width ***/
						var
							_columnsLength = _columns.length,
							_tableWidthPerTitle = _title ? 4 + _title.length : 0,
							_tableWidthPerColumns = 4 + Uize.Array.Util.sum (_columnMaxWidths) + (_columnsLength - 1) * 3,
							_paddingToDistribute = _tableWidthPerTitle - _tableWidthPerColumns,
							_paddingDistributed = 0
						;
						if (_paddingToDistribute > 0) {
							Uize.forEach (
								_columnMaxWidths,
								function (_maxWidth,_columnNo) {
									var _newPaddingDistributed = Math.round (
										_paddingToDistribute * (_columnNo + 1) / _columnsLength
									);
									_columnMaxWidths [_columnNo] = _maxWidth + _newPaddingDistributed - _paddingDistributed;
									_paddingDistributed = _newPaddingDistributed;
								}
							);
						}

				/*** produce row dividers ***/
					var
						_columnLines = Uize.map (
							_columnMaxWidths,
							function (_columnMaxWidth) {return Uize.Str.Repeat.repeat ('-',_columnMaxWidth)}
						),
						_rowSeparatorLine = '|-' + _columnLines.join ('-+-') + '-|',
						_topAndBottomLine = '+-' + _columnLines.join ('---') + '-+'
					;

				return (
					(
						_title
							? (_topAndBottomLine + '\n| ' + _pad (_title,_topAndBottomLine.length - 4,'center') + ' |\n')
							: ''
					) +
					_topAndBottomLine + '\n' +
					(
						'| ' +
						Uize.map (
							_columns,
							function (_column,_columnNo) {return _pad (_column.title,_columnMaxWidths [_columnNo],'center')}
						).join (' | ') + ' |'
					) + '\n' +
					_rowSeparatorLine + '\n' +
					Uize.map (
						_formattedRows,
						function (_row) {
							return (
								'| ' +
								Uize.map (
									_row,
									function (_column,_columnNo) {
										return _pad (_column,_columnMaxWidths [_columnNo],_columns [_columnNo].align);
									}
								).join (' | ') +
								' |\n'
							);
						}
					).join (_rowSeparatorLine + '\n') +
					_topAndBottomLine + '\n'
				);
			}
		});
	}
});

