/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap Class
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
		The =Uize.Widget.Swap= abstract class enables a wide variety of lightweight animated swap effects, and serves as the base class for several subclasses.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Widget.Swap= class serves as a base class for subclasses such as =Uize.Widget.Swap.Deck=, =Uize.Widget.Swap.Image=, and =Uize.Widget.Swap.Html=. This widget class - and, more likely, its various subclasses - can be used in conjunction with the =Uize.Widget.SlideShow= class when creating slideshow experiences. A number of preset swap effect settings are available in the =Uize.Widget.Swap.xPresets= extension module.

	How It Works
		Understanding how the swap effect works will enable you to come up with your own unique effects by helping you to understand how the various set-get properties affect the swap effect.

		In a Nutshell
			The mechanics of the swap effect are really quite simple.

			Essentially, revealing a next item involves modifying the z-index of the current item and the next item so that the next item sits on top of the current item. Then, initial seed coordinates are calculated. During the course of the swap effect, the coordinates are interpolated between the initial seed coordinates and the coordinates of the full port. As the coordinates are animated, the next item is positioned so that the coordinates represent a window for revealing a portion of the next item. Within that reveal window, certain settings of the effect determine which portion of the next item is revealed.

			Additionally, the opacity of the next item can be animated over the course of the effect, so that it fades in from being completely transparent to being completely opaque by the end of the effect. Finally, a =crossfade= switch allows you to apply the effect in reverse on the current item at the same time as the next item is being revealed, with the ability to configure the overlap between the hide of the current item and the reveal of the next item.

			All of this adds up to a whole bunch of different ways that you can transition from one item to another, using just a small set of effect settings / parameters, and with code that is high performance, compact in size, and doesn't bloat the DOM.

		In More Detail
			Now, let's get into a more detailed description of the mechanics. For the purpose of this discussion, a number of terms and concepts are defined, as follows...

			Swap Port
				The "port" in which the swap effect is viewed is termed the `Swap Port`.

				The `Swap Port` contains two Views - one `View` for displaying the current item, and another `View` for revealing the next item. Both Views are positioned absolutely, with one on top of the other.

			View
				One item node in the `Swap Port` is termed a `View`.

				There are two Views in the Swap Port: one View provides a view into the current item, and the other View provides a view into the next item that is being revealed. When a swap is performed, initial View coordinates (termed the `View Seed`) and final View coordinates (termed the `View Final`) are calculated. During the course of the swap effect, the View coordinates for the next item's View are interpolated between the View Seed coordinates and the View Final coordinates. Additionally, its opacity will be faded from completely transparent to completely opaque over the course of the animation if the =dissolve= set-get property is set to =true=.

				If the =crossFade= set-get property is set to =true=, then the `Crossfade` behavior is enabled and the View coordinates for the current item's View will be interpolated between the View Final coordinates and the View Seed coordinates, and its opacity will be faded from completely opaque to completely transparent over the course of the animation if the =dissolve= set-get property is set to =true=. The additional =crossFadeSize= and =crossFadeAlign= set-get properties govern the nature of the `Crossfade` behavior.

			View Seed
				The View Seed is the initial coordinates for a `View`.

				The View Seed is derived by calculating `View Seed Size` and `View Seed Alignment`, in this process combining the coordinates of the `View Final` and the values of the =viewSeedSizeX=, =viewSeedSizeY=, =viewSeedAlignX=, and =viewSeedAlignY= set-get properties (discussed below).

				View Seed Size
					View Seed Size is calculated using the =viewSeedSizeX= and =viewSeedSizeY= set-get properties.

					Specifically, the width of the View Seed is calculated as a fraction of the width of the `View Final` (as specified by the =viewSeedSizeX= set-get property), and the height of the View Seed is calculated as a fraction of the height of the `View Final` (as specified by the =viewSeedSizeY= set-get property).

				View Seed Alignment
					View Seed Alignment refers to the positioning of the View Seed within the `Swap Port` and is calculated using the =viewSeedAlignX= and =viewSeedAlignY= set-get properties.

					The =viewSeedAlignX= and =viewSeedAlignY= set-get properties are floating point numbers in the range of =0= to =1=, where the value =0= represents left and top alignment, the value =1= represents right and bottom alignment, and the value =.5= represents center alignment.

			View Final
				The `View Final` is the final coordinates for a `View`, being the coordinates of the `Swap Port`.

			Crossfade
				Crossfade refers to the process by which the current item is progressively hidden while the next item is progressively revealed.

				The =crossFade= set-get property allows one to enable or disable the Crossfade behavior. When =crossFade= is set to =false=, then the Crossfade behavior is disabled and the current item will be hidden only as a side effect of the next item being revealed to fully obscure it. When =crossFade= is set to =true=, then the Crossfade behavior is enabled and the current item will be progressively hidden while the next item is progressively revealed.

				The way that the current item is hidden is essentially the reverse of the effect for revealing the next item. So, for example, if the exact settings for the swap effect mean that the next item will slide out from the right edge while also fading in from completely transparent to completely opaque, then the current item will hide by sliding out towards the right edge while also fading out from completely opaque to completely transparent.

				The additional =crossFadeSize= and =crossFadeAlign= set-get properties govern the nature of the Crossfade behavior.

				Crossfade Size
					The =crossFadeSize= set-get property lets you control the size of the overlap of the current item hide and next item reveal animations.

					The value for =crossFadeSize= is a floating point number, representing a fraction of the overal swap effect duration.

					- if =crossFadeSize= is set to =1=, then the overlap will be the entire duration of the effect. This means that the current item will be hiding progressively throughout the entire effect, and the next item will be revealing progressively throughout the entire effect.

					- at the opposite extreme, if =crossFadeSize= is set to =0=, then there will be no overlap between the current item hide and next item reveal animations - the current item will completely hide before the next item starts being revealed.

					- any value between =0= and =1= for =crossFadeSize= means that there will be some overlap between the hide of the current item and the reveal of the next item, where the current item will be progressively hidden at the same time as the next item is being progressively revealed.

					- setting =crossFadeSize= to a negative floating point number allows you to create a pause between the current item hide and next item reveal animations, where the duration of the pause is the negative of the value of the =crossFadeSize= property. So, for example, a value of =-.5= for =crossFadeSize= will produce a pause that is half the overal duration of the swap effect, while a value of =-.25= will produce a pause that is a quarter of the effect's duration. Note that a pause between current item hide and next item reveal means that the combined duration of the current item hide and next item reveal animations must be less than the overal swap effect duration. For example, with a =crossFadeSize= value of =-.5=, the combined duration of the current item hide and next item reveal animations will necessarily be half of the effect's overal duration.

				Crossfade Alignment
					When a value other than =1= is specified for =crossFadeSize=, then the value of the =crossFadeAlign= set-get property determines the alignment of the crossfade overlap within the overal swap effect duration.

					A value of =0= (start-aligned) for =crossFadeAlign= means that the overlap will be aligned so that the start of the overlap is against the start of the effect, a value of =1= (end-aligned) means that the overlap will be aligned so that the end of the overlap is against the end of the effect, and a value of =.5= (center-aligned) means that the overlap will be aligned so that the time gap between the effect start and the overlap start is the same as the time gap between the overlap end and the effect end.

			View Content Alignment
				View Content Alignment refers to the positioning of an item within its corresponding `View`.

				As the swap effect progresses, the coordinates of a View are animated between the `View Seed` coordinates and the `View Final` coordinates. At any one point during this transition, the way that the item is positioned within the View coordinates is determined by the =viewContentAlignX= and =viewContentAlignY= set-get properties (alignment can be controlled discretely for the X and Y axes). The values specified for these properties should be floating point numbers in the range of =0= to =1=, where the value =0= represents left and top alignment, the value =1= represents right and bottom alignment, and the value =.5= represents center alignment.

				Additionally, the special value ='none'= indicates that there should be no View Content Alignment for the axis for which the value ='none'= is specified, meaning that the item's position for that axis will be fixed with respect to the `Swap Port` for the entire duration of the effect.

				To better understand the principle of View Content Alignment, it may help to consider as an example the value of the =Uize.Widget.Swap.presets.fadeSlideInFromRight= preset...

				............................
				{
					crossFade:false,
					crossFadeSize:0,
					crossFadeAlign:.5,
					dissolve:true,
					viewContentAlignX:0,
					viewContentAlignY:'none',
					viewSeedSizeX:0,
					viewSeedSizeY:1,
					viewSeedAlignX:1,
					viewSeedAlignY:0
				}
				............................

				With the =fadeSlideInFromRight= preset, the new item slides in from the right edge and also fades in as it slides into place to eventually fully cover the current item.

				The `View Seed` is a vertical sliver, as defined by the values for the =viewSeedSizeX= and =viewSeedSizeY= set-get properties. The value of =0= for =viewSeedSizeX= means that the View Seed has a width of =0=, and the value of =1= for =viewSeedSizeY= means that the View Seed starts out at the full height of the `Swap Port`. Moreover, the value of =1= for =viewSeedAlignX= means that the vertical sliver is aligned so that it is positioned at the right edge of the Swap Port. Because =viewSeedSizeY= is set to =1=, the value of the =viewSeedAlignY= set-get property (=0= in this case) has no effect on the vertical position of the View Seed.

				Now, as the effect progresses, the new item is revealed within an ever growing rectangle that starts out as a vertical sliver on the right, to eventually become the entire Swap Port. As this rectangle grows, how is the positioning of the view content within this rectangle determined? How does one qualify the difference between a wipe reveal and a slide in reveal?

				The answer is to be found in the values of the =viewContentAlignX= and =viewContentAlignY= set-get properties. In this example, =viewContentAlignX= is set to =0=. What this means is that the new item is positioned within the ever growing `View` rectangle so that it is aligned against its left edge. This has the effect of creating a slide in effect. Were the value of =viewContentAlignX= to be =1= (ie. right aligned) or ='none'=, then you would end up with a wipe reveal.

				The value ='none'= has the same effect as right alignment in this case because the View Seed starts at the right edge of the Swap Port and the right edge of the View rectangle stays against the right edge of the Swap Port as the rectangle grows during the effect. By contrast, the value ='none'= would *not* have the same effect as =1= if the =viewSeedAlignX= set-get property were set to =.5=.

			Cycling Property Sets
				Cycling Property Sets, as specified in the =cyclingPropertySets= set-get property, provide a convenient way to cycle through different swap effect settings on each transition from the current item to the next item.

				The value of the =cyclingPropertySets= property should be an array, where each element of the array is an object containing values for the set-get properties of the =Uize.Widget.Swap= class. Each time, upon transitioning from the current item to the next item, the current element of the =cyclingPropertySets= is used to set new effect values and the array counter is advanced. Upon using the last element of the array, the counter is then reset back to =0=, thereby starting again at the first element. Consider the following example...

				EXAMPLE
				...............................................................
				page.addChildren (
					'imageSwap',
					Uize.Widget.Swap.Image,
					{
						cyclingPropertySets:[
							Uize.Widget.Swap.presets.fadeOutPauseThenFadeIn,
							Uize.Widget.Swap.presets.fadeWipeHorizontalFromCenter,
							Uize.Widget.Swap.presets.fadeSlideInFromBottom,
							Uize.Widget.Swap.presets.wipeOutWipeInLeft,
							Uize.Widget.Swap.presets.centerOpenCloseCrossFade
						]
					}
				);
				...............................................................

				In the above example, an instance of the =Uize.Widget.Swap.Image= subclass is being added as a child widget to the a page widget instance (that we can assume to have already been created). The =cyclingPropertySets= set-get property is being set to an array containing a limited number of preset effect settings that have been cherry-picked from the presets defined in the =Uize.Widget.Swap.xPresets= extension module (which we can assume to have been previously loaded). Now, each time a new value is set for the =src= set-get property of the =imageSwap= instance (=src= is implemented in the =Uize.Widget.Swap.Image= subclass), the next effect settings will be picked from the =cyclingPropertySets= array and set on the =imageSwap= instance. So, in a nutshell, each transition will use different effect settings.
