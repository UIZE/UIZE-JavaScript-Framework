/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.xResizable Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 6
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.xResizable= module extends the =Uize.Widget.Dialog= base class by adding a highly configurable resizing capability for dialogs.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Widget.Dialog.xResizable= module is an extension module that extends the =Uize.Widget.Dialog= class. In a Rich Internet Application, many dialogs will not need to be resizable by the user. Therefore, the resizability functionality is not implemented in the =Uize.Widget.Dialog= class - in order to reduce the need for loading the extra code. Instead, in order to make dialogs resizable one needs to require the =Uize.Widget.Dialog.xResizable= extension module and set the =resizable= state property that it adds to the =Uize.Widget.Dialog= class to =true= for any dialogs that you want to be resizable. Consider the following example...

		EXAMPLE
		............................................................................
		Uize.module ({
			required:[
				'Uize.Widget.Page',
				'Uize.Widget.Dialog.xResizable'
			],
			builder:function () {
				var page = window.page = Uize.Widget.Page ();

				page.addChild ('resizableDialog',Uize.Widget.Dialog,{resizable:true});
			}
		});
		............................................................................

		In the above example, an anonymous module is being used to require the =Uize.Widget.Page= (page widget) class and the =Uize.Widget.Dialog.xResizable= extension module. Once these two modules are loaded, the =builder= function creates an instance of the page widget and adds a dialog (an instance of the =Uize.Widget.Dialog= class) named =resizableDialog= as a child widget. By specifying the initial state of ={resizable:true}=, the dialog is resizable by the user.

		Things to Note
			Must Set Resizable To True
				It is not sufficient to merely require the =Uize.Widget.Dialog.xResizable= module in order for dialogs to be resizable.

				This module only implements the resizability functionality. You still need to enable resizability for specific dialogs, because just making all dialogs resizable by default would have a runtime cost and may not even be appropriate for most cases.

			Requiring Uize.Widget.Dialog Optional
				If one requires the =Uize.Widget.Dialog.xResizable= extension module, it is not essential to require the =Uize.Widget.Dialog= module, since it is implicit by requiring =Uize.Widget.Dialog.xResizable=.

				However, you may still want to require both as a good practice, since you will technically be creating instances of =Uize.Widget.Dialog= and not =Uize.Widget.Dialog.xResizable=.

			All Subclasses Resizable
				Because the =Uize.Widget.Dialog.xResizable= module extends the =Uize.Widget.Dialog= module, instances of all subclasses of =Uize.Widget.Dialog= will also be able to be resizable.

				This is provided that the =Uize.Widget.Dialog= module is extended before the subclasses are created. Examples of other dialog subclasses include: =Uize.Widget.Dialog.Confirm=, =Uize.Widget.Dialog.Form=, and =Uize.Widget.Dialog.Form=.

			Forced Resizable Subclasses
				A dialog subclass can be made resizable so that all newly created instances of that subclass will be resizable right off the bat. This is done by setting the value of the =resizable= state property to =true= on the class, as in the following example...

				EXAMPLE
				.....................................................................................
				Uize.module ({
					required:'Uize.Widget.Dialog.xResizable',
					builder:function () {
						(MyNamespace.MyDialog = Uize.Widget.Dialog.subclass ()).set ({resizable:true});

						var
							myDialog1 = new MyNamespace.MyDialog,                    // resizable
							myDialog2 = new MyNamespace.MyDialog ({resizable:false}) // non-resizable
						;
					}
				});
				.....................................................................................

				In the above example, instances of the =MyNamespace.MyDialog= class are automatically resizable. It is still possible to suppress resizability by explicitly setting =resizable= to =false= during construction, as is the case with the =myDialog2= instance created in this example.
*/

