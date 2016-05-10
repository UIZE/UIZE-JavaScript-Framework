/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Web.xFilters Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 5
	codeCompleteness: 50
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Web.xFilters= module extends the =Uize.Web= object by adding functionality for filtering & traversing the matched set of DOM elements.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		The =Uize.Web.xFilters= module is an extension module that extends the =Uize.Web= class. Pages that want to leverage the syntax-friendly nature of =Uize.Web= may not need to leverage any filtering or traversing functionality. Therefore, the filtering & traversing functionality is not implemented in the =Uize.Web= class in order to reduce the need for loading the extra code.  Instead, in order to include the filtering & traversing functionality, one needs to require the =Uize.Web.xFilters= extension module.

		Key Features
			The =Uize.Web.xFilters= extension module provides the following features...

			Filtering Methods
				document...

			Tree Traversal Methods
				document...
*/

Uize.module ({
	name:'Uize.Web.xFilters',
	required:'Uize.Dom.Basics',
	builder:function (_object) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined,
				_Uize = Uize,
				_Uize_Dom_Basics = _Uize.Dom.Basics,
				_isNode = _Uize_Dom_Basics.isNode,
				_window = _Uize.global(),
				_document = _window.document,
				_objectPrototype = _object.prototype
		;

		/*** Utility Functions ***/
			var
				_getAncestors = function(_root, _options) {
					var
						_filterSelector = _options._filter,
						_targetSelector = _options._target,
						_singleOnly = _options._singleOnly,
						_includeSelf = _options._includeSelf,

						_node = _root,
						_ancestors = []
					;

					while (_node) {
						if (_includeSelf || (_node != _root)) {
							if (_targetSelector && _isMatch(_node, _targetSelector))
								break;

							_node != _document
								&& _isMatch(_node, _filterSelector)
								&& _ancestors.push(_node)
							;

							if (_singleOnly)
								break;
						}

						_node = _node.parentNode;
					}

					return _ancestors;
				},
				_getNodeUid = _object.getNodeUid,
				_getNodesLookup = function(_nodes) {
					var
						_nodesLookup = {},
						_nodesLength = _nodes.length,
						_nodeNo = -1
					;

					// add existing nodes to lookup table for comparising from added nodes
					for (; ++_nodeNo < _nodesLength;) {
						var _node = _nodes[_nodeNo];
						if (_isNode(_node))
							_nodesLookup[_getNodeUid(_node)] = _node;
					}

					return _nodesLookup;
				},
				_getSelectorTestFunc = function(_param) {
					var _testFunc;

					// for all of the test functions, "this" will be the node to test
					if (_Uize.isFunction(_param))
						_testFunc = _param;
					else if (_Uize.isString(_param)) // CSS selector syntax
						_testFunc = function() { return  _isMatch(this, _param) };
					else if (_isNode(_param)) // simple node comparison
						_testFunc = function() { return this == _param };
					else if (_object.isWeb(_param)) // if a Uize.Web object we'll just call any on the object with our node
						_testFunc = function() { return _param.any(this) };
					else if (_Uize.isList(_param)) {
						var _nodeLookup = _getNodesLookup(_param);
						_testFunc = function() { return _getNodeUid(this) in _nodeLookup };
					}

					return _testFunc;
				},
				_getSiblings = function(_startNode, _options) {
					var
						_siblingProperty = _options._isPrev ?'previousSibling' : 'nextSibling',
						_filterSelector = _options._filter,
						_targetSelector = _options._target,
						_includeSelf = _options._includeSelf,
						_selfNode = _options._self || _startNode,

						_node = _startNode,
						_siblings = []
					;

					while (_node) {
						// NOTE: Verify that we're looking at a DOM element and whether or not
						// we include the self node
						if ((_includeSelf || (_node != _selfNode)) && _node.nodeType == 1) {
							if (_targetSelector && _isMatch(_node, _targetSelector))
								break;

							_isMatch(_node, _filterSelector)
								&& _siblings.push(_node);

							if (_options._singleOnly)
								break;
						}

						_node = _node[_siblingProperty];
					}

					return _siblings;
				},
				_isMatch = _object.isMatch,
				_single = function (_nodes, _index) {
					var
						_nodesLength = _nodes.length,
						_singleNode
					;

					if (_index >= 0 && _index < _nodesLength)
						_singleNode = _nodes[_index];
					else if (_index < 0 && (_index + _nodesLength) >= 0)
						_singleNode = _nodes[_index + _nodesLength];

					return _singleNode;
				}
			;

		/*** Private Instance Methods ***/
			_objectPrototype._appendListHelper = function(_listGeneratorFunc) {
				var _list = [];

				// NOTE: Essentially go through each of the matched DOM nodes,
				// and add the list returned from _listGeneratorFunc to the end
				// of our uber list. *this* in _listGeneratorFunc will be a ref to the node
				this.each(
					function() { _list.push.apply (_list, _listGeneratorFunc.call(this)) }
				);

				return _object(_list);
			};

			_objectPrototype._filter = function(_selector, _mustMatch) {
				var
					m = this,
					_testFunc = _getSelectorTestFunc(_selector),
					_newSet = []
				;

				if (_mustMatch == _undefined)
					_mustMatch = _true;

				m.each(
					function() {
						// add node to the new set if we didn't have a test function, or the test function doesn't match (meaning we don't want to exclude)
						if (!_testFunc || _testFunc.call(this) == _mustMatch)
							_newSet.push(this);
					}
				);

				return _newSet;
			};

			_objectPrototype._getAncestors = function(_options) {
				return this._appendListHelper(function() { return _getAncestors(this, _options) });
			};

		/*** Public Instance Methods ***/
			/** Filtering **/
				var
					_makeIsOnNodeTreeMethod = function(_objectNodesAreRoot) {
						// NOTE: the goal of this function is to add the "contains" & "contained" methods to the prototype
						// which are basically the same, just with the root & node parameters swapped
						_objectPrototype[_objectNodesAreRoot ? 'contains' : 'contained'] = function(_nodeParam, _returnAll) {
							return this.handleGetAction(
								function(_node) {
									return _Uize_Dom_Basics.isOnNodeTree(
										_objectNodesAreRoot ? _nodeParam : _node,
										_objectNodesAreRoot ? _node : _nodeParam
									);
								},
								_returnAll
							);
						};
					}
				;

				_objectPrototype.any = function(_selector) { return this._filter(_selector).length > 0 };
					/*?
						Instance Methods
							any
								Checks the current matched set of DOM nodes against the specified selector, test function, element or =Uize.Web= object and returns =true= if at least one of these DOM nodes matches, and =false= otherwise.

								SYNTAX
								........................................................
								anyBOOL = myWeb.any(selectorSTR);
								........................................................

								VARIATION 1
								........................................................
								anyBOOL = myWeb.any(testFUNC);
								........................................................

								VARIATION 2
								........................................................
								anyBOOL = myWeb.any(nodeOBJ);
								........................................................

								VARIATION 3
								........................................................
								anyBOOL = myWeb.any(webOBJ);
								........................................................
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
								Checks the current matched set of DOM nodes and returns =true= if they contain the specified DOM node, =false= otherwise.

								SYNTAX
								........................................................
								containsBOOL = myWeb.contains(nodeBLOB); // one matched node
								containsARRAY = myWeb.contains(nodeBLOB); // multiple matched nodes
								........................................................

								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See also related =contained= method
					*/

				_objectPrototype.filter = function(_selector) { return _object(this._filter(_selector)) };
					/*?
						Instance Methods
							filter
								Reduce the set of matched DOM nodes to those that match the specified selector, returning a new =Uize.Web= object containing that DOM node.

								SYNTAX
								........................................................
								newWeb = myWeb.filter(selectorSTR);
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.filter(testFUNC);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.filter(nodeOBJ);
								........................................................

								VARIATION 3
								........................................................
								newWeb = myWeb.filter(webOBJ);
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =not= method
					*/

				_objectPrototype.first = function(_selector) {
					return (
						_selector
							? _object(_single(this._filter(_selector), 0)) // filters the nodes based on the selector, picks the first one (if available), then creates a new object
							: this.single(0)
					);
					/*?
						Instance Methods
							first
								Reduces the set of matched DOM nodes to the first in the set, returning a new =Uize.Web= object containing that DOM node.

								SYNTAX
								........................................................
								newWeb = myWeb.first();
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.first(selectorSTR);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.first(testFUNC);
								........................................................

								VARIATION 3
								........................................................
								newWeb = myWeb.first(nodeOBJ);
								........................................................

								VARIATION 4
								........................................................
								newWeb = myWeb.first(webOBJ);
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =last= method
								- See related =single= and =filter= methods
					*/
				};

				_objectPrototype.has = function(_selector) {
					return this._appendListHelper(
						function() { return [_object.select(_selector, this).length ? this : null] }
					);
					/*?
						Instance Methods
							has
								Reduces the set of matched DOM nodes to those that have a descendant that matches the specified selector, test function, element or =Uize.Web= object.

								SYNTAX
								........................................................
								newWeb = myWeb.has(selectorSTR);
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.has(testFUNC);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.has(nodeOBJ);
								........................................................

								VARIATION 3
								........................................................
								newWeb = myWeb.has(webOBJ);
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See related =find= method
					*/
				};

				_objectPrototype.index = function(_selector) {
					var
						_index = -1,
						_elementsLength = this.length,
						_elementNo = -1
					;

					for (; ++_elementNo < _elementsLength;) {
						if (_isMatch(this[_elementNo], _selector)) {
							_index = _elementNo;
							break;
						}
					}

					return _index;
					/*?
						Instance Methods
							index
								Returns an integer indicating the position of the specified selector, node generator function, element or =Uize.Web= object within the set of matched DOM nodes.

								SYNTAX
								........................................................
								indexINT = myWeb.index(selectorSTR);
								........................................................

								VARIATION 1
								........................................................
								indexINT = myWeb.index(nodeFUNC);
								........................................................

								VARIATION 2
								........................................................
								indexINT = myWeb.index(nodeOBJ);
								........................................................

								VARIATION 3
								........................................................
								indexINT = myWeb.index(webOBJ);
								........................................................

								NOTES
								- Returns =-1= if a match is not found
					*/
				};

				_objectPrototype.last = function(_selector) {
					return (
						_selector
							? _object(_single(this._filter(_selector), -1)) // filters the nodes based on the selector, picks the last one (if available), then creates a new object
							: this.single(-1)
					);
					/*?
						Instance Methods
							last
								Reduce the set of matched DOM nodes to the last in the set, returning a new =Uize.Web= object containing that DOM node.

								SYNTAX
								........................................................
								newWeb = myWeb.last();
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.last(selectorSTR);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.last(testFUNC);
								........................................................

								VARIATION 3
								........................................................
								newWeb = myWeb.last(nodeOBJ);
								........................................................

								VARIATION 4
								........................................................
								newWeb = myWeb.last(webOBJ);
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =first= method
								- See related =single= and =filter= methods
					*/
				};

				_objectPrototype.not = function(_selector) { return _object(this._filter(_selector, _false)) };
					/*?
						Instance Methods
							not
								Reduce the set of matched DOM nodes to those that do not match the specified selector, returning a new =Uize.Web= object containing that DOM node.

								SYNTAX
								........................................................
								newWeb = myWeb.not(selectorSTR);
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.not(testFUNC);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.not(nodeOBJ);
								........................................................

								VARIATION 3
								........................................................
								newWeb = myWeb.not(webOBJ);
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =filter= method
					*/

					_objectPrototype.single = function(_index) { return _object(_single(this, _index)) };
					/*?
						Instance Methods
							single
								Reduce the set of matched DOM nodes to the one at the specified index, returning a new =Uize.Web= object containing that DOM node.

								SYNTAX
								........................................................
								newWeb = myWeb.single(indexINT);
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
					*/

				_objectPrototype.slice = function(_start, _end) { return _object(this.element().slice(_start, _end)) };
					/*?
						Instance Methods
							slice
								Reduce the set of matched DOM nodes to the one at the specified range of indices, returning a new =Uize.Web= object containing that DOM node.

								SYNTAX
								........................................................
								newWeb = myWeb.slice(startINT, endINT);
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.slice(startINT);
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
					*/

			/** Traversing **/
				_objectPrototype.add = function(_selector, _rootSelector) {
					var _mergedNodes = this.element();

					// add the nodes to add
					_mergedNodes.push.apply(
						_mergedNodes,
						_object.select(_selector, _rootSelector) // nodes we're adding
					);

					// create new object w/ merged set of nodes (which will have a new _key)
					// NOTE: constructor strips out duplicates
					return _object(_mergedNodes);

					/*?
						Instance Methods
							add
								Adds nodes to the set of matched nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.add(selectorSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.add(selectorSTR, rootSelector);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.add(node);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.add(nodesARRAY);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.add(myWeb);
								........................................................

								VARIATION 5
								........................................................
								myWeb = myWeb.add();
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See also `Constructor`
					*/
				};

				_objectPrototype.ancestors = function(_selector) { return this._getAncestors({_filter:_selector}) };
					/*?
						Instance Methods
							ancestors
								Retrieves *all* of the ancestor nodes in the DOM tree (ordered from immediate parent on up) for each DOM node in the matched set of DOM nodes, optionally filtered by the specified selector, returning a new =Uize.Web= object containing those DOM nodes.

								SYNTAX
								........................................................
								newWeb = myWeb.ancestors();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.ancestors(selector);
								........................................................

								NOTES
								- Returns a reference to a new =Uize.Web= object
								- Any duplicates are removed
								- See related =ancestorsUntil=, =closest= and =parent= methods
					*/

				_objectPrototype.ancestorsUntil = function(_targetSelector, _filterSelector) {
					return this._getAncestors({_filter:_filterSelector, _target:_targetSelector});
					/*?
						Instance Methods
							ancestors
								Retrieves *all* of the ancestor nodes in the DOM tree for each DOM node in the matched set of DOM nodes (ordered from immediate parent on up to but not including the DOM node matching the optional find selector), optionally filtered by the specified filter selector, returning a new =Uize.Web= object containing those DOM nodes.

								SYNTAX
								........................................................
								newWeb = myWeb.ancestorsUntil(targetSelector, filterSelector);
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.ancestorsUntil(targetSelector);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.ancestorsUntil();
								........................................................

								NOTES
								- Returns a reference to a new =Uize.Web= object
								- Any duplicates are removed
								- See related =ancestors= and =parent= methods
					*/
				};

				_objectPrototype.children = function(_selector) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								this.firstChild,
								{
									_filter:_selector,
									_includeSelf:_true
								}
							);
						}
					);
					/*?
						Instance Methods
							children
								Retrieves the children of each DOM node in the matched set of DOM nodes, excluding text and comment nodes, filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.children();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.children(selector);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =contents= method
					*/
				};

				_objectPrototype.closest = function(_selector) {
					return this._appendListHelper(
						function() {
							// NOTE: Essentially this works by calling _getAncestors which goes up the ancestory tree (including self),
							// and then returns an array of 1, which is the first match (since we pass the selector to _getAncestors)
							// If there happen to be no matches, we'll just return an array w/ an undefined value which will get
							// ignored by the object constructor
							return _getAncestors(
								this,
								{
									_filter:_selector,
									_includeSelf:_true
								}
							).slice(0, 1); // just get the first one
						}
					);
					/*?
						Instance Methods
							closest
								Retrieves the first DOM node in DOM ancestory tree (including the DOM node itself) for each DOM node in the matched set of DOM nodes that matches the specified selector.

								SYNTAX
								........................................................
								newWeb = myWeb.closest(selector);
								........................................................

								NOTES
								- Returns a reference to a new =Uize.Web= object
								- See related =ancestors= and =parent= methods
					*/
				};

				_objectPrototype.contents = function(_selector) {
					var _newObject = this._appendListHelper(
						function() { return _Uize.copyList(this.childNodes) }
					);

					return _selector ? _newObject.filter(_selector) : _newObject;
					/*?
						Instance Methods
							contents
								Retrieves the children of each DOM node in the matched set of DOM nodes, including text and comment nodes, filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.contents();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.contents(selector);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =children= method
					*/
				};

				_objectPrototype.find = function(_selector) {
					return this._appendListHelper(
						function() {
							return !_selector || _Uize.isPlainObject(_selector)
								? _Uize_Dom_Basics.find(_Uize.copy(_selector, {root:this})) // force node as root
								: _object.select(_selector, this)
							;
						}
					);
					/*?
						Instance Methods
							find
								Retrieves *all* the descendants of each of the set of matched DOM nodes, filtered by the specified selector, node generator function, element or =Uize.Web= object.

								SYNTAX
								........................................................
								newWeb = myWeb.find(selectorSTR);
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.find(testFUNC);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.find(nodeOBJ);
								........................................................

								VARIATION 3
								........................................................
								newWeb = myWeb.find(webOBJ);
								........................................................

								VARIATION 4
								........................................................
								newWeb = myWeb.find(propertiesOBJ);
								........................................................

								VARIATION 5
								........................................................
								newWeb = myWeb.find();
								........................................................

								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See related =ancestors= and =has= methods
					*/
				};

				_objectPrototype.map = function(_mapper) { return _object(_Uize.map(this, _mapper)) };
					/*?
						Instance Methods
							map
								Passes each DOM node in the matched set of DOM nodes through the specified mapping function, producting a new =Uize.Web= object containing the return values.

								SYNTAX
								........................................................
								newWeb = myWeb.map(mapperFUNC);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
					*/

				_objectPrototype.next = function(_selector) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								this,
								{
									_filter:_selector,
									_singleOnly:_true
								}
							);
						}
					);
					/*?
						Instance Methods
							next
								Retrieves the immediate sibling following each DOM node in the matched set of DOM nodes, excluding text and comment nodes, filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.next();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.next(selector);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =previous=, =nextAll= and =nextUntil= methods
					*/
				};

				_objectPrototype.nextAll = function(_selector) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								this,
								{
									_filter:_selector
								}
							);
						}
					);
					/*?
						Instance Methods
							nextAll
								Retrieves the following siblings of each DOM node in the matched set of DOM nodes, excluding text and comment nodes, filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.nextAll();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.nextAll(selector);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =next= and =nextUntil= methods
					*/
				};

				_objectPrototype.nextUntil = function(_target, _filter) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								this,
								{
									_filter:_filter,
									_target:_target
								}
							);
						}
					);
					/*?
						Instance Methods
							nextUntil
								Retrieves the following siblings of each DOM node in the matched set of DOM nodes, excluding text and comment nodes, up to but not including the DOM node matched by the target selector and filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.nextUntil(target);
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.nextUntil(target, filter);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =next= and =nextAll= methods
					*/
				};

				_objectPrototype.parent = function(_selector) { return this._getAncestors({filter:_selector, _singleOnly:_true}) };
					/*?
						Instance Methods
							parent
								Retrieves the parent node for each DOM node in the matched set of DOM nodes, optionally filtered by the specified selector, returning a new =Uize.Web= object containing those DOM nodes.

								SYNTAX
								........................................................
								newWeb = myWeb.parent();
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.parent(selector);
								........................................................

								NOTES
								- Returns a reference to a new =Uize.Web= object
								- Any duplicates are removed
								- See related =ancestors=, =ancestorsUntil= and =closest= methods
					*/

				_objectPrototype.previous = function(_selector) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								this,
								{
									_isPrev:_true,
									_filter:_selector,
									_singleOnly:_true
								}
							);
						}
					);
					/*?
						Instance Methods
							previous
								Retrieves the immediate sibling preceeding each DOM node in the matched set of DOM nodes, excluding text and comment nodes, filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.previous();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.previous(selector);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =next=, =previousAll= and =previousUntil= methods
					*/
				};

				_objectPrototype.previousAll = function(_selector) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								this,
								{
									_isPrev:_true,
									_filter:_selector
								}
							);
						}
					);
					/*?
						Instance Methods
							previousAll
								Retrieves the preceeding siblings of each DOM node in the matched set of DOM nodes, excluding text and comment nodes, filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.previousAll();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.previousAll(selector);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =previous= and =previousUntil= methods
					*/
				};

				_objectPrototype.previousUntil = function(_target, _filter) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								this,
								{
									_isPrev:_true,
									_filter:_filter,
									_target:_target
								}
							);
						}
					);
					/*?
						Instance Methods
							previousUntil
								Retrieves the preceeding siblings of each DOM node in the matched set of DOM nodes, excluding text and comment nodes, up to but not including the DOM node matched by the target selector and filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.previousUntil(target);
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.previousUntil(target, filter);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =previous= and =previousAll= methods
					*/
				};

				_objectPrototype.siblingIndex = function(_returnAll) {
					return this.handleGetAction(
						function(_node) {
							return _Uize.indexIn(
								_object(_node.parentNode).children(),
								_node
							);
						},
						_returnAll
					);
					/*?
						Instance Methods
							siblingIndex
								Retrieves an integer indicating the position of the first DOM node within the matched set of DOM nodes relative to its sibling elements in the DOM.

								SYNTAX
								........................................................
								indexINT = myWeb.siblingIndex(); // one matched node
								........................................................

								VARIATION
								........................................................
								indexARRAY = myWeb.siblingIndex(returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
					*/
				};

				_objectPrototype.siblings = function(_selector) {
					return this._appendListHelper(
						function() {
							return _getSiblings(
								(this.parentNode || {}).firstChild,
								{
									_filter:_selector,
									_self:this
								}
							);
						}
					);
					/*?
						Instance Methods
							siblings
								Retrieves the siblings of each DOM node in the matched set of DOM nodes, excluding text and comment nodes, filtered by the optional selector.

								SYNTAX
								........................................................
								newWeb = myWeb.siblings();
								........................................................

								VARIATION
								........................................................
								newWeb = myWeb.siblings(selector);
								........................................................

								NOTES
								- Returns a reference to a =Uize.Web= object
								- See related =nextAll= and =previousAll= methods
					*/
				};
	}
});
