/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Template Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 8
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Template= module implements a [[../explainers/javascript-templates.html][JavaScript Templates]] system, with rich template functionality that fully leverages the JavaScript language.

		*DEVELOPERS:* `Chris van Rensburg`

		Definition of Terms
			For the sake of this document, a number of commonly used terms are defined below.

			This is not, however, an exhaustive list of all the terms or concepts that comprise the JavaScript templates system. If you are not already familiar with this system, consult the [[../explainers/javascript-templates.html][JavaScript Templates]] explainer for background reading.

			Encoding
				The =Uize.Template= module supports the concept of an encoding.

				An encoding is defined in an `encoding profile`, which defines how to encode to and decode from the encoding. The =Uize.Template= module defines many built-in standard encodings, such as the =json=, =urlParams=, =tagAttributeValue=, and other encodings. Encodings can be conveniently used inside templating assignment statements, as shown in the following example...

				EXAMPLE
				.............................................
				<%= {hello:'world',foo:'bar'} -> urlParams %>
				.............................................

				The above example is encoding the URL query parameters object to a URL parameters string by using the =urlParams= encoding, producing the string result ='hello&#61;world&foo&#61;bar'=.

				Encodings can also be used in the =Uize.Template.encode= and =Uize.Template.decode= static methods. Consider the following example...

				EXAMPLE
				................................................................................
				var urlParamsStr = Uize.Template.encode ({hello:'world',foo:'bar'},'urlParams');
				................................................................................

				After the above code has been executed, the value of the =urlParamsStr= variable will be the string ='hello&#61;world&foo&#61;bar'=.

				Modules Required to Support Encodings
					It's important to note that different encodings require different JavaScript modules to support them, and these modules are not directly required by the =Uize.Template= module.

					This is by design and allows templates with diverse encoding needs to be compiled without having to have all modules loaded just in order to compile them. It is only when they are to be processed that the modules required by the encodings used in them will need to be loaded. This rule applies to template functions compiled using the =Uize.Template.compile= static method, as well as to using the =Uize.Template.encode= and =Uize.Template.decode= static methods.

					When a template is compiled using the =Uize.Template.compile= method with the value ='full'= specified for its optional =templateOptionsOBJ= parameter, then the object returned by this method will contain a =required= property, which will be an array containing the list of all modules required by the template, including modules required by encodings used, along with any required modules declared using the =@required= directive.

					The important point to remember is that an encoding can only be executed if the modules that it requires are loaded, otherwise an error will occur.

			Encodings Chain
				The =Uize.Template= module supports the concept of an encodings chain, which is a set of multiple encodings that are to be chained together and performed in sequence.

				EXAMPLE
				.......................................................................
				<a href="search?<% .searchParams -> urlParams -> tagAttributeValue %>">
					<% .searchParams.category %>
				</a>
				.......................................................................

				In the above example, the =searchParams= property of the template's =input= object is a reference to an object that contains properties for various search parameters. The =Uize.Template.encode= method is being used to first encode this object to a URL query paramaters string using the =urlParams= encoding, after which it is then encoded to a tag attribute value using the =tagAttributeValue= encoding.

				The =Uize.Template.encode= and =Uize.Template.decode= static methods also allow an Encodings Chain to be specified for their =encodingsChainSTR= parameter, as shown in the example below...

				EXAMPLE
				.............................................................
				var searchUrlParamsTagAttributeValue = Uize.Template.encode (
					searchParamsObj,
					'urlParams -> tagAttributeValue'
				);
				.............................................................

			Encoding Profile
				An `encoding` is defined using an encoding profile, which is an object containing definitions for the encoder and decoder for the encoding.

				SYNTAX
				...................................................
				{
					to:{
						required  : encoderRequiredModulesSTRorARRAY,
						expansion : encoderExpansionFUNC
					},
					from:{
						required  : decoderRequiredModulesSTRorARRAY,
						expansion : decoderExpansionFUNC
					}
				}
				...................................................

				The =to= property of the Encoding Profile object defines how to encode to the encoding, while the =from= property defines how to decode from the encoding. Both the =to= and =from= properties' values should be objects containing =required= and =expansion= properties, where the =required= property's value can be a string or array specifying the name(s) of one or more modules required by the encoder/decoder, and where the =expansion= property's value should be a function that should accept value string and encoding options string parameters and output an expanded expression that can be evaluated to perform the encoding or decoding. This is best illustrated with an example...

				EXAMPLE
				..........................................................................................
				Uize.Template.encoding.json = {
					to:{
						required:'Uize.Json',
						expansion:function (_valueStr,_optionsStr) {
							return 'Uize.Json.to (' + _valueStr + (_optionsStr && ',') + _optionsStr + ')';
						}
					},
					from:{
						required:'Uize.Json',
						expansion:function (_valueStr) {
							return 'Uize.Json.from (' + _valueStr + ')';
						}
					}
				}
				..........................................................................................

				In the above example, the =json= encoding is being defined. Notice that both the encoder (=to=) and decoder (=from=) both require the =Uize.Json= module. The =expansion= function for the encoder is constructing a snippet of code that calls the =Uize.Json.to= static method, plugging in the values of its =_valueStr= and =_optionsStr= parameters. If the value of the =_optionsStr= parameter is an empty string, then the second parameter is omitted from the =Uize.Json.to= method call that is being constructed. Similarly, the =expansion= function for the decoder is constructing a snippet of code that calls the =Uize.Json.from= static method, but this function ignores its second parameter since the =Uize.Json.from= method doesn't support any encoding options.

			Standard Encoding
				A standard encoding is an `encoding` whose encoder and decoder functions are static methods of the same module, and where those static methods accept as their first parameter a value to encode or decode, and as their optional second parameter encoding options.

				A standard encoding can be conveniently defined using the =Uize.Template.defineStandardEncoding= static method, by only specifying a few parameters and without having to flesh out the entire `encoding profile`. The majority of `encodings` that are built into the =Uize.Template= module are standard encodings. As an example, the =json= encoding can easily be defined with the statement...

				......................................................................
				Uize.Template.defineStandardEncoding ('json','Uize.Json','to','from');
				......................................................................
