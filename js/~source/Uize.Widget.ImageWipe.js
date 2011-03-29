/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ImageWipe Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.ImageWipe= class enables a wide variety of sophisticated animated image wipe effects, used for transitioning from one image to another.

		*DEVELOPERS:* `Chris van Rensburg`

		This widget class can be used in conjunction with the =Uize.Widget.SlideShow= class when creating slideshow experiences. A number of preset wipe effect settings are available in the =Uize.Widget.ImageWipe.xPresets= extension module.

	How It Works
		Understanding how the image wipe effect works will enable you to come up with your own unique wipes by helping you to understand how the various set-get properties affect the wipe.

		In a Nutshell
			The image wipe is not terribly complicated, in its essence.

			Essentially, revealing a new image involves having a number of image nodes stacked on top of one another above the previous image that is to be covered. The src attribute for each of those image nodes is set to the URL of the new image. Then, for each image node, initial and final coordinates for a crop rect are calculated. During the course of the wipe, the crop rect coordinates are interpolated between the initial coordinates and the final coordinates. The final coordinates are calculated such that, at the end of the wipe, all of the image nodes combined block out the previous image.

			Additional nuances provide for a wide variety of interesting effects, such as being able to control the start times of the animations for the different image nodes, being able to fade in their opacity, being able to control the order in which they animate, and being able to control their initial coordinates and final coordinates through settings of the effect.

		In More Detail
			Now, let's get into a more detailed description of the mechanics. For the purpose of this discussion, a number of terms and concepts are defined, as follows...

			Wipe Port
				The "port" in which the wipe effect is viewed is termed the `Wipe Port`.

				The `Wipe Port` contains two Pane Stacks - one `Pane Stack` for displaying the current image, and another `Pane Stack` for revealing the next image. Both Pane Stacks are positioned absolutely and right on top of one another.

			Pane Stack
				A Pane Stack is a stack of image nodes that are all positioned absolutely and right on top of one another, where each image node corresponds to what is termed a `Pane`.

				One Pane Stack is used to display one image, even though it is comprised of many image nodes. The number of image nodes in the Pane Stack used for showing the current image is the same as the number of image nodes in the Pane Stack used for showing the next image, and is calculated as the product of the =divisionsX= and =divisionsY= set-get properties. So, for example, if =divisionsX= were set to the value =8= and =divisionsY= were set to the value =2=, then the two Pane Stacks in the `Wipe Port` would each have 16 image nodes. Moreover, a 1x16, 2x8, 4x4, 8x2, and 16x1 wipe would all produce a wipe effect using 16 image nodes per `Pane Stack`.

			Pane
				One image node in a `Pane Stack` is termed a Pane.

				When a wipe is performed, initial crop rect coordinates (termed the `Pane Seed`) and final crop rect coordinates (termed the `Pane Final`) are calculated for every pane in the Pane Stack that is being used to reveal the next image. When a specific pane is being animated, its crop rect coordinates are interpolated between the Pane Seed coordinates and the Pane Final coordinates. Additionally, its opacity will be faded from completely transparent to completely opaque over the course of the animation if the =dissolve= set-get property is set to =true=.

			Wipe Port Matrix
				The Wipe Port Matrix is a matrix of `Wipe Port Matrix Cell` coordinates, produced by dividing the `Wipe Port` into a number of rows and columns, as determined by the =divisionsY= and =divisionsX= set-get properties, respectively.

				The coordinates of the Wipe Port Matrix are used in determining the coordinates of the `Pane Seed` and `Pane Final` for each `Pane` of the `Pane Stack`.

			Wipe Port Matrix Cell
				Each cell in the Wipe Port Matrix is termed a Wipe Port Matrix Cell.

				The height of a Wipe Port Matrix Cell is influenced by the number of vertical divisions (as specified by the =divisionsY= set-get property), as well as the value of the =firstPaneSizeY= property. Similarly, the width of a Wipe Port Matrix Cell is influenced by the number of horizontal divisions (as specified by the =divisionsX= set-get property), as well as the value of the =firstPaneSizeX= property.

				The coordinates of each Wipe Port Matrix Cell influences the coordinates of the `Pane Seed` and the `Pane Final` for each `Pane` of the `Pane Stack`, factoring in the effects of the =paneSeedContext= and =allToFull= set-get properties.

			Pane Seed
				The `Pane Seed` is the initial coordinates for a `Pane`.

				The Pane Seed coordinates are calculated by combining the coordinates of the `Pane Seed Context` and the values of the =alignX=, =alignY=, =paneSeedSizeX=, and =paneSeedSizeY= set-get properties. Specifically, the width of the Pane Seed is calculated as a percentage of the width of the `Pane Seed Context` (as specified by the =paneSeedSizeX= set-get property), and the height of the Pane Seed is calculated as a percentage of the height of the `Pane Seed Context` (as specified by the =paneSeedSizeY= set-get property).

				Moreover, the Pane Seed is positioned within the Pane Seed Context using the =alignX= and =alignY= set-get properties, where these properties are floating point numbers in the range of =0= to =1= and where the value =0= represents left and top alignment, the value =1= represents right and bottom alignment, and the value =.5= represents center alignment.

			Pane Seed Context
				The Pane Seed Context is the coordinates that provide the context for calculating the `Pane Seed` coordinates.

				Each `Pane` is associated with a corresponding `Wipe Port Matrix Cell`. The =paneSeedContext= set-get property lets one specify the `Pane Seed Context` for a Pane as a blend between the coordinates of a Pane's corresponding Wipe Port Matrix Cell and the coordinates of the `Wipe Port`. When =paneSeedContext= is set to =0=, then the Pane Seed Context will be exactly the coordinates of Pane's corresponding Wipe Port Matrix Cell. When =paneSeedContext= is set to =100=, then the Pane Seed Context will be exactly the coordinates of the Wipe Port. And when =paneSeedContext= is set to =50=, then the Pane Seed Context will be calculated as a 50% blend between the coordinates of the Pane's corresponding Wipe Port Matrix Cell and the coordinates of the Wipe Port.

			Pane Final
				The `Pane Final` is the final coordinates for a `Pane`.

				The Pane Final coordinates are calculated by combining the coordinates of a Pane's corresponding Wipe Port Matrix Cell with the coordinates of the `Wipe Port` and the value of the =allToFull= set-get property. Specifically, the width of the Pane Final is calculated as the blend of the width of a Pane's corresponding Wipe Port Matrix Cell and the width of the `Wipe Port`, as specified by the =allToFull= set-get property. Similarly, the height of the Pane Final is calculated as the blend of the height of a Pane's corresponding Wipe Port Matrix Cell and the height of the `Wipe Port`, as specified by the =allToFull= set-get property.

				When =allToFull= is set to =0=, then the Pane Final coordinates will be exactly the coordinates of Pane's corresponding Wipe Port Matrix Cell. When =allToFull= is set to =100=, then the Pane Final coordinates will be exactly the coordinates of the Wipe Port. And when =allToFull= is set to =50=, then the Pane Final coordinates will be calculated as a 50% blend between the coordinates of the Pane's corresponding Wipe Port Matrix Cell and the coordinates of the Wipe Port.

			Value Range Declaration
				The values for certain set-get properties can be specified with a Value Range Declaration that allows a range of values to be specified, so that each `Pane` in a `Pane Stack` can have a different value along a continous range.

				This facility allows for more sophisticated effects, since it allows for controlled variation in the animations of all the Panes that comprise the wipe effect. Some of the more compelling wipe effect presets available in the =Uize.Widget.ImageWipe.xPresets= extension take advantage of this mechanism for some of their settings.

				The syntax for a Value Range Declaration is as follows...

				.......................................................................
				{
					start:startValueNUM,  // the start value
					end:endValueNUM,      // the end value
					keyedTo:keyedToSTR,   // 'row' | 'column' | 'pane' | 'random'
					wraps:wrapsINT,       // optional, default is 1
					wrapMode:wrapModeSTR  // optional, 'triangle' | 'sawtooth' (default)
				}
				.......................................................................

				start
					A number, specifying the start value for the range.

				end
					A number, specifying the end value for the range.

				keyedTo
					A string, specifying what the interpolation between the =start= value and =end= value should be keyed to.

					- the value ='row'= means that the interpolation will be keyed to the row number of the current `Pane` for which the value is being calculated, where the interpolated value for panes in the first row will be the specified =start= value, and the interpolated value for panes in the last row will be the specified =end= value. This is useful when specifying a value range for set-get properties that apply to the Y-axis, such as =alignY= and =paneSeedSizeY=, although there's nothing to say that you couldn't key the interpolation of an X-axis set-get property to row number.

					- the value ='column'= means that the interpolation will be keyed to the column number of the current `Pane` for which the value is being calculated, where the interpolated value for panes in the first column will be the specified =start= value, and the interpolated value for panes in the last column will be the specified =end= value. This is useful when specifying a value range for set-get properties that apply to the X-axis, such as =alignX= and =paneSeedSizeX=, although there's nothing to say that you couldn't key the interpolation of a Y-axis set-get property to column number.

					- the value ='pane'= means that the interpolation will be keyed to the pane number of the current `Pane` for which the value is being calculated, where the interpolated value for the first pane will be the specified =start= value, and the interpolated value for the last pane will be the specified =end= value. When the value =1= is specified for the =divisionsY= set-get property (ie. only one row), then the values ='column'= and ='pane'= for =keyedTo= will have the same effect. Similarly, when the value =1= is specified for the =divisionsX= set-get property (ie. only one column), then the values ='row'= and ='pane'= for =keyedTo= will have the same effect.

					- the value ='random'= means that the interpolation will be keyed to a random number, so that the value being calculated for each `Pane` will be some random blend between the =start= value and the =end= value. *NOTE:* When using this value, the =wraps= and =wrapMode= properties become pretty much meaningless.

				wraps
					A positive integer, specifying the number of times that the value range should repeat across the series of the panes.

					By default, the value range is not repeated across the series of the panes (or, put another way, there is only one repeat). When a value greater than =1= is specified for this optional property, then the value range will be repeated in either a sawtooth wave pattern or a triangular wave pattern across the series of panes, as determined by the value of the optional =wrapMode= property.

					NOTES
					- The effect of this property's value is defeated by specifying the value ='random'= for the =keyedTo= property.

				wrapMode
					A string, specifying the wrap mode that should be used when a value greater than =1= is specified for the =wraps= property.

					- the default value of ='sawtooth'= means that the value range will be repeated in a sawtooth wave pattern. This means that each time when the =end= value is reached, the interpolated value will wrap back around to the =start= value.

					- the value ='triangle'= means that the value range will be repeated in a triangular wave pattern. This means that each time when the =end= value is reached, the direction of interpolated values will change and head back in the direction of the =start= value. And, each time when the =start= value is reached, the direction of interpolated values will change and head back in the direction of the =end= value. The interpolated value will "bounce" back and forth like this between the =start= value and the =end= value for as many wraps as are specified in the =wraps= property.

					NOTES
					- The effect of this property's value is defeated by specifying the value ='random'= for the =keyedTo= property.
					- The value of this property is not meaningful if the =wraps= property is not specified, or if its value is =1=.

				Set-get properties of this class that support a Value Range Declaration include: =allToFull=, =alignX=, =alignY=, =paneSeedSizeX=, =paneSeedSizeY=, and =paneSeedContext=.
