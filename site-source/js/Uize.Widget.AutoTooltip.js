/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.AutoTooltip Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 92
*/

/*?
	Introduction
		The =Uize.Widget.AutoTooltip= class makes it easy to display fancy / decorated HTML tooltips for nodes, using data that is tucked into their attributes.

		*DEVELOPERS:* `Chris van Rensburg`

		Using this module, one can achieve easy, wizard style augmentation of a large number of nodes, with an "Unobtrusive JavaScript" approach that provides graceful degradation in the event that JavaScript is disabled, the JavaScript fails, or the wiring up of the behavior takes a long time.

		This module supports displaying of an HTML tooltip when mousing over each node in a specified array of nodes, where the HTML for the tooltip is automatically generated from data harvested from the title, alt, or other attribute of the nodes. The HTML template for the decorated tooltip is specified in the =html= state property of the instance, where the value can be a function that accepts the tooltip data as its input parameter and returns a string value that is the generated HTML.
*/

Uize.module ({
	name:'Uize.Widget.AutoTooltip',
	required:[
		'Uize.Tooltip',
		'Uize.String'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_auto = 'auto',
				_title = 'title'
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiTooltipHtml = function () {
				var _this = this;
				if (_this.isWired) {
					var _data = _this._data;
					_data && _this.buildHtml (_data);
					Uize.Tooltip.showTooltip (_this.getNode (),!!_data);
				}
			};

			_classPrototype._updateWiringTooltipNodes = function () {
				var
					_this = this,
					_tooltipDataById = {},
					_tooltipOldTitleById = {}
				;
				if (_this.isWired) {
					/* TO DO: Must do something to unwire existing nodes and wire up new nodes. */
					_this.wireNode (
						_this._nodes = Uize.Node.find (_this._nodes),
						{
							mouseover:
								function () {
									var
										_node = this,
										_nodeId = _node.id || (_node.id = Uize.getGuid ()),
										_tooltipData = _tooltipDataById [_nodeId]
									;
									if (_tooltipData === _undefined) {
										var _dataAttribute = _this._dataAttribute;
										if (_dataAttribute == _auto)
											_dataAttribute = _node.title ? _title : 'alt'
										;
										var _tooltipDataStr = _node.getAttribute (_dataAttribute);
										_tooltipData = _tooltipDataById [_nodeId] =
											_tooltipDataStr ? _this._dataDecoder (_tooltipDataStr) : null
										;
										if (_tooltipData && _dataAttribute == _title)
											_tooltipOldTitleById [_nodeId] = _node.title
										;
									}
									if (_tooltipOldTitleById [_nodeId])
										_node.title = ''
									;
									_this.set ({_data:_tooltipData});
								},
							mouseout:
								function () {
									var
										_node = this,
										_nodeOldTitle = _tooltipOldTitleById [_node.id]
									;
									if (_nodeOldTitle) _node.title = _nodeOldTitle;
									_this.set ({_data:null});
								}
						}
					);
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				this._updateUiTooltipHtml ();
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_superclass.prototype.wireUi.call (_this);

					_this._updateWiringTooltipNodes ();
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_data:{
					name:'data',
					onChange:_classPrototype._updateUiTooltipHtml
					/*?
						State Properties
							data
								An object, representing the tooltip data for the current node being moused over.

								NOTES
								- the initial value is =undefined=
								- the value of this state property is set automatically
								- when the mouse is not over one of the nodes specified in the =nodes= state property, then this property will have the value =null= or =undefined=
								- see also the =dataAttribute= and =dataDecoder= state properties
					*/
				},
				_dataAttribute:{
					name:'dataAttribute',
					value:'auto'
					/*?
						State Properties
							dataAttribute
								A string, specifying the name of the node attribute that should be used for obtaining the tooltip data.

								When this state property is set to the special value ='auto'=, then the instance will try to use the =title= attribute. If no value is set for the =title= attribute, then the instance will fall back on using the =alt= attribute. If you wish to explicitly force use of either the =title= or =alt= attribute, then specify the desired one as the value for the =dataAttribute= state property. If the data is stored in a custom attribute (eg. =tooltipData=), then simply specify that custom attribute's name.

								NOTES
								- the initial value is ='auto'=
								- see also the =dataDecoder= state property
					*/
				},
				_dataDecoder:{
					name:'dataDecoder',
					value:function (_sourceStr) {
						var
							_result = {},
							_sacredEmptyArray = [],
							_nameValueRegExp = /(([A-Z0-9 ]+:.+?)((\s*\|\s*)|$))([A-Z ]+:|$)/,
							_dataKeyTransformer = this._dataKeyTransformer || function (_key) {return _key}
						;
						while (_sourceStr) {
							var
								_nameValueMatch = _sourceStr.match (_nameValueRegExp) || _sacredEmptyArray,
								_nameValueStr = _nameValueMatch [2]
							;
							if (_nameValueStr) {
								var _nameValue = Uize.String.splitInTwo (_nameValueStr,/\s*:\s*/);
								_result [_dataKeyTransformer (_nameValue [0])] = _nameValue [1];
								_sourceStr = _sourceStr.substr (_nameValueMatch [1].length);
							} else {
								_sourceStr = '';
							}
						}
						return _result;
					}
					/*?
						State Properties
							dataDecoder
								A function, being the code that will be used to decode the value of the data attribute (specified by the =dataAttribute= state property) for all the tooltip nodes, to produce an object hash containing key/value pairs.

								The function specified by this property should expect a single string parameter and should return an object hash containing key/value pairs.

								The initial value is a function that decodes strings of the form...

								...............................................................
								KEY NAME 1: value 1 | KEY NAME 2: value 2 | KEY NAME N: value N
								...............................................................

								...to produce objects of the form...

								......................
								{
									keyName1:'value 1',
									keyName2:'value 2',
									keyNameN:'value N'
								}
								......................

								The default data decoder requires key names to be in all caps, and key/value pairs to be separated by the "|" (pipe) character. Key names are converted to camelCase, with the first letter of all words after the first word capitalized. Spaces around key names, value names, and the pipe separator are non-significant and are collapsed. This encoding/decoding scheme allows for the tooltip text to be as pretty/readable as possible for the sake of graceful degradation.

								EXAMPLE

								In the event that the tooltip data was encoded in JSON format, then you could specify a JSON decoder as follows...

								..............................................
								myInstance.set ({dataDecoder:Uize.Json.from});
								..............................................

								NOTES
								- see also the =dataAttribute= state property
					*/
				},
				_dataKeyTransformer:{
					name:'dataKeyTransformer',
					value:Uize.String.toCamel
				},
				_nodes:{
					name:'nodes',
					onChange:_classPrototype._updateWiringTooltipNodes
					/*?
						State Properties
							nodes
								An array, representing the nodes that should be wired up to display an automatically generated tooltip when mousing over them.

								To easily set a value for this property, a method such as the =Uize.Node.find= static method may be used to find nodes in the document.

								NOTES
								- the initial value is =undefined=
					*/
				}
			});

		return _class;
	}
});

