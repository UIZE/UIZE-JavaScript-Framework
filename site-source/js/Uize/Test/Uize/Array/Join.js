/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Array.Join Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		The =Uize.Test.Uize.Array.Join= module defines a suite of unit tests for the =Uize.Array.Join= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Array.Join',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Array.Join Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Array.Join'),
				Uize.Test.staticMethodsTest ([
					['Uize.Array.Join.hugJoin',[
						['Test that specifying prefix, suffix, and separator works',
							[['A','B','C','D','E'],'<','>','-'],
							'<A>-<B>-<C>-<D>-<E>'
						],
						['Test that specifying empty prefix, suffix, and separator works',
							[['A','B','C','D','E'],'','',''],
							'ABCDE'
						],
						['Test that specifying number type prefix, suffix, and separator works',
							[['A','B','C','D','E'],0,1,NaN],
							'0A1NaN0B1NaN0C1NaN0D1NaN0E1'
						],
						['Test that specifying boolean type prefix, suffix, and separator works',
							[['A','B','C','D','E'],false,true,true],
							'falseAtruetruefalseBtruetruefalseCtruetruefalseDtruetruefalseEtrue'
						],
						['Test that specifying object type prefix, suffix, and separator works',
							[
								['A','B','C','D','E'],
								Uize.Class.Value ({value:'<'}),
								Uize.Class.Value ({value:'>'}),
								Uize.Class.Value ({value:'-'})
							],
							'<A>-<B>-<C>-<D>-<E>'
						],
						['Test that specifying just prefix and suffix, but no separator, works',
							[['A','B','C','D','E'],'<','>'],
							'<A><B><C><D><E>'
						],
						['Specifying an empty array produces an empty string result',
							[[],'<','>','-'],
							''
						],
						['Test that specifying a non-zero length array that is unpopulated (elements are empty) works',
							[new Array (5),'<','>','-'],
							'<>-<>-<>-<>-<>'
						],
						['Test that specifying array containing different value types works',
							[[1,true,'hello',Infinity,NaN,null,undefined],'<','>','-'],
							'<1>-<true>-<hello>-<Infinity>-<NaN>-<>-<>'
						]
					]]
				])
			]
		});
	}
});

