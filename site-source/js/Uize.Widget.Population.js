/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Population Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Widget.Population= class implements population of contents into a DOM node, by cloning an HTML template using data from a records array.

		*DEVELOPERS:* `Chris van Rensburg`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Population',
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						/*** Private Instance Properties ***/
							this._changesSinceLastUpdate = {_templateStr:_true,_items:_true};
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Utility Functions ***/
			/* IMPORTANT:
				This was brought over from Uize.Json. Perhaps it could be factored out into some common package (Uize.Json?) where it can be shared.
			*/
			function _getQuotedStr (_string,_quoteChar) {
				return (
					_quoteChar +
					_string.replace (
						/\\/g,'\\\\'
					).replace (
						/\n/g,'\\n'
					).replace (
						/\r/g,'\\r'
					).replace (
						new RegExp (_quoteChar,'g'),'\\' + _quoteChar
					) +
					_quoteChar
				);
			}

			function _populate (
				_templateStr,_templateItem,_items,_itemPhantomProperties,_itemPrefix,_itemSuffix,_outputPrefix,_outputSuffix
			) {
				/*** build up a reconstruction sequence ***/
					/* NOTES
						The reconstruction sequence is a sequence of insertion objects, with each object being the unchanged text between the previous insertion object and the current one, and a code for the property who's value should be substituted. The last insertion object in the sequence may have no property to be inserted.
					*/
					var
						_insertionObjects = [],
						_index = 0,
						_templateStrLength = _templateStr.length
					;
					while (_index < _templateStrLength) {
						/* find the nearest template item property match */
						var
							_nearestPropertyPath = '',
							_nearestPropertyValue = '',
							_nearestPropertyIndex = _templateStrLength,
							_findNearestPropertyName = function (_object,_objectPath) {
								var _propertyIndex;
								for (var _propertyName in _object) {
									var
										_propertyValue = _object [_propertyName],
										_propertyValueIsObject = typeof _propertyValue == 'object',
										_propertyPath = '(' + _objectPath + ' || {}) [' + _getQuotedStr (_propertyName,'\'') + ']'
									;
									if (_propertyValueIsObject && typeof _propertyValue.length != 'number') {
										_findNearestPropertyName (_propertyValue,_propertyPath);
									} else {
										if (_propertyValueIsObject) {
											var _subTemplateItem = _propertyValue [0];
											_propertyIndex = _templateStr.indexOf (_subTemplateItem.OPENER_TOKEN,_index);
											if (_propertyIndex > -1) {
												var _closerTokenPos = _templateStr.indexOf (
													_subTemplateItem.CLOSER_TOKEN,_propertyIndex + _subTemplateItem.OPENER_TOKEN.length
												);
												if (_closerTokenPos > -1) {
													_propertyValue = _templateStr.slice (
														_propertyIndex,_closerTokenPos + _subTemplateItem.CLOSER_TOKEN.length
													);
												} else {
													_propertyIndex = -1;
												}
											}
										} else {
											_propertyIndex = _templateStr.indexOf (_propertyValue,_index);
										}
										if (_propertyIndex > -1 && _propertyIndex < _nearestPropertyIndex) {
											_nearestPropertyPath = _propertyPath;
											_nearestPropertyValue = _propertyValue;
											_nearestPropertyIndex = _propertyIndex;
										}
									}
								}
							}
						;
						_findNearestPropertyName (_templateItem,'obj');
						_insertionObjects.push ({
							_precedingText:_templateStr.slice (_index,_nearestPropertyIndex),
							_propertyPath:_nearestPropertyPath,
							_propertyGetter:_nearestPropertyPath ? Function ('obj','return ' + _nearestPropertyPath) : 0,
							_propertyValue:_nearestPropertyValue
						});
						_index = _nearestPropertyIndex;
						if (_nearestPropertyPath)
							_index += _nearestPropertyValue.length
						;
					}

				/*** follow the reconstruction sequence of insertion objects to build the output for each item ***/
					var _populationChunks = [_outputPrefix];
					for (var _itemNo = -1, _itemsLength = _items.length; ++_itemNo < _itemsLength;) {
						var _item = _items [_itemNo];
						_populationChunks.push (_itemPrefix);
						for (
							var _insertionObjectNo = -1, _insertionObjectsLength = _insertionObjects.length;
							++_insertionObjectNo < _insertionObjectsLength;
						) {
							var
								_insertionObject = _insertionObjects [_insertionObjectNo],
								_insertionObjectPropertyPath = _insertionObject._propertyPath
							;
							_populationChunks.push (_insertionObject._precedingText);
							if (_insertionObjectPropertyPath) {
								if (_insertionObjectPropertyPath == '(obj || {}) [\'GENERATED_itemNo\']') {
									_populationChunks.push (_itemNo);
								} else {
									var
										_insertionObjectPropertyGetter = _insertionObject._propertyGetter,
										_propertyValue = _insertionObjectPropertyGetter (_item)
									;
									if (_propertyValue === _undefined)
										_propertyValue = _insertionObjectPropertyGetter (_itemPhantomProperties)
									;
									if (_propertyValue !== _undefined) {
										if (Uize.isFunction (_propertyValue)) {
											_propertyValue = _propertyValue.call (_item);
										} else if (Uize.isArray (_propertyValue)) {
											var _subTemplateItem = _insertionObjectPropertyGetter (_templateItem) [0];
											_propertyValue = _populate (
												_insertionObject._propertyValue.slice (
													_subTemplateItem.OPENER_TOKEN.length,
													_insertionObject._propertyValue.length - _subTemplateItem.CLOSER_TOKEN.length
												),
												_subTemplateItem,
												_propertyValue,
												'','','',''
											);
										}
										_populationChunks.push (
											_propertyValue != null ? _propertyValue : _insertionObject._propertyValue
										);
									}
								}
							}
						}
						_populationChunks.push (_itemSuffix);
					}

				_populationChunks.push (_outputSuffix);
				return _populationChunks.join ('');
			}

		/*** Public Instance Methods ***/
			_classPrototype.getOutput = function () {
				var _this = this;
				return (
					_populate (
						_this._templateStr,
						_this._templateItem,
						_this._items,
						_this._itemPhantomProperties,
						_this._itemPrefix,
						_this._itemSuffix,
						_this._outputPrefix,
						_this._outputSuffix
					)
				);
				/*?
					Instance Methods
						getOutput
							Returns a string, being the output generated using the value of the =templateStr= state property and the record set contained by the =items= state property.

							SYNTAX
							......................................
							outputSTR = myPopulation.getOutput ();
							......................................
				*/
			};

			_classPrototype.getHtml = function () {
				/* TO DO
					!!!IMPORTANT!!! this is a hack for now. There should be a better/safer way to deal with the whitespace-affects-layout issue without having to strip whitespace from the generated HTML (which is eeeeeeevil)
				*/
				return this.getOutput ().replace (/[\t\n\r ]+/g,' ').replace ('> <','><');
				/*?
					Instance Methods
						getHtml
							Returns a string, being the HTML markup generated using the template HTML contained in the =templateStr= state property and the record set contained by the =items= state property.

							SYNTAX
							..................................
							htmlSTR = myPopulation.getHtml ();
							..................................
				*/
			};

			_classPrototype.updateUi = function () {
				var
					_this = this,
					_changesSinceLastUpdate = _this._changesSinceLastUpdate
				;
				if (
					_this.isWired &&
					(_changesSinceLastUpdate._templateStr || _changesSinceLastUpdate._items) &&
					_this.get ('enabledInherited')
				) {
					var _nodeToInjectInto =
						Uize.Node.getById (_this.get ('container')) || _this.getNode ('shell') || _this.getNode ()
					;
					if (_nodeToInjectInto) {
						if (!_this._templateStr) _this._templateStr = _nodeToInjectInto.innerHTML;
						var _newHtml = _this.getHtml ();
						if (_newHtml !== _this._oldHtml)
							_nodeToInjectInto.innerHTML = _this._oldHtml = _newHtml
						;
						_changesSinceLastUpdate._templateStr = _changesSinceLastUpdate._items = _false;
					}
				}
				/*?
					Instance Methods
						updateUi
							Updates the contents of the DOM node specified by the =container= state property, using the =getHtml= instance method to generate the new HTML markup.

							SYNTAX
							.........................
							myPopulation.updateUi ();
							.........................

							NOTES
							- if the =templateStr= state property is undefined, null, or an empty string at the time that this method first performs its action, then this property value will be set by taking the value of the =container= node's =innerHTML= property
							- this method is called automatically whenever there is a change in the values of the =templateStr= and =items= state properties
							- if the =container= state property is equivalent to =false=, or if the node specified by this property does not exist in the DOM, then this method will have no action
							- if the =enabled= state property is equivalent to =false=, then this method will have no action
							- this method is optimized so that if it is called repeatedly and in that time there is no change in the values of the =templateStr= or =items= state properties, then its action will *not* be performed repeatedly
				*/
			};

		/*** Public Static Methods ***/
			_class.makeTemplateItem = function (_item,_tokenNaming) {
				var _tokenMaker = function (_key) {return _key};
				if (typeof _tokenNaming == 'string' && _tokenNaming) {
					_tokenMaker = function (_key) {return _tokenNaming.replace ('KEY',_key)};
				} else if (Uize.isFunction (_tokenNaming)) {
					_tokenMaker = _tokenNaming;
				}
				function _makeTokens (_keySourceObject,_tokenHostObject,_keyPrefix) {
					for (var _key in _keySourceObject) {
						var _value = _keySourceObject [_key];
						typeof _value == 'object'
							? _makeTokens (_value,_tokenHostObject [_key] = {},_key + '.')
							: _tokenHostObject [_key] = _tokenMaker (_keyPrefix + _key)
						;
					}
					return _tokenHostObject;
				}
				return _makeTokens (_item,{},'');
				/*?
					Static Methods
						Uize.Widget.Population.makeTemplateItem
							Generates a template item, using the specified item and token naming scheme, that can then be used when setting the =templateItem= state property of an instance.

							SYNTAX
							................................................................................
							templateItemOBJ = Uize.Widget.Population.makeTemplateItem (itemOBJ,tokenNamingSTRorFN);
							................................................................................

							When a string value is specified for the =tokenNamingSTRorFN= parameter, then the token for any given key will be generated by replacing the text "KEY" in the value of the =tokenNamingSTRorFN= parameter with the actual name of the key. Consider the following example...

							EXAMPLE 1
							....................................................
							Uize.Widget.Population.makeTemplateItem (
								{
									firstName:'Jack',
									lastName:'Frost',
									cellPhone:'(111) 123-4567',
									address:'632 North Haven Drive, Arlington, NC'
								},
								'##KEY##'
							);
							....................................................

							The above example would generate the following template item object...

							.............................
							{
								firstName:'##firstName##',
								lastName:'##lastName##',
								cellPhone:'##cellPhone##',
								address:'##address##'
							}
							.............................

							This template item could then be used by an instance of =Uize.Widget.Population= when iterating over multiple person items and substituting the tokens of the form ##KEY## in the template string with the values for those keys in each item. If all of the items have the same keys, then one could simply use the first item in the items array to generate the template item with its key-to-token mappings.

							Now, if a function reference is specified for the =tokenNamingSTRorFN= parameter, then the token for any given key will be generated by calling the function and passing in the actual name of the key as a parameter. The value that is returned by the function will then be used as the token. Consider the following example...

							EXAMPLE 2
							....................................................
							Uize.Widget.Population.makeTemplateItem (
								{
									firstName:'Jack',
									lastName:'Frost',
									cellPhone:'(111) 123-4567',
									address:'632 North Haven Drive, Arlington, NC'
								},
								function (key) {return '[ ' + key.toUpperCase () + ' ]'}
							);
							....................................................

							The above example would generate the following template item object...

							.............................
							{
								firstName:'[FIRSTNAME]',
								lastName:'[LASTNAME]',
								cellPhone:'[CELLPHONE]',
								address:'[ADDRESS]'
							}
							.............................

							VARIATIONS
							.............................................................
							templateItemOBJ = Uize.Widget.Population.makeTemplateItem (itemOBJ);
							.............................................................

							When no =tokenNamingSTRorFN= parameter is specified, then the token names generated in the template item will be identical to the key names.
				*/
			};

			_class.replaceByTemplateItem = function (_sourceStr,_item,_templateItem) {
				return _populate (_sourceStr,_templateItem,[_item],_undefined,'','','','');
			};

			_class.replaceByToken = function (_sourceStr,_item,_tokenNaming) {
				return _class.replaceByTemplateItem (_sourceStr,_item,_class.makeTemplateItem (_item,_tokenNaming || '{KEY}'));
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_outputPrefix:{
					name:'outputPrefix',
					value:''
				},
				_outputSuffix:{
					name:'outputSuffix',
					value:''
				},
				_itemPrefix:{
					name:'itemPrefix',
					value:''
				},
				_itemSuffix:{
					name:'itemSuffix',
					value:''
				},
				_items:{
					name:'items',
					onChange:function () {
						this._changesSinceLastUpdate._items = _true;
						this.updateUi ();
					},
					value:[]
				},
				_itemPhantomProperties:'itemPhantomProperties',
				_templateItem:'templateItem',
				_templateStr:{
					name:'templateStr',
					onChange:function () {
						this._changesSinceLastUpdate._templateStr = _true;
						this.updateUi ();
					}
					/*?
						State Properties
							templateStr
								A string, representing the template that should be used when generating output in the =getOutput= and =getHtml= instance methods.

								If this property is undefined, null, or an empty string at the time that the =updateUi= instance method first performs its action, then its value will be set by taking the value of the =container= node's =innerHTML= property.

								NOTES
								- the initial value is undefined
					*/
				}
			});

		return _class;
	}
});

