/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Base Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Base= module implements an abstract base class for lightweight parser class modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Base',
	builder:function () {
		'use strict';

		return Uize.mergeInto (
			function (_source,_index) {this.parse (_source,_index)},

			{
				subclass:function (_featuresByType) {
					var
						_superclass = this,
						_class =
							(_featuresByType || (_featuresByType = {})).hasOwnProperty ('constructor')
								? _featuresByType.constructor
								: function () {_superclass.apply (this,arguments)}
					;

					Uize.copyInto (
						_class,
						Uize.map (Uize.copy (_superclass),Uize.clone),
						_featuresByType.staticProperties,
						_featuresByType.staticMethods
					);
					Uize.copyInto (
						_class.prototype,
						Uize.clone (_superclass.prototype),
						_featuresByType.instanceProperties,
						_featuresByType.instanceMethods
					);

					return _class;
				},

				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:false,

					parse:Uize.nop,
					serialize:function () {return ''}
				}
			}
		);
	}
});

