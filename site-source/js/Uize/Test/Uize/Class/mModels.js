/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Class.mModels Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Class.mModels= module defines a suite of unit tests for the =Uize.Class.mModels= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Class.mModels',
	superclass:'Uize.Test.Class',
	required:[
		'Uize.Array.Util',
		'Uize.Class',
		'Uize.Test.Class.mSpy'
	],
	builder:function (_superclass) {
		'use strict';

		var
			_true = true,
			_false = false,
			_undefined,

			_Uize = Uize,
			_Uize_Class = _Uize.Class,

			_createClass = function() {
				return _Uize_Class.subclass({
					mixins:_class.getModule()
				});
			},
			_createInstance = function(_properties) {
				return _createClass()(_properties);
			},

			_class = _superclass.subclass({
				mixins:_Uize.Test.Class.mSpy,
				moduleToTest:'Uize.Class.mModels'
			})
		;

		return _class.declare({
			set:{
				test:[
					_class.requiredModulesTest(),

					_class.instanceMethodsTest([
						{
							methodName:'addModel',
							cases:_Uize.Array.Util.flatten(
								_Uize.map(
									[
										{
											_title:'When model is added with model class, model is created, added and returned',
											_params:['model', _Uize_Class]
										},
										{
											_title:'When model is added with model class with properties, model is created, added and returned',
											_params:['model', _Uize_Class, {prop1:'prop1', prop2:'prop2', prop3:'prop3'}]
										},
										{
											_title:'When model is added with model class without a model name, but with properties that specify name, model is created, added and returned',
											_params:[_undefined, _Uize_Class, {name:'model', prop1:'prop1', prop2:'prop2', prop3:'prop3'}]
										},
										{
											_title:'When model is added with model instance, model is added and returned',
											_params:['model', new _Uize_Class()]
										},
										{
											_title:'When model is added with model instance with additional override properties, model is added and returned',
											_params:['model', new _Uize_Class(), {prop1:'prop1', prop2:'prop2', prop3:'prop3'}]
										},
										{
											_title:'When model is added with model instance without a model name, but with additional override properties that specify name, model is added and returned',
											_params:[_undefined, new _Uize_Class(), {name:'model', prop1:'prop1', prop2:'prop2', prop3:'prop3'}]
										},
										{
											_title:'When model is added with model class with unapplied data, model is created, added and returned',
											_existingModels:{
												model:{prop1:'value1', prop2:'value2'}
											},
											_params:['model', _Uize_Class]
										},
										{
											_title:'When model is added with model class with properties as well as unapplied data, model is created, added and returned',
											_existingModels:{
												model:{prop4:'value4', prop5:'value5'}
											},
											_params:['model', _Uize_Class, {prop1:'prop1', prop2:'prop2', prop3:'prop3'}]
										},
										{
											_title:'When model is added with model class with properties as well as unapplied data (unapplied overrides), model is created, added and returned',
											_existingModels:{
												model:{prop1:'value1', prop2:'value2'}
											},
											_params:['model', _Uize_Class, {prop1:'prop1', prop2:'prop2', prop3:'prop3'}]
										}
									],
									function(_case) {
										var
											_caseTitle = _case._title,
											_caseParams = _case._params,
											_modelClass = _Uize.isInstance(_caseParams[1]) ? _caseParams[1].Class : _caseParams[1],
											_modelProperties = _caseParams[2] || {},
											_modelName = _caseParams[0] || _modelProperties.name,
											_existingModelsData = _case._existingModels
										;
										return _Uize.map(
											[
												{
													_title:'not null',
													_expectFunc:function(_addedModel) { return this.expectNonNull(_addedModel) }
												},
												{
													_title:'Uize.Class instance',
													_expectFunc:function(_addedModel) { return this.expect(_modelClass, _addedModel.Class) }
												},
												{
													_title:'model is added to models instance property',
													_expectFunc:function(_addedModel) { return this.expect(_addedModel, this.get('instance').models[_modelName]) }
												},
												{
													_title:'model is initialized with properties',
													_expectFunc:function(_addedModel) {
														var _expectedModelProperties = _existingModelsData ? _Uize.copy(_modelProperties, _existingModelsData[_modelName]) : _modelProperties;
														return this.expect(
															_expectedModelProperties,
															_addedModel.get(_Uize.keys(_expectedModelProperties))
														);
													}
												},
												{
													_title:'addedModels is marked as met',
													_expectFunc:function() {
														return this.expect(
															_true,
															this.get('instance').addedModels.isMet(_modelName)
														);
													}
												}
											],
											function(_subCase) {
												return {
													title:_caseTitle + ' (' + _subCase._title + ')',
													instanceProperties:{
														models:_existingModelsData
													},
													params:_caseParams,
													expectFunc:_subCase._expectFunc
												};
											}
										);
									}
								).concat(
									[
										(function() {
											var _existingModel = new _Uize_Class();
											return {
												title:'When model already exists and model to add is the same model, no-op (existing model is not removed)',
												initialize:function(_instance) {
													this._spyObject = this.spyOn(_instance, 'removeModel');
													_instance.addModel('model', _existingModel);
												},
												params:['model', _existingModel],
												expectFunc:function() {
													var m = this;

													return m.expectToNotHaveBeenCalled(m._spyObject);
												}
											};
										})(),
										{
											title:'When model already exists and new model is added by Class, old model is removed',
											initialize:function(_instance) {
												var m = this;
												m._spyObject = this.spyOn(_instance, 'removeModel');
												m._existingModel = _instance.addModel('model', _Uize_Class);
											},
											params:['model', _Uize_Class],
											expectFunc:function() {
												var m = this;

												return m.expectToHaveBeenCalledWith(m._spyObject, [m._existingModel]);
											}
										},
										{
											title:'When model already exists and new model is added by instance, old model is removed',
											initialize:function(_instance) {
												var m = this;
												m._spyObject = this.spyOn(_instance, 'removeModel');
												m._existingModel = _instance.addModel('model',  _Uize_Class);
											},
											params:['model', new _Uize_Class()],
											expectFunc:function() {
												var m = this;

												return m.expectToHaveBeenCalledWith(m._spyObject, [m._existingModel]);
											}
										},
										{
											title:'When model already exists and new model is added by Class, addModel returns new model',
											initialize:function(_instance) {
												var m = this;
												m._spyObject = this.spyOn(_instance, 'removeModel');
												m._existingModel = _instance.addModel('model', _Uize_Class);
											},
											params:['model', _Uize_Class],
											expectFunc:function(_addedModel) {
												var m = this;

												return m.expectNotSameAs(_addedModel, m._existingModel);
											}
										},
										(function() {
											var _newModel = new _Uize_Class();
											return {
												title:'When model already exists and new model is added by instance, old model is removed',
												initialize:function(_instance) {
													var m = this;
													m._spyObject = this.spyOn(_instance, 'removeModel');
													m._existingModel = _instance.addModel('model',  _Uize_Class);
												},
												params:['model', _newModel],
												expectFunc:function(_addedModel) {
													var m = this;

													return m.expect(_addedModel, _newModel);
												}
											};
										})(),
										{
											title:'When model already exists and new model is added by Class, models proprety is correct',
											initialize:function(_instance) {
												var m = this;
												m._spyObject = this.spyOn(_instance, 'removeModel');
												m._existingModel = _instance.addModel('model', _Uize_Class);
											},
											params:['model', _Uize_Class],
											expectFunc:function(_addedModel) {
												var m = this;

												return m.expect(_addedModel, m.get('instance').models.model);
											}
										},
										{
											title:'When model already exists and new model is added by instance, models proprety is correct',
											initialize:function(_instance) {
												var m = this;
												m._spyObject = this.spyOn(_instance, 'removeModel');
												m._existingModel = _instance.addModel('model',  _Uize_Class);
											},
											params:['model', new _Uize_Class()],
											expectFunc:function(_addedModel) {
												var m = this;

												return m.expect(_addedModel, m.get('instance').models.model);
											}
										}
									]
								)
							),
							create:_createInstance
						},
						{
							methodName:'removeModel',
							cases:(function() {
								var _existingModel = new _Uize_Class();
								return _Uize.Array.Util.flatten(
									_Uize.map(
										[
											{
												_title:'When model is removed by name',
												_param:'model'
											},
											{
												_title:'When model is removed by instance reference',
												_param:_existingModel
											},
											{
												_title:'When specified model name is not an existing model',
												_param:'foo'
											}
										],
										function(_case) {
											var
												_caseTitle = _case._title,
												_caseParam = _case._param,
												_modelName = _Uize.isString(_caseParam) ? _caseParam : 'model'
											;
											return _Uize.map(
												[
													{
														_title:'models instance property no longer has reference',
														_expectFunc:function() { return this.expectNully(this.get('instance').models[_modelName]) }
													},
													{
														_title:'addedModels instance property is unmet',
														_expectFunc:function() { return this.expect(_false, !!this.get('instance').addedModels.isMet(_modelName)) }
													}
												],
												function(_subCase) {
													return {
														title:_caseTitle + ', ' + _subCase._title,
														initialize:function(_instance) {
															_instance.addModel('model', _existingModel);
														},
														params:[_caseParam],
														expectFunc:_subCase._expectFunc
													};
												}
											);
										}
									)
								);
							}) (),
							create:_createInstance
						}
					]),

					_class.propertyConformersTest([
						{
							propertyName:'models',
							cases:_Uize.Array.Util.flatten(
								_Uize.map(
									[
										{
											_title:'When there are no existing models and single model data specified',
											_modelsData:{
												model:{
													prop1:'value1',
													prop2:'value2',
													prop3:'value3'
												}
											}
										},
										{
											_title:'When there are no existing models and multiple models data specified',
											_modelsData:{
												model:{
													prop1:'value1',
													prop2:'value2',
													prop3:'value3'
												},
												model2:{
													prop4:'value4',
													prop5:'value5',
													prop6:'value6'
												}
											}
										},
										{
											_title:'When there is one existing model and multiple models data specified',
											_models:[
												['model2', _Uize_Class]
											],
											_modelsData:{
												model:{
													prop1:'value1',
													prop2:'value2',
													prop3:'value3'
												},
												model2:{
													prop4:'value4',
													prop5:'value5',
													prop6:'value6'
												}
											}
										},
										{
											_title:'When there are multiple existing models and multiple models data specified',
											_models:[
												['model2', _Uize_Class],
												['model3', _Uize_Class]
											],
											_modelsData:{
												model:{
													prop1:'value1',
													prop2:'value2',
													prop3:'value3'
												},
												model2:{
													prop4:'value4',
													prop5:'value5',
													prop6:'value6'
												},
												model3:{
													prop7:'value7',
													prop8:'value8',
													prop9:'value9'
												},
												model4:{
													prop10:'value10',
													prop11:'value11',
													prop12:'value12'
												}
											}
										},
										{
											_title:'When there are multiple existing models and multiple models data specified, but not all have data specified',
											_models:[
												['model2', _Uize_Class],
												['model3', _Uize_Class]
											],
											_modelsData:{
												model:{
													prop1:'value1',
													prop2:'value2',
													prop3:'value3'
												},
												model2:{
													prop4:'value4',
													prop5:'value5',
													prop6:'value6'
												},
												model4:{
													prop10:'value10',
													prop11:'value11',
													prop12:'value12'
												}
											}
										},
										{
											_title:'When there are multiple existing models and all have data specified',
											_models:[
												['model2', _Uize_Class],
												['model3', _Uize_Class],
												['model1', _Uize_Class],
												['model4', _Uize_Class]
											],
											_modelsData:{
												model:{
													prop1:'value1',
													prop2:'value2',
													prop3:'value3'
												},
												model2:{
													prop4:'value4',
													prop5:'value5',
													prop6:'value6'
												},
												model3:{
													prop7:'value7',
													prop8:'value8',
													prop9:'value9'
												},
												model4:{
													prop10:'value10',
													prop11:'value11',
													prop12:'value12'
												}
											}
										}
									],
									function(_case) {
										var
											_caseTitle = _case._title,
											_modelsData = _case._modelsData,
											_existingModels = _case._models
										;
										return _Uize.map(
											[
												{
													_title:'existing models have properties updated',
													_expectFunc:function() {
														var
															m = this,
															_instance = m.get('instance'),
															_propertiesUpdated = _true
														;

														_Uize.forEach(
															_modelsData,
															function(_modelData, _modelName) {
																var _model = _instance.models[_modelName];

																if (_model)
																	_propertiesUpdated = _propertiesUpdated
																		&& m.expect(_modelData, _model.get(_Uize.keys(_modelData)))
																;
															}
														);

														return m.expect(_true, _propertiesUpdated);
													}
												},
												{
													_title:'mModels_unappliedModelsProperties has leftover data',
													_expectFunc:function() {
														var _expectedUnappliedModelsProperties = _Uize.copy(_modelsData);

														_Uize.forEach(
															_existingModels,
															function(_existingModel) {
																delete _expectedUnappliedModelsProperties[_existingModel[0]];
															}
														);

														return this.expect(
															_expectedUnappliedModelsProperties,
															this.get('instance').mModels_unappliedModelsProperties
														);
													}
												}
											],
											function(_subCase) {
												return {
													title:_caseTitle + ', ' + _subCase._title,
													setup:function(_instance) {
														_Uize.forEach(
															_existingModels,
															function(_existingModel) { _instance.addModel.apply(_instance, _existingModel) }
														);
													},
													instanceProperties:{
														models:_modelsData
													},
													expectFunc:_subCase._expectFunc
												};
											}
										);
									}
								)
							).concat([
								(function() {
									var _modelInstanceToAdd = new _Uize_Class();
									return {
										title:'When instances are included, they are added',
										instanceProperties:{
											models:{
												model:_modelInstanceToAdd
											}
										},
										expectFunc:function() {
											return this.expectSameAs(
												_modelInstanceToAdd,
												this.get('instance').models.model
											);
										}
									};
								}) (),
								(function() {
									var
										_existingModel = new _Uize_Class(),
										_spyObject
									;
									return {
										title:'When instances are included but already exist, they are removed',
										setup:function(_instance) {
											_instance.addModel('model', _existingModel);
											_spyObject = this.spyOn(_instance, 'removeModel');
										},
										instanceProperties:{
											models:{
												model:new _Uize_Class()
											}
										},
										expectFunc:function() {
											return this.expectToHaveBeenCalledWith(_spyObject, [_existingModel]);
										}
									};
								}) (),
								(function() {
									var _modelInstanceToAdd = new _Uize_Class();
									return {
										title:'When instances are included but already exist, they are added',
										setup:function(_instance) {
											_instance.addModel('model', new _Uize_Class());
										},
										instanceProperties:{
											models:{
												model:_modelInstanceToAdd
											}
										},
										expectFunc:function() {
											return this.expectSameAs(
												_modelInstanceToAdd,
												this.get('instance').models.model
											);
										}
									};
								}) (),
								(function() {
									var
										_model = new _Uize_Class(),
										_spyObject
									;
									return {
										title:'When instances are included but already exist, they are *not* removed if it\'s the same instance',
										setup:function(_instance) {
											_instance.addModel('model', _model);
											_spyObject = this.spyOn(_instance, 'removeModel');
										},
										instanceProperties:{
											models:{
												model:_model
											}
										},
										expectFunc:function() {
											return this.expectToNotHaveBeenCalled(_spyObject);
										}
									};
								}) (),
								(function() {
									var
										_model = new _Uize_Class(),
										_spyObject
									;
									return {
										title:'When instances are included but already exist, models has correct reference',
										setup:function(_instance) {
											_instance.addModel('model', _model);
											_spyObject = this.spyOn(_instance, 'addModel');
										},
										instanceProperties:{
											models:{
												model:_model
											}
										},
										expectFunc:function() {
											return this.expectSameAs(
												_model,
												this.get('instance').models.model
											);
										}
									};
								}) ()
							]),
							create:_createInstance
						}
					])
				]
			}
		});
	}
});
