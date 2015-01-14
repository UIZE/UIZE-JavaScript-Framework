/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.Text.Tables.Breakdown Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Templates.Text.Tables.Breakdown= module is a JavaScript Template module, used for generating a text-based counts breakdown table that can be used when outputting to logs, consoles, terminals, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Templates.Text.Tables.Breakdown',
	required:[
		'Uize.Templates.Text.Table',
		'Uize.Templates.Text.ProgressBar'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			process:function (_input) {
				var
					_countByCategory = _input.countByCategory,
					_total = Uize.max (_countByCategory)
				;
				return Uize.Templates.Text.Table.process ({
					title:_input.title,
					columns:[
						{title:'Category'},
						{
							title:'Count',
							align:'right'
						},
						{
							title:'Percent of Total',
							align:'right',
							formatter:function (_value) {
								return (
									(_value * 100).toFixed (1) + '% ' +
									Uize.Templates.Text.ProgressBar.process ({
										trackLength:20,
										endsChar:'',
										fullHeadChar:'',
										progress:_value
									})
								);
							}
						}
					],
					rows:Uize.map (
						Uize.keys (_countByCategory),
						function (_category) {
							var _count = _countByCategory [_category];
							return [_category,_count,_count / _total];
						}
					)
				});
			}
		});
	}
});