*/

Uize.module ({
	name:'Uize.Widget.Swap',
	required:[
		'Uize.Node',
		'Uize.Node.Util',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
			;

		/*** Global Variables ***/
			var
				_cropCoords = [],
				_viewCoords = [],
				_pos = []
			;

		/*** Utility Functions ***/
			function _blendValues (_value1,_value2,_blend) {return _value1 + (_value2 - _value1) * _blend}

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;
						/*** Private Instance Properties ***/
							_this._viewFinalCoords =
								_this.viewFinalCoords = [0,0,0,0]
								/*?
									Instance Properties
										viewFinalCoords
											An array, representing the `View Final` coordinates for the swap effect, where the elements of the array represent values for left, top, width, and height, respectively.

											NOTES
											- this property is intended to be used by subclasses
								*/
							;
							_this._cycleNo = 0;

						/*** Public Instance Properties ***/
							_this.fade = new Uize.Fade ({
								duration:850,
								curve:Uize.Fade.celeration (.5,0),
								startValue:0,
								endValue:1
								/*?
									Instance Properties
										fade
											An instance of the =Uize.Fade= class that drives the animation for the swap effect.

											This property allows access to the fade instance that drives the swap animation. This allows you to modify properties of the animation, such as =duration=, =curve=, and any of the other set-get properties supported by the =Uize.Fade= class.
								*/
							});

						/*** Initialization ***/
							_this.fade.wire (
								'Changed.value',
								function () {
									if (_this.isWired) {
										var _value = +_this.fade;
										if (_this._previousItem && _this._crossFade) {
											var
												_crossFadeSize = _this._crossFadeSize,
												_fadeInStartPoint = _crossFadeSize < 0
													? 1 - (1 + _crossFadeSize) * (1 - _this._crossFadeAlign)
													: (1 - _crossFadeSize) * _this._crossFadeAlign
												,
												_fadeOutEndPoint = _fadeInStartPoint + _crossFadeSize
											;
											_this._updateItem (
												_this._currentItem,
												_fadeInStartPoint != 1
													? Uize.constrain ((_value - 1) / (1 - _fadeInStartPoint) + 1,0,1)
													: _value == 1 ? 1 : 0
											);
											_this._updateItem (
												_this._previousItem,
												_fadeOutEndPoint
													? Uize.constrain (1 - _value / _fadeOutEndPoint,0,1)
													: _value ? 0 : 1
											);
										} else {
											_this._updateItem (_this._currentItem,_value);
										}
									}
								}
							);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateItem = function (_item,_value,_updateAllProperties) {
				var
					_this = this,
					_styleProperties = _this._dissolve
						? _Uize_Node.Util.getOpacityProperties (_value)
						: _updateAllProperties ? _Uize_Node.Util.getOpacityProperties (1) : {}
				;
				if (_updateAllProperties || _this._viewSeedSizeX != 1 || _this._viewSeedSizeY != 1) {
					for (var _coordNo = -1; ++_coordNo < 4;)
						_viewCoords [_coordNo] = _blendValues (
							_this._viewSeedCoords [_coordNo],_this._viewFinalCoords [_coordNo],_value
						)
					;
					if (_updateAllProperties || _this._viewContentAlignX !== 'none' || _this._viewContentAlignY !== 'none') {
						for (var _axis = -1; ++_axis < 2;) {
							var
								_viewContentAlign = _axis ? _this._viewContentAlignY : _this._viewContentAlignX,
								_noViewContentAlign = _viewContentAlign == 'none'
							;
							_pos [_axis] = _noViewContentAlign
								? 0
								: _blendValues (
									_viewCoords [0 + _axis],
									_viewCoords [2 + _axis] - _this._viewFinalCoords [2 + _axis],
									_viewContentAlign == 'auto'
										? (_this._viewSeedCoords [_axis] + _this._viewSeedCoords [_axis + 2])
											/ 2 / _this._viewFinalCoords [_axis + 2]
										: _viewContentAlign
								)
							;
							_styleProperties [_axis ? 'top' : 'left'] = _noViewContentAlign ? '' : _pos [_axis];
						}
					} else {
						_pos [0] = _pos [1] = 0;
					}
					for (var _coordNo = -1; ++_coordNo < 4;)
						_cropCoords [_coordNo] =
							Math.round (_viewCoords [_coordNo] - _pos [_coordNo % 2] + (_coordNo >> 1)) + 'px '
					;
					_styleProperties.clip =
						'rect(' + _cropCoords [1] + _cropCoords [2] + _cropCoords [3] + _cropCoords [0] + ')'
					;
				}
				_Uize_Node.setStyle (_item,_styleProperties);
			};

		/*** Public Instance Methods ***/
			_classPrototype.prepareForNextItem = function (_currentItem,_nextItem) {
				var
					_this = this,
					_node = _this.getNode () || _nextItem,
					_viewFinalDimsW = parseInt (_Uize_Node.getStyle (_node,'width')),
					_viewFinalDimsH = parseInt (_Uize_Node.getStyle (_node,'height'))
				;
				_this.fade.stop ();
				_this._cyclingPropertySets &&
					_this.set (_this._cyclingPropertySets [_this._cycleNo++ % _this._cyclingPropertySets.length])
				;
				_this._viewFinalCoords [2] = _viewFinalDimsW - 1;
				_this._viewFinalCoords [3] = _viewFinalDimsH - 1;
				var
					_seedW = Math.max (0,_viewFinalDimsW * _this._viewSeedSizeX),
					_seedH = Math.max (0,_viewFinalDimsH * _this._viewSeedSizeY),
					_seedL = (_viewFinalDimsW - _seedW) * _this._viewSeedAlignX,
					_seedT = (_viewFinalDimsH - _seedH) * _this._viewSeedAlignY
				;
				_this._viewSeedCoords = [_seedL,_seedT,_seedL + _seedW - 1,_seedT + _seedH - 1];
				_currentItem && _this._updateItem (_currentItem,1,_true);
				_nextItem && _this._updateItem (_nextItem,0,_true);
				/*?
					Instance Methods
						prepareForNextItem
							A hook method that is provided for subclasses.

							SYNTAX
							...............................................................
							mySwap.prepareForNextItem (currentItemNodeOBJ,nextItemNodeOBJ);
							...............................................................

							This method updates internal state for the instance in preparation for building the next item and should be called before HTML for the next item is inserted into the next item's node.

							NOTES
							- to get a better sense of how this method is used, you can take a look at the implementation of the =Uize.Widget.Swap.Image= subclass
							- see the related =setCurrentItem= instance method
				*/
			};

			_classPrototype.setCurrentItem = function (_currentItem) {
				var _this = this;
				_this.setNodeStyle (_this._previousItem = _this._currentItem,{zIndex:0});
				_this.setNodeStyle (_this._currentItem = _currentItem,{zIndex:1});
				_this.fade.start ();
				/*?
					Instance Methods
						setCurrentItem
							A hook method that is provided for subclasses.

							SYNTAX
							........................................
							mySwap.setCurrentItem (nextItemNodeOBJ);
							........................................

							This method initiates the fade that animates the swap effect to reveal the next item. Essentially, you are setting the current item to the next item, which has the effect of triggering the transition. The next item node should be ready to be revealed before this method is called (including all images being completely loaded). Before this method is called, the =prepareForNextItem= instance method should already have been called.

							NOTES
							- to get a better sense of how this method is used, you can take a look at the implementation of the =Uize.Widget.Swap.Image= subclass
							- see the related =prepareForNextItem= instance method
				*/
			};

			_classPrototype.wireUi = function () {
				if (!this.isWired) {
					this.setNodeStyle ('',{overflow:'hidden'});

					_superclass.prototype.wireUi.call (this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_crossFade:{
					name:'crossFade|wipeOut',
					value:_false
					/*?
						Set-get Properties
							crossFade
								A boolean, specifying whether or not the `Crossfade` behavior should be enabled.

								When =crossFade= is set to =true=, then the related =crossFadeSize= and =crossFadeAlign= set-get properties become applicable.

								NOTES
								- see the related =crossFadeSize= and =crossFadeAlign= set-get properties
								- the initial value is =false=
					*/
				},
				_crossFadeAlign:{
					name:'crossFadeAlign',
					value:.5
					/*?
						Set-get Properties
							crossFadeAlign
								A floating point number in the range of =0= to =1=, specifying the `Crossfade Alignment` for the `Crossfade` behavior.

								For a detailed discussion of =crossFadeAlign= in the broader context of the crossfade behavior, see the section `Crossfade`.

								NOTES
								- see the companion =crossFadeSize= set-get property
								- when the =crossFade= set-get property is set to =false=, then =crossFadeAlign= has no effect
								- the initial value is =.5=
					*/
				},
				_crossFadeSize:{
					name:'crossFadeSize',
					value:0
					/*?
						Set-get Properties
							crossFadeSize
								A floating point number in the range of =0= to =1=, specifying `Crossfade Size` for the `Crossfade` behavior as a fraction of the overal swap effect duration.

								For a detailed discussion of =crossFadeSize= in the broader context of the crossfade behavior, see the section `Crossfade`.

								NOTES
								- see the companion =crossFadeAlign= set-get property
								- when the =crossFade= set-get property is set to =false=, then =crossFadeSize= has no effect
								- the initial value is =0=
					*/
				},
				_cyclingPropertySets:'cyclingPropertySets',
					/*?
						Set-get Properties
							cyclingPropertySets
								An optional array, specifying `Cycling Property Sets` that should be cycled through on each transition from the current item to the next item.

								NOTES
								- the initial value is =undefined=
					*/
				_dissolve:{
					name:'dissolve',
					value:_true
					/*?
						Set-get Properties
							dissolve
								A boolean, specifying whether or not opacity should be animated during the swap effect.

								When the =viewSeedSizeX= and =viewSeedSizeY= set-get properties are both set to =1=, then you will only notice the swap effect if =dissolve= is set to =true=, since the coordinates of each `View` will be the `View Final` coordinates throughout the duration of the effect - the only means for transitioning from the current item to the next item will be through animating the opacity.

								NOTES
								- the initial value is =true=
					*/
				},
				_viewContentAlignX:{
					name:'viewContentAlignX',
					value:'none'
					/*?
						Set-get Properties
							viewContentAlignX
								A floating point number in the range of =0= to =1=, specifying the horitontal `View Content Alignment` of an item in its `View`.

								NOTES
								- the special value of ='none'= specifies that there should be no `View Content Alignment` for the X-axis
								- the initial value is ='none'=
					*/
				},
				_viewContentAlignY:{
					name:'viewContentAlignY',
					value:'none'
					/*?
						Set-get Properties
							viewContentAlignY
								A floating point number in the range of =0= to =1=, specifying the vertical `View Content Alignment` of an item in its `View`.

								NOTES
								- the special value of ='none'= specifies that there should be no `View Content Alignment` for the Y-axis
								- the initial value is ='none'=
					*/
				},
				_viewSeedSizeX:{
					name:'viewSeedSizeX',
					value:1
					/*?
						Set-get Properties
							viewSeedSizeX
								A floating point number in the range of =0= to =1=, specifying the horizontal `View Seed Size` as a fraction of the width of the `View Final`.

								NOTES
								- the initial value is =1=
					*/
				},
				_viewSeedSizeY:{
					name:'viewSeedSizeY',
					value:1
					/*?
						Set-get Properties
							viewSeedSizeY
								A floating point number in the range of =0= to =1=, specifying the vertical `View Seed Size` as a fraction of the height of the `View Final`.

								NOTES
								- the initial value is =1=
					*/
				},
				_viewSeedAlignX:{
					name:'viewSeedAlignX',
					value:.5
					/*?
						Set-get Properties
							viewSeedAlignX
								A floating point number in the range of =0= to =1=, specifying the horizontal `View Seed Alignment` of the `View Seed` within the `Swap Port`.

								NOTES
								- the initial value is =.5=
					*/
				},
				_viewSeedAlignY:{
					name:'viewSeedAlignY',
					value:.5
					/*?
						Set-get Properties
							viewSeedAlignY
								A floating point number in the range of =0= to =1=, specifying the vertical `View Seed Alignment` of the `View Seed` within the `Swap Port`.

								NOTES
								- the initial value is =.5=
					*/
				}
			});

		return _class;
	}
});

