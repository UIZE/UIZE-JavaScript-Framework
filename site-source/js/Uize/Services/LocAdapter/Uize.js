Uize.module ({
	name:'Uize.Services.LocAdapter.Uize',
	required:[
		'Uize.Data.Simple',
		'Uize.Data.NameValueRecords'
	],
	superclass:'Uize.Services.LocAdapter',
	builder:function (_superclass) {
		'use strict';

		var
			_resourceFilePathRegExp = /((?:^|\/)Loc\/)en_US(\.loc)$/,
			_wordSplitterRegExpComposition = Uize.Util.RegExpComposition ({
				punctuation:/[\?!\.;,&=\-\(\)\[\]"<>]+/,
				number:/\d+(?:\.\d+)?/,
				whitespace:/\s+/,
				tokenName:/[\da-zA-Z]+/,
				token:/%{tokenName}%/,
				tokenWithNameCapture:/%({tokenName})%/,
				wordSplitter:/({whitespace}|{token}|{punctuation}|{number})/
			})
		;

		return _superclass.subclass ({
			instanceMethods:{
				getLanguageResourcePath:function (_enResourcePath,_language) {
					return _enResourcePath.replace (_resourceFilePathRegExp,'$1' + _language.replace ('-','_') + '$2');
				},

				isResourceFile:function (_filePath) {
					return _resourceFilePathRegExp.test (_filePath);
				},

				parseResourceFile:function (_resourceFileText) {
					return Uize.Data.Simple.parse ({simple:_resourceFileText,collapseChildren:true});
				},

				serializeResourceFile:function (_messages) {
					return Uize.map (
						Uize.Data.NameValueRecords.fromHash (_messages),
						function (_nameValue) {return _nameValue.name + ': ' + _nameValue.value}
					).join ('\n');
				}
			},

			instanceProperties:{
				tokenRegExp:_wordSplitterRegExpComposition.get ('tokenWithNameCapture'),
				wordSplitter:_wordSplitterRegExpComposition.get ('wordSplitter')
			}
		});
	}
});

