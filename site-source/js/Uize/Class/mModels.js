/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Class.mModels Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 5
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Class.mModels= mixin implements features to provide a declarative approach to adding and binding models to a =Uize.Class= subclass.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		Use Cases
			The cases in which you would want to use the =Uize.Class.mModels= minin are...

			A class model with sub-models
				.

				NOTES
				- Creating sub-models from state
				- Binding state of parent to state of sub-models
				- Wiring sub-model events

			A class that takes a model as state
				.

				NOTES
				- Parent will need to be able to pass model to class
				- Class will bind state of itself to state of passed model
				- Class will wire events on passed model

			A class that takes a model as state, but will create one if not passed
				.

				NOTES
				- Parent will need to be able to pass model to class
				- Class will also create model, but only if model was not passed at time of construction
				- Class will bind state of itself to state of passed model
				- Class will wire events on passed model
*/

Uize.module ({
	name:'Uize.Class.mModels',
	required:[
		'Uize.Class.mChildObjectBindings',
		'Uize.Class.mDeclarativeChildObjects',
		'Uize.Class.mChildObjectEventBindings'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_null = null,

				_Uize = Uize,
				_Uize_Class = _Uize.Class,

				_modelsInstanceProperty = 'models',
				_modelsStateProperty = 'models',
				_addedModelsInstanceProperty = 'addedModels',
				_addMethod = 'addModel'
		;

		return function (_class) {
			_class.declare ({
				mixins:[
					_Uize_Class.mChildObjectBindings,
					_Uize_Class.mDeclarativeChildObjects,
					_Uize_Class.mChildObjectEventBindings
				],

				stateProperties:_Uize.pairUp(
					_modelsStateProperty,
					{
						name:_modelsStateProperty,
						conformer:function (_modelsData) {
							var
								m = this,
								_models = m[_modelsInstanceProperty]
							;
							if (_modelsData) {
								var _unappliedModelsProperties = this.mModels_unappliedModelsProperties;

								for (var _modelName in _modelsData) {
									var
										_modelProperties = _modelsData[_modelName],
										_model = _models[_modelName]
									;

									if (_Uize.isInstance(_modelProperties)) { // support passing an actual model instance
										m.addModel(_modelName, _modelProperties);
									}
									else
										_model
											? _model.set(_modelProperties) // update already existing model
											: _unappliedModelsProperties[_modelName] = _modelProperties // otherwise set unapplied data to be applied during addModel
									;
								}
							}
							return _models;
						}
						/*?
							State Properties
								models ~~ models State Property
									A special state property that provides a way to distribute model properties to any or all of the class instance's models, or even models of the class instance's models - all the way down to the deepest models in the class instance's model tree.

									NOTES
									- see also the companion `model instance property`
						*/
					}
				),

				alphastructor: function () {
					var m = this;

					/*** Private Instance Properties ***/
						m.mModels_unappliedModelsProperties = {};

					/*** Public Instance Properties ***/
						m[_modelsInstanceProperty] = {};
							/*?
								Instance Properties
									models ~~ model Instance Property
										An object, each of whose properties is a reference to one of a class instance's models.

										For example, an instance of the =Uize.Widget.SlideShow= class assigned to the variable =mySlideShow= may have models that can be referenced as follows...

										.............................
										mySlideShow.models.images
										.............................

										Don't Directly Modify the models Object
											The contents of the =models= object is managed by the various instance methods of the =Uize.Class.mModels= class mix-in, such as the =addModel= and =removeModel= methods.

											One should not directly modify the contents of the =model= object, but should only do this through the model management methods.

										The Special model state Property
											The =model= instance property has a companion state property of the same name, but which has a special behavior.

											The `model state property` provides a convenient way to distribute model properties to any or all of a class instance's models.

										NOTES
										- the =model= object is read-only - its contents should not be directly modified
										- see also the special `model state property`
							*/

					m[_addedModelsInstanceProperty] = new _Uize.Class;
						/*?
							Instance Properties
								addedModels ~~ addedModels Instance Property
									A =Uize.Class= instance whose state properties reflect whether or not models by the same name has been added.

									You can use the condition system methods like =isMet=, =once=, and =whenver= on =addedModels= to determine if and when a model has been added to the class instance.

									NOTES
									- the =addedModels= object is read-only - its state should not be directly modified
									- see also the related =models= instance property

						*/
				},

				instanceMethods:_Uize.copyInto(
					_Uize.pairUp(
						_addMethod,
						function(_modelName, _modelInstanceOrClass, _properties) {
							_properties || (_properties = {});
							_modelName || (_modelName = _properties.name);

							var
								m = this,
								_models = m[_modelsInstanceProperty],
								_model = _models[_modelName]
							;

							if (_model && _model != _modelInstanceOrClass) {
								m.removeModel(_model);
								_model = _null;
							}

							if (!_model) {
								/*** apply unapplied data for child (set through children state property) ***/
									var
										_unappliedModelsProperties = m.mModels_unappliedModelsProperties,
										_unappliedPropertiesForModel = _unappliedModelsProperties [_modelName]
									;

									if (_unappliedPropertiesForModel) {
										_properties = _Uize.copy (_properties, _unappliedPropertiesForModel);
										delete _unappliedModelsProperties [_modelName];
									}

								_model = _Uize.isInstance(_modelInstanceOrClass) ? _modelInstanceOrClass : _null;
								_model && _model.set(_properties);
								_model = _models[_modelName] = _model || new _modelInstanceOrClass(_properties);
								m[_addedModelsInstanceProperty].met(_modelName);
							}

							return _model;
								/*?
									Instance Methods
										addModel
											The =addModel= method lets you add a =Uize.Class= model object to an existing =Uize.Class= subclass.

											SYNTAX
											..................................................................
											modelOBJ = myClass.addModel (modelNameSTR, modelClassOBJ, modelPropertiesOBJ);
											..................................................................

											VARIATION
											............................................................................
											modelOBJ = myClass.addModel (modelNameSTR, modelClassOBJ);
											............................................................................

											The =modelPropertiesOBJ= parameter is optional and can be omitted when the default property values for a model class are sufficient, or when the properties will be set to the desired values at a later stage.

											NOTES
											- returns a reference to the model instance that was added
											- a state property matching the child widget name is marked as *met* in the =addedModels= instance property
											- the value of the =modelNameSTR= can be =null=, =undefined= or =''= if a value is specified for the =name= property in the =modelPropertiesOBJ= parameter
											- see also the =removeModel= instance method, and the `model instance property`
								*/
						}
					),
					{
						removeModel:function (_modelNameOrInstance) {
							var
								m = this,
								_models = m[_modelsInstanceProperty],
								_modelNameToRemove = _modelNameOrInstance,
								_modelToRemove
							;

							if (_Uize.isInstance(_modelNameToRemove)) {
								for (var _modelName in _models) {
									var _model = _models[_modelName];

									if (_model == _modelNameOrInstance) {
										_modelToRemove = _model;
										_modelNameToRemove = _modelName;
									}
								}
							}
							else
								_modelToRemove = _models[_modelNameToRemove];

							if (_modelToRemove) {
								delete _models [_modelNameToRemove];
								m[_addedModelsInstanceProperty].unmet (_modelNameToRemove);
							}
							/*?
								Instance Methods
									removeChild
										The =removeChild= instance method lets you remove a child widget from a widget.

										SYNTAX
										...........................................
										myWidget.removeChild (childWidgetSTRorOBJ);
										...........................................

										When using this method, the child widget to remove can be specified by its name, or by an object reference to it.

										NOTES
										- a state property matching the model name is marked as *unmet* in the =addedModels= instance property
										- see also the =addModel= instance method, and the `models instance property`
							*/
						}
					}
				),

				// NOTE: childObjectBindings *must* happen before declaratieveChildObjects for performance reasons.
				// This allows the omegastructor of childObjectBindings to happen before declarativeChildObjects,
				// which allows us to set the children state property on each of the child objects in mChildObjectBindings
				// *before* they are created by mDeclarativeChildObjects. This will allow for the created children to
				// be constructed w/ initially bound data saving change events.

				childObjectBindings:{
					declaration:'modelBindings',
					instanceProperty:_modelsInstanceProperty,
					addedInstanceProperty:_addedModelsInstanceProperty,
					stateProperty:_modelsStateProperty
				},

				declarativeChildObjects:{
					declaration:'models',
					addMethod:'addModel',
					childObjectClassKey:'modelClass'
				},

				childObjectEventBindings:{
					declaration:'modelEventBindings',
					instanceProperty:_modelsInstanceProperty,
					addedInstanceProperty:_addedModelsInstanceProperty
				}
			});
		};
	}
});
