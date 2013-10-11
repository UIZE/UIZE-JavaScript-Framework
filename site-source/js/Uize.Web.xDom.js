/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Web.xDom Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
		
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
	required:'Uize.Node',
	builder:function (_object) {
		'use strict'; // http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/
		
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,

				_Uize = Uize,
				_Uize_Node = _Uize.Node,

				//_Uize_isArray = _Uize.isArray,
				//_Uize_isFunction = _Uize.isFunction,

				_objectPrototype = _object.prototype
			;

		/*** Utility Functions ***/
			var
				_emptyNode = function(_rootNode, _unwireChildNodes) {
					var 
						_removeAndUnwireChildNodes = function(_node) {
							var
								_childNodes = _node.childNodes,
								_childNodeNo = _childNodes.length - 1,
								_parentNode = _node.parentNode
							;
							
							// remove/unwire child nodes in reverse, so that the change in length doesn't
							// affect our indexing
							for (; _childNodeNo > 0; _childNodeNo--)
								_removeAndUnwireChildNodes(_childNodes[_childNodeNo])
							;
							
							// don't remove the root node since we're emptying
							if (_node != _rootNode) {
								// if the node is an element than unwire it (no point unwiring text nodes)
								_node.nodeType == 1
									&& _Uize_Node.unwire(_node);

								// if the node is a child of the root node, remove it (an optimization since
								// we don't actually need to remove deep descendent nodes because removing their
								// parent will remove them too)
								_parentNode == _rootNode
									&& _Uize_Node.remove(_node);
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
					_makeInjectHtmlMethod = function(_methodName, _injectMode) {
						_objectPrototype[_methodName] = function() {
							var _this = this;

							_Uize.forEach(
								arguments,
								function(_arg) {
									_this._handleSetAction(
										_arg,
										function(_node, _content) { _Uize_Node.injectHtml(_node, _content, _injectMode) }
									);
								}
							);

							return _this;
						};
					},
					_makeIsOnNodeTreeMethod = function(_objectNodesAreRoot) {
						// NOTE: the goal of this function is to add the "contains" & "contained" methods to the prototype
						// which are basically the same, just with the root & node parameters swapped
						_objectPrototype[_objectNodesAreRoot ? 'contains' : 'contained'] = function(_nodeParam, _returnAll) {
							return this._handleGetAction(
								function(_node) {
									return _Uize_Node.isOnNodeTree(
										_objectNodesAreRoot ? _nodeParam : _node,
										_objectNodesAreRoot ? _node : _nodeParam
									);
								},
								_returnAll
							);
						};
					}
				;
				
				_makeInjectHtmlMethod('after', 'outer bottom');
					/*?
						Instance Methods
							after
								Inserts string content after each node in the set of matched DOM nodes.
	
								SYNTAX
								........................................................
								myWeb = myWeb.after(contentSTR);
								........................................................
	
								VARIATION 1
								........................................................
								myWeb = myWeb.after(contentFUNC);
								........................................................
	
								VARIATION 2
								........................................................
								myWeb = myWeb.after(content1STR, content2STR, ...);
								........................................................
	
								VARIATION 3
								........................................................
								myWeb = myWeb.after(content1FUNC, content2FUNC, ...);
								........................................................
								
								NOTES
								- Returns a reference to the same =Uize.Web= object
					*/
				_makeInjectHtmlMethod('append');
					/*?
						Instance Methods
							append
								Inserts string content to the end of each node in the set of matched DOM nodes.
	
								SYNTAX
								........................................................
								myWeb = myWeb.append(contentSTR);
								........................................................
	
								VARIATION 1
								........................................................
								myWeb = myWeb.append(contentFUNC);
								........................................................
	
								VARIATION 2
								........................................................
								myWeb = myWeb.append(content1STR, content2STR, ...);
								........................................................
	
								VARIATION 3
								........................................................
								myWeb = myWeb.append(content1FUNC, content2FUNC, ...);
								........................................................
								
								NOTES
								- Returns a reference to the same =Uize.Web= object
					*/
				_makeInjectHtmlMethod('before', 'outer top');
					/*?
						Instance Methods
							before
								Inserts string content before each node in the set of matched DOM nodes.
	
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
					*/

				_makeIsOnNodeTreeMethod();
					/*?
						Instance Methods
							contained
								Checks the current matched set of DOM nodes and returns =true= if they are contained by the specified DOM node, =false= otherwise.
	
								SYNTAX
								........................................................
								isContainedBOOL = myWeb.contained(nodeBLOB); // one matched node
								isContainedARRAY = myWeb.contained(nodeBLOB); // multiple matched nodes
								........................................................
								
								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See also related =contains= method
					*/

				_makeIsOnNodeTreeMethod(_true);
					/*?
						Instance Methods
							contains
								Checks the current matched set of DOM nodes and returns =true= if they are contain the specified DOM node, =false= otherwise.
	
								SYNTAX
								........................................................
								containsBOOL = myWeb.contains(nodeBLOB); // one matched node
								containsARRAY = myWeb.contains(nodeBLOB); // multiple matched nodes
								........................................................
								
								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See also related =contained= method
					*/

				_makeInjectHtmlMethod('prepend', 'inner top');
					/*?
						Instance Methods
							prepend
								Inserts string content to the beginning of each node in the set of matched DOM nodes.
	
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
					*/
			
			/** Removal **/
				_objectPrototype.detach = function(_selector) {
					return this.each(function() { _isMatch(this, _selector) && _Uize_Node.remove(this) }); // NOTE: "this" in each is a reference to the node
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

	}
});
