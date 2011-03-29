/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Droplist Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=f" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Droplist= widget provides the functionality for wiring a single-select custom droplist or having better programmatic control over a <select> DOM node.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Droplist',
	superclass:'Uize.Widget.Picker.SelectorOld',
	required:[
		'Uize.Widget.PopupPalette',
		'Uize.Node.Event',
		'Uize.Widget.FormElement',
		'Uize.Node'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_null = null,
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var
							_this = this,
							_popupPalette = _this.addChild(
								'palette',
								Uize.Widget.PopupPalette,
								{
									positioning:function() { return _this.getNode('buttonShell') }
								}
							),
							_options = _this.children.options
						;

						// we don't need to wire the options until the palette is shown
						//_options.set({deferWiring:_true});

						/** Wire popup palette **/
							_popupPalette.fade.set ({duration:0});
							/*_popupPalette.wire(
								'Before Palette Shown',
								function() {
									if (!_options.isWired) {
										_options.set({deferWiring:_false});
										_options.wireUi();
									}
								}
							);*/

						/** Wire up events on this instance **/
							_this.wire({
								'Changed.isDirty':function() { _this._updateSelectedValue() },
								'Changed.value':function() { _this._updateSelectedValue() },
								'Changed.values':function() {
									var _values = _this.get('values');

									if (_this.isWired) {
										_this._updateSelectedValue();
										_this._updateUiSelector(); // recompute button width
										_this._updateUiPalette(); // recompute palette width

										// then update the <select> tag
										var _selectNode = _this.getNode('input');

										if (_selectNode && _this.get('type') == 'select-one') {
											// iterate through the values in values object, replacing the Option nodes
											// adding new ones if necessary
											for (
												var
													_valueNo = -1,
													_valuesLength = _values.length,
													_options = _selectNode.options,
													_optionsLength = _options.length,
													_valueMap = _this.get('valueMap')
												;
												++_valueNo < _valuesLength;
											) {
												var
													_valueObject = _values[_valueNo],
													_optionNode
												;

												if (_valueNo < _optionsLength) {// option node already exists
													_optionNode = _options[_valueNo];
												}
												else {
													_optionNode = document.createElement('option');
													try { _selectNode.add(_optionNode, _null) }	// standards compliant
													catch(_ex) { _selectNode.add(_optionNode) }
												}

												_this.setNodeProperties(
													_optionNode,
													{
														value:_valueObject.name,
														text:_valueObject[_valueMap.displayName],
														selected:_this.get('valueNo') == _valueNo
													}
												);
											}

											// Now iterate through options removing any extras
											// NOTE: _optionsLength may not be the actual length of the options array at this point
											// if we added new options past its original length.  But if that's the case, there'll
											// be nothing to remove, so it's ok
											for (var _optionNo = _optionsLength - 1; _optionNo >= _valueNo; _optionNo--)
												_selectNode.remove(_optionNo)
											;
										}
									}
								},
								'Changed.valueNo':function() {
									var _selectNode = _this.getNode('input');

									if (_selectNode)
										_selectNode.selectedIndex = _this.get('valueNo');
								}
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateSelectedValue = function() {
				var
					_this = this,
					_valueObject = _this.getValueObject(),
					_valueMap = _this.get('valueMap')
				;

				if (_this.isWired) {
					var
						_valueExists = _valueObject && (_this.get('isDirty') || !_this._nonDirtyLabel),
						_displayName = _valueExists ? _valueObject[_valueMap.displayName] : _this._nonDirtyLabel
					;

					_this.setNodeValue('displayName', _displayName);
					_this.setNodeProperties(
						['displayName', _this.children.palette.children.selector.getNode()],
						{title:_displayName}
					);

					if (_valueMap.thumbnail) {
						_this.setNodeProperties(
							'thumbnail',
							{
								src:_valueExists ? _valueObject[_valueMap.thumbnail] : '',
								alt:_displayName
							}
						);
						_this.setNodeStyle('thumbnail', {display:_valueExists ? 'inline' : 'none'});
					}
				}
			};

			_classPrototype._updateUiPalette = function() {
				var _this = this;

				if (_this.isWired) {
				var
					_selectorButtonShellNode = _this.getNode('buttonShell'),
					_paletteNode = _this.children.palette.getNode('palette')
				;

				_selectorButtonShellNode && _paletteNode
					&& _this.setNodeStyle(
						_paletteNode,
						{minWidth:Uize.Node.getDimensions(_selectorButtonShellNode).width}
					)
				;
				}
			};

			_classPrototype._updateUiSelector = function() {
				var _this = this;

				if (_this.isWired && _this._seen) {
					var
						_rootNode = _this.getNode(),
						_originalDisplay = _rootNode ? _rootNode.style.display : _null,
						_valueMap = _this.get('valueMap'),
						_currentValueNode = _this.getNode('displayName'),
						_currentValue = _this.getNodeValue(_currentValueNode),
						_nonDirtyLabel = _this._nonDirtyLabel,
						_values = _this.get('values'),
						_valuesLength = _values.length,
						_valueNo = -1,
						_maxValueWidth = 0,
						_valueWidth
					;

					// try to ensure that the selector node is visible
					_rootNode && _this.displayNode(_rootNode);

					// first set the node to auto so that the node will fit the text
					_this.setNodeStyle(_currentValueNode, {width:'auto'});

					function _updateMaxValueWidth(_displayName) {
						_this.setNodeValue(_currentValueNode, _displayName);
						_valueWidth = Uize.Node.getDimensions(_currentValueNode).width;
						_maxValueWidth = _valueWidth > _maxValueWidth ? _valueWidth : _maxValueWidth;
					}

					// then loop through all the values, setting the display names to determine the widest one
					for (; ++_valueNo < _valuesLength;)
						_updateMaxValueWidth(_values[_valueNo][_valueMap.displayName])
					;

					_this._nonDirtyLabel && _updateMaxValueWidth(_this._nonDirtyLabel);

					// fix the width to the max
					_this.setNodeStyle(_currentValueNode, {width:_maxValueWidth});

					// set the original value back
					_this.setNodeValue(_currentValueNode, _currentValue);

					// reset the display value
					if (_rootNode)
						_rootNode.style.display = _originalDisplay
					;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateSelectedValue();
					_this._updateUiSelector();
					_this._updateUiPalette();
					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _optionsRootNode = _this.children.options.getNode();

					// Hide palette selector button if options root node doesn't exist (because we must be using <select>
					_this.children.palette.children.selector.displayNode('', _optionsRootNode);

					_superclass.prototype.wireUi.call (_this);

					// Hide <select> tag if options root node exists (signifying using custom droplist)
					_this.setNodeStyle(
						'input',
						{
							display:_this.get('type') != 'select-one' || !_optionsRootNode
								? 'inline'
								: 'none'
				}
					);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties({
				_nonDirtyLabel:{
					name:'nonDirtyLabel',
					onChange:_classPrototype._updateSelectedValue,
					value:''
				},
				_seen:{	// Temporary until we can come up w/ a universal way to express "seen-ness" of widgets
					name:'seen',
					onChange:_classPrototype._updateUiSelector,
					value:_true
				}
			});

		/*** Override default properties ***/
			_class.set({
				valueMap:{
					displayName:'displayName'
				},
				valueConformerPreset:{
					type:'inValues'	// default conformer is for the value to be in the values set
				}
			});

		return _class;
	}
});

