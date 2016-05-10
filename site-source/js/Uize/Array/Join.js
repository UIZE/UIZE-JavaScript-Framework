/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Array.Join Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Array.Join= module provides methods for joining arrays to form strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Array.Join',
	builder:function () {
		'use strict';

		return Uize.package ({
			hugJoin:function (_items,_prefix,_suffix,_separator) {
				return (
					_items.length
						? (
							'' + _prefix +
							_items.join ('' + _suffix + (_separator != undefined ? _separator : '') + _prefix) +
							_suffix
						)
						: ''
				);
				/*?
					Static Methods
						Uize.Array.Join.hugJoin
							Returns a string, that is the concatenation of the specified array of items, where a prefix and suffix can be specified for hugging each item in the array, and where an optional separator can additionally be specified.

							SYNTAX
							.............................................................................
							joinedSTR = Uize.Array.Join.hugJoin (itemsARRAY,itemPrefixSTR,itemSuffixSTR);
							.............................................................................

							EXAMPLE 1
							.....................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.Array.Join.hugJoin (actions,'[ ',' ]'));
							.....................................................

							EXAMPLE 1 - OUTPUT
							..........................................
							[ view ][ reset ][ save ][ open ][ close ]
							..........................................

							VARIATION
							..........................................................................................
							joinedSTR = Uize.Array.Join.hugJoin (itemsARRAY,itemPrefixSTR,itemSuffixSTR,separatorSTR);
							..........................................................................................

							When the optional =separatorSTR= parameter is specified, then the items being joined will be separated by the specified separator string. This provides you with the functionality you would normally get from the built-in =join= instance method of the =Array= object.

							Technically, the statement =Uize.Array.Join.hugJoin (array,'','',separator)= would be equivalent to the statement =array.join (separator)=. But, if you just wanted to join an array with a separator string, then you would just use the =join= method, so the =separatorSTR= parameter is the last parameter and is optional for the =Uize.Array.Join.hugJoin= method, since the assumption is that you're likely using this method for its prefix/suffix feature.

							EXAMPLE 2
							..........................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.Array.Join.hugJoin (actions,'[ ',' ]',' - '));
							..........................................................

							EXAMPLE 2 - OUTPUT
							......................................................
							[ view ] - [ reset ] - [ save ] - [ open ] - [ close ]
							......................................................

							EXAMPLE 3
							...................................................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.Array.Join.hugJoin (actions,'\t','\n')); // on separate lines, indented
							...................................................................................

							EXAMPLE 3 - OUTPUT
							........
								view
								reset
								save
								open
								close
							........

							EXAMPLE 4
							................................................................................
							var actions = ['view','reset','save','open','close'];
							alert (Uize.Array.Join.hugJoin (actions,'action: "','"\n','---------------\n'));
							................................................................................

							EXAMPLE 4 - OUTPUT
							................
							action: "view"
							---------------
							action: "reset"
							---------------
							action: "save"
							---------------
							action: "open"
							---------------
							action: "close"
							................
				*/
			}
		});
	}
});