*/

Uize.module ({
	name:'Uize.Template',
	required:[
		'Uize.String',
		'Uize.String.Replace'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_string = 'string',
				_Uize_String = Uize.String,
				_Uize_String_splitInTwo = _Uize_String.splitInTwo,
				_Uize_String_trim = _Uize_String.trim,
				_jsonStringLiteralEscaper = _Uize_String.Replace.replacerByLookup ({
					'\\':'\\\\',
					'\n':'\\n',
					'\r':'\\r',
					'\'':'\\\''
				})
			;

		/*** General Variables ***/
			var
				_sacredEmptyObject = {},
				_codeChunkStartsWithEqualsRegExp = /^\s*=/,
				_codeChunkStartsWithAtRegExp = /^\s*@/,
				_codeChunkStartsWithPeriodRegExp = /^\s*\./,
				_encodingStartsWithInverseRegExp = /^!\s*/,
				_trailingLinebreakAndPossibleWhitespaceRegExp = /(\r|\n|\r\n)[ \t]*$/,
				_precedingLinebreakInPossibleWhitespaceRegExp = /^[ \t]*(\r|\n|\r\n)[ \t]*/,
				_encodingsDelimiter = '->',
				_encodingsChainCache = {}
			;

		/*** Utility Functions ***/
			function _expandEncodingsChain (_expression,_encodings,_reverse,_requiredHandler) {
				if (_encodings) {
					_encodings = _encodings.split (_encodingsDelimiter);
					for (
						var
							_encodingNo = -1,
							_encodingsLength = _encodings.length,
							_encodingNameAndParams,
							_encodingName,
							_encodingReverse,
							_encoding
						;
						++_encodingNo < _encodingsLength;
					) {
						if (
							_encodingName = _Uize_String_trim (
								(
									_encodingNameAndParams = _Uize_String_splitInTwo (
										_encodings [_reverse ? _encodingsLength - _encodingNo - 1 : _encodingNo],
										'{'
									)
								) [0]
							)
						) {
							if (_encodingReverse = _encodingStartsWithInverseRegExp.test (_encodingName))
								_encodingName = _encodingName.replace (_encodingStartsWithInverseRegExp,'')
							;
							if (_encoding = _package.encodings [_encodingName]) {
								if (_reverse) _encodingReverse = !_encodingReverse;
								var
									_encodingParams = _Uize_String_trim (_encodingNameAndParams [1]),
									_encoderOrDecoderProfileProperty = _encodingReverse ? 'from' : 'to',
									_encoderOrDecoderProfile = _encoding [_encoderOrDecoderProfileProperty]
								;
								_requiredHandler &&
									_requiredHandler (
										_encodingName + ':' + _encoderOrDecoderProfileProperty,
										_encoderOrDecoderProfile.required
									)
								;
								_expression = _encoderOrDecoderProfile.expansion (
									_expression,
									_encodingParams ? ('{' + _encodingParams) : ''
								);
							}
						}
					}
				}
				return _expression;
			}

		/*** Public Static Methods ***/
			_package.compile = function (_template,_templateOptions) {
				_templateOptions = _templateOptions || _sacredEmptyObject;
				var
					_required = [],
					_alreadyRequired = {},
					_encoderOrDecoderAlreadyUsed = {},
					_input = {},
					_openerToken = _templateOptions.openerToken || '<%',
					_closerToken = _templateOptions.closerToken || '%>',
					_gobbleWhitespace = _templateOptions.gobbleWhitespace !== _false,
					_templateLength = _template.length,
					_blockFirstChunk = 'var output = [];',
					_blockLastChunk = 'return output.join (\'\');',
					_templateFunctionChunks = [_blockFirstChunk],
					_pushToOutputBuffer = [],
					_tokenEnd = 0,
					_tokenStart,
					_notAtEnd = _true,
					_staticSegment, _codeChunk, _codeChunkIsDirective, _codeChunkIsAssignment, _codeChunkIsAssignmentOrParam
				;
				function _pushToTemplateFunctionChunks (_codeChunk) {
					if (_pushToOutputBuffer.length) {
						_templateFunctionChunks.push ('output.push (' + _pushToOutputBuffer.join (',') + ');');
						_pushToOutputBuffer = [];
					}
					_templateFunctionChunks.push (_codeChunk);
				}

				/*** compiler directives ***/
					/*** interface type directives ***/
						function required (_requiredModules) {
							Uize.forEach (
								typeof _requiredModules == _string ? _requiredModules.split (',') : _requiredModules,
								function (_requiredModuleName) {
									if (!_alreadyRequired [_requiredModuleName]) {
										_required.push (_requiredModuleName);
										_alreadyRequired [_requiredModuleName] = 1;
									}
								}
							);
							/*?
								Directives
									@required
										Lets you specify modules that are required by the code inside a JavaScript template.

										SYNTAX
										.......................................
										<%@ required (moduleNamesSTRorARRAY) %>
										.......................................

										The =moduleNamesSTRorARRAY= parameter can be used to specify one or more module names, either in the form of a comma-separated module names string, or as an array of module name strings. The entire list of modules required for your template to process is returned in the =required= property of the =Uize.Template.compile= method's result, when the value ='full'= is specified for its optional =templateOptionsOBJ= parameter.

										EXAMPLE 1
										............................
										<%@ required ('Uize.Xml') %>
										............................

										In the above example, the =@required= directive declares that the template needs the =Uize.Xml= module for its processing.

										EXAMPLE 2
										.......................................
										<%@ required ('Uize.Xml,Uize.Color') %>
										.......................................

										Here, the =@required= directive declares that both the =Uize.Xml= and =Uize.Color= modules are needed for the module's processing.

										EXAMPLE 3
										...........................................
										<%@ required (['Uize.Xml','Uize.Color']) %>
										...........................................

										As an alternative to a comma-separated module names string, the =Uize.Xml= and =Uize.Color= modules can be specified as individual string elements of a module names array.

										Multiple Calls
											You can call the =@required= directive multiple times inside the same template, which will have a cumulative effect in building up the required modules list.

											So, for example, the following template code...

											.............................
											<%@ required ('Uize.Xml') %>
											<%@ required ('Uize.Date') %>
											.............................

											...is equivalent to...

											..........................................
											<%@ required (['Uize.Xml','Uize.Date']) %>
											..........................................

										Deduplication
											When building up the canonical list of modules required by a template being compiled, the =@required= directive makes sure to ignore any duplicate instances of required modules.

											This applies both to duplicates that may occur within a single =@required= call, as well as duplicates that may arise across multiple =@required= calls. While duplicates are not a very likely occurrence, this protection does exist to prevent duplicates in the =required= property of the =Uize.Template.compile= method's full form result object.

											EXAMPLE
											..........................................................
											<%@ required ('Uize.Xml,Uize.Json,Uize.Color,Uize.Xml') %>
											<%@ required ('Uize.Color') %>
											<%@ required (['Uize.Date','Uize.String','Uize.Date']) %>
											..........................................................

											In the above example, the very first =@required= call has two entries for the =Uize.Xml= module. Then, the second call repeats the =Uize.Color= module that occurred in the first call. Finally, the third call, while using the array form for specifying the required modules, has a duplicate entry for the =Uize.Date= module. In this example, the final list of required modules would be =['Uize.Xml','Uize.Json','Uize.Color','Uize.Date','Uize.String']=.
							*/
						}
						function input (_inputProfiles) {
							Uize.copyInto (_input,_inputProfiles);
							/*?
								Directives
									@input
										Lets you specify information about the inputs that a JavaScript template supports.

										SYNTAX
										..............................
										<%@ input (inputProfileOBJ) %>
										..............................

										The complete input profile, describing all the inputs that your template accepts, is returned in the =input= property of the =Uize.Template.compile= method's result, when the value ='full'= is specified for its optional =templateOptionsOBJ= parameter.

										EXAMPLE
										..................................
										<%@ input ({idPrefix:'string'}) %>
										..................................

										In the above example, the =@input= directive declares that the template accepts the =idPrefix= input.

										You can specify profiles for multiple inputs at a time in the =inputProfileOBJ= parameter, simply by having multiple properties in the obejct. You can also call the =@input= directive multiple times inside the same template, which will have a cumulative effect in building up the input profile for the template.

										So, for example, the following template code...

										......................................
										<%@ input ({idPrefix:'string'}) %>
										<%@ input ({displayTitle:'string'}) %>
										......................................

										...is equivalent to...

										........................................................
										<%@ input ({idPrefix:'string',displayTitle:'string'}) %>
										........................................................
							*/
						}

					/*** block directives ***/
						function startBlock (_blockName,_paramsList) {
							_pushToTemplateFunctionChunks (
								'function ' + _blockName + ' (' + (_paramsList || '') + ') {' + _blockFirstChunk
							);
							/*?
								Directives
									@startBlock
										Lets you specify the start of a block of template code.

										SYNTAX
										................................
										<%@ startBlock (blockNameSTR) %>
										................................

										Once a block is defined using the =@startBlock= and =@endBlock= directives, the block is then accessible for use with a simple function call. Essentially, the block directives define a function by the name =blockName= that you can then use in subsequent JavaScript code in your template that executes at processing time.

										EXAMPLE
										.......................................................................................
										<%@ startBlock ('fancyRule') %>
										<div style="width:100%; height:5px; background:url(rule.jpg) repeat-x left top;"></div>
										<%@ endBlock () %>
										<p>This is section 1.</p>
										<%= fancyRule () %>
										<p>This is section 2.</p>
										<%= fancyRule () %>
										<p>This is section 3.</p>
										<%= fancyRule () %>
										<p>This is section 4.</p>
										.......................................................................................

										In the above example, a block called =fancyRule= is being defined, that generates output for a decorated rule using a styled =div= tag. The block is then used within the rest of the template code to insert the decorated rule into the main output for the template, between each section paragraph.

										VARIATION
										..............................................
										<%@ startBlock (blockNameSTR,paramsListSTR) %>
										..............................................

										The optional =paramsListSTR= parameter lets you specify a list of parameters that your template block handles. The parameter list string should be formatted as a comma-separated list of parameter names.

										EXAMPLE
										...............................................................
										<%@ startBlock ('thumbnail','title') %>
										<% var filename = title.toLowerCase ().replace (/\s+/g,'-'); %>
										<a href="../photos/700x500/<%= filename %>.jpg">
											<img
												src="../photos/105x75/<%= filename %>.jpg"
												width="105" height="75"
												alt="<%= title %>"
											/>
										</a>
										<%@ endBlock () %>
										<%= thumbnail ('Pink and Yellow Sunset') %>
										<%= thumbnail ('Braving the Onslaught') %>
										<%= thumbnail ('Companion to a Sunset') %>
										<%= thumbnail ('Concrete Eternity') %>
										<%= thumbnail ('Corrugate It') %>
										...............................................................

										In the above example, a block called =thumbnail= is being defined, that takes the single parameter =title=. After the block is defined, it is called multiple times with different values for the block's =title= parameter. The block uses the parameter in generating its output. The block's function returns the block's generated output. The result of each call to the =thumbnail= block's function is being assigned to the template's main output, using the =&#60;%&#61;= syntax.
							*/
						}
						function endBlock () {
							_pushToTemplateFunctionChunks (_blockLastChunk + '}');
							/*?
								Directives
									@endBlock
										Lets you specify the end of a block of template code.

										SYNTAX
										..................
										<%@ endBlock () %>
										..................

										For a more detailed discussion of the block directives, see the reference for the =@startBlock= directive.
							*/
						}

				while (_notAtEnd) {
					_tokenStart = _template.indexOf (_openerToken,_tokenEnd);
					if (_tokenStart < 0)
						_tokenStart = _templateLength
					;
					_staticSegment = _template.slice (_tokenEnd,_tokenStart);
					if (_notAtEnd = _tokenStart < _templateLength) {
						_tokenEnd = _template.indexOf (_closerToken,_tokenStart += 2);
						_codeChunkIsAssignment = _codeChunkStartsWithEqualsRegExp.test (
							_codeChunk = _template.slice (_tokenStart,_tokenEnd)
						);
						_codeChunkIsAssignmentOrParam =
							_codeChunkIsAssignment || _codeChunkStartsWithPeriodRegExp.test (_codeChunk)
						;
						_codeChunkIsDirective =
							!_codeChunkIsAssignmentOrParam && _codeChunkStartsWithAtRegExp.test (_codeChunk)
						;
						_tokenEnd += 2;
					}
					if (_staticSegment) {
						if (
							_gobbleWhitespace && _notAtEnd && !_codeChunkIsAssignmentOrParam &&
							_trailingLinebreakAndPossibleWhitespaceRegExp.test (_staticSegment) &&
							_precedingLinebreakInPossibleWhitespaceRegExp.test (_template.substr (_tokenEnd))
						)
							/* NOTE: support for whitespace gobbling
								Rather than having modifiers (like in Template Toolkit) to explicitly gobble leading and/or trailing whitespace and linebreaks, this code assumes that if the preceding static segment ends with a linebreak and possible whitespace, and the current code chunk is followed by a linebreak amongst possible whitespace characters, then the trailing linebreak and whitespace should be gobbled from the previous static segment.
							*/
							_staticSegment = _staticSegment.replace (_trailingLinebreakAndPossibleWhitespaceRegExp,'')
						;
						_staticSegment &&
							_pushToOutputBuffer.push ('\'' + _jsonStringLiteralEscaper (_staticSegment) + '\'')
						;
					}
					if (_notAtEnd) {
						if (_codeChunkIsAssignmentOrParam) {
							/* NOTE: support for expressions
								param shortcut syntax
									<%. param %>
									<%. param -> encoding %>
									<%. param -> encoding{encodingOptions} %>
									<%. param -> encoding1 -> encoding2 %>
									<%. param -> encoding1{encodingOptions} -> encoding2 %>
								JavaScript expression shortcut
									<%= expression %>
									<%= expression -> encoding1 -> encoding2 %>
							*/
							var _expressionAndEncodings = _Uize_String_splitInTwo (
								_codeChunkIsAssignment
									? _codeChunk.replace (_codeChunkStartsWithEqualsRegExp,'')
									: 'input' + _codeChunk,
								_encodingsDelimiter
							);
							_pushToOutputBuffer.push (
								_expandEncodingsChain (
									_Uize_String_trim (_expressionAndEncodings [0]),
									_expressionAndEncodings [1],
									_false,
									function (_encoderOrDecoderKey,_encoderOrDecoderRequired) {
										if (!_encoderOrDecoderAlreadyUsed [_encoderOrDecoderKey]) {
											required (_encoderOrDecoderRequired);
											_encoderOrDecoderAlreadyUsed [_encoderOrDecoderKey] = 1;
										}
									}
								)
							);
						} else if (_codeChunkIsDirective) {
							eval (_codeChunk.replace (_codeChunkStartsWithAtRegExp,''));
						} else {
							_pushToTemplateFunctionChunks (_codeChunk);
						}
					}
				}
				_pushToTemplateFunctionChunks (_blockLastChunk);
				var
					_templateFunctionCode = _templateFunctionChunks.join ('\n'),
					_templateFunction = Function ('input',_templateFunctionCode)
				;
				return (
					_templateOptions.result == 'full'
					? {
						input:_input,
						required:_required,
						code:_templateFunctionCode,
						templateFunction:_templateFunction
					}
					: _templateFunction
				);
				/*?
					Static Methods
						Uize.Template.compile
							Compiles a JavaScript template to a function for high performance repeat usage.

							SYNTAX
							..............................................................................
							compiledTemplateFUNC = Uize.Template.compile (templateSTR,templateOptionsOBJ);
							..............................................................................

							templateOptionsOBJ
								The =templateOptionsOBJ= parameter lets you specify options for how the template should be compiled, and has properties as follows...

								PROPERTIES
								..........................................................................
								{
									openerToken:openerTokenSTR,            // optional, defaults to <%
									closerToken:closerTokenSTR,            // optional, defaults to %>
									gobbleWhitespace:gobbleWhitespaceBOOL, // optional, defaults to true
									result:resultTypeSTR                   // 'function' (default) | 'full'
								};
								..........................................................................

								openerToken
									A string, specifying the characters that should delimit the start of a segment of template code. Defaults to =&#60;%=.

								closerToken
									A string, specifying the characters that should delimit the end of a segment of template code. Defaults to =%&#62;=.

								gobbleWhitespace
									A boolean, specifying whether or not the automatic whitespace gobbling mechanism should be enabled. Defaults to =true=.

								result
									A string, specifying how the =Uize.Template.compile= method should return its result. The default value ='function'= will cause the method to return just a reference to the compiled template function. The value ='full'= will cause the method to return an object comprised of the following items...

									FULL RESULT
									..................................................................................
									{
										input:inputProfileOBJ,        // a profile of the input handled by the template
										required:moduleNamesARRAY,    // a list of modules required by the template
										code:templateCodeSTR,         // implementation code for the template function
										templateFunction:templateFUNC // a reference to the compiled template function
									}
									..................................................................................
				*/
			};

			/*** encoding/decoding methods ***/
				_package.encode = function (_source,_encodings,_reverse) {
					var _encodingsChainCacheKey = (_reverse ? '! ' : '') + _encodings;
					return (
						(
							_encodingsChainCache [_encodingsChainCacheKey] ||
							(
								_encodingsChainCache [_encodingsChainCacheKey] = Function (
									'e',
									'return ' + _expandEncodingsChain ('e',_encodings,_reverse)
								)
							)
						) (_source)
					);
					/*?
						Static Methods
							Uize.Template.encode
								Encodes the specified value, using the specified encoding(s).

								SYNTAX
								..........................................................................
								encodedANYTYPE = Uize.Template.encode (toEncodeANYTYPE,encodingsChainSTR);
								..........................................................................

								EXAMPLE
								.....................................
								urlParamsStr = Uize.Template.encode (
									{
										category:'Dogs and Cats',
										type:'all',
										sort:'recent',
										resultsPerPage:20
									},
									'urlParams'
								);
								.....................................

								The above example would produce the string output...

								................................................................
								category=Dogs%20and%20Cats&type=allsort=recent&resultsPerPage=20
								................................................................

								Encodings With Encoding Options
									The =Uize.Template.encode= method allows encoding options to be specified for encodings in the =encodingsChainSTR= parameter, in the same way one would do so in templating assignment statements.

									EXAMPLE
									...............................................
									var attributeValuesStr = Uize.Template.encode (
										{HELLO:'world',FOO:'bar'},
										'tagAttributes{nameCase:\'lower\'}'
									);
									...............................................

									After the above code has executed, the value of the =attributeValuesStr= variable will be the string ='hello&#61;"world" foo&#61;"bar"'=. This is because the value ='lower'= is being specified for the =nameCase= encoding option of the =tagAttributes= encoding. Encoding options for an encoding are specified in curly braces after the encoding's name.

								Using an Encodings Chain
									The =Uize.Template.encode= method allows an `encodings chain` to be specified in the =encodingsChainSTR= parameter, using the same syntax one would use for templating assignment statements.

									EXAMPLE
									.............................................................
									var searchUrlParamsTagAttributeValue = Uize.Template.encode (
										searchParamsObj,
										'urlParams -> tagAttributeValue'
									);
									.............................................................

									In the above example, the =searchParams= variable is a reference to an object that contains properties for various search parameters. The =Uize.Template.encode= method is being used to first encode this object to a URL query paramaters string using the =urlParams= encoding, after which it is then encoded to a tag attribute value using the =tagAttributeValue= encoding.
					*/
				};

				_package.decode = function (_toDecode,_encoding) {return _package.encode (_toDecode,_encoding,_true)};
					/*?
						Static Methods
							Uize.Template.decode
								Decodes the specified value, by reversing the specified encoding(s).

								SYNTAX
								..........................................................................
								decodedANYTYPE = Uize.Template.decode (toDecodeANYTYPE,encodingsChainSTR);
								..........................................................................

								EXAMPLE
								......................................................................
								urlParamsObj = Uize.Template.decode (
									'category=Dogs%20and%20Cats&type=allsort=recent&resultsPerPage=20',
									'urlParams'
								);
								......................................................................

								The above example would produce the following URL query parameters object value for the =urlParamsObj= variable...

								............................
								{
									category:'Dogs and Cats',
									type:'all',
									sort:'recent',
									resultsPerPage:20
								}
								............................

								Encodings With Encoding Options
									The =Uize.Template.decode= method allows encoding options to be specified for encodings in the =encodingsChainSTR= parameter, in the same way one would do so in templating assignment statements.

									EXAMPLE
									..........................................
									var attributesObj = Uize.Template.decode (
										'hello="world" foo="bar"',
										'tagAttributes{nameCase:\'upper\'}'
									);
									..........................................

									After the above code has executed, the value of the =attributesObj= variable will be the attributes object ={HELLO:'world',FOO:'bar'}=. This is because the value ='upper'= is being specified for the =nameCase= encoding option of the =tagAttributes= encoding. Encoding options for an encoding are specified in curly braces after the encoding's name.

								Using an Encodings Chain
									The =Uize.Template.decode= method allows an `encodings chain` to be specified in the =encodingsChainSTR= parameter, using the same syntax one would use for templating assignment statements.

									EXAMPLE
									............................................
									var searchParamsObj = Uize.Template.decode (
										searchUrlParamsTagAttributeValue,
										'urlParams -> tagAttributeValue'
									);
									............................................

									In the above example, the value of the =searchUrlParamsTagAttributeValue= variable is a string that contains URL query paramaters that have been encoded to a string using the =urlParams= encoding, and have been further encoded to a tag attribute value using the =tagAttributeValue= encoding.

									The value ='urlParams -> tagAttributeValue'= for the =encodingsChainSTR= parameter specifies the encodings that were applied to the value that is being decoded - the encodings that will have to be reversed in order to decode from the ='urlParams -> tagAttributeValue'= compound encoding. The =Uize.Template.decode= method here is decoding the string by reversing the direction of the ='urlParams -> tagAttributeValue'= `encodings chain`, producing as its result a URL query paramaters object.

									It's worth pointing out that you could accomplish the same effect by using the =Uize.Template.encode= method and reversing the order of encodings in the chain, as well as reversing the direction of the individual encodings by toggling the "!" prefix in front of the encodings. So, the following example using the =Uize.Template.encode= method would have the same outcome as the example using the =Uize.Template.decode= method that is shown above...

									............................................
									var searchParamsObj = Uize.Template.encode (
										searchUrlParamsTagAttributeValue,
										'!tagAttributeValue -> !urlParams'
									);
									............................................

									The benefit of using the =Uize.Template.decode= method is that it does the reverse mapping for you, which is especially useful if you have a specific `encodings chain` stored in some string variable and you want to easily encode to and decode from that compound encoding.
					*/

			var _defineStandardEncoding = _package.defineStandardEncoding = function (
				_encodingName,_moduleName,_encoderMethodName,_decoderMethodName
			) {
				var
					_decoderCallPrefix = _moduleName + '.' + _decoderMethodName + ' (',
					_encoderCallPrefix = _moduleName + '.' + _encoderMethodName + ' ('
				;
				_package.encodings [_encodingName] = {
					to:{
						required:_moduleName,
						expansion:function (_valueStr,_optionsStr) {
							return _encoderCallPrefix + _valueStr + (_optionsStr && ',') + _optionsStr + ')'
						}
					},
					from:{
						required:_moduleName,
						expansion:function (_valueStr,_optionsStr) {
							return _decoderCallPrefix + _valueStr + (_optionsStr && ',') + _optionsStr + ')'
						}
					}
				};
				/*?
					Static Methods
						Uize.Template.defineStandardEncoding
							Lets you conveniently extend the =Uize.Template= module by defining a new `standard encoding`.

							SYNTAX
							......................................................................................
							Uize.Template.defineStandardEncoding (
								encodingNameSTR,       // name of the encoding
								moduleNameSTR,         // name of module containing the encoder and decoder methods
								encoderMethodNameSTR,  // name of the encoder static method
								decoderMethodNameSTR   // name of the decoder static method
							);
							......................................................................................

							The =Uize.Template.defineStandardEncoding= method provides a shortcut way of defining an encoding for the common case where the encoding's encoder and decoder functions are static methods of the same module. Instead of having to specify the whole `encoding profile` structure, the =Uize.Template.defineStandardEncoding= method takes care of building it for you, from the details you provide in the =encodingNameSTR=, =moduleNameSTR=, =encoderMethodNameSTR=, and =decoderMethodNameSTR= parameters.

							Parameters
								encodingNameSTR
									A string, specifying the name of the encoding.

									The value of the =encodingNameSTR= parameter will be used as the name of the property assigned on the =Uize.Template.encodings= object to store the `encoding profile` for the newly defined encoding.

								moduleNameSTR
									A string, specifying the name of the module that contains the encoder and decoder methods for the encoding.

								encoderMethodNameSTR
									A string, specifying the name of the static method that is to be used for encoding, and that is defined inside the module specified by the =moduleNameSTR= parameter.

									The value of this parameter should not include the module name specified in the =moduleNameSTR= parameter. For example, for the static method =Uize.Json.to=, the value ='to'= should be specified for the =encoderMethodNameSTR= parameter.

								decoderMethodNameSTR
									A string, specifying the name of the static method that is to be used for decoding, and that is defined inside the module specified by the =moduleNameSTR= parameter.

									The value of this parameter should not include the module name specified in the =moduleNameSTR= parameter. For example, for the static method =Uize.Json.from=, the value ='from'= should be specified for the =decoderMethodNameSTR= parameter.

							EXAMPLE
							......................................................................
							Uize.Template.defineStandardEncoding ('json','Uize.Json','to','from');
							......................................................................

							The above example defines the =json= `standard encoding`. The value of the =encodingNameSTR= parameter is ='json'=. The value of the =moduleNameSTR= parameter is ='Uize.Json'=, because the =Uize.Json= module is the module that contains the encoder and decoder methods for this encoding. The value of the =encoderMethodNameSTR= parameter is ='to'=, because the =Uize.Json.to= static method is to be used for encoding. Similarly, the value of the =decoderMethodNameSTR= parameter is ='from'=, because the =Uize.Json.from= static method is to be used for decoding.

							NOTES
							- see the related =Uize.Template.encodings= static property
				*/
			};

		/*** Public Static Properties ***/
			_package.encodings = {};
				/*?
					Static Properties
						Uize.Template.encodings
							An object, containing properties defining all the available `encodings`, where the value for each property is an `encoding profile` object.

							To extend the =Uize.Template= module by adding further encodings, an `encoding profile` object can be assigned directly to a new property of the =Uize.Template.encodings= object. Or, if the encoding adheres to the constraints of a `standard encoding`, then it can be more conveniently registered using the =Uize.Template.defineStandardEncoding= static method.
				*/

			_defineStandardEncoding ('iso8601','Uize.Date','toIso8601','fromIso8601');
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.iso8601
								An `encoding profile` for the =iso8601= encoding.

					Encodings
						iso8601
							Encodes to or decodes from an ISO8601 formatted date string.

							Encoding
								When encoding, the value can be of any type that can be resolved to a =Date= object by the =Uize.Date.resolve= static method of the =Uize.Date= module.

								SYNTAX
								...................................
								<%= dateSTRorOBJorNUM -> iso8601 %>
								...................................

								Using this encoding in the forward direction is equivalent to using the =Uize.Date.toIso8601= static method of the =Uize.Date= module.

								EXAMPLE
								..................................
								<%= 'Tue Sep 11 2001' -> is8601 %>
								..................................

								OUTPUT
								..........
								2001-09-11
								..........

							Decoding
								When decoding, the value should be a string, in ISO8601 format.

								SYNTAX
								.................................
								<%= dateIso8601STR -> !iso8601 %>
								.................................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Date.fromIso8601= static method of the =Uize.Date= module.

								EXAMPLE
								...........................................
								<%= '2001-09-11' -> !iso8601 -> urlPiece %>
								...........................................

								OUTPUT
								.............................................................................
								Tue%20Sep%2011%202001%2000%3A00%3A00%20GMT-0700%20(Pacific%20Daylight%20Time)
								.............................................................................

							NOTES
							- the =iso8601= encoding is defined by the =Uize.Template.encodings.iso8601= static property
				*/

			_defineStandardEncoding ('json','Uize.Json','to','from');
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.json
								An `encoding profile` for the =json= encoding.

					Encodings
						json
							Encodes to or decodes from a JSON formatted string.

							Encoding
								When encoding, the value to encode can be a string, boolean, number, object, array, =null=, =undefined=, or a regular expression.

								SYNTAX
								...........................
								<%= valueANYTYPE -> json %>
								...........................

								Using this encoding in the forward direction is equivalent to using the =Uize.Json.to= static method of the =Uize.Json= module.

								EXAMPLE
								........................................
								<%= {hello:'world',foo:'bar'} -> json %>
								........................................

								OUTPUT
								.................
								{
									hello:'world',
									foo:'bar'
								}
								.................

								json Encoding Options
									The =json= encoding supports encoding options, which may optionally be specified inside curly braces after the encoding name.

									SYNTAX
									...............................................
									<%= valueANYTYPE -> json{encodingOptionsOBJ} %>
									...............................................

									When specifying the optional encoding options object, this object may contain any of the properties supported by the optional =encodingOptionsOBJ= parameter of the =Uize.Json.to= method.

									EXAMPLE
									.........................................................................
									<%= {hello:'world',foo:'bar'} -> json{keyDelimiter:' : ',padKeys:true} %>
									.........................................................................

									OUTPUT
									...................
									{
										hello : 'world',
										foo   : 'bar'
									}
									...................

							Decoding
								When decoding, the value to decode should be a string in JSON format, and the decoded value can be a string, boolean, number, object, array, =null=, =undefined=, or a regular expression.

								SYNTAX
								.......................
								<%= jsonSTR -> !json %>
								.......................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Json.from= static method of the =Uize.Json= module.

								EXAMPLE
								........................................................
								<%= '{hello:"world",foo:"bar"}' -> !json -> urlParams %>
								........................................................

								OUTPUT
								...................
								hello=world&foo=bar
								...................

							NOTES
							- the =json= encoding is defined by the =Uize.Template.encodings.json= static property
							- compare this encoding to the similar =miniJson= encoding
				*/

			_defineStandardEncoding ('miniJson','Uize.Json','to','from');
			_package.encodings.miniJson.to.expansion =
				function (_valueStr) {return 'Uize.Json.to (' + _valueStr + ',\'mini\')'}
			;
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.miniJson
								An `encoding profile` for the =miniJson= encoding.

					Encodings
						miniJson
							Encodes to a mini / compact (no indentation or linebreaks for complex objects) JSON formatted string, or decodes from any JSON formatted string.

							Encoding
								When encoding, the value to encode can be a string, boolean, number, object, array, =null=, =undefined=, or a regular expression.

								SYNTAX
								...............................
								<%= valueANYTYPE -> miniJson %>
								...............................

								Using this encoding in the forward direction is equivalent to using the =Uize.Json.to= static method of the =Uize.Json= module, and specifying the value ='mini'= for this method's optional =serializationOptionsOBJ= parameter.

								EXAMPLE
								............................................
								<%= {hello:'world',foo:'bar'} -> miniJson %>
								............................................

								OUTPUT
								.........................
								{hello:'world',foo:'bar'}
								.........................

							Decoding
								When decoding, the value to decode should be a string in JSON format, and the decoded value can be a string, boolean, number, object, array, =null=, =undefined=, or a regular expression.

								SYNTAX
								...........................
								<%= jsonSTR -> !miniJson %>
								...........................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Json.from= static method of the =Uize.Json= module.

								EXAMPLE
								............................................................
								<%= '{hello:"world",foo:"bar"}' -> !miniJson -> urlParams %>
								............................................................

								OUTPUT
								...................
								hello=world&foo=bar
								...................

							NOTES
							- the =miniJson= encoding is defined by the =Uize.Template.encodings.miniJson= static property
							- compare this encoding to the similar =json= encoding
				*/

			_defineStandardEncoding ('tagAttributes','Uize.Xml','toAttributes','fromAttributes');
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.tagAttributes
								An `encoding profile` for the =tagAttributes= encoding.

					Encodings
						tagAttributes
							Encodes to or decodes from a tag attributes string.

							Encoding
								When encoding, the value should be an object, containing properties for the tag attributes.

								SYNTAX
								........................................
								<%= tagAttributesOBJ -> tagAttributes %>
								........................................

								Using this encoding in the forward direction is equivalent to using the =Uize.Xml.toAttributes= static method of the =Uize.Xml= module.

								EXAMPLE
								................................................................
								<%= {width:320,height:480,alt:'CONTINUE >>'} -> tagAttributes %>
								................................................................

								OUTPUT
								................................................
								width="320" height="480" alt="CONTINUE &gt;&gt;"
								................................................

							Decoding
								When decoding, the value should be a tag attributes string, and the decoded value will be a tag attributes object.

								SYNTAX
								.........................................
								<%= tagAttributesSTR -> !tagAttributes %>
								.........................................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Xml.fromAttributes= static method of the =Uize.Xml= module.

								EXAMPLE
								.......................................................................................
								<%= 'width="320" height="480" alt="CONTINUE &gt;&gt;"' -> !tagAttributes -> miniJson %>
								.......................................................................................

								OUTPUT
								........................................
								{width:320,height:480,alt:'CONTINUE >>'}
								........................................

							NOTES
							- the =tagAttributes= encoding is defined by the =Uize.Template.encodings.tagAttributes= static property
							- see the related =tagAttributeValue= encoding
				*/

			_defineStandardEncoding ('tagAttributeValue','Uize.Xml','toAttributeValue','fromAttributeValue');
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.tagAttributeValue
								An `encoding profile` for the =tagAttributeValue= encoding.

					Encodings
						tagAttributeValue
							Encodes to or decodes from a tag attribute value string (excluding the enclosing quotes).

							Encoding
								When encoding, the value can be of any type and will be coerced to a string if necessary.

								SYNTAX
								........................................
								<%= valueANYTYPE -> tagAttributeValue %>
								........................................

								Using this encoding in the forward direction is equivalent to using the =Uize.Xml.toAttributeValue= static method of the =Uize.Xml= module.

								EXAMPLE 1
								.........................................
								<%= 'CONTINUE >>' -> tagAttributeValue %>
								.........................................

								OUTPUT
								.................
								CONTINUE &gt;&gt;
								.................

								EXAMPLE 2
								..............................................................
								<%= Uize.Class ({value:'CONTINUE >>'}) -> tagAttributeValue %>
								..............................................................

								OUTPUT
								.................
								CONTINUE &gt;&gt;
								.................

							Decoding
								When decoding, the value should be a tag attribute value string (excluding the enclosing quotes), and the decoded value will be a string.

								SYNTAX
								.................................................
								<%= tagAttributeValueSTR -> !tagAttributeValue %>
								.................................................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Xml.fromAttributeValue= static method of the =Uize.Xml= module.

								EXAMPLE
								................................................
								<%= 'CONTINUE &gt;&gt;' -> !tagAttributeValue %>
								................................................

								OUTPUT
								...........
								CONTINUE >>
								...........

							NOTES
							- the =tagAttributeValue= encoding is defined by the =Uize.Template.encodings.tagAttributeValue= static property
							- see the related =tagAttributes= encoding
				*/

			_defineStandardEncoding ('url','Uize.Url','resolve','from');
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.url
								An `encoding profile` for the =url= encoding.

					Encodings
						url
							Encodes to or decodes from a URL string.

							Encoding
								When encoding, the value can be a URL path string, or an array containing a URL path string and any number of optional query parameters objects.

								Using this encoding in the forward direction is equivalent to using the =Uize.Url.resolve= static method of the =Uize.Url= module.

								Value To Encode is a URL Path String
									When the value to encode to a URL string is a URL path string, then query parameters can be specified as the encoding options.

									SYNTAX
									......................................
									<%= urlPathSTR -> url{urlParamsOBJ} %>
									......................................

									Consider the following example...

									EXAMPLE
									............................................................
									<%= 'http://www.uize.com' -> url{hello:'world',foo:'bar'} %>
									............................................................

									OUTPUT
									.......................................
									http://www.uize.com?hello=world&foo=bar
									.......................................

								Value To Encode is a URL Path Plus Params Objects Array
									When the value to encode to a URL string is an array containing a URL path string and an arbitrary number of URL params objects, then additional query parameters may be optionally specified as the encoding options.

									SYNTAX
									.........................................................
									<%= urlPathPlusParamsObjectsARRAY -> url %>
									<%= urlPathPlusParamsObjectsARRAY -> url{urlParamsOBJ} %>
									.........................................................

									Consider the following two examples that both produce the same output...

									EXAMPLE 1
									...............................................................
									<%= ['http://www.uize.com',{hello:'world',foo:'bar'}] -> url %>
									...............................................................

									OUTPUT
									.......................................
									http://www.uize.com?hello=world&foo=bar
									.......................................

									EXAMPLE 2
									................................................................
									<%= ['http://www.uize.com',{hello:'world'}] -> url{foo:'bar'} %>
									................................................................

									OUTPUT
									.......................................
									http://www.uize.com?hello=world&foo=bar
									.......................................

							Decoding
								When decoding, the value should be a URL string, and the decoded value will be an object containing properties that represent different logical components of the URL (eg. protocol, host, folder path, filename, file extension, query string, etc.).

								SYNTAX
								.....................
								<%= urlSTR -> !url %>
								.....................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Url.from= static method of the =Uize.Url= module.

								EXAMPLE
								..................................................................................
								<%= 'http://uize.com:80/reference/Uize.html?param=value#anchor' -> !url -> json %>
								..................................................................................

								OUTPUT
								....................................................................
								{
									href:'http://uize.com:80/reference/Uize.html?param=value#anchor',
									fullDomain:'http://uize.com:80',
									protocol:'http:',
									host:'uize.com:80',
									hostname:'uize.com',
									port:'80',
									pathname:'/reference/Uize.html',
									folderPath:'/reference/',
									file:'Uize.html',
									fileName:'Uize',
									extension:'.html',
									fileType:'html',
									search:'?param=value',
									query:'param=value',
									hash:'#anchor',
									anchor:'anchor'
								}								{
								....................................................................

							NOTES
							- the =url= encoding is defined by the =Uize.Template.encodings.url= static property
							- see the related =urlParams= and =urlPiece= encodings
				*/

			_defineStandardEncoding ('urlParams','Uize.Url','toParams','fromParams');
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.urlParams
								An `encoding profile` for the =urlParams= encoding.

					Encodings
						urlParams
							Encodes to or decodes from a URL query parameters string.

							Encoding
								When encoding, the value should be an object, containing properties for the URL query parameters.

								SYNTAX
								................................
								<%= urlParamsOBJ -> urlParams %>
								................................

								Using this encoding in the forward direction is equivalent to using the =Uize.Url.toParams= static method of the =Uize.Url= module.

								EXAMPLE
								.............................................
								<%= {hello:'world',foo:'bar'} -> urlParams %>
								.............................................

								OUTPUT
								...................
								hello=world&foo=bar
								...................

							Decoding
								When decoding, the value should be a URL query parameters string, or a full URL string that may contain query parameters, and the decoded value will be a URL query parameters object.

								SYNTAX
								.................................
								<%= urlParamsSTR -> !urlParams %>
								.................................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Url.fromParams= static method of the =Uize.Url= module.

								EXAMPLE
								...........................................................................
								<%= 'http://www.uize.com/?hello=world&foo=bar' -> !urlParams -> miniJson %>
								...........................................................................

								OUTPUT
								.........................
								{hello:'world',foo:'bar'}
								.........................

							NOTES
							- the =urlParams= encoding is defined by the =Uize.Template.encodings.urlParams= static property
							- see the related =url= and =urlPiece= encodings
				*/

			_defineStandardEncoding ('urlPiece','Uize.Url','toPiece','fromPiece');
				/*?
					Static Properties
						Uize.Template.encodings
							Uize.Template.encodings.urlPiece
								An `encoding profile` for the =urlPiece= encoding.

					Encodings
						urlPiece
							Encodes to or decodes from a URL fragment string.

							Encoding
								When encoding, the value can be of any type and will be coerced to a string if necessary.

								SYNTAX
								...............................
								<%= valueANYTYPE -> urlPiece %>
								...............................

								Using this encoding in the forward direction is equivalent to using the =Uize.Url.toPiece= static method of the =Uize.Url= module.

								EXAMPLE 1
								.................................
								<%= 'hello, world' -> urlPiece %>
								.................................

								OUTPUT
								.................
								hello%2C%20world
								.................

								EXAMPLE 2
								......................................................
								<%= Uize.Class ({value:'hello, world'}) -> urlPiece %>
								......................................................

								OUTPUT
								.................
								hello%2C%20world
								.................

							Decoding
								When decoding, the value should be a URL fragment string, and the decoded value will be a string.

								SYNTAX
								...............................
								<%= urlPieceSTR -> !urlPiece %>
								...............................

								Using this encoding in the reverse direction (ie. decoding by using the "!" prefix) is equivalent to using the =Uize.Url.fromPiece= static method of the =Uize.Url= module.

								EXAMPLE
								......................................
								<%= 'hello%2C%20world' -> !urlPiece %>
								......................................

								OUTPUT
								............
								hello, world
								............

							NOTES
							- the =urlPiece= encoding is defined by the =Uize.Template.encodings.urlPiece= static property
							- see the related =url= and =urlParams= encodings
				*/

		return _package;
	}
});

