/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Flatten Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 75
*/

/*?
	Introduction
		The =Uize.Data.Flatten= package provides methods for flattening a hierarchical / tree structured object to a flat, key/value hash table, as well as unflattening a key/value hash table to produce a hierarchical / tree structured object.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The methods of the =Uize.Data.Flatten= module make it easy to represent a hierarchical, tree structure or graph object using a single level hash / dictionary / lookup object.

			When flattening a hierarchical object to a hash structure using the =Uize.Data.Flatten.flatten= method, information about the original structure of object being flattened is retained in the key names of the flattened object by using the dereferencing path to the leaf nodes to form the key names. This has the advantage of providing a natural way to derive keys for the flattened object that don't collide for different leaf nodes, as well as retaining information necessary to reconstitute the original source object from a flattened object using the companion =Uize.Data.Flatten.unflatten= method.

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

			In the above example, we are flattening a hierarchical object that contains a (somewhat unscientific) classification of animals. The =Uize.Data.Flatten.flatten= method creates the resulting hash / lookup object that contains only properties for the leaf node properties of the hierarchical object, and where the key names represent the dereferencing

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
				To illustrate how the =Uize.Data.Flatten= module might be used, let's consider a real world example.

				In our example, we have a hierarchical object that contains all the resource strings that need to be translated for an entire Web application, where that object is structured according to the various sections of the application and the UI components used in each section. The object may look something like the following...

				RESOURCE STRINGS OBJECT
				......................................................
				var resourceStrings = {
					login:{
						username:'Username',
						password:'Password'
					},
					account:{
						password:{
							changePassword:'Change Your Password',
							forgotPassword:'Forgot Your Password?'
						},
						changeEmail:'Change Your Primary Email Address',
						changeUsername:'Change Your Username',
						notification:'Modify Your Notification Settings'
					},
					home:{
						newForYou:'New Articles for You',
						friendActivity:'News from Your Social Circle'
					},
					feeds:{
						worldNews:'World News',
						localNews:'News in Your Local Area',
						aroundTheWeb:'Recommended from Around the Web',
						editFeeds:'Edit Your Feeds and Settings'
					}
				};
				......................................................

				In reality, there would be many more resource strings than just these, and the structure of the object could be arbitarily deep, depending on the organization of the sections, subsections, UI components, etc.

				Now, let's say that a translation agency that we wish to use to translate our English strings into German wishes to receive the list of strings in a simple, flat CSV file with only two columns for string key-value pairs - not an unrealistic scenario. If we wanted to take the above object and convert it to a flat CSV file of pure key-value pairs, we could do so using the =Uize.Data.Flatten= module with the following statement...

				RESOURCE STRINGS OBJECT TO CSV
				..................................................
				var csvText = Uize.Data.Csv.to (
					Uize.Data.NameValueRecords.fromHash (
						Uize.Data.Flatten.flatten (resourceStrings),
						0,
						1
					)
				);
				..................................................

				Admittedly, we're getting a little help here from two other modules: the =Uize.Data.NameValueRecords= module and the =Uize.Data.Csv= module.

				In our statement, we are first flattening the =resourceStrings= object using the =Uize.Data.Flatten.flatten= method to produce a simple hash object, as follows...

				FLATTENED HASH
				..............................................................
				{
					'login.username':'Username',
					'login.password':'Password',
					'account.password.changePassword':'Change Your Password',
					'account.password.forgotPassword':'Forgot Your Password?',
					'account.changeEmail':'Change Your Primary Email Address',
					'account.changeUsername':'Change Your Username',
					'account.notification':'Modify Your Notification Settings',
					'home.newForYou':'New Articles for You',
					'home.friendActivity':'News from Your Social Circle',
					'feeds.worldNews':'World News',
					'feeds.localNews':'News in Your Local Area',
					'feeds.aroundTheWeb':'Recommended from Around the Web',
					'feeds.editFeeds':'Edit Your Feeds and Settings'
				}
				..............................................................

				Then, we take this hash object and use the =Uize.Data.NameValueRecords.fromHash= method to turn it into a name-value records array where name-value pairs are represented by two element arrays, as follows...

				AS A NAME-VALUE RECORDS ARRAY
				................................................................
				[
					['login.username','Username'],
					['login.password','Password'],
					['account.password.changePassword','Change Your Password'],
					['account.password.forgotPassword','Forgot Your Password?'],
					['account.changeEmail','Change Your Primary Email Address'],
					['account.changeUsername','Change Your Username'],
					['account.notification','Modify Your Notification Settings'],
					['home.newForYou','New Articles for You'],
					['home.friendActivity','News from Your Social Circle'],
					['feeds.worldNews','World News'],
					['feeds.localNews','News in Your Local Area'],
					['feeds.aroundTheWeb','Recommended from Around the Web'],
					['feeds.editFeeds','Edit Your Feeds and Settings']
				]
				................................................................

				Now that we have essentially a table structure with rows and columns, we can easily serialize this as a CSV string using the =Uize.Data.Csv.to= method to produce a string that we can write to a =.csv= file that would look as follows...

				CSV FILE
				......................................................
				login.username,Username
				login.password,Password
				account.password.changePassword,Change Your Password
				account.password.forgotPassword,Forgot Your Password?
				account.changeEmail,Change Your Primary Email Address
				account.changeUsername,Change Your Username
				account.notification,Modify Your Notification Settings
				home.newForYou,New Articles for You
				home.friendActivity,News from Your Social Circle
				feeds.worldNews,World News
				feeds.localNews,News in Your Local Area
				feeds.aroundTheWeb,Recommended from Around the Web
				feeds.editFeeds,Edit Your Feeds and Settings
				......................................................

				Once we have shipped our CSV formatted resource strings object off to the translators and they load the file into their translation management system to produce the translations and then provide us with the German translations in a new CSV file, we can import the translated strings from that CSV file using a reverse process as follows...

				CSV BACK TO RESOURCE STRINGS
				...................................................
				var resourceStrings = Uize.Data.Flatten.unflatten (
					Uize.Data.NameValueRecords.toHash (
						Uize.Data.Csv.from (csvText),
						0,
						1
					)
				);
				...................................................

			Unflattening a Flattened Object
				The =Uize.Data.Flatten= module provides the =Uize.Data.Flatten.unflatten= method to allow the flattening performed by the =Uize.Data.Flatten.flatten= method to be reversed.

				Using the =Uize.Data.Flatten.unflatten= method, a flattened object that was generated from a source object using the =Uize.Data.Flatten.flatten= method can be unflattened to produce an object with the contents of the original source object. Consider the following example...

				EXAMPLE
				...................................................................................................
				Uize.Data.Flatten.unflatten ({
					'animals.pets.dogs.smallBreeds':['West Highland White','Miniature Chihuahua','Teacup Poodle'],
					'animals.pets.dogs.largeBreeds':['Afghan','Great Dane','Irish Wolfhound','St. Bernard'],
					'animals.pets.cats':['Persian','Siamese','Hairless'],
					'animals.wildAnimals.dogs':['Coyote','Dingo'],
					'animals.wildAnimals.cats':['Bobcat','Cheetah','Leopard','Lion','Lynx','Mountain Lion','Tiger'],
					'animals.wildAnimals.other':['Aardvark','Elephant','Hedgehog','Opossum','Wildebeest','Zebra']
				});
				...................................................................................................

				In the above example, we are unflattening an object that contains a classification of animals, where the hierarchical classification information has been flattened into the key names using the =Uize.Data.Flatten.flatten= method with its default behavior of using the "." (period) character as a delimiter when generating key names from path segments. From the above statement, we get the following result...

				RESULT
				......................................................................................
				{
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
				}
				......................................................................................

			Advanced Features
				The =Uize.Data.Flatten= module offers a few advanced features to address less common situations.

				Using Custom Path Delimiter Strings
					In cases where the default "." (period) character path delimiter is not suitable, the =Uize.Data.Flatten= module allows a custom path delimiter string to be specified when flattening and unflattening objects.

					EXAMPLE
					............................
					Uize.Data.Flatten.flatten (
						{
							foo:{
								bar:{
									baz:{
										qux:1,
										hello:'world'
									}
								}
							}
						},
						'/'
					);
					............................

					In the above example, we are flattening the source object using the "/" (forward slash) character as a path delimiter, which produces the following result...

					RESULT
					..............................
					{
						'foo/bar/baz/qux':1,
						'foo/bar/baz/hello':'world'
					}
					..............................

					Now, because the resulting flattened object was produced using a custom path delimiter string, that same path delimiter string needs to be specified when later unflattening the flattened object, as in...

					EXAMPLE
					.................................
					Uize.Data.Flatten.unflatten (
						{
							'foo/bar/baz/qux':1,
							'foo/bar/baz/hello':'world'
						},
						'/'
					);
					.................................

					RESULT
					.........................
					{
						foo:{
							bar:{
								baz:{
									qux:1,
									hello:'world'
								}
							}
						}
					}
					.........................

					It's worth pointing out that if we didn't specify the custom path delimiter string that was originally used to flatten the object, the flattened object would not get unflattened correctly and would, in our example, just return an identical copy of the flattened object. The =Uize.Data.Flatten.unflatten= method would try to use the default "." (period) path delimiter string and wouldn't see any periods in the key names and so wouldn't reconstruct the hierarchical structure of the original object.

				Using Custom Key Serialization and Parsing Functions
					In cases where a simple string path delimiter is not adequate, the =Uize.Data.Flatten= module allows a custom path-to-key transformer function to be specified when flattening and unflattening objects.

					EXAMPLE
					........................................................
					Uize.Data.Flatten.flatten (
						{
							'foo.foo':{
								'bar:bar':{
									'baz|baz':{
										'"qux"':1,
										'\'hello\'':'world'
									}
								}
							}
						},
						function (_path) {return Uize.Json.to (_path,'mini')}
					);
					........................................................

					In the above example, the hierarchical object that we need to flatten contains all sorts of crazy characters in the names of properties. We can't use the default "." (period) character because there is property named "foo.foo". We can't specify a custom delimiter string of ":" or "|", nor of single or double quotes, because there are properties that contain those characters in their names. To resolve this dilemma, we instead specify a custom path-to-key transformer function that is using the =Uize.Json.to= method to serialize the path array to a JSON object, which produces the following output...

					RESULT
					....................................................................
					{
						'[\'foo.foo\',\'bar:bar\',\'baz|baz\',\'"qux"\']':1,
						'[\'foo.foo\',\'bar:bar\',\'baz|baz\',\'\\\'hello\\\'\']':'world'
					}
					....................................................................

					Using a custom path-to-key transformer function is a useful approach when you have no way of knowing or controlling the types of characters that may be contained in the names of properties in the hierarchical object you are trying to flatten.

					If there's no way of knowing what character (or series of characters) you can count upon as a reliable delimiter string, then the only truly robust way to serialize the property paths in the hierarchical object to keys in the flattened object is to serialize the paths to JSON format (or some other serialization that can support any arbitrary characters). Although the key names produced for the flattened object with such an approach are clumsier and less elegant, this is a robust approach to generating unique keys for the flattened object.

					To Unflatten, Specify a Parser / De-serializer
						Whereas, when `using custom path delimiter strings` to flatten and unflatten objects one only needs to make sure to use the same delimiter string in both directions, using the function approach requires one to specify a path-to-key serializer when flattening and a key-to-path parser / de-serializer when unflattening.

						So, for example, if we used a JSON serializer as the path-to-key transformer function when flattening a hierarchical object using the =Uize.Data.Flatten.flatten= method, then we would need to use a JSON parser as the key-to-path transformer function when unflattening the flattened object using the =Uize.Data.Flatten.unflatten= method.

						Consider the following example...

						EXAMPLE
						.......................................................................
						Uize.Data.Flatten.unflatten (
							{
								'[\'foo.foo\',\'bar:bar\',\'baz|baz\',\'"qux"\']':1,
								'[\'foo.foo\',\'bar:bar\',\'baz|baz\',\'\\\'hello\\\'\']':'world'
							},
							function (_path) {return Uize.Json.from (_path)}
						);
						.......................................................................

						RESULT
						...............................
						{
							'foo.foo':{
								'bar:bar':{
									'baz|baz':{
										'"qux"':1,
										'\'hello\'':'world'
									}
								}
							}
						},
						...............................

				Leaf Nodes
					By default, the =Uize.Data.Flatten.flatten= method includes only the leaf nodes of the hierarchical source object when producing the flattened version of that object.

					This is because the leaf nodes are all that are needed in order to re-constitute the original hierarchical source object from a flattened version of it, so including non-leaf nodes is redundant in this regard.

					The Definition of Leaf Nodes
						Technically, leaf nodes are defined as properties whose values are of any type other than plain object.

						This means that properties with the following types of values would be considered leaf nodes...

						- =arrays=
						- =functions=
						- =regular expressions=
						- =instances= (of any object type other than JavaScript's built-in =Object= object)
						- =strings=
						- =numbers= (including special number type values like =NaN=, =Infinity=, and =-Infinity=)
						- =booleans=
						- =undefined=
						- =null=

						Particularly as it relates to object type values (such as regular expressions, function references, instances of =Uize.Class= subclasses, etc.), this means that these values will not be traversed deeper - even if they contain custom properties. Any object value that is not a plain object (i.e. an instance of =Object=) will be treated as a leaf node value and not as a structure defining node.

					Including Non-leaf Nodes
						Non-leaf nodes of the source object can be included in the flattened object produced by the =Uize.Data.Flatten.flatten= method, by specifying the value =true= for the method's optional =includeNonLeafNodesBOOL= third argument.

						Consider the following example...

						EXAMPLE
						...............................................................
						Uize.Data.Flatten.flatten ({foo:{bar:{baz:{qux:1}}}},'.',true);
						...............................................................

						In the above example, if we didn't specify the value =true= for the =includeNonLeafNodesBOOL= argument, we would get the result ={'foo.bar.baz.qux':1}= since there is only this one leaf node in the source object. However, when we specify =true= for =includeNonLeafNodesBOOL=, then we get the following result...

						RESULT
						.............................
						{
							'foo':{bar:{baz:{qux:1}}},
							'foo.bar':{baz:{qux:1}},
							'foo.bar.baz':{qux:1},
							'foo.bar.baz.qux':1
						}
						.............................

						It should be pointed out that the various object values in the above object would contain shared references. So, for example, the value of the expression =result ['foo.bar.baz']= would be a reference to the same object as the expression =result ['foo.bar'].baz= or the expression =result.foo.bar.baz= - the ={qux:1}= object.

						Now, if you use the =Uize.keys= method on the above result, you get an array with dereferencing paths for all possible nodes in the hierarchical source object, as seen in the following example...

						EXAMPLE
						.................................................................
						Uize.keys (
							Uize.Data.Flatten.flatten ({foo:{bar:{baz:{qux:1}}}},'.',true)
						);
						.................................................................

						RESULT
						....................
						[
							'foo',
							'foo.bar',
							'foo.bar.baz',
							'foo.bar.baz.qux'
						]
						....................
*/

