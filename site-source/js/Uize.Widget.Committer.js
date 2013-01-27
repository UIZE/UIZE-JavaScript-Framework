/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Committer Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Committer= class provides a way to interface between a configurable set of state properties, on one or more instance, and other code.

		*DEVELOPERS:* `Chris van Rensburg`, `Tim Carter`

		In a Nutshell
			The =Uize.Widget.Committer= class provides a convenient way to interface between a set of properties and other code.

			Watched Properties
				An instance of this class can be wired up to watch on any number of properties, as specified by the =watchedProperties= state property.

				In a common case, the set of properties being watched might be the =value= state properties of a bunch of form input widgets. The committer instance acts as a conduit or interface between the watched properties and the code that cares about watching them.

			Convenient Buttons
				The values of the watched properties can be committed to the watching code by the user clicking on a =commit button=, or by the =commit= instance method being called. Additionally, optional =clearAll=, =restoreInitial=, and =restorePrevious= buttons are supported.

			Auto-commit
				An auto-commit behavior allows uncommitted values to be automatically committed after a configurable period of inactivity since the last modification, as specified by the =autoCommitDelay= state property.

			Logical State Summary
				For the convenience of the watching code, a full complement of read-only boolean state properties provides a logical state summary of the watched properties.

				This state summary is provided through the =allClear=, =allValid=, =anyNotInitial=, =anyNotCommitted=, and =readyToCommit= boolean state properties, and the =committedValues=, =initialValues=, and =uncommittedValues= object state properties.
*/