Uize.module ({
	name:'Uize.Widget.Dialog.xResizable',
	required:[
		'Uize.Widget.Resizer',
		'Uize.Node'
	],
	builder:function (_class) {
		'use strict';

		/*** Names for Namespaced Privates ***/
			var
				_privatesNamespace = 'Uize.Widget.Dialog.xResizable.',
				_pResizer = _privatesNamespace + 'resizer',
				_pResizerInitialized = _privatesNamespace + 'resizerInitialized',
				_pCreateResizerIfNecessary = _privatesNamespace + 'createResizerIfNecessary',
				_pInitializeResizerNodesIfNecessary = _privatesNamespace + 'initializeResizerNodesIfNecessary'
			;

		var _classPrototype = _class.prototype;

		/*** Private Instance Methods ***/
			_classPrototype [_pCreateResizerIfNecessary] = function () {
				var
					_this = this,
					_resizer = _this [_pResizer]
				;
				if (_this.resizable && !_resizer) {
					(
						_this [_pResizer] = _resizer = _this.addChild (
							'resizer',
							Uize.Widget.Resizer,
							{
								constrain:false,
								minHeight:0,
								minWidth:150
							}
						)
						/*?
							Child Widgets
								resizer
									An instance of the =Uize.Widget.Resizer= class, that is used to wire up the resize functionality for the dialog.

									The interface of the =Uize.Widget.Resizer= class can be used to qualify how the dialog is resizable. For example, a dialog could be made only vertically resizable as follows...

									........................................................................
									Uize.module ({
										required:[
											'Uize.Widget.Page',
											'Uize.Widget.Dialog.xResizable'
										],
										builder:function () {
											var page = window.page = Uize.Widget.Page ();

											page.addChild (
												'verticallyResizableDialog',Uize.Widget.Dialog,{resizable:true}
											).children.resizer.set ({
												fixedX:true
											});
										}
									});
									........................................................................

									In the above example, notice how the =resizer= child widget is being dereferenced off the =children= property immediately after adding the dialog child widget. This is possible because the =addChild= instance method returns a reference to the child widget being added (the dialog in this case). Setting the =fixedX= state property of the =resizer= instance to =true= causes the dialog to be resizable only in the Y-axis (vertically).

									*NOTE:* For optimization, the =resizer= child widget is only created if a dialog is made resizable by setting its =resizable= state property to =true=. Therefore, be careful to first set a dialog to be resizable before attempting to access the =resizer= child widget for modifying its state.
						*/
					).wire ({
						'Changed.inDrag':function () {_this.set ({inDrag:_resizer.get ('inDrag')})},
						'Drag Start':_this,
						'Drag Done':function (_event) {
							_this.set ({
								width:_resizer.get ('width'),
								height:_resizer.get ('height')
							});
							_this.fire (_event);
						}
					});

					/*** code to resync resizer position ***/
						var _syncResizerToDialogPosition = function () {
							if (_this.isWired && _this.get ('shown')) {
								var _rootNode = _this.getNode ();
								if (Uize.Node.getStyle (_rootNode,'display') != 'none') {
									var _rootNodeCoords = Uize.Node.getCoords (_rootNode);
									_resizer.set ({
										left:_rootNodeCoords.left,
										top:_rootNodeCoords.top,
										width:_rootNodeCoords.width,
										height:_rootNodeCoords.height
									});
								}
							}
						};
						_this.wire ({
							'After Show':_syncResizerToDialogPosition,
							'Changed.width':_syncResizerToDialogPosition,
							'Changed.height':_syncResizerToDialogPosition,
							'Drag Done':_syncResizerToDialogPosition
						});

					/*** initialization ***/
						if (_this.isWired) {
							_this [_pInitializeResizerNodesIfNecessary] ();
							_this.get ('shown') && // sync position, if resizer created after dialog is shown
								_syncResizerToDialogPosition ()
							;
							_resizer.wireUi (); // wire up, if resizer created after dialog is wired
						}
				}
			};

			_classPrototype [_pInitializeResizerNodesIfNecessary] = function () {
				var _this = this;
				if (_this.isWired && _this.resizable && !_this [_pResizerInitialized]) {
					_this [_pResizerInitialized] = true;
					_this [_pResizer].set ({
						areaNodes:[_this.getNode ()],
						nodeMap:{
							move:null,
							shell:document.documentElement
						}
					});
				}
			};

		/*** implement hook methods ***/
			_classPrototype.atEndOfOmegaStructor = function () {this [_pCreateResizerIfNecessary] ()};
			_classPrototype.afterWireUi = function () {this [_pInitializeResizerNodesIfNecessary] ()};

		/*** State Properties ***/
			_class.stateProperties ({
				resizable:{
					name:'resizable',
					onChange:function () {
						var
							_this = this,
							_resizer = _this [_pResizer]
						;
						_this [_pCreateResizerIfNecessary] ();
						_this [_pInitializeResizerNodesIfNecessary] ();
						_resizer && _resizer.set ({enabled:_this.resizable ? 'inherit' : false});
					}
					/*?
						State Properties
							resizable
								A boolean, specifying whether or not the dialog should be resizable.

								The value of this property can be changed at any time: before the dialog widget is wired, after it is wired but before it is shown, after it is shown, etc. The first time that this property becomes =true=, the =resizer= child widget is added to the dialog widget.

								NOTES
								- the initial value is =undefined= (equivalent to =false=)
					*/
				}
			});
	}
});