*/

Uize.module ({
	name:'Uize.Widget.ImageWipe',
	required:[
		'Uize.Node',
		'Uize.Node.Util',
		'Uize.Fade',
		'Uize.Array.Order'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_null = null,
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function (_properties) {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._panes = [];
							_this._imageDims = [0,0];
							_this._currentItemNo = 0;
							_this._imagesLoaded = [];

						/*** Public Instance Properties ***/
							_this.fade = new Uize.Fade;
							/*?
								Instance Properties
									fade
										An instance of the =Uize.Fade= class that drives the animation for the image wipe effect.

										This property allows access to the fade instance that drives the wipe animation. This allows you to modify properties of the animation, such as the =curve= and any of the other set-get properties supported by the =Uize.Fade= class.
							*/

						/*** Initialization ***/
							_this.fade.wire (
								'Changed.value',
								function () {
									for (
										var
											_paneNo = -1,
											_panes = _this._panes,
											_panesLength = _panes.length,
											_paneNodes = _this._paneNodes,
											_paneProgressDelay = _this._paneProgressDelay,
											_progress = _this.fade * (100 + (_panesLength - 1) * _paneProgressDelay)
										;
										++_paneNo < _panesLength;
									) {
										var
											_pane = _panes [_paneNo],
											_paneInitCoords = _pane._initCoords,
											_paneFinalCoords = _pane._finalCoords,
											_paneCoords = _pane._coords,
											_paneProgressFraction =
												Uize.constrain (_progress - _paneNo * _paneProgressDelay,0,100) / 100,
											_paneCoordsChanged
										;
										for (var _coordPoint = -1, _newPaneCoord; ++_coordPoint < 4;) {
											if (
												(_newPaneCoord =
													Math.round (_paneInitCoords [_coordPoint] + (_paneFinalCoords [_coordPoint] - _paneInitCoords [_coordPoint]) * _paneProgressFraction)
												) !== _paneCoords [_coordPoint]
											) {
												_paneCoords [_coordPoint] = _newPaneCoord;
												_paneCoordsChanged = true;
											}
										}
										var _paneNode = _paneNodes [_paneNo];
										_paneCoordsChanged &&
											_Uize_Node.setClipRect (
												_paneNode,
												_paneCoords [1],_paneCoords [2],_paneCoords [3],_paneCoords [0]
											)
										;
										var _opacity = _this._dissolve ? _paneProgressFraction : 1;
										_opacity !== _pane._opacity &&
											_Uize_Node.setOpacity (_paneNode,_pane._opacity = _opacity)
										;
									}
								}
							);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.prepareForNextItem = function (_currentItem,_nextItem) {
				var _currentItemPaneNodes = this._paneNodes;
				if (_currentItemPaneNodes) {
					/* NOTE:
						for better performance (especially in IE, it seems), make sure there is only one pane node for displaying the current item underneath the pane nodes for the next item
					*/
					_Uize_Node.display (_currentItemPaneNodes,false);
					_Uize_Node.display (_currentItemPaneNodes [0]);
					_Uize_Node.setStyle (_currentItemPaneNodes [0],{clip:'rect(auto, auto, auto, auto)',opacity:1});
				}
				_Uize_Node.display (this._paneNodes = _nextItem.getElementsByTagName ('IMG'));
			};

			_classPrototype.setCurrentItem = function (_currentItem) {
				var
					_this = this,
					_divisionsX = _this._divisionsX,
					_divisionsY = _this._divisionsY,
					_imageDims = _this._imageDims
				;
				_this._previousItem = _this._currentItem;
				_this._currentItem = _currentItem;

				/*** calculate sizes for rows and columns ***/
					var
						_paneW = [],
						_paneH = []
					;
					function _sigma (_n) {return _n * (_n + 1) / 2}
					var
						_currentPaneSizeX = (_imageDims [0] / _divisionsX) * _this._firstPaneSizeX / 100,
						_paneSizeIncrementX = (_imageDims [0] - _currentPaneSizeX * _divisionsX) / _sigma (_divisionsX - 1)
					;
					for (var _xDivisionNo = -1; ++_xDivisionNo < _divisionsX;) {
						_paneW [_xDivisionNo] = _currentPaneSizeX;
						_currentPaneSizeX += _paneSizeIncrementX;
					}
					var
						_currentPaneSizeY = (_imageDims [1] / _divisionsY) * _this._firstPaneSizeY / 100,
						_paneSizeIncrementY = (_imageDims [1] - _currentPaneSizeY * _divisionsY) / _sigma (_divisionsY - 1)
					;
					for (var _yDivisionNo = -1; ++_yDivisionNo < _divisionsY;) {
						_paneH [_yDivisionNo] = _currentPaneSizeY;
						_currentPaneSizeY += _paneSizeIncrementY;
					}

				/*** generate pane coordinates ***/
					function _getInterpolatedValue (_valueSpec) {
						var _result;
						if (typeof _valueSpec == 'number') {
							_result = _valueSpec;
						} else if (typeof _valueSpec == 'object') {
							var _keyIndex, _keyContext;
							if (_valueSpec.keyedTo == 'column') {
								_keyIndex = _xDivisionNo;
								_keyContext = _divisionsX - 1;
							} else if (_valueSpec.keyedTo == 'row') {
								_keyIndex = _yDivisionNo;
								_keyContext = _divisionsY - 1;
							} else if (_valueSpec.keyedTo == 'pane') {
								_keyIndex = _divisionNo;
								_keyContext = _divisionsX * _divisionsY - 1;
							} else if (_valueSpec.keyedTo == 'random') {
								_keyIndex = Math.random ();
								_keyContext = 1;
							}
							if (_valueSpec.inverse === true)
								_keyIndex = _keyContext - _keyIndex
							;
							if (typeof _valueSpec.wraps == 'number')
								_keyIndex =
									(
										_valueSpec.wrapMode === 'triangle' &&
										Math.floor (_keyIndex * _valueSpec.wraps / (_keyContext + 1)) % 2 == 1
											? (_keyContext - _keyIndex)
											: _keyIndex
									) * _valueSpec.wraps % (_keyContext + 1)
							;
							_result = _valueSpec.start + (_valueSpec.end - _valueSpec.start) * _keyIndex / Math.max (_keyContext,1);
						}
						return _result;
					}
					function _blendValues (_valueA,_valueB,_blendPercent) {
						return _valueA + (_valueB - _valueA) * _blendPercent / 100;
					}
					var
						_top = _this._panes.length = 0,
						_divisionNo,
						_currentAlignX, _currentAlignY,
						_currentAllToFull,
						_currentPaneSeedSizeX, _currentPaneSeedSizeY, _currentPaneSeedContext
					;
					for (var _yDivisionNo = -1; ++_yDivisionNo < _divisionsY;) {
						var _left = 0;
						for (var _xDivisionNo = -1; ++_xDivisionNo < _divisionsX;) {
							_divisionNo = _yDivisionNo * _divisionsX + _xDivisionNo;
							_currentAlignX = _getInterpolatedValue (_this._alignX);
							_currentAlignY = _getInterpolatedValue (_this._alignY);
							_currentPaneSeedSizeX = _getInterpolatedValue (_this._paneSeedSizeX);
							_currentPaneSeedSizeY = _getInterpolatedValue (_this._paneSeedSizeY);
							_currentPaneSeedContext = _getInterpolatedValue (_this._paneSeedContext);
							_currentAllToFull = _getInterpolatedValue (_this._allToFull);
							var
								_right = _left + _paneW [_xDivisionNo],
								_bottom = _top + _paneH [_yDivisionNo],
								_paneSeedContextL = _blendValues (_left,0,_currentPaneSeedContext),
								_paneSeedContextT = _blendValues (_top,0,_currentPaneSeedContext),
								_paneSeedContextR = _blendValues (_right,_imageDims [0],_currentPaneSeedContext),
								_paneSeedContextB = _blendValues (_bottom,_imageDims [1],_currentPaneSeedContext),
								_seedW = (_paneSeedContextR - _paneSeedContextL) * _currentPaneSeedSizeX / 100,
								_seedH = (_paneSeedContextB - _paneSeedContextT) * _currentPaneSeedSizeY / 100,
								_seedLeft = _paneSeedContextL + (_paneSeedContextR - _paneSeedContextL - _seedW) * _currentAlignX,
								_seedRight = _seedLeft + _seedW,
								_seedTop = _paneSeedContextT + (_paneSeedContextB - _paneSeedContextT - _seedH) * _currentAlignY,
								_seedBottom = _seedTop + _seedH,
								_initCoords = [_seedLeft,_seedTop,_seedRight,_seedBottom],
								_finalCoords = [
									_blendValues (_left,0,_currentAllToFull),
									_blendValues (_top,0,_currentAllToFull),
									_blendValues (_right,_imageDims [0],_currentAllToFull),
									_blendValues (_bottom,_imageDims [1],_currentAllToFull)
								]
							;
							_this._panes [_divisionNo] = {
								_coords:[],
								_initCoords:[
									_initCoords [0],_initCoords [1],
									_initCoords [2],_initCoords [3]
								],
								_finalCoords:[
									_finalCoords [0],_finalCoords [1],
									_finalCoords [2],_finalCoords [3]
								]
							};
							_left += _paneW [_xDivisionNo];
						}
						_top += _paneH [_yDivisionNo];
					}

				/*** carry out pane order scheme ***/
					Uize.Array.Order.reorder (_this._panes,_this._paneOrderScheme,false);

				/*** configure Uize.Fade object and start fade ***/
					_this.fade.start ({startValue:0,endValue:1});
			};

			_classPrototype.wireUi = function () {
				this.setNodeStyle ('',{overflow:'hidden'});
				_superclass.prototype.wireUi.call (this);
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_alignX:{
					name:'alignX',
					value:{start:1,end:0,keyedTo:'column'}
					/*?
						Set-get Properties
							alignX
								A number in the range of =0= to =1=, specifying the horizontal alignment of each `Pane Seed`.

								A value of =0= specifies that a Pane Seed should be aligned to the left of its `Pane Seed Context`, a value of =1= specifies that a Pane Seed should be right aligned, and a value of =.5= specifies that a Pane Seed should be center aligned.

								NOTES
								- the value for this property may also be a `Value Range Declaration`
								- if the value of the =paneSeedSizeX= set-get property is =100=, then the =alignX= property will have no effect
								- see the companion =alignY= set-get property
								- the initial value is ={start:1,end:0,keyedTo:'column'}=
					*/
				},
				_alignY:{
					name:'alignY',
					value:.5
					/*?
						Set-get Properties
							alignY
								A number in the range of =0= to =1=, specifying the vertical alignment of each `Pane Seed`.

								A value of =0= specifies that a Pane Seed should be aligned to the top of its `Pane Seed Context`, a value of =1= specifies that a Pane Seed should be bottom aligned, and a value of =.5= specifies that a Pane Seed should be center aligned.

								NOTES
								- the value for this property may also be a `Value Range Declaration`
								- if the value of the =paneSeedSizeY= set-get property is =100=, then the =alignY= property will have no effect
								- see the companion =alignX= set-get property
								- the initial value is =.5=
					*/
				},
				_allToFull:{
					name:'allToFull',
					value:0
					/*?
						Set-get Properties
							allToFull
								A number in the range of =0= to =100=, representing the balance between the `Pane Seed Context` coordinates and the `Wipe Port` coordinates that should be used when calculating the `Pane Final` coordinates for each `Pane`.

								A value of =0= means that the Pane Final coordinates for a pane will be the Pane Seed Context coordinates, a value of =100= means that the Pane Final coordinates will be the Wipe Port coordinates, and a value of =50= will create Pane Final coordinates that are a blend of 50% the Pane Seed Context coordinates and 50% the Wipe Port coordinates.

								NOTES
								- the value for this property may also be a `Value Range Declaration`
								- the initial value is =0=
					*/
				},
				_background:'background',
				/*?
					Set-get Properties
						background
							A string, specifying an optional background style that should be used for each `Pane`.

							NOTES
							- the initial value is =undefined=
				*/
				_dissolve:{
					name:'dissolve',
					value:false
					/*?
						Set-get Properties
							dissolve
								A boolean, specifying whether or not each `Pane` should fade in opacity - from being completely transparent to being completely opaque - during the course of its animation.

								When the value =false= is specified for this property, only the crop rect coordinates of a `Pane` will be updated during its animation, but when the value =true= is specified it will be faded in as well. The latter setting allows for more sophisticated effects, although there is likely to be a cost in performance and the wipe may not appear as smooth - depending on the browser and the speed of the system it is running on.

								NOTES
								- the initial value is =false=
					*/
				},
				_divisionsX:{
					name:'divisionsX',
					value:16
					/*?
						Set-get Properties
							divisionsX
								A positive integer, specifying the number of horizontal divisions in the `Wipe Port Matrix`.

								NOTES
								- see the companion =divisionsY= set-get property
								- the initial value is =16=
					*/
				},
				_divisionsY:{
					name:'divisionsY',
					value:1
					/*?
						Set-get Properties
							divisionsY
								A positive integer, specifying the number of vertical divisions in the `Wipe Port Matrix`.

								NOTES
								- see the companion =divisionsX= set-get property
								- the initial value is =16=
					*/
				},
				_duration:{
					name:'duration',
					onChange:function () {this.fade.set ({duration:this._duration})},
					value:3000
					/*?
						Set-get Properties
							duration
								A positive integer, specifying the duration (in milliseconds) for the wipe effect.

								NOTES
								- the initial value is =3000=
					*/
				},
				_firstPaneSizeX:{
					name:'firstPaneSizeX',
					value:100
					/*?
						Set-get Properties
							firstPaneSizeX
								A number in the range of =0= to =100=, specifying the width of the first `Wipe Port Matrix` column as a percentage of the normal column width.

								Normal column width is defined as the width of the `Wipe Port` divided by the number of columns (as specified by the =divisionsX= set-get property). If the first Wipe Port Matrix column width is smaller or greater than the normal column width, then the difference will be distributed amongst the remaining columns to compenstate - according to a sigma series distribution. This makes it possible to bias the widths towards the first column or towards the last column.

								For example, specifying a value of =10= for the =firstPaneSizeX= set-get property means that the missing 90% of the normal column width for the first Wipe Port Matrix column must be distributed across the remaining columns. In order for this distribution to look natural, the width would grow gradually from left to right. Consider the following representations...

								EVEN COLUMN WIDTH
								..............................................................................
								|  6   |  6   |  6   |  6   |  6   |  6   |  6   |  6   |  6   |  6   |  6   |
								..............................................................................

								This representation depicts a `Wipe Port` with a width of 66 and with 11 horizontal divisions (ie. =divisionsX= is set to =6=), so the normal width for each Wipe Port Matrix column would be 6 (ie. 66 / 11).

								To achieve the above distribution, =firstPaneSizeX= would be set to =100= (ie. 6 / 6), since the width of the first Wipe Port Matrix column is 100% of the normal column width.

								SIGMA DISTRIBUTION
								..............................................................................
								|1|2 | 3 | 4  |  5  |  6   |   7   |   8    |    9    |    10    |     11    |
								..............................................................................

								To achieve the above distribution, =firstPaneSizeX= would be set to =16.666= (ie. 1 / 6), since the width of the first Wipe Port Matrix column is 16.666% of the normal column width.

								ANOTHER SIGMA DISTRIBUTION
								..............................................................................
								|     11    |    10    |    9    |   8    |   7   |  6   |  5  | 4  | 3 |2 |1|
								..............................................................................

								To achieve the above distribution, =firstPaneSizeX= would be set to =183.333= (ie. 11 / 6), since the width of the first Wipe Port Matrix column is 183.333% of the normal column width.

								NOTES
								- see the companion =firstPaneSizeY= set-get property
								- the initial value is =100=
					*/
				},
				_firstPaneSizeY:{
					name:'firstPaneSizeY',
					value:100
					/*?
						Set-get Properties
							firstPaneSizeY
								A number in the range of =0= to =100=, specifying the height of the first `Wipe Port Matrix` row as a percentage of the normal row height.

								Normal row height is defined as the height of the `Wipe Port` divided by the number of rows (as specified by the =divisionsY= set-get property). If the first Wipe Port Matrix row height is smaller or greater than the normal row height, then the difference will be distributed amongst the remaining rows to compenstate - according to a sigma series distribution. This makes it possible to bias the heights towards the first row or towards the last row.

								For a more in-depth explanation, and for some illustrations, consult the reference for the =firstPaneSizeX= set-get property, since the =firstPaneSizeY= property behaves in exactly the same way as the =firstPaneSizeX= property, excepting that it applies to the Y-axis rather than the X-axis.

								NOTES
								- see the companion =firstPaneSizeX= set-get property
								- the initial value is =100=
					*/
				},
				_paneOrderScheme:{
					name:'paneOrderScheme',
					value:'inside out'
					/*?
						Set-get Properties
							paneOrderScheme
								A string, specifying an ordering scheme for the panes that comprise the wipe effect.

								When a non-zero value is specified for the =paneProgressDelay= set-get property, then the value of the =paneOrderScheme= set-get property will determine the order in which the animation of the panes is started, making a wide array of interesting effects possible.

								The value for this property can be any of the values supported for the =reorderingModeSTR= parameter of the =Uize.Array.Order.reorder= static method, including ='normal'=, ='reverse'=, ='jumbled'=, ='inside out'=, and ='outside in'=.

								NOTES
								- when the =paneProgressDelay= set-get property is set to =0=, then the =paneOrderScheme= property will have no noticeable effect
								- the initial value is ='inside out'=
					*/
				},
				_paneProgressDelay:{
					name:'paneProgressDelay',
					value:10
					/*?
						Set-get Properties
							paneProgressDelay
								A number in the range of =0= to =100=, representing the percentage of the animation of a pane that should be complete before the animation of the next pane is started.

								When the value =0= is specified, the animation for all panes will be started at the same time. When the value =100= is specified, the animation for the next pane will only be started when the animation of the current pane is entirely complete. And when the value =50= is specified, then the animation of the next pane will be started when the animation of the current pane is 50% complete.

								Regardless of the value of this property, the entire wipe effect will always take the same amount of time (as specified by the =duration= set-get property). This means that as you increase the value of this property, the animation time per pane will be decreased. At a value of =0=, all panes will take the entire duration of the wipe to animate. And, at a value of =100=, the animation time for each pane will be the entire duration of the wipe divided by the total number of panes.

								When this property is set to the value =0=, then the =paneOrderScheme= set-get property will have no noticeable effect. Conversely, when this property is set to a non-zero value, then the value of the =paneOrderScheme= property will determine the order in which the panes are animated.

								NOTES
								- the initial value is =10=
					*/
				},
				_paneSeedContext:{
					name:'paneSeedContext',
					value:0
					/*?
						Set-get Properties
							paneSeedContext
								A number in the range of =0= to =100=, representing the balance between the `Wipe Port Matrix Cell` coordinates and the `Wipe Port` coordinates that should be used when calculating the `Pane Seed Context` coordinates for each `Pane`.

								A value of =0= means that the `Pane Seed Context` for calculating a pane's coordinates will be the `Wipe Port Matrix Cell`, a value of =100= means that the context will be the `Wipe Port`, and a value of =50= will produce a context whose coordinates are a blend of 50% the `Wipe Port Matrix Cell` coordinates and 50% the `Wipe Port` coordinates.

								NOTES
								- the value for this property may also be a `Value Range Declaration`
								- the initial value is =0=
					*/
				},
				_paneSeedSizeX:{
					name:'paneSeedSizeX',
					value:0
					/*?
						Set-get Properties
							paneSeedSizeX
								A number in the range of =0= to =100=, specifying the width for the `Pane Seed` as a percentage of the width of the `Pane Seed Context`.

								A value of =0= means that the Pane Seed's width will be =0=, a value of =100= means that its width will be the full width of the `Pane Seed Context`, and a value of =50= means that its width will be 50% of the width of the `Pane Seed Context`.

								NOTES
								- the value for this property may also be a `Value Range Declaration`
								- see the companion =paneSeedSizeY= set-get property
								- the initial value is =0=
					*/
				},
				_paneSeedSizeY:{
					name:'paneSeedSizeY',
					value:100
					/*?
						Set-get Properties
							paneSeedSizeY
								A number in the range of =0= to =100=, specifying the height for the `Pane Seed` as a percentage of the height of the `Pane Seed Context`.

								A value of =0= means that the Pane Seed's height will be =0=, a value of =100= means that its height will be the full height of the `Pane Seed Context`, and a value of =50= means that its height will be 50% of the height of the `Pane Seed Context`.

								NOTES
								- the value for this property may also be a `Value Range Declaration`
								- see the companion =paneSeedSizeX= set-get property
								- the initial value is =100=
					*/
				},
				_src:{
					name:'src|value',
					onChange:function () {
						var _this = this;
						if (_this.isWired) {
							if (_this.fade.get ('inProgress')) {
								_this.fade.set ({value:1});
								/* NOTE: make sure this is the best way to handle this */
								_this.fade.stop ();
							}
							var
								_currentItem = _this.getNode ('item' + _this._currentItemNo),
								_nextItemNo = 1 - _this._currentItemNo,
								_nextItem = _this.getNode ('item' + _nextItemNo)
							;
							_this.prepareForNextItem (_currentItem,_nextItem);
							var _paneNodes = _this._paneNodes;

							function _loadNextImage () {
								var
									_image = _this._imagesLoaded [_this._src],
									_paneNodesLength = _paneNodes.length,
									_src = _this._src,
									_totalLoaded = 0
								;
								function _nextImageLoaded () {
									/*** update the img node ("this" is a reference to the img node firing the event) ***/
										this.Uize_Widget_ImageWipe_src = _src;
										_this.unwireNode (this);

									if (++_totalLoaded == _paneNodesLength) {
										_currentItem.style.zIndex = '0';
										_nextItem.style.zIndex = '1';
										_this._currentItemNo = _nextItemNo;
										_this.setCurrentItem (_nextItem);
									}
								}
								for (var _paneNodeNo = -1; ++_paneNodeNo < _paneNodesLength;) {
									var _paneNode = _paneNodes [_paneNodeNo];
									if (_paneNode.Uize_Widget_ImageWipe_src === _src) {
										/* NOTE:
											In IE 5.2 and Safari 1.3- on Mac OS X, the load event for an IMG node is not fired when that node's src is set again to its current value. So, when switching back and forth between two image URLs, the load event cannot be relied upon for triggering the reveal, since we're toggling between two IMG nodes and sometimes an IMG node used to display an image will already have loaded that image from a previous toggle.
										*/
										_nextImageLoaded ();
									} else {
										_this.wireNode (
											_paneNode,
											{
												load:_nextImageLoaded,
												error:_nextImageLoaded,
												abort:_nextImageLoaded
											}
										);
										_paneNode.src = _src;
									}
								}
							}
							if (_this._imagesLoaded [_this._src]) {
								_loadNextImage ();
							} else {
								var _imageLoader = new Image;
								/* NOTE:
									We can't use the Uize.Node.wire method here because Safari doesn't implement instances of the Image object as real IMG DOM nodes, and Uize.Node.wire has no effect.
								*/
								_imageLoader.onload = _imageLoader.onerror = _imageLoader.onabort =
									function () {
										_imageLoader = null;
										_this._imagesLoaded [_this._src] = {
											_width:_this._width || this.width,
											_height:_this._height || this.height
										};
										_loadNextImage ();
									}
								;
								_imageLoader.src = _this._src;
							}
						}
					}
					/*?
						Set-get Properties
							src
								A string, representing the URL of the current image.

								After setting this property to a new value, the new image will first be loaded in each `Pane` of the `Pane Stack` used for revealing the next image. Once it has been loaded, the wipe effect will be initiated to reveal the new image.

								NOTES
								- this property can also be accessed through the alias =value=
								- the initial value is =undefined=

							value
								An alias to the =src= set-get property, establishing the =src= property as the public Value Interface for this class.
					*/
				}
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				html:{
					process:function (input) {
						var
							_this = this,
							_shellNode = _this.getNode (),
							_shellSize = _Uize_Node.getDimensions (_shellNode),
							_background = input.background || _Uize_Node.Util.getEffectiveBgColor (_shellNode),
							_htmlChunks = []
						;
						_this._imageDims = [_shellSize.width,_shellSize.height];
						for (var _itemNo = -1; ++_itemNo < 2;) {
							_htmlChunks.push (
								'<div id="' + input.idPrefix + '-item' + _itemNo + '" style="position:absolute; margin:0px; padding:0px; left:0px; top:0px; width:' + _shellSize.width + 'px; height:' + _shellSize.height + 'px; overflow:hidden;">'
							);
							for (var _paneNo = -1; ++_paneNo < input.divisionsX * input.divisionsY;)
								_htmlChunks.push ('<img src="' + _class.getBlankImageUrl () + '" style="position:absolute; left:0px; top:0px; width:' + _this._imageDims [0] + 'px; height:' + _this._imageDims [1] + 'px; background:' + _background + ';"/>')
							;
							_htmlChunks.push ('</div>');
						}
						return _htmlChunks.join ('');
					}
				}
			});

		return _class;
	}
});