Uize.module ({
	name:'Uize.Widget.Committer',
	required:'Uize.Widget.Button',
	builder:function  (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_null = null,
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._autoCommitTimeout;

						/*** add the commit button ***/
							_this._commitButton = _this._addChildButton ('commit',function () {_this.commit ()});
								/*?
									Child Widgets
										commit button
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will commit the values of the watched properties.

											The markup for this button is optional. If no markup is present, the action of the button can still be invoked programmatically by calling the =commit= instance method.

											NOTES
											- see the related =commit= instance method
								*/

						/*** add the clearAll, restoreInitial, and restorePrevious buttons ***/
							_this._clearAllButton =
								_this._addChildButton ('clearAll',function () {_this.clearAll()})
								/*?
									Child Widgets
										clearAll
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will clear the values of all the watched properties by setting them to =''= (empty string).

											The markup for this button is optional. The enabled state of this button is managed by the =Uize.Widget.Committer= class, so that it is disabled whenever the values of all watched properties are empty (ie. when the value of the =allClear= state property is =true= and clicking this button would have no effect).

											NOTES
											- see the related =allClear= state property
								*/
							;
							_this._restoreInitialButton =
								_this._addChildButton ('restoreInitial',function () {_this.restoreInitial()})
								/*?
									Child Widgets
										restoreInitial
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will restore the values of all the watched properties to their initial state (ie. before a =Uize.Widget.Committer= instance is wired up).

											The markup for this button is optional. The enabled state of this button is managed by the =Uize.Widget.Committer= class, so that it is disabled whenever the values of all watched properties are at their initial state (ie. when the value of the =anyNotInitial= state property is =false= and clicking this button would have no effect). This could be right after wiring the instance, or right after using the =restoreInitial= button to retore the values of the watched properties to their initial state.

											NOTES
											- see the related =anyNotInitial= state property
								*/
							;
							_this._restorePreviousButton =
								_this._addChildButton ('restorePrevious',function () {_this.restorePrevious()})
								/*?
									Child Widgets
										restorePrevious
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will restore the values of all the watched properties to their previous committed state (ie. before any of the previously committed values were subsequently modified).

											The markup for this button is optional. The enabled state of this button is managed by the =Uize.Widget.Committer= class, so that it is disabled whenever there are no values to commit (ie. when the value of the =anyNotCommitted= state property is =false= and clicking this button would have no effect). This could be right after wiring the instance, right after using the =restorePrevious= button to retore the values of the watched properties to their previous committed state, or after editing the values of the watched properties in such a way that they return to their previously committed state.

											NOTES
											- see the related =anyNotCommitted= state property
								*/
							;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

			_classPrototype._clearAutoCommitTimeout = function () {
				if (this._autoCommitTimeout) clearTimeout (this._autoCommitTimeout);
			};

			_classPrototype._setAllValues = function (_valuesSource) {
				var
					_this = this,
					_watchedProperties = _this._watchedProperties,
					_committedValues = _this._committedValues,
					_newValues = _this.get (_valuesSource + 'Values'),
					_undefined
				;
				for (var _watchedPropertyAlias in _committedValues) {
					var _watchedPropertyProfile = _watchedProperties [_watchedPropertyAlias];
					_watchedPropertyProfile.instance.set (
						_watchedPropertyProfile.name,
						_newValues && _newValues [_watchedPropertyAlias] != _undefined ? _newValues [_watchedPropertyAlias] : ''
					);
				}
			};

			_classPrototype._updateSummaryStateProperties = function () {
				var
					_this = this,
					_allValid = _true,
					_allClear = _true,
					_anyNotCommitted = _false,
					_anyNotInitial = _false,
					_committedValues = _this._committedValues,
					_uncommittedValues = _this._uncommittedValues,
					_initialValues = _this._initialValues,
					_watchedProperties = _this._watchedProperties
				;
				for (var _watchedPropertyAlias in _committedValues) {
					var _uncommittedValue = _uncommittedValues [_watchedPropertyAlias];
					if (!_anyNotCommitted)
						_anyNotCommitted = _uncommittedValue !== _committedValues [_watchedPropertyAlias]
					;
					if (!_anyNotInitial)
						_anyNotInitial = _uncommittedValue !== _initialValues [_watchedPropertyAlias]
					;
					if (_allClear)
						_allClear =  _uncommittedValue == ''
					;
					if (_allValid)
						_allValid = _watchedProperties [_watchedPropertyAlias].instance.get ('isValid') === _true
					;
				}
				_this.set ({
					_allClear:_allClear,
					_allValid:_allValid,
					_anyNotCommitted:_anyNotCommitted,
					_anyNotInitial:_anyNotInitial,
					_readyToCommit:_anyNotCommitted && _allValid
				});
			};

			_classPrototype._watchProperty = function (_watchedPropertyAlias,_watchedPropertyProfile) {
				var
					_this = this,
					_watchedPropertyInstance = _watchedPropertyProfile.instance,
					_watchedPropertyName = _watchedPropertyProfile.name
				;

				// any events that get wired here need to be unwired in _classPrototype.removeWatchedProperties.
				_watchedPropertyInstance.wire (
					'Changed.' + _watchedPropertyName,
					function () {
						_this._uncommittedValues [_watchedPropertyAlias] =
							_watchedPropertyInstance.get (_watchedPropertyName)
						;
						_this.fire ('Changed.uncommittedValues');
						_this._updateSummaryStateProperties ();

						/*** handling for the auto-commit behavior ***/
							if (_this._readyToCommit && _this._autoCommitDelay) {
								_this._clearAutoCommitTimeout ();
								_this._autoCommitTimeout = setTimeout (
									function () {_this.commit ()},
									_this._autoCommitDelay
								)
							}
					}
				);
				_watchedPropertyInstance.wire('Changed.isValid', function() { _this._updateSummaryStateProperties () });

				// here is where we would add the profile to the watchedProperties property, but since this method is called by the onChange handler to watchedProperties, then it's already there. And, in the odd case that it's not, then the caller can add the profile itself.
			};

		/*** Public Instance Methods ***/
			_classPrototype.clearAll = function() {
				this._setAllValues ('clear')
			};

			_classPrototype.commit = function () {
				var _this = this;
				_this._clearAutoCommitTimeout ();
				if (_this._readyToCommit) {
					_this.set ({_committedValues:Uize.copyInto ({},_this._uncommittedValues)});
					_this.fire ('Commit');
					/*?
						Instance Events
							Commit
								Fired whenever uncommitted values are successfully committed.

								This event will be fired regardless of how the uncommitted values are committed - whether programmatically by calling the =commit= instance method, or by the user clicking the =commit button=.
					*/
					_this._updateSummaryStateProperties ();
				}
				/*?
					Instance Methods
						commit
							Lets you programmatically commit the uncommitted values of the watched properties.

							SYNTAX
							......................
							myCommitter.commit ();
							......................

							Calling the =commit= instance method has the same effect as the user clicking the =commit button=. Uncommitted values will only be successfully committed if they are all valid, as indicated by the =allValid= state property. Successfully committing values will result in the =Commit= instance event being fired. After uncommitted values are successfully committed, the values of the =uncommittedValues= and =committedValues= state properties will be identical.

							NOTES
							- see the related =commit button= child widget
				*/
			};

			_classPrototype.addWatchedProperties = function (_propertiesToWatch) {
				var
					_currIdx = -1,
					_propertiesToWatchLength = _propertiesToWatch ? _propertiesToWatch.length : 0,
					_this = this,
					_committedValues = {},
					_uncommittedValues = {},
					_initialValues = {},
					_propertiesAdded = {}
				;

				for (;++_currIdx < _propertiesToWatchLength;) {
					var
						_propertyToWatch = _propertiesToWatch [_currIdx]
					;
					if (_propertyToWatch) {
						var
							_alias = _propertyToWatch.alias,
							_name = _propertyToWatch.name,
							_instance = _propertyToWatch.instance,
							_watchedPropertyProfile = {instance:_instance, name:_name}
						;
						_propertiesAdded [_alias] = _watchedPropertyProfile;
						_this._watchProperty (_alias, _watchedPropertyProfile);
						_committedValues [_alias] = _uncommittedValues [_alias] = _initialValues [_alias] =
							_instance.get (_name)
						;
					}
				}

				// don't let the onChange handler fire
				Uize.copyInto (_this._watchedProperties || (_this._watchedProperties = {}), _propertiesAdded);

				_this.set ({
					_committedValues:Uize.copyInto (_this._committedValues, _committedValues),
					_uncommittedValues:Uize.copyInto (_this._uncommittedValues, _uncommittedValues),
					_initialValues:Uize.copyInto (_this._initialValues, _initialValues)
				});
				_this._updateSummaryStateProperties ();

				_this.fire ({
					name:'Watched Properties Added',
					properties:_propertiesAdded
				});

				/*?
					Instance Methods
						addWatchedProperties
							Adds a watched property to the =watchedProperties= property of the instance.

							SYNTAX
							......................................
							myCommitter.addWatchedProperties (
								[
									{
										alias:'aliasString',
										instance:'instanceObject',
										name:'nameString'
									}
								]
							);
							......................................

							PARAMS
							....................................................................................................................
							_propertiesToWatch:_propertiesARR			// an array whose elements represent the widgets and properties to watch

							The elements of the _propertiesToWatch array should be objects of the following format:
							{
								alias:'aliasSTR'				// a string, to be used as a key in the =_watchedProperties= hash
								instance:'instanceOBJ'			// a Uize instance object containing the property to be watched
								name:'nameSTR'					// the public property alias of the property to be watched
							}
							....................................................................................................................

							Adding a new property directly to the =watchedProperties= object will not trigger the methods that wire up the events that do the watching. Similarly, using the =set= method to assign a new object (with the new properties to watch) to the =watchedProperties= property will not unwire the aforementioned events from the previous object.

				*/
			};

			_classPrototype.removeWatchedProperties = function (_watchedPropertyAliasesToRemove) {
				var
					_currIdx = -1,
					_propertiesRemoved = {},
					_watchedPropertyAliasesToRemoveLength = _watchedPropertyAliasesToRemove ? _watchedPropertyAliasesToRemove.length : 0,
					_this = this,
					_committedValues = _this._committedValues,
					_initialValues = _this._initialValues,
					_uncommittedValues = _this._uncommittedValues,
					_watchedProperties = _this._watchedProperties
				;

				for (;++_currIdx < _watchedPropertyAliasesToRemoveLength;) {
					var
						_watchedPropertyAlias = _watchedPropertyAliasesToRemove [_currIdx],
						_watchedPropertyProfile = _watchedProperties [_watchedPropertyAlias]
					;

					if (_watchedPropertyProfile) {
						var _watchedPropertyInstance = _watchedPropertyProfile.instance;

						// any events that are wired to the watched property instance in _classPrototype._watchProperty needs to be unwired here.
						_watchedPropertyInstance.unwire ('Changed.isValid');
						_watchedPropertyInstance.unwire ('Changed.' + _watchedPropertyProfile.name);

						delete _watchedProperties [_watchedPropertyAlias];
						delete _committedValues [_watchedPropertyAlias];
						delete _uncommittedValues [_watchedPropertyAlias];
						delete _initialValues [_watchedPropertyAlias];

						_propertiesRemoved [_watchedPropertyAlias] = _watchedPropertyProfile;
					}
				}

				_this._updateSummaryStateProperties ();

				_this.fire ({
					name:'Watched Properties Removed',
					properties:_propertiesRemoved
				});

				/*?
					Instance Methods
						removeWatchedProperties
							Removes the watched properties with aliases matching the values passed into the method from the =watchedProperties= property.

							SYNTAX
							..............................................................
							myCommitter.removeWatchedProperties (['alias1',...,'aliasN']);
							..............................................................

							PARAMS
							..................................................................
							_watchedPropertyAliasesToRemove:_watchedPropertyAliasesToRemoveARR			// an array of strings where the elements are aliases that denote which property profiles should be deleted from the =watchedProperties= object
							..................................................................

							Removing watched properties from the =watchedProperties= object directly will not unwire any events that were added by the committer. Calling this method will.
				*/
			};

			_classPrototype.restoreInitial = function() {
				this._setAllValues ('initial')
			};

			_classPrototype.restorePrevious = function() {
				this._setAllValues ('committed')
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_allClear:{
					name:'allClear',
					onChange:function () {
						this._clearAllButton.set ({enabled:this._allClear ? _false : 'inherit'});
					},
					value:_false
					/*?
						State Properties
							allClear
								A read-only boolean, indicating whether or not all the watched properties are clear (ie. set to =''=).

								The value of this property is automatically managed by the =Uize.Widget.Committer= class and is updated as the values of the watched properties change.

								NOTES
								- this property is read-only
								- the initial value is =false=
					*/
				},
				_allValid:{
					name:'allValid',
					value:_false
					/*?
						State Properties
							allValid
								A read-only boolean, indicating whether or not all the watched properties have valid values.

								The value of this property is automatically managed by the =Uize.Widget.Committer= class and is updated as the values of the watched properties change. The value is determined by the current values of the watched properties - regardless of whether or not those values are committed yet.

								NOTES
								- this property is read-only
								- the initial value is =false=
					*/
				},
				_anyNotInitial:{
					name:'anyNotInitial',
					onChange:function () {
						this._restoreInitialButton.set ({enabled:this._anyNotInitial ? 'inherit' : _false});
					},
					value:_false
					/*?
						State Properties
							anyNotInitial
								A read-only boolean, indicating whether or not the values of any of the watched properties are not their initial value (as stored in the =initialValues= state property).

								The value of this property is automatically managed by the =Uize.Widget.Committer= class and is updated as the values of the watched properties change.

								NOTES
								- this property is read-only
								- see the related =initialValues= state property
								- the initial value is =false=
					*/
				},
				_anyNotCommitted:{
					name:'anyNotCommitted',
					onChange:function () {
						this._restorePreviousButton.set ({enabled:this._anyNotCommitted ? 'inherit' : _false});
					},
					value:_false
					/*?
						State Properties
							anyNotCommitted
								A read-only boolean, indicating whether or not the values of any of the watched properties have been changed from their previous state and have not yet been committed.

								The value of this property is automatically managed by the =Uize.Widget.Committer= class and is updated as the values of the watched properties change. The value of this property is =true= whenever there is a difference between the values of the =committedValues= and =uncommittedValues= state properties.

								NOTES
								- this property is read-only
								- the initial value is =false=
					*/
				},
				_autoCommitDelay:'autoCommitDelay',
					/*?
						State Properties
							autoCommitDelay
								An integer, specifying the amount of time (measured in milliseconds), after uncommited values become ready to commit (ie. the value of =readyToCommit= becomes =true=) and are no longer being modified, before those uncommitted values are automaticlly committed.

								When the value of this property is set to =null=, =undefined=, =0=, or =false=, then the auto-commit feature will be disabled.

								NOTES
								- the initial value is =undefined=
					*/
				_committedValues:{
					name:'committedValues',
					value:{}
					/*?
						State Properties
							committedValues
								A read-only object, representing the committed values for all the watched properties.

								The value of this property is automatically set whenever the value of the =watchedProperties= state property is changed. The =committedValues= object will contain a property for each watched property.

								The value of this property is automatically managed by the =Uize.Widget.Committer= class and is updated as the uncommitted values of the watched properties (as stored in the =uncommittedValues= state property) are committed by calling the =commit= instance method or by the user clicking the =commit button=.

								NOTES
								- this property is read-only
								- see the related =uncommittedValues= and =watchedProperties= state properties
								- the initial value is ={}= (an empty object)
					*/
				},
				_initialValues:{
					name:'initialValues',
					value:{}
					/*?
						State Properties
							initialValues
								A read-only object, representing the initial values for all the watched properties.

								The value of this property is automatically set whenever the value of the =watchedProperties= state property is changed. The =initialValues= object will contain a property for each watched property.

								NOTES
								- see the related =committedValues= and =uncommittedValues= state properties
								- the initial value is ={}= (an empty object)
					*/
				},
				_readyToCommit:{
					name:'readyToCommit',
					onChange:function () {
						this._commitButton.set ({enabled:this._readyToCommit ? 'inherit' : _false});
					},
					value:_false
					/*?
						State Properties
							readyToCommit
								A read-only boolean, indicating whether or not there are uncommitted values for watched properties that are ready to commit.

								The value of this property is automatically managed by the =Uize.Widget.Committer= class and is updated as the values of the watched properties change. The value of this property will be =true= if there are any uncommitted values (ie. =anyNotCommitted= is set to =true=) and the values of all watched properties are valid (ie. =allValid= is set to =true=).

								NOTES
								- this property is read-only
								- see the related =anyNotCommitted= and =allValid= state properties
								- the initial value is =false=
					*/
				},
				_uncommittedValues:{
					name:'uncommittedValues',
					value:{}
					/*?
						State Properties
							uncommittedValues
								A read-only object, representing the current values of the watched properties.

								The value of this property is automatically set whenever the value of the =watchedProperties= state property is changed. The =uncommittedValues= object will contain a property for each watched property.

								The value of this property is automatically managed by the =Uize.Widget.Committer= class and is updated as the values of the watched properties change. The value of this property represents all the current values of the watched properties and may be identical to the values of the =initialValues= and =committedValues= state properties.

								The value of this property will be identical to that of the =initialValues= state property immediately after the value of =watchedProperties= is set and before the values of the watched properties have been modified, or right after using the =restoreInitial= button to retore the values of the watched properties. Its value will be identical to that of the =committedValues= state property immediately after =watchedProperties= is set and before the values of the watched properties have been modified, or right after successfully using the =commit button= or =commit= instance method to commit the uncommited values.

								NOTES
								- this property is read-only
								- see the related =committedValues= and =watchedProperties= state properties
								- the initial value is ={}= (an empty object)
					*/
				},
				_watchedProperties:{
					name:'watchedProperties',
					onChange:function () {
						var
							_this = this,
							_watchedProperties = _this._watchedProperties,
							_committedValues = {},
							_uncommittedValues = {},
							_initialValues = {}
						;
						if (_watchedProperties)
							for (var _watchedPropertyAlias in _watchedProperties) {
								var _watchedPropertyProfile = _watchedProperties [_watchedPropertyAlias];
								_committedValues [_watchedPropertyAlias] =
								_uncommittedValues [_watchedPropertyAlias] =
								_initialValues [_watchedPropertyAlias] =
									_watchedPropertyProfile.instance.get (_watchedPropertyProfile.name)
								;
								_this._watchProperty (_watchedPropertyAlias,_watchedPropertyProfile);
							}

						_this.set ({
							_committedValues:_committedValues,
							_initialValues:_initialValues,
							_uncommittedValues:_uncommittedValues
						});
						_this._updateSummaryStateProperties ();
					}
					/*?
						State Properties
							watchedProperties
								An object, specifying the properties that should be watched by the instance.

								The value of the =watchedProperties= property should be an object of the form...

								........................................
								{
									watchedProperty1Alias:{
										instance:watchedProperty1Instance,
										name:'watchedProperty1Name'
									},
									... ... ...
									... ... ...
									... ... ...
									watchedPropertyNAlias:{
										instance:watchedPropertyNInstance,
										name:'watchedPropertyNName'
									}
								}
								........................................

								Each property of the =watchedProperties= object provides a profile for a watched property, where the property name is an alias for the watched property, and where the property value is an object identifying the property. The object identifying a watched property should contain an "instance" property, identifying the instance (of a =Uize.Class= subclass) to which the property belongs, and a "name" property, identifying the name of the state property to watch.

								NOTES
								- see the related =committedValues= and =uncommittedValues= state properties
								- the initial value is =undefined=
					*/
				}
			});

		return _class;
	}
});

