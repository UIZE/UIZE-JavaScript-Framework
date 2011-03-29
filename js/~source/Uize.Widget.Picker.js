/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 7
*/

/*?
	Introduction
		The =Uize.Widget.Picker= class acts as a base class for value picker widget classes, such as the =Uize.Widget.Picker.Date= class.

		*DEVELOPERS:* `Chris van Rensburg`

		### In a Nutshell
			- deferred loading of picker dialog, including loading of JavaScript modules, building and insertion of HTML markup for widget, and wiring up of picker dialog widget, so that many picker instances can be created on a page without adding siginificant load to the page.
			- dialog is moored to =selector= button's root node, with =offsetX= and =offsetY= values that are half the width and height of the selector button's root node, respectively, so that the top left corner of the diaog should be positioned by the center of the selector button.
			- picker dialog is shared among multiple picker instances
				- when the picker dialog is launched, the values of the piped properties are relayed to the picker dialog widget, which are in turn piped through to the counterpart properties of the picker widget, allowing multiple =Uize.Widget.Picker= instances to share the same dialog widget. Whenever the dialog is launched for a specific picker instance, the dialog's state is synchronized to the state of the picker instance.
			- widget class for dialog is configurable. This allows a subclass specific to your own Web application to be used, which is likely to be a subclass of =Uize.Widget.Dialog.Picker=
*/

Uize.module ({
	name:'Uize.Widget.Picker',
	superclass:'Uize.Widget.FormElement',
	required:[
		'Uize.Widget.Button',
		'Uize.Node.Event'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						function _pickValue () {
							_this.set({focused:false});
							var
								_mooringNode = _this.children.selector.getNode () || _this.getNode ('input'),
								_mooringNodeDims = Uize.Node.getDimensions (_mooringNode)
							;
							function _possiblyFocus () {
								_this._allowManualEntry && _this.set({focused:true});
							}
							_this.callInherited ('useDialog') ({
								widgetClassName:_this._dialogWidgetClass,
								widgetProperties:
									Uize.copyInto (
										{
											name:'dialog' + _this._dialogWidgetClass.replace (/\./g,''),
											mooringNode:_mooringNode,
											offsetX:_mooringNodeDims.width >> 1,
											offsetY:_mooringNodeDims.height >> 1
										},
										_this.get ((_this._pipedProperties || []).concat ('value'))
									),
								submitHandler:function (_value,_event) {
									_this.set ({
										value:
											_value != null
												? (_this._valueFormatter ? _this._valueFormatter.call (_this,_value) : _value)
												: ''
									});
									_event.keepOpen || _possiblyFocus ();
								},
								dismissHandler:_possiblyFocus
							});
						}

						/*** watch focus by user ***/
							_this.wire (
								'Changed.focused',
								function () { _this.get('focused') && !_this._allowManualEntry && _pickValue () }
							);

						/*** watch click on input node ***/
							_this.wireNode (
								'input',
								'mousedown',
								function (_event) {
									if (!_this._allowManualEntry) {
										Uize.Node.Event.abort (_event);
										_pickValue ();
									}
								}
							);

						/*** add selector button */
							_this.addChild ('selector',Uize.Widget.Button).wire ('Click',_pickValue);
								/*?
									Child Widgets
										selector
											document...
								*/
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Register Properties ***/
			_class.registerProperties ({
				_dialogWidgetClass:'dialogWidgetClass',
					/*?
						Set-get Properties
							dialogWidgetClass
								document...

								NOTES
								- the initial value is =undefined=
					*/
				_allowManualEntry:{
					name:'allowManualEntry',
					value:true
					/*?
						Set-get Properties
							allowManualEntry
								document...

								NOTES
								- the initial value is =true=
					*/
				},
				_pipedProperties:'pipedProperties',
					/*?
						Set-get Properties
							pipedProperties
								document...

								NOTES
								- the initial value is =undefined=
					*/
				_valueFormatter:'valueFormatter'
					/*?
						Set-get Properties
							valueFormatter
								document...
									NOTES
									- the initial value is =undefined=
					*/
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				value:null
			});

		return _class;
	}
});

