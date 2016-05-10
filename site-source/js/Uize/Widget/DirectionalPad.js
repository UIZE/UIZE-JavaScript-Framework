/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.DirectionalPad Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 15
*/

/*?
	Introduction
		The =Uize.Widget.DirectionalPad= class manages the state of a set of button widgets that emulate a directional pad.

		*DEVELOPERS:* `Tim Carter`
*/

Uize.module ({
	name:'Uize.Widget.DirectionalPad',
	required:[
		'Uize.Widget.Button',
		'Uize.Dom.Classes',
		'Uize.Widget.mWeb'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_Uize_Dom_Classes = _Uize.Dom.Classes,

			/*** General Variables ***/
				_childrenInMini = {north:1,south:1,east:1,west:1,center:1}
		;

		/*** Private Instance Methods ***/
			function _updateUiMode () {
				var m = this;

				if (m.isWired) {
					if (m._useLinks) {
						var _name, _buttonDictionary = m._buttonDictionary;
						for (_name in _buttonDictionary)
							m.web (_name).display(m._mode == 'full' || _name in _childrenInMini)
						;
					} else {
						var _children = m.children;

						// this only works if we have just two modes.
						for (var _child in _children)
							m.web(_children [_child]).display(m._mode == 'full' || _child in _childrenInMini )
						;
					}
				}
			}

			function _updateUiEnabled (m) {
				var
					_children = m.children,
					_enabled = m.get ('enabled'),
					_cssClassDisabledButton = m._cssClassDisabledButton,
					_buttonDictionary = m._buttonDictionary,
					_useLinks = m._useLinks
				;

				// if enabled is an object then parse through and set the children enabled states
				if (typeof _enabled == 'object') {
					var
						_default = _enabled.defaultValue === undefined || _enabled.defaultValue,
						_childName
					;

					for (_childName in _buttonDictionary) {
						var _childNameInEnabled = _childName in _enabled;

						if (_childNameInEnabled || _default !== undefined) {
							var _childEnabled = _childNameInEnabled ? _enabled [_childName] : _default;

							if (_useLinks) {
								_Uize_Dom_Classes.setState(m.getNode (_childName), _cssClassDisabledButton, _childEnabled);
							}
							else
								_children [_childName].set ({
									enabled:_childEnabled
								});
						}
					}
				} else {
					if (_useLinks) {
						var _buttonName;
						for (_buttonName in _buttonDictionary) {
							_Uize_Dom_Classes.setState(m.getNode (_buttonName), _cssClassDisabledButton, _enabled);
						}
					} else
						Uize.callOn (_children,'set',[{enabled:_enabled}]);
				}
			}

		return _superclass.subclass ({
			mixins:_Uize.Widget.mWeb,

			omegastructor:function () {
				var m = this;
				if (!m._useLinks) {
					var
						_Uize_Widget_Button = _Uize.Widget.Button,
						_buttonDictionary = m._buttonDictionary
					;
					_Uize.forEach(
						_buttonDictionary,
						function(_value, _key) {
							m.addChild (_key, _Uize_Widget_Button).wire (
								'Click',
								function (_event) {
									m.fire ({
										name:'Move',
										direction:_buttonDictionary [_key],
										domEvent:_event.domEvent
									});
								}
							);
						}
					);
				}
			},

			instanceMethods:{
				wireUi:function () {
					var m = this;

					if (!m.isWired) {
						m.wire ('Changed.enabled',function () { _updateUiEnabled (m) });

						m._useLinks &&
							_Uize.forEach (
								m._buttonDictionary,
								function (_direction, _name) {
									m.wireNode (
										_name,
										'click',
										function (_event) {
											(m.get ('enabled') || m.get ('enabledInherited')) &&
												m.fire ({
													name:'Move',
													direction:_direction,
													domEvent:_event
												})
											;
										}
									);
								}
							)
						;

						_superclass.doMy (m,'wireUi');
					}
				},

				updateUi:function () {
					var m = this;
					if (m.isWired) {
						_superclass.doMy (m,'updateUi');
						_updateUiMode.call (m);
						_updateUiEnabled (m);
					}
				}
			},

			stateProperties:{
				_buttonDictionary:{
					name:'buttonDictionary',
					value:{
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
					}
				},
				_cssClassDisabledButton:'cssClassDisabledButton',
				_mode:{
					name:'mode',
					onChange:_updateUiMode,
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
			}
		});
	}
});

