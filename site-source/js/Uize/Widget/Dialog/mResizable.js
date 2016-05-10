/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.mResizable Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 6
	codeCompleteness: 2
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.mResizable= mixin module implements features to allow dialogs to dynamically resize.

		EXAMPLE
		............................................................................
		Uize.module ({
			required:[
				'Uize.Widget.Page',
				'Uize.Widget.Dialog.mResizable'
			],
			builder:function () {
				var page = window.page = Uize.Widget.Page ();

				page.addChild ('resizableDialog',Uize.Widget.Dialog,{resizable:true});
			}
		});
		............................................................................

		In the above example, an anonymous module is being used to require the =Uize.Widget.Page= (page widget) class and the =Uize.Widget.Dialog.mResizable= extension module. Once these two modules are loaded, the =builder= function creates an instance of the page widget and adds a dialog (an instance of the =Uize.Widget.Dialog= class) named =resizableDialog= as a child widget. By specifying the initial state of ={resizable:true}=, the dialog is resizable by the user.

		Things to Note
			Must Set Resizable To True
				It is not sufficient to merely require the =Uize.Widget.Dialog.mResizable= module in order for dialogs to be resizable.

				This module only implements the resizability functionality. You still need to enable resizability for specific dialogs, because just making all dialogs resizable by default would have a runtime cost and may not even be appropriate for most cases.

			Requiring Uize.Widget.Dialog Optional
				If one requires the =Uize.Widget.Dialog.mResizable= extension module, it is not essential to require the =Uize.Widget.Dialog= module, since it is implicit by requiring =Uize.Widget.Dialog.mResizable=.

				However, you may still want to require both as a good practice, since you will technically be creating instances of =Uize.Widget.Dialog= and not =Uize.Widget.Dialog.mResizable=.

			All Subclasses Resizable
				Because the =Uize.Widget.Dialog.mResizable= module extends the =Uize.Widget.Dialog= module, instances of all subclasses of =Uize.Widget.Dialog= will also be able to be resizable.

				This is provided that the =Uize.Widget.Dialog= module is extended before the subclasses are created. Examples of other dialog subclasses include: =Uize.Widget.Dialog.Confirm=, =Uize.Widget.Dialog.Form=, and =Uize.Widget.Dialog.Form=.

			Forced Resizable Subclasses
				A dialog subclass can be made resizable so that all newly created instances of that subclass will be resizable right off the bat. This is done by setting the value of the =resizable= state property to =true= on the class, as in the following example...

				EXAMPLE
				.....................................................................................
				Uize.require (
					'Uize.Widget.Dialog.mResizable',
					function () {
						(MyNamespace.MyDialog = Uize.Widget.Dialog.subclass ()).set ({resizable:true});

						var
							myDialog1 = new MyNamespace.MyDialog,                    // resizable
							myDialog2 = new MyNamespace.MyDialog ({resizable:false}) // non-resizable
						;
					}
				);
				.....................................................................................

				In the above example, instances of the =MyNamespace.MyDialog= class are automatically resizable. It is still possible to suppress resizability by explicitly setting =resizable= to =false= during construction, as is the case with the =myDialog2= instance created in this example.

		*DEVELOPERS:* `Chris van Rensburg`
*/


