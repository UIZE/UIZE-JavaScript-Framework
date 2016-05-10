/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
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
		The =Uize.Dom.Util= module provides a home for miscellaneous node related methods that are too esoteric to belong in the base =Uize.Dom.Basics= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Dom.Util',
	required:'Uize.Dom.Basics',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Basics = Uize.Dom.Basics,

			/*** references to static methods used internally ***/
				_getOpacityProperties,
				_stylePropertiesAsStr,

			/*** variables for showClickable method ***/
				_useHandForPointerCursor = _Uize_Dom_Basics.isIe && _Uize_Dom_Basics.ieMajorVersion < 9
		;

		return Uize.package ({
			getEffectiveBgColor:function (_node) {
				var _background = '';
				_node = _Uize_Dom_Basics.getById (_node);
				while ((!_background || _background == 'transparent' || _background == 'none') && _node) {
					_background = _Uize_Dom_Basics.getStyle (_node,'backgroundColor');
					_node = _node.parentNode;
				}
				return _background;
				/*?
					Static Methods
						Uize.Dom.Util.getEffectiveBgColor
							Returns a string, representing the effective background color for the specified node.

							SYNTAX
							...................................................................
							styleBgColorSTR = Uize.Dom.Util.getEffectiveBgColor (nodeSTRorOBJ);
							...................................................................

							This method will ascend the parent hierarchy until a node is found whose background is not set to ='transparent'= or ='none'=. So, for example, if the specified node has its background set to ='none'= but its parent node has its background set to ='#fff'=, then this method will return the value ='#fff'=.
				*/
			},

			getOpacityProperties:_getOpacityProperties = function (_opacity) {
				return (
					_Uize_Dom_Basics.isIe
						? {filter:'alpha(opacity=' + Math.round (_opacity * 100) + ')'}
						: {opacity:_opacity + ''}
				);
				/*?
					Static Methods
						Uize.Dom.Util.getOpacityProperties
							Returns an object, being the CSS style properties necessary in order to achieve the specified degree of opacity.

							SYNTAX
							...................................................................................
							styleOpacityPropertiesOBJ = Uize.Dom.Util.getOpacityProperties (opacityFLOATorOBJ);
							...................................................................................

							For standards compliant browsers, the returned object contains an "opacity" property, while for Internet Explorer it contains a "filter" property.

							The returned object can be "stitched" into a style properties parameter, using the =Uize.copyInto= static method, in order to prepare a subsequent call to the =Uize.Dom.Basics.setStyle= static method, as follows...

							EXAMPLE
							.............................................
							Uize.Dom.Basics.setStyle (
								'someNodeId',
								Uize.copyInto (
									{
										display : 'block',
										position  :'absolute',
										visibility : 'inherit',
										top : '100px'
									},
									Uize.Dom.Util.getOpacityProperties (.5)
								)
							);
							.............................................

							NOTES
							- the =opacityFLOATorOBJ= parameter can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
							- see also the =Uize.Dom.Util.getOpacityStr= static method
				*/
			},

			getOpacityStr:function (_opacity) {
				return _stylePropertiesAsStr (_getOpacityProperties (_opacity));
				/*?
					Static Methods
						Uize.Dom.Util.getOpacityStr
							Returns a string, representing the CSS style property corresponding to the specified opacity value.

							SYNTAX
							........................................................
							opacitySTR = Uize.Dom.Util.getOpacityStr (opacityFLOAT);
							........................................................

							This method abstracts the difference between Microsoft Internet Explorer (that supports the proprietary =alpha= option for the =filter= style property) and browsers that support the W3C standard =opacity= style property. For example, the expression =Uize.Dom.Util.getOpacityStr (.5)= will produce the string ='filter:alpha(opacity=50);'= for Internet Explorer, and the string ='opacity:0.5;'= for all other browsers.

							NOTES
							- see also the =Uize.Dom.Util.getOpacityProperties= static method
				*/
			},

			showClickable:function (_nodeBlob,_clickable) {
				_Uize_Dom_Basics.setStyle (
					_nodeBlob,
					{
						cursor:
							_clickable || _clickable === undefined
								? (_useHandForPointerCursor ? 'hand' : 'pointer')
								: 'default'
					}
				);
				/*?
					Static Methods
						Uize.Dom.Util.showClickable
							Sets the value of the "cursor" style property of the specified `node blob` so that the node(s) appear either clickable or not, depending on the specified boolean value.

							This method is useful for DOM nodes that need to be wired up with click actions by JavaScript code, but that don't have CSS selectors from the document applying the appropriate cursor style to them.

							SYNTAX
							........................................................
							Uize.Dom.Util.showClickable (nodeBLOB,clickableANYTYPE);
							........................................................

							While typically a Boolean, the =clickableANYTYPE= parameter can be of any type and the node(s) will be set to appear clickable if it resolves to =true=, and not clickable if it resolves to =false= - with the exception of =undefined=, when the node(s) will be set to appear clickable (see explanation below).

							VARIATION
							.......................................
							Uize.Dom.Util.showClickable (nodeBLOB);
							.......................................

							When no =clickableANYTYPE= parameter is specified (or when its value is =undefined=), the node(s) will be set to appear clickable.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			},

			showInLayoutFlow:function (_nodeBlob,_mustShow) {
				_mustShow = _mustShow !== _false;
				_setStyle (
					_nodeBlob,
					{
						position:_mustShow ? 'static' : 'absolute',
						visibility:_mustShow ? 'inherit' : _hidden
					}
				);
				/*?
					Static Methods
						Uize.Dom.Util.showInLayoutFlow
							Lets you show a node in the layout flow of its surrounding HTML or remove it from the layout flow.

							SYNTAX
							.......................................................
							Uize.Dom.Util.showInLayoutFlow (nodeBLOB,mustShowBOOL);
							.......................................................

							The effect of this method is similar to setting a value for the =display= CSS property, except without the negative side effects of using =display:none= to take a node out of the layout flow. In some browsers, nodes that have their =display= CSS property set to =none= (or that are contained inside a DOM tree where the parent node has its =display= set to =none=) will report offset dimensions of zero and may report other less than useful values for runtime related rendering properties, thereby tripping up JavaScript UI setup code that may act on such nodes.

							Instead of using the =display= property, this method sets values for both the =position= and =visibility= properties. When a value of =true= is specified for the =mustShowBOOL= parameter, then the =position= property is set to =relative= and the =visibility= property is set to =inherit=. And when =false= is specified for =mustShowBOOL=, then =position= is set to =absolute= and =visibility= is set to =hidden=.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			},

			stylePropertiesAsStr:_stylePropertiesAsStr = function (_properties) {
				var _resultChunks = [];
				for (var _property in _properties)
					_resultChunks.push (_property,':',_properties [_property],'; ')
				;
				return _resultChunks.join ('');
				/*?
					Static Methods
						Uize.Dom.Util.stylePropertiesAsStr
							Returns a string, representing the serialization of the specified set of CSS style properties.

							SYNTAX
							........................................................
							Uize.Dom.Util.stylePropertiesAsStr (stylePropertiesOBJ);
							........................................................

							EXAMPLE
							.....................................
							Uize.Dom.Util.stylePropertiesAsStr ({
								display:'block',
								position:'absolute',
								visibility:'inherit',
								top:100
							});
							.....................................

							In the above example, the =Uize.Dom.Util.stylePropertiesAsStr= method call would return the string output ='display:block; position:absolute; visibility:inherit; top:100px;'=.
				*/
			}
		});
	}
});

