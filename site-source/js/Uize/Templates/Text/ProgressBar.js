/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.Text.ProgressBar Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Templates.Text.ProgressBar= module is a JavaScript Template module, used for generating a text progress bar string that can be used when outputting to logs, consoles, terminals, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Templates.Text.ProgressBar= module is a simple template module that can be useful in situations where you need to display a visual progress or level indicator using purely text characters.

			For instance, you may wish to display progress updates in a console or terminal window for an automation script that may be long-running, such as a build script. In a console you have only plain text at your disposal. The following example illustrates the possible console output from a hypothetical build script that processes a set of files and builds a package archive file...

			LOG OUTPUT EXAMPLE
			....................................................................
			|█░░░░░░░░░| Prepared job, 8 files to process under ~/files
			|▓█░░░░░░░░| Processed file: ~/files/foo.txt
			|▓▓█░░░░░░░| Processed file: ~/files/bar.txt
			|▓▓▓█░░░░░░| Processed file: ~/files/baz.txt
			|▓▓▓▓█░░░░░| Processed file: ~/files/qux.txt
			|▓▓▓▓▓█░░░░| Processed file: ~/files/more/foo.txt
			|▓▓▓▓▓▓█░░░| Processed file: ~/files/more/bar.txt
			|▓▓▓▓▓▓▓█░░| Processed file: ~/files/more/baz.txt
			|▓▓▓▓▓▓▓▓█░| Processed file: ~/files/more/qux.txt
			|▓▓▓▓▓▓▓▓▓█| Processed 8 files and built package ~/files.zip
			....................................................................

			As the build script progresses through its steps, it uses the =Uize.Templates.Text.ProgressBar= module when constructing the progress update messages it outputs to the console.

			Examples
				The following examples demonstrate the various ways that output from the =Uize.Templates.Text.ProgressBar.process= method can be customized by using the different properties supported by its =inputOBJ= argument.

				Indicating a Progress of 0%
					A progress of 0% can be indicated by specifying the value =0= for the =progress= property of the =inputOBJ= argument.

					EXAMPLE
					.......................................................
					Uize.Templates.Text.ProgressBar.process ({progress:0});
					.......................................................

					OUTPUT
					........................................................................................
					|█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░|
					........................................................................................

				Indicating a Progress of 50%
					A progress of 50% can be indicated by specifying the value =.5= for the =progress= property of the =inputOBJ= argument.

					EXAMPLE
					........................................................
					Uize.Templates.Text.ProgressBar.process ({progress:.5});
					........................................................

					OUTPUT
					........................................................................................
					|▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█░░░░░░░░░░░░░░░░░░░░░░░░|
					........................................................................................

				Indicating a Progress of 100%
					A progress of 100% can be indicated by specifying the value =1= for the =progress= property of the =inputOBJ= argument.

					EXAMPLE
					........................................................
					Uize.Templates.Text.ProgressBar.process ({progress:.5});
					........................................................

					OUTPUT
					........................................................................................
					|▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█|
					........................................................................................

				Specifying a Custom Track Length
					A custom track length can be achieved by specifying the desired track length (measured in characters) for the =trackLength= property of the =inputOBJ= argument.

					EXAMPLE
					.......................................................................
					Uize.Templates.Text.ProgressBar.process ({trackLength:10,progress:.5});
					.......................................................................

					OUTPUT
					...................
					|▓▓▓▓▓█░░░░|
					...................

				Specifying Custom Characters
					The appearance of the progress bar can be controlled by specifying values for the =endsChar=, =fullHeadChar=, and =emptyChar= properties of the =inputOBJ= argument.

					EXAMPLE
					.......................................................................
					Uize.Templates.Text.ProgressBar.process ({
						endsChar:'|',
						fullHeadChar:'#',
						fullChar:'=',
						emptyChar:'-',
						trackLength:20,
						progress:.75
					});
					.......................................................................

					OUTPUT
					......................
					|==============#-----|
					......................
*/

Uize.module ({
	name:'Uize.Templates.Text.ProgressBar',
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
						Uize.Templates.Text.ProgressBar.process
							Returns a string, being the generated text progress bar.

							SYNTAX
							.......................................................................
							textProgressBarSTR = Uize.Templates.Text.ProgressBar.process (inputOBJ);
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
									- the value of this property is defaulted to the "▓" (dark shaded block) character

								fullHeadChar
									An optional string, specifying the characters(s) that should be used for the head of the full portion of the track of the text progress bar.

									The head of the full portion of the progress bar essentially demarcates the progress position.

									NOTES
									- the value for this property may be more than one character in length
									- the value of this property is defaulted to the "█" (solid block) character
									- if an empty string is specified for this property, then the full portion of the text progress bar will not have a head

								emptyChar
									An optional string, specifying the character that should be used for the empty portion of the track of the text progress bar.

									NOTES
									- the value for this property should be exactly one character in length
									- the value of this property is defaulted to the "░" (light shaded block) character

								progress
									A floating point number in the range of =0= to =1=, indicating the progress that should be displayed in the text progress bar.

									A progress value of =0= indicates 0% progress, a value of =.5= indicates 50% progress, and a value of =1= indicates 100% progress.

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
						Uize.Templates.Text.ProgressBar.input
							An object, describing the allowed properties of the =inputOBJ= parameter of the =Uize.Templates.Text.ProgressBar.process= static method.
				*/
			}
		});
	}
});