Uize.module({
	name: 'Uize.Widget.Dialog.mResizable',
	required: [
		'Uize.Widget.Resizer',
		'Uize.Dom.Basics',
		'Uize.Dom.Pos'
	],
	builder: function (_class) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize = Uize,

			/*** Names for Namespaced Privates ***/
				_privatesNamespace = 'Uize.Widget.Dialog.mResizable.',
				_pResizer = _privatesNamespace + 'resizer',
				_pResizerInitialized = _privatesNamespace + 'resizerInitialized'
		;

		/*** Private Instance Methods ***/
		function _createResizerIfNecessary(m) {
			var _resizer = m[_pResizer];
			if (m.resizable && !_resizer) {
				(
					m[_pResizer] = _resizer = m.addChild(
						'resizer',
						Uize.Widget.Resizer,
						{
							constrain: _false,
							minHeight: 0,
							minWidth: 150
						}
					)
					/*?
						Child Widgets
							resizer
								An instance of the =Uize.Widget.Resizer= class, that is used to wire up the resize functionality for the dialog.

								The interface of the =Uize.Widget.Resizer= class can be used to qualify how the dialog is resizable. For example, a dialog could be made only vertically resizable as follows...

								........................................................................
								Uize.require (
									[
										'Uize.Widget.Page',
										'Uize.Widget.Dialog.mResizable'
									],
									function () {
										var page = window.page = Uize.Widget.Page ();

										page.addChild (
											'verticallyResizableDialog',Uize.Widget.Dialog,{resizable:true}
										).children.resizer.set ({
											fixedX:true
										});
									}
								);
								........................................................................

								In the above example, notice how the =resizer= child widget is being dereferenced off the =children= property immediately after adding the dialog child widget. This is possible because the =addChild= instance method returns a reference to the child widget being added (the dialog in this case). Setting the =fixedX= state property of the =resizer= instance to =true= causes the dialog to be resizable only in the Y-axis (vertically).

								*NOTE:* For optimization, the =resizer= child widget is only created if a dialog is made resizable by setting its =resizable= state property to =true=. Therefore, be careful to first set a dialog to be resizable before attempting to access the =resizer= child widget for modifying its state.
					*/
				).wire({
					'Changed.inDrag': function (_event) { m.set({ inDrag: _event.newValue }) },
					'Drag Start': m,
					'Drag Done': function (_event) {
						m.set({
							width: _resizer.get('width'),
							height: _resizer.get('height')
						});
						m.fire(_event);
					}
				});

				/*** code to resync resizer position ***/
				var _syncResizerToDialogPosition = function () {
					if (m.isWired && m.get('shown')) {
						var _rootNode = m.getNode();
						if (_Uize.Dom.Basics.getStyle(_rootNode, 'display') != 'none') {
							var _rootNodeCoords = _Uize.Dom.Pos.getCoords(_rootNode);
							_resizer.set({
								left: _rootNodeCoords.left,
								top: _rootNodeCoords.top,
								width: _rootNodeCoords.width,
								height: _rootNodeCoords.height
							});
						}
					}
				};
				m.wire({
					'After Show': _syncResizerToDialogPosition,
					'Changed.width': _syncResizerToDialogPosition,
					'Changed.height': _syncResizerToDialogPosition,
					'Drag Done': _syncResizerToDialogPosition
				});

				/*** initialization ***/
				if (m.isWired) {
					_initializeResizerNodesIfNecessary(m);
					m.get('shown') && // sync position, if resizer created after dialog is shown
						_syncResizerToDialogPosition()
					;
					_resizer.wireUi(); // wire up, if resizer created after dialog is wired
				}
			}
		}

		function _initializeResizerNodesIfNecessary(m) {
			if (m.isWired && m.resizable && !m[_pResizerInitialized]) {
				m[_pResizerInitialized] = _true;
				m[_pResizer].set({
					areaNodes: [m.getNode()],
					nodeMap: {
						move: null,
						shell: document.documentElement
					}
				});
			}
		}

		function _updateMaximizeUi() {
			var
				m = this,
				_maximize = m.children.maximize,
				_restore = m.children.restore,
				_isMaximized = m.get('isMaximized')
			;

			_maximize && _maximize.displayNode('', !_isMaximized);
			_restore && _restore.displayNode('', _isMaximized);

		}

		_class.declare({
			instanceMethods: {
				atEndOfOmegaStructor: function () {
					var m = this;

					m.addChild('maximize', _Uize.Widget.Button).wire('Click', function () { m.set({ isMaximized: _true }) });
					m.addChild('restore', _Uize.Widget.Button).wire('Click', function () { m.set({ isMaximized: _false }) });

					_createResizerIfNecessary(m);
				},

				afterWireUi: function () {
					var m = this;
					m.wireNode(window, 'resize', function () {
						//This will resize the dialog to fit the screen if it is already maximized
						m.get('isMaximized') && m.updateUiDimsIfShown();
					});

					_updateMaximizeUi.call(m);
					_initializeResizerNodesIfNecessary(m);
				},

				updateUiDimsIfShown: function () {
					var
						m = this,
						_nodeToSetDimension = m.get('nodeToSetDimension')
					;
					if (m.isWired && m.get('shown') && !m.get('inDrag')) {
						if (!m.get('isMaximized')) {
							m.setNodeStyle(_nodeToSetDimension, { width: m.get('width'), height: m.get('height') });
							//m.setNodeStyle('', { width: m.get('width') });
						} else {
							var
								_contentDims = _Uize.Dom.Pos.getDimensions(m.getNode(_nodeToSetDimension)),
								_rootDims = _Uize.Dom.Pos.getDimensions(m.getNode()),
								_windowCoords = _Uize.Dom.Pos.getCoords(window)
							;
							m.setNodeStyle(
								'',
								{
									top: window.pageYOffset,
									left: 0,
									height: 'auto',
									width: 'auto'
								}
							);
							m.setNodeStyle(
								_nodeToSetDimension,
								{
									width: _windowCoords.width - (_rootDims.width - _contentDims.width),
									height: _windowCoords.height - (_rootDims.height - _contentDims.height)
								}
							);
						}
					}
				}
			},

			stateProperties: {
				resizable: {
					name: 'resizable',
					onChange: function () {
						var
							m = this,
							_resizer = m[_pResizer]
						;
						_createResizerIfNecessary(m);
						_initializeResizerNodesIfNecessary(m);
						_resizer && _resizer.set({ enabled: m.resizable ? 'inherit' : _false });
					}
					/*?
						State Properties
							resizable
								A boolean, specifying whether or not the dialog should be resizable.

								The value of this property can be changed at any time: before the dialog widget is wired, after it is wired but before it is shown, after it is shown, etc. The first time that this property becomes =true=, the =resizer= child widget is added to the dialog widget.

								NOTES
								- the initial value is =undefined= (equivalent to =false=)
					*/
				},
				isMaximized: {
					name: 'isMaximized',
					onChange: [
						'updateUiDimsIfShown',
						'updateUiPositionIfShown',
						_updateMaximizeUi
					],
					value: _false
					/*?
						State Properties
							isMaximized
								A boolean, specifying whether or not the dialog is maximized.

								NOTES
								- the initial value is =false=
					*/
				}
			}
		});
	}
});

