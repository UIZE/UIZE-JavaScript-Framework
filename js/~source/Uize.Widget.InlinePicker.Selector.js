/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.InlinePicker.Selector Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.InlinePicker.Selector= class provides functionality for inline picker widgets that require selection from a set of values (like a radio button list)

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.InlinePicker.Selector',
	required:[
		'Uize.Widget.Options.Selector',
		'Uize.Widget.Button.ValueDisplay.Selector',
		'Uize.Util.PropertyAdapter'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass (
				null,
				function() {
					var _this = this;

					function _addPropertyApater(_propertyName) {
						new Uize.Util.PropertyAdapter({
							propertyA:{
								instance:_this,
								property:_propertyName
							},
							propertyB:{
								instance:_this.children.value,
								property:_propertyName
							}
						})
					}
					
					_addPropertyApater('valueNo');
					_addPropertyApater('tentativeValueNo');
				}
			),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.getValueObject = function (_name) {
				var _undefined;
				return Uize.findRecord (
					this._values,
					{
						name:_name == _undefined
							? this + ''
							: _name
					}
			);
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_tentativeValueNo:{	// read-only
					name:'tentativeValueNo',
					value:-1
				},
				_valueNo:{
					name:'valueNo',	// read-only
					value:-1
				},
				_values:{
					name:'values',
					value:[]
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				pipedProperties:['values'],
				valueDisplayWidgetClass:Uize.Widget.Button.ValueDisplay.Selector,
				valueWidgetClass:Uize.Widget.Options.Selector
			});

		return _class;
	}
});

