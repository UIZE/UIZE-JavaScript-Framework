/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.TextProgressBar Package
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
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Templates.TextProgressBar= module is a JavaScript Template module, used for generating a text progress bar string that can be used when outputting to logs, consoles, terminals, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Templates.TextProgressBar',
	required:'Uize.Str.Repeat',
	builder:function () {
		'use strict';

		return Uize.package ({
			process:function (_input) {
				var
					_trackLength = _input.trackLength || 50,
					_fullHeadChar = _input.fullHeadChar != undefined ? _input.fullHeadChar : '\u2588',
					_trackAvailableLength = _trackLength - _fullHeadChar.length,
					_fullLength = Math.round ((_input.progress || 0) * _trackAvailableLength),
					_endsChar = _input.endsChar != undefined ? _input.endsChar : '|'
				;
				return (
					_endsChar +
					Uize.Str.Repeat.repeat (_input.fullChar || '\u2593',_fullLength) +
					_fullHeadChar +
					Uize.Str.Repeat.repeat (_input.emptyChar || '\u2591',_trackAvailableLength - _fullLength) +
					_endsChar
				);
				/*?
					Static Methods
						Uize.Templates.TextProgressBar.process
							Returns a string, being the generated text progress bar.

							SYNTAX
							.......................................................................
							textProgressBarSTR = Uize.Templates.TextProgressBar.process (inputOBJ);
							.......................................................................

							inputOBJ
								The object specified for the =inputOBJ= parameter may contain the following properties...

								endsChar
									An optional string, specifying the characters(s) that should be used for the left and right ends of the text progress bar.

									NOTES
									- the value for this property may be more than one character in length
									- the value of this property is defaulted to the "|" (pipe) character

								trackLength
									An optional number, specifying the desired length (in characters) of the track for the text progress bar.

									NOTES
									- the value of this property is defaulted to =50=

								fullChar
									An optional string, specifying the character that should be used for the full portion of the track of the text progress bar.

									NOTES
									- the value for this property should be exactly one character in length
									- the value of this property is defaulted to a dark shaded block character

								fullHeadChar
									An optional string, specifying the characters(s) that should be used for the head of the full portion of the track of the text progress bar.

									The head of the full portion of the progress bar essentially demarkates the progress position.

									NOTES
									- the value for this property may be more than one character in length
									- the value of this property is defaulted to the solid block character

								emptyChar
									An optional string, specifying the character that should be used for the empty portion of the track of the text progress bar.

									NOTES
									- the value for this property should be exactly one character in length
									- the value of this property is defaulted to a light shaded block character

								progress
									A floating point number in the range of =0= to =1=, indicating the progress that should be displayed in the text progress bar.

									NOTES
									- the value of this property is defaulted to =0=
				*/
			},
			input:{
				endsChar:'string',
				trackLength:'number',
				fullChar:'string',
				fullHeadChar:'string',
				emptyChar:'string',
				progress:'number'
				/*?
					Static Properties
						Uize.Templates.TextProgressBar.input
							An object, describing the allowed properties of the =inputOBJ= parameter of the =Uize.Templates.TextProgressBar.process= static method.
				*/
			}
		});
	}
});

