/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.DirectionalPad Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 15
*/

/*?
	Introduction
		The =Uize.Widget.DirectionalPad= class manages the state of a set of button widgets that emulate a directional pad.

		*DEVELOPERS:* `Tim Carter`
*/

Uize.module ({
	name:'Uize.Widget.DirectionalPad',
	required:'Uize.Widget.Button',
	builder:function (_superclass) {
		'use strict';

		/*** Constructor ***/
			var
				_buttonDictionary = {
					north:'North',
					south:'South',
					east:'East',
					west:'West',
					northeast:'Northeast',
					northwest:'Northwest',
					southeast:'Southeast',
					southwest:'Southwest',
					northEdge:'NorthEdge',
					southEdge:'SouthEdge',
					eastEdge:'EastEdge',
					westEdge:'WestEdge',
					northeastEdge:'NortheastEdge',
					southeastEdge:'SoutheastEdge',
					northwestEdge:'NorthwestEdge',
					southwestEdge:'SouthwestEdge',
					center:'Center'
				},
				_childrenInMini = {north:1,south:1,east:1,west:1,center:1},
				_class = _superclass.subclass (
					null,
					function () {
						if (!this._useLinks)
							for (var _name in _buttonDictionary)
								this._addChildButton (_name).wire (
									'Click',
									function (_event) {
										this.fire ({
											name:'Move',
											direction:_buttonDictionary [_name],
											domEvent:_event.domEvent
										})
									}
								)
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

		/*** Public Instance Methods ***/

		/*** Wiring Methods ***/
			_classPrototype._updateUiMode = function () {
				var
					_this = this
				;
				if (_this.isWired) {
					if (_this._useLinks) {
						for (var _name in _buttonDictionary)
							_this.displayNode (_name, _this._mode == 'full' || _name in _childrenInMini)
						;
					} else {
						var
							_children = _this.children
						;

						// this only works if we have just two modes.
						for (var _child in _children)
							_children [_child].displayNode ('', _this._mode == 'full' || _child in _childrenInMini )
						;
					}
				}
			};

			_classPrototype._updateUiEnabled = function () {
				var
					_this = this,
					_children = _this.children,
					_enabled = _this.get ('enabled'),
					_cssClassDisabledButton = _this._cssClassDisabledButton,
					_useLinks = _this._useLinks
				;

				// if enabled is an object then parse through and set the children enabled states
				if (typeof _enabled == 'object') {
					var
						_default = _enabled.defaultValue === undefined || _enabled.defaultValue,
						_children = _this.children,
						_childName
					;

					for (_childName in _buttonDictionary) {
						var _childNameInEnabled = _childName in _enabled;

						if (_childNameInEnabled || _default !== undefined) {
							var _enable = _childNameInEnabled ? _enabled [_childName] : _default;

							if (_useLinks) {
								var
									_node = _this.getNode (_childName)
								;

								_enable ?
									Uize.Node.Classes.removeClass (_node, _cssClassDisabledButton) :
									Uize.Node.Classes.addClass (_node, _cssClassDisabledButton)
								;
							}
							else
								_children [_childName].set ({
									enabled:_enable
								});
						}
					}
				} else {
					if (_useLinks) {
						for (var _buttonName in _buttonDictionary) {
							var _node = _this.getNode (_buttonName);
							_enabled ?
								Uize.Node.Classes.removeClass (_node, _cssClassDisabledButton) :
								Uize.Node.Classes.addClass (_node, _cssClassDisabledButton)
							;
						}
					} else
						Uize.callOn (_children,'set',[{enabled:_enabled}]);
				}
			};

			_classPrototype.wireUi = function () {
				var
					_this = this
				;

				if (!_this.isWired) {
					_this.wire (
						'Changed.enabled',
						function () { _this._updateUiEnabled () }
					);

					_this._useLinks &&
						Uize.forEach (
							_buttonDictionary,
							function (_direction, _name) {
								_this.wireNode (
									_name,
									'click',
									function (_event) {
										(_this.get ('enabled') || _this.get ('enabledInherited')) &&
											_this.fire ({
												name:'Move',
												direction:_direction,
												domEvent:_event
											})
									}
								)
							}
						)
					;

					_superclass.prototype.wireUi.call (_this);
				}
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_superclass.prototype.updateUi.call (_this);
					_this._updateUiMode ();
					_this._updateUiEnabled ();
				}
			};

		/*** Properties Registration ***/
			_class.registerProperties ({
				_cssClassDisabledButton:'cssClassDisabledButton',
				_mode:{
					name:'mode',
					onChange:_classPrototype._updateUiMode,
					value:'full'
					/*?
						State properties
							mode
								A string with (currently) two valid values: 'mini' or 'full'. 'mini' mode will only show the buttons controlling the four cardinal directions. 'full' mode will show all the buttons. =mode= is set to 'full' by default.

							enabled
								Inherited from =Uize.Widget=, =enabled= accepts a fourth value in addition to true, false, and 'inherit': an object with a format described below.

								SYNTAX
								...........................
								_directionalPad.set ({
									enabled:{
										defaultValue:true,
										north:false,
										south:false,
										southeastEdge:false,
										northEdge:true
									}
								});
								...........................

								The =enabled= property object value is a dictionary whose keys are either 'defaultValue' or the names of the =Uize.Widget.DirectionalPad= instance's child widgets. If the child widget is not mentioned in the dictionary, then its value will be set to whatever is specified by 'defaultValue'. If 'defaultValue' is undefined then the child widget's enabled state will not change.
					*/
				},
				_useLinks:'useLinks'
				/*?
					State properties
						useLinks
							A boolean used by the omegastructor and wireUi methods to determine whether to use child button widgets or links for the sub-actions.
				*/
			});

			return _class;
	}
});

