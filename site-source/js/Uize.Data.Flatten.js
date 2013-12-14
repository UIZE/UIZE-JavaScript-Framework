/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Flatten Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Data.Flatten= package provides methods for flattening a hierarchical / tree structured object to a flat, key/value hash table, as well as unflattening a key/value hash table to produce a hierarchical / tree structured object.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The methods of the =Uize.Data.Flatten= module make it easy to represent a hierarchical, tree structure or graph object using a single level hash / dictionary / lookup object.

			When flattening a hierarchical object to a hash structure using the =Uize.Data.Flatten.flatten= method, information about the original structure of object being flattened is retained in the key names of the flattened object by using the dereferencing paths to the leaf nodes to form the key names. This has the advantage of providing a natural way to derive keys for the flattened object that don't collide for different leaf nodes, as well as retaining information necessary to reconstitute the original source object from a flattened object using the companion =Uize.Data.Flatten.unflatten= method.

			EXAMPLE
			......................................................................................
			Uize.Data.Flatten.flatten ({
				animals:{
					pets:{
						dogs:{
							smallBreeds:['West Highland White','Miniature Chihuahua','Teacup Poodle'],
							largeBreeds:['Afghan','Great Dane','Irish Wolfhound','St. Bernard']
						},
						cats:['Persian','Siamese','Hairless']
					},
					wildAnimals:{
						dogs:['Coyote','Dingo'],
						cats:['Bobcat','Cheetah','Leopard','Lion','Lynx','Mountain Lion','Tiger'],
						other:['Aardvark','Elephant','Hedgehog','Opossum','Wildebeest','Zebra']
					}
				}
			});
			......................................................................................

			RESULT
			...................................................................................................
			{
				'animals.pets.dogs.smallBreeds':['West Highland White','Miniature Chihuahua','Teacup Poodle'],
				'animals.pets.dogs.largeBreeds':['Afghan','Great Dane','Irish Wolfhound','St. Bernard'],
				'animals.pets.cats':['Persian','Siamese','Hairless'],
				'animals.wildAnimals.dogs':['Coyote','Dingo'],
				'animals.wildAnimals.cats':['Bobcat','Cheetah','Leopard','Lion','Lynx','Mountain Lion','Tiger'],
				'animals.wildAnimals.other':['Aardvark','Elephant','Hedgehog','Opossum','Wildebeest','Zebra']
			}
			...................................................................................................

			A Real World Example
				.

			Unflattening a Flattened Object
				.

			Advanced Features
				Including Non-leaf Nodes
					.

				Using Custom Path Delimiter Strings
					.

				Using Custom Key Serialization and Parsing
					.
*/

