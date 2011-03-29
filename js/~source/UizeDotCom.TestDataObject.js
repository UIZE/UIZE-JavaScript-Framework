Uize.module ({
	name:'UizeDotCom.TestDataObject',
	builder:function () {
		var _cachedData;

		return function (_getCopy) {
			if (_cachedData && !_getCopy) return _cachedData;

			var _data = {
				someDataTypes:{
					aString:'this is a string value',
					aNumber:123.456,
					aDate:new Date ('Tue Aug 19 2008 21:29:57 GMT-0700 (Pacific Daylight Time)'),
					aBoolean:true,
					aRegularExpression:/\d+/gim,
					anArray:[123.456,'string value',true,/\d+/gim],
					anObject:{
						objectProperty1:'value',
						objectProperty2:'value',
						objectPropertyN:'value'
					},
					aNullValue:null,
					anUndefinedValue:undefined,
					anEmptyArray:[],
					anEmptyObject:{}
				},
				numericalKeys:{
					123:'value',
					'456':'key was defined in quotes',
					0xff:'key was defined as 0xff',
					123.456:'a floating point key!'
				},
				nonNumericalKeys:{
					'0xff':'key was defined in quotes',
					'0123':'string 0123 != number 0123',
					'-1':'numerical key cannot be negative'
				},
				nonIdentifiersAsKeys:{
					'0key':'cannot start with numerals',
					'a key containing spaces':1,
					'a.key.like.an.object.path':1,
					'~!@#$%^&*()_+':1,
					'a key with a double quote "':1,
					'a key with a single quote \'':1
				},
				identifiersAsKeys:{
					'key0':'key with numeral',
					'key_to_success':'key with underscores',
					'$key':'key with dollar',
					'vanillaKey':'YUM!'
				},
				reservedWordsAsKeys:{
					'break':1, 'case':1, 'catch':1, 'continue':1, 'const':1, 'debugger':1, 'default':1, 'delete':1, 'do':1, 'else':1, 'export':1, 'false':1, 'finally':1, 'for':1, 'function':1, 'if':1, 'import':1, 'in':1, 'instanceof':1, 'new':1, 'null':1, 'return':1, 'switch':1, 'this':1, 'throw':1, 'true':1, 'try':1, 'typeof':1, 'var':1, 'void':1, 'while':1, 'with':1
				}
			};
			return _getCopy ? _data : (_cachedData = _data);
		};
	}
});

