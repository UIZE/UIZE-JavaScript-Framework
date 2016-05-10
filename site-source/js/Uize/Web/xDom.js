/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Web.xDom Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 5
	codeCompleteness: 10
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Web.xDom= module extends the =Uize.Web= object by adding functionality for manipulating the DOM.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		The =Uize.Web.xDom= module is an extension module that extends the =Uize.Web= class. Pages that want to leverage the syntax-friendly nature of =Uize.Web= may not need to leverage any DOM manipulation. Therefore, the DOM manipulation functionality is not implemented in the =Uize.Web= class in order to reduce the need for loading the extra code.  Instead, in order to include the DOM manipulation functionality, one needs to require the =Uize.Web.xDom= extension module.

		Key Features
			The =Uize.Web.xDom= extension module provides the following features...

			Insertion Methods
				document...

			Removal Methods
				document...
*/

Uize.module ({
	name:'Uize.Web.xDom',
	required:'Uize.Dom.Basics',
	builder:function (_object) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_Uize = Uize,
				_Uize_Dom_Basics = _Uize.Dom.Basics,
				_objectPrototype = _object.prototype
		;

		/*** Utility Functions ***/
			var
				_emptyNode = function(_rootNode, _unwireChildNodes, _removeRoot) {
					var
						_removeAndUnwireChildNodes = function(_node) {
							var
								_childNodes = _node.childNodes,
								_childNodeNo = _childNodes.length - 1,
								_parentNode = _node.parentNode
							;

							// pre-order recursion so the children are removed/unwired first
							// remove/unwire child nodes in reverse, so that the change in length doesn't
							// affect our indexing
							for (; _childNodeNo > 0; _childNodeNo--)
								_removeAndUnwireChildNodes(_childNodes[_childNodeNo])
							;

							// don't remove the root node since we're emptying
							if (_removeRoot || _node != _rootNode) {
								// if the node is an element than unwire it (no point unwiring text nodes)
								_node.nodeType == 1
									&& _Uize_Dom_Basics.unwire(_node);

								// if the node is a child of the root node, remove it (an optimization since
								// we don't actually need to remove deep descendent nodes because removing their
								// parent will remove them too)
								(_parentNode == _rootNode || (_removeRoot && (_node == _rootNode)))
									&& _Uize_Dom_Basics.remove(_node);
							}
						}
					;

					_unwireChildNodes && _removeAndUnwireChildNodes(_rootNode);
					_rootNode.innerHTML = ''; // ensure completely empty
				},
				_isMatch = _object.isMatch
			;

		/*** Public Instance Methods ***/
			/** Insertion **/
				var
					_makeInjectHtmlMethodFrom = function(_fromMethodName, _toMethodName) { // "from" the set of matched nodes
						_objectPrototype[_fromMethodName] = function(_target) {
							// NOTE: Essentially what this does is wrap the target in a Uize.Web object and then call the peer toMethod
							// (i.e "appendTo" would call "append") and then pass 'this' as the content to inject
							return _object(_target)[_toMethodName](this);
						};
					},
					_makeInjectHtmlMethodTo = function(_methodName, _injectMode) { // "to" the set of matched nodes
						_objectPrototype[_methodName] = function() {
							var
								m = this,
								_length = m.length
							;

							_Uize.forEach(
								arguments,
								function(_arg) {
									m.handleSetAction(
										_arg,
										function(_node, _content) {
											_Uize.forEach(
												_Uize.isList(_content) ? _content : [_content],
												function(_contentToAdd) {
													// If there's only one node in the matched set (i.e. one location we want to inject into),
													// then we'll detach it, so that injecting will be a move instead of a clone.
													// But if there is more than one target node, injectHtml will clone since the nodes will have
													// parents
													_length == 1
														&& _Uize_Dom_Basics.isNode(_contentToAdd)
														&& _Uize_Dom_Basics.remove(_contentToAdd)
													;
													_Uize_Dom_Basics.injectHtml(_node, _contentToAdd, _injectMode);
												}
											);
										}
									);
								}
							);

							return m;
						};
					}
				;

				_makeInjectHtmlMethodTo('after', 'outer bottom');
					/*?
						Instance Methods
							after
								Inserts HTML string, DOM node, array of DOM nodes or =Uize.Web= object after each node in the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.after(contentBLOB);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.after(contentFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.after(content1BLOB, content2BLOB, ...);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.after(content1FUNC, content2FUNC, ...);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being added after a single DOM node (i.e. there is only one DOM node in the set of matched DOM nodes), that DOM node will be moved and not cloned.
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being added after multiple DOM nodes (i.e. there is more than one DOM node in the set of matched DOM nodes), that DOM node will be cloned before being inserted.
					*/

				_makeInjectHtmlMethodTo('append');
					/*?
						Instance Methods
							append
								Inserts HTML string, DOM node, array of DOM nodes or =Uize.Web= object to the end of each node in the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.append(contentBLOB);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.append(contentFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.append(content1BLOB, content2BLOB, ...);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.append(content1FUNC, content2FUNC, ...);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being appended to a single DOM node (i.e. there is only one DOM node in the set of matched DOM nodes), that DOM node will be moved and not cloned.
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being appended to multiple DOM nodes (i.e. there is more than one DOM node in the set of matched DOM nodes), that DOM node will be cloned before being inserted.
					*/
				_makeInjectHtmlMethodFrom('appendTo', 'append');
					/*?
						Instance Methods
							appendTo
								Inserts every DOM node in the set of matched DOM nodes to the end of each node in the target.

								SYNTAX
								........................................................
								newWeb = myWeb.appendTo(targetBLOB);
								........................................................

								NOTES
								- Returns a reference to the target wrapped in a new =Uize.Web= object
								- If =targetBLOB= is a single DOM node, the DOM nodes in the matched set of DOM nodes will be moved to the target (not cloned)
								- If =targetBLOB= is multiple DOM nodes, the DOM nodes in the matched set of DOM nodes will be cloned for each target after the first.
					*/

				_makeInjectHtmlMethodTo('before', 'outer top');
					/*?
						Instance Methods
							before
								Inserts HTML string, DOM node, array of DOM nodes or =Uize.Web= object before each node in the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.before(contentSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.before(contentFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.before(content1STR, content2STR, ...);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.before(content1FUNC, content2FUNC, ...);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being added before a single DOM node (i.e. there is only one DOM node in the set of matched DOM nodes), that DOM node will be moved and not cloned.
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being added before multiple DOM nodes (i.e. there is more than one DOM node in the set of matched DOM nodes), that DOM node will be cloned before being inserted.
					*/

				_makeInjectHtmlMethodFrom('insertAfter', 'after');
					/*?
						Instance Methods
							insertAfter
								Inserts every DOM node in the set of matched DOM nodes after each node in the target.

								SYNTAX
								........................................................
								newWeb = myWeb.insertAfter(targetBLOB);
								........................................................

								NOTES
								- Returns a reference to the target wrapped in a new =Uize.Web= object
								- If =targetBLOB= is a single DOM node, the DOM nodes in the matched set of DOM nodes will be moved to the target (not cloned)
								- If =targetBLOB= is multiple DOM nodes, the DOM nodes in the matched set of DOM nodes will be cloned for each target after the first.
					*/

				_makeInjectHtmlMethodFrom('insertBefore', 'before');
					/*?
						Instance Methods
							insertBefore
								Inserts every DOM node in the set of matched DOM nodes before each node in the target.

								SYNTAX
								........................................................
								newWeb = myWeb.insertBefore(targetBLOB);
								........................................................

								NOTES
								- Returns a reference to the target wrapped in a new =Uize.Web= object
								- If =targetBLOB= is a single DOM node, the DOM nodes in the matched set of DOM nodes will be moved to the target (not cloned)
								- If =targetBLOB= is multiple DOM nodes, the DOM nodes in the matched set of DOM nodes will be cloned for each target after the first.
					*/

				_makeInjectHtmlMethodTo('prepend', 'inner top');
					/*?
						Instance Methods
							prepend
								Inserts HTML string, DOM node, array of DOM nodes or =Uize.Web= object to the beginning of each node in the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.prepend(contentSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.prepend(contentFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.prepend(content1STR, content2STR, ...);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.prepend(content1FUNC, content2FUNC, ...);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being prepended to a single DOM node (i.e. there is only one DOM node in the set of matched DOM nodes), that DOM node will be moved and not cloned.
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is being prepended to multiple DOM nodes (i.e. there is more than one DOM node in the set of matched DOM nodes), that DOM node will be cloned before being inserted.
					*/

				_makeInjectHtmlMethodFrom('prependTo', 'prepend');
					/*?
						Instance Methods
							prependTo
								Inserts every DOM node in the set of matched DOM nodes to the beginning of each node in the target.

								SYNTAX
								........................................................
								newWeb = myWeb.prependTo(targetBLOB);
								........................................................

								NOTES
								- Returns a reference to the target wrapped in a new =Uize.Web= object
								- If =targetBLOB= is a single DOM node, the DOM nodes in the matched set of DOM nodes will be moved to the target (not cloned)
								- If =targetBLOB= is multiple DOM nodes, the DOM nodes in the matched set of DOM nodes will be cloned for each target after the first.
					*/

				_makeInjectHtmlMethodFrom('replaceAll', 'replaceWith');
					/*?
						Instance Methods
							replaceAll
								Replaces every DOM node in the set of matched DOM nodes with each node in the target.

								SYNTAX
								........................................................
								newWeb = myWeb.replaceAll(targetBLOB);
								........................................................

								NOTES
								- Returns a reference to the target wrapped in a new =Uize.Web= object
								- If =targetBLOB= is a single DOM node, the DOM nodes in the matched set of DOM nodes will be moved to replace the target (not cloned)
								- If =targetBLOB= is multiple DOM nodes, the DOM nodes in the matched set of DOM nodes will be cloned for each target after the first.
					*/

				_makeInjectHtmlMethodTo('replaceWith', 'outer replace');
					/*?
						Instance Methods
							replaceWith
								Replaces each node in the set of matched DOM nodes with the specified HTML string, DOM node, or =Uize.Web= object.

								SYNTAX
								........................................................
								myWeb = myWeb.replaceWith(contentSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.replaceWith(contentFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is replacing a single DOM node (i.e. there is only one DOM node in the set of matched DOM nodes), that DOM node will be moved and not cloned.
								- If a DOM node (or an array of DOM nodes) is specified as an argument, but is replacing multiple DOM nodes (i.e. there is more than one DOM node in the set of matched DOM nodes), that DOM node will be cloned before replacing.
					*/

			/** Removal **/
				_objectPrototype.detach = function(_selector) {
					return this.each(function() { _isMatch(this, _selector) && _Uize_Dom_Basics.remove(this) }); // NOTE: "this" in each is a reference to the node
					/*?
						Instance Methods
							detach
								Removes the set of matched DOM nodes that match a (optional) selector, keeping all of the wired events.

								SYNTAX
								........................................................
								myWeb = myWeb.detach();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.detach(selectorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.detach(node);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- All events wired on the detached DOM nodes are retained, which is useful when the detached DOM nodes are to be reinserted into the DOM at a later time
								- See related =remove= and =empty= methods
					*/
				};

				_objectPrototype.empty = function() {
					return this.each(function() { _emptyNode(this, _true) });
					/*?
						Instance Methods
							empty
								Iterates over the set of matched DOM nodes, removing all of the child DOM nodes (i.e. "emptying") of each one.

								SYNTAX
								........................................................
								myWeb = myWeb.empty();
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- All wired events are also removed from the child DOM nodes before removing the DOM nodes themselves
								- See also related =detatch= and =remove= methods
					*/
				};

				_objectPrototype.remove = function(_selector) {
					return this.each(function() { _isMatch(this, _selector) && _emptyNode(this, _true, _true) });
					/*?
						Instance Methods
							remove
								Iterates over the set of matched DOM nodes, removing each from the DOM.

								SYNTAX
								........................................................
								myWeb = myWeb.remove();
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.remove(selector);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- All wired events are also removed from the DOM nodes before removing the DOM nodes themselves
								- See also related =detatch= and =empty= methods
					*/
				};

	}
});
