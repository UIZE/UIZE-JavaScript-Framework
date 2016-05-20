/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Url Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Url= module defines a suite of unit tests for the =Uize.Url= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Url',
	required:'Uize.Class.Value',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Url Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Url'),
				Uize.Test.staticMethodsTest ([
					['Uize.Url.getCacheDefeatStr',[
						{
							title:'Test that a string type value is returned, as expected',
							test:function () {return this.expectNonEmptyString (Uize.Url.getCacheDefeatStr ())}
						},
						{
							title:'Test that result is different across ten successive calls',
							test:function () {
								var _callResults = [];
								for (var _callNo = -1; ++_callNo < 10;)
									_callResults.push (Uize.Url.getCacheDefeatStr ())
								;
								return this.expectNoRepeats (_callResults);
							}
						}
					]],
					['Uize.Url.fromPiece',[
						['Decoding the value null produces an empty string',null,''],
						['Decoding the value undefined produces an empty string',undefined,''],
						['Decoding a boolean type value coerces that value to a string',false,'false'],
						['Decoding a number type value coerces that value to a string',42,'42'],
						['Decoding the number type value NaN coerces that value to a string',NaN,'NaN'],
						['Decoding the number type value Infinity coerces that value to a string',
							Infinity,
							'Infinity'
						],
						['Test that decoding a string containing encoded characters works correctly',
							'%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20',
							'`@#$%^&+=[]{}|\\:;"<>,?/ '
						],
						['Test that decoding a string that doesn\'t contain encoded characters works correctly',
							'this-is-a-string-that-does-not-contain-any-encoded-characters',
							'this-is-a-string-that-does-not-contain-any-encoded-characters'
						]
					]],
					['Uize.Url.toPiece',[
						['Encoding the value null coerces that value to a string',null,'null'],
						['Encoding the value undefined coerces that value to a string',undefined,'undefined'],
						['Encoding a boolean type value coerces that value to a string',false,'false'],
						['Encoding a number type value coerces that value to a string',42,'42'],
						['Encoding the number type value NaN coerces that value to a string',NaN,'NaN'],
						['Encoding the number type value Infinity coerces that value to a string',
							Infinity,
							'Infinity'
						],
						['Test that encoding a string containing characters that should be encoded works correctly',
							'`@#$%^&+=[]{}|\\:;"<>,?/ ',
							'%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20'
						],
						['Test that encoding a string that doesn\'t contain characters that need to be encoded works',
							'this-is-a-string-that-does-not-contain-any-encoded-characters',
							'this-is-a-string-that-does-not-contain-any-encoded-characters'
						]
					]],
					['Uize.Url.fromParams',[
						['An empty URL params string produces an empty object',
							'',
							{}
						],
						['A URL params string that is just a question mark produces an empty object',
							'?',
							{}
						],
						['A URL params string that has nothing after a question mark produces an empty object',
							'http://www.uize.com?',
							{}
						],
						['A URL params string that has no question mark is assumed to be query params',
							'paramName=paramValue',
							{paramName:'paramValue'}
						],
						['Test that multiple query params are supported correctly',
							'param1Name=param1Value&param2Name=param2Value&param3Name=param3Value',
							{param1Name:'param1Value',param2Name:'param2Value',param3Name:'param3Value'}
						],
						['The part of a URL params string up to and including a question mark is ignored',
							'http://www.uize.com?param1Name=param1Value&param2Name=param2Value&param3Name=param3Value',
							{param1Name:'param1Value',param2Name:'param2Value',param3Name:'param3Value'}
						],
						['The default value for a param for which no value is specified is an empty string',
							'param1=&param2=',
							{param1:'',param2:''}
						],
						['The equals sign is optional for any param for which no value is specified',
							'param1&param2',
							{param1:'',param2:''}
						],
						['Some params may use an equals sign while others may not, in the same URL params string',
							'param1&param2=&param3',
							{param1:'',param2:'',param3:''}
						],
						['All values are always represented using the string type in the params object',
							'param1=true&param2=42&param3=NaN&param4=Infinity&param5={}&param6=[]&param7=null&param8=undefined',
							{
								param1:'true',
								param2:'42',
								param3:'NaN',
								param4:'Infinity',
								param5:'{}',
								param6:'[]',
								param7:'null',
								param8:'undefined'
							}
						],
						['Param values that contain URI-encoded characters are decoded',
							'param1=%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20&param2=hello',
							{
								param1:'`@#$%^&+=[]{}|\\:;"<>,?/ ',
								param2:'hello'
							}
						],
						['Param names that contain URI-encoded characters are decoded',
							'%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20=hello',
							{'`@#$%^&+=[]{}|\\:;"<>,?/ ':'hello'}
						],
						['A param without a name specified is ignored and is not represented in the params object',
							'http://www.uize.com?=blah&param=foo',
							{param:'foo'}
						],
						['A space is supported as a param name',
							'%20=space%2C%20the%20final%20frontier',
							{' ':'space, the final frontier'}
						],
						['Param names and param values are case sensitive',
							'param=value&PARAM=VALUE',
							{param:'value',PARAM:'VALUE'}
						],
						['The last value wins when the same named parameter occurs multiple times',
							'foo=bar&foo=pub&foo=spacebar',
							{foo:'spacebar'}
						]
					]],
					['Uize.Url.toParams',[
						['Calling without any parameters produces an empty string',
							[],
							''
						],
						['Calling with the value null produces an empty string',
							null,
							''
						],
						['Calling with the value undefined produces an empty string',
							undefined,
							''
						],
						['An empty query params object produces an empty string',
							{},
							''
						],
						['Test that a query params object with a single param is handled correctly',
							{paramName:'paramValue'},
							'paramName=paramValue'
						],
						['A params object property that is an empty string is ignored',
							{'':'peekaboo',foo:'bar'},
							'foo=bar'
						],
						['Params object properties whose values are null or undefined are ignored',
							{param1:undefined,param2:null,param3:'hello'},
							'param3=hello'
						],
						['Params object properties whose values are empty strings are not ignored',
							{param1:'',param2:''},
							'param1=&param2='
						],
						['Test that multiple query params are delimited correctly',
							{param1Name:'param1Value',param2Name:'param2Value',param3Name:'param3Value'},
							'param1Name=param1Value&param2Name=param2Value&param3Name=param3Value'
						],
						['Param values containing characters that need to be URI-encoded are encoded',
							{
								param1:'`@#$%^&+=[]{}|\\:;"<>,?/ ',
								param2:'hello'
							},
							'param1=%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20&param2=hello'
						],
						['Param names containing characters that need to be URI-encoded are encoded',
							{'`@#$%^&+=[]{}|\\:;"<>,?/ ':'hello'},
							'%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20=hello'
						],
						['A space is supported as a param name',
							{' ':'space, the final frontier'},
							'%20=space%2C%20the%20final%20frontier'
						],
						['Param names and param values are case sensitive',
							{param:'value',PARAM:'VALUE'},
							'param=value&PARAM=VALUE'
						],
						['Params values that are not string type are coerced to string',
							{
								p1:true,
								p2:new Boolean (false),
								p3:42,
								p4:new Number (42),
								p5:NaN,
								p6:Infinity,
								p7:'hello',
								p8:new String ('hello'),
								p9:Uize.Class.Value ({value:'hello'}),
								p10:[1,2,3,4]
							},
							'p1=true&p2=false&p3=42&p4=42&p5=NaN&p6=Infinity&p7=hello&p8=hello&p9=hello&p10=1%2C2%2C3%2C4'
						],
						['Test that an array containing a single params object element is supported',
							[[{param1Name:'param1Value',param2Name:'param2Value',param3Name:'param3Value'}]],
							'param1Name=param1Value&param2Name=param2Value&param3Name=param3Value'
						],
						['Test that an array containing a multiple params object elements is supported',
							[[{param1Name:'param1Value'},{param2Name:'param2Value'},{param3Name:'param3Value'}]],
							'param1Name=param1Value&param2Name=param2Value&param3Name=param3Value'
						],
						['An array containing no params object elements produces an empty string',
							[[]],
							''
						],
						['In the case of an array of multiple params objects, later objects win / override',
							[[{p1:'obj1',p2:'obj1',p3:'obj1'},{p2:'obj2',p3:'obj2'},{p3:'obj3'}]],
							'p1=obj1&p2=obj2&p3=obj3'
						]
					]],
					['Uize.Url.resolve',[
						['Calling with no parameters produces an empty string',
							[],
							''
						],
						['Calling with just an empty string produces an empty string',
							'',
							''
						],
						['Calling with just a URL that has no query params returns that URL string',
							'http://www.uize.com',
							'http://www.uize.com'
						],
						['Calling with just a URL that has a query character but no query params returns that URL with the query character stripped',
							'http://www.uize.com?',
							'http://www.uize.com'
						],
						['Calling with just a URL that has query params, but no query params object, returns that URL with its query params intact',
							'http://www.uize.com?param1Name=param1Value&param2Name=param2Value',
							'http://www.uize.com?param1Name=param1Value&param2Name=param2Value'
						],
						['Test that specifying an empty URL and a query params object is handled correctly',
							['',{param1Name:'param1Value',param2Name:'param2Value',param3Name:'param3Value'}],
							'?param1Name=param1Value&param2Name=param2Value&param3Name=param3Value'
						],
						['Test that specifying null values in query params object removes params from URL',
							[
								'http://www.uize.com/search?sort=recent&results=20&pg=1',
								{sort:null,category:null,type:'all',results:null}
							],
							'http://www.uize.com/search?pg=1&type=all'
						],
						['Test that specifying a URL and an array of query params objects is handled correctly',
							[
								'http://www.uize.com',
								[{param1Name:'param1Value'},{param2Name:'param2Value'},{param3Name:'param3Value'}]
							],
							'http://www.uize.com?param1Name=param1Value&param2Name=param2Value&param3Name=param3Value'
						],
						['Test that specifying an array of a URL and multiple query params objects is handled correctly',
							[
								[
									'http://www.uize.com',
									{param1Name:'param1Value'},
									{param2Name:'param2Value'},
									{param3Name:'param3Value'}
								]
							],
							'http://www.uize.com?param1Name=param1Value&param2Name=param2Value&param3Name=param3Value'
						],
						['Test that specifying an array of just a URL is handled correctly',
							[['http://www.uize.com']],
							'http://www.uize.com'
						],
						['In the case of an array of multiple params objects, later objects win / override',
							['http://www.uize.com',[{p1:'obj1',p2:'obj1',p3:'obj1'},{p2:'obj2',p3:'obj2'},{p3:'obj3'}]],
							'http://www.uize.com?p1=obj1&p2=obj2&p3=obj3'
						],
						['Test that various different types of param value are supported correctly',
							[
								'http://www.uize.com',
								{
									p1:true,
									p2:new Boolean (false),
									p3:42,
									p4:new Number (42),
									p5:NaN,
									p6:Infinity,
									p7:'hello',
									p8:new String ('hello'),
									p9:Uize.Class.Value ({value:'hello'}),
									p10:[1,2,3,4]
								}
							],
							'http://www.uize.com?' +
								'p1=true&p2=false&p3=42&p4=42&p5=NaN&p6=Infinity&p7=hello&p8=hello&p9=hello&p10=1%2C2%2C3%2C4'
						],
						['Param names and values that contain characters that need to be URI-encoded are encoded',
							[
								'http://www.uize.com',
								{
									param1:'`@#$%^&+=[]{}|\\:;"<>,?/ ',
									'`@#$%^&+=[]{}|\\:;"<>,?/ ':'hello'
								}
							],
							'http://www.uize.com?' +
								'param1=%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20&' +
								'%60%40%23%24%25%5E%26%2B%3D%5B%5D%7B%7D%7C%5C%3A%3B%22%3C%3E%2C%3F%2F%20=hello'
						],
						['Query params in params objects are stitched into params in the URL string',
							[
								'http://www.uize.com?p1=wind&p2=oil&p3=solar&p4=coal',
								{p2:'biofuel',p4:'geothermal',p5:'tidal'}
							],
							'http://www.uize.com?p1=wind&p2=biofuel&p3=solar&p4=geothermal&p5=tidal'
						],
						['Test that specifying a non-empty URL and a query params object is handled correctly',
							[
								'http://www.uize.com',
								{param1Name:'param1Value',param2Name:'param2Value',param3Name:'param3Value'}
							],
							'http://www.uize.com?param1Name=param1Value&param2Name=param2Value&param3Name=param3Value'
						]
					]],
					['Uize.Url.from',[
						['Test URL with protocol, hostname, port, folderPath, fileName, extension, query, and anchor',
							'http://uize.com:80/blah/blah/file.html?param1=value&param2=value#anchor',
							{
								href:'http://uize.com:80/blah/blah/file.html?param1=value&param2=value#anchor',
								fullDomain:'http://uize.com:80',
								protocol:'http:',
								host:'uize.com:80',
								hostname:'uize.com',
								port:'80',
								pathname:'/blah/blah/file.html',
								folderPath:'/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with protocol, hostname, port, folderPath, fileName, extension, and query',
							'http://uize.com:80/blah/blah/file.html?param1=value&param2=value',
							{
								href:'http://uize.com:80/blah/blah/file.html?param1=value&param2=value',
								fullDomain:'http://uize.com:80',
								protocol:'http:',
								host:'uize.com:80',
								hostname:'uize.com',
								port:'80',
								pathname:'/blah/blah/file.html',
								folderPath:'/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with protocol, hostname, port, folderPath, fileName, extension, and anchor',
							'http://uize.com:80/blah/blah/file.html#anchor',
							{
								href:'http://uize.com:80/blah/blah/file.html#anchor',
								fullDomain:'http://uize.com:80',
								protocol:'http:',
								host:'uize.com:80',
								hostname:'uize.com',
								port:'80',
								pathname:'/blah/blah/file.html',
								folderPath:'/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, port, folderPath, fileName, extension, query, and anchor',
							'uize.com:80/blah/blah/file.html?param1=value&param2=value#anchor',
							{
								href:'uize.com:80/blah/blah/file.html?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com:80/blah/blah/file.html',
								folderPath:'uize.com:80/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, folderPath, fileName, extension, query, and anchor',
							'uize.com/blah/blah/file.html?param1=value&param2=value#anchor',
							{
								href:'uize.com/blah/blah/file.html?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/blah/blah/file.html',
								folderPath:'uize.com/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, fileName, extension, query, and anchor',
							'uize.com/file.html?param1=value&param2=value#anchor',
							{
								href:'uize.com/file.html?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/file.html',
								folderPath:'uize.com/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, fileName, extension, and query',
							'uize.com/file.html?param1=value&param2=value',
							{
								href:'uize.com/file.html?param1=value&param2=value',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/file.html',
								folderPath:'uize.com/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with hostname, fileName, extension, and anchor',
							'uize.com/file.html#anchor',
							{
								href:'uize.com/file.html#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/file.html',
								folderPath:'uize.com/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, fileName, and extension',
							'uize.com/file.html',
							{
								href:'uize.com/file.html',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/file.html',
								folderPath:'uize.com/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with protocol, hostname, and port',
							'http://uize.com:80',
							{
								href:'http://uize.com:80',
								fullDomain:'http://uize.com:80',
								protocol:'http:',
								host:'uize.com:80',
								hostname:'uize.com',
								port:'80',
								pathname:'',
								folderPath:'',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with protocol and hostname',
							'http://uize.com',
							{
								href:'http://uize.com',
								fullDomain:'http://uize.com',
								protocol:'http:',
								host:'uize.com',
								hostname:'uize.com',
								port:'',
								pathname:'',
								folderPath:'',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with only hostname (fails to parse correctly)',
							'uize.com',
							{
								href:'uize.com',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com',
								folderPath:'',
								file:'uize.com',
								fileName:'uize',
								extension:'.com',
								fileType:'com',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with only hostname and port (fails to parse correctly)',
							'uize.com:80',
							{
								href:'uize.com:80',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com:80',
								folderPath:'',
								file:'uize.com:80',
								fileName:'uize',
								extension:'.com:80',
								fileType:'com:80',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with protocol, hostname, query, and anchor',
							'http://uize.com/?param1=value&param2=value#anchor',
							{
								href:'http://uize.com/?param1=value&param2=value#anchor',
								fullDomain:'http://uize.com',
								protocol:'http:',
								host:'uize.com',
								hostname:'uize.com',
								port:'',
								pathname:'/',
								folderPath:'/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with protocol, hostname, and query',
							'http://uize.com/?param1=value&param2=value',
							{
								href:'http://uize.com/?param1=value&param2=value',
								fullDomain:'http://uize.com',
								protocol:'http:',
								host:'uize.com',
								hostname:'uize.com',
								port:'',
								pathname:'/',
								folderPath:'/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with protocol, hostname, and anchor',
							'http://uize.com/#anchor',
							{
								href:'http://uize.com/#anchor',
								fullDomain:'http://uize.com',
								protocol:'http:',
								host:'uize.com',
								hostname:'uize.com',
								port:'',
								pathname:'/',
								folderPath:'/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, query, and anchor (cannot distinguish hostname from folderPath)',
							'uize.com/?param1=value&param2=value#anchor',
							{
								href:'uize.com/?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/',
								folderPath:'uize.com/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname and query (cannot distinguish hostname from folderPath)',
							'uize.com/?param1=value&param2=value',
							{
								href:'uize.com/?param1=value&param2=value',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/',
								folderPath:'uize.com/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with hostname and anchor (cannot distinguish hostname from folderPath)',
							'uize.com/#anchor',
							{
								href:'uize.com/#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com/',
								folderPath:'uize.com/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, port, query, and anchor (cannot distinguish hostname and port from folderPath)',
							'uize.com:80/?param1=value&param2=value#anchor',
							{
								href:'uize.com:80/?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com:80/',
								folderPath:'uize.com:80/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with hostname, port, and query (cannot distinguish hostname and port from folderPath)',
							'uize.com:80/?param1=value&param2=value',
							{
								href:'uize.com:80/?param1=value&param2=value',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com:80/',
								folderPath:'uize.com:80/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with hostname, port, and anchor (cannot distinguish hostname and port from folderPath)',
							'uize.com:80/#anchor',
							{
								href:'uize.com:80/#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com:80/',
								folderPath:'uize.com:80/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with folderPath, fileName, extension, query, and anchor',
							'/blah/blah/file.html?param1=value&param2=value#anchor',
							{
								href:'/blah/blah/file.html?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/file.html',
								folderPath:'/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with folderPath, fileName, extension, and query',
							'/blah/blah/file.html?param1=value&param2=value',
							{
								href:'/blah/blah/file.html?param1=value&param2=value',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/file.html',
								folderPath:'/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with folderPath, fileName, extension, and anchor',
							'/blah/blah/file.html#anchor',
							{
								href:'/blah/blah/file.html#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/file.html',
								folderPath:'/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with folderPath, fileName, and extension',
							'/blah/blah/file.html',
							{
								href:'/blah/blah/file.html',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/file.html',
								folderPath:'/blah/blah/',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with folderPath, query, and anchor',
							'/blah/blah/?param1=value&param2=value#anchor',
							{
								href:'/blah/blah/?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/',
								folderPath:'/blah/blah/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with folderPath and query',
							'/blah/blah/?param1=value&param2=value',
							{
								href:'/blah/blah/?param1=value&param2=value',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/',
								folderPath:'/blah/blah/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with folderPath and anchor',
							'/blah/blah/#anchor',
							{
								href:'/blah/blah/#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/',
								folderPath:'/blah/blah/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with only folderPath',
							'/blah/blah/',
							{
								href:'/blah/blah/',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'/blah/blah/',
								folderPath:'/blah/blah/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with query and anchor',
							'?param1=value&param2=value#anchor',
							{
								href:'?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'',
								folderPath:'',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with only query',
							'?param1=value&param2=value',
							{
								href:'?param1=value&param2=value',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'',
								folderPath:'',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with only anchor',
							'#anchor',
							{
								href:'#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'',
								folderPath:'',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with relative folderPath, fileName, and extension',
							'../../file.html',
							{
								href:'../../file.html',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'../../file.html',
								folderPath:'../../',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with fileName, extension, query, and anchor',
							'file.html?param1=value&param2=value#anchor',
							{
								href:'file.html?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'file.html',
								folderPath:'',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with fileName, extension, and query',
							'file.html?param1=value&param2=value',
							{
								href:'file.html?param1=value&param2=value',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'file.html',
								folderPath:'',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'',
								anchor:''
							}
						],
						['Test URL with fileName, extension, and anchor',
							'file.html#anchor',
							{
								href:'file.html#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'file.html',
								folderPath:'',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with fileName and extension',
							'file.html',
							{
								href:'file.html',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'file.html',
								folderPath:'',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL that is an empty string',
							'',
							{
								href:'',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'',
								folderPath:'',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with badly formed protocol, query, and anchor (query and anchor still parsed correctly)',
							'http:/?param1=value&param2=value#anchor',
							{
								href:'http:/?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'http:/',
								folderPath:'http:/',
								file:'',
								fileName:'',
								extension:'',
								fileType:'',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						],
						['Test URL with badly formed protocol, fileName, and extension (extension still parsed correctly)',
							'http:file.html',
							{
								href:'http:file.html',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'http:file.html',
								folderPath:'',
								file:'http:file.html',
								fileName:'http:file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test URL with badly formed protocol, fileName, and extension (fileName and extension still parsed correctly)',
							'http//file.html',
							{
								href:'http//file.html',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'http//file.html',
								folderPath:'http//',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'',
								query:'',
								hash:'',
								anchor:''
							}
						],
						['Test that backslashes are supported',
							'uize.com:80\\blah\\blah\\file.html?param1=value&param2=value#anchor',
							{
								href:'uize.com:80\\blah\\blah\\file.html?param1=value&param2=value#anchor',
								fullDomain:'',
								protocol:'',
								host:'',
								hostname:'',
								port:'',
								pathname:'uize.com:80\\blah\\blah\\file.html',
								folderPath:'uize.com:80\\blah\\blah\\',
								file:'file.html',
								fileName:'file',
								extension:'.html',
								fileType:'html',
								search:'?param1=value&param2=value',
								query:'param1=value&param2=value',
								hash:'#anchor',
								anchor:'anchor'
							}
						]
					]],
					['Uize.Url.toRelative',[
						{
							title:'Test that an empty base URL is supported correctly',
							test:[
								['When the base URL is an empty string and the URL to relativize is an empty string, then an empty string is returned',
									['',''],
									''
								],
								['When the base URL is an empty string and the URL to relativize is a root-relative URL, then the URL to relativize is returned as is',
									['','/foo/bar.html'],
									'/foo/bar.html'
								],
								['When the base URL is an empty string and the URL to relativize is a forward-relative URL, then the URL to relativize is returned as is',
									['','foo/bar.html'],
									'foo/bar.html'
								],
								['When the base URL is an empty string and the URL to relativize is a back-relative URL, then the URL to relativize is returned as is',
									['','../../foo/bar.html'],
									'../../foo/bar.html'
								],
								['When the base URL is an empty string and the URL to relativize is a absolute with a domain, then the URL to relativize is returned as is',
									['','http://www.somedomain.com/foo/bar.html'],
									'http://www.somedomain.com/foo/bar.html'
								]
							]
						},
						{
							title:'Test the cases where a relative URL can be created',
							test:(function () {
								function _samePrefixTestBatch (_title,_prefix) {
									return {
										title:_title,
										test:[
											['Test when the URL to relativize is to a file under the base URL',
												[
													_prefix + 'foo/bar/',
													_prefix + 'foo/bar/baz/qux/file.html'
												],
												'baz/qux/file.html'
											],
											['Test when the URL to relativize is to a file under the base URL, and the base URL contains a file part',
												[
													_prefix + 'foo/bar/file.html',
													_prefix + 'foo/bar/baz/qux/file.html'
												],
												'baz/qux/file.html'
											],
											['Test when the URL to relativize is to a folder under the base URL',
												[
													_prefix + 'foo/bar/',
													_prefix + 'foo/bar/baz/qux/'
												],
												'baz/qux/'
											],
											['Test when the URL to relativize is to a folder under the base URL, and the base URL contains a file part',
												[
													_prefix + 'foo/bar/file.html',
													_prefix + 'foo/bar/baz/qux/'
												],
												'baz/qux/'
											],
											['Test when the URL to relativize is to a file in a folder that is one folder back in relation to the base URL',
												[
													_prefix + 'foo/bar/',
													_prefix + 'foo/baz/qux/file.html'
												],
												'../baz/qux/file.html'
											],
											['Test when the URL to relativize is to a file in a folder that is one folder back in relation to the base URL, and the base URL contains a file part',
												[
													_prefix + 'foo/bar/file.html',
													_prefix + 'foo/baz/qux/file.html'
												],
												'../baz/qux/file.html'
											],
											['Test when the URL to relativize is one folder back in relation to the base URL',
												[
													_prefix + 'foo/bar/',
													_prefix + 'foo/'
												],
												'../'
											],
											['Test when the URL to relativize is one folder back in relation to the base URL, and the base URL contains a file part',
												[
													_prefix + 'foo/bar/file.html',
													_prefix + 'foo/'
												],
												'../'
											],
											['Test when the URL to relativize shares no common folder path with the base URL',
												[
													_prefix + 'foo/bar/',
													_prefix + 'baz/qux/file.html'
												],
												'../../baz/qux/file.html'
											],
											['Test when the URL to relativize shares no common folder path with the base UR, and the base URL contains a file part',
												[
													_prefix + 'foo/bar/file.html',
													_prefix + 'baz/qux/file.html'
												],
												'../../baz/qux/file.html'
											],
											['Test when the URL to relativize is the entire folder path of the base URL',
												[
													_prefix + 'foo/bar/',
													_prefix + 'foo/bar/'
												],
												''
											],
											['Test when the URL to relativize is the entire folder path of the base URL, and the base URL contains a file part',
												[
													_prefix + 'foo/bar/file.html',
													_prefix + 'foo/bar/'
												],
												''
											]
										]
									}
								}

								return [
									_samePrefixTestBatch (
										'When both URLs are forward-relative, a relative URL can always be produced',
										''
									),
									_samePrefixTestBatch (
										'When both URLs are back-relative, a relative URL can always be produced',
										'../../../'
									),
									_samePrefixTestBatch (
										'When both URLs are root-relative, a relative URL can always be produced',
										'/'
									),
									_samePrefixTestBatch (
										'When both URLs have the same domain, a relative URL can always be produced',
										'http://www.somedomain.com/'
									)
								];
							}) ()
						},
						{
							title:'Test cases where a relative URL cannot be created and null should be returned, unless the URL to relativize is absolute and contains a domain, in which case it should be returned as is',
							test:(function () {
								var
									_prefixes = ['','/','../','../../','http://www.domain.com/','http://www.otherdomain.com/'],
									_testCases = []
								;
								Uize.forEach (
									_prefixes,
									function (_baseUrlPrefix) {
										Uize.forEach (
											_prefixes,
											function (_urlToRelativizePrefix) {
												var
													_urlToRelativizeIsAbsolute = _urlToRelativizePrefix.slice (0,5) == 'http:',
													_baseUrl = _baseUrlPrefix + 'foo/bar/file.html',
													_urlToRelativize = _urlToRelativizePrefix + 'foo/bar/baz/qux/file.html'
												;
												_baseUrlPrefix != _urlToRelativizePrefix &&
													_testCases.push (
														['When the base URL is \'' + _baseUrl + '\' and the URL to relativize is \'' + _urlToRelativize + '\'. then a relative URL cannot be created and ' + (_urlToRelativizeIsAbsolute ? '\'' + _urlToRelativize + '\'' : 'null') + ' is returned',
															[_baseUrl,_urlToRelativize],
															_urlToRelativizeIsAbsolute ? _urlToRelativize : null
														]
													)
												;
											}
										)
									}
								);
								return _testCases;
							}) ()
						}
					]],
					['Uize.Url.toAbsolute',[
						['Absolutizing an empty URL against an empty base URL produces an empty string',
							['',''],
							''
						],
						['Absolutizing a URL that already is an absolute URL simply returns that URL',
							['http://www.tomkidding.com','http://www.uize.com'],
							'http://www.uize.com'
						],
						['Absolutizing an empty URL produces the base URL without its filename',
							['http://www.uize.com/reference/Uize.html',''],
							'http://www.uize.com/reference/'
						],
						['Absolutizing an empty URL when the base URL has no folder and only a filename produces the base URL with only its host',
							['http://www.uize.com/index.html',''],
							'http://www.uize.com/'
						],
						['Absolutizing an empty URL when the base URL has only a host and trailing slash simply returns the base URL',
							['http://www.uize.com/',''],
							'http://www.uize.com/'
						],
						['Absolutizing an empty URL when the base URL has only a host and no trailing slash simply returns the base URL',
							['http://www.uize.com',''],
							'http://www.uize.com'
						],
						['Test absolutizing the URL "../" against a base URL with one folder in its path',
							['http://www.uize.com/reference/Uize.html','../'],
							'http://www.uize.com/'
						],
						['Test absolutizing the URL "../../" against a base URL with two folders in its path',
							['http://www.uize.com/reference/source-code/Uize.html','../../'],
							'http://www.uize.com/'
						],
						['Test absolutizing the URL "../../" against a base URL with only one folder in its path',
							['http://www.uize.com/reference/source-code/Uize.html','../../'],
							'http://www.uize.com/'
						],
						['Test absolutizing the URL "../index.html" against a base URL with one folder in its path',
							['http://www.uize.com/reference/Uize.html','../index.html'],
							'http://www.uize.com/index.html'
						],
						['Test absolutizing the URL "../index.html" against a base URL with no folder in its path',
							['http://www.uize.com/download.html','../index.html'],
							'http://www.uize.com/index.html'
						],
						['Test resolution of ".." folders in middle of URL to absolutize',
							['http://www.uize.com/download.html','examples/source-code/../../reference/Uize.html'],
							'http://www.uize.com/reference/Uize.html'
						],
						['Test resolution of ".." folders in middle of base URL',
							['http://www.uize.com/examples/source-code/../../download.html','reference/Uize.html'],
							'http://www.uize.com/reference/Uize.html'
						],
						['Test resolution of ".." folders in both the base URL and the URL to absolutize',
							[
								'http://www.uize.com/examples/source-code/../../download.html',
								'examples/source-code/../../reference/Uize.html'
							],
							'http://www.uize.com/reference/Uize.html'
						],
						['Test support for backslashes in base URL',
							['http://www.uize.com\\reference\\Uize.html','../index.html'],
							'http://www.uize.com\\index.html'
						],
						['Test support for backslashes in URL to absolutize',
							['http://www.uize.com/reference/Uize.html','..\\appendixes\\credits.html'],
							'http://www.uize.com/appendixes\\credits.html'
						]
					]]
				])
			]
		});
	}
});
