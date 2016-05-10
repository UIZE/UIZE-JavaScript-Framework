/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Templates.Text.ProgressBar Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Templates.Text.ProgressBar= module defines basic unit tests for the =Uize.Templates.Text.ProgressBar= JavaScript template module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Templates.Text.ProgressBar',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Templates.Text.ProgressBar JavaScript Template',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Templates.Text.ProgressBar'),
				Uize.Test.staticMethodsTest ([
					['Uize.Templates.Text.ProgressBar.process',[
						/*** test progress values ***/
							['A text progress bar can be generated to depict no progress',
								{
									progress:0,
									endsChar:'|',
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'#',
									trackLength:10
								},
								'|#---------|'
							],
							['A text progress bar can be generated to depict 50% progress',
								{
									progress:.5,
									endsChar:'|',
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'#',
									trackLength:10
								},
								'|=====#----|'
							],
							['A text progress bar can be generated to depict 100% progress',
								{
									progress:1,
									endsChar:'|',
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'#',
									trackLength:10
								},
								'|=========#|'
							],

						/*** test support for custom characters ***/
							['A multi-character ends char can be specified, and the length of the ends char does not affect the track length',
								{
									progress:.5,
									endsChar:'||',
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'#',
									trackLength:10
								},
								'||=====#----||'
							],
							['A multi-character full head char can be specified, and the length of the full head char eats into the length of the full and empty portions of the track so that the overall track lengths remains the same',
								{
									progress:.5,
									endsChar:'|',
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'[#]',
									trackLength:10
								},
								'|====[#]---|'
							],
							['A multi-character full head char is positioned correctly when the progress is 0',
								{
									progress:0,
									endsChar:'|',
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'[#]',
									trackLength:10
								},
								'|[#]-------|'
							],
							['A multi-character full head char is positioned correctly when the progress is 1',
								{
									progress:1,
									endsChar:'|',
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'[#]',
									trackLength:10
								},
								'|=======[#]|'
							],

						/*** test defaulting for various properties ***/
							['When the endsChar property is not specified, it is defaulted to the "|" (pipe) character',
								{
									progress:0,
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'#',
									trackLength:10
								},
								'|#---------|'
							],
							['When an empty string is specified for the endsChar property, then there are no ends characters - the property is not defaulted',
								{
									progress:0,
									fullChar:'=',
									emptyChar:'-',
									endsChar:'',
									fullHeadChar:'#',
									trackLength:10
								},
								'#---------'
							],
							['When the progress property is not specified, it is defaulted to 0',
								{
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'#',
									trackLength:10
								},
								'|#---------|'
							],
							['When the trackLength property is not specified, it is defaulted to 50',
								{
									fullChar:'=',
									emptyChar:'-',
									fullHeadChar:'#'
								},
								'|#-------------------------------------------------|'
							],
							['When the fullChar property is not specified, it is defaulted to \u2593',
								{
									progress:1,
									fullHeadChar:'#',
									trackLength:2
								},
								'|\u2593#|'
							],
							['When the emptyChar property is not specified, it is defaulted to \u2591',
								{
									progress:0,
									fullHeadChar:'#',
									trackLength:2
								},
								'|#\u2591|'
							],
							['When the fullHeadChar property is not specified, it is defaulted to \u2588',
								{
									progress:1,
									trackLength:1
								},
								'|\u2588|'
							],
							['When an empty string is specified for the fullHeadChar property, then there is no full head character - the property is not defaulted',
								{
									progress:1,
									trackLength:1,
									fullChar:'=',
									fullHeadChar:''
								},
								'|=|'
							]
					]]
				])
			]
		});
	}
});