Uize.module ({
	name:'Uize.Data.Flatten',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined
		;

		/*** Utility Functions ***/
			function _makeDelimiterBasedPathToKeyTransformer (_delimiter) {
				return function (_path) {return _path.join (_delimiter)};
			}

			function _makeDelimiterBasedKeyToPathTransformer (_delimiter) {
				return function (_key) {return _key.split (_delimiter)};
			}

			var
				_pathToKeyPeriodDelimited = _makeDelimiterBasedPathToKeyTransformer ('.'),
				_keyToPathPeriodDelimited = _makeDelimiterBasedKeyToPathTransformer ('.')
			;

		return Uize.package ({
			flatten:function (_tree,_pathToKey,_inclueNonLeafNodes) {
				_pathToKey = _pathToKey == _undefined
					? _pathToKeyPeriodDelimited
					: typeof _pathToKey == 'string'
						? _makeDelimiterBasedPathToKeyTransformer (_pathToKey)
						: _pathToKey
				;
				var _hash = {};
				function _processTreeNode (_treeNode,_path) {
					if (Uize.isPlainObject (_treeNode)) {
						if (_inclueNonLeafNodes && _path.length)
							_hash [_pathToKey (_path)] = _treeNode
						;
						for (var _subNodeName in _treeNode)
							_processTreeNode (_treeNode [_subNodeName],_path.concat (_subNodeName))
						;
					} else {
						_hash [_pathToKey (_path)] = _treeNode;
					}
				}
				_processTreeNode (_tree,[]);
				return _hash;
				/*?
					Static Methods
						Uize.Data.Flatten.flatten

							DIFFERENT USAGES

							`Flatten a Source Object, Using the Default Path-to-key Transformer`
							.....................................................
							flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ);
							.....................................................

							`Flatten a Source Object, Specifying a Path Delimiter String`
							......................................................................
							flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ,pathDelimiterSTR);
							......................................................................

							`Flatten a Source Object, Specifying a Path-to-key Transformer Function`
							..............................................................................
							flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ,pathToKeyTransformerFUNC);
							..............................................................................

							`Flatten a Source Object, Including Non-leaf Nodes in the Flattened Object`
							................................................................
							flattenedOBJ = Uize.Data.Flatten.flatten (
								sourceOBJ,pathToKeyTransformerANYTYPE,includeNonLeafNodesBOOL
							);
							................................................................

							Flatten a Source Object, Using the Default Path-to-key Transformer
								SYNTAX
								.....................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ);
								.....................................................

							Flatten a Source Object, Specifying a Path Delimiter String
								SYNTAX
								......................................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ,pathDelimiterSTR);
								......................................................................

							Flatten a Source Object, Specifying a Path-to-key Transformer Function
								SYNTAX
								..............................................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ,pathToKeyTransformerFUNC);
								..............................................................................

							Flatten a Source Object, Including Non-leaf Nodes in the Flattened Object
								SYNTAX
								................................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (
									sourceOBJ,pathToKeyTransformerANYTYPE,includeNonLeafNodesBOOL
								);
								................................................................

							NOTES
							- compare to the companion =Uize.Data.Flatten.unflatten= static method
				*/
			},

			unflatten:function (_hash,_keyToPath) {
				_keyToPath = _keyToPath == _undefined
					? _keyToPathPeriodDelimited
					: typeof _keyToPath == 'string'
						? _makeDelimiterBasedKeyToPathTransformer (_keyToPath)
						: _keyToPath
				;
				var _tree = {};
				for (var _key in _hash) {
					for (
						var
							_path = _keyToPath (_key),
							_pathPartNo = -1,
							_pathLength = _path.length,
							_pathPart,
							_treeNode = _tree
						;
						++_pathPartNo < _pathLength;
					)
						_treeNode =
							_treeNode [_pathPart = _path [_pathPartNo]] ||
							(_treeNode [_pathPart] = _pathLength - 1 - _pathPartNo ? {} : _hash [_key])
					;
				}
				return _tree;
				/*?
					Static Methods
						Uize.Data.Flatten.unflatten

							DIFFERENT USAGES

							`Unflatten a Source Object, Using the Default Key-to-path Transformer`
							..........................................................
							hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ);
							..........................................................

							`Unflatten a Source Object, Specifying a Path Delimiter String`
							...........................................................................
							hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ,pathDelimiterSTR);
							...........................................................................

							`Unflatten a Source Object, Specifying a Key-to-path Transformer Function`
							...................................................................................
							hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ,keyToPathTransformerFUNC);
							...................................................................................

							Unflatten a Source Object, Using the Default Key-to-path Transformer
								SYNTAX
								.....................................................
								hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ);
								.....................................................

							Unflatten a Source Object, Specifying a Path Delimiter String
								SYNTAX
								......................................................................
								hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ,pathDelimiterSTR);
								......................................................................

							Unflatten a Source Object, Specifying a Key-to-path Transformer Function
								SYNTAX
								..............................................................................
								hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ,keyToPathTransformerFUNC);
								..............................................................................

							NOTES
							- compare to the companion =Uize.Data.Flatten.flatten= static method
				*/
			}
		});
	}
});
