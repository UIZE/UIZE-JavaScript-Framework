/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
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
		The =Uize.Node.Util= module provides a home for miscellaneous node related methods that are too esoteric to belong in the base =Uize.Node= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Node.Util',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Uize_Node = Uize.Node
			;

		/*** Public Static Methods ***/
			_package.getEffectiveBgColor = function (_node) {
				var _background = '';
				_node = _Uize_Node.getById (_node);
				while ((!_background || _background == 'transparent' || _background == 'none') && _node) {
					_background = _Uize_Node.getStyle (_node,'backgroundColor');
					_node = _node.parentNode;
				}
				return _background;
				/*?
					Static Methods
						Uize.Node.Util.getEffectiveBgColor
							Returns a string, representing the effective background color for the specified node.

							SYNTAX
							....................................................................
							styleBgColorSTR = Uize.Node.Util.getEffectiveBgColor (nodeSTRorOBJ);
							....................................................................

							This method will ascend the parent hierarchy until a node is found whose background is not set to ='transparent'= or ='none'=. So, for example, if the specified node has its background set to ='none'= but its parent node has its background set to ='#fff'=, then this method will return the value ='#fff'=.
				*/
			};

			var _getOpacityProperties = _package.getOpacityProperties = function (_opacity) {
				return (
					_Uize_Node.isIe
						? {filter:'alpha(opacity=' + Math.round (_opacity * 100) + ')'}
						: {opacity:_opacity + ''}
				);
				/*?
					Static Methods
						Uize.Node.Util.getOpacityProperties
							Returns an object, being the CSS style properties necessary in order to achieve the specified degree of opacity.

							SYNTAX
							....................................................................................
							styleOpacityPropertiesOBJ = Uize.Node.Util.getOpacityProperties (opacityFLOATorOBJ);
							....................................................................................

							For standards compliant browsers, the returned object contains an "opacity" property, while for Internet Explorer it contains a "filter" property.

							The returned object can be "stitched" into a style properties parameter, using the =Uize.copyInto= static method, in order to prepare a subsequent call to the =Uize.Node.setStyle= static method, as follows...

							EXAMPLE
							..............................................
							Uize.Node.setStyle (
								'someNodeId',
								Uize.copyInto (
									{
										display : 'block',
										position  :'absolute',
										visibility : 'inherit',
										top : '100px'
									},
									Uize.Node.Util.getOpacityProperties (.5)
								)
							);
							..............................................

							NOTES
							- the =opacityFLOATorOBJ= parameter can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
							- see also the =Uize.Node.Util.getOpacityStr= static method
				*/
			};

			_package.getOpacityStr = function (_opacity) {
				return _stylePropertiesAsStr (_getOpacityProperties (_opacity));
				/*?
					Static Methods
						Uize.Node.Util.getOpacityStr
							Returns a string, representing the CSS style property corresponding to the specified opacity value.

							SYNTAX
							.........................................................
							opacitySTR = Uize.Node.Util.getOpacityStr (opacityFLOAT);
							.........................................................

							This method abstracts the difference between Microsoft Internet Explorer (that supports the proprietary =alpha= option for the =filter= style property) and browsers that support the W3C standard =opacity= style property. For example, the expression =Uize.Node.Util.getOpacityStr (.5)= will produce the string ='filter:alpha(opacity=50);'= for Internet Explorer, and the string ='opacity:0.5;'= for all other browsers.

							NOTES
							- see also the =Uize.Node.Util.getOpacityProperties= static method
				*/
			};

			_package.showInLayoutFlow = function (_nodeBlob,_mustShow) {
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
						Uize.Node.Util.showInLayoutFlow
							Lets you show a node in the layout flow of its surrounding HTML or remove it from the layout flow.

							SYNTAX
							........................................................
							Uize.Node.Util.showInLayoutFlow (nodeBLOB,mustShowBOOL);
							........................................................

							The effect of this method is similar to setting a value for the =display= CSS property, except without the negative side effects of using =display:none= to take a node out of the layout flow. In some browsers, nodes that have their =display= CSS property set to =none= (or that are contained inside a DOM tree where the parent node has its =display= set to =none=) will report offset dimensions of zero and may report other less than useful values for runtime related rendering properties, thereby tripping up JavaScript UI setup code that may act on such nodes.

							Instead of using the =display= property, this method sets values for both the =position= and =visibility= properties. When a value of =true= is specified for the =mustShowBOOL= parameter, then the =position= property is set to =relative= and the =visibility= property is set to =inherit=. And when =false= is specified for =mustShowBOOL=, then =position= is set to =absolute= and =visibility= is set to =hidden=.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			};

			var _stylePropertiesAsStr = _package.stylePropertiesAsStr = function (_properties) {
				var _resultChunks = [];
				for (var _property in _properties)
					_resultChunks.push (_property,':',_properties [_property],'; ')
				;
				return _resultChunks.join ('');
				/*?
					Static Methods
						Uize.Node.Util.stylePropertiesAsStr
							Returns a string, representing the serialization of the specified set of CSS style properties.

							SYNTAX
							.........................................................
							Uize.Node.Util.stylePropertiesAsStr (stylePropertiesOBJ);
							.........................................................

							EXAMPLE
							......................................
							Uize.Node.Util.stylePropertiesAsStr ({
								display:'block',
								position:'absolute',
								visibility:'inherit',
								top:100
							});
							......................................

							In the above example, the =Uize.Node.Util.stylePropertiesAsStr= method call would return the string output ='display:block; position:absolute; visibility:inherit; top:100px;'=.
				*/
			};

		return _package;
	}
});