Uize.module ({
	name:'Uize.Data.Flatten',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,

			/*** Variables for Performance Optimization ***/
				_isPlainObject = Uize.isPlainObject,
				_isArray = Uize.isArray
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
			flatten:function (_tree,_pathToKey,_inclueNonLeafNodes,_allowArraysNodes) {
				_pathToKey = _pathToKey == _undefined
					? _pathToKeyPeriodDelimited
					: typeof _pathToKey == 'string'
						? _makeDelimiterBasedPathToKeyTransformer (_pathToKey)
						: _pathToKey
				;
				var _hash = {};
				function _processTreeNode (_treeNode,_path) {
					var _treeNodeIsPlainObject = _isPlainObject (_treeNode);
					if (_treeNodeIsPlainObject || (_allowArraysNodes && _isArray (_treeNode))) {
						if (_inclueNonLeafNodes && _path.length)
							_hash [_pathToKey (_path)] = _treeNode
						;
						if (_treeNodeIsPlainObject) {
							for (var _subNodeName in _treeNode)
								_processTreeNode (_treeNode [_subNodeName],_path.concat (_subNodeName))
							;
						} else {
							for (var _subNodeNo = -1, _treeNodeLength = _treeNode.length; ++_subNodeNo < _treeNodeLength;)
								_subNodeNo in _treeNode && _processTreeNode (_treeNode [_subNodeNo],_path.concat (_subNodeNo))
							;
						}
					} else {
						_hash [_pathToKey (_path)] = _treeNode;
					}
				}
				_processTreeNode (_tree,[]);
				return _hash;
				/*?
					Static Methods
						Uize.Data.Flatten.flatten
							Flattens the specified source object to produce a one-level-deep hash / lookup / dictionary object, where the key names of this hash object are generated from the path information of the corresponding properties in the source object.

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
								In the most basic usage, a hierarchical object can be flattened using the default "." (period) character as a path delimiter when generating key names for the flattened object.

								SYNTAX
								.....................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ);
								.....................................................

								EXAMPLE
								............................
								Uize.Data.Flatten.flatten ({
									foo:{
										bar:{
											baz:{
												qux:1,
												hello:'world'
											}
										}
									}
								});
								............................

								RESULT
								..............................
								{
									'foo.bar.baz.qux':1,
									'foo.bar.baz.hello':'world'
								}
								..............................

								NOTES
								- see how to `unflatten a source object, using the default key-to-path transformer`

							Flatten a Source Object, Specifying a Path Delimiter String
								In cases where the default "." (period) character path delimiter is not suitable, a custom path delimiter string can be specified using the optional =pathDelimiterSTR= second argument.

								SYNTAX
								......................................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ,pathDelimiterSTR);
								......................................................................

								EXAMPLE
								............................
								Uize.Data.Flatten.flatten (
									{
										foo:{
											bar:{
												baz:{
													qux:1,
													hello:'world'
												}
											}
										}
									},
									'/'
								);
								............................

								RESULT
								..............................
								{
									'foo/bar/baz/qux':1,
									'foo/bar/baz/hello':'world'
								}
								..............................

								NOTES
								- see how to `unflatten a source object, specifying a path delimiter string`

							Flatten a Source Object, Specifying a Path-to-key Transformer Function
								In cases where a simple string path delimiter is not adequate, a custom path-to-key transformer function can be specified using the optional =pathDelimiterSTR= second argument in place of the =pathDelimiterSTR= argument.

								SYNTAX
								..............................................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (sourceOBJ,pathToKeyTransformerFUNC);
								..............................................................................

								EXAMPLE
								........................................................
								Uize.Data.Flatten.flatten (
									{
										'foo.bar':{
											'baz.qux':1
										}
									},
									function (_path) {return Uize.Json.to (_path,'mini')}
								);
								........................................................

								In the above example, we are specifying a custom path-to-key transformer function that is using the =Uize.Json.to= method to serialize the path array to a JSON object, which produces the following output...

								RESULT
								................................
								{
									'[\'foo.bar\',\'baz.qux\']':1
								}
								................................

								This is a useful approach for dealing with the possibility that property names in the unflattened source object may contain the very string delimiter that you decide to specify for the =pathDelimiterSTR= parameter. In this case, the property names contain periods, which conflicts with the default delimiter used by the =Uize.Data.Flatten.flatten= method. If we just went ahead and used the default behavior in this case, we would generate a flattened object that couldn't be converted back to the original object using the =Uize.Data.Flatten.unflatten= method, since we would have lost important path information.

								Although the key names produced for the flattened object, when using a JSON serialization of the path array, are clumsier and less elegant, this is a robust approach to generating unique keys that can support any arbitrary characters in the names of properties in the source object.

								NOTES
								- see how to `unflatten a source object, specifying a key-to-path transformer function`

							Flatten a Source Object, Including Non-leaf Nodes in the Flattened Object
								In special cases, non-leaf nodes of the source object can be included in the flattened object by specifying the value =true= for the optional =includeNonLeafNodesBOOL= third argument.

								SYNTAX
								................................................................
								flattenedOBJ = Uize.Data.Flatten.flatten (
									sourceOBJ,pathToKeyTransformerANYTYPE,includeNonLeafNodesBOOL
								);
								................................................................

								By default, the =Uize.Data.Flatten.flatten= method only includes leaf nodes in the flattened object that it produces, since the leaf nodes are all that are needed in order to reconstitute the original source object. Leaf nodes are the deepest properties in the source object (see `The Definition of Leaf Nodes` for a more technical definition).

								There are some special circumstances in which it is useful to include non-leaf nodes. Consider the following example...

								EXAMPLE
								............................................................................................
								Uize.keys (
									Uize.Data.Flatten.flatten (
										{
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
										},
										'.',
										true
									)
								);
								............................................................................................

								In the above example, we are creating an array that contains all the dereferencing paths for all nodes from a hierarchical object that contains a classification of animals.

								By specifying the value =true= for the optional =includeNonLeafNodesBOOL= parameter, the =Uize.Data.Flatten.flatten= method returns an object with additional keys for the =animals=, =animals.pets=, =animals.pets.dogs=, and =animals.wildAnimals= non-leaf nodes of the source object. We then use the =Uize.keys= method to obtain an array of just the keys from the flattened object, and this gives us the full set of dereferencing paths for all nodes of the original source object, producing the following array result...

								RESULT
								...................................
								[
									'animals',
									'animals.pets',
									'animals.pets.dogs',
									'animals.pets.dogs.smallBreeds',
									'animals.pets.dogs.largeBreeds',
									'animals.pets.cats',
									'animals.wildAnimals',
									'animals.wildAnimals.dogs',
									'animals.wildAnimals.cats',
									'animals.wildAnimals.other'
								}
								...................................

							NOTES
							- compare to the companion =Uize.Data.Flatten.unflatten= static method
				*/
			},

			unflatten:function (_hash,_keyToPath,_allowArraysNodes) {
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
							_parentParentNode = _tree,
							_parentNodeName = 'root'
						;
						++_pathPartNo < _pathLength;
					) {
						var
							_pathPart = _path [_pathPartNo],
							_parentNode =
								_parentParentNode [_parentNodeName] ||
								(
									_parentParentNode [_parentNodeName] = _allowArraysNodes && typeof _pathPart == 'number'
										? []
										: {}
								)
						;
						if (_pathPartNo < _pathLength - 1) {
							_parentParentNode = _parentNode;
							_parentNodeName = _pathPart;
						} else {
							_parentNode [_pathPart] = _hash [_key];
						}
					}
				}
				return _tree.root || {};
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
								In the most basic usage, an object that was flattened, using the "." (period) character as a path delimiter when generating key names for the flattened object, can unflattened by specifying just the flattened object using the =sourceOBJ= argument.

								SYNTAX
								..........................................................
								hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ);
								..........................................................

								EXAMPLE
								..............................
								Uize.Data.Flatten.unflatten ({
									'foo.bar.baz.qux':1,
									'foo.bar.baz.hello':'world'
								});
								..............................

								RESULT
								.........................
								{
									foo:{
										bar:{
											baz:{
												qux:1,
												hello:'world'
											}
										}
									}
								}
								.........................

								NOTES
								- see how to `flatten a source object, using the default path-to-key transformer`

							Unflatten a Source Object, Specifying a Path Delimiter String
								In cases where a flattened object was created using a path delimiter string other than the default "." (period) character, such a flattened object can be unflattened by specifying the custom path delimiter string using the optional =pathDelimiterSTR= second argument.

								SYNTAX
								...........................................................................
								hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ,pathDelimiterSTR);
								...........................................................................

								EXAMPLE
								.................................
								Uize.Data.Flatten.unflatten (
									{
										'foo/bar/baz/qux':1,
										'foo/bar/baz/hello':'world'
									}
									'/'
								);
								.................................

								RESULT
								.........................
								{
									foo:{
										bar:{
											baz:{
												qux:1,
												hello:'world'
											}
										}
									}
								}
								.........................

								NOTES
								- see how to `flatten a source object, specifying a path delimiter string`

							Unflatten a Source Object, Specifying a Key-to-path Transformer Function
								In cases where a flattened object was created using a path-to-key transformer function, such a flattened object can be unflattened by specifying a key-to-path transformer function, using the optional =keyToPathTransformerFUNC= second argument, that has the reverse effect of the path-to-key transformer function used when creating the flattened object.

								SYNTAX
								...................................................................................
								hierarchicalOBJ = Uize.Data.Flatten.unflatten (sourceOBJ,keyToPathTransformerFUNC);
								...................................................................................

								EXAMPLE
								.................................................
								Uize.Data.Flatten.unflatten (
									{
										'[\'foo.bar\',\'baz.qux\']':1
									},
									function (_key) {return Uize.Json.from (_key)}
								);
								.................................................

								In the above example, we are unflattening an object that was flattened by specifying a custom path-to-key transformer function that JSON serialized the property paths of the source object in order to generate the keys of the flattened object. Because of this, in order to unflatten this object we need to specify a key-to-path transformer function that has the reverse effect. The function that we have specified performs a JSON parse of a key using the =Uize.Json.from= method in order to produce a path array.

								The above code produces the following output...

								RESULT
								.................
								{
									'foo.bar':{
										'baz.qux':1
									}
								}
								.................

								NOTES
								- see how to `flatten a source object, specifying a path-to-key transformer function`

							NOTES
							- compare to the companion =Uize.Data.Flatten.flatten= static method
				*/
			}
		});
	}
});
